"use client";

import { useEffect } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { getSunPosition, getRainbowDirection, isSunBelowHorizon } from "@/lib/sunCalc";

// TASK-04 確認用: 東京座標で計算結果を出力
const TEST_LOCATION = { latitude: 35.6, longitude: 139.7 };

export default function Home() {
  const { location, status, errorMessage } = useGeolocation();

  useEffect(() => {
    if (status === "success" && location !== null) {
      console.log("緯度:", location.latitude, "経度:", location.longitude);
    }
    if (status === "error" && errorMessage !== null) {
      console.log("エラー:", errorMessage);
    }
  }, [status, location, errorMessage]);

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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold">NiziPro</h1>
      <p className="mt-2 text-gray-600">虹の方角チェッカー</p>
    </main>
  );
}
