"use client";

import { useState, useEffect } from "react";
import type { Location, WeatherData, WeatherCondition, FetchStatus } from "@/types/index";
import { evaluateWeatherCondition } from "@/lib/weatherCondition";

type UseWeatherResult = {
  weatherData: WeatherData | null;
  condition: WeatherCondition | null;
  status: FetchStatus;
  errorMessage: string | null;
};

type OpenMeteoResponse = {
  current: {
    precipitation: number;
    cloud_cover: number;
  };
};

/**
 * Open-Meteo API から現在地の気象データを取得するカスタムフック。
 *
 * 引数: Location（緯度・経度）
 * 返り値: weatherData, condition, status, errorMessage
 *
 * location が null の場合は取得を行わない（loading のまま待機）。
 */
export function useWeather(location: Location | null): UseWeatherResult {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [condition, setCondition] = useState<WeatherCondition | null>(null);
  const [status, setStatus] = useState<FetchStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (location === null) {
      // 位置情報が未取得の場合は待機
      return;
    }

    let cancelled = false;

    const fetchWeather = async (): Promise<void> => {
      setStatus("loading");
      setErrorMessage(null);

      try {
        const url = new URL("https://api.open-meteo.com/v1/forecast");
        url.searchParams.set("latitude", String(location.latitude));
        url.searchParams.set("longitude", String(location.longitude));
        url.searchParams.set("current", "precipitation,cloud_cover");

        const response = await fetch(url.toString());

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const json: OpenMeteoResponse = (await response.json()) as OpenMeteoResponse;

        if (cancelled) return;

        const data: WeatherData = {
          precipitation: json.current.precipitation,
          cloudCover: json.current.cloud_cover,
        };

        const cond = evaluateWeatherCondition(data);

        setWeatherData(data);
        setCondition(cond);
        setStatus("success");
      } catch (err: unknown) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "不明なエラー";
        setErrorMessage(`気象データの取得に失敗しました: ${message}`);
        setStatus("error");
      }
    };

    void fetchWeather();

    return () => {
      cancelled = true;
    };
  }, [location?.latitude, location?.longitude]);

  return { weatherData, condition, status, errorMessage };
}
