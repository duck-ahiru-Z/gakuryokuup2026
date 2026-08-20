import React from 'react';
import type { ViewState, GameModeData } from '../types';
import gameModes from '../data/gameModes.json';
import { ArrowLeft, PlayCircle, FileText } from 'lucide-react';
import './ModeSelect.css';

interface ModeSelectProps {
  onNavigate: (view: ViewState) => void;
  onSelectMode: (modeId: string) => void;
  uiLang: 'EN' | 'JA';
  furiganaEnabled: boolean;
}

const ModeSelect: React.FC<ModeSelectProps> = ({ onNavigate, onSelectMode, uiLang, furiganaEnabled }) => {
  const normalModes = (gameModes as GameModeData[]).filter(m => m.type === 'normal');
  const practicalModes = (gameModes as GameModeData[]).filter(m => m.type === 'practical');

  const handleModeClick = (id: string) => {
    onSelectMode(id);
    onNavigate('prep');
  };

  const renderJa = (text: string, rubyText: string) => {
    return furiganaEnabled ? <ruby>{text}<rt>{rubyText}</rt></ruby> : text;
  };

  return (
    <div className="mode-select-container">
      <div className="mode-header">
        <button className="secondary-btn back-btn" onClick={() => onNavigate('home')}>
          <ArrowLeft size={20} />
          <span>{uiLang === 'EN' ? 'BACK' : renderJa('戻る', 'もどる')}</span>
        </button>
        <h2 className="mode-title">{uiLang === 'EN' ? 'SELECT MODE' : renderJa('モード選択', 'せんたく')}</h2>
      </div>

      <div className="mode-sections">
        {/* Normal Mode Section */}
        <div className="mode-section">
          <h3 className="section-title">
            <PlayCircle size={24} />
            {uiLang === 'EN' ? 'NORMAL MODE' : renderJa('通常モード', 'つうじょう')}
          </h3>
          <div className="mode-grid">
            {normalModes.map(mode => (
              <button key={mode.id} className="mode-card" onClick={() => handleModeClick(mode.id)}>
                <h4>{uiLang === 'EN' ? mode.titleEn : mode.titleJa}</h4>
                <p>{uiLang === 'EN' ? mode.descriptionEn : mode.descriptionJa}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Practical Mode Section */}
        <div className="mode-section">
          <h3 className="section-title">
            <FileText size={24} />
            {uiLang === 'EN' ? 'PRACTICAL EXAMS' : renderJa('実技問題', 'じつぎもんだい')}
          </h3>
          <div className="mode-grid">
            {practicalModes.map(mode => (
              <button key={mode.id} className="mode-card practical-card" onClick={() => handleModeClick(mode.id)}>
                <h4>{uiLang === 'EN' ? mode.titleEn : mode.titleJa}</h4>
                <p>{uiLang === 'EN' ? mode.descriptionEn : mode.descriptionJa}</p>
              </button>
            ))}
            {/* プレースホルダー（仮ボタン） */}
            {Array.from({ length: Math.max(0, 6 - practicalModes.length) }).map((_, i) => (
              <button key={`placeholder-${i}`} className="mode-card practical-card locked" disabled>
                <h4>{uiLang === 'EN' ? `Set ${practicalModes.length + i + 1} (Coming Soon)` : `セット ${practicalModes.length + i + 1} (準備中)`}</h4>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeSelect;
