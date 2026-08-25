import { useState, useEffect, useCallback } from 'react';
import { SHORTCUTS } from '../data/shortcutsData';
import type { ShortcutData, Difficulty } from '../types';

const GAME_DURATION_SECONDS = 30;
const BASE_SCORE_PER_SUCCESS = 100;
const EXPLANATION_DURATION_MS = 2000;

export function useGameState(isActive: boolean, difficulty: Difficulty, onGameEnd: (score: number) => void) {
  const [currentMission, setCurrentMission] = useState<ShortcutData | null>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION_SECONDS); 
  const [showExplanation, setShowExplanation] = useState(false);
  
  const generateMission = useCallback(() => {
    let validShortcuts = SHORTCUTS;

    if (difficulty === 'EASY') {
      validShortcuts = SHORTCUTS.filter(sc => sc.difficulty === 'EASY');
    } else if (difficulty === 'NORMAL') {
      validShortcuts = SHORTCUTS.filter(sc => sc.difficulty === 'EASY' || sc.difficulty === 'NORMAL');
    }
    
    const randomIndex = Math.floor(Math.random() * validShortcuts.length);
    setCurrentMission(validShortcuts[randomIndex]);
    setShowExplanation(false);
  }, [difficulty]);

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
    
    setTimeout(() => {
      generateMission();
    }, EXPLANATION_DURATION_MS);
  }, [generateMission, difficulty]);

  return {
    currentMission,
    playerScore,
    timeLeft,
    showExplanation,
    handleSuccess,
  };
}