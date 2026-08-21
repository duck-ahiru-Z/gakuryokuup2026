import React, { useState, useEffect } from 'react';
import type { ViewState, Difficulty } from '../types';
import { Play, Book, Settings as SettingsIcon, Type, Shield, Globe, Trophy, Moon, Sun } from 'lucide-react';
import Settings from './Settings';
import { parseRubyText } from '../utils/shortcutUtils';
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



  const MENU_ITEMS = [
    {
      id: 'dictionary',
      icon: Book,
      labelEn: 'ARCHIVES',
      labelJa: parseRubyText('[図鑑](ずかん)', furiganaEnabled),
      onClick: () => onNavigate('dictionary'),
      isActive: false
    },
    {
      id: 'status',
      icon: Trophy,
      labelEn: 'STATUS',
      labelJa: parseRubyText('[経験値](けいけんち)', furiganaEnabled),
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
      labelEn: <>EN ({parseRubyText('[英語](えいご)', furiganaEnabled)})</>,
      labelJa: <>JA ({parseRubyText('[日本語](にほんご)', furiganaEnabled)})</>,
      onClick: () => setUiLang(uiLang === 'EN' ? 'JA' : 'EN'),
      isActive: false
    },
    {
      id: 'settings',
      icon: SettingsIcon,
      labelEn: 'SETTINGS',
      labelJa: parseRubyText('[設定](せってい)', furiganaEnabled),
      onClick: () => setIsSettingsOpen(true),
      isActive: false
    },
    {
      id: 'theme',
      icon: darkMode ? Sun : Moon,
      labelEn: darkMode ? 'LIGHT MODE' : 'DARK MODE',
      labelJa: darkMode ? parseRubyText('[明](あか)るく', furiganaEnabled) : parseRubyText('[暗](くら)く', furiganaEnabled),
      onClick: () => setDarkMode(!darkMode),
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
          ショートカットキーの{parseRubyText('[語源](ごげん)', furiganaEnabled)}を知り、
          {parseRubyText('[英語](えいご)', furiganaEnabled)}とPC{parseRubyText('[操作](そうさ)', furiganaEnabled)}を
          {parseRubyText('[同時](どうじ)', furiganaEnabled)}にマスターしよう
        </p>
      </div>
      
      {/* Main Actions */}
      <div className="main-action-wrapper">
        <button className="primary-btn" onClick={() => onNavigate('modeSelect')}>
          <Play size={24} /> 
          <span>{uiLang === 'EN' ? 'SELECT' : parseRubyText('モード[選択](せんたく)', furiganaEnabled)}</span>
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