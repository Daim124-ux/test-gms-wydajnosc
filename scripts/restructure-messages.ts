import fs from 'fs-extra';
import path from 'path';

const messagesDir = path.join(process.cwd(), 'messages');

async function main() {
  const langs = await fs.readdir(messagesDir);
  
  for (const lang of langs) {
    const langDir = path.join(messagesDir, lang);
    const stat = await fs.stat(langDir);
    if (!stat.isDirectory()) continue;

    console.log(`Processing ${lang}...`);

    // Create folders
    const globalDir = path.join(langDir, 'global');
    const pagesDir = path.join(langDir, 'pages');
    const systemDomDir = path.join(pagesDir, 'system-dom');
    
    await fs.ensureDir(globalDir);
    await fs.ensureDir(systemDomDir);

    // 1. Move global files
    const globals = ['chat.json', 'common.json', 'footer.json', 'navigation.json'];
    for (const g of globals) {
      if (await fs.pathExists(path.join(langDir, g))) {
        await fs.move(path.join(langDir, g), path.join(globalDir, g));
      }
    }

    // 2. Merge wiata-rowerowa files
    const wiataKeys = [
      'hero', 'productHero', 'productLayout', 'features', 
      'configuratorPromo', 'lifestyle', 'lifestyleShowcase', 
      'threeDShowcase', 'thresholdGrid'
    ];
    const wiataContent: any = {};
    for (const w of wiataKeys) {
      const p = path.join(langDir, `${w}.json`);
      if (await fs.pathExists(p)) {
        wiataContent[w] = await fs.readJson(p);
        await fs.remove(p);
      }
    }
    if (Object.keys(wiataContent).length > 0) {
      await fs.writeJson(path.join(systemDomDir, 'wiata-rowerowa.json'), wiataContent, { spaces: 2 });
    }

    // 3. Move garaze-stalowe
    if (await fs.pathExists(path.join(langDir, 'garageLayout.json'))) {
      const gl = await fs.readJson(path.join(langDir, 'garageLayout.json'));
      await fs.writeJson(path.join(systemDomDir, 'garaze-stalowe.json'), { garageLayout: gl }, { spaces: 2 });
      await fs.remove(path.join(langDir, 'garageLayout.json'));
    }
  }

  console.log('Done restructuring!');
}

main().catch(console.error);
