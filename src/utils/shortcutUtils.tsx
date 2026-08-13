import React from 'react';
import { OS } from '../hooks/useOS';
import type { ShortcutData } from '../types';

export const resolveKeys = (sc: ShortcutData, currentOS: OS): string[] => {
  if (currentOS === 'Mac' && sc.macKeys) return sc.macKeys;
  if (currentOS === 'ChromeOS' && sc.chromeKeys) return sc.chromeKeys;
  
  // Generic translation fallback
  return sc.keys.map(k => {
    if (currentOS === 'Mac') {
      if (k === 'Ctrl') return 'Cmd';
      if (k === 'Alt') return 'Option';
      if (k === 'Win') return 'Cmd';
    }
    if (currentOS === 'ChromeOS') {
      if (k === 'Win') return 'Search';
    }
    return k;
  });
};

export const parseRubyText = (text: string, furiganaEnabled: boolean) => {
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    parts.push(
      <ruby key={match.index}>
        {match[1]}
        {furiganaEnabled && <rt>{match[2]}</rt>}
      </ruby>
    );
    lastIndex = regex.lastIndex;
  }
  
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return <>{parts}</>;
};
