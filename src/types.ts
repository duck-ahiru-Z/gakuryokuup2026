export type ViewState = 'home' | 'game' | 'result' | 'dictionary' | 'admin';
export type Difficulty = 'EASY' | 'NORMAL' | 'HARD';

export interface ShortcutData {
  id: string;
  difficulty: Difficulty;
  keys: string[]; // e.g., ['Ctrl', 'C']
  commandName: string; // e.g., 'Copy'
  description: string; // "文章を複製する"
  wordMeaning: string; // "複製する"
  etymology: string; // "ラテン語の 'copia' (豊富) に由来"
}

export interface UserStats {
  xp: number;
  rank: string;
  unlockedShortcuts: string[];
}