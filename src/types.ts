export type ViewState = 'home' | 'modeSelect' | 'prep' | 'game' | 'game2' | 'result' | 'dictionary' | 'admin';
export type Difficulty = 'EASY' | 'NORMAL' | 'HARD';

export interface GameModeData {
  id: string;
  type: 'normal' | 'practical';
  titleJa: string;
  titleEn: string;
  descriptionJa: string;
  descriptionEn: string;
  missions?: string[]; // Used for practical mode details
}

export interface ShortcutData {
  id: string;
  difficulty: Difficulty;
  keys: string[]; // e.g., ['Ctrl', 'C']
  macKeys?: string[]; // OS specific overrides
  chromeKeys?: string[];
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