import React, { useEffect, useState } from 'react';
import type { ViewState, UserStats } from '../types';
import { storageUtils } from '../utils/storageUtils';
import { Trophy, ArrowLeft, Book, Activity, Crosshair, AlertCircle } from 'lucide-react';
import { parseRubyText, resolveKeys } from '../utils/shortcutUtils';
import { useOS } from '../hooks/useOS';
import { SHORTCUTS } from '../data/shortcutsData';
import gameModes from '../data/gameModes.json';
import './Result.css';

interface ResultProps {
  onNavigate: (view: ViewState) => void;
  uiLang: 'EN' | 'JA';
  furiganaEnabled: boolean;
}

const RANK_MAP: Record<string, string> = {
  'Trainee': '[訓練生](くんれんせい)',
  'Intermediate': '[一般](いっぱん)エージェント',
  'Advanced': '[上級](じょうきゅう)エージェント',
  'Expert': '[熟練者](じゅくれんしゃ)',
  'Master': 'マスター'
};

const Result: React.FC<ResultProps> = ({ onNavigate, uiLang, furiganaEnabled }) => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const os = useOS();

  useEffect(() => {
    setStats(storageUtils.getStats());
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'escape' || key === 'enter') {
        onNavigate('home');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNavigate]);

  if (!stats) return null;

  const nextRankTarget = Math.max(200, Math.ceil((stats.xp + 1) / 500) * 500);
  const progressPercent = Math.min(100, (stats.xp / nextRankTarget) * 100);

  const getRankName = (rankId: string) => {
    if (uiLang === 'EN') return rankId.toUpperCase();
    return parseRubyText(RANK_MAP[rankId] || rankId, furiganaEnabled);
  };

  const accuracy = stats.totalAttempts > 0 
    ? Math.round((stats.correctAttempts / stats.totalAttempts) * 100) 
    : 0;

  // Sort shortcut mistakes
  const sortedMistakes = Object.entries(stats.shortcutMistakes || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([id, count]) => {
      const sc = SHORTCUTS.find(s => s.id === id);
      return { shortcut: sc, count };
    });

  const getModeTitle = (modeId: string) => {
    const mode = gameModes.find(m => m.id === modeId);
    if (!mode) return modeId;
    return uiLang === 'EN' ? mode.titleEn : parseRubyText(mode.titleJa, furiganaEnabled);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="title">{uiLang === 'EN' ? 'PLAYER ' : parseRubyText('[プレイヤー](ぷれいやー)', furiganaEnabled)}<span className="highlight">{uiLang === 'EN' ? 'STATUS' : parseRubyText('[ステータス](すてーたす)', furiganaEnabled)}</span></h2>
      </div>

      <div className="dashboard-grid">
        {/* CARD 1: STATUS */}
        <div className="dash-card status-card">
          <div className="card-header">
            <Trophy className="icon highlight" />
            <h3>{uiLang === 'EN' ? 'CURRENT STATUS' : parseRubyText('[現在](げんざい)のステータス', furiganaEnabled)}</h3>
          </div>
          <div className="status-main">
            <div className="rank-display">
              <span className="rank-label">{uiLang === 'EN' ? 'RANK' : parseRubyText('[ランク](らんく)', furiganaEnabled)}</span>
              <span className="rank-value">{getRankName(stats.rank)}</span>
              {uiLang === 'JA' && <span className="rank-sub">{stats.rank.toUpperCase()}</span>}
            </div>
            <div className="xp-display">
              <div className="xp-text">
                <span className="xp-current">{stats.xp} XP</span>
                <span className="xp-target">/ {nextRankTarget} XP</span>
              </div>
              <div className="xp-bar-bg">
                <div className="xp-bar-fill" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>
            <div className="unlocked-stats">
              <Book size={16} />
              <span>{uiLang === 'EN' ? 'UNLOCKED ARCHIVES: ' : parseRubyText('[図鑑解放数](ずかんかいほうすう): ', furiganaEnabled)}</span>
              <span className="highlight fw-bold">{stats.unlockedShortcuts.length} / {SHORTCUTS.length}</span>
            </div>
          </div>
        </div>

        {/* CARD 2: RECENT ACTIVITY */}
        <div className="dash-card activity-card">
          <div className="card-header">
            <Activity className="icon text-primary" />
            <h3>{uiLang === 'EN' ? 'RECENT ACTIVITY' : parseRubyText('[最近](さいきん)の[活動](かつどう)', furiganaEnabled)}</h3>
          </div>
          <div className="activity-list">
            {stats.recentScores && stats.recentScores.length > 0 ? (
              stats.recentScores.map((score, idx) => (
                <div key={idx} className="activity-item">
                  <div className="activity-mode">{getModeTitle(score.modeId)}</div>
                  <div className="activity-score highlight">{score.score} XP</div>
                </div>
              ))
            ) : (
              <div className="empty-state">{uiLang === 'EN' ? 'No recent activity.' : parseRubyText('[最近](さいきん)の[活動](かつどう)はありません。', furiganaEnabled)}</div>
            )}
          </div>
        </div>

        {/* CARD 3: PERFORMANCE */}
        <div className="dash-card performance-card">
          <div className="card-header">
            <Crosshair className="icon text-success" />
            <h3>{uiLang === 'EN' ? 'PERFORMANCE' : parseRubyText('[総合](そうごう)パフォーマンス', furiganaEnabled)}</h3>
          </div>
          <div className="perf-stats">
            <div className="perf-circle">
              <svg viewBox="0 0 36 36" className="circular-chart">
                <path className="circle-bg"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path className="circle"
                  strokeDasharray={`${accuracy}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <text x="18" y="20.35" className="percentage">{accuracy}%</text>
              </svg>
              <div className="perf-label">{uiLang === 'EN' ? 'ACCURACY' : parseRubyText('[正解率](せいかいりつ)', furiganaEnabled)}</div>
            </div>
            <div className="perf-details">
              <div className="perf-row">
                <span>{uiLang === 'EN' ? 'Total Attempts' : parseRubyText('[総入力回数](そうにゅうりょくかいすう)', furiganaEnabled)}</span>
                <span className="fw-bold">{stats.totalAttempts}</span>
              </div>
              <div className="perf-row">
                <span>{uiLang === 'EN' ? 'Correct' : parseRubyText('[正解数](せいかいすう)', furiganaEnabled)}</span>
                <span className="fw-bold text-success">{stats.correctAttempts}</span>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 4: WEAK POINTS */}
        <div className="dash-card weak-card">
          <div className="card-header">
            <AlertCircle className="icon text-error" />
            <h3>{uiLang === 'EN' ? 'WEAK POINTS' : parseRubyText('[苦手](にがて)なキー', furiganaEnabled)}</h3>
          </div>
          <div className="weak-list">
            {sortedMistakes.length > 0 ? (
              sortedMistakes.map((mistake, idx) => (
                <div key={idx} className="weak-item">
                  <div className="weak-key">
                    {mistake.shortcut ? resolveKeys(mistake.shortcut, os).join('+') : 'Unknown'}
                  </div>
                  <div className="weak-count text-error">
                    {mistake.count} {uiLang === 'EN' ? 'misses' : parseRubyText('[ミス](みす)', furiganaEnabled)}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">{uiLang === 'EN' ? 'No data yet.' : parseRubyText('データがありません。', furiganaEnabled)}</div>
            )}
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button className="primary-btn" onClick={() => onNavigate('home')} title="Shortcut: Esc or Enter">
          <ArrowLeft size={20} /> 
          <span>{uiLang === 'EN' ? 'RETURN TO HOME' : parseRubyText('ホームへ[戻](もど)る', furiganaEnabled)}</span>
          <span className="enter-badge" style={{marginLeft: '10px'}}>Esc</span>
        </button>
      </div>
    </div>
  );
};

export default Result;