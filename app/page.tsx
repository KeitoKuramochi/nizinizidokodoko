"use client";

import { useEffect } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useWeather } from "@/hooks/useWeather";
import { getSunPosition, getRainbowDirection, isSunBelowHorizon } from "@/lib/sunCalc";
import { CompassCard } from "@/components/CompassCard";
import { WeatherCondition } from "@/components/WeatherCondition";
import type { WeatherCondition as WeatherConditionType } from "@/types/index";

// TASK-04 確認用: 東京座標で計算結果を出力
const TEST_LOCATION = { latitude: 35.6, longitude: 139.7 };

// TASK-07 確認用: モックデータ
const MOCK_CONDITION_GOOD: WeatherConditionType = {
  status: "出やすい",
  reason: "雨が降っており、太陽が見える状態です。虹が出やすい条件です。",
};
const MOCK_CONDITION_BAD: WeatherConditionType = {
  status: "出にくい",
  reason: "雲量が多く、太陽が雲に隠れています。虹が出にくい状態です。",
};

export default function Home() {
  const { location, status: geoStatus, errorMessage: geoError } = useGeolocation();
  const { weatherData, condition, status: weatherStatus, errorMessage: weatherError } = useWeather(location);

  useEffect(() => {
    if (geoStatus === "success" && location !== null) {
      console.log("緯度:", location.latitude, "経度:", location.longitude);
    }
    if (geoStatus === "error" && geoError !== null) {
      console.log("エラー:", geoError);
    }
  }, [geoStatus, location, geoError]);

  // TASK-04 確認用: マウント時に東京座標で太陽位置・虹方角を計算して出力
  useEffect(() => {
    const now = new Date();
    const sunPos = getSunPosition(TEST_LOCATION, now);
    const rainbowDir = getRainbowDirection(sunPos);
    const belowHorizon = isSunBelowHorizon(sunPos);

    console.log("[TASK-04] 太陽方位角:", sunPos.azimuth.toFixed(2), "°");
    console.log("[TASK-04] 太陽仰角:", sunPos.altitude.toFixed(2), "°");
    console.log("[TASK-04] 虹方角:", rainbowDir.azimuth.toFixed(2), "°", "/", rainbowDir.label);
    console.log("[TASK-04] 地平線以下（夜間）:", belowHorizon);
  }, []);

  // TASK-05 確認用: 気象データ取得結果を出力
  useEffect(() => {
    if (weatherStatus === "loading") {
      console.log("[TASK-05] 気象データ取得中...");
    }
    if (weatherStatus === "success" && weatherData !== null && condition !== null) {
      console.log("[TASK-05] 降水量:", weatherData.precipitation, "mm/h");
      console.log("[TASK-05] 雲量:", weatherData.cloudCover, "%");
      console.log("[TASK-05] 判定:", condition.status, "/", condition.reason);
    }
    if (weatherStatus === "error" && weatherError !== null) {
      console.log("[TASK-05] 気象データエラー:", weatherError);
    }
  }, [weatherStatus, weatherData, condition, weatherError]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold">NiziPro</h1>
      <p className="mt-2 text-gray-600">虹の方角チェッカー</p>
      {/* TASK-06 確認用: 仮の方位角 135°（南東）でコンパス表示 */}
      <div className="mt-8 w-full max-w-xs">
        <p className="text-center text-sm text-gray-500 mb-2">（TASK-06 確認用: 135° 南東）</p>
        <CompassCard azimuth={135} compassLabel="南東" />
      </div>

      {/* TASK-07 確認用: 「出やすい」モックデータ */}
      <div className="mt-8 w-full max-w-xs">
        <p className="text-center text-sm text-gray-500 mb-2">（TASK-07 確認用: 出やすい）</p>
        <WeatherCondition condition={MOCK_CONDITION_GOOD} status="success" />
      </div>

      {/* TASK-07 確認用: 「出にくい」モックデータ */}
      <div className="mt-4 w-full max-w-xs">
        <p className="text-center text-sm text-gray-500 mb-2">（TASK-07 確認用: 出にくい）</p>
        <WeatherCondition condition={MOCK_CONDITION_BAD} status="success" />
      </div>

      {/* TASK-07 確認用: ローディング状態 */}
      <div className="mt-4 w-full max-w-xs">
        <p className="text-center text-sm text-gray-500 mb-2">（TASK-07 確認用: ローディング）</p>
        <WeatherCondition condition={null} status="loading" />
      </div>

      {/* TASK-07 確認用: エラー状態 */}
      <div className="mt-4 w-full max-w-xs">
        <p className="text-center text-sm text-gray-500 mb-2">（TASK-07 確認用: エラー）</p>
        <WeatherCondition condition={null} status="error" />
      </div>
    </main>
  );
}
