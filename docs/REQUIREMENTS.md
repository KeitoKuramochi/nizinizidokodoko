# REQUIREMENTS.md

## 画面一覧

### 1. ホーム画面（`/`）
- 現在地取得ボタン or 自動取得
- 虹の目撃情報リスト（MVP ではモックデータ）
- 最新の虹への方角を大きく表示するコンパス UI

### 2. 詳細画面（将来: `/rainbow/[id]`）
- 特定の目撃情報の詳細（時刻、方角、距離、元ツイート）

---

## 入力
| 入力 | 取得方法 | 備考 |
|---|---|---|
| 現在地（緯度・経度） | `navigator.geolocation.getCurrentPosition` | ユーザー許可が必要 |
| 虹の発生位置（緯度・経度） | MVP ではモックデータ | 将来は X API から取得 |

---

## 出力
| 出力 | 説明 |
|---|---|
| 方位角（度） | 0〜360 度（北=0、東=90、南=180、西=270） |
| 方角名 | 「北北東」「南西」などの 16 方位名称 |
| 距離 | 現在地から虹目撃位置までの直線距離（km） |
| コンパス UI | 針が方角を指す SVG アニメーション |

---

## データ構造

### RainbowSighting（虹目撃情報）
```typescript
type RainbowSighting = {
  id: string;
  lat: number;       // 緯度
  lng: number;       // 経度
  reportedAt: string; // ISO 8601
  source: "mock" | "x_api"; // データソース
  description?: string;     // 元投稿テキスト
};
```

### UserLocation
```typescript
type UserLocation = {
  lat: number;
  lng: number;
  accuracy: number; // メートル
};
```

### BearingResult
```typescript
type BearingResult = {
  degrees: number;        // 0〜360
  direction: string;      // "北", "北北東" など
  distanceKm: number;
};
```

---

## 計算ロジック（方位角）
Haversine 公式で距離、Bearing 公式で方位を計算。
`src/lib/geo.ts` に純粋関数として実装する。

```
bearing = atan2(
  sin(Δλ) * cos(φ2),
  cos(φ1) * sin(φ2) − sin(φ1) * cos(φ2) * cos(Δλ)
)
```

---

## 制約
- 位置情報はブラウザのみで処理し、外部サーバーには送信しない
- HTTPS が必要（Geolocation API の要件）
- 位置情報が取得できない場合は「位置情報を許可してください」メッセージを表示
- 目撃情報が 0 件の場合は空ステートを表示
- モバイルファースト（320px 以上で崩れない）
