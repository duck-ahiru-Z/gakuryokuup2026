import React, { useEffect, useState } from 'react';
import type { ViewState, UserStats, Difficulty } from '../types';
import { SHORTCUTS } from '../data/shortcutsData';
import { storageUtils } from '../utils/storageUtils';
import { ArrowLeft } from 'lucide-react';
import { useOS } from '../hooks/useOS';
import { DictionaryCard } from './DictionaryCard';
import { parseRubyText } from '../utils/shortcutUtils';
import dictionarySections from '../data/dictionarySections.json';
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'escape' || key === 'enter') {
        onNavigate('home');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNavigate]);

  if (!stats) return null;

  const renderCard = (sc: typeof SHORTCUTS[0]) => {
    // Check if the shortcut is unlocked by the user
    const isUnlocked = stats.unlockedShortcuts.includes(sc.id);
    
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

  const getSectionShortcuts = (difficultyId: string) => {
    return SHORTCUTS.filter(sc => {
      if (sc.difficulty !== difficultyId as Difficulty) return false;
      if (sc.windowsOnly && os !== 'Windows') return false;
      return true;
    });
  };

  return (
    <div className="dictionary-container">
      <div className="dict-header">
        <h2 className="title">
          {uiLang === 'EN' ? 'COLLECTED SHORTCUTS' : parseRubyText('[集](あつ)めたショートカットキー', furiganaEnabled)}
        </h2>
        <button className="dict-back-btn" onClick={() => onNavigate('home')} title="Shortcut: Esc or Enter">
          <ArrowLeft size={20} /> 
          <span>{uiLang === 'EN' ? 'RETURN' : parseRubyText('[戻](もど)る', furiganaEnabled)}</span>
          <span className="enter-badge" style={{marginLeft: '10px'}}>Esc</span>
        </button>
      </div>

      {dictionarySections.map(section => {
        const shortcuts = getSectionShortcuts(section.id);
        if (shortcuts.length === 0) return null;
        
        return (
          <div key={section.id} className="dict-section">
            <h3 className={`section-title ${section.className}`}>
              {uiLang === 'EN' ? section.titleEn : parseRubyText(section.titleJa, furiganaEnabled)}
            </h3>
            <p className="section-desc">
              {uiLang === 'EN' ? section.descEn : parseRubyText(section.descJa, furiganaEnabled)}
            </p>
            <div className="dict-grid">
              {shortcuts.map(renderCard)}
            </div>
          </div>
        );
      })}

    </div>
  );
};

export default Dictionary;