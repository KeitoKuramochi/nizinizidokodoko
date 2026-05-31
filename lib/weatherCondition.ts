import type { WeatherData, WeatherCondition } from "@/types/index";

/**
 * 降水量・雲量から虹が出やすいかどうかを判定する。
 *
 * 判定基準:
 * - 降水量 > 0 かつ 雲量 < 80 → condition: "good", 「虹が出やすい」
 * - 雲量 >= 80               → condition: "bad",  「出にくい（曇り）」
 * - 降水量 = 0               → condition: "bad",  「出にくい（雨なし）」
 */
export function evaluateWeatherCondition(data: WeatherData): WeatherCondition {
  if (data.cloudCover >= 80) {
    return {
      status: "出にくい",
      reason: "曇りのため太陽が見えにくい状態です",
    };
  }

  if (data.precipitation > 0) {
    return {
      status: "出やすい",
      reason: "雨が降っており太陽が見えています",
    };
  }

  return {
    status: "出にくい",
    reason: "現在雨が降っていません",
  };
}
