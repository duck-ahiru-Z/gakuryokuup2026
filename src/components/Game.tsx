import React, { useEffect, useState } from 'react';
import type { ViewState, Difficulty } from '../types';
import { useGameState } from '../hooks/useGameState';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';
import { storageUtils } from '../utils/storageUtils';
import  Keyboard  from './Keyboard';
import './Game.css';

interface GameProps {
  onNavigate: (view: ViewState) => void;
  difficulty: Difficulty;
}

const Game: React.FC<GameProps> = ({ onNavigate, difficulty }) => {
  const [finalScore, setFinalScore] = useState<number | null>(null);

  const handleGameEnd = (score: number) => {
    storageUtils.addXP(score);
    setFinalScore(score);
  };

  const {
    currentMission,
    playerScore,
    timeLeft,
    showExplanation,
    handleSuccess,
  } = useGameState(finalScore === null, difficulty, handleGameEnd);

  const { pressedKeys, checkMatch, clearKeys } = useKeyboardShortcut(finalScore === null);

  useEffect(() => {
    if (currentMission && !showExplanation) {
      if (checkMatch(currentMission.keys)) {
        storageUtils.addXP(0, currentMission.id); 
        handleSuccess();
        clearKeys();
      }
    }
  }, [pressedKeys, currentMission, checkMatch, handleSuccess, showExplanation, clearKeys]);

  if (finalScore !== null) {
    return (
      <div className="game-over-container">
        <h2 className="title">TIME <span className="highlight">UP</span></h2>
        <div className="final-stats">
          <div className="stat-row">
            <span>FINAL SCORE:</span>
            <span className="highlight">{finalScore}</span>
          </div>
        </div>
        <button className="primary-btn mt-2" onClick={() => onNavigate('result')}>VIEW STATUS</button>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="status-bar">
        <div className="score-box">
          <span className="label">SCORE</span>
          <span className="value" style={{ color: 'var(--accent-color)' }}>{playerScore}</span>
        </div>
        <div className="timer">
          00:{timeLeft.toString().padStart(2, '0')}
        </div>
      </div>

      <div className="progress-bars">
        <div className="bar-container">
          <div className="bar player-bar" style={{ width: `${Math.min(playerScore / 20, 100)}%` }}></div>
        </div>
      </div>

      <div className="mission-area">
        {showExplanation && currentMission ? (
          <div className="explanation-card">
            <h3 className="success-text">SYSTEM OVERRIDE SUCCESS</h3>
            <div className="word-header">
              <span className="command">{currentMission.commandName}</span>
              <span className="meaning">{currentMission.wordMeaning}</span>
            </div>
            <div className="info-box">
              <p className="etymology"><strong>ORIGIN:</strong> {currentMission.etymology}</p>
              <p className="example"><strong>EXAMPLE:</strong> {currentMission.exampleSentence}</p>
            </div>
          </div>
        ) : (
          <div className="mission-card">
            <h3 className="mission-title">CURRENT DIRECTIVE</h3>
            <p className="mission-desc">{currentMission?.description}</p>
            <div className="target-keys">
              {difficulty === 'HARD' ? (
                <span className="key-badge highlight">?</span>
              ) : (
                currentMission?.keys.map((k, i) => {
                  let displayKey = k;
                  if (k === 'Ctrl') {
                    displayKey = window.navigator.userAgent.toUpperCase().indexOf('MAC') >= 0 ? '⌘ Cmd' : 'Ctrl';
                  }
                  return (
                    <React.Fragment key={i}>
                      <span className="key-badge">{displayKey}</span>
                      {i < currentMission.keys.length - 1 && <span className="plus-sign">+</span>}
                    </React.Fragment>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      <div className="keyboard-area">
        <Keyboard pressedKeys={pressedKeys} />
      </div>
    </div>
  );
};

export default Game;