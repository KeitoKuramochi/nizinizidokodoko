# Claude Code 自律開発環境

## 概要

このプロジェクトは **Planner / Generator / Evaluator** の3エージェント構成で動作します。
人間は `idea.md` に短いアイデアを書くだけで、設計・実装・評価・修正まで自律的に回ります。

---

## エージェント構成

| エージェント | 役割 | 読むファイル | 書くファイル |
|---|---|---|---|
| **Planner** | idea.md → 仕様書・TASK 一覧を作る | idea.md | PROJECT_PLAN.md, REQUIREMENTS.md, MVP_TASKS.md |
| **Generator** | TASK を1つ実装・ビルド・コミットする | MVP_TASKS.md, REQUIREMENTS.md, SPRINT_CONTRACT.md | 実装コード, STATUS.md, MVP_TASKS.md（ステータス更新） |
| **Evaluator** | Playwright で実際に動かして合否を出す | REQUIREMENTS.md, EVALUATION_CRITERIA.md, MVP_TASKS.md | **書かない**（判定と修正プロンプトのみ出力） |

---

## 運用フロー

```
[人間] idea.md を書く
    ↓
[Planner] 仕様書・TASK 一覧を作成する
    ↓
[Generator] MVP_TASKS.md から [ ] の TASK を1つ選ぶ
    ↓
[Generator] 実装 → npm run build → git commit
    ↓
[Evaluator] Playwright MCP でブラウザ操作して評価する
    ↓
不合格 → [Generator] 修正プロンプトに従って修正する（最大3回）
合格  → [Generator] 次の [ ] TASK へ
    ↓
全 TASK が [DONE] になったらループ終了 → [人間] に報告
```

---

## TASK ステータスの流れ

TASK のステータスは以下の順に遷移します。ステータスを勝手に飛ばしてはいけません。

```
[ ] 未着手
 ↓  Generator が実装を開始したとき
[WIP] 実装中
 ↓  Generator がビルド成功・コミット完了したとき
[EVAL] Evaluator 評価待ち
 ↓             ↓
[DONE] 合格   [FAIL] 不合格
               ↓  Generator が修正を開始したとき
              [WIP] に戻る
```

### ステータスを更新するルール

| 誰が | いつ | 何に更新するか |
|---|---|---|
| Generator | 実装開始時 | `[ ]` → `[WIP]` |
| Generator | build 成功・commit 完了時 | `[WIP]` → `[EVAL]` |
| Generator | 合格通知を受け取ったとき | `[EVAL]` → `[DONE]` |
| Generator | 不合格通知を受け取って修正を開始するとき | `[FAIL]` → `[WIP]` |
| **Evaluator** | 合格判定を出したとき | Generator に「`[EVAL]` → `[DONE]` に更新してください」と指示する |
| **Evaluator** | 不合格判定を出したとき | Generator に「`[EVAL]` → `[FAIL]` に更新してください」と指示する |

**Evaluator は自分でファイルを書き換えない。Generator に更新を指示するだけ。**

---

## エージェント間の引き継ぎプロトコル

### Planner → Generator

Planner は作業完了時に以下を出力する:

```
## Planner → Generator 引き継ぎ

**作成したファイル**: PROJECT_PLAN.md, REQUIREMENTS.md, MVP_TASKS.md

**TASK 一覧**:
- TASK-01: 〇〇（完了条件: 〇〇）
- TASK-02: 〇〇（完了条件: 〇〇）

**最初に実装すべき TASK**: TASK-01
**特記事項**: 〇〇に注意してください
```

### Generator → Evaluator

Generator は実装完了時に以下を出力する:

```
## Generator → Evaluator 引き継ぎ

**実装した TASK**: TASK-XX 〇〇
**commit**: abc1234

**確認してほしい完了条件**:
- 〇〇が画面に表示されること
- 〇〇ボタンがクリックできること

**特に確認してほしい観点**:
- 〇〇はスマホ幅で崩れやすいので確認をお願いします

**dev server 起動コマンド**: npm run dev
```

### Evaluator → Generator（不合格時）

Evaluator は不合格判定時に以下を出力する:

```
## Evaluator → Generator 修正依頼

**対象 TASK**: TASK-XX
**判定**: 不合格

**修正必須（再現手順付き）**:
- 〇〇をクリックすると〇〇になるが、期待値は〇〇
- スマホ幅 375px で〇〇が画面からはみ出す

**修正してほしいファイル**:
- src/...

**修正後の完了条件**:
- 〇〇が〇〇できること
- npm run build が成功すること
- スマホ幅でレイアウトが崩れないこと

**STATUS 更新指示**: TASK-XX を [EVAL] → [FAIL] に更新してください
```

---

## 不合格ループの上限

同一 TASK で3回不合格になった場合、Generator は実装を停止して人間に報告する。

```
## 修正上限到達レポート: TASK-XX

TASK-XX が3回評価不合格となりました。

**不合格の理由（累積）**:
1回目: 〇〇
2回目: 〇〇
3回目: 〇〇

**人間に確認したいこと**:
- 完了条件を変更しますか？
- TASK を分割しますか？
- 別のアプローチを取りますか？
```

