import React from 'react';
import type { ShortcutData } from '../types';
import { OS } from '../hooks/useOS';
import { resolveKeys, parseRubyText } from '../utils/shortcutUtils';
import { Lock, BookOpen, Volume2 } from 'lucide-react';
import { useAudio } from '../hooks/useAudio';

interface DictionaryCardProps {
  sc: ShortcutData;
  os: OS;
  uiLang: 'EN' | 'JA';
  furiganaEnabled: boolean;
  isUnlocked: boolean;
}

export const DictionaryCard: React.FC<DictionaryCardProps> = ({ sc, os, uiLang, furiganaEnabled, isUnlocked }) => {
  const { speakWord } = useAudio();

  if (!isUnlocked) {
    return (
      <div className="dict-card locked">
        <div className="card-top">
          <div className="keys-massive">
            <span className="dict-key-massive secret-key">?</span>
            <span className="plus-massive">+</span>
            <span className="dict-key-massive secret-key">?</span>
          </div>
        </div>
        <div className="card-body secret-body">
          <Lock size={48} className="lock-icon" />
          <span className="locked-text">
            {uiLang === 'EN' ? 'RESTRICTED' : parseRubyText('[未解放](みかいほう)', furiganaEnabled)}
          </span>
          <p className="secret-hint">
            {uiLang === 'EN' ? 'Unlock by using this in missions!' : parseRubyText('ミッションで[成功](せいこう)すると[解放](かいほう)されます', furiganaEnabled)}
          </p>
        </div>
      </div>
    );
  }

  const displayKeys = resolveKeys(sc, os);

  return (
    <div className="dict-card unlocked">
      <div className="card-top">
        <div className={`keys-massive ${displayKeys.length >= 3 ? 'keys-compact' : ''}`}>
          {displayKeys.map((k, i) => (
            <React.Fragment key={i}>
              <span className="dict-key-massive">{k}</span>
              {i < displayKeys.length - 1 && <span className="plus-massive">+</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="card-body">
        <div className="word-section">
          <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <h3 className="english-word">{sc.commandName.toUpperCase()}</h3>
            <button 
              className="secondary-btn" 
              style={{padding: '0.25rem 0.5rem', minWidth: 'auto', border: 'none'}}
              onClick={() => speakWord(sc.commandName)}
              title="Read aloud"
            >
              <Volume2 size={20} />
            </button>
          </div>
          <p className="word-meaning">
            {uiLang === 'EN' && sc.wordMeaningEn ? sc.wordMeaningEn : parseRubyText(sc.wordMeaning, furiganaEnabled)}
          </p>
        </div>

        <div className="usage-box">
          <span className="label">
            {uiLang === 'EN' ? 'USAGE' : parseRubyText('[用途](ようと)', furiganaEnabled)}
          </span>
          <p className="description-text">
            {uiLang === 'EN' && sc.descriptionEn ? sc.descriptionEn : parseRubyText(sc.description, furiganaEnabled)}
          </p>
        </div>

        <div className="etymology-box">
          <span className="label">
            <BookOpen size={14} />
            {uiLang === 'EN' ? 'ORIGIN' : parseRubyText('[語源](ごげん)', furiganaEnabled)}
          </span>
          <p>
            {uiLang === 'EN' && sc.etymologyEn ? sc.etymologyEn : parseRubyText(sc.etymology, furiganaEnabled)}
          </p>
        </div>
      </div>
    </div>
  );
};
