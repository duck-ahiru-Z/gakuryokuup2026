import { useState, useEffect, useCallback } from 'react';
import { SHORTCUTS } from '../data/shortcutsData';
import type { ShortcutData, Difficulty } from '../types';

export function useGameState(isActive: boolean, difficulty: Difficulty, onGameEnd: (score: number) => void) {
  const [currentMission, setCurrentMission] = useState<ShortcutData | null>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); 
  const [showExplanation, setShowExplanation] = useState(false);
  
  const generateMission = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * SHORTCUTS.length);
    setCurrentMission(SHORTCUTS[randomIndex]);
    setShowExplanation(false);
  }, []);

  useEffect(() => {
    if (isActive) {
      setPlayerScore(0);
      setAiScore(0);
      setTimeLeft(30);
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

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;
    
    let aiInterval = 2000;
    let aiScoreBase = 10;
    
    if (difficulty === 'EASY') {
      aiInterval = 3000;
      aiScoreBase = 5;
    } else if (difficulty === 'HARD') {
      aiInterval = 1000;
      aiScoreBase = 15;
    }

    const aiTimer = setInterval(() => {
      setAiScore(prev => prev + Math.floor(Math.random() * aiScoreBase) + aiScoreBase);
    }, aiInterval);
    
    return () => clearInterval(aiTimer);
  }, [isActive, timeLeft, difficulty]);

  const handleSuccess = useCallback(() => {
    // Add bonus multiplier for HARD mode
    const multiplier = difficulty === 'HARD' ? 1.5 : (difficulty === 'EASY' ? 0.8 : 1.0);
    setPlayerScore(prev => prev + Math.floor(100 * multiplier));
    setShowExplanation(true);
    
    setTimeout(() => {
      generateMission();
    }, 2000);
  }, [generateMission, difficulty]);

  return {
    currentMission,
    playerScore,
    aiScore,
    timeLeft,
    showExplanation,
    handleSuccess,
  };
}