---

## Generator の /loop 終了条件

`/loop` で Generator を動かしている場合、以下のいずれかで終了する:

- `docs/MVP_TASKS.md` の全 TASK が `[DONE]` になった
- 同一 TASK で3回不合格になった（人間に報告して停止）
- 停止すべき状況（下記参照）に該当した

終了時の出力:

```
## Generator ループ完了

**全 TASK 完了** / **停止（理由: 〇〇）**

**完了した TASK**:
- TASK-01: commit abc1234
- TASK-02: commit def5678

**次のアクション**:
Evaluator で最終評価を行ってください。/ 人間の判断を待っています。
```

---

## 運用ルール

### 全エージェント共通

- `.env`、`.env.local`、`secret`、API key は読まない・作らない・変更しない
- `git push`、本番デプロイは人間の許可なしに行わない
- 外部 API 接続、DB 導入、認証導入は人間に確認してから行う
- 危険な操作・大きな判断は人間に確認する
- 他のエージェントが担当するファイルを勝手に書き換えない

### Planner のルール

- 仕様とタスクを作ることに集中する（実装しない、コードを書かない）
- 「何を作るか」を定義し、「どう作るか」は Generator に委ねる
- 1 TASK は build と commit ができる小さな単位にする
- 完了条件は Evaluator がブラウザ操作で確認できる形で書く
- 曖昧な完了条件（「いい感じに」「動くように」）は書かない

### Generator のルール

- TASK を1つずつ実装する（複数同時に実装しない）
- `npm run build` が通らない状態でコミットしない
- `any` 型は使わない。`@ts-ignore` も使わない
- 指定外の機能追加・大規模リファクタリングはしない
- `package.json` の依存関係を勝手に追加しない
- `git add .` を使わず、変更ファイルを個別に確認して add する
- `git push` はしない
- 自己評価だけで TASK を `[DONE]` にしない（必ず Evaluator を経由する）

### Evaluator のルール

- コードを修正しない・ファイルを書き換えない
- Playwright MCP で実際にブラウザ操作して確認する（コードを読むだけで合格にしない）
- 「概ね良い」「小さい問題なので OK」という判断は禁止
- スタブや仮実装のまま合格にしない
- 不合格の場合は Generator に戻す具体的な修正プロンプトを作る
- dev server の起動・停止は Evaluator が行う（`npm run dev &` / `kill`）

---

## 停止して人間に報告すべき状況

どのエージェントも、以下の状況では作業を停止して人間に報告する:

| 状況 | 停止するエージェント |
|---|---|
| 外部 API・DB・認証の追加が必要になった | Generator |
| API key・シークレットが必要になった | Generator |
| 3回修正してもビルドが通らない | Generator |
| 依存 TASK が未完了のまま進められない | Generator |
| 完了条件が曖昧または矛盾している | Generator |
| 同一 TASK で3回不合格になった | Generator |
| idea.md が空または読み取れない | Planner |
| REQUIREMENTS.md が存在しない（Generator 起動時） | Generator |
| dev server が起動しない | Evaluator |

---

## ファイル構成

```
idea.md                        # 人間が書くアイデア（起点）
CLAUDE.md                      # このファイル（運用ルール）
docs/
  PROJECT_PLAN.md              # アプリの目的・ユーザー・MVP範囲（Planner作成）
  REQUIREMENTS.md              # 画面・機能・ユーザーフロー（Planner作成）
  MVP_TASKS.md                 # タスク一覧と完了条件（Planner作成・Generator更新）
  STATUS.md                    # 各タスクの現在状態（Generator更新）
  SPRINT_CONTRACT.md           # タスク実施の契約ルール（固定・変更しない）
  EVALUATION_CRITERIA.md       # 評価基準（固定・変更しない）
  ERROR_FIX_LOOP.md            # エラー修正ループの手順（固定・変更しない）
.claude/agents/
  planner.md                   # Planner エージェント定義
  generator.md                 # Generator エージェント定義
  evaluator.md                 # Evaluator エージェント定義（Playwright MCP付き）
```

---

## 起動コマンド

### Planner を起動する

```
idea.md を読んで、docs/PROJECT_PLAN.md、docs/REQUIREMENTS.md、docs/MVP_TASKS.md を作成してください。
各 TASK に、Evaluator がブラウザ操作で確認できる完了条件を必ず書いてください。
```

### Generator を /loop で起動する

```
/loop
docs/MVP_TASKS.md から [EVAL] または [FAIL] でない未完了の TASK を1つ選んで実装してください。
docs/SPRINT_CONTRACT.md と docs/ERROR_FIX_LOOP.md のルールに従い、
npm run build が通った状態でコミットしてください。
全 TASK が [DONE] になったらループを終了して報告してください。
```

### Evaluator を起動する

```
docs/MVP_TASKS.md で [EVAL] ステータスの TASK を確認し、
Playwright MCP を使って実際にアプリを操作して評価してください。
docs/EVALUATION_CRITERIA.md の基準をすべて確認し、
1つでも満たさなければ不合格にしてください。
不合格の場合は Generator に渡す修正プロンプトを出力してください。
```
