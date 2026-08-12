import React from 'react';
import './Keyboard.css';
import { useOS } from '../hooks/useOS';

interface KeyboardProps {
  pressedKeys: Set<string>;
}

const Keyboard: React.FC<KeyboardProps> = ({ pressedKeys }) => {
  const { isMac } = useOS();

  const isPressed = (logicalKey: string) => {
    return pressedKeys.has(logicalKey);
  };

  const renderKey = (logicalKey: string, display: string = logicalKey, widthClass: string = 'key-normal') => (
    <div className={`kb-key ${widthClass} ${isPressed(logicalKey) ? 'pressed' : ''}`}>
      {display}
    </div>
  );

  const ctrlDisplay = isMac ? '⌘ CMD' : 'CTRL';
  const altDisplay = isMac ? '⌥ OPT' : 'ALT';

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
        {renderKey('Ctrl', ctrlDisplay, 'key-wide')}
        {!isMac && renderKey('Meta', 'WIN', 'key-wide')}
        {renderKey('Alt', altDisplay, 'key-wide')}
        {renderKey(' ', 'SPACE', 'key-space')}
        {renderKey('Alt', altDisplay, 'key-wide')}
        {renderKey('Ctrl', ctrlDisplay, 'key-wide')}
      </div>
    </div>
  );
};

export default Keyboard;