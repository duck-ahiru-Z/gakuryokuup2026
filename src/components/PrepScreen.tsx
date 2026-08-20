import React from 'react';
import type { ViewState, GameModeData, Difficulty } from '../types';
import gameModes from '../data/gameModes.json';
import { ArrowLeft, Play } from 'lucide-react';
import './PrepScreen.css';

interface PrepScreenProps {
  onNavigate: (view: ViewState) => void;
  modeId: string;
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  uiLang: 'EN' | 'JA';
  furiganaEnabled: boolean;
}

const PrepScreen: React.FC<PrepScreenProps> = ({ 
  onNavigate, modeId, difficulty, setDifficulty, uiLang, furiganaEnabled 
}) => {
  const modeData = (gameModes as GameModeData[]).find(m => m.id === modeId);

  // フォールバック
  if (!modeData) {
    return <div>Mode not found. <button onClick={() => onNavigate('modeSelect')}>Back</button></div>;
  }

  const renderJa = (text: string, rubyText: string) => {
    return furiganaEnabled ? <ruby>{text}<rt>{rubyText}</rt></ruby> : text;
  };

  const handleStart = () => {
    if (modeData.type === 'normal') {
      onNavigate('game');
    } else {
      onNavigate('game2');
    }
  };

  return (
    <div className="prep-container">
      <div className="prep-header">
        <button className="secondary-btn back-btn" onClick={() => onNavigate('modeSelect')}>
          <ArrowLeft size={20} />
          <span>{uiLang === 'EN' ? 'BACK' : renderJa('戻る', 'もどる')}</span>
        </button>
      </div>

      <div className="prep-content">
        <h2 className="prep-title">{uiLang === 'EN' ? modeData.titleEn : modeData.titleJa}</h2>
        <p className="prep-desc">{uiLang === 'EN' ? modeData.descriptionEn : modeData.descriptionJa}</p>

        {modeData.type === 'normal' && (
          <div className="difficulty-container prep-diff">
            <span className="diff-label">
              {uiLang === 'EN' ? 'SELECT DIFFICULTY' : renderJa('難易度選択', 'なんいどせんたく')}
            </span>
            <div className="difficulty-selector">
              <button 
                className={`diff-btn ${difficulty === 'EASY' ? 'active' : ''}`}
                onClick={() => setDifficulty('EASY')}
              >
                {uiLang === 'EN' ? 'EASY' : renderJa('初心者', 'しょしんしゃ')}
              </button>
              <button 
                className={`diff-btn ${difficulty === 'NORMAL' ? 'active' : ''}`}
                onClick={() => setDifficulty('NORMAL')}
              >
                {uiLang === 'EN' ? 'NORMAL' : renderJa('通常', 'つうじょう')}
              </button>
              <button 
                className={`diff-btn ${difficulty === 'HARD' ? 'active' : ''}`}
                onClick={() => setDifficulty('HARD')}
              >
                {uiLang === 'EN' ? 'HARD' : renderJa('上級者', 'じょうきゅうしゃ')}
              </button>
            </div>
          </div>
        )}

        {modeData.type === 'practical' && modeData.missions && (
          <div className="missions-container">
            <h3 className="missions-title">{uiLang === 'EN' ? 'MISSION OBJECTIVES' : renderJa('ミッション内容', 'ないよう')}</h3>
            <ul className="missions-list">
              {modeData.missions.map((mission, index) => (
                <li key={index}>{mission}</li>
              ))}
            </ul>
          </div>
        )}

        <button className="primary-btn prep-start-btn" onClick={handleStart}>
          <Play size={24} /> 
          <span>{uiLang === 'EN' ? 'START MISSION' : renderJa('ミッション開始', 'かいし')}</span>
        </button>
      </div>
    </div>
  );
};

export default PrepScreen;
