"use client";

import { useState, useEffect } from "react";
import { LeaderboardEntry } from "@/lib/types";
import LeaderboardTable from "@/components/LeaderboardTable";
import Link from "next/link";

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        setEntries(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-grid">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <svg className="w-8 h-8 text-[var(--color-accent)]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <h1 className="text-3xl font-black">Leaderboard</h1>
              </div>
              <p className="text-sm text-[var(--color-text-dim)]">นักเรียนสุนทรภู่ตัวท็อป</p>
            </div>
            <Link
              href="/"
              className="btn-secondary text-sm px-4 py-2"
            >
              ← กลับ
            </Link>
          </div>

          {/* Table */}
          <div className="card p-4 md:p-6">
            {loading ? (
              <div className="text-center py-16">
                <div className="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm text-[var(--color-text-dim)]">กำลังโหลด...</p>
              </div>
            ) : (
              <LeaderboardTable entries={entries} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
