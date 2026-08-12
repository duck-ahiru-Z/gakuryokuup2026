import React, { useEffect, useState } from 'react';
import type { ViewState, UserStats } from '../types';
import { storageUtils } from '../utils/storageUtils';
import { Trophy, ArrowLeft, Book } from 'lucide-react';
import './Result.css';

interface ResultProps {
  onNavigate: (view: ViewState) => void;
}

const Result: React.FC<ResultProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    setStats(storageUtils.getStats());
  }, []);

  if (!stats) return null;

  const nextRankTarget = Math.max(200, Math.ceil((stats.xp + 1) / 500) * 500);
  const progressPercent = Math.min(100, (stats.xp / nextRankTarget) * 100);

  return (
    <div className="result-container">
      <div className="header-box">
        <h2 className="title">AGENT <span className="highlight">STATUS</span></h2>
      </div>

      <div className="stats-card">
        <div className="rank-section">
          <Trophy size={64} style={{ color: 'var(--accent-color)' }} />
          <div className="rank-info">
            <span className="label">CURRENT RANK</span>
            <span className="value">{stats.rank.toUpperCase()}</span>
          </div>
        </div>

        <div className="xp-section">
          <div className="xp-header">
            <span className="label">TOTAL EXPERIENCE</span>
            <span className="value" style={{ color: 'var(--accent-color)' }}>{stats.xp} XP</span>
          </div>
          <div className="progress-bars">
            <div className="bar-container">
              <div className="bar player-bar" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
          <p className="next-rank">NEXT RANK AT {nextRankTarget} XP</p>
        </div>
        
        <div className="unlocked-stats">
          <span className="label">UNLOCKED ARCHIVES:</span>
          <span className="value highlight">{stats.unlockedShortcuts.length} / 9</span>
        </div>
      </div>

      <div className="action-buttons">
        <button className="primary-btn" onClick={() => onNavigate('dictionary')}>
          <Book size={20} /> VIEW ARCHIVES
        </button>
        <button className="secondary-btn" onClick={() => onNavigate('home')}>
          <ArrowLeft size={20} /> RETURN TO BASE
        </button>
      </div>
    </div>
  );
};

export default Result;