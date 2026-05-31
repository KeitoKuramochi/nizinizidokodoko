import type { WeatherCondition as WeatherConditionType, FetchStatus } from "@/types/index";

type WeatherConditionProps = {
  condition: WeatherConditionType | null;
  status: FetchStatus;
};

export function WeatherCondition({ condition, status }: WeatherConditionProps) {
  if (status === "loading") {
    return (
      <div className="flex flex-col items-center gap-2 p-4 w-full max-w-xs mx-auto">
        <p className="text-gray-500 text-sm">気象データ取得中...</p>
      </div>
    );
  }

  if (status === "error" || condition === null) {
    return (
      <div className="flex flex-col items-center gap-2 p-4 w-full max-w-xs mx-auto">
        <p className="text-red-500 text-sm">気象データの取得に失敗しました</p>
      </div>
    );
  }

  const isGood = condition.status === "出やすい";

  return (
    <div className="flex flex-col items-center gap-3 p-4 w-full max-w-xs mx-auto">
      {/* バッジ */}
      <span
        className={
          isGood
            ? "inline-block px-4 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800"
            : "inline-block px-4 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-600"
        }
      >
        {isGood ? "虹が出やすい" : "虹が出にくい"}
      </span>

      {/* 理由テキスト */}
      <p className="text-center text-sm text-gray-700 leading-relaxed">
        {condition.reason}
      </p>
    </div>
  );
}
