import React, { useState, useEffect } from 'react';
import type { ViewState, GameModeData, Difficulty } from '../types';
import gameModes from '../data/gameModes.json';
import { ArrowLeft, PlayCircle, FileText, Play } from 'lucide-react';
import { parseRubyText } from '../utils/shortcutUtils';
import './ModeSelect.css';

interface ModeSelectProps {
  onNavigate: (view: ViewState) => void;
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  selectedModeId: string | null;
  setSelectedModeId: (id: string | null) => void;
  uiLang: 'EN' | 'JA';
  furiganaEnabled: boolean;
}

const ModeSelect: React.FC<ModeSelectProps> = ({ 
  onNavigate, difficulty, setDifficulty, selectedModeId, setSelectedModeId, uiLang, furiganaEnabled 
}) => {
  const practicalModes = (gameModes as GameModeData[]).filter(m => m.type === 'practical');



  const renderDynamicText = (enText: string, jaText: string) => {
    return uiLang === 'EN' ? enText : parseRubyText(jaText, furiganaEnabled);
  };

  const handleSelectNormal = (diff: Difficulty) => {
    setDifficulty(diff);
    setSelectedModeId('normal');
  };

  const handleStart = async () => {
    if (!selectedModeId) return;

    //スタートボタンを押した瞬間に画面全体をフルスクリーン化
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (e) {
      // エラーが起きても（全画面化をブロックされても）処理を止めず次に進む
      console.warn('Fullscreen execution failed or was denied:', e);
    }

    if (selectedModeId === 'normal') {
      onNavigate('game');
    } else {
      onNavigate('game2');
    }
  };

  const selectedData = selectedModeId ? (gameModes as GameModeData[]).find(m => m.id === selectedModeId) : null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'escape') onNavigate('home');
      if (key === 'enter') handleStart();
      if (key === '1') handleSelectNormal('EASY');
      if (key === '2') handleSelectNormal('NORMAL');
      if (key === '3') handleSelectNormal('HARD');
      if (key === '4') setSelectedModeId('practical_1');
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleStart, onNavigate, setSelectedModeId]);

  return (
    <div className="mode-select-container">
      <div className="mode-header">
        <button className="secondary-btn back-btn" onClick={() => onNavigate('home')} title="Shortcut: Esc">
          <ArrowLeft size={20} />
          <span>{uiLang === 'EN' ? 'BACK' : parseRubyText('[戻](もど)る', furiganaEnabled)}</span>
          <span className="enter-badge" style={{marginLeft: '10px'}}>Esc</span>
        </button>
        <h2 className="mode-title">{uiLang === 'EN' ? 'SELECT MODE' : parseRubyText('モード[選択](せんたく)', furiganaEnabled)}</h2>
      </div>

      <div className="mode-layout">
        {/* 左側：リスト (Master) */}
        <div className="mode-sidebar">
          
          {/* 通常モードセクション */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">
              <PlayCircle size={20} />
              {uiLang === 'EN' ? 'NORMAL MODE' : parseRubyText('[通常](つうじょう)モード', furiganaEnabled)}
            </h3>
            <div className="diff-buttons">
              {[
                { id: 'EASY' as Difficulty, labelEn: 'EASY', labelJa: '[初心者](しょしんしゃ)', key: '1' },
                { id: 'NORMAL' as Difficulty, labelEn: 'NORMAL', labelJa: '[通常](つうじょう)', key: '2' },
                { id: 'HARD' as Difficulty, labelEn: 'HARD', labelJa: '[上級者](じょうきゅうしゃ)', key: '3' }
              ].map(diff => (
                <button 
                  key={diff.id}
                  className={`sidebar-btn diff-btn ${selectedModeId === 'normal' && difficulty === diff.id ? 'active' : ''}`}
                  onClick={() => handleSelectNormal(diff.id)}
                >
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                    <span>{uiLang === 'EN' ? diff.labelEn : parseRubyText(diff.labelJa, furiganaEnabled)}</span>
                    <span className="enter-badge">{diff.key}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 実技問題セクション */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">
              <FileText size={20} />
              {uiLang === 'EN' ? 'PRACTICAL EXAMS' : parseRubyText('[実技問題](じつぎもんだい)', furiganaEnabled)}
            </h3>
            <div className="practical-list">
              {practicalModes.map((mode, index) => (
                <button 
                  key={mode.id} 
                  className={`sidebar-btn practical-btn ${selectedModeId === mode.id ? 'active' : ''}`}
                  onClick={() => setSelectedModeId(mode.id)}
                >
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                    <span>
                      <span style={{ marginRight: '0.5rem' }}>{index + 1}.</span>
                      {renderDynamicText(mode.titleEn, mode.titleJa)}
                    </span>
                    <span className="enter-badge">{index + 4}</span>
                  </div>
                </button>
              ))}
              {Array.from({ length: Math.max(0, 6 - practicalModes.length) }).map((_, i) => (
                <button key={`placeholder-${i}`} className="sidebar-btn practical-btn locked" disabled>
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                    <span>{uiLang === 'EN' ? `${practicalModes.length + i + 1}. Coming Soon` : `${practicalModes.length + i + 1}. 準備中`}</span>
                    <span className="enter-badge">{practicalModes.length + i + 4}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* 右側：詳細 (Detail) */}
        <div className="mode-detail">
          {selectedData ? (
            <div className="detail-content animate-fade-in">
              <h2 className="detail-title">
                {renderDynamicText(selectedData.titleEn, selectedData.titleJa)}
              </h2>
              
              <div className="mode-image-wrapper">
                {selectedData.imageUri ? (
                  <img src={selectedData.imageUri} alt="Mode preview" className="mode-image" />
                ) : (
                  <div className="mode-image-placeholder">
                    <FileText size={48} opacity={0.5} />
                    <span>NO IMAGE AVAILABLE</span>
                  </div>
                )}
              </div>

              <p className="detail-desc">
                {renderDynamicText(selectedData.descriptionEn, selectedData.descriptionJa)}
              </p>

              <button className="primary-btn start-btn" onClick={handleStart}>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <Play size={24} /> 
                  <span>{uiLang === 'EN' ? 'START' : parseRubyText('[スタート](すたーと)', furiganaEnabled)}</span>
                </div>
                <span className="enter-badge">Enter</span>
              </button>
            </div>
          ) : (
            <div className="detail-empty">
              <p>{uiLang === 'EN' ? 'Please select a mode from the left.' : parseRubyText('[左](ひだり)のメニューからプレイするモードを[選択](せんたく)してください。', furiganaEnabled)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModeSelect;
