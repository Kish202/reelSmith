import React from 'react';
import { RotateCcw, Hammer } from 'lucide-react';
import ClipCard from '../components/ClipCard.jsx';
import BlogPost from '../components/BlogPost.jsx';

export default function Results({ job, onReset }) {
  return (
    <section className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Hammer size={20} className="text-forge-accent" />
              <span className="font-mono text-xs text-forge-accent uppercase tracking-widest">Forge Complete</span>
            </div>
            <h2 className="font-display text-6xl tracking-wider">
              YOUR <span className="text-forge-accent">REELS</span>
            </h2>
          </div>

          <button
            onClick={onReset}
            className="flex items-center gap-2 border border-forge-border text-forge-sub hover:text-forge-text hover:border-forge-muted rounded-lg px-4 py-2 text-sm font-body transition-all"
          >
            <RotateCcw size={14} />
            New video
          </button>
        </div>

        {/* Clips grid */}
        <div className="mb-4">
          <h3 className="font-mono text-xs text-forge-sub uppercase tracking-widest mb-5">
            {job.clips.length} Viral Clips
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {job.clips.map((clip, i) => (
              <ClipCard key={i} clip={clip} index={i} />
            ))}
          </div>
        </div>

        {/* Blog post */}
        {job.blogPost && (
          <div className="mt-12">
            <h3 className="font-mono text-xs text-forge-sub uppercase tracking-widest mb-5">
              Blog Post
            </h3>
            <BlogPost content={job.blogPost} />
          </div>
        )}
      </div>
    </section>
  );
}
