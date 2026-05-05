import React, { useState } from 'react';
import { Youtube, Zap, ArrowRight } from 'lucide-react';
import api from '../api.js';

export default function Hero({ onJobStart }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isValidYouTubeUrl = (url) => {
    return url.includes('youtube.com/watch') || url.includes('youtu.be/');
  };

  const handleSubmit = async () => {
    // Clean doubled scheme e.g. httpshttps://
    const cleanUrl = url.replace(/^(https?:\/\/)+/, 'https://').trim();

    if (!isValidYouTubeUrl(cleanUrl)) {
      setError('Please enter a valid YouTube URL');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/api/process', { youtubeUrl: cleanUrl });
      onJobStart(data.jobId);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to start processing');
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-10 relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #D85A30 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      {/* Glow orb */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-forge-accent/10 rounded-full blur-3xl pointer-events-none" />

      {/* Badge */}
      {/* <div className="animate-fade-in flex items-center gap-2 bg-forge-surface border border-forge-border rounded-full px-4 py-2 mb-8">
        <Zap size={12} className="text-forge-accent" />
        <span className="font-mono text-xs text-forge-sub">Powered by Gemini AI + AssemblyAI</span>
      </div> */}

      {/* Title */}
      <h1 className="animate-slide-up font-display text-7xl md:text-9xl text-center leading-none tracking-wider mb-6">
        FORGE YOUR
        <br />
        <span className="text-forge-accent">VIRAL CLIPS</span>
      </h1>

      <p className="animate-slide-up text-forge-sub text-lg text-center max-w-xl mb-12 font-body leading-relaxed"
        style={{ animationDelay: '0.1s' }}>
        Paste any YouTube URL. ReelSmith finds the best moments, cuts the clips, and writes your blog post — automatically.
      </p>

      {/* URL Input */}
      <div className="animate-slide-up w-full max-w-2xl" style={{ animationDelay: '0.2s' }}>
        <div className={`flex items-center gap-3 bg-forge-surface border rounded-xl px-5 py-4 transition-all duration-200 ${error ? 'border-red-500/50' : 'border-forge-border focus-within:border-forge-muted focus-within:glow-accent'}`}>
          <Youtube size={20} className="text-forge-accent shrink-0" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKey}
            placeholder="https://youtube.com/watch?v=..."
            className="flex-1 bg-transparent text-forge-text font-mono text-sm placeholder:text-forge-muted outline-none"
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !url}
            className="btn-primary flex items-center gap-2 shrink-0"
          >
            {loading ? (
              <span className="animate-pulse font-mono text-sm">Starting...</span>
            ) : (
              <>
                <span>Forge It</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
        {error && <p className="text-red-400 text-sm mt-2 font-mono">{error}</p>}
      </div>

      {/* Stats row */}
      <div className="animate-slide-up flex items-center gap-8 mt-14 text-center" style={{ animationDelay: '0.3s' }}>
        {[
          { val: '3–5', label: 'Viral clips' },
          { val: '~3min', label: 'Processing time' },
          { val: '1', label: 'Blog post' },
        ].map(({ val, label }) => (
          <div key={label}>
            <div className="font-display text-3xl text-forge-accent">{val}</div>
            <div className="font-body text-xs text-forge-sub mt-1">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
