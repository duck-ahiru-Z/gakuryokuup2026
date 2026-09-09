import React, { useState, useEffect } from 'react';
import './Keyboard.css';
import { useOS } from '../hooks/useOS';

  interface KeyboardProps {
    resetKey?: string | number;
  }

  const Keyboard: React.FC<KeyboardProps> = ({ resetKey }) => {
  // 1. OSの判定
  const os = useOS();
  const isMac = os === 'Mac';

  // 2. 押されているキーの状態をこのファイル内で管理
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  // 正解・問題切り替え時に、タッチで固定した修飾キーを解除する
  useEffect(() => {
    setPressedKeys(new Set());
  }, [resetKey]);

  const normalizeKey = (key: string) => key.length === 1 ? key.toUpperCase() : key;

  const getEventKey = (event: KeyboardEvent) => {
    const codeAliases: Record<string, string> = {
      ControlLeft: 'Control',
      ControlRight: 'Control',
      ShiftLeft: 'Shift',
      ShiftRight: 'Shift',
      AltLeft: 'Alt',
      AltRight: 'Alt',
      MetaLeft: 'Meta',
      MetaRight: 'Meta',
      Space: ' ',
      Enter: 'Enter',
      Escape: 'Escape',
      Tab: 'Tab',
      Backspace: 'Backspace',
      CapsLock: 'CapsLock'
    };

    if (codeAliases[event.code]) return codeAliases[event.code];
    if (event.code.startsWith('Key')) return event.code.slice(3).toUpperCase();
    if (event.code.startsWith('Digit')) return event.code.slice(5);
    return event.key;
  };

  const modifierState = (keys: Set<string>) => ({
    ctrlKey: keys.has('Control'),
    shiftKey: keys.has('Shift'),
    altKey: keys.has('Alt'),
    metaKey: keys.has('Meta')
  });

  const dispatchVirtualKey = (key: string, type: 'keydown' | 'keyup', keys: Set<string>) => {
    const eventKey = key === ' ' ? ' ' : key;
    const event = new KeyboardEvent(type, {
      key: eventKey,
      code: key.length === 1 ? `Key${key.toUpperCase()}` : key,
      bubbles: true,
      cancelable: true,
      ...modifierState(keys)
    });
    window.dispatchEvent(event);
  };

  const isModifierKey = (key: string) => ['Control', 'Shift', 'Alt', 'Meta'].includes(key);

  const handleVirtualKeyDown = (logicalKey: string) => {
    setPressedKeys((prev) => {
      const next = new Set(prev);
      if (isModifierKey(logicalKey) && next.has(logicalKey)) {
        next.delete(logicalKey);
        dispatchVirtualKey(logicalKey, 'keyup', next);
      } else {
        next.add(logicalKey);
        dispatchVirtualKey(logicalKey, 'keydown', next);
      }
      return next;
    });
  };

  const handleVirtualKeyUp = (logicalKey: string) => {
    if (isModifierKey(logicalKey)) return;
    setPressedKeys((prev) => {
      const next = new Set(prev);
      next.delete(logicalKey);
      dispatchVirtualKey(logicalKey, 'keyup', next);
      return next;
    });
  };

  const handleVirtualKeyTap = (logicalKey: string) => {
    if (isModifierKey(logicalKey)) {
      handleVirtualKeyDown(logicalKey);
      return;
    }

    handleVirtualKeyDown(logicalKey);
    window.setTimeout(() => handleVirtualKeyUp(logicalKey), 0);
  };

  // 3. キーイベントの監視
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Macの場合は Control キーの入力を無視（反応させない）
      if (isMac && e.key === 'Control') {
        return;
      }

      setPressedKeys((prev) => new Set(prev).add(normalizeKey(getEventKey(e))));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setPressedKeys((prev) => {
        const next = new Set(prev);
        next.delete(normalizeKey(getEventKey(e)));
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isMac]);

  const isPressed = (logicalKey: string) => pressedKeys.has(normalizeKey(logicalKey));

  const renderKey = (logicalKey: string, display: string = logicalKey, widthClass: string = 'key-normal', uniqueKey: string = logicalKey) => (
    <button
      key={uniqueKey}
      type="button"
      className={`kb-key ${widthClass} ${isPressed(logicalKey) ? 'pressed' : ''}`}
      onClick={() => handleVirtualKeyTap(logicalKey)}
      onContextMenu={(e) => e.preventDefault()}
    >
      {display}
    </button>
  );

  return (
    <div className="virtual-keyboard">
      <div className="kb-row">
        {renderKey('Escape', 'ESC')}
        {renderKey('1')} {renderKey('2')} {renderKey('3')} {renderKey('4')} {renderKey('5')}
        {renderKey('6')} {renderKey('7')} {renderKey('8')} {renderKey('9')} {renderKey('0')}
        {renderKey('-', '-')} {renderKey('=', '=')} {renderKey('+', '+', 'key-normal', 'Plus')} {renderKey('Backspace', 'BACKSPACE', 'key-wide')}
      </div>
      <div className="kb-row">
        {renderKey('Tab', 'TAB', 'key-wide')}
        {renderKey('Q')} {renderKey('W')} {renderKey('E')} {renderKey('R')} {renderKey('T')}
        {renderKey('Y')} {renderKey('U')} {renderKey('I')} {renderKey('O')} {renderKey('P')}
        {renderKey('[', '[')} {renderKey(']', ']')} {renderKey('\\', '\\')}
      </div>
      <div className="kb-row">
        {renderKey('CapsLock', 'CAPS', 'key-wider')}
        {renderKey('A')} {renderKey('S')} {renderKey('D')} {renderKey('F')} {renderKey('G')}
        {renderKey('H')} {renderKey('J')} {renderKey('K')} {renderKey('L')}
        {renderKey(';', ';')} {renderKey('\'', '\'')} {renderKey('Enter', 'ENTER', 'key-wider')}
      </div>
      <div className="kb-row">
        {renderKey('Shift', 'SHIFT', 'key-widest', 'ShiftLeft')}
        {renderKey('Z')} {renderKey('X')} {renderKey('C')} {renderKey('V')} {renderKey('B')}
        {renderKey('N')} {renderKey('M')} {renderKey(',', ',')} {renderKey('.', '.')} {renderKey('/', '/')}
        {renderKey('Shift', 'SHIFT', 'key-widest', 'ShiftRight')}
      </div>
      <div className="kb-row">
        {/* {renderKey('Ctrl', ctrlDisplay, 'key-wide')}
        {!isMac && renderKey('Meta', 'WIN', 'key-wide')}
        {renderKey('Alt', altDisplay, 'key-wide')}
        {renderKey(' ', 'SPACE', 'key-space')}
        {renderKey('Alt', altDisplay, 'key-wide')}
        {renderKey('Ctrl', ctrlDisplay, 'key-wide')} */}
      {isMac ? (
          <>
            {renderKey('Control', 'Control', 'key-wide', 'ControlLeft')}
            {renderKey('Alt', '⌥ OPT', 'key-wide', 'AltLeft')}
            {renderKey('Meta', '⌘ CMD', 'key-wider', 'MetaLeft')}
            {renderKey(' ', 'SPACE', 'key-space')}
            {renderKey('Meta', '⌘ CMD', 'key-wider', 'MetaRight')}
            {renderKey('Alt', '⌥ OPT', 'key-wide', 'AltRight')}
          </>
        ) : (
          <>
            {renderKey('Control', 'CTRL', 'key-wide', 'ControlLeft')}
            {renderKey('Meta', 'WIN', 'key-wide', 'MetaLeft')}
            {renderKey('Alt', 'ALT', 'key-wide', 'AltLeft')}
            {renderKey(' ', 'SPACE', 'key-space')}
            {renderKey('Alt', 'ALT', 'key-wide', 'AltRight')}
            {renderKey('Control', 'CTRL', 'key-wide', 'ControlRight')}
          </>
        )}
      </div>
    </div>
  );
};

export default Keyboard;
