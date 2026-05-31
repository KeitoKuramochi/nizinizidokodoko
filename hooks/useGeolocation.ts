"use client";

import { useState, useEffect } from "react";
import type { Location, FetchStatus } from "@/types/index";

type UseGeolocationResult = {
  location: Location | null;
  status: FetchStatus;
  errorMessage: string | null;
};

export function useGeolocation(): UseGeolocationResult {
  const [location, setLocation] = useState<Location | null>(null);
  const [status, setStatus] = useState<FetchStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus("error");
      setErrorMessage("このブラウザは Geolocation API に対応していません。");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc: Location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(loc);
        setStatus("success");
        setErrorMessage(null);
      },
      (error) => {
        setStatus("error");
        setErrorMessage(`位置情報の取得に失敗しました: ${error.message}`);
      }
    );
  }, []);

  return { location, status, errorMessage };
}
