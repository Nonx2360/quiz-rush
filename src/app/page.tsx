"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-grid">
      <div className="max-w-6xl mx-auto px-6 py-10 md:py-16">

        {/* ─── Nav ─── */}
        <nav className="flex items-center justify-between mb-20 md:mb-28">
          <span className="text-sm font-bold tracking-widest uppercase text-[var(--color-text-muted)]">Quiz Rush</span>
          <Link
            href="/leaderboard"
            className="text-sm font-medium text-[var(--color-text-dim)] hover:text-[var(--color-text-muted)] transition-colors"
          >
            Leaderboard
          </Link>
        </nav>

        {/* ─── Hero: 2-Column ─── */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start max-w-5xl mx-auto">

          {/* Left: Typography Stack */}
          <div>
            <div className="mb-5">
              <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[var(--color-accent)] border border-[var(--color-accent)]/30 px-3 py-1 rounded">
                Quiz Rush
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] mb-5">
              สุนทรภู่
            </h1>

            <p className="text-[var(--color-text-muted)] text-base leading-relaxed mb-10 max-w-sm">
              ทดสอบความรู้เกี่ยวกับสุนทรภู่ กวีเอกของโลก
            </p>

            <div className="flex items-center gap-4">
              <Link href="/quiz" className="btn-primary">
                เริ่มเล่น
              </Link>
              <Link href="/leaderboard" className="btn-secondary">
                Leaderboard
              </Link>
            </div>
          </div>

          {/* Right: Unified Rules + Stats Container */}
          <div className="card">
            {/* Rules Section */}
            <div className="p-6">
              <h3 className="text-xs font-semibold text-[var(--color-text-dim)] uppercase tracking-widest mb-5">
                กติกา
              </h3>
              <div className="space-y-4">
                {[
                  {
                    label: "ตอบเร็ว",
                    desc: "ได้คะแนน bonus มากขึ้น",
                    accent: "var(--color-accent)",
                  },
                  {
                    label: "Combo Multiplier",
                    desc: "ตอบถูกต่อเนื่องเพิ่มตัวคูณ",
                    accent: "var(--color-rose)",
                  },
                  {
                    label: "ไม่ซ้ำกัน",
                    desc: "คำถามสุ่มใหม่ทุกรอบ",
                    accent: "var(--color-emerald)",
                  },
                ].map((rule, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div
                      className="w-1 h-8 rounded-full mt-0.5 shrink-0"
                      style={{ background: rule.accent }}
                    />
                    <div>
                      <span className="text-sm font-semibold" style={{ color: rule.accent }}>
                        {rule.label}
                      </span>
                      <p className="text-sm text-[var(--color-text-dim)] mt-0.5">{rule.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="mx-6 border-t border-[var(--color-surface-border)]" />

            {/* Stats Row */}
            <div className="grid grid-cols-3 divide-x divide-[var(--color-surface-border)]">
              {[
                { value: "20", unit: "ข้อ / รอบ" },
                { value: "15", unit: "วินาที / ข้อ" },
                { value: "2x", unit: "Combo สูงสุด" },
              ].map((stat, i) => (
                <div key={i} className="p-5 text-center">
                  <div className="text-2xl font-black text-[var(--color-text)] tabular-nums">
                    {stat.value}
                  </div>
                  <div className="text-xs text-[var(--color-text-dim)] mt-1">{stat.unit}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Category Segmented Bar ─── */}
        <div className="max-w-5xl mx-auto mt-20 md:mt-28">
          <h3 className="text-xs font-semibold text-[var(--color-text-dim)] uppercase tracking-widest text-center mb-5">
            หมวดคำถาม
          </h3>
          <div className="segment-bar">
            {["ชีวิต", "ผลงาน", "ยุคสมัย", "กลอน", "บุคคล"].map((name, i) => (
              <div key={name} className="segment-item">
                {name}
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
