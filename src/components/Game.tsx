import React, { useEffect, useState, useCallback } from 'react';
import type { ViewState, Difficulty } from '../types';
import { useGameState } from '../hooks/useGameState';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';
import { useAudio } from '../hooks/useAudio';
import { storageUtils } from '../utils/storageUtils';
import  Keyboard  from './Keyboard';
import { parseRubyText, resolveKeys } from '../utils/shortcutUtils';
import { DisableContextMenu } from './DisableContextMenu'; 
import { DictionaryCard } from './DictionaryCard';
import { useOS } from '../hooks/useOS';
import './Game.css';
// import Dictionary CSS so that the card styles apply properly
import './Dictionary.css';

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
  const os = useOS();

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

  const { playSound, speakWord } = useAudio();

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
        playSound('success');
        // Read out the command name if it exists
        if (currentMission.commandName) {
           speakWord(currentMission.commandName);
        }
        
        storageUtils.recordAttempt(true, currentMission.id);
        storageUtils.addXP(0, currentMission.id); 
        handleSuccess();
        clearKeys();
      } else {
        playSound('error');
        storageUtils.recordAttempt(false, currentMission.id);
      }
    }
  }, [currentMission, showExplanation, handleSuccess, playSound, speakWord]);

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
            <div className="explanation-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '1rem' }}>
              <h3 className="success-text" style={{margin: 0, fontSize: '2rem'}}>{uiLang === 'EN' ? 'SUCCESS' : '正解！'}</h3>
              <div style={{width: '100%', maxWidth: '500px', textAlign: 'left', animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'}}>
                <DictionaryCard 
                  sc={currentMission} 
                  os={os} 
                  uiLang={uiLang} 
                  furiganaEnabled={furiganaEnabled} 
                  isUnlocked={true} 
                />
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