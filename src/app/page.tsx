"use client";

import React, { useEffect, useRef, useState } from 'react';
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
  const [isBgmPlaying, setIsBgmPlaying] = useState(false);
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const savedModeId = window.localStorage.getItem('shortcutAcademy.selectedModeId');
    if (savedModeId) setSelectedModeId(savedModeId);
  }, []);

  const updateSelectedModeId = (modeId: string | null) => {
    if (!modeId) return;
    setSelectedModeId(modeId);
    window.localStorage.setItem('shortcutAcademy.selectedModeId', modeId);
  };

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

  // BGMは最初のユーザー操作後に再生し、画面遷移中も継続する
  useEffect(() => {
    if (!settingsLoaded) return;

    const bgm = new Audio('/audio/bgm/shortcut-english-main.mp3');
    bgm.loop = true;
    bgm.preload = 'auto';
    bgm.volume = bgmVolume / 100;
    bgmRef.current = bgm;

    const startBgm = () => {
      if (bgm.volume <= 0 || !bgm.paused) return;
      bgm.play().then(() => setIsBgmPlaying(true)).catch(() => {
        // ブラウザの自動再生制限中は、次のユーザー操作で再試行する
      });
    };

    const handlePause = () => setIsBgmPlaying(false);
    const handlePlay = () => setIsBgmPlaying(true);
    bgm.addEventListener('pause', handlePause);
    bgm.addEventListener('play', handlePlay);

    window.addEventListener('pointerdown', startBgm);
    window.addEventListener('keydown', startBgm);

    return () => {
      window.removeEventListener('pointerdown', startBgm);
      window.removeEventListener('keydown', startBgm);
      bgm.removeEventListener('pause', handlePause);
      bgm.removeEventListener('play', handlePlay);
      bgm.pause();
      bgm.src = '';
      bgmRef.current = null;
      setIsBgmPlaying(false);
    };
  }, [settingsLoaded]);

  useEffect(() => {
    if (!bgmRef.current) return;
    bgmRef.current.volume = bgmVolume / 100;
    if (bgmVolume <= 0) {
      bgmRef.current.pause();
      setIsBgmPlaying(false);
    }
  }, [bgmVolume]);

  const toggleBgm = () => {
    const bgm = bgmRef.current;
    if (!bgm || bgmVolume <= 0) return;

    if (bgm.paused) {
      bgm.play().then(() => setIsBgmPlaying(true)).catch(() => {
        // ブラウザが再生を拒否した場合は、状態を再生中にしない
      });
    } else {
      bgm.pause();
      setIsBgmPlaying(false);
    }
  };

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
            isBgmPlaying={isBgmPlaying}
            onToggleBgm={toggleBgm}
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
            setSelectedModeId={updateSelectedModeId}
            uiLang={uiLang}
            furiganaEnabled={furiganaEnabled}
          />
        );
      case 'game':
        return <Game onNavigate={setCurrentView} difficulty={difficulty} furiganaEnabled={furiganaEnabled} uiLang={uiLang} sfxVolume={sfxVolume} />;
      //game2はデバック用
      case 'game2' as any:
        return <Game2 onNavigate={setCurrentView} difficulty={difficulty} selectedModeId={selectedModeId} uiLang={uiLang} furiganaEnabled={furiganaEnabled} sfxVolume={sfxVolume} />;
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
            isBgmPlaying={isBgmPlaying}
            onToggleBgm={toggleBgm}
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
          <span>Shortcut{ " " }<span className="highlight">English</span></span>
        </div>
      </header>
      <main className="main-content">
        {renderView()}
      </main>
    </div>
  );
}

export default Page;
