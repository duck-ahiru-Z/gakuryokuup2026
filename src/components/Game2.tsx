import React, { useState, useEffect, useCallback } from 'react';
import type { ViewState, Difficulty } from '../types';
import { useOS } from '../hooks/useOS';
import Keyboard from './Keyboard';
import { DisableContextMenu } from './DisableContextMenu';
import './Game2.css';

interface GameProps {
onNavigate: (view: ViewState) => void;
difficulty: Difficulty;
}

// 3つのストーリーミッション定義
const MISSIONS = [
{
id: 1,
title: 'MISSION 1: 取材メモから「日程」を探せ！',
description: '大量のメモから「文化祭の日程」を探してください。',
shortcutName: 'Ctrl + F',
shortcutKeys: ['Control', 'f'],
macShortcutKeys: ['Meta', 'f'],
origin: 'Find = 探す',
detail: '大量の文書から特定の単語を一瞬で検索できます。',
},
{
id: 2,
title: 'MISSION 2: 見つけた情報を記事に挿入せよ！',
description: 'コピーした日程を編集画面に貼り付けてください。',
shortcutName: 'Ctrl + V',
shortcutKeys: ['Control', 'v'], // 実装上はVで完了判定
macShortcutKeys: ['Meta', 'v'],
origin: 'Copy & Paste = 複製して貼り付ける',
detail: '手入力せずに正確な情報を素早く転写できます。',
},
{
id: 3,
title: 'MISSION 3: 間違えた入力を取り消せ！',
description: '⚠️速報：誤った日程が入ってしまいました！ 直前の操作を取り消してください。',
shortcutName: 'Ctrl + Z',
shortcutKeys: ['Control', 'z'],
macShortcutKeys: ['Meta', 'z'],
origin: 'Undo = 元に戻す',
detail: '間違いを恐れずに作業・試行錯誤ができます。',
},
];

const Game: React.FC<GameProps> = ({ onNavigate }) => {
const os = useOS();
const isMac = os === 'Mac';

// ゲーム状態
const [currentStep, setCurrentStep] = useState<number>(0);
const [startTime] = useState<number>(Date.now());
const [clearTime, setClearTime] = useState<number | null>(null);
const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

// 正解ポップアップ用状態
const [showSuccessOverlay, setShowSuccessOverlay] = useState<boolean>(false);
const [lastClearedMission, setLastClearedMission] = useState<typeof MISSIONS[0] | null>(null);

// 新聞記事の表示テキスト状態
const [articleText, setArticleText] = useState<string>(
'【号外】今年の学校新聞がついに発行！\n生徒会より：今年のテーマは「飛翔」です。\n'
);
const [searchHighlighted, setSearchHighlighted] = useState<boolean>(false);

const mission = MISSIONS[currentStep];

//次の問題への画面遷移の切り替え時間設定用関数
const AUTO_ADVANCE_DELAY_MS = 20000; // 自動進行の秒数（20000ms = 20秒）
const ENABLE_AUTO_ADVANCE = true;    // 自動進行を無効化したい場合は false に変更

// ★【追加】次のミッションまたはリザルトへ進む共通関数
const advanceToNextStep = useCallback(() => {
    setShowSuccessOverlay(false);

    setCurrentStep((prev) => {
        // 最終問題（MISSION 3）をクリアした後に呼ばれた場合のみ画面遷移
        if (prev >= MISSIONS.length - 1) {
        const totalSeconds = Number(((Date.now() - startTime) / 1000).toFixed(1));
        setClearTime(totalSeconds);
        onNavigate('result');
        return prev;
        }
        // まだ問題が残っている場合は次のステップへ（1 → 2 → 3）
        return prev + 1;
    });
}, [startTime, onNavigate]);

// キー押下判定ロジック
const handleKeyDown = useCallback(
(e: KeyboardEvent) => {
    // 演出表示中やクリア後はキー入力をブロック
    if (clearTime !== null) return;

    //ポップアップ表示中に Enter キーが押されたら即座に次へ進む
    if (showSuccessOverlay) {
        if (e.key === 'Enter') {
        e.preventDefault();
        advanceToNextStep();
        }
        return;
    }

    // ブラウザ標準ショートカット（Ctrl+FやCtrl+Cなど）の動作を上書き
    if ((e.ctrlKey || e.metaKey) && ['f', 'c', 'v', 'z'].includes(e.key.toLowerCase())) {
        e.preventDefault();
    }

    setPressedKeys((prev) => new Set(prev).add(e.key));

    if (!mission) return;

    const activeShortcut = isMac ? mission.macShortcutKeys : mission.shortcutKeys;
    
    // 修飾キー (Ctrl or Meta) + ターゲットキーが押されたか判定
    const modifierPressed = isMac ? e.metaKey : e.ctrlKey;
    const targetKeyPressed = e.key.toLowerCase() === activeShortcut[1].toLowerCase();

    if (modifierPressed && targetKeyPressed) {
        // ポップアップ用にクリアしたミッション情報をセット＆表示
        setLastClearedMission(mission);
        setShowSuccessOverlay(true);

        // 各ステップの画面変化
        if (currentStep === 0) {
            // Mission 1: 検索成功 -> 文化祭の日程をハイライト
            setSearchHighlighted(true);
        } else if (currentStep === 1) {
            // Mission 2: ペースト成功 -> 記事に日程を追加
            setArticleText((prev) => prev + '\n【開催日】10月15日（※誤り：正しくは10月20日）');
        } else if (currentStep === 2) {
            // Mission 3: Undo成功 -> 修正後の正しい日程にする
            setArticleText((prev) => prev.replace('（※誤り：正しくは10月20日）', ''));
        }
    }
    },
    [currentStep, isMac, mission, startTime, showSuccessOverlay, clearTime]
);

const handleKeyUp = useCallback((e: KeyboardEvent) => {
setPressedKeys((prev) => {
    const next = new Set(prev);
    next.delete(e.key);
    return next;
});
}, []);

useEffect(() => {
  // ポップアップ非表示時や自動進行が無効の場合は何もしない
    if (!showSuccessOverlay || !ENABLE_AUTO_ADVANCE) return;

    const timer = setTimeout(() => {
    advanceToNextStep();
    }, AUTO_ADVANCE_DELAY_MS);

    // Enterキー等で途中で閉じられた場合はタイマーを解除
    return () => clearTimeout(timer);
    }, [showSuccessOverlay, advanceToNextStep]);

    useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
    };
}, [handleKeyDown, handleKeyUp]);

