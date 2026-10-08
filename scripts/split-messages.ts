import fs from 'fs-extra';
import path from 'path';

const messagesDir = path.join(process.cwd(), 'messages');

async function main() {
  const files = await fs.readdir(messagesDir);
  const jsonFiles = files.filter(f => f.endsWith('.json'));

  for (const file of jsonFiles) {
    const lang = file.replace('.json', '');
    const langDir = path.join(messagesDir, lang);
    await fs.ensureDir(langDir);

    const filePath = path.join(messagesDir, file);
    const content = await fs.readJson(filePath);

    for (const key of Object.keys(content)) {
      const targetPath = path.join(langDir, `${key}.json`);
      await fs.writeJson(targetPath, content[key], { spaces: 2 });
    }

    // Delete the original file
    await fs.remove(filePath);
    console.log(`Split ${file} into ${lang}/`);
  }
}

main().catch(console.error);
