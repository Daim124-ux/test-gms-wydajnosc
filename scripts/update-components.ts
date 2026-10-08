import fs from 'fs-extra';
import path from 'path';

const SRC_DIR = path.join(process.cwd(), 'src');

const replacements = [
  // Global mapping
  { from: "'common'", to: "'global.common'" },
  { from: "'chat'", to: "'global.chat'" },
  { from: "'footer'", to: "'global.footer'" },
  { from: "'navigation", to: "'global.navigation" },

  // Wiata Rowerowa mapping
  { from: "'hero'", to: "'pages.system-dom.wiata-rowerowa.hero'" },
  { from: "'productHero'", to: "'pages.system-dom.wiata-rowerowa.productHero'" },
  { from: "'productLayout", to: "'pages.system-dom.wiata-rowerowa.productLayout" },
  { from: "'features'", to: "'pages.system-dom.wiata-rowerowa.features'" },
  { from: "'configuratorPromo'", to: "'pages.system-dom.wiata-rowerowa.configuratorPromo'" },
  { from: "'lifestyle'", to: "'pages.system-dom.wiata-rowerowa.lifestyle'" },
  { from: "'lifestyleShowcase'", to: "'pages.system-dom.wiata-rowerowa.lifestyleShowcase'" },
  { from: "'threeDShowcase'", to: "'pages.system-dom.wiata-rowerowa.threeDShowcase'" },
  { from: "'thresholdGrid'", to: "'pages.system-dom.wiata-rowerowa.thresholdGrid'" },

  // Garaze stalowe mapping
  { from: "'garageLayout", to: "'pages.system-dom.garaze-stalowe.garageLayout" }
];

async function walk(dir: string, callback: (file: string) => Promise<void>) {
  const list = await fs.readdir(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = await fs.stat(fullPath);
    if (stat.isDirectory()) {
      await walk(fullPath, callback);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      await callback(fullPath);
    }
  }
}

async function main() {
  await walk(SRC_DIR, async (file) => {
    let content = await fs.readFile(file, 'utf8');
    let changed = false;

    for (const { from, to } of replacements) {
      if (content.includes(from)) {
        content = content.replaceAll(from, to);
        changed = true;
      }
    }

    if (changed) {
      await fs.writeFile(file, content, 'utf8');
      console.log(`Updated ${file}`);
    }
  });
}

main().catch(console.error);
