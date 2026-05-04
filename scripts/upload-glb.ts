import fs from 'fs';
import path from 'path';
import { S3Client } from '@aws-sdk/client-s3';
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

const BUCKET = process.env.AWS_S3_BUCKET!;

async function main() {
  const filePath = path.join(process.cwd(), 'public', 'assets', 'modele_ar', 'wiata_rowerowa', 'wiata_rowerowa_ar_v24.glb');
  const s3Key = 'assets/modele_ar/wiata_rowerowa/wiata_rowerowa_ar_v24.glb';

  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    process.exit(1);
  }

  console.log('Uploading GLB to S3...');
  const fileStream = fs.createReadStream(filePath);
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: BUCKET,
      Key: s3Key,
      Body: fileStream,
      ContentType: 'model/gltf-binary',
      CacheControl: 'max-age=31536000, public',
    },
  });

  await upload.done();
  console.log('Upload complete!');
  const cloudFrontUrl = process.env.NEXT_PUBLIC_CLOUDFRONT_URL;
  console.log(`URL: ${cloudFrontUrl}/${s3Key}`);
}

main().catch(console.error);
