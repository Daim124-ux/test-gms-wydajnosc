import sharp from 'sharp';
import fs from 'fs-extra';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { promisify } from 'util';

const stat = promisify(fs.stat);

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const ASSETS_DIR = path.join(PUBLIC_DIR, 'assets');

interface Stats {
  originalSize: number;
  newSize: number;
  filesProcessed: number;
}

const stats: Stats = {
  originalSize: 0,
  newSize: 0,
  filesProcessed: 0,
};

async function getFileSize(filePath: string): Promise<number> {
  try {
    const s = await stat(filePath);
    return s.size;
  } catch {
    return 0;
  }
}

async function isNewer(src: string, dest: string): Promise<boolean> {
  if (!(await fs.pathExists(dest))) return true;
  const srcStat = await stat(src);
  const destStat = await stat(dest);
  return srcStat.mtime > destStat.mtime;
}

async function processImages(dir: string) {
  const files = await fs.readdir(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const s = await stat(fullPath);

    if (s.isDirectory()) {
      await processImages(fullPath);
      continue;
    }

    const ext = path.extname(file).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
      const baseName = path.join(dir, path.basename(file, ext));
      const avifPath = `${baseName}.avif`;
      const webpPath = `${baseName}.webp`;

      // Optimized Original (overwrite if newer)
      // Note: We don't overwrite the original format directly with Sharp easily while maintaining the same filename 
      // without extra steps, but we can re-save it.
      
      const originalSize = s.size;
      stats.originalSize += originalSize;

      if (await isNewer(fullPath, avifPath)) {
        console.log(`[IMAGE] Generating AVIF: ${file}`);
        await sharp(fullPath).avif({ quality: 80 }).toFile(avifPath);
        stats.filesProcessed++;
      }

      if (await isNewer(fullPath, webpPath)) {
        console.log(`[IMAGE] Generating WebP: ${file}`);
        await sharp(fullPath).webp({ quality: 80 }).toFile(webpPath);
        stats.filesProcessed++;
      }

      // Overwrite original with optimized version if it's the first time
      const tmpPath = `${fullPath}.tmp`;
      if (ext === '.png') {
        await sharp(fullPath).png({ quality: 80, compressionLevel: 9 }).toFile(tmpPath);
      } else {
        await sharp(fullPath).jpeg({ quality: 80, mozjpeg: true }).toFile(tmpPath);
      }
      
      const tmpSize = (await stat(tmpPath)).size;
      if (tmpSize < originalSize) {
        await fs.move(tmpPath, fullPath, { overwrite: true });
        stats.newSize += tmpSize;
      } else {
        await fs.remove(tmpPath);
        stats.newSize += originalSize;
      }
    }
  }
}

async function processVideos(dir: string) {
  if (!(await fs.pathExists(dir))) return;
  const files = await fs.readdir(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const s = await stat(fullPath);

    if (s.isDirectory()) {
      await processVideos(fullPath);
      continue;
    }

    const ext = path.extname(file).toLowerCase();
    if (ext === '.mp4' || ext === '.mov') {
      const baseName = path.join(dir, path.basename(file, ext));
      const webmPath = `${baseName}.webm`;
      
      stats.originalSize += s.size;

      if (await isNewer(fullPath, webmPath)) {
        console.log(`[VIDEO] Generating WebM: ${file}`);
        await new Promise((resolve, reject) => {
          ffmpeg(fullPath)
            .outputOptions([
              '-c:v', 'libvpx-vp9',
              '-crf', '30',
              '-b:v', '0',
              '-an'
            ])
            .save(webmPath)
            .on('end', resolve)
            .on('error', reject);
        });
        stats.filesProcessed++;
      }

      // Optimize original MP4 (re-encode to H.265 if possible, or just better H.264)
      const optMp4Path = `${baseName}_opt.mp4`;
      if (await isNewer(fullPath, optMp4Path)) {
        console.log(`[VIDEO] Optimizing original MP4: ${file}`);
        await new Promise((resolve, reject) => {
          ffmpeg(fullPath)
            .outputOptions([
              '-c:v', 'libx264',
              '-crf', '24',
              '-preset', 'slower',
              '-pix_fmt', 'yuv420p'
            ])
            .save(optMp4Path)
            .on('end', resolve)
            .on('error', reject);
        });
        
        const optSize = (await stat(optMp4Path)).size;
        if (optSize < s.size) {
          await fs.move(optMp4Path, fullPath, { overwrite: true });
          stats.newSize += optSize;
        } else {
          await fs.remove(optMp4Path);
          stats.newSize += s.size;
        }
      } else {
        stats.newSize += s.size;
      }
    }
  }
}

async function processGLTF(dir: string) {
  const files = await fs.readdir(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const s = await stat(fullPath);

    if (s.isDirectory()) {
      await processGLTF(fullPath);
      continue;
    }

    if (path.extname(file).toLowerCase() === '.gltf') {
      console.log(`[GLTF] Processing: ${file}`);
      const data = await fs.readJson(fullPath);
      let changed = false;

      if (data.images) {
        for (const img of data.images) {
          if (img.uri && (img.uri.endsWith('.jpg') || img.uri.endsWith('.png') || img.uri.endsWith('.jpeg'))) {
            const ext = path.extname(img.uri);
            const avifUri = img.uri.replace(ext, '.avif');
            const absoluteAvifPath = path.join(dir, avifUri);
            
            if (await fs.pathExists(absoluteAvifPath)) {
              console.log(`  -> Mapping ${img.uri} to ${avifUri}`);
              img.uri = avifUri;
              changed = true;
            }
          }
        }
      }

      if (changed) {
        await fs.writeJson(fullPath, data, { spaces: 2 });
        stats.filesProcessed++;
      }
    }
  }
}

async function main() {
  console.log('🚀 Starting asset optimization...');
  
  await processImages(PUBLIC_DIR);
  await processVideos(ASSETS_DIR);
  await processGLTF(PUBLIC_DIR);

  const saved = stats.originalSize - stats.newSize;
  const percent = ((saved / stats.originalSize) * 100).toFixed(1);
  
  console.log('\n✅ Optimization complete!');
  console.log(`-----------------------------------`);
  console.log(`Files Processed: ${stats.filesProcessed}`);
  console.log(`Original Size:   ${(stats.originalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`New Size:        ${(stats.newSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Saved Space:     ${(saved / 1024 / 1024).toFixed(2)} MB (${percent}%)`);
  console.log(`-----------------------------------`);
}

main().catch(err => {
  console.error('❌ Error during optimization:', err);
  process.exit(1);
});
