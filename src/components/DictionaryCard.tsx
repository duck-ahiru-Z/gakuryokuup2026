import React from 'react';
import type { ShortcutData } from '../types';
import { OS } from '../hooks/useOS';
import { resolveKeys, parseRubyText } from '../utils/shortcutUtils';
import { Lock, BookOpen } from 'lucide-react';

interface DictionaryCardProps {
  sc: ShortcutData;
  os: OS;
  uiLang: 'EN' | 'JA';
  furiganaEnabled: boolean;
  isUnlocked: boolean;
}

export const DictionaryCard: React.FC<DictionaryCardProps> = ({ sc, os, uiLang, furiganaEnabled, isUnlocked }) => {
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
          <h3 className="english-word">{sc.commandName.toUpperCase()}</h3>
          <p className="word-meaning">{parseRubyText(sc.wordMeaning, furiganaEnabled)}</p>
        </div>

        <div className="usage-box">
          <span className="label">
            {uiLang === 'EN' ? 'USAGE' : parseRubyText('[用途](ようと)', furiganaEnabled)}
          </span>
          <p className="description-text">{parseRubyText(sc.description, furiganaEnabled)}</p>
        </div>

        <div className="etymology-box">
          <span className="label">
            <BookOpen size={14} />
            {uiLang === 'EN' ? 'ORIGIN' : parseRubyText('[語源](ごげん)', furiganaEnabled)}
          </span>
          <p>{parseRubyText(sc.etymology, furiganaEnabled)}</p>
        </div>
      </div>
    </div>
  );
};
