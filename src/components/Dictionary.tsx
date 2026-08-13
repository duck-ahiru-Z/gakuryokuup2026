import React, { useEffect, useState } from 'react';
import type { ViewState, UserStats } from '../types';
import { SHORTCUTS } from '../data/shortcutsData';
import { storageUtils } from '../utils/storageUtils';
import { ArrowLeft, Lock, BookOpen } from 'lucide-react';
import './Dictionary.css';

interface DictionaryProps {
  onNavigate: (view: ViewState) => void;
  uiLang: 'EN' | 'JA';
  furiganaEnabled: boolean;
}

const Dictionary: React.FC<DictionaryProps> = ({ onNavigate, uiLang, furiganaEnabled }) => {
  const [stats, setStats] = useState<UserStats | null>(null);

  const parseRubyText = (text: string) => {
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      parts.push(
        <ruby key={match.index}>
          {match[1]}
          {furiganaEnabled && <rt>{match[2]}</rt>}
        </ruby>
      );
      lastIndex = regex.lastIndex;
    }
    
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    return <>{parts}</>;
  };

  useEffect(() => {
    setStats(storageUtils.getStats());
  }, []);

  if (!stats) return null;

  const easyShortcuts = SHORTCUTS.filter(sc => sc.difficulty === 'EASY');
  const normalShortcuts = SHORTCUTS.filter(sc => sc.difficulty === 'NORMAL');
  const hardShortcuts = SHORTCUTS.filter(sc => sc.difficulty === 'HARD');

  const renderCard = (sc: typeof SHORTCUTS[0]) => {
    // DEBUG: Temporarily unlocking all shortcuts so the user can see the cards
    const isUnlocked = true; // stats.unlockedShortcuts.includes(sc.id);
    
    if (!isUnlocked) {
      return (
        <div key={sc.id} className="dict-card locked">
          <Lock size={48} className="lock-icon" />
          <span className="locked-text">
            {uiLang === 'EN' ? 'RESTRICTED' : <ruby>未解放<rt>{furiganaEnabled && 'みかいほう'}</rt></ruby>}
          </span>
        </div>
      );
    }

    return (
      <div key={sc.id} className="dict-card unlocked">
        <div className="card-top">
          <div className="keys-massive">
            {sc.keys.map((k, i) => (
              <React.Fragment key={i}>
                <span className="dict-key-massive">{k}</span>
                {i < sc.keys.length - 1 && <span className="plus-massive">+</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="card-body">
          <div className="word-section">
            <h3 className="english-word">{sc.commandName.toUpperCase()}</h3>
            <p className="word-meaning">{parseRubyText(sc.wordMeaning)}</p>
          </div>

          <div className="usage-box">
            <span className="label">
              {uiLang === 'EN' ? 'USAGE' : <ruby>用途<rt>{furiganaEnabled && 'ようと'}</rt></ruby>}
            </span>
            <p className="description-text">{parseRubyText(sc.description)}</p>
          </div>

          <div className="etymology-box">
            <span className="label">
              <BookOpen size={14} />
              {uiLang === 'EN' ? 'ORIGIN' : <ruby>語源<rt>{furiganaEnabled && 'ごげん'}</rt></ruby>}
            </span>
            <p>{parseRubyText(sc.etymology)}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dictionary-container">
      <div className="dict-header">
        <h2 className="title">
          {uiLang === 'EN' ? 'WORD ARCHIVES' : <ruby>単語図鑑<rt>{furiganaEnabled && 'たんごずかん'}</rt></ruby>}
        </h2>
        <button className="secondary-btn" onClick={() => onNavigate('home')}>
          <ArrowLeft size={20} /> 
          <span>{uiLang === 'EN' ? 'RETURN' : <ruby>戻る<rt>{furiganaEnabled && 'もどる'}</rt></ruby>}</span>
        </button>
      </div>

      <div className="dict-section">
        <h3 className="section-title easy-title">
          🟢 {uiLang === 'EN' ? 'EASY (Basics)' : <ruby>難易度：EASY（超初心者・絶対に覚えるべき基礎）<rt>{furiganaEnabled && 'なんいど:イージー(ちょうしょしんしゃ・ぜったいにおぼえるべききそ)'}</rt></ruby>}
        </h3>
        <p className="section-desc">
          {uiLang === 'EN' ? 'The absolute basics.' : <ruby>日常的なPC操作で最もよく使う、絶対に外せない「基本の5つ」です。<rt>{furiganaEnabled && 'にちじょうてきなピーシーそうさでもっともよくつかう、ぜったいにはずせない「きほんの5つ」です。'}</rt></ruby>}
        </p>
        <div className="dict-grid">
          {easyShortcuts.map(renderCard)}
        </div>
      </div>

      <div className="dict-section">
        <h3 className="section-title normal-title">
          🟡 {uiLang === 'EN' ? 'NORMAL (Standard)' : <ruby>難易度：NORMAL（標準・知っていると作業が早い）<rt>{furiganaEnabled && 'なんいど:ノーマル(ひょうじゅん・しっているとさぎょうがはやい)'}</rt></ruby>}
        </h3>
        <p className="section-desc">
          {uiLang === 'EN' ? 'Very useful for documents and web.' : <ruby>文章作成や調べ学習の時に知っていると、マウスを使う回数が激減する便利なキーです。<rt>{furiganaEnabled && 'ぶんしょうさくせいやしらべがくしゅうのときにしっていると、マウスをつかうかいすがげきげんするべんりなキーです。'}</rt></ruby>}
        </p>
        <div className="dict-grid">
          {normalShortcuts.map(renderCard)}
        </div>
      </div>

      <div className="dict-section">
        <h3 className="section-title hard-title">
          🔴 {uiLang === 'EN' ? 'HARD (Advanced)' : <ruby>難易度：HARD（むずい・プロっぽさが出る上級技）<rt>{furiganaEnabled && 'なんいど:ハード(むずい・プロっぽさがでるじょうきゅうわざ)'}</rt></ruby>}
        </h3>
        <p className="section-desc">
          {uiLang === 'EN' ? 'Advanced techniques.' : <ruby>3つのキーの同時押しや、ドキュメント作成に特化した「知る人ぞ知る」高度なショートカットです。<rt>{furiganaEnabled && '3つのキーのどうじおしや、ドキュメントさくせいにとっかした「しるひとぞしる」こうどなショートカットです。'}</rt></ruby>}
        </p>
        <div className="dict-grid">
          {hardShortcuts.map(renderCard)}
        </div>
      </div>

    </div>
  );
};

export default Dictionary;