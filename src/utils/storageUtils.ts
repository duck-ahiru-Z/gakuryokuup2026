import type { UserStats } from '../types';

const STORAGE_KEY = 'shortcut_academy_stats';

const defaultStats: UserStats = {
  xp: 0,
  rank: 'Trainee',
  unlockedShortcuts: [],
};

export const storageUtils = {
  getStats: (): UserStats => {
    try {
      const item = localStorage.getItem(STORAGE_KEY);
      if (item) {
        return JSON.parse(item) as UserStats;
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
  }
};