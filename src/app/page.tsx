"use client";

import { CompassCard } from "@/components/CompassCard";
import { useGeolocation } from "@/hooks/useGeolocation";
import { calcBearing } from "@/lib/geo";
import { MOCK_SIGHTINGS } from "@/lib/mockData";
import type { BearingResult, RainbowSighting } from "@/types";

function findNearestWithBearing(
  lat: number,
  lng: number,
): { sighting: RainbowSighting; bearing: BearingResult } | null {
  if (MOCK_SIGHTINGS.length === 0) return null;
  const userLoc = { lat, lng, accuracy: 0 };
  let best = {
    sighting: MOCK_SIGHTINGS[0],
    bearing: calcBearing(userLoc, MOCK_SIGHTINGS[0]),
  };
  for (const s of MOCK_SIGHTINGS.slice(1)) {
    const b = calcBearing(userLoc, s);
    if (b.distanceKm < best.bearing.distanceKm) {
      best = { sighting: s, bearing: b };
    }
  }
  return best;
}

export default function Home() {
  const { location, error, loading, getLocation } = useGeolocation();

  const result =
    location ? findNearestWithBearing(location.lat, location.lng) : null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-100 to-white flex flex-col items-center justify-center gap-8 px-4 py-12">
      {/* header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-sky-700 tracking-tight">🌈 Nizi Pro</h1>
        <p className="text-sm text-slate-500 mt-1">今いる場所から虹がどの方向にあるか確認できます</p>
      </div>

      {/* compass or states */}
      {result ? (
        <>
          <CompassCard bearing={result.bearing} />
          <p className="text-xs text-slate-400 text-center max-w-xs">
            目撃情報: {result.sighting.description ?? "不明"}<br />
            ({new Date(result.sighting.reportedAt).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })} 報告)
          </p>
        </>
      ) : loading ? (
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <div className="w-10 h-10 border-4 border-sky-300 border-t-sky-600 rounded-full animate-spin" />
          <p className="text-sm">位置情報を取得中…</p>
        </div>
      ) : error ? (
        <div className="rounded-xl bg-red-50 border border-red-200 p-5 text-center max-w-xs">
          <p className="text-red-600 font-medium text-sm">{error}</p>
          <button
            onClick={getLocation}
            className="mt-3 text-xs text-red-500 underline underline-offset-2"
          >
            もう一度試す
          </button>
        </div>
      ) : (
        /* initial empty state */
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="text-6xl">🌤️</div>
          <p className="text-slate-600 text-sm max-w-xs">
            現在地を取得すると、最寄りの虹目撃情報からどの方向に虹があるか表示します
          </p>
        </div>
      )}

      {/* location button */}
      {!loading && (
        <button
          onClick={getLocation}
          className="px-6 py-3 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white rounded-full text-sm font-semibold shadow transition-colors"
        >
          {location ? "位置情報を更新" : "現在地から虹を探す"}
        </button>
      )}

      {/* location accuracy badge */}
      {location && (
        <p className="text-xs text-slate-400">
          精度: ±{Math.round(location.accuracy)} m
        </p>
      )}
    </main>
  );
}
