# MVP_TASKS.md

MVP として最初に実装する 5 タスク。上から順に実装する。

---

## TASK-01: 方位角計算ロジック（`src/lib/geo.ts`）
**状態**: [x] 完了

実装内容:
- `calcBearing(from: UserLocation, to: RainbowSighting): BearingResult` を実装
- Haversine 公式で距離(km)を計算
- Bearing 公式で方位角(0〜360度)を計算
- 16 方位名（北・北北東・北東 … 北北西）を返す

ファイル:
- `src/lib/geo.ts` — 計算ロジック（純粋関数）
- `src/types/index.ts` — `UserLocation`, `RainbowSighting`, `BearingResult` 型定義

---

## TASK-02: モックデータ（`src/lib/mockData.ts`）
**状態**: [x] 完了

実装内容:
- 3〜5 件の `RainbowSighting` モックデータを定義
- 位置は日本国内の実在する緯度経度（東京・大阪・千葉など）
- `source: "mock"` を設定

ファイル:
- `src/lib/mockData.ts`

---

## TASK-03: 位置情報取得フック（`src/hooks/useGeolocation.ts`）
**状態**: [x] 完了

実装内容:
- `useGeolocation()` カスタムフックを実装
- `{ location, error, loading }` を返す
- `navigator.geolocation.getCurrentPosition` を使用
- エラーハンドリング（許可拒否・タイムアウト）

ファイル:
- `src/hooks/useGeolocation.ts`

---

## TASK-04: コンパス UI コンポーネント（`src/components/CompassCard.tsx`）
**状態**: [ ] 未着手

実装内容:
- `bearing: BearingResult` を props で受け取る
- SVG で円形コンパスを描画（N/E/S/W の目盛り付き）
- 針が `degrees` の方向を指す（CSS transform rotate）
- 下部に方角名と距離を表示（例: 「北北東 2.4km」）

ファイル:
- `src/components/CompassCard.tsx`

---

## TASK-05: ホーム画面の組み立て（`src/app/page.tsx`）
**状態**: [ ] 未着手

実装内容:
- TASK-01〜04 を組み合わせてホーム画面を完成させる
- `useGeolocation` で現在地取得
- 最も近い目撃情報を選び `calcBearing` で方角を計算
- `CompassCard` に結果を渡す
- ローディング・エラー・空ステートの表示

ファイル:
- `src/app/page.tsx`（既存を上書き）

---

## 完了条件
- `npm run build` が通る
- スマホ表示（375px 幅）でコンパスが正しく表示される
- 位置情報許可時：コンパスが最寄りの虹の方角を指す
- 位置情報拒否時：適切なエラーメッセージが表示される
