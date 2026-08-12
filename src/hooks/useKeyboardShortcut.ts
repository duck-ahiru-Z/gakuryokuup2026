import { useEffect, useState, useCallback } from 'react';

export function useKeyboardShortcut(isActive: boolean) {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isActive) return;
    
    // Prevent browser default actions during active gameplay
    // This blocks Ctrl+S, Ctrl+F, Ctrl+P, etc. (Note: Ctrl+N/Ctrl+T cannot be blocked by browsers)
    if (e.ctrlKey || e.metaKey || e.altKey || (e.key && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey)) {
      if (e.key !== 'F12' && e.key !== 'F5') { // Allow dev tools and refresh
        e.preventDefault();
      }
    }

    const key = e.key.length === 1 ? e.key.toUpperCase() : e.key;
    const newKeys = new Set<string>();
    
    if (e.ctrlKey || e.metaKey) newKeys.add('Ctrl');
    if (e.shiftKey) newKeys.add('Shift');
    if (e.altKey) newKeys.add('Alt');
    
    const isModifier = ['CONTROL', 'META', 'SHIFT', 'ALT'].includes(key.toUpperCase());
    if (!isModifier) {
      newKeys.add(key);
    }
    
    setPressedKeys(newKeys);
  }, [isActive]);

  const handleKeyUp = useCallback((_e: KeyboardEvent) => {
    if (!isActive) return;
    setPressedKeys(new Set()); // Reset all keys on any keyup for stricter play, or manage properly
    // To be more precise, we can remove just the lifted key, but resetting is often safer for combinations in games.
  }, [isActive]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp);
    
    // Also clear when window loses focus
    const handleBlur = () => setPressedKeys(new Set());
    window.addEventListener('blur', handleBlur);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [handleKeyDown, handleKeyUp]);

  const checkMatch = useCallback((targetKeys: string[]) => {
    if (pressedKeys.size !== targetKeys.length) return false;
    for (const key of targetKeys) {
      if (!pressedKeys.has(key)) return false;
    }
    return true;
  }, [pressedKeys]);

  return { pressedKeys, checkMatch, clearKeys: () => setPressedKeys(new Set()) };
}
