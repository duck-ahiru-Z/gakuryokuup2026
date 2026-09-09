import { useState, useEffect, useCallback, useRef } from 'react';
import { SHORTCUTS } from '../data/shortcutsData';
import type { ShortcutData, Difficulty } from '../types';
import { useOS } from './useOS';
import { storageUtils } from '../utils/storageUtils';

const GAME_DURATION_SECONDS = 30;
const BASE_SCORE_PER_SUCCESS = 100;


export function useGameState(isActive: boolean, difficulty: Difficulty, onGameEnd: (score: number) => void, uiLang: 'EN' | 'JA') {
  const [currentMission, setCurrentMission] = useState<ShortcutData | null>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION_SECONDS); 
  const [showExplanation, setShowExplanation] = useState(false);
  const [hintedMissionId, setHintedMissionId] = useState<string | null>(null);
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const previousMissionIdRef = useRef<string | null>(null);
  const os = useOS();
  
  const generateMission = useCallback(() => {
    let validShortcuts = SHORTCUTS.filter(sc => {
      if (sc.windowsOnly && os !== 'Windows') return false;
      return true;
    });

    if (difficulty === 'EASY') {
      validShortcuts = validShortcuts.filter(sc => sc.difficulty === 'EASY');
    } else if (difficulty === 'NORMAL') {
      validShortcuts = validShortcuts.filter(sc => sc.difficulty === 'EASY' || sc.difficulty === 'NORMAL');
    }
    
    if (validShortcuts.length === 0) return; // Safeguard
    
    const candidates = validShortcuts.length > 1 && previousMissionIdRef.current
      ? validShortcuts.filter(sc => sc.id !== previousMissionIdRef.current)
      : validShortcuts;
    const randomIndex = Math.floor(Math.random() * candidates.length);
    const nextMission = candidates[randomIndex];
    previousMissionIdRef.current = nextMission.id;
    setCurrentMission(nextMission);
    setShowExplanation(false);
    setHintedMissionId(null);
    setHintMessage(null);
  }, [difficulty, os]);

  useEffect(() => {
    if (isActive) {
      setPlayerScore(0);
      setTimeLeft(GAME_DURATION_SECONDS);
      generateMission();
    }
  }, [isActive, generateMission]);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) {
      if (isActive && timeLeft <= 0) {
        onGameEnd(playerScore);
      }
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isActive, timeLeft, onGameEnd, playerScore]);

  const handleSuccess = useCallback(() => {
    const multiplier = difficulty === 'HARD' ? 1.5 : (difficulty === 'EASY' ? 0.8 : 1.0);
    setPlayerScore(prev => prev + Math.floor(BASE_SCORE_PER_SUCCESS * multiplier));
    setShowExplanation(true);
  }, [generateMission, difficulty]);

  const continueAfterSuccess = useCallback(() => {
    if (!showExplanation) return;
    generateMission();
  }, [generateMission, showExplanation]);

  const handleHint = useCallback(() => {
    if (!currentMission) return;

    if (hintedMissionId !== currentMission.id) {
      if (!storageUtils.spendXP(10)) {
        setHintMessage(uiLang === 'EN' ? 'You need 10 XP to use a hint.' : 'ヒントには10XP必要です。');
        return;
      }
      setHintedMissionId(currentMission.id);
    }
    setHintMessage(uiLang === 'EN' ? 'The shortcut is shown above.' : 'ショートカットキーを上に表示しています。');
  }, [currentMission, hintedMissionId, uiLang]);

  const handleSkip = useCallback(() => {
    if (!storageUtils.spendXP(25)) {
      setHintMessage(uiLang === 'EN' ? 'You need 25 XP to skip a mission.' : 'スキップには25XP必要です。');
      return;
    }
    generateMission();
  }, [generateMission, uiLang]);

  return {
    currentMission,
    playerScore,
    timeLeft,
    showExplanation,
    handleSuccess,
    continueAfterSuccess,
    hintedMissionId,
    hintMessage,
    handleHint,
    handleSkip,
  };
}
