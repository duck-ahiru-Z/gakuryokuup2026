import React, { useEffect, useState } from 'react';
import type { ViewState, UserStats } from '../types';
import { storageUtils } from '../utils/storageUtils';
import { Trophy, ArrowLeft, Book, Activity, Crosshair, AlertCircle } from 'lucide-react';
import { parseRubyText } from '../utils/shortcutUtils';
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

  useEffect(() => {
    setStats(storageUtils.getStats());
  }, []);

  if (!stats) return null;

  const nextRankTarget = Math.max(200, Math.ceil((stats.xp + 1) / 500) * 500);
  const progressPercent = Math.min(100, (stats.xp / nextRankTarget) * 100);

  const renderJa = (text: string, rubyText: string) => {
    return furiganaEnabled ? <ruby>{text}<rt>{rubyText}</rt></ruby> : text;
  };

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
        <h2 className="title">{uiLang === 'EN' ? 'PLAYER ' : renderJa('プレイヤー', 'ぷれいやー')}<span className="highlight">{uiLang === 'EN' ? 'STATUS' : renderJa('ステータス', 'すてーたす')}</span></h2>
      </div>

      <div className="dashboard-grid">
        {/* CARD 1: STATUS */}
        <div className="dash-card status-card">
          <div className="card-header">
            <Trophy className="icon highlight" />
            <h3>{uiLang === 'EN' ? 'CURRENT STATUS' : renderJa('現在のステータス', 'げんざいのすてーたす')}</h3>
          </div>
          <div className="status-main">
            <div className="rank-display">
              <span className="rank-label">{uiLang === 'EN' ? 'RANK' : renderJa('ランク', 'らんく')}</span>
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
              <span>{uiLang === 'EN' ? 'UNLOCKED ARCHIVES: ' : renderJa('図鑑解放数: ', 'ずかんかいほうすう: ')}</span>
              <span className="highlight fw-bold">{stats.unlockedShortcuts.length} / {SHORTCUTS.length}</span>
            </div>
          </div>
        </div>

        {/* CARD 2: RECENT ACTIVITY */}
        <div className="dash-card activity-card">
          <div className="card-header">
            <Activity className="icon text-primary" />
            <h3>{uiLang === 'EN' ? 'RECENT ACTIVITY' : renderJa('最近の活動', 'さいきんのかつどう')}</h3>
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
              <div className="empty-state">{uiLang === 'EN' ? 'No recent activity.' : renderJa('最近の活動はありません。', 'さいきんのかつどうはありません。')}</div>
            )}
          </div>
        </div>

        {/* CARD 3: PERFORMANCE */}
        <div className="dash-card performance-card">
          <div className="card-header">
            <Crosshair className="icon text-success" />
            <h3>{uiLang === 'EN' ? 'PERFORMANCE' : renderJa('総合パフォーマンス', 'そうごうぱふぉーまんす')}</h3>
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
              <div className="perf-label">{uiLang === 'EN' ? 'ACCURACY' : renderJa('正解率', 'せいかいりつ')}</div>
            </div>
            <div className="perf-details">
              <div className="perf-row">
                <span>{uiLang === 'EN' ? 'Total Attempts' : renderJa('総入力回数', 'そうにゅうりょくかいすう')}</span>
                <span className="fw-bold">{stats.totalAttempts}</span>
              </div>
              <div className="perf-row">
                <span>{uiLang === 'EN' ? 'Correct' : renderJa('正解数', 'せいかいすう')}</span>
                <span className="fw-bold text-success">{stats.correctAttempts}</span>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 4: WEAK POINTS */}
        <div className="dash-card weak-card">
          <div className="card-header">
            <AlertCircle className="icon text-error" />
            <h3>{uiLang === 'EN' ? 'WEAK POINTS' : renderJa('苦手なキー', 'にがてなきー')}</h3>
          </div>
          <div className="weak-list">
            {sortedMistakes.length > 0 ? (
              sortedMistakes.map((mistake, idx) => (
                <div key={idx} className="weak-item">
                  <div className="weak-key">
                    {mistake.shortcut ? mistake.shortcut.keys.join('+') : 'Unknown'}
                  </div>
                  <div className="weak-count text-error">
                    {mistake.count} {uiLang === 'EN' ? 'misses' : renderJa('ミス', 'みす')}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">{uiLang === 'EN' ? 'No data yet.' : renderJa('データがありません。', 'でーたがありません。')}</div>
            )}
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button className="primary-btn" onClick={() => onNavigate('home')}>
          <ArrowLeft size={20} /> 
          <span>{uiLang === 'EN' ? 'RETURN TO HOME' : renderJa('ホームへ戻る', 'ほーむへもどる')}</span>
        </button>
      </div>
    </div>
  );
};

export default Result;