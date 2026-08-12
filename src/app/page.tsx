"use client";

import { useState } from 'react';
import '../App.css'; // Will be updated if App.css is moved, or we can keep it as is
import type { ViewState, Difficulty } from '../types';
import Home from '../components/Home';
import Game from '../components/Game';
import Result from '../components/Result';
import Dictionary from '../components/Dictionary';
import { Terminal } from 'lucide-react';

function Page() {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [difficulty, setDifficulty] = useState<Difficulty>('NORMAL');

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home onNavigate={setCurrentView} difficulty={difficulty} setDifficulty={setDifficulty} />;
      case 'game':
        return <Game onNavigate={setCurrentView} difficulty={difficulty} />;
      case 'result':
        return <Result onNavigate={setCurrentView} />;
      case 'dictionary':
        return <Dictionary onNavigate={setCurrentView} />;
      default:
        return <Home onNavigate={setCurrentView} difficulty={difficulty} setDifficulty={setDifficulty} />;
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
