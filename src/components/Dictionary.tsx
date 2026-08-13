import React, { useEffect, useState } from 'react';
import type { ViewState, UserStats } from '../types';
import { SHORTCUTS } from '../data/shortcutsData';
import { storageUtils } from '../utils/storageUtils';
import { ArrowLeft } from 'lucide-react';
import { useOS, OS } from '../hooks/useOS';
import { DictionaryCard } from './DictionaryCard';
import './Dictionary.css';

interface DictionaryProps {
  onNavigate: (view: ViewState) => void;
  uiLang: 'EN' | 'JA';
  furiganaEnabled: boolean;
}

const Dictionary: React.FC<DictionaryProps> = ({ onNavigate, uiLang, furiganaEnabled }) => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const os = useOS();

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
    
    return (
      <DictionaryCard 
        key={sc.id} 
        sc={sc} 
        os={os} 
        uiLang={uiLang} 
        furiganaEnabled={furiganaEnabled} 
        isUnlocked={isUnlocked} 
      />
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
          {uiLang === 'EN' ? 'EASY (Basics)' : <ruby>難易度：EASY（超初心者・絶対に覚えるべき基礎）<rt>{furiganaEnabled && 'なんいど:イージー(ちょうしょしんしゃ・ぜったいにおぼえるべききそ)'}</rt></ruby>}
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
          {uiLang === 'EN' ? 'NORMAL (Standard)' : <ruby>難易度：NORMAL（標準・知っていると作業が早い）<rt>{furiganaEnabled && 'なんいど:ノーマル(ひょうじゅん・しっているとさぎょうがはやい)'}</rt></ruby>}
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
          {uiLang === 'EN' ? 'HARD (Advanced)' : <ruby>難易度：HARD（むずい・プロっぽさが出る上級技）<rt>{furiganaEnabled && 'なんいど:ハード(むずい・プロっぽさがでるじょうきゅうわざ)'}</rt></ruby>}
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