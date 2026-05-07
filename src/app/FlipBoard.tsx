'use client';

import { useState, useEffect } from 'react';

export interface FlipTile {
  icon: string;
  label: string;
  text: string;
  color: string;   // bg color class
}

interface Props {
  tiles: FlipTile[];
  interval?: number;  // ms per flip
}

export default function FlipBoard({ tiles, interval = 4000 }: Props) {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (tiles.length <= 1) return;
    const timer = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setIndex(prev => (prev + 1) % tiles.length);
        setAnimating(false);
      }, 400); // match animation duration
    }, interval);
    return () => clearInterval(timer);
  }, [tiles.length, interval]);

  if (tiles.length === 0) return null;

  const tile = tiles[index];

  return (
    <div className="relative h-10 overflow-hidden bg-gray-900 text-white">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)' }} />

      {/* Flip container */}
      <div className="relative h-full flex items-center px-3">
        <div className={`flex items-center gap-2 w-full transition-all duration-400 ${animating ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
          <span className="text-lg">{tile.icon}</span>
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${tile.color}`}>{tile.label}</span>
          <span className="text-xs text-gray-300 truncate flex-1">{tile.text}</span>
        </div>

        {/* Next tile sliding in */}
        {animating && tiles.length > 1 && (
          <div className="absolute inset-0 flex items-center px-3 animate-slide-up">
            <span className="text-lg">{tiles[(index + 1) % tiles.length].icon}</span>
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ml-2 ${tiles[(index + 1) % tiles.length].color}`}>
              {tiles[(index + 1) % tiles.length].label}
            </span>
            <span className="text-xs text-gray-300 truncate flex-1 ml-2">
              {tiles[(index + 1) % tiles.length].text}
            </span>
          </div>
        )}
      </div>

      {/* Dots indicator */}
      {tiles.length > 1 && (
        <div className="absolute bottom-1 right-2 flex gap-1">
          {tiles.map((_, i) => (
            <div key={i} className={`w-1 h-1 rounded-full transition-colors ${i === index ? 'bg-white' : 'bg-gray-600'}`} />
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Bottom scrolling ticker
// ═══════════════════════════════════════════════════════
export function InfoTicker({ lines }: { lines: string[] }) {
  if (lines.length === 0) return null;

  return (
    <div className="bg-gray-800 border-t border-gray-700 overflow-hidden h-6">
      <div className="flex animate-scroll whitespace-nowrap py-0.5 gap-10">
        {[...lines, ...lines].map((text, i) => (
          <span key={i} className="text-xs text-gray-400 flex-shrink-0">{text}</span>
        ))}
      </div>
    </div>
  );
}
