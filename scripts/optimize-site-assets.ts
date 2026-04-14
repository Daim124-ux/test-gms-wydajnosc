import sharp from 'sharp';
import fs from 'fs-extra';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { promisify } from 'util';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION || 'eu-north-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const OPT_DIR = path.join(PUBLIC_DIR, '_optimized');
const ASSETS_DIR = path.join(PUBLIC_DIR, 'assets');
const MANIFEST_PATH = path.join(OPT_DIR, 'manifest.json');
const BUCKET = process.env.AWS_S3_BUCKET!;
const CLOUDFRONT_URL = process.env.NEXT_PUBLIC_CLOUDFRONT_URL; // Optional

const IMAGE_WIDTHS = {
  small: 640,
  medium: 1280,
  large: 1920,
};

const SKIP_OPTIMIZATION_KEYWORDS = ['frames', 'scrubbing', 'keep', 'hero', 'raw'];

interface Manifest {
  images: Record<string, {
    blur: string;
    variants: Record<string, string[]>; // size -> formats
  }>;
  videos: Record<string, {
    variants: Record<string, string[]>; // variant -> formats
  }>;
}

let manifest: Manifest = { images: {}, videos: {} };

async function isNewer(src: string, dest: string): Promise<boolean> {
  if (!(await fs.pathExists(dest))) return true;
  const srcStat = await fs.stat(src);
  const destStat = await fs.stat(dest);
  return srcStat.mtime > destStat.mtime;
}

async function generateBlur(inputPath: string): Promise<string> {
  const buffer = await sharp(inputPath)
    .resize(20, 20, { fit: 'inside' })
    .blur()
    .toBuffer();
  return `data:image/jpeg;base64,${buffer.toString('base64')}`;
}

async function uploadToS3(filePath: string, s3Key: string, contentType: string) {
  const fileStream = fs.createReadStream(filePath);
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: BUCKET,
      Key: s3Key,
      Body: fileStream,
      ContentType: contentType,
      CacheControl: 'max-age=31536000, public',
    },
  });

  await upload.done();
  return CLOUDFRONT_URL 
    ? `${CLOUDFRONT_URL}/${s3Key}` 
    : `https://${BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${s3Key}`;
}

async function processImage(relativePath: string) {
  const srcPath = path.join(PUBLIC_DIR, relativePath);
  const ext = path.extname(relativePath);
  const baseName = relativePath.replace(ext, '');
  const targetDir = path.join(OPT_DIR, path.dirname(relativePath));
  
  await fs.ensureDir(targetDir);
  
  const variants: Record<string, string[]> = {};
  
  for (const [key, width] of Object.entries(IMAGE_WIDTHS)) {
    const formats = ['avif', 'webp'];
    variants[key] = [];
    
    for (const format of formats) {
      const destName = `${path.basename(baseName)}_${key}.${format}`;
      const destPath = path.join(targetDir, destName);

      if (await isNewer(srcPath, destPath)) {
        console.log(`[IMAGE] Processing ${key} ${format}: ${relativePath}`);
        let s = sharp(srcPath).resize(width, null, { withoutEnlargement: true });
        
        if (format === 'avif') await s.avif({ quality: 75 }).toFile(destPath);
        else await s.webp({ quality: 80 }).toFile(destPath);
      }
      
      const s3Key = `_optimized/${path.join(path.dirname(relativePath), destName)}`.replace(/\\/g, '/');
      const publicDestPath = await uploadToS3(destPath, s3Key, `image/${format}`);
      variants[key].push(publicDestPath);
    }
  }

  manifest.images[relativePath] = {
    blur: await generateBlur(srcPath),
    variants,
  };
}

async function processVideo(relativePath: string) {
  const srcPath = path.join(PUBLIC_DIR, relativePath);
  const ext = path.extname(relativePath);
  const baseName = relativePath.replace(ext, '');
  const targetDir = path.join(OPT_DIR, path.dirname(relativePath));
  
  await fs.ensureDir(targetDir);

  const shouldSkip = SKIP_OPTIMIZATION_KEYWORDS.some(kw => relativePath.toLowerCase().includes(kw));

  if (shouldSkip) {
    console.log(`[VIDEO] Skipping re-encoding for keyframe-perfect video: ${relativePath}`);
    const s3Key = `_optimized/${relativePath}`.replace(/\\/g, '/');
    const cloudPath = await uploadToS3(srcPath, s3Key, `video/${ext.slice(1)}`);
    manifest.videos[relativePath] = { variants: { mobile: [cloudPath], desktop: [cloudPath] } };
    return;
  }
  
  const variants: Record<string, string[]> = {
    mobile: [],
    desktop: []
  };

  const videoConfigs = [
    { key: 'mobile', scale: 'scale=-2:720', crf: 28, bitrate: '1M' },
    { key: 'desktop', scale: 'scale=-2:1080', crf: 22, bitrate: '4M' }
  ];

  for (const config of videoConfigs) {
    for (const format of ['webm', 'mp4']) {
      const destName = `${path.basename(baseName)}_${config.key}.${format}`;
      const destPath = path.join(targetDir, destName);

      if (await isNewer(srcPath, destPath)) {
        console.log(`[VIDEO] Encoding ${config.key} ${format}: ${relativePath}`);
        await new Promise((resolve, reject) => {
          let f = ffmpeg(srcPath).outputOptions(['-an']); // Remove audio for UI videos
          
          if (format === 'webm') {
            f.outputOptions(['-c:v', 'libvpx-vp9', '-crf', config.crf.toString(), '-b:v', '0', '-vf', config.scale]);
          } else {
            f.outputOptions(['-c:v', 'libx264', '-crf', config.crf.toString(), '-preset', 'slower', '-pix_fmt', 'yuv420p', '-vf', config.scale]);
          }
          
          f.save(destPath).on('end', resolve).on('error', reject);
        });
      }
      
      const s3Key = `_optimized/${path.join(path.dirname(relativePath), destName)}`.replace(/\\/g, '/');
      const publicDestPath = await uploadToS3(destPath, s3Key, `video/${format}`);
      variants[config.key].push(publicDestPath);
    }
  }

  manifest.videos[relativePath] = { variants };
}

async function walk(dir: string, relative: string = '') {
  const files = await fs.readdir(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const relPath = path.join(relative, file).replace(/\\/g, '/');
    const s = await fs.stat(fullPath);

    if (s.isDirectory()) {
      await walk(fullPath, relPath);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        await processImage(relPath);
      } else if (['.mp4', '.mov'].includes(ext)) {
        await processVideo(relPath);
      }
    }
  }
}

async function main() {
  console.log('🚀 Starting Advanced Site Optimization...');
  await fs.ensureDir(OPT_DIR);
  
  if (await fs.pathExists(MANIFEST_PATH)) {
    manifest = await fs.readJson(MANIFEST_PATH);
  }

  await walk(ASSETS_DIR, 'assets');
  
  await fs.writeJson(MANIFEST_PATH, manifest, { spaces: 2 });
  console.log('✅ Done! Manifest updated at public/_optimized/manifest.json');
}

main().catch(console.error);
