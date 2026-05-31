"use client";

import type { BearingResult } from "@/types";

type Props = {
  bearing: BearingResult;
};

export function CompassCard({ bearing }: Props) {
  const { degrees, direction, distanceKm } = bearing;

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-2xl shadow-lg w-72">
      <p className="text-sm text-gray-500 tracking-wide">虹の方角</p>

      {/* compass dial */}
      <svg viewBox="0 0 100 100" width={200} height={200} aria-label={`方角: ${direction}`}>
        {/* outer ring */}
        <circle cx="50" cy="50" r="46" fill="#f0f4ff" stroke="#cbd5e1" strokeWidth="1.5" />

        {/* cardinal tick marks */}
        {[0, 90, 180, 270].map((angle) => {
          const rad = ((angle - 90) * Math.PI) / 180;
          return (
            <line
              key={angle}
              x1={50 + 38 * Math.cos(rad)}
              y1={50 + 38 * Math.sin(rad)}
              x2={50 + 44 * Math.cos(rad)}
              y2={50 + 44 * Math.sin(rad)}
              stroke="#94a3b8"
              strokeWidth="2"
              strokeLinecap="round"
            />
          );
        })}

        {/* intercardinal tick marks */}
        {[45, 135, 225, 315].map((angle) => {
          const rad = ((angle - 90) * Math.PI) / 180;
          return (
            <line
              key={angle}
              x1={50 + 40 * Math.cos(rad)}
              y1={50 + 40 * Math.sin(rad)}
              x2={50 + 44 * Math.cos(rad)}
              y2={50 + 44 * Math.sin(rad)}
              stroke="#cbd5e1"
              strokeWidth="1"
              strokeLinecap="round"
            />
          );
        })}

        {/* cardinal labels */}
        {(
          [
            { label: "N", angle: 0 },
            { label: "E", angle: 90 },
            { label: "S", angle: 180 },
            { label: "W", angle: 270 },
          ] as const
        ).map(({ label, angle }) => {
          const rad = ((angle - 90) * Math.PI) / 180;
          return (
            <text
              key={label}
              x={50 + 30 * Math.cos(rad)}
              y={50 + 30 * Math.sin(rad) + 4}
              textAnchor="middle"
              fontSize="8"
              fontWeight="600"
              fill="#64748b"
            >
              {label}
            </text>
          );
        })}

        {/* needle group — rotates around centre */}
        <g transform={`rotate(${degrees}, 50, 50)`}>
          {/* north half (pointing toward rainbow) */}
          <polygon points="50,12 53,50 47,50" fill="#f97316" />
          {/* south half */}
          <polygon points="50,88 53,50 47,50" fill="#94a3b8" />
        </g>

        {/* centre dot */}
        <circle cx="50" cy="50" r="4" fill="#1e293b" />
      </svg>

      {/* text info */}
      <div className="text-center">
        <p className="text-3xl font-bold text-slate-800">{direction}</p>
        <p className="text-sm text-gray-400 mt-1">{distanceKm.toFixed(1)} km 先</p>
      </div>
    </div>
  );
}
