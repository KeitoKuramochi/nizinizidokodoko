# STATUS.md

最終更新: 2026-05-30

## 現在のフェーズ
**Phase 0: プロジェクト初期化 完了**

---

## 完了済み
- [x] Next.js 16 (TypeScript, Tailwind, App Router) プロジェクト初期化
- [x] `npm run build` 通過確認
- [x] `git init` と初期コミット
- [x] `docs/ideas/idea.md` にアイデア保存
- [x] `CLAUDE.md` 作成（開発ルール）
- [x] `docs/PROJECT_PLAN.md` 作成
- [x] `docs/REQUIREMENTS.md` 作成
- [x] `docs/MVP_TASKS.md` 作成（5 タスク）
- [x] `docs/ERROR_FIX_LOOP.md` 作成
- [x] `.claude/agents/reviewer.md` 作成
- [x] `.claude/agents/debugger.md` 作成
- [x] `.claude/agents/researcher.md` 作成

---

## 次にやること
**TASK-01: 方位角計算ロジック**
- `src/types/index.ts` に型定義を作成
- `src/lib/geo.ts` に `calcBearing` を実装
- 参照: `docs/MVP_TASKS.md` TASK-01

---

## ブロッカー
なし

---

## 既知の問題
- `next build` 実行時に workspace root 警告が出るが、ビルドには影響なし
  ```
  ⚠ Next.js inferred your workspace root, but it may not be correct.
  ```
  将来的には `next.config.ts` で `turbopack.root` を設定して解消する。
