# CLAUDE.md — Nizi Pro 開発ルール

## プロジェクト概要
現在地から虹がどの方向に出ているかを表示する Web アプリ「Nizi Pro」。
ソーシャルメディア（X など）の虹目撃情報と位置情報を組み合わせ、方角を提示する。

## 技術スタック
- **フレームワーク**: Next.js 16 (App Router, TypeScript)
- **スタイル**: Tailwind CSS
- **テスト**: (MVP 後に追加)
- **外部 API**: Geolocation API (ブラウザ標準) ／ X API (将来)

## 開発ルール

### コーディング規約
- TypeScript strict モード厳守、`any` 禁止
- コンポーネントは `src/components/` に配置
- App Router の規約（Server Component 優先、Client は `"use client"` 明示）
- Tailwind のみでスタイリング（CSS ファイル新規作成は原則不可）
- コメントは「なぜ」だけ書く。「何をしているか」は書かない

### ファイル構造
```
src/
  app/           # App Router のルート
  components/    # 再利用可能コンポーネント
  lib/           # ユーティリティ・計算ロジック
  types/         # 型定義
```

### セキュリティ
- `.env`, `.env.local`, シークレット、API キーは作成・読み込み禁止
- 外部 API の実キーは使わない
- 本番デプロイ禁止

### Git
- コミット前に `npm run build` が通ることを確認
- コミットメッセージは英語で簡潔に
- feat / fix / docs / refactor / test のプレフィックスを使う

### エラー対応
エラーが発生したら `docs/ERROR_FIX_LOOP.md` の手順に従って最大 3 回修正を試みる。
3 回失敗したら、原因・試したこと・次の案を報告して停止する。

### ドキュメント更新
実装が進んだら以下を更新する:
- `docs/STATUS.md` — 完了済みタスク・次のタスク
- `docs/MVP_TASKS.md` — タスクの完了マーク

## 参照ドキュメント
- `docs/PROJECT_PLAN.md` — 目的・ユーザー・MVP・将来機能
- `docs/REQUIREMENTS.md` — 画面・入力・出力・データ構造・制約
- `docs/MVP_TASKS.md` — 最初に実装する 5 タスク
- `docs/STATUS.md` — 現在の進捗
- `docs/ERROR_FIX_LOOP.md` — エラー修正手順

## Subagents
- `.claude/agents/reviewer.md` — 差分レビュー
- `.claude/agents/debugger.md` — エラー修正
- `.claude/agents/researcher.md` — 技術調査
