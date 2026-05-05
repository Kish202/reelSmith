import React, { useState } from 'react';
import { Play, Download, Zap, Clock } from 'lucide-react';

export default function ClipCard({ clip, index }) {
  const [playing, setPlaying] = useState(false);

  const formatDuration = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="clip-card animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
      {/* Video preview */}
      <div className="relative bg-black aspect-video">
        <video
          src={clip.url}
          className="w-full h-full object-cover"
          controls={playing}
          onClick={() => setPlaying(true)}
        />
        {!playing && (
          <div
            className="absolute inset-0 flex items-center justify-center cursor-pointer group"
            onClick={() => setPlaying(true)}
          >
            <div className="w-14 h-14 rounded-full bg-forge-accent/90 flex items-center justify-center group-hover:bg-forge-accent transition-all group-hover:scale-110">
              <Play size={22} className="text-white ml-1" fill="white" />
            </div>
          </div>
        )}

        {/* Viral score badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 backdrop-blur-sm border border-forge-border rounded-full px-2.5 py-1">
          <Zap size={10} className="text-forge-accent" />
          <span className="font-mono text-xs text-forge-accent font-medium">{clip.viralScore}%</span>
        </div>

        {/* Clip number */}
        <div className="absolute top-3 left-3 bg-forge-accent rounded-lg w-7 h-7 flex items-center justify-center">
          <span className="font-display text-sm text-white">{index + 1}</span>
        </div>
      </div>

      {/* Card info */}
      <div className="p-4">
        <h3 className="font-body font-medium text-forge-text mb-1 truncate">{clip.title}</h3>
        <p className="text-forge-sub text-xs font-body mb-3 line-clamp-2">{clip.hook}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-forge-muted">
            <Clock size={12} />
            <span className="font-mono text-xs">{formatDuration(clip.duration)}</span>
          </div>

          <a
            href={clip.url}
            download={clip.filename}
            className="flex items-center gap-1.5 text-forge-accent text-xs font-body font-medium hover:text-white transition-colors"
          >
            <Download size={13} />
            Download
          </a>
        </div>
      </div>
    </div>
  );
}
