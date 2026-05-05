import React from 'react';
import { Hammer } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 border-b border-forge-border bg-forge-bg/80 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-forge-accent rounded-lg flex items-center justify-center">
          <Hammer size={16} className="text-white" />
        </div>
        <span className="font-display text-2xl tracking-wider text-forge-text">
          REEL<span className="text-forge-accent">SMITH</span>
        </span>
      </div>

      {/* <div className="flex items-center gap-6">
        <span className="text-forge-sub text-sm font-body">How it works</span>
        <span className="text-forge-sub text-sm font-body">Examples</span>
        <div className="flex items-center gap-2 bg-forge-surface border border-forge-border rounded-lg px-3 py-1.5">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-slow" />
          <span className="text-xs font-mono text-forge-sub">AI Ready</span>
        </div>
      </div> */}
    </nav>
  );
}
