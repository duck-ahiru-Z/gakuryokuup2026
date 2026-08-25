import React, { useEffect, useState, useCallback } from 'react';
import type { ViewState, Difficulty } from '../types';
import { useGameState } from '../hooks/useGameState';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';
import { storageUtils } from '../utils/storageUtils';
import  Keyboard  from './Keyboard';
import { parseRubyText, resolveKeys } from '../utils/shortcutUtils';
import { DisableContextMenu } from './DisableContextMenu'; 
import './Game.css';

import { useOS } from '../hooks/useOS';

interface GameProps {
  onNavigate: (view: ViewState) => void;
  difficulty: Difficulty;
  furiganaEnabled: boolean;
  uiLang: 'EN' | 'JA';
}

const Game: React.FC<GameProps> = ({ onNavigate, difficulty, furiganaEnabled, uiLang }) => {
  const os = useOS();
  const [finalScore, setFinalScore] = useState<number | null>(null);

  const handleGameEnd = (score: number) => {
    storageUtils.addXP(score);
    storageUtils.recordGameResult(difficulty, score);
    setFinalScore(score);
  };

  const {
    currentMission,
    playerScore,
    timeLeft,
    showExplanation,
    handleSuccess,
  } = useGameState(finalScore === null, difficulty, handleGameEnd);

  const handleAttempt = useCallback((keys: Set<string>) => {
    if (currentMission && !showExplanation) {
      // Create a temporary array of pressed keys for checking
      const keysArray = Array.from(keys);
      const targetKeys = resolveKeys(currentMission, os);
      let isMatch = keysArray.length === targetKeys.length;
      if (isMatch) {
        for (const targetKey of targetKeys) {
          if (!keys.has(targetKey)) {
            isMatch = false;
            break;
          }
        }
      }

      if (isMatch) {
        storageUtils.recordAttempt(true, currentMission.id);
        storageUtils.addXP(0, currentMission.id); 
        handleSuccess();
        clearKeys();
      } else {
        storageUtils.recordAttempt(false, currentMission.id);
      }
    }
  }, [currentMission, showExplanation, handleSuccess]);

  const { pressedKeys, clearKeys } = useKeyboardShortcut(finalScore === null, handleAttempt);

  if (finalScore !== null) {
    return (
      <div className="game-over-container">
        <h2 className="title">{uiLang === 'EN' ? 'TIME ' : 'タイム'}<span className="highlight">{uiLang === 'EN' ? 'UP' : 'アップ'}</span></h2>
        <div className="final-stats">
          <div className="stat-row">
            <span>{uiLang === 'EN' ? 'FINAL SCORE:' : '最終スコア:'}</span>
            <span className="highlight">{finalScore}</span>
          </div>
        </div>
        <button className="primary-btn mt-2" onClick={() => onNavigate('result')}>
          {uiLang === 'EN' ? 'VIEW STATUS' : 'ステータスを確認'}
        </button>
      </div>
    );
  }

  return (
    <DisableContextMenu>
      <div className="game-container">
        <div className="status-bar">
          <div className="score-box">
            <span className="label">{uiLang === 'EN' ? 'SCORE' : 'スコア'}</span>
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
              <h3 className="success-text">{uiLang === 'EN' ? 'SUCCESS' : '正解！'}</h3>
              <div className="word-header">
                <span className="command">{currentMission.commandName}</span>
                <span className="meaning">
                  {uiLang === 'EN' && currentMission.wordMeaningEn ? currentMission.wordMeaningEn : parseRubyText(currentMission.wordMeaning, furiganaEnabled)}
                </span>
              </div>
              <div className="info-box">
                <p className="etymology">
                  <strong>{uiLang === 'EN' ? 'ORIGIN:' : '語源:'}</strong>{' '}
                  {uiLang === 'EN' && currentMission.etymologyEn ? currentMission.etymologyEn : parseRubyText(currentMission.etymology, furiganaEnabled)}
                </p>
                <p className="example">
                  <strong>{uiLang === 'EN' ? 'EXAMPLE:' : '例文:'}</strong>{' '}
                  {uiLang === 'EN' && currentMission.exampleSentenceEn ? currentMission.exampleSentenceEn : parseRubyText(currentMission.exampleSentence, furiganaEnabled)}
                </p>
              </div>
            </div>
          ) : (
            <div className="mission-card">
              <p className="mission-desc">
                {currentMission 
                  ? (uiLang === 'EN' && currentMission.descriptionEn 
                      ? currentMission.descriptionEn 
                      : parseRubyText(currentMission.description, furiganaEnabled)) 
                  : ''}
              </p>
              <div className="target-keys">
                {difficulty === 'HARD' ? (
                  <span className="key-badge highlight">?</span>
                ) : (
                  currentMission && resolveKeys(currentMission, os).map((displayKey, i) => {
                    return (
                      <React.Fragment key={i}>
                        <span className="key-badge">{displayKey}</span>
                        {i < resolveKeys(currentMission, os).length - 1 && <span className="plus-sign">+</span>}
                      </React.Fragment>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        <div className="keyboard-area">
          <Keyboard />
        </div>
      </div>
    </DisableContextMenu>
  );
};

export default Game;