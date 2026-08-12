import React from 'react';
import type { ViewState, Difficulty } from '../types';
import { Play, Book } from 'lucide-react';
import './Home.css';

interface HomeProps {
  onNavigate: (view: ViewState) => void;
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate, difficulty, setDifficulty }) => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="title">MASTER THE <br/> <span className="highlight">KEYBOARD</span></h1>
        <p className="subtitle">AIライバルとの対戦で、ショートカットと英語の語源を体得せよ。</p>
      </div>
      
      <div className="difficulty-container">
        <span className="diff-label">DIFFICULTY:</span>
        <div className="difficulty-selector">
          <button 
            className={`diff-btn ${difficulty === 'EASY' ? 'active' : ''}`}
            onClick={() => setDifficulty('EASY')}
          >
            EASY (超初心者)
          </button>
          <button 
            className={`diff-btn ${difficulty === 'NORMAL' ? 'active' : ''}`}
            onClick={() => setDifficulty('NORMAL')}
          >
            NORMAL (標準)
          </button>
          <button 
            className={`diff-btn ${difficulty === 'HARD' ? 'active' : ''}`}
            onClick={() => setDifficulty('HARD')}
          >
            HARD (むずい)
          </button>
        </div>
      </div>

      <div className="action-buttons">
        <button className="primary-btn" onClick={() => onNavigate('game')}>
          <Play size={20} /> MISSION START
        </button>
        <button className="secondary-btn" onClick={() => onNavigate('dictionary')}>
          <Book size={20} /> ARCHIVES
        </button>
      </div>
    </div>
  );
};

export default Home;