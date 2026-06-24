"use client";

import { useState } from "react";

interface NameInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (username: string) => void;
  isLoading: boolean;
}

export default function NameInputModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: NameInputModalProps) {
  const [username, setUsername] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSubmit(username.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="card p-6 w-full max-w-md">
        <div className="text-center mb-6">
          <svg className="w-10 h-10 mx-auto text-[var(--color-accent)] mb-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <h3 className="text-xl font-bold">ใส่ชื่อของคุณ</h3>
          <p className="text-sm text-[var(--color-text-dim)] mt-1">เพื่อบันทึกคะแนนลง Leaderboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ชื่อเล่น..."
            maxLength={20}
            className="w-full px-4 py-3 rounded mb-4 text-center text-lg font-medium focus:outline-none"
            style={{
              background: "var(--color-bg)",
              border: "2px solid var(--color-surface-border)",
              color: "var(--color-text)",
            }}
            autoFocus
          />
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!username.trim() || isLoading}
              className="flex-1 py-3 rounded font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: "var(--color-accent)",
                color: "#0c0f1a",
              }}
            >
              {isLoading ? "กำลังส่ง..." : "ส่งคะแนน"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-3 rounded font-semibold text-sm border disabled:opacity-40 transition-colors"
              style={{
                background: "transparent",
                borderColor: "var(--color-surface-border)",
                color: "var(--color-text-muted)",
              }}
            >
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
