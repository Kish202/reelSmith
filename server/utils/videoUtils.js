import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { put, head } from '@vercel/blob';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
const BASE_DIR = isServerless ? '/tmp' : path.join(__dirname, '..');

const CACHE_DIR = path.join(BASE_DIR, 'cache');
fs.mkdirSync(CACHE_DIR, { recursive: true });

function getVideoId(url) {
  return crypto.createHash('md5').update(url).digest('hex');
}

export async function downloadYouTubeVideo(url, jobId) {
  const outputDir = path.join(BASE_DIR, 'outputs', jobId);
  fs.mkdirSync(outputDir, { recursive: true });

  const videoId = getVideoId(url);
  const finalPath = path.join(outputDir, 'source.mp4');

  if (isServerless) {
    // Vercel: check Blob cache
    try {
      const blobKey = `cache/${videoId}.mp4`;
      const existing = await head(blobKey, { token: process.env.BLOB_READ_WRITE_TOKEN });
      if (existing) {
        console.log(`Blob cache hit for ${url} — downloading from blob...`);
        const res = await fetch(existing.url);
        const buffer = await res.arrayBuffer();
        fs.writeFileSync(finalPath, Buffer.from(buffer));
        return finalPath;
      }
    } catch {
      // No cache entry — proceed to download
    }
  } else {
    // Local: check filesystem cache
    const cachedPath = path.join(CACHE_DIR, `${videoId}.mp4`);
    if (fs.existsSync(cachedPath)) {
      console.log(`Local cache hit for ${url} — copying...`);
      fs.copyFileSync(cachedPath, finalPath);
      return finalPath;
    }
  }

  console.log(`Cache miss for ${url} — downloading...`);
  const outputTemplate = path.join(outputDir, 'source.%(ext)s');
  const cmd = `yt-dlp -f "bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/best[height<=720][ext=mp4]/best[height<=720]/best" --merge-output-format mp4 -o '${outputTemplate}' '${url}'`;

  await execAsync(cmd, { timeout: 300000 });

  // Find whatever file yt-dlp actually created
  const files = fs.readdirSync(outputDir);
  const videoFile = files.find(f => f.startsWith('source.'));

  if (!videoFile) {
    throw new Error('Video download failed — file not found after yt-dlp');
  }

  // Rename to source.mp4 if needed
  const downloadedPath = path.join(outputDir, videoFile);
  if (downloadedPath !== finalPath) {
    fs.renameSync(downloadedPath, finalPath);
  }

  if (isServerless) {
    // Vercel: upload to Blob cache
    try {
      const blobKey = `cache/${videoId}.mp4`;
      const fileBuffer = fs.readFileSync(finalPath);
      await put(blobKey, fileBuffer, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      console.log(`Uploaded to Vercel Blob: ${blobKey}`);
    } catch (err) {
      console.warn('Blob upload failed (non-fatal):', err.message);
    }
  } else {
    // Local: save to filesystem cache
    const cachedPath = path.join(CACHE_DIR, `${videoId}.mp4`);
    fs.copyFileSync(finalPath, cachedPath);
    console.log(`Cached locally at ${cachedPath}`);
  }

  return finalPath;
}

export async function extractAudio(videoPath, jobId) {
  const outputDir = path.dirname(videoPath);
  const audioPath = path.join(outputDir, 'audio.mp3');

  const cmd = `ffmpeg -i '${videoPath}' -vn -acodec libmp3lame -q:a 2 '${audioPath}' -y`;
  await execAsync(cmd, { timeout: 120000 });

  return audioPath;
}

export async function cutClip(videoPath, startSec, endSec, outputPath) {
  const duration = endSec - startSec;
  const cmd = `ffmpeg -ss ${startSec} -i '${videoPath}' -t ${duration} -c:v libx264 -c:a aac -preset fast '${outputPath}' -y`;
  await execAsync(cmd, { timeout: 120000 });
  return outputPath;
}
