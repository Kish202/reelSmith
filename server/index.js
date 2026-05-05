import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import processRoute from './routes/process.js';
import statusRoute from './routes/status.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Serve output clips statically
app.use('/outputs', express.static(path.join(__dirname, 'outputs')));

// Routes
app.use('/api/process', processRoute);
app.use('/api/status', statusRoute);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ReelSmith is running 🔥' });
});

app.listen(PORT, () => {
  console.log(`🔨 ReelSmith server running on http://localhost:${PORT}`);
});
