import React from 'react';
import { Hammer } from 'lucide-react';

const STEPS = [
  'Downloading video...',
  'Extracting audio...',
  'Transcribing with AssemblyAI...',
  'Finding viral moments with Gemini AI...',
  'Cutting clips with ffmpeg...',
  'Generating blog post...',
  'Done!',
];

export default function Processing({ job }) {
  const progress = job?.progress || 0;
  const step = job?.step || 'Starting...';

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20">
      <div className="w-full max-w-lg text-center">

        {/* Animated hammer icon */}
        <div className="w-20 h-20 bg-forge-surface border border-forge-border rounded-2xl flex items-center justify-center mx-auto mb-8 animate-pulse-slow">
          <Hammer size={36} className="text-forge-accent" />
        </div>

        <h2 className="font-display text-5xl tracking-wider mb-3">
          FORGING<span className="text-forge-accent">...</span>
        </h2>
        <p className="text-forge-sub font-mono text-sm mb-10">{step}</p>

        {/* Progress bar */}
        <div className="w-full bg-forge-surface border border-forge-border rounded-full h-2 mb-3 overflow-hidden">
          <div
            className="h-full bg-forge-accent rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between font-mono text-xs text-forge-muted mb-10">
          <span>0%</span>
          <span className="text-forge-accent">{progress}%</span>
          <span>100%</span>
        </div>

        {/* Steps checklist */}
        <div className="bg-forge-surface border border-forge-border rounded-xl p-5 text-left space-y-3">
          {STEPS.slice(0, -1).map((s, i) => {
            const threshold = (i + 1) * (100 / (STEPS.length - 1));
            const done = progress >= threshold;
            const active = step === s;
            return (
              <div key={s} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${done ? 'bg-forge-accent border-forge-accent' : active ? 'border-forge-accent' : 'border-forge-muted'}`}>
                  {done && <span className="text-white text-xs">✓</span>}
                  {active && !done && <div className="w-2 h-2 rounded-full bg-forge-accent animate-pulse" />}
                </div>
                <span className={`font-mono text-xs transition-colors ${done ? 'text-forge-sub line-through' : active ? 'text-forge-text' : 'text-forge-muted'}`}>
                  {s}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
