import React, { useState, useEffect } from 'react';
import type { ViewState, ShortcutData } from '../types';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import './Admin.css';

interface AdminProps {
  onNavigate: (view: ViewState) => void;
}

const emptyShortcut: ShortcutData = {
  id: '',
  difficulty: 'NORMAL',
  keys: [],
  commandName: '',
  description: '',
  wordMeaning: '',
  etymology: ''
};

const Admin: React.FC<AdminProps> = ({ onNavigate }) => {
  const [shortcuts, setShortcuts] = useState<ShortcutData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/shortcuts');
        if (res.ok) {
          const data = await res.json();
          setShortcuts(data);
        } else {
          setMessage('データの読み込みに失敗しました。');
        }
      } catch (err) {
        setMessage('エラーが発生しました。');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    const invalidItem = shortcuts.find(sc => !sc.id.trim() || !sc.commandName.trim() || !sc.keys || sc.keys.length === 0);
    if (invalidItem) {
      setMessage('エラー：ID、Command Name、Keysが空の項目があります。入力するか削除してください。');
      setTimeout(() => setMessage(''), 5000);
      return;
    }

    setSaving(true);
    setMessage('保存中...');
    try {
      const res = await fetch('/api/shortcuts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shortcuts)
      });
      if (res.ok) {
        setMessage('正常に保存されました！');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('保存に失敗しました。');
      }
    } catch (err) {
      setMessage('保存中にエラーが発生しました。');
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = () => {
    setShortcuts([{ ...emptyShortcut, id: `new_${Date.now()}` }, ...shortcuts]);
  };

  const handleDelete = (index: number) => {
    if (confirm('本当に削除しますか？')) {
      const newShortcuts = [...shortcuts];
      newShortcuts.splice(index, 1);
      setShortcuts(newShortcuts);
    }
  };

  const handleChange = (index: number, field: keyof ShortcutData, value: string) => {
    const newShortcuts = [...shortcuts];
    if (field === 'keys' || field === 'macKeys' || field === 'chromeKeys') {
      // Split by comma and trim
      const arrayValue = value ? value.split(',').map(s => s.trim()) : undefined;
      newShortcuts[index] = { ...newShortcuts[index], [field]: arrayValue };
    } else {
      newShortcuts[index] = { ...newShortcuts[index], [field]: value };
    }
    setShortcuts(newShortcuts);
  };

  if (loading) return <div className="admin-container">読み込み中...</div>;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <button className="secondary-btn" onClick={() => onNavigate('home')}>
          <ArrowLeft size={20} /> 戻る
        </button>
        <h2 className="admin-title">ショートカットデータ管理 (Admin)</h2>
        <button className="primary-btn save-btn" onClick={handleSave} disabled={saving}>
          <Save size={20} /> {saving ? '保存中...' : 'JSONを保存'}
        </button>
      </div>

      {message && <div className={`admin-message ${message.includes('失敗') || message.includes('エラー') ? 'error' : 'success'}`}>{message}</div>}

      <div className="admin-actions">
        <button className="secondary-btn add-btn" onClick={handleAdd}>
          <Plus size={20} /> 新規追加
        </button>
        <span className="admin-note">※ [ルビ](るび) の形式で入力すると自動でふりがなが振られます。複数のキーは「,」（カンマ）で区切ってください。</span>
      </div>

      <div className="admin-list">
        {shortcuts.map((sc, index) => (
          <div key={index} className="admin-card">
            <div className="admin-card-header">
              <input 
                type="text" 
                value={sc.id} 
                onChange={(e) => handleChange(index, 'id', e.target.value)} 
                placeholder="ID (例: copy)" 
                className="admin-input id-input"
              />
              <select 
                value={sc.difficulty} 
                onChange={(e) => handleChange(index, 'difficulty', e.target.value)}
                className="admin-select"
              >
                <option value="EASY">EASY</option>
                <option value="NORMAL">NORMAL</option>
                <option value="HARD">HARD</option>
              </select>
              <button className="delete-btn" onClick={() => handleDelete(index)}><Trash2 size={18} /></button>
            </div>
            <div className="admin-card-body">
              <div className="input-group">
                <label>Command Name (英語名)</label>
                <input type="text" value={sc.commandName} onChange={(e) => handleChange(index, 'commandName', e.target.value)} className="admin-input" />
              </div>
              
              <div className="input-group keys-group">
                <div>
                  <label>Keys (Win/標準)</label>
                  <input type="text" value={sc.keys.join(', ')} onChange={(e) => handleChange(index, 'keys', e.target.value)} placeholder="Ctrl, C" className="admin-input" />
                </div>
                <div>
                  <label>Mac Keys (上書き用)</label>
                  <input type="text" value={sc.macKeys ? sc.macKeys.join(', ') : ''} onChange={(e) => handleChange(index, 'macKeys', e.target.value)} placeholder="Cmd, C" className="admin-input" />
                </div>
                <div>
                  <label>Chrome Keys (上書き用)</label>
                  <input type="text" value={sc.chromeKeys ? sc.chromeKeys.join(', ') : ''} onChange={(e) => handleChange(index, 'chromeKeys', e.target.value)} placeholder="Search, C" className="admin-input" />
                </div>
              </div>

              <div className="input-group">
                <label>Word Meaning (意味)</label>
                <input type="text" value={sc.wordMeaning} onChange={(e) => handleChange(index, 'wordMeaning', e.target.value)} className="admin-input" />
              </div>

              <div className="input-group">
                <label>Description (用途)</label>
                <textarea value={sc.description} onChange={(e) => handleChange(index, 'description', e.target.value)} className="admin-textarea" rows={2} />
              </div>

              <div className="input-group">
                <label>Etymology (語源)</label>
                <textarea value={sc.etymology} onChange={(e) => handleChange(index, 'etymology', e.target.value)} className="admin-textarea" rows={2} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
