import React, { useState } from 'react';
import { Copy, Check, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function BlogPost({ content }) {
  const [copied, setCopied] = useState(false);
  

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-forge-surface border border-forge-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-forge-border">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-forge-accent" />
          <span className="font-body font-medium text-forge-text text-sm">Generated Blog Post</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-xs font-mono text-forge-sub hover:text-forge-text transition-colors border border-forge-border rounded-lg px-3 py-1.5"
        >
          {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
          {copied ? 'Copied!' : 'Copy markdown'}
        </button>
      </div>

      {/* Content */}
      <div className="px-6 py-6 prose prose-invert prose-sm max-w-none
        prose-headings:font-body prose-headings:font-medium prose-headings:text-forge-text
        prose-p:text-forge-sub prose-p:leading-relaxed
        prose-strong:text-forge-text
        prose-li:text-forge-sub
        prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
        max-h-[600px] overflow-y-auto">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
