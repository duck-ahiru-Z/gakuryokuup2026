"use client";

import React, { useEffect, useState } from 'react';
import type { ViewState, Difficulty } from '../types';
import Home from '../components/Home';
import Game from '../components/Game';
import Game2 from '../components/Game2';//デバック用
import Result from '../components/Result';
import Dictionary from '../components/Dictionary';
import Admin from '../components/Admin';
import ModeSelect from '../components/ModeSelect';
import { Terminal } from 'lucide-react';

function Page() {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [difficulty, setDifficulty] = useState<Difficulty>('NORMAL');
  const [selectedModeId, setSelectedModeId] = useState<string>('practical_1');

  // Global Settings State
  const [uiLang, setUiLang] = useState<'EN' | 'JA'>('JA');
  const [furiganaEnabled, setFuriganaEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [bgmVolume, setBgmVolume] = useState(50);
  const [sfxVolume, setSfxVolume] = useState(50);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  useEffect(() => {
    const savedLang = window.localStorage.getItem('shortcutAcademy.uiLang');
    const savedFurigana = window.localStorage.getItem('shortcutAcademy.furiganaEnabled');
    const savedDarkMode = window.localStorage.getItem('shortcutAcademy.darkMode');
    const savedBgmVolume = window.localStorage.getItem('shortcutAcademy.bgmVolume');
    const savedSfxVolume = window.localStorage.getItem('shortcutAcademy.sfxVolume');

    if (savedLang === 'EN' || savedLang === 'JA') setUiLang(savedLang);
    if (savedFurigana !== null) setFuriganaEnabled(savedFurigana === 'true');
    if (savedDarkMode !== null) setDarkMode(savedDarkMode === 'true');
    if (savedBgmVolume !== null) setBgmVolume(Number(savedBgmVolume));
    if (savedSfxVolume !== null) setSfxVolume(Number(savedSfxVolume));
    setSettingsLoaded(true);
  }, []);

  useEffect(() => {
    if (!settingsLoaded) return;
    window.localStorage.setItem('shortcutAcademy.uiLang', uiLang);
    window.localStorage.setItem('shortcutAcademy.furiganaEnabled', String(furiganaEnabled));
    window.localStorage.setItem('shortcutAcademy.darkMode', String(darkMode));
    window.localStorage.setItem('shortcutAcademy.bgmVolume', String(bgmVolume));
    window.localStorage.setItem('shortcutAcademy.sfxVolume', String(sfxVolume));
  }, [uiLang, furiganaEnabled, darkMode, bgmVolume, sfxVolume, settingsLoaded]);

  const updateUiLang = (lang: 'EN' | 'JA') => {
    setUiLang(lang);
    window.localStorage.setItem('shortcutAcademy.uiLang', lang);
  };

  const updateFuriganaEnabled = (enabled: boolean) => {
    setFuriganaEnabled(enabled);
    window.localStorage.setItem('shortcutAcademy.furiganaEnabled', String(enabled));
  };

  const updateDarkMode = (enabled: boolean) => {
    setDarkMode(enabled);
    window.localStorage.setItem('shortcutAcademy.darkMode', String(enabled));
  };

  // Apply dark mode to body
  React.useEffect(() => {
    if (darkMode) {
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
    }
  }, [darkMode]);

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <Home 
            onNavigate={setCurrentView} 
            difficulty={difficulty} 
            setDifficulty={setDifficulty} 
            uiLang={uiLang}
            setUiLang={updateUiLang}
            furiganaEnabled={furiganaEnabled}
            setFuriganaEnabled={updateFuriganaEnabled}
            darkMode={darkMode}
            setDarkMode={updateDarkMode}
            bgmVolume={bgmVolume}
            setBgmVolume={setBgmVolume}
            sfxVolume={sfxVolume}
            setSfxVolume={setSfxVolume}
          />
        );
      case 'modeSelect':
        return (
          <ModeSelect 
            onNavigate={setCurrentView}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            selectedModeId={selectedModeId}
            setSelectedModeId={setSelectedModeId}
            uiLang={uiLang}
            furiganaEnabled={furiganaEnabled}
          />
        );
      case 'game':
        return <Game onNavigate={setCurrentView} difficulty={difficulty} furiganaEnabled={furiganaEnabled} uiLang={uiLang} sfxVolume={sfxVolume} />;
      //game2はデバック用
      case 'game2' as any:
        return <Game2 onNavigate={setCurrentView} difficulty={difficulty} selectedModeId={selectedModeId} uiLang={uiLang} sfxVolume={sfxVolume} />;
      case 'result':
        return <Result onNavigate={setCurrentView} uiLang={uiLang} furiganaEnabled={furiganaEnabled} />;
      case 'dictionary':
        return <Dictionary onNavigate={setCurrentView} uiLang={uiLang} furiganaEnabled={furiganaEnabled} />;
      case 'admin':
        return <Admin onNavigate={setCurrentView} />;
      default:
        return (
          <Home 
            onNavigate={setCurrentView} 
            difficulty={difficulty} 
            setDifficulty={setDifficulty}
            uiLang={uiLang}
            setUiLang={updateUiLang}
            furiganaEnabled={furiganaEnabled}
            setFuriganaEnabled={updateFuriganaEnabled}
            darkMode={darkMode}
            setDarkMode={updateDarkMode}
            bgmVolume={bgmVolume}
            setBgmVolume={setBgmVolume}
            sfxVolume={sfxVolume}
            setSfxVolume={setSfxVolume}
          />
        );
    }
  };

  return (
    <div className="app-container">
      <header>
        <div className="logo" onClick={() => setCurrentView('home')} style={{ cursor: 'pointer' }}>
          <Terminal className="highlight" size={28} />
          <span>Shortcut<span className="highlight">English</span></span>
        </div>
      </header>
      <main className="main-content">
        {renderView()}
      </main>
    </div>
  );
}

export default Page;
