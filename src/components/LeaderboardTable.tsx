"use client";

import { LeaderboardEntry } from "@/lib/types";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

export default function LeaderboardTable({ entries }: LeaderboardTableProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-16">
        <svg className="w-12 h-12 mx-auto text-[var(--color-text-dim)] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0116.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.015 6.015 0 01-5.54 0" />
        </svg>
        <p className="text-[var(--color-text-muted)] text-lg font-medium">ยังไม่มีคะแนน</p>
        <p className="text-sm text-[var(--color-text-dim)] mt-1">เป็นคนแรกที่ทำคะแนน!</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--color-surface-border)" }}>
            <th className="py-3 px-4 text-left text-xs font-semibold text-[var(--color-text-dim)] uppercase tracking-wider">
              อันดับ
            </th>
            <th className="py-3 px-4 text-left text-xs font-semibold text-[var(--color-text-dim)] uppercase tracking-wider">
              ชื่อ
            </th>
            <th className="py-3 px-4 text-right text-xs font-semibold text-[var(--color-text-dim)] uppercase tracking-wider">
              คะแนน
            </th>
            <th className="py-3 px-4 text-right text-xs font-semibold text-[var(--color-text-dim)] uppercase tracking-wider hidden sm:table-cell">
              ความแม่นยำ
            </th>
            <th className="py-3 px-4 text-right text-xs font-semibold text-[var(--color-text-dim)] uppercase tracking-wider hidden md:table-cell">
              เวลาเฉลี่ย
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr
              key={index}
              className="lb-row"
              style={{ borderBottom: "1px solid var(--color-surface-border)" }}
            >
              <td className="py-4 px-4">
                {index < 3 ? (
                  <span className="text-xl font-black"                   style={{
                    color: index === 0 ? "var(--color-accent)" : index === 1 ? "#94a3b8" : "#cd7f32"
                  }}>
                    #{index + 1}
                  </span>
                ) : (
                  <span className="text-sm font-semibold text-[var(--color-text-dim)]">
                    #{index + 1}
                  </span>
                )}
              </td>
              <td className="py-4 px-4 font-semibold">{entry.username}</td>
              <td className="py-4 px-4 text-right">
                <span
                  className="font-black text-lg tabular-nums"
                   style={{ color: "var(--color-accent)" }}
                >
                  {entry.score.toLocaleString()}
                </span>
              </td>
              <td className="py-4 px-4 text-right hidden sm:table-cell">
                <span
                  className="text-sm font-semibold px-2 py-1 rounded-md"
                  style={{
                    background:
                      entry.accuracy >= 80
                        ? "rgba(16,185,129,0.1)"
                        : entry.accuracy >= 50
                        ? "rgba(245,158,11,0.1)"
                        : "rgba(244,63,94,0.1)",
                    color:
                      entry.accuracy >= 80
                        ? "var(--color-emerald)"
                        : entry.accuracy >= 50
                        ? "var(--color-accent)"
                        : "var(--color-rose)",
                  }}
                >
                  {entry.accuracy.toFixed(1)}%
                </span>
              </td>
              <td className="py-4 px-4 text-right text-sm text-[var(--color-text-dim)] hidden md:table-cell">
                {entry.avgTime.toFixed(1)} วิ
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
