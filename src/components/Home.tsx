import React, { useState, useEffect } from 'react';
import type { ViewState, Difficulty } from '../types';
import { Play, Book, Settings as SettingsIcon, Type, Shield, Globe, Trophy } from 'lucide-react';
import Settings from './Settings';
import './Home.css';

interface HomeProps {
  onNavigate: (view: ViewState) => void;
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  uiLang: 'EN' | 'JA';
  setUiLang: (lang: 'EN' | 'JA') => void;
  furiganaEnabled: boolean;
  setFuriganaEnabled: (enabled: boolean) => void;
  darkMode: boolean;
  setDarkMode: (enabled: boolean) => void;
}

const Home: React.FC<HomeProps> = ({ 
  onNavigate, difficulty, setDifficulty, 
  uiLang, setUiLang, furiganaEnabled, setFuriganaEnabled, darkMode, setDarkMode 
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const APP_TITLE = "Shortcut English";

  const renderJa = (text: string, rubyText: string) => {
    return furiganaEnabled ? <ruby>{text}<rt>{rubyText}</rt></ruby> : text;
  };

  return (
    <div className="home-container">
      {/* Title Section */}
      <div className="hero-section">
        <div className="title-wrapper">
          <h1 className="title">{APP_TITLE}</h1>
        </div>
        <p className="subtitle">
          ショートカットキーの{renderJa('語源', 'ごげん')}を知り、
          {renderJa('英語', 'えいご')}とPC{renderJa('操作', 'そうさ')}を
          {renderJa('同時', 'どうじ')}にマスターしよう
        </p>
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
        {/* Row 1 */}
        <button className="secondary-btn" onClick={() => onNavigate('dictionary')}>
          <Book size={20} /> 
          <span>{uiLang === 'EN' ? 'ARCHIVES' : renderJa('図鑑', 'ずかん')}</span>
        </button>
        <button className="secondary-btn" onClick={() => onNavigate('result')}>
          <Trophy size={20} />
          <span>{uiLang === 'EN' ? 'STATUS' : renderJa('経験値', 'けいけんち')}</span>
        </button>
        
        {/* Row 2 */}
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
              ? <>JA ({renderJa('日本語', 'にほんご')})</> 
              : <>EN ({renderJa('英語', 'えいご')})</>}
          </span>
        </button>

        {/* Row 3 */}
        <button className="secondary-btn" onClick={() => setIsSettingsOpen(true)}>
          <SettingsIcon size={20} /> 
          <span>{uiLang === 'EN' ? 'SETTINGS' : renderJa('設定', 'せってい')}</span>
        </button>
        <div className="empty-slot"></div>
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
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      )}
    </div>
  );
};

export default Home;