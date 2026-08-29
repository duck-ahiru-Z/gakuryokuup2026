export type ViewState = 'home' | 'modeSelect' | 'prep' | 'game' | 'game2' | 'result' | 'dictionary' | 'admin';
export type Difficulty = 'EASY' | 'NORMAL' | 'HARD';

export interface GameModeData {
  id: string;
  type: 'normal' | 'practical';
  titleJa: string;
  titleEn: string;
  descriptionJa: string;
  descriptionEn: string;
  imageUri?: string;
}

export interface ShortcutData {
  id: string;
  difficulty: Difficulty;
  keys: string[]; // e.g., ['Ctrl', 'C']
  macKeys?: string[]; // OS specific overrides
  chromeKeys?: string[];
  windowsOnly?: boolean; // True if this shortcut only exists/makes sense on Windows
  commandName: string; // e.g., 'Copy'
  description: string; // "文章を複製する"
  descriptionEn?: string;
  wordMeaning: string; // "複製する"
  wordMeaningEn?: string;
  etymology: string; // "ラテン語の 'copia' (豊富) に由来"
  etymologyEn?: string;
  exampleSentence?: string;
  exampleSentenceEn?: string;
}

export interface UserStats {
  xp: number;
  rank: string;
  unlockedShortcuts: string[];
  recentScores: { modeId: string; score: number; timestamp: number }[];
  totalAttempts: number;
  correctAttempts: number;
  shortcutMistakes: Record<string, number>;
}

export interface PracticalMission {
  id: number;
  titleEn: string;
  titleJa: string;
  descriptionEn: string;
  descriptionJa: string;
  shortcutId: string; // references shortcuts.json
  
  // What happens when the shortcut is successfully pressed
  successAction: {
    type: 'highlight_left' | 'append_right' | 'replace_right' | 'none';
    targetText?: string;
    textToAppend?: string;
    replaceTarget?: string;
    replaceWith?: string;
  };
}

export interface PracticalSet {
  id: string; // e.g. "practical_1"
  titleEn: string;
  titleJa: string;
  descriptionEn: string;
  descriptionJa: string;
  leftColumnTitleEn: string;
  leftColumnTitleJa: string;
  rightColumnTitleEn: string;
  rightColumnTitleJa: string;
  initialLeftText: string[];
  initialRightText: string;
  missions: PracticalMission[];
}