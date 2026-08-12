import React, { useEffect, useState } from 'react';
import type { ViewState, UserStats } from '../types';
import { SHORTCUTS } from '../data/shortcutsData';
import { storageUtils } from '../utils/storageUtils';
import { ArrowLeft, Lock } from 'lucide-react';
import './Dictionary.css';

interface DictionaryProps {
  onNavigate: (view: ViewState) => void;
}

const Dictionary: React.FC<DictionaryProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    setStats(storageUtils.getStats());
  }, []);

  if (!stats) return null;

  return (
    <div className="dictionary-container">
      <div className="dict-header">
        <h2 className="title">DATA <span className="highlight">ARCHIVES</span></h2>
        <button className="secondary-btn" onClick={() => onNavigate('home')}>
          <ArrowLeft size={20} /> RETURN
        </button>
      </div>

      <div className="dict-grid">
        {SHORTCUTS.map(sc => {
          const isUnlocked = stats.unlockedShortcuts.includes(sc.id);
          
          if (!isUnlocked) {
            return (
              <div key={sc.id} className="dict-card locked">
                <Lock size={32} className="lock-icon" />
                <span className="locked-text">RESTRICTED ACCESS</span>
              </div>
            );
          }

          return (
            <div key={sc.id} className="dict-card unlocked">
              <div className="card-top">
                <div className="keys">
                  {sc.keys.map((k, i) => (
                    <React.Fragment key={i}>
                      <span className="dict-key">{k}</span>
                      {i < sc.keys.length - 1 && <span className="plus">+</span>}
                    </React.Fragment>
                  ))}
                </div>
                <h3 className="command-name">{sc.commandName}</h3>
              </div>
              <div className="card-body">
                <p className="desc">{sc.description}</p>
                <p className="meaning">{sc.wordMeaning}</p>
                <div className="divider"></div>
                <p className="etymology"><strong>ORIGIN:</strong> {sc.etymology}</p>
                <p className="example"><strong>EXAMPLE:</strong> {sc.exampleSentence}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dictionary;