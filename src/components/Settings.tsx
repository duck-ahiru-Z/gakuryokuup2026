import React, { useState } from 'react';
import { X, Volume2, VolumeX, Music, Moon, Sun } from 'lucide-react';
import './Settings.css';

interface SettingsProps {
  onClose: () => void;
  uiLang: 'EN' | 'JA';
  setUiLang: (lang: 'EN' | 'JA') => void;
  furiganaEnabled: boolean;
  setFuriganaEnabled: (enabled: boolean) => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose, uiLang, setUiLang, furiganaEnabled, setFuriganaEnabled }) => {
  // Mock states for the UI
  const [bgmVolume, setBgmVolume] = useState(50);
  const [sfxVolume, setSfxVolume] = useState(50);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="settings-overlay">
      <div className="settings-modal">
        <div className="settings-header">
          <h2>{uiLang === 'EN' ? 'SETTINGS' : <ruby>設定<rt>{furiganaEnabled && 'せってい'}</rt></ruby>}</h2>
          <button className="icon-btn close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="settings-content">
          
          <div className="setting-item">
            <div className="setting-label">
              <span>{uiLang === 'EN' ? 'LANGUAGE' : <ruby>言語<rt>{furiganaEnabled && 'げんご'}</rt></ruby>}</span>
            </div>
            <button 
              className={`toggle-btn ${uiLang === 'EN' ? 'on' : 'off'}`}
              onClick={() => setUiLang(uiLang === 'EN' ? 'JA' : 'EN')}
            >
              {uiLang === 'EN' ? 'EN' : 'JA'}
            </button>
          </div>

          <div className="setting-item">
            <div className="setting-label">
              <span>{uiLang === 'EN' ? 'RUBY (FURIGANA)' : 'ふりがな'}</span>
            </div>
            <button 
              className={`toggle-btn ${furiganaEnabled ? 'on' : 'off'}`}
              onClick={() => setFuriganaEnabled(!furiganaEnabled)}
            >
              {furiganaEnabled ? (uiLang === 'EN' ? 'ON' : 'オン') : (uiLang === 'EN' ? 'OFF' : 'オフ')}
            </button>
          </div>

          <div className="setting-item slider-item">
            <div className="setting-label">
              <Music size={20} />
              <span>{uiLang === 'EN' ? 'MUSIC' : <ruby>音楽<rt>{furiganaEnabled && 'おんがく'}</rt></ruby>}</span>
            </div>
            <div className="slider-wrapper">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={bgmVolume} 
                onChange={(e) => setBgmVolume(Number(e.target.value))}
                className="sharp-slider"
              />
              <span className="slider-value">
                {bgmVolume}<ruby>%<rt>{furiganaEnabled && 'ぱーせんと'}</rt></ruby>
              </span>
            </div>
          </div>

          <div className="setting-item slider-item">
            <div className="setting-label">
              {sfxVolume > 0 ? <Volume2 size={20} /> : <VolumeX size={20} />}
              <span>{uiLang === 'EN' ? 'SOUND EFFECTS' : <ruby>効果音<rt>{furiganaEnabled && 'こうかおん'}</rt></ruby>}</span>
            </div>
            <div className="slider-wrapper">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={sfxVolume} 
                onChange={(e) => setSfxVolume(Number(e.target.value))}
                className="sharp-slider"
              />
              <span className="slider-value">
                {sfxVolume}<ruby>%<rt>{furiganaEnabled && 'ぱーせんと'}</rt></ruby>
              </span>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-label">
              {darkMode ? <Moon size={20} /> : <Sun size={20} />}
              <span>{uiLang === 'EN' ? 'THEME' : <ruby>外観<rt>{furiganaEnabled && 'がいかん'}</rt></ruby>}</span>
            </div>
            <button 
              className={`toggle-btn ${darkMode ? 'on' : 'off'}`}
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode 
                ? (uiLang === 'EN' ? 'DARK' : <ruby>暗<rt>{furiganaEnabled && 'くら'}</rt></ruby>)
                : (uiLang === 'EN' ? 'LIGHT' : <ruby>明<rt>{furiganaEnabled && 'あか'}</rt></ruby>)
              }
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;
