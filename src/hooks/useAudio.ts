import { useCallback, useRef } from 'react';

// A simple Web Audio API synthesizer for game sounds
export function useAudio() {
  const audioCtxRef = useRef<AudioContext | null>(null);

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

      switch (type) {
        case 'success':
          // A pleasant "ding" (high pitch, quick fade)
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, now); // A5
          osc.frequency.exponentialRampToValueAtTime(1760, now + 0.1); // up to A6
          
          gainNode.gain.setValueAtTime(0, now);
          gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
          
          osc.start(now);
          osc.stop(now + 0.5);
          break;

        case 'error':
          // A dull "buzzer" (low pitch, rough sound)
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(150, now);
          
          gainNode.gain.setValueAtTime(0, now);
          gainNode.gain.linearRampToValueAtTime(0.2, now + 0.05);
          gainNode.gain.linearRampToValueAtTime(0.01, now + 0.3);
          
          osc.start(now);
          osc.stop(now + 0.3);
          break;

        case 'click':
          // A short, subtle "tick"
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(600, now);
          
          gainNode.gain.setValueAtTime(0, now);
          gainNode.gain.linearRampToValueAtTime(0.1, now + 0.02);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
          
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
          gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);
          gainNode.gain.setValueAtTime(0.3, now + 0.4);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
          
          osc.start(now);
          osc.stop(now + 0.8);
          break;
      }
    } catch (e) {
      console.warn('Audio play failed:', e);
    }
  }, []);

  const speakWord = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return;
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    // Slightly slow down for clear pronunciation (1.0 is default, 0.9 is slightly slower)
    utterance.rate = 0.9;
    
    window.speechSynthesis.speak(utterance);
  }, []);

  return { playSound, speakWord };
}
