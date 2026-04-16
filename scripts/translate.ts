import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs-extra";
import path from "path";
import dotenv from "dotenv";

// Ładowanie konfiguracji z .env.local
dotenv.config({ path: ".env.local" });

const API_KEY = process.env.GEMINI_API_KEY;
const SRC_LANG = "pl";
const TARGET_LANGS = ["en", "de", "fr"];
const MESSAGES_DIR = path.join(process.cwd(), "messages");

if (!API_KEY) {
  console.error("❌ Błąd: Brak GEMINI_API_KEY w pliku .env.local");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-flash-latest",
  generationConfig: { responseMimeType: "application/json" }
});

/**
 * Pobiera płaską listę kluczy zagnieżdżonego obiektu
 */
function getFlattenedKeys(obj: any, prefix = ""): Record<string, string> {
  let res: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && value !== null) {
      Object.assign(res, getFlattenedKeys(value, fullKey));
    } else {
      res[fullKey] = value as string;
    }
  }
  return res;
}

/**
 * Ustawia wartość w zagnieżdżonym obiekcie na podstawie płaskiego klucza
 */
function setNestedValue(obj: any, keyPath: string, value: any) {
  const keys = keyPath.split(".");
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key]) current[key] = {};
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
}

async function translate(targetLang: string) {
  const srcPath = path.join(MESSAGES_DIR, `${SRC_LANG}.json`);
  const targetPath = path.join(MESSAGES_DIR, `${targetLang}.json`);

  // 1. Odczytaj źródło
  const srcContent = await fs.readJson(srcPath);
  const flatSrc = getFlattenedKeys(srcContent);

  // 2. Odczytaj cel (jeśli istnieje)
  let targetContent = {};
  if (await fs.pathExists(targetPath)) {
    targetContent = await fs.readJson(targetPath);
  }
  const flatTarget = getFlattenedKeys(targetContent);

  // 3. Znajdź brakujące klucze
  const missingKeys: Record<string, string> = {};
  for (const [key, value] of Object.entries(flatSrc)) {
    if (!flatTarget[key]) {
      missingKeys[key] = value;
    }
  }

  const keysCount = Object.keys(missingKeys).length;
  if (keysCount === 0) {
    console.log(`✅ [${targetLang}] Brak nowych kluczy do tłumaczenia.`);
    return;
  }

  console.log(`🌐 [${targetLang}] Tłumaczenie ${keysCount} nowych kluczy...`);

  const prompt = `Jesteś profesjonalnym tłumaczem stron www. 
Przetłumacz poniższe wartości JSON na język ${targetLang}, zachowując strukturę kluczy i nie tłumacząc parametrów w nawiasach klamrowych (np. {name}). 
Zwróć tylko czysty kod JSON zawierający te same klucze co wejście.

JSON do przetłumaczenia:
${JSON.stringify(missingKeys, null, 2)}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parsowanie odpowiedzi (Gemini w trybie JSON mode zwraca czysty JSON)
    const translatedKeys = JSON.parse(text);

    // 4. Scalanie i zapis
    for (const [key, value] of Object.entries(translatedKeys)) {
      setNestedValue(targetContent, key, value);
    }

    await fs.writeJson(targetPath, targetContent, { spaces: 2 });
    console.log(`✨ [${targetLang}] Tłumaczenie zakończone sukcesem.`);
  } catch (error) {
    console.error(`❌ [${targetLang}] Błąd podczas tłumaczenia:`, error);
  }
}

async function main() {
  console.log("🚀 Start automatycznego tłumaczenia...");
  
  if (!(await fs.pathExists(MESSAGES_DIR))) {
    await fs.ensureDir(MESSAGES_DIR);
  }

  for (const lang of TARGET_LANGS) {
    await translate(lang);
    // Krótkie opóźnienie, aby uniknąć limitów API
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log("🏁 Proces zakończony.");
}

main();
