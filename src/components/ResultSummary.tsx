"use client";

import { Answer } from "@/hooks/useQuizEngine";

interface ResultSummaryProps {
  score: number;
  answers: Answer[];
  accuracy: number;
  avgTime: number;
  maxCombo: number;
  onSubmit: () => void;
  onPlayAgain: () => void;
}

export default function ResultSummary({
  score,
  answers,
  accuracy,
  avgTime,
  maxCombo,
  onSubmit,
  onPlayAgain,
}: ResultSummaryProps) {
  const correctCount = answers.filter((a) => a.correct).length;

  const stats = [
    {
      label: "ตอบถูก",
      value: `${correctCount}/${answers.length}`,
      color: "var(--color-emerald)",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "ความแม่นยำ",
      value: `${accuracy.toFixed(1)}%`,
      color: "var(--color-cyan)",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
    {
      label: "เวลาเฉลี่ย",
      value: `${avgTime.toFixed(1)} วิ`,
      color: "var(--color-accent)",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Combo สูงสุด",
      value: `x${maxCombo}`,
      color: "var(--color-rose)",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full max-w-xl mx-auto text-center">
      <div className="card p-8 mb-6">
        <div className="mb-3">
          <svg className="w-12 h-12 mx-auto text-[var(--color-accent)]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-1">จบเกมแล้ว!</h2>
        <p className="text-sm text-[var(--color-text-dim)] mb-6">ผลการแข่งขันของคุณ</p>

        <div className="text-6xl font-black mb-2 tabular-nums text-[var(--color-accent)]">
          {score.toLocaleString()}
        </div>
        <div className="text-xs text-[var(--color-text-dim)] uppercase tracking-wider mb-6">คะแนนรวม</div>

        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="p-4 rounded text-center"
              style={{
                background: "var(--color-bg)",
                border: "1px solid var(--color-surface-border)",
              }}
            >
              <div className="flex justify-center mb-2" style={{ color: stat.color }}>
                {stat.icon}
              </div>
              <div className="text-xs text-[var(--color-text-dim)] mb-1">{stat.label}</div>
              <div className="text-xl font-bold" style={{ color: stat.color }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <button onClick={onSubmit} className="btn-primary">
          ส่งคะแนนเข้า Leaderboard
        </button>
        <button onClick={onPlayAgain} className="btn-secondary">
          เล่นอีกครั้ง
        </button>
      </div>
    </div>
  );
}
