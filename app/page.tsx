"use client";

import { useEffect } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";

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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold">NiziPro</h1>
      <p className="mt-2 text-gray-600">虹の方角チェッカー</p>
    </main>
  );
}
