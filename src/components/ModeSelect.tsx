import React, { useState } from 'react';
import type { ViewState, GameModeData, Difficulty } from '../types';
import gameModes from '../data/gameModes.json';
import { ArrowLeft, PlayCircle, FileText, Play } from 'lucide-react';
import { parseRubyText } from '../utils/shortcutUtils';
import './ModeSelect.css';

interface ModeSelectProps {
  onNavigate: (view: ViewState) => void;
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  uiLang: 'EN' | 'JA';
  furiganaEnabled: boolean;
}

const ModeSelect: React.FC<ModeSelectProps> = ({ 
  onNavigate, difficulty, setDifficulty, uiLang, furiganaEnabled 
}) => {
  const [selectedModeId, setSelectedModeId] = useState<string | null>(null);

  const practicalModes = (gameModes as GameModeData[]).filter(m => m.type === 'practical');

  const renderJa = (text: string, rubyText: string) => {
    return furiganaEnabled ? <ruby>{text}<rt>{rubyText}</rt></ruby> : text;
  };

  const renderDynamicText = (enText: string, jaText: string) => {
    return uiLang === 'EN' ? enText : parseRubyText(jaText, furiganaEnabled);
  };

  const handleSelectNormal = (diff: Difficulty) => {
    setDifficulty(diff);
    setSelectedModeId('normal');
  };

  const handleStart = () => {
    if (!selectedModeId) return;
    if (selectedModeId === 'normal') {
      onNavigate('game');
    } else {
      onNavigate('game2');
    }
  };

  const selectedData = selectedModeId ? (gameModes as GameModeData[]).find(m => m.id === selectedModeId) : null;

  return (
    <div className="mode-select-container">
      <div className="mode-header">
        <button className="secondary-btn back-btn" onClick={() => onNavigate('home')}>
          <ArrowLeft size={20} />
          <span>{uiLang === 'EN' ? 'BACK' : renderJa('戻る', 'もどる')}</span>
        </button>
        <h2 className="mode-title">{uiLang === 'EN' ? 'SELECT MODE' : renderJa('モード選択', 'せんたく')}</h2>
      </div>

      <div className="mode-layout">
        {/* 左側：リスト (Master) */}
        <div className="mode-sidebar">
          
          {/* 通常モードセクション */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">
              <PlayCircle size={20} />
              {uiLang === 'EN' ? 'NORMAL MODE' : renderJa('通常モード', 'つうじょう')}
            </h3>
            <div className="diff-buttons">
              <button 
                className={`sidebar-btn diff-btn ${selectedModeId === 'normal' && difficulty === 'EASY' ? 'active' : ''}`}
                onClick={() => handleSelectNormal('EASY')}
              >
                {uiLang === 'EN' ? 'EASY' : renderJa('初心者', 'しょしんしゃ')}
              </button>
              <button 
                className={`sidebar-btn diff-btn ${selectedModeId === 'normal' && difficulty === 'NORMAL' ? 'active' : ''}`}
                onClick={() => handleSelectNormal('NORMAL')}
              >
                {uiLang === 'EN' ? 'NORMAL' : renderJa('通常', 'つうじょう')}
              </button>
              <button 
                className={`sidebar-btn diff-btn ${selectedModeId === 'normal' && difficulty === 'HARD' ? 'active' : ''}`}
                onClick={() => handleSelectNormal('HARD')}
              >
                {uiLang === 'EN' ? 'HARD' : renderJa('上級者', 'じょうきゅうしゃ')}
              </button>
            </div>
          </div>

          {/* 実技問題セクション */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">
              <FileText size={20} />
              {uiLang === 'EN' ? 'PRACTICAL EXAMS' : renderJa('実技問題', 'じつぎもんだい')}
            </h3>
            <div className="practical-list">
              {practicalModes.map((mode, index) => (
                <button 
                  key={mode.id} 
                  className={`sidebar-btn practical-btn ${selectedModeId === mode.id ? 'active' : ''}`}
                  onClick={() => setSelectedModeId(mode.id)}
                >
                  <span style={{ marginRight: '0.5rem' }}>{index + 1}.</span>
                  {renderDynamicText(mode.titleEn, mode.titleJa)}
                </button>
              ))}
              {Array.from({ length: Math.max(0, 6 - practicalModes.length) }).map((_, i) => (
                <button key={`placeholder-${i}`} className="sidebar-btn practical-btn locked" disabled>
                  {uiLang === 'EN' ? `${practicalModes.length + i + 1}. Coming Soon` : `${practicalModes.length + i + 1}. 準備中`}
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
                <Play size={24} /> 
                <span>{uiLang === 'EN' ? 'START' : renderJa('スタート', 'すたーと')}</span>
              </button>
            </div>
          ) : (
            <div className="detail-empty">
              <p>{uiLang === 'EN' ? 'Please select a mode from the left.' : renderJa('左のメニューからプレイするモードを選択してください。', 'ひだりのめにゅーからぷれいするもーどをせんたくしてください。')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModeSelect;
