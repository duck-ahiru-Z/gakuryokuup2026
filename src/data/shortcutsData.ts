import type { ShortcutData } from '../types';

export const SHORTCUTS: ShortcutData[] = [
  { 
    id: 'copy', 
    keys: ['Ctrl', 'C'], 
    commandName: 'Copy', 
    description: '選択した項目をコピーする', 
    wordMeaning: '複製する・写す', 
    etymology: 'ラテン語の copia (豊富) に由来', 
    exampleSentence: 'Please copy this file.' 
  },
  { 
    id: 'paste', 
    keys: ['Ctrl', 'V'], 
    commandName: 'Paste', 
    description: 'コピーした項目を貼り付ける', 
    wordMeaning: '貼り付ける・のり', 
    etymology: '俗ラテン語 pasta (練り粉) に由来。VはCの隣で押しやすいから選ばれた説も', 
    exampleSentence: 'Paste the text here.' 
  },
  { 
    id: 'cut', 
    keys: ['Ctrl', 'X'], 
    commandName: 'Cut', 
    description: '選択した項目を切り取る', 
    wordMeaning: '切る・切り取る', 
    etymology: 'Xがハサミの形に似ているため', 
    exampleSentence: 'Cut the image and paste it.' 
  },
  { 
    id: 'undo', 
    keys: ['Ctrl', 'Z'], 
    commandName: 'Undo', 
    description: '直前の操作を元に戻す', 
    wordMeaning: '元に戻す・取り消す', 
    etymology: 'Zはキーボードの端にあり押しやすいため。un-(逆) + do(する)', 
    exampleSentence: 'You can undo your mistake.' 
  },
  { 
    id: 'save', 
    keys: ['Ctrl', 'S'], 
    commandName: 'Save', 
    description: 'ファイルを保存する', 
    wordMeaning: '救う・保存する', 
    etymology: 'ラテン語 salvare (救う) に由来', 
    exampleSentence: 'Don\'t forget to save your work.' 
  },
  { 
    id: 'find', 
    keys: ['Ctrl', 'F'], 
    commandName: 'Find', 
    description: '文字を検索する', 
    wordMeaning: '見つける・探す', 
    etymology: '古英語 findan (見つける) に由来', 
    exampleSentence: 'Find the hidden word.' 
  },
  { 
    id: 'select_all', 
    keys: ['Ctrl', 'A'], 
    commandName: 'Select All', 
    description: 'すべてを選択する', 
    wordMeaning: 'すべての', 
    etymology: 'All (すべて) の頭文字', 
    exampleSentence: 'Select all files in the folder.' 
  },
  {
    id: 'print',
    keys: ['Ctrl', 'P'],
    commandName: 'Print',
    description: '画面を印刷する',
    wordMeaning: '印刷する',
    etymology: 'Print (印刷) の頭文字',
    exampleSentence: 'Print this document.'
  },
  {
    id: 'new',
    keys: ['Ctrl', 'N'],
    commandName: 'New',
    description: '新しいファイル・ウィンドウを開く',
    wordMeaning: '新しい',
    etymology: 'New (新しい) の頭文字',
    exampleSentence: 'Create a new project.'
  }
];
