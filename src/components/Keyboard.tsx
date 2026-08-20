import React, { useState, useEffect } from 'react';
import './Keyboard.css';
import { useOS } from '../hooks/useOS';

  const Keyboard: React.FC = () => {
  // 1. OSの判定
  const os = useOS();
  const isMac = os === 'Mac';

  // 2. 押されているキーの状態をこのファイル内で管理
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  // 3. キーイベントの監視
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Macの場合は Control キーの入力を無視（反応させない）
      if (isMac && e.key === 'Control') {
        return;
      }

      setPressedKeys((prev) => new Set(prev).add(e.key));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setPressedKeys((prev) => {
        const next = new Set(prev);
        next.delete(e.key);
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

  const isPressed = (logicalKey: string) => {
    return pressedKeys.has(logicalKey);
  };

  const renderKey = (logicalKey: string, display: string = logicalKey, widthClass: string = 'key-normal') => (
    <div key={logicalKey} className={`kb-key ${widthClass} ${isPressed(logicalKey) ? 'pressed' : ''}`}>
      {display}
    </div>
  );

  return (
    <div className="virtual-keyboard">
      <div className="kb-row">
        {renderKey('Escape', 'ESC')}
        {renderKey('1')} {renderKey('2')} {renderKey('3')} {renderKey('4')} {renderKey('5')}
        {renderKey('6')} {renderKey('7')} {renderKey('8')} {renderKey('9')} {renderKey('0')}
        {renderKey('-', '-')} {renderKey('=', '=')} {renderKey('Backspace', 'BACKSPACE', 'key-wide')}
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
        {renderKey('Shift', 'SHIFT', 'key-widest')}
        {renderKey('Z')} {renderKey('X')} {renderKey('C')} {renderKey('V')} {renderKey('B')}
        {renderKey('N')} {renderKey('M')} {renderKey(',', ',')} {renderKey('.', '.')} {renderKey('/', '/')}
        {renderKey('Shift', 'SHIFT', 'key-widest')}
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
            {renderKey('Control', 'Control', 'key-wide')}
            {renderKey('Alt', '⌥ OPT', 'key-wide')}
            {renderKey('Meta', '⌘ CMD', 'key-wider')}
            {renderKey(' ', 'SPACE', 'key-space')}
            {renderKey('Meta', '⌘ CMD', 'key-wider')}
            {renderKey('Alt', '⌥ OPT', 'key-wide')}
          </>
        ) : (
          <>
            {renderKey('Control', 'CTRL', 'key-wide')}
            {renderKey('Meta', 'WIN', 'key-wide')}
            {renderKey('Alt', 'ALT', 'key-wide')}
            {renderKey(' ', 'SPACE', 'key-space')}
            {renderKey('Alt', 'ALT', 'key-wide')}
            {renderKey('Control', 'CTRL', 'key-wide')}
          </>
        )}
      </div>
    </div>
  );
};

export default Keyboard;

