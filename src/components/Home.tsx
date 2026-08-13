import React, { useState } from 'react';
import type { ViewState, Difficulty } from '../types';
import { Play, Book, Settings as SettingsIcon, Type, Shield, Globe } from 'lucide-react';
import Settings from './Settings';
import './Home.css';

interface HomeProps {
  onNavigate: (view: ViewState) => void;
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate, difficulty, setDifficulty }) => {
  const [furiganaEnabled, setFuriganaEnabled] = useState(false);
  const [uiLang, setUiLang] = useState<'EN' | 'JA'>('JA');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const APP_TITLE = "Shortcut English";

  return (
    <div className="home-container">
      {/* Title Section */}
      <div className="hero-section">
        <div className="title-wrapper">
          <h1 className="title">{APP_TITLE}</h1>
        </div>
        <p className="subtitle">
          ショートカットキーの<ruby>語源{furiganaEnabled && <rt>ごげん</rt>}</ruby>を知り、
          <ruby>英語{furiganaEnabled && <rt>えいご</rt>}</ruby>とPC<ruby>操作{furiganaEnabled && <rt>そうさ</rt>}</ruby>を
          <ruby>同時{furiganaEnabled && <rt>どうじ</rt>}</ruby>にマスターしよう
        </p>
      </div>
      
      {/* Level Selection */}
      <div className="difficulty-container">
        <span className="diff-label">
          {uiLang === 'EN' ? 'LEVEL SELECT' : 'レベル選択'}
        </span>
        <div className="difficulty-selector">
          <button 
            className={`diff-btn ${difficulty === 'EASY' ? 'active' : ''}`}
            onClick={() => setDifficulty('EASY')}
          >
            {uiLang === 'EN' ? 'EASY' : <ruby>初心者{furiganaEnabled && <rt>しょしんしゃ</rt>}</ruby>}
          </button>
          <button 
            className={`diff-btn ${difficulty === 'NORMAL' ? 'active' : ''}`}
            onClick={() => setDifficulty('NORMAL')}
          >
            {uiLang === 'EN' ? 'NORMAL' : <ruby>通常{furiganaEnabled && <rt>つうじょう</rt>}</ruby>}
          </button>
          <button 
            className={`diff-btn ${difficulty === 'HARD' ? 'active' : ''}`}
            onClick={() => setDifficulty('HARD')}
          >
            {uiLang === 'EN' ? 'HARD' : <ruby>上級者{furiganaEnabled && <rt>じょうきゅうしゃ</rt>}</ruby>}
          </button>
        </div>
      </div>

      {/* Main Actions */}
      <div className="main-action-wrapper">
        <button className="primary-btn" onClick={() => onNavigate('game')}>
          <Play size={24} /> 
          <span>{uiLang === 'EN' ? 'START' : 'スタート'}</span>
        </button>
      </div>

      {/* Sub Actions */}
      <div className="sub-actions-grid">
        <button className="secondary-btn" onClick={() => onNavigate('dictionary')}>
          <Book size={20} /> 
          <span>{uiLang === 'EN' ? 'ARCHIVES' : <ruby>図鑑{furiganaEnabled && <rt>ずかん</rt>}</ruby>}</span>
        </button>
        <button className="secondary-btn" onClick={() => setIsSettingsOpen(true)}>
          <SettingsIcon size={20} /> 
          <span>{uiLang === 'EN' ? 'SETTINGS' : <ruby>設定{furiganaEnabled && <rt>せってい</rt>}</ruby>}</span>
        </button>
        <button 
          className={`secondary-btn ${furiganaEnabled ? 'active-toggle' : ''}`} 
          onClick={() => setFuriganaEnabled(!furiganaEnabled)}
        >
          <Type size={20} /> 
          <span>{uiLang === 'EN' ? 'RUBY' : 'ふりがな'}</span>
        </button>
        <button 
          className="secondary-btn" 
          onClick={() => setUiLang(uiLang === 'EN' ? 'JA' : 'EN')}
        >
          <Globe size={20} /> 
          <span>
            {uiLang === 'EN' 
              ? <>JA (<ruby>日本語{furiganaEnabled && <rt>にほんご</rt>}</ruby>)</> 
              : <>EN (<ruby>英語{furiganaEnabled && <rt>えいご</rt>}</ruby>)</>}
          </span>
        </button>
      </div>

      {/* Secret Admin Link */}
      <div className="admin-link-wrapper">
        <button className="admin-btn" onClick={() => onNavigate('admin' as ViewState)}>
          <Shield size={14} />
          <span>{uiLang === 'EN' ? 'ADMIN' : <ruby>管理{furiganaEnabled && <rt>かんり</rt>}</ruby>}</span>
        </button>
      </div>

      {isSettingsOpen && (
        <Settings 
          onClose={() => setIsSettingsOpen(false)} 
          uiLang={uiLang}
          setUiLang={setUiLang}
          furiganaEnabled={furiganaEnabled}
          setFuriganaEnabled={setFuriganaEnabled}
        />
      )}
    </div>
  );
};

export default Home;