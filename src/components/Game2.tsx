import React, { useState, useEffect, useCallback } from 'react';
import type { ViewState, Difficulty, PracticalSet } from '../types';
import { storageUtils } from '../utils/storageUtils';
import { ArrowLeft, Trophy } from 'lucide-react';
import { useOS } from '../hooks/useOS';
import { useAudio } from '../hooks/useAudio';
import Keyboard from './Keyboard';
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
  uiLang: 'EN' | 'JA';
  sfxVolume: number;
}

const Game2: React.FC<GameProps> = ({ onNavigate, selectedModeId = 'practical_1', uiLang, sfxVolume }) => {
  const os = useOS();
  const { playSound, speakWord } = useAudio(sfxVolume);
  const isMac = os === 'Mac';
  
  const currentSet = PRACTICAL_SETS[selectedModeId] || PRACTICAL_SETS['practical_1'];

  const [currentStep, setCurrentStep] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [clearTime, setClearTime] = useState<number | null>(null);
  const [isNewRecord, setIsNewRecord] = useState(false);
  
  const [searchHighlighted, setSearchHighlighted] = useState(false);
  const [rightContent, setRightContent] = useState(currentSet.initialRightText || '');
  const [centeredLine, setCenteredLine] = useState<string | null>(null);
  
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [hintedSteps, setHintedSteps] = useState<number[]>([]);
  const [hintMessage, setHintMessage] = useState<string | null>(null);

  const getShortcutHint = (shortcutId: string) => {
    const hints: Record<string, string> = {
      select_all: 'Ctrl + A', search: 'Ctrl + F', copy: 'Ctrl + C', paste: 'Ctrl + V',
      cut: 'Ctrl + X', undo: 'Ctrl + Z', redo: 'Ctrl + Y', italic: 'Ctrl + I',
      underline: 'Ctrl + U', insert_link: 'Ctrl + K', paste_plain: 'Ctrl + Shift + V',
      save_as: 'Ctrl + Shift + S', left_align: 'Ctrl + L', zoom_in: 'Ctrl + +',
      zoom_out: 'Ctrl + -', zoom_reset: 'Ctrl + 0', reopen_tab: 'Ctrl + Shift + T',
      replace: 'Ctrl + H', bold: 'Ctrl + B', center_align: 'Ctrl + E', save: 'Ctrl + S'
    };
    return hints[shortcutId] || shortcutId;
  };

  const handleHint = () => {
    const mission = currentSet.missions[currentStep];
    if (!mission) return;
    if (!hintedSteps.includes(currentStep)) {
      if (!storageUtils.spendXP(10)) {
        setHintMessage(uiLang === 'EN' ? 'You need 10 XP to use a hint.' : 'ヒントには10XP必要です。');
        return;
      }
      setHintedSteps(prev => [...prev, currentStep]);
    }
    setHintMessage(
      uiLang === 'EN'
        ? `Try pressing ${getShortcutHint(mission.shortcutId)}.`
        : `「${getShortcutHint(mission.shortcutId)}」を押してみましょう。`
    );
  };

  const handleSkip = () => {
    if (!storageUtils.spendXP(25)) {
      setHintMessage(uiLang === 'EN' ? 'You need 25 XP to skip a mission.' : 'スキップには25XP必要です。');
      return;
    }

    setHintMessage(null);
    if (currentStep < currentSet.missions.length - 1) {
      setCurrentStep(prev => prev + 1);
      return;
    }

    playSound('clear');
    if (startTime) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setIsNewRecord(storageUtils.recordPracticalTime(selectedModeId, elapsed));
      setClearTime(elapsed);
      storageUtils.addXP(300);
    }
  };

  const startPractice = useCallback(() => {
    setStartTime(Date.now());
    setHasStarted(true);
  }, []);

  const advanceAfterSuccess = useCallback(() => {
    setShowSuccessOverlay(false);
    if (currentStep < currentSet.missions.length - 1) {
      setCurrentStep(prev => prev + 1);
      return;
    }

    playSound('clear');
    if (startTime) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setIsNewRecord(storageUtils.recordPracticalTime(selectedModeId, elapsed));
      setClearTime(elapsed);
      storageUtils.addXP(300);
    }
  }, [currentStep, currentSet.missions.length, playSound, selectedModeId, startTime]);

  useEffect(() => {
    if (hasStarted) return;

    const handlePrepKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        startPractice();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onNavigate('modeSelect');
      }
    };

    window.addEventListener('keydown', handlePrepKeyDown);
    return () => window.removeEventListener('keydown', handlePrepKeyDown);
  }, [hasStarted, onNavigate, startPractice]);

  // ★ キー識別用ヘルパー関数（e.codeからアルファベットを抽出、またはe.keyを小文字化）
  const getKeyName = (e: KeyboardEvent): string[] => {
    const keys: string[] = [e.key.toLowerCase()];
    // e.code が "KeyF" などの場合は "f" も一緒に追加して確実にマッチさせる
    if (e.code.startsWith('Key')) {
      keys.push(e.code.replace('Key', '').toLowerCase());
    }
    return keys;
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Allow F12/F5
      if (e.key === 'F12' || e.key === 'F5') return;
      e.preventDefault();

      if (!hasStarted) return;

      if (clearTime !== null) {
        if (e.key === 'Enter') {
          onNavigate('result');
        }
        return;
      }
      if (showSuccessOverlay) {
        if (e.key === 'Enter') {
          advanceAfterSuccess();
        }
        return;
      }
      
      const mission = currentSet.missions[currentStep];
      if (!mission) return;

      const modifierPressed = isMac ? e.metaKey : e.ctrlKey;
      let actionMatches = false;

      // ★ e.code による判定（Ctrl同時押し時のe.key文字化け対策）
      const pressedChar = e.code.startsWith('Key') 
        ? e.code.replace('Key', '').toLowerCase() 
        : e.key.toLowerCase();

      // 標準の修飾キー（Windows: Ctrl, Mac: Cmd）を使用するショートカット
      if (modifierPressed) {
        if (mission.shortcutId === 'select_all' && pressedChar === 'a') actionMatches = true;
        if (mission.shortcutId === 'search' && pressedChar === 'f') actionMatches = true;
        if (mission.shortcutId === 'copy' && pressedChar === 'c') actionMatches = true;
        if (mission.shortcutId === 'paste' && pressedChar === 'v') actionMatches = true;
        if (mission.shortcutId === 'cut' && pressedChar === 'x') actionMatches = true;
        if (mission.shortcutId === 'undo' && pressedChar === 'z') actionMatches = true;
        if (mission.shortcutId === 'redo' && (isMac ? (pressedChar === 'z' && e.shiftKey) : pressedChar === 'y')) actionMatches = true;
        if (mission.shortcutId === 'italic' && pressedChar === 'i') actionMatches = true;
        if (mission.shortcutId === 'underline' && pressedChar === 'u') actionMatches = true;
        if (mission.shortcutId === 'insert_link' && pressedChar === 'k') actionMatches = true;
        if (mission.shortcutId === 'paste_plain' && e.shiftKey && pressedChar === 'v') actionMatches = true;
        if (mission.shortcutId === 'save_as' && e.shiftKey && pressedChar === 's') actionMatches = true;
        if (mission.shortcutId === 'left_align' && pressedChar === 'l') actionMatches = true;
        if (mission.shortcutId === 'zoom_in' && (e.key === '+' || e.code === 'NumpadAdd')) actionMatches = true;
        if (mission.shortcutId === 'zoom_out' && (e.key === '-' || e.code === 'NumpadSubtract')) actionMatches = true;
        if (mission.shortcutId === 'zoom_reset' && pressedChar === '0') actionMatches = true;
        if (mission.shortcutId === 'reopen_tab' && e.shiftKey && pressedChar === 't') actionMatches = true;
        if (mission.shortcutId === 'replace' && pressedChar === 'h') actionMatches = true;

        // ★ 実践問題3（set3）用 ★
        if (mission.shortcutId === 'bold' && pressedChar === 'b') actionMatches = true; // Ctrl/Cmd + B
        if (mission.shortcutId === 'center_align' && pressedChar === 'e') actionMatches = true; // Ctrl/Cmd + E
        if (mission.shortcutId === 'save' && pressedChar === 's') actionMatches = true; // Ctrl/Cmd + S
      }

      if (actionMatches) {
        playSound('success');
        speakWord(mission.shortcutId);
        storageUtils.recordAttempt(true, mission.shortcutId);

        // execute action
        const action = mission.successAction;
        if (action.type === 'highlight_left') {
          setSearchHighlighted(true);
        } else if (action.type === 'replace_right') {
          setRightContent(prev => prev.replace(action.replaceTarget || '', action.replaceWith || ''));
          if (mission.shortcutId === 'center_align') {
            setCenteredLine('その一歩が、未来を変える。');
          }
        } else if (action.type === 'append_right') {
          setRightContent(prev => prev + (action.textToAppend || ''));
        }

        storageUtils.addXP(50);
        setShowSuccessOverlay(true);
      } else if (!['Control', 'Shift', 'Alt', 'Meta', 'OS'].includes(e.key)) {
        storageUtils.recordAttempt(false, mission.shortcutId);
      }
    },
    [currentStep, hasStarted, isMac, currentSet, showSuccessOverlay, clearTime, playSound, speakWord, onNavigate, advanceAfterSuccess]
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
        <h2 className="title">{uiLang === 'EN' ? 'Coming Soon' : '準備中'}</h2>
        <p>{uiLang === 'EN' ? 'This practical mission is currently under development.' : 'この実践問題は現在準備中です。'}</p>
        <button className="primary-btn mt-4" onClick={() => onNavigate('modeSelect')}>
          <ArrowLeft size={20} />
          {uiLang === 'EN' ? 'BACK' : '戻る'}
        </button>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <div className="game2-container g2-prep">
        <div className="g2-prep-card">
          <p className="g2-prep-kicker">{uiLang === 'EN' ? 'PRACTICAL MODE' : '実践モード'}</p>
          <h2>{uiLang === 'EN' ? currentSet.titleEn : currentSet.titleJa}</h2>
          <h3>{uiLang === 'EN' ? 'How to play' : '遊び方'}</h3>
          <ol>
            <li>{uiLang === 'EN' ? 'Read the mission shown in the center.' : '画面中央のミッションを読みます。'}</li>
            <li>{uiLang === 'EN' ? 'Press the shortcut that completes the task.' : 'お題を達成するショートカットキーを押します。'}</li>
            <li>{uiLang === 'EN' ? 'A correct answer advances you to the next step.' : '正解すると次のステップへ進みます。'}</li>
          </ol>
          <p className="g2-prep-note">
            {uiLang === 'EN'
              ? 'Not sure what to do? Use the Hint button during the mission. You can also skip a mission if needed.'
              : 'わからないときは、プレイ中のヒントボタンを使えます。それでも難しいときはスキップできます。'}
          </p>
          <div className="g2-prep-actions">
            <button className="secondary-btn" onClick={() => onNavigate('modeSelect')} title="Shortcut: Esc">
              <ArrowLeft size={16} />
              {uiLang === 'EN' ? 'BACK' : '戻る'}
              <span className="enter-badge">Esc</span>
            </button>
            <button className="primary-btn" onClick={startPractice} title="Shortcut: Enter">
              {uiLang === 'EN' ? 'START PRACTICE' : '実技を始める'}
              <span className="enter-badge">Enter</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentMission = currentSet.missions[currentStep];

  return (
    <div className="game2-container">
      <div className="g2-header">
        <button className="secondary-btn" style={{ width: 'auto', padding: '0.5rem 1rem' }} onClick={() => onNavigate('modeSelect')}>
          <ArrowLeft size={16} />
          <span>{uiLang === 'EN' ? 'QUIT' : '中断'}</span>
        </button>
        <h2 className="g2-title">{uiLang === 'EN' ? currentSet.titleEn : currentSet.titleJa}</h2>
        <div className="g2-progress">
          {uiLang === 'EN' ? 'STEP' : 'ステップ'} {Math.min(currentStep + 1, currentSet.missions.length)} / {currentSet.missions.length}
        </div>
      </div>

      <div className="g2-workspace">
        <div className="g2-pane left-pane">
          <div className="pane-header">{uiLang === 'EN' ? currentSet.leftColumnTitleEn : currentSet.leftColumnTitleJa}</div>
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
          <div className="pane-header">{uiLang === 'EN' ? currentSet.rightColumnTitleEn : currentSet.rightColumnTitleJa}</div>
          <div className="pane-content right-content-area">
            {rightContent.split('\n').map((line, idx) => (
              <p key={idx} className={centeredLine && line.includes(centeredLine) ? 'centered-line' : ''}>
                {line.includes('**') ? <strong>{line.replace(/\*\*/g, '')}</strong> : line}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="g2-mission-box">
        {clearTime !== null ? (
          <div className="g2-clear-state">
            <h3><Trophy className="icon-highlight" size={28} /> {uiLang === 'EN' ? 'ALL MISSIONS CLEARED!' : '全ミッションクリア！'}</h3>
            {isNewRecord && <div className="new-record-badge">NEW</div>}
            <div className="g2-stats">
              <p>{uiLang === 'EN' ? 'Clear time:' : 'クリアタイム:'} <span className="highlight">{clearTime} {uiLang === 'EN' ? 'sec' : '秒'}</span></p>
            </div>
            <button className="primary-btn g2-finish-btn" onClick={() => onNavigate('result')}>
              {uiLang === 'EN' ? 'FINISH AND VIEW RESULTS' : '完了してリザルトへ'}
              <ArrowLeft size={20} style={{ transform: 'rotate(180deg)', marginLeft: '8px', marginRight: '8px' }}/>
              <span className="enter-badge">Enter</span>
            </button>
          </div>
        ) : (
          <div className="g2-mission-info">
            <div className="m-header">
              <h3 className="m-title">{uiLang === 'EN' ? currentMission.titleEn : currentMission.titleJa}</h3>
              <p className="m-desc">{uiLang === 'EN' ? currentMission.descriptionEn : currentMission.descriptionJa}</p>
              {hintMessage && <p className="g2-hint-message">{hintMessage}</p>}
            </div>
          </div>
        )}
      </div>

      {/* 画面下部：キーボードUI領域 */}
      {clearTime === null && (
        <div className="keyboard-area">
          <Keyboard resetKey={`${currentStep}-${showSuccessOverlay}-${clearTime !== null}`} />
        </div>
      )}

      {clearTime === null && (
        <div className="g2-action-bar" aria-label={uiLang === 'EN' ? 'Mission assistance' : 'ミッション補助'}>
          <button className="secondary-btn g2-hint-btn" onClick={handleHint}>
            {hintedSteps.includes(currentStep)
              ? (uiLang === 'EN' ? 'SHOW HINT AGAIN' : 'ヒントを再表示')
              : (uiLang === 'EN' ? 'HINT (-10 XP)' : 'ヒント（-10XP）')}
          </button>
          <button className="secondary-btn g2-skip-btn" onClick={handleSkip}>
            {uiLang === 'EN' ? 'SKIP (-25 XP)' : 'スキップ（-25XP）'}
          </button>
        </div>
      )}

      {showSuccessOverlay && (
        <div className="g2-success-overlay">
          <div className="g2-success-content">
            <span className="g2-success-text">{uiLang === 'EN' ? 'SUCCESS!' : '正解！'}</span>
            <p className="g2-success-next">{uiLang === 'EN' ? 'Press Enter to continue' : 'Enterキーで次へ進む'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game2;
