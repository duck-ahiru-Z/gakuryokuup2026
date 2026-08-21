import type { UserStats } from '../types';

const STORAGE_KEY = 'shortcut_academy_stats';

const defaultStats: UserStats = {
  xp: 0,
  rank: 'Trainee',
  unlockedShortcuts: [],
  recentScores: [],
  totalAttempts: 0,
  correctAttempts: 0,
  shortcutMistakes: {}
};

export const storageUtils = {
  getStats: (): UserStats => {
    try {
      const item = localStorage.getItem(STORAGE_KEY);
      if (item) {
        const parsed = JSON.parse(item) as Partial<UserStats>;
        return { ...defaultStats, ...parsed }; // Merge to safely add new properties
      }
    } catch (e) {
      console.error('Failed to parse stats from localStorage', e);
    }
    return defaultStats;
  },
  
  saveStats: (stats: UserStats): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch (e) {
      console.error('Failed to save stats to localStorage', e);
    }
  },
  
  addXP: (amount: number, newUnlockId?: string): UserStats => {
    const stats = storageUtils.getStats();
    stats.xp += amount;
    
    if (newUnlockId && !stats.unlockedShortcuts.includes(newUnlockId)) {
      stats.unlockedShortcuts.push(newUnlockId);
    }
    
    // Simple Rank Logic
    if (stats.xp > 2000) stats.rank = 'Master';
    else if (stats.xp > 1000) stats.rank = 'Expert';
    else if (stats.xp > 500) stats.rank = 'Advanced';
    else if (stats.xp > 200) stats.rank = 'Intermediate';
    else stats.rank = 'Trainee';

    storageUtils.saveStats(stats);
    return stats;
  },

  recordGameResult: (modeId: string, score: number): void => {
    const stats = storageUtils.getStats();
    stats.recentScores.unshift({ modeId, score, timestamp: Date.now() });
    if (stats.recentScores.length > 5) {
      stats.recentScores = stats.recentScores.slice(0, 5); // Keep last 5
    }
    storageUtils.saveStats(stats);
  },

  recordAttempt: (isCorrect: boolean, shortcutId?: string): void => {
    const stats = storageUtils.getStats();
    stats.totalAttempts++;
    if (isCorrect) {
      stats.correctAttempts++;
    } else if (shortcutId) {
      stats.shortcutMistakes[shortcutId] = (stats.shortcutMistakes[shortcutId] || 0) + 1;
    }
    storageUtils.saveStats(stats);
  }
};