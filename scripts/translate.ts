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
  model: "gemma-4-31b-it"
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

async function walkDir(dir: string): Promise<string[]> {
  const files = await fs.readdir(dir);
  const result: string[] = [];
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = await fs.stat(fullPath);
    if (stat.isDirectory()) {
      result.push(...(await walkDir(fullPath)));
    } else if (file.endsWith('.json')) {
      result.push(fullPath);
    }
  }
  return result;
}

async function translateFile(targetLang: string, relativePath: string) {
  const srcPath = path.join(MESSAGES_DIR, SRC_LANG, relativePath);
  const targetPath = path.join(MESSAGES_DIR, targetLang, relativePath);
  
  await fs.ensureDir(path.dirname(targetPath));

  const srcContent = await fs.readJson(srcPath);
  const flatSrc = getFlattenedKeys(srcContent);

  let targetContent = {};
  if (await fs.pathExists(targetPath)) {
    targetContent = await fs.readJson(targetPath);
  }
  const flatTarget = getFlattenedKeys(targetContent);

  const missingKeys: Record<string, string> = {};
  for (const [key, value] of Object.entries(flatSrc)) {
    const targetValue = flatTarget[key];
    if (!targetValue || (targetValue === value && value.trim() !== "")) {
      missingKeys[key] = value;
    }
  }

  const keysCount = Object.keys(missingKeys).length;
  if (keysCount === 0) {
    console.log(`✅ [${targetLang}] [${relativePath}] Brak nowych kluczy do tłumaczenia.`);
    return;
  }

  console.log(`🌐 [${targetLang}] [${relativePath}] Tłumaczenie ${keysCount} nowych kluczy (podzielone na części)...`);

  const chunks: Record<string, string>[] = [];
  const entries = Object.entries(missingKeys);
  const CHUNK_SIZE = 30;

  for (let i = 0; i < entries.length; i += CHUNK_SIZE) {
    chunks.push(Object.fromEntries(entries.slice(i, i + CHUNK_SIZE)));
  }

  const allTranslatedKeys: Record<string, string> = {};

  for (let i = 0; i < chunks.length; i++) {
    console.log(`   ➔ Część ${i + 1}/${chunks.length}...`);
    const glossary = require("../src/config/glossary.json");
    const prompt = `Translate this JSON from Polish to ${targetLang}. 
Keep keys exactly. Don't translate {param}.
DO NOT translate brand names: ${glossary.do_not_translate.join(', ')}.
Return ONLY JSON. No explanations.

JSON:
${JSON.stringify(chunks[i])}`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text().trim();
      
      const codeBlockMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      let jsonFound = codeBlockMatch ? codeBlockMatch[1] : null;

      if (!jsonFound) {
        const allBlocks = text.match(/\{[\s\S]*?\}/g) || [];
        const substantialBlocks = allBlocks
          .filter(b => b.includes('"') && b.length > 5)
          .sort((a, b) => b.length - a.length);
        
        if (substantialBlocks.length > 0) {
          jsonFound = substantialBlocks[0];
        }
      }

      if (jsonFound) {
        try {
          const translatedChunk = JSON.parse(jsonFound);
          Object.assign(allTranslatedKeys, translatedChunk);
        } catch (parseErr) {
          console.error(`   ❌ Błąd parsowania w części ${i + 1}. Wyciągnięto:`, jsonFound.slice(0, 100) + "...");
          throw parseErr;
        }
      } else {
        console.error(`   ❌ Nie znaleziono poprawnego JSON w odpowiedzi AI dla części ${i + 1}.`);
      }
      
      if (chunks.length > 1) await new Promise(r => setTimeout(r, 1500));
    } catch (err) {
      console.error(`   ❌ Błąd w części ${i + 1}:`, err);
    }
  }

  const newTargetContent = {};
  for (const [key, sourceValue] of Object.entries(flatSrc)) {
    const value = allTranslatedKeys[key] || flatTarget[key] || sourceValue;
    setNestedValue(newTargetContent, key, value);
  }

  await fs.writeJson(targetPath, newTargetContent, { spaces: 2 });
  console.log(`✨ [${targetLang}] [${relativePath}] Tłumaczenie i synchronizacja zakończone sukcesem.`);
}

async function translate(targetLang: string) {
  const srcDir = path.join(MESSAGES_DIR, SRC_LANG);
  if (!(await fs.pathExists(srcDir))) {
    console.error(`Katalog źródłowy nie istnieje: ${srcDir}`);
    return;
  }
  
  const allJsonFiles = await walkDir(srcDir);
  for (const fullPath of allJsonFiles) {
    const relativePath = path.relative(srcDir, fullPath);
    await translateFile(targetLang, relativePath);
  }
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
