"use client";

import React, { useState } from 'react';
import '../App.css'; // Will be updated if App.css is moved, or we can keep it as is
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
            setUiLang={setUiLang}
            furiganaEnabled={furiganaEnabled}
            setFuriganaEnabled={setFuriganaEnabled}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
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
        return <Game onNavigate={setCurrentView} difficulty={difficulty} furiganaEnabled={furiganaEnabled} uiLang={uiLang} />;
      //game2はデバック用
      case 'game2' as any:
        return <Game2 onNavigate={setCurrentView} difficulty={difficulty} selectedModeId={selectedModeId} />;
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
            setUiLang={setUiLang}
            furiganaEnabled={furiganaEnabled}
            setFuriganaEnabled={setFuriganaEnabled}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        );
    }
  };

  return (
    <div className="app-container">
      <header>
        <div className="logo" onClick={() => setCurrentView('home')} style={{ cursor: 'pointer' }}>
          <Terminal className="highlight" size={28} />
          <span>Shortcut<span className="highlight">Academy</span></span>
        </div>
      </header>
      <main className="main-content">
        {renderView()}
      </main>
    </div>
  );
}

export default Page;
