# Shortcut Academy (ショートカット・アカデミー) 🚀

「PC操作のスピードアップ」と「英語の語源学習」を同時に実現する、新感覚の学習用Webアプリケーションです。Next.js (App Router) と TypeScript で構築されています。

## ✨ 主な機能 (Features)

*   **📘 難易度別のショートカット図鑑 (Dictionary)**
    *   EASY（基本）、NORMAL（標準）、HARD（上級）の3段階でショートカットを体系的に学べます。
*   **🍎 OS自動判定＆キー変換 (OS Auto-Detection)**
    *   ユーザーのブラウザからWindows / Mac / ChromeOSを自動判定。
    *   例: Macユーザーには `Ctrl` を自動的に `Cmd` に変換して表示。スクリーンショットなどのOS特有のキーボードショートカットにも個別対応。
*   **📖 読み仮名 (ルビ) フル対応**
    *   設定から「ふりがな」をオンにすると、全ての説明文や語源に自動でルビが振られます。小中学生のタイピング・PC学習にも最適です。
*   **🌓 ダークモード＆ライトモード**
    *   目に優しいダークテーマと、視認性の高いライトテーマをシームレスに切り替え可能。
*   **🛠️ フルスクラッチのAdmin（管理）画面**
    *   Next.jsのAPI Routesを活用し、ブラウザ上の管理画面から直接ローカルの `src/data/shortcuts.json` を上書き保存（CRUD操作）できる仕組みを実装しています。

---

## 📁 フォルダ構成 (Project Structure)

他の開発者がコードを理解しやすいように、各機能は細かくコンポーネントやユーティリティに分割（リファクタリング）されています。

```text
src/
├── app/                  # Next.js App Routerのエントリーポイント
│   ├── api/shortcuts/    # Admin画面からJSONを直接上書き保存するためのAPIエンドポイント
│   ├── globals.css       # アプリ全体で共通利用するCSS（ボタンやルビのスタイル等）
│   ├── layout.tsx        # アプリのベースレイアウト
│   └── page.tsx          # メインの画面遷移（ルーティング）を管理するコンポーネント
│
├── components/           # UIコンポーネント群
│   ├── Admin.tsx         # JSONデータをブラウザから直接編集・追加・保存できる管理画面
│   ├── Dictionary.tsx    # 図鑑画面の親コンポーネント（難易度別のセクション管理）
│   ├── DictionaryCard.tsx# 図鑑のカード単体のUI（キー配列や説明の描画）
│   ├── Home.tsx          # トップ画面（モード選択、設定へのナビゲーション）
│   └── Settings.tsx      # 言語、ふりがな、ダークモードの切り替えモーダル
│
├── data/                 
│   └── shortcuts.json    # ショートカットのマスターデータ（Admin画面から自動更新されます）
│
├── hooks/
│   └── useOS.ts          # ユーザーのOS(Win/Mac/ChromeOS)を自動判定するカスタムフック
│
├── utils/
│   ├── shortcutUtils.tsx # OS別のキー変換ロジックや、ルビ([漢字](かんじ))のパース処理
│   └── storageUtils.ts   # ユーザーの学習進捗などをローカルストレージに保存する処理
│
└── types.ts              # アプリ全体で使用するTypeScriptの型定義
```

---

## 🚀 開発環境の立ち上げ方 (Getting Started)

### 1. インストール
```bash
npm install
```

### 2. 開発サーバーの起動
```bash
npm run dev
```
ブラウザで `http://localhost:3000` にアクセスしてください。

---

## 📝 データの追加・編集について (How to Edit Data)
当アプリでは、ショートカットのデータを手動でコードをいじって追加する必要はありません。
ローカルで `npm run dev` を起動している状態で、アプリのトップ画面下部にある **「管理 (ADMIN)」** ボタンをクリックしてください。
専用のダッシュボードが開き、ブラウザ上から直感的にデータの追加・編集・削除が行え、**「JSONを保存」** ボタンを押すだけで実際の `src/data/shortcuts.json` が上書き保存されます！

---

## 💻 技術スタック (Tech Stack)
*   **Framework**: Next.js (React)
*   **Language**: TypeScript
*   **Styling**: Vanilla CSS (CSS Variablesを用いたテーマ管理)
*   **Icons**: Lucide React
