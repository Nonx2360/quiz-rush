"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LeaderboardEntry } from "@/lib/types";

function getBangkokTime(): Date {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 7 * 3600000);
}

function getGreeting(hour: number): string {
  if (hour >= 5 && hour < 12) return "สวัสดีตอนเช้า";
  if (hour >= 12 && hour < 14) return "สวัสดีตอนเที่ยง";
  if (hour >= 14 && hour < 17) return "สวัสดีตอนบ่าย";
  if (hour >= 17 && hour < 21) return "สวัสดีตอนเย็น";
  if (hour >= 21 || hour < 1) return "สวัสดีตอนกลางคืน";
  return "สวัสดีตอนดึก";
}

function getGreetingEmoji(hour: number): string {
  if (hour >= 5 && hour < 12) return "🌅";
  if (hour >= 12 && hour < 14) return "☀️";
  if (hour >= 14 && hour < 17) return "🌤️";
  if (hour >= 17 && hour < 21) return "🌇";
  if (hour >= 21 || hour < 1) return "🌙";
  return "🌑";
}

export default function AdminDashboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [playCount, setPlayCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bangkokTime, setBangkokTime] = useState(getBangkokTime());
  const router = useRouter();

  useEffect(() => {
    const auth = sessionStorage.getItem("admin_auth");
    if (!auth) {
      router.push("/admin/login");
      return;
    }
  }, [router]);

  useEffect(() => {
    const timer = setInterval(() => {
      setBangkokTime(getBangkokTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    try {
      const [leaderboardRes, statsRes] = await Promise.all([
        fetch("/api/leaderboard"),
        fetch("/api/admin/stats"),
      ]);
      const leaderboardData = await leaderboardRes.json();
      const statsData = await statsRes.json();
      setEntries(leaderboardData);
      setPlayCount(statsData.playCount || 0);
    } catch {
      console.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const hour = bangkokTime.getHours();
  const greeting = getGreeting(hour);
  const emoji = getGreetingEmoji(hour);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("th-TH", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-grid flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-[var(--color-text-dim)]">กำลังโหลด...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-grid">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-black flex items-center gap-3">
                {emoji} {greeting}
              </h1>
              <p className="text-sm text-[var(--color-text-dim)] mt-1">Admin Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-black tabular-nums text-[var(--color-accent)]">
                  {formatTime(bangkokTime)}
                </div>
                <div className="text-xs text-[var(--color-text-dim)]">
                  {formatDate(bangkokTime)} (Bangkok)
                </div>
              </div>
              <a href="/admin/events" className="btn-secondary text-sm px-4 py-2">
                ตั้งค่า Event
              </a>
              <button
                onClick={handleLogout}
                className="btn-secondary text-sm px-4 py-2"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="card p-5">
              <div className="text-xs font-semibold text-[var(--color-text-dim)] uppercase tracking-wider mb-2">
                เล่นวันนี้
              </div>
              <div className="text-3xl font-black text-[var(--color-accent)] tabular-nums">
                {playCount}
              </div>
              <div className="text-xs text-[var(--color-text-dim)] mt-1">ครั้ง</div>
            </div>
            <div className="card p-5">
              <div className="text-xs font-semibold text-[var(--color-text-dim)] uppercase tracking-wider mb-2">
                ผู้เล่นทั้งหมด
              </div>
              <div className="text-3xl font-black text-[var(--color-cyan)] tabular-nums">
                {entries.length}
              </div>
              <div className="text-xs text-[var(--color-text-dim)] mt-1">คน</div>
            </div>
            <div className="card p-5">
              <div className="text-xs font-semibold text-[var(--color-text-dim)] uppercase tracking-wider mb-2">
                คะแนนสูงสุด
              </div>
              <div className="text-3xl font-black text-[var(--color-emerald)] tabular-nums">
                {entries.length > 0 ? entries[0].score.toLocaleString() : "0"}
              </div>
              <div className="text-xs text-[var(--color-text-dim)] mt-1">คะแนน</div>
            </div>
            <div className="card p-5">
              <div className="text-xs font-semibold text-[var(--color-text-dim)] uppercase tracking-wider mb-2">
                เวลาปัจจุบัน
              </div>
              <div className="text-3xl font-black text-[var(--color-violet)] tabular-nums">
                {formatTime(bangkokTime).slice(0, 5)}
              </div>
              <div className="text-xs text-[var(--color-text-dim)] mt-1">Bangkok (UTC+7)</div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="card p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Leaderboard</h2>
              <button
                onClick={fetchData}
                className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-dim)] hover:text-[var(--color-text-muted)] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                รีเฟรช
              </button>
            </div>

            {entries.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-[var(--color-text-muted)] text-lg font-medium">ยังไม่มีคะแนน</p>
              </div>
            ) : (
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
                      <th className="py-3 px-4 text-left text-xs font-semibold text-[var(--color-text-dim)] uppercase tracking-wider hidden lg:table-cell">
                        ติดต่อ
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
                            <span className="text-xl font-black" style={{
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
                          <span className="font-black text-lg tabular-nums" style={{ color: "var(--color-accent)" }}>
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
                        <td className="py-4 px-4 hidden lg:table-cell">
                          {entry.contact && (
                            <div className="flex flex-col gap-1.5 text-xs">
                              {entry.contact.line && (
                                <span className="flex items-center gap-1.5">
                                  <img src="/line-messenger-logo.svg" alt="LINE" className="w-3.5 h-3.5" />
                                  <span className="text-[var(--color-emerald)]">{entry.contact.line}</span>
                                </span>
                              )}
                              {entry.contact.instagram && (
                                <span className="flex items-center gap-1.5">
                                  <img src="/instagram-logo-facebook-2-svgrepo-com.svg" alt="IG" className="w-3.5 h-3.5" />
                                  <span className="text-[var(--color-violet)]">{entry.contact.instagram}</span>
                                </span>
                              )}
                              {entry.contact.phone && (
                                <span className="flex items-center gap-1.5">
                                  <img src="/phone-svgrepo-com.svg" alt="Tel" className="w-3.5 h-3.5" />
                                  <span className="text-[var(--color-cyan)]">{entry.contact.phone}</span>
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
