import { useCallback, useRef } from 'react';

// A simple Web Audio API synthesizer for game sounds
export function useAudio(sfxVolume?: number) {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getVolume = useCallback(() => {
    const storedVolume = typeof window !== 'undefined'
      ? Number(window.localStorage.getItem('shortcutAcademy.sfxVolume'))
      : NaN;
    const volume = sfxVolume ?? (Number.isFinite(storedVolume) ? storedVolume : 50);
    return Math.max(0, Math.min(100, volume)) / 100;
  }, [sfxVolume]);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playSound = useCallback((type: 'success' | 'error' | 'click' | 'clear') => {
    try {
      const ctx = initAudio();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      const now = ctx.currentTime;
      const volume = getVolume();

      switch (type) {
        case 'success':
          // A softer, more pleasant double chime (C5 -> G5)
          osc.type = 'triangle';
          
          // First note (C5)
          osc.frequency.setValueAtTime(523.25, now);
          // Jump to second note (G5) quickly
          osc.frequency.setValueAtTime(783.99, now + 0.1);
          
          // Envelope: Quick attack, slight dip, second attack, fade out
          gainNode.gain.setValueAtTime(0, now);
          gainNode.gain.linearRampToValueAtTime(0.4 * volume, now + 0.02); // hit C5
          gainNode.gain.exponentialRampToValueAtTime(Math.max(0.001, 0.1 * volume), now + 0.09); // fade C5
          gainNode.gain.linearRampToValueAtTime(0.4 * volume, now + 0.11); // hit G5
          gainNode.gain.exponentialRampToValueAtTime(Math.max(0.001, 0.01 * volume), now + 0.4); // fade out
          
          osc.start(now);
          osc.stop(now + 0.4);
          break;

        case 'error':
          // A dull "buzzer" (low pitch, rough sound)
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(150, now);
          
          gainNode.gain.setValueAtTime(0, now);
          gainNode.gain.linearRampToValueAtTime(0.2 * volume, now + 0.05);
          gainNode.gain.linearRampToValueAtTime(Math.max(0.001, 0.01 * volume), now + 0.3);
          
          osc.start(now);
          osc.stop(now + 0.3);
          break;

        case 'click':
          // A short, subtle "tick"
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(600, now);
          
          gainNode.gain.setValueAtTime(0, now);
          gainNode.gain.linearRampToValueAtTime(0.1 * volume, now + 0.02);
          gainNode.gain.exponentialRampToValueAtTime(Math.max(0.001, 0.01 * volume), now + 0.1);
          
          osc.start(now);
          osc.stop(now + 0.1);
          break;

        case 'clear':
          // A triumphant arpeggio for clearing a mission
          osc.type = 'sine';
          osc.frequency.setValueAtTime(523.25, now); // C5
          osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
          osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
          osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6
          
          gainNode.gain.setValueAtTime(0, now);
          gainNode.gain.linearRampToValueAtTime(0.3 * volume, now + 0.05);
          gainNode.gain.setValueAtTime(0.3 * volume, now + 0.4);
          gainNode.gain.exponentialRampToValueAtTime(Math.max(0.001, 0.01 * volume), now + 0.8);
          
          osc.start(now);
          osc.stop(now + 0.8);
          break;
      }
    } catch (e) {
      console.warn('Audio play failed:', e);
    }
  }, [getVolume]);

  const speakWord = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return;
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.volume = getVolume();
    // Slightly slow down for clear pronunciation (1.0 is default, 0.9 is slightly slower)
    utterance.rate = 0.9;
    
    window.speechSynthesis.speak(utterance);
  }, [getVolume]);

  return { playSound, speakWord };
}
