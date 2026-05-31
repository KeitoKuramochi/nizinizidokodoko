import SunCalc from "suncalc";
import type { Location, SunPosition, RainbowDirection, CompassLabel } from "@/types/index";

/**
 * 指定した位置・日時の太陽位置（方位角・仰角）を計算する。
 *
 * suncalc の getPosition() はラジアンを返し、方位角は南を 0 とする。
 * 北を 0 とする 0〜360° に変換して返す。
 */
export function getSunPosition(location: Location, date: Date): SunPosition {
  const pos = SunCalc.getPosition(date, location.latitude, location.longitude);

  // ラジアン → 度
  const altitudeDeg = pos.altitude * (180 / Math.PI);

  // suncalc の azimuth: 南=0、東=-、西=+ のラジアン値
  // → 北を 0 とする時計回り 0〜360° に変換
  const azimuthDeg = ((pos.azimuth * (180 / Math.PI)) + 180) % 360;

  return {
    azimuth: azimuthDeg,
    altitude: altitudeDeg,
  };
}

/**
 * 太陽方位角から虹の方角（反太陽点方向）を計算する。
 * 虹方角 = (太陽方位角 + 180) % 360
 */
export function getRainbowDirection(sunPosition: SunPosition): RainbowDirection {
  const azimuth = (sunPosition.azimuth + 180) % 360;
  const label = azimuthToCompassLabel(azimuth);
  return { azimuth, label };
}

/**
 * 方位角（0〜360°）を 8 方位ラベルに変換する。
 * 各方位の中心角に最も近い方向を返す。
 */
export function azimuthToCompassLabel(azimuth: number): CompassLabel {
  // 正規化
  const normalized = ((azimuth % 360) + 360) % 360;

  const labels: CompassLabel[] = [
    "北",
    "北東",
    "東",
    "南東",
    "南",
    "南西",
    "西",
    "北西",
  ];

  // 8 方位の境界は 22.5° 刻み。インデックス = Math.round(azimuth / 45) % 8
  const index = Math.round(normalized / 45) % 8;
  return labels[index];
}

/**
 * 太陽が地平線以下（夜間・日没直後）かどうかを判定する。
 * 仰角 <= 0° のとき true を返す。
 */
export function isSunBelowHorizon(sunPosition: SunPosition): boolean {
  return sunPosition.altitude <= 0;
}
