"use client";

interface ScoreDisplayProps {
  score: number;
  combo: number;
}

export default function ScoreDisplay({ score, combo }: ScoreDisplayProps) {
  return (
    <div className="w-full mb-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <svg className="w-5 h-5 text-[var(--color-accent)]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <span className="text-2xl font-black text-[var(--color-accent)] tabular-nums">
          {score.toLocaleString()}
        </span>
      </div>
      {combo >= 3 && (
        <div
          className="flex items-center gap-2 px-4 py-1.5 rounded font-bold text-sm"
          style={{
            background: "rgba(226,85,99,0.12)",
            color: "var(--color-rose)",
            border: "1px solid rgba(226,85,99,0.2)",
          }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
          </svg>
          <span>Combo x{combo}</span>
        </div>
      )}
    </div>
  );
}
