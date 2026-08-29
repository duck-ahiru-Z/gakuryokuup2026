import React, { useState, useEffect, useCallback } from 'react';
import type { ViewState, Difficulty, PracticalSet } from '../types';
import { storageUtils } from '../utils/storageUtils';
import { ArrowLeft, Trophy } from 'lucide-react';
import { useOS } from '../hooks/useOS';
import { useAudio } from '../hooks/useAudio';
import './Game2.css';

// Dynamic import of practical sets
import set1 from '../data/practical/set1.json';
import set2 from '../data/practical/set2.json';
import set3 from '../data/practical/set3.json';
import set4 from '../data/practical/set4.json';
import set5 from '../data/practical/set5.json';
import set6 from '../data/practical/set6.json';

const PRACTICAL_SETS: Record<string, PracticalSet> = {
  'practical_1': set1 as PracticalSet,
  'practical_2': set2 as PracticalSet,
  'practical_3': set3 as PracticalSet,
  'practical_4': set4 as PracticalSet,
  'practical_5': set5 as PracticalSet,
  'practical_6': set6 as PracticalSet,
};

interface GameProps {
  onNavigate: (view: ViewState) => void;
  difficulty: Difficulty;
  selectedModeId?: string;
}

const Game2: React.FC<GameProps> = ({ onNavigate, selectedModeId = 'practical_1' }) => {
  const os = useOS();
  const { playSound, speakWord } = useAudio();
  const isMac = os === 'Mac';
  
  const currentSet = PRACTICAL_SETS[selectedModeId] || PRACTICAL_SETS['practical_1'];

  const [currentStep, setCurrentStep] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [clearTime, setClearTime] = useState<number | null>(null);
  
  const [searchHighlighted, setSearchHighlighted] = useState(false);
  const [rightContent, setRightContent] = useState(currentSet.initialRightText || '');
  
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  
  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Allow F12/F5
      if (e.key === 'F12' || e.key === 'F5') return;
      e.preventDefault();

      if (showSuccessOverlay || clearTime !== null) return;
      
      const mission = currentSet.missions[currentStep];
      if (!mission) return;

      const modifierPressed = isMac ? e.metaKey : e.ctrlKey;
      let actionMatches = false;

      // In real scenario, we should parse mission.shortcutId from shortcuts.json 
      // But for Game2 simplicity, we assume Ctrl+key for practical mode mapping
      if (modifierPressed) {
        if (mission.shortcutId === 'search' && e.key.toLowerCase() === 'f') actionMatches = true;
        if (mission.shortcutId === 'copy' && e.key.toLowerCase() === 'c') actionMatches = true;
        if (mission.shortcutId === 'paste' && e.key.toLowerCase() === 'v') actionMatches = true;
        if (mission.shortcutId === 'undo' && e.key.toLowerCase() === 'z') actionMatches = true;
      }

      if (actionMatches) {
        playSound('success');
        speakWord(mission.shortcutId);

        // execute action
        const action = mission.successAction;
        if (action.type === 'highlight_left') {
          setSearchHighlighted(true);
        } else if (action.type === 'replace_right') {
          setRightContent(prev => prev.replace(action.replaceTarget || '', action.replaceWith || ''));
        } else if (action.type === 'append_right') {
          setRightContent(prev => prev + (action.textToAppend || ''));
        }

        storageUtils.addXP(50);
        setShowSuccessOverlay(true);

        setTimeout(() => {
          setShowSuccessOverlay(false);
          if (currentStep < currentSet.missions.length - 1) {
            setCurrentStep(prev => prev + 1);
          } else {
            playSound('clear');
            if (startTime) {
              setClearTime(Math.floor((Date.now() - startTime) / 1000));
              storageUtils.addXP(300);
            }
          }
        }, 1500);
      }
    },
    [currentStep, isMac, currentSet, startTime, showSuccessOverlay, clearTime, playSound, speakWord]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  if (!currentSet.missions || currentSet.missions.length === 0) {
    return (
      <div className="game2-container empty-state">
        <h2 className="title">Coming Soon</h2>
        <p>This practical mission is currently under development.</p>
        <button className="primary-btn mt-4" onClick={() => onNavigate('modeSelect')}>
          <ArrowLeft size={20} />
          戻る
        </button>
      </div>
    );
  }

  const currentMission = currentSet.missions[currentStep];

  return (
    <div className="game2-container">
      <div className="g2-header">
        <button className="secondary-btn" onClick={() => onNavigate('modeSelect')}>
          <ArrowLeft size={20} />
          <span>中断</span>
        </button>
        <h2 className="g2-title">{currentSet.titleJa}</h2>
        <div className="g2-progress">
          STEP {Math.min(currentStep + 1, currentSet.missions.length)} / {currentSet.missions.length}
        </div>
      </div>

      <div className="g2-workspace">
        <div className="g2-pane left-pane">
          <div className="pane-header">{currentSet.leftColumnTitleJa}</div>
          <div className="pane-content">
            {currentSet.initialLeftText && currentSet.initialLeftText.map((line, idx) => {
              const action = currentMission?.successAction;
              const isTarget = action?.type === 'highlight_left' && line.includes(action.targetText || '');
              return (
                <p key={idx} className={`${isTarget && searchHighlighted ? 'search-found' : ''}`}>
                  {line}
                </p>
              );
            })}
          </div>
        </div>

        <div className="g2-pane right-pane">
          <div className="pane-header">{currentSet.rightColumnTitleJa}</div>
          <div className="pane-content right-content-area">
            {rightContent.split('\n').map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="g2-mission-box">
        {clearTime !== null ? (
          <div className="g2-clear-state">
            <h3><Trophy className="icon-highlight" size={28} /> ALL MISSIONS CLEARED!</h3>
            <div className="g2-stats">
              <p>クリアタイム: <span className="highlight">{clearTime} 秒</span></p>
            </div>
            <button className="primary-btn g2-finish-btn" onClick={() => onNavigate('result')}>
              完了してリザルトへ <ArrowLeft size={20} style={{ transform: 'rotate(180deg)' }}/>
            </button>
          </div>
        ) : (
          <div className="g2-mission-info">
            <div className="m-header">
              <h3 className="m-title">{currentMission.titleJa}</h3>
              <p className="m-desc">{currentMission.descriptionJa}</p>
            </div>
          </div>
        )}
      </div>

      {showSuccessOverlay && (
        <div className="g2-success-overlay">
          <div className="g2-success-content">
            <span className="g2-success-text">SUCCESS!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game2;