return (
    <DisableContextMenu>
        <div className="newspaper-game-container">
            {/* 画面上部：現在ミッションガイド（正解キー・語源のネタバレは非表示化） */}
            <div className="mission-banner">
            <div className="mission-info">
                <h2>{mission.title}</h2>
                <p>{mission.description}</p>
            </div>
        </div>

            {/* 画面中央：2カラム構成（左：取材メモ / 右：新聞編集画面） */}
            <div className="editor-workspace">
            {/* 左カラム：取材メモ */}
            <div className="workspace-column memo-column">
                <h3>📰 取材メモ（情報源）</h3>
                <div className="memo-content">
                <p>10/01: 生徒会幹部ミーティング実施。</p>
                <p>10/03: 体育祭の準備スタート。雨天時は体育館。</p>
                <p>10/05: 吹奏楽部、地区大会で金賞受賞！</p>
                <p className={`target-text ${searchHighlighted ? 'search-found' : ''}`}>
                    10/08: 【重要】文化祭の日程は「10月15日」に決定しました。
                </p>
                <p>10/10: 食堂の秋限定メニュー「栗カツ丼」販売開始。</p>
                <p>10/12: 図書室の新着図書コーナー更新。</p>
                </div>
            </div>

            {/* 右カラム：新聞編集画面 */}
            <div className="workspace-column article-column">
                <h3>✏️ 学校新聞「号外」編集画面</h3>
                <div className="article-preview">
                <pre>{articleText}</pre>
                </div>
            </div>
            </div>

            {/* 正解時の演出オーバーレイ */}
            {showSuccessOverlay && lastClearedMission && (
            <div className="success-pop-overlay">
                <div className="success-pop-card">
                <div className="success-badge">SUCCESS!</div>
                <h3>
                    {isMac
                    ? lastClearedMission.shortcutName.replace('Ctrl', '⌘ Cmd')
                    : lastClearedMission.shortcutName}
                </h3>
                <p className="origin-text">{lastClearedMission.origin}</p>
                <p className="detail-text">{lastClearedMission.detail}</p>

                {/* ★ クリックでもEnterでも次に進めるボタン */}
                <button className="next-mission-btn" onClick={advanceToNextStep}>
                    次へ進む <span className="enter-badge">Enter ↵</span>
                </button>
                </div>
            </div>
            )}

            {/* 画面下部：キーボードUI */}
            <div className="keyboard-area">
            <Keyboard />
            </div>
        </div>
    </DisableContextMenu>
);
};

export default Game;