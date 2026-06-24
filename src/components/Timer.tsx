"use client";

interface TimerProps {
  timeLeft: number;
  duration: number;
}

export default function Timer({ timeLeft, duration }: TimerProps) {
  const percentage = (timeLeft / duration) * 100;
  const isLow = timeLeft < 3;
  const isMedium = timeLeft < 7;

  const color = isLow ? "var(--color-rose)" : isMedium ? "var(--color-accent)" : "var(--color-cyan)";

  return (
    <div className="w-full mb-5">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium text-[var(--color-text-dim)] uppercase tracking-wider">เวลา</span>
        <span
          className={`text-3xl font-black tabular-nums ${
            isLow ? "text-[var(--color-rose)]" : isMedium ? "text-[var(--color-accent)]" : "text-[var(--color-cyan)]"
          }`}
        >
          {Math.ceil(timeLeft)}
        </span>
      </div>
      <div className="timer-track">
        <div
          className="timer-fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}
