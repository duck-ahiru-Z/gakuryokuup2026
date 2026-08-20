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

  const MENU_ITEMS = [
    {
      id: 'dictionary',
      icon: Book,
      labelEn: 'ARCHIVES',
      labelJa: renderJa('図鑑', 'ずかん'),
      onClick: () => onNavigate('dictionary'),
      isActive: false
    },
    {
      id: 'status',
      icon: Trophy,
      labelEn: 'STATUS',
      labelJa: renderJa('経験値', 'けいけんち'),
      onClick: () => onNavigate('result'),
      isActive: false
    },
    {
      id: 'furigana',
      icon: Type,
      labelEn: 'RUBY',
      labelJa: 'ふりがな',
      onClick: () => setFuriganaEnabled(!furiganaEnabled),
      isActive: furiganaEnabled
    },
    {
      id: 'lang',
      icon: Globe,
      labelEn: <>EN ({renderJa('英語', 'えいご')})</>,
      labelJa: <>JA ({renderJa('日本語', 'にほんご')})</>,
      onClick: () => setUiLang(uiLang === 'EN' ? 'JA' : 'EN'),
      isActive: false
    },
    {
      id: 'settings',
      icon: SettingsIcon,
      labelEn: 'SETTINGS',
      labelJa: renderJa('設定', 'せってい'),
      onClick: () => setIsSettingsOpen(true),
      isActive: false
    }
  ];

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
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <button 
              key={item.id} 
              className={`secondary-btn ${item.isActive ? 'active-toggle' : ''}`} 
              onClick={item.onClick}
            >
              <Icon size={20} /> 
              <span>{uiLang === 'EN' ? item.labelEn : item.labelJa}</span>
            </button>
          );
        })}
        <div className="empty-slot"></div>
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