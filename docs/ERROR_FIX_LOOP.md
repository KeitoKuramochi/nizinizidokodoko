# ERROR_FIX_LOOP.md

Claude Code がエラーに遭遇したときの自律修正手順。

---

## ステップ 0: エラーを分類する

| 種類 | 見分け方 | 対処 |
|---|---|---|
| TypeScript 型エラー | `Type error:` / `TS2xxx` | STEP A |
| ビルドエラー（構文） | `SyntaxError` / `Unexpected token` | STEP B |
| モジュール未解決 | `Cannot find module` | STEP C |
| ランタイムエラー | ブラウザコンソール・サーバーログ | STEP D |

---

## STEP A: TypeScript 型エラー

1. エラーメッセージのファイル名・行番号を確認する
2. `src/types/index.ts` の型定義と実際の使用箇所を照合する
3. `any` は使わず、正しい型を定義して修正する
4. `npm run build` で再確認

---

## STEP B: 構文エラー

1. エラーが示すファイル・行を開く
2. 閉じ括弧・クォート・インポートの不整合を確認する
3. 修正後に `npm run build`

---

## STEP C: モジュール未解決

1. `import` のパスが正しいか確認（`@/` エイリアスは `src/` を指す）
2. 対象ファイルが実際に存在するか確認
3. `node_modules` に入っているか確認（なければ `npm install <pkg>`）
4. `npm run build`

---

## STEP D: ランタイムエラー

1. エラースタックトレースを読む
2. Server Component / Client Component の境界で `"use client"` が必要か確認
3. `window` / `document` / `navigator` は Client Component からのみ呼ぶ
4. `npm run build`

---

## 3 回失敗したら停止

修正を 3 回試みてもビルドが通らない場合:

```
【修正失敗レポート】
- エラー内容:
- 試みた修正1:
- 試みた修正2:
- 試みた修正3:
- 考えられる原因:
- 次の案:
```

上記を報告して作業を停止し、ユーザーの判断を仰ぐ。

---

## よくあるパターン

### Geolocation は Client Component のみ
```tsx
// NG: Server Component で navigator を使う
// OK: "use client" を宣言したコンポーネントで使う
"use client";
import { useGeolocation } from "@/hooks/useGeolocation";
```

### SVG の型エラー
```tsx
// transform 属性に number を渡すと型エラー
// rotate(${degrees}) のように文字列で渡す
transform={`rotate(${degrees}, 50, 50)`}
```
