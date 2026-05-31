"use client";

import { useCallback, useState } from "react";
import type { UserLocation } from "@/types";

type GeolocationState = {
  location: UserLocation | null;
  error: string | null;
  loading: boolean;
};

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    error: null,
    loading: false,
  });

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState({ location: null, error: "このブラウザは位置情報に対応していません", loading: false });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          location: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          },
          error: null,
          loading: false,
        });
      },
      (err) => {
        const message =
          err.code === err.PERMISSION_DENIED
            ? "位置情報の使用が許可されていません"
            : err.code === err.TIMEOUT
            ? "位置情報の取得がタイムアウトしました"
            : "位置情報を取得できませんでした";
        setState({ location: null, error: message, loading: false });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  }, []);

  return { ...state, getLocation };
}
