# ReelSmith 🔨

> Turn any YouTube video into viral clips + a blog post — automatically.

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **AI**: GEMINI API (viral moment detection + blog writing)
- **Transcription**: AssemblyAI
- **Video processing**: yt-dlp + ffmpeg

## Prerequisites

Make sure these are installed on your system:

```bash
# yt-dlp
pip install yt-dlp

# ffmpeg (macOS)
brew install ffmpeg


```

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/reelsmith.git
cd reelsmith
```

### 2. Setup the server

```bash
cd server
npm install
cp .env.example .env
# Edit .env and add your API keys
```

### 3. Setup the client

```bash
cd ../client
npm install
```

### 4. Add API Keys

Edit `server/.env`:

```
GEMINI_API_KEY=your_key_here
ASSEMBLYAI_API_KEY=your_key_here
```

Get your keys:
- Gemini (free): https://aistudio.google.com
- AssemblyAI (free): https://www.assemblyai.com

## Run

Open two terminals:

```bash
# Terminal 1 - Server
cd server
npm run dev

# Terminal 2 - Client
cd client
npm run dev
```

Open http://localhost:5173

## How it works

1. Paste a YouTube URL
2. **yt-dlp** downloads the video
3. **ffmpeg** extracts the audio
4. **AssemblyAI** transcribes it with timestamps
5. **GEMINI AI** identifies the 3–5 most viral moments
6. **ffmpeg** cuts the clips
7. **GEMINI AI** writes a full blog post from the transcript
8. You get clips + blog post ready to publish

## Project Structure

```

reelsmith/
├── server/
│   ├── index.js              # Express app
│   ├── routes/
│   │   ├── process.js        # Main pipeline route
│   │   └── status.js         # Job polling route
│   └── utils/
│       ├── videoUtils.js     # yt-dlp + ffmpeg helpers
│       ├── transcribe.js     # AssemblyAI integration
│       ├── Gemini.js         # Gemini API integration
│       └── jobStore.js       # In-memory job tracker
└── client/
    └── src/
        ├── App.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Hero.jsx
        │   ├── Processing.jsx
        │   ├── ClipCard.jsx
        │   └── BlogPost.jsx
        ├── pages/
        │   └── Results.jsx
        └── hooks/
            └── useJobPoller.js
```
