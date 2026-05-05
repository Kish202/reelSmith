import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import { createJob, updateJob } from '../utils/jobStore.js';
import { downloadYouTubeVideo, extractAudio, cutClip } from '../utils/videoUtils.js';
import { transcribeAudio } from '../utils/transcribe.js';
import { findViralMoments, generateBlogPost } from '../utils/claude.js';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

router.post('/', async (req, res) => {
  const rawUrl = req.body.youtubeUrl;
  if (!rawUrl) {
    return res.status(400).json({ error: 'youtubeUrl is required' });
  }

  // Fix doubled scheme like "httpshttps://" or "https://https://"
  const youtubeUrl = rawUrl
    .replace(/^(https?:\/\/)+/, 'https://')
    .trim();

  const jobId = uuidv4();
  createJob(jobId);

  res.json({ jobId });

  // Run pipeline async
  runPipeline(jobId, youtubeUrl);
});

async function runPipeline(jobId, youtubeUrl) {
  try {
    // Step 1: Download
    updateJob(jobId, { status: 'processing', progress: 10, step: 'Downloading video...' });
    const videoPath = await downloadYouTubeVideo(youtubeUrl, jobId);

    // Step 2: Extract audio
    updateJob(jobId, { progress: 25, step: 'Extracting audio...' });
    const audioPath = await extractAudio(videoPath, jobId);

    // Step 3: Transcribe
    updateJob(jobId, { progress: 40, step: 'Transcribing with AssemblyAI...' });
    const { fullText, sentences } = await transcribeAudio(audioPath);

    // Step 4: Find viral moments
    updateJob(jobId, { progress: 60, step: 'Finding viral moments with Gemini AI...' });
    const moments = await findViralMoments(fullText, sentences);

    // Step 5: Cut clips
    updateJob(jobId, { progress: 75, step: 'Cutting clips with ffmpeg...' });
    const outputDir = path.join(__dirname, '..', 'outputs', jobId);
    const clips = [];

    for (let i = 0; i < moments.length; i++) {
      const m = moments[i];
      const clipFilename = `clip_${i + 1}.mp4`;
      const clipPath = path.join(outputDir, clipFilename);
      await cutClip(videoPath, m.start, m.end, clipPath);
      clips.push({
        ...m,
        filename: clipFilename,
        url: `/outputs/${jobId}/${clipFilename}`,
        duration: m.end - m.start,
      });
    }

    // Step 6: Generate blog post
    updateJob(jobId, { progress: 90, step: 'Generating blog post...' });
    const blogPost = await generateBlogPost(fullText);

    // Done
    updateJob(jobId, {
      status: 'done',
      progress: 100,
      step: 'Done!',
      clips,
      blogPost,
    });
  } catch (err) {
    console.error('Pipeline error:', err);
    updateJob(jobId, {
      status: 'error',
      step: 'Something went wrong',
      error: err.message,
    });
  }
}

export default router;
