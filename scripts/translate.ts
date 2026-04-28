import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs-extra";
import path from "path";
import dotenv from "dotenv";

// Ładowanie konfiguracji z .env.local
dotenv.config({ path: ".env.local" });

const API_KEY = process.env.GEMINI_API_KEY;
const SRC_LANG = "pl";
const TARGET_LANGS = ['en', 'de', 'fr', 'ua', 'sk', 'cs', 'hu', 'da', 'it', 'nl', 'no', 'sv'];
const MESSAGES_DIR = path.join(process.cwd(), "messages");

if (!API_KEY) {
  console.error("❌ Błąd: Brak GEMINI_API_KEY w pliku .env.local");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemma-4-31b-it",
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

  console.log(`🌐 [${targetLang}] Tłumaczenie ${keysCount} nowych kluczy (podzielone na części)...`);

  const chunks: Record<string, string>[] = [];
  const entries = Object.entries(missingKeys);
  const CHUNK_SIZE = 30;

  for (let i = 0; i < entries.length; i += CHUNK_SIZE) {
    chunks.push(Object.fromEntries(entries.slice(i, i + CHUNK_SIZE)));
  }

  const allTranslatedKeys: Record<string, string> = {};

  for (let i = 0; i < chunks.length; i++) {
    console.log(`   ➔ Część ${i + 1}/${chunks.length}...`);
    const prompt = `Task: Translate the following JSON values from Polish to ${targetLang}.
Rules:
1. Maintain the exact same keys.
2. Do not translate parameters in curly braces (e.g., {name}).
3. Do not translate the word 'Rouleur'. Keep it exactly as 'Rouleur' in all languages.
4. Return ONLY valid JSON. No explanations, no markdown blocks.
5. If there are technical terms, use the industry standard in ${targetLang}.

JSON to translate:
${JSON.stringify(chunks[i], null, 2)}`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      const codeBlockMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      const simpleJsonMatch = text.match(/(\{[\s\S]*\})/);
      
      if (codeBlockMatch) {
        text = codeBlockMatch[1];
      } else if (simpleJsonMatch) {
        text = simpleJsonMatch[1];
      }
      
      const translatedChunk = JSON.parse(text);
      Object.assign(allTranslatedKeys, translatedChunk);
      
      // Delay between chunks
      if (chunks.length > 1) await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      console.error(`   ❌ Błąd w części ${i + 1}:`, err);
    }
  }

  // 4. Budujemy nowy obiekt docelowy na podstawie struktury źródłowej
  const newTargetContent = {};
  for (const [key, sourceValue] of Object.entries(flatSrc)) {
    const value = allTranslatedKeys[key] || flatTarget[key] || sourceValue;
    setNestedValue(newTargetContent, key, value);
  }

  await fs.writeJson(targetPath, newTargetContent, { spaces: 2 });
  console.log(`✨ [${targetLang}] Tłumaczenie i synchronizacja zakończone sukcesem.`);
}

async function main() {
  console.log("🚀 Start automatycznego tłumaczenia...");

  const argLang = process.argv[2];
  const languagesToTranslate = argLang ? [argLang] : TARGET_LANGS;

  if (argLang && !TARGET_LANGS.includes(argLang)) {
    console.error(`❌ Błąd: Język "${argLang}" nie jest obsługiwany. Dostępne: ${TARGET_LANGS.join(', ')}`);
    process.exit(1);
  }

  if (!(await fs.pathExists(MESSAGES_DIR))) {
    await fs.ensureDir(MESSAGES_DIR);
  }

  for (const lang of languagesToTranslate) {
    await translate(lang);
    // Krótkie opóźnienie, aby uniknąć limitów API
    if (languagesToTranslate.length > 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log("🏁 Proces zakończony.");
}

main();
