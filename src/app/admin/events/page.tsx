"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GameConfig, EventConfig, EventEffect, EVENT_EFFECT_OPTIONS, DEFAULT_GAME_CONFIG } from "@/lib/config";

const EVENT_COLORS = [
  { label: "Cyan", value: "var(--color-cyan)" },
  { label: "Accent", value: "var(--color-accent)" },
  { label: "Emerald", value: "var(--color-emerald)" },
  { label: "Violet", value: "var(--color-violet)" },
  { label: "Rose", value: "var(--color-rose)" },
];

export default function AdminEventsPage() {
  const [config, setConfig] = useState<GameConfig>(DEFAULT_GAME_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const auth = sessionStorage.getItem("admin_auth");
    if (!auth) {
      router.push("/admin/login");
      return;
    }
    fetch("/api/config")
      .then((res) => res.json())
      .then((data) => {
        setConfig(data);
        setLoading(false);
      })
      .catch(() => {
        setConfig(DEFAULT_GAME_CONFIG);
        setLoading(false);
      });
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save config:", error);
    } finally {
      setSaving(false);
    }
  };

  const updateEvent = (index: number, updates: Partial<EventConfig>) => {
    setConfig((prev) => ({
      ...prev,
      events: prev.events.map((e, i) => (i === index ? { ...e, ...updates } : e)),
    }));
  };

  const addEvent = () => {
    const newEvent: EventConfig = {
      type: `CUSTOM_${Date.now()}`,
      label: "Event ใหม่!",
      description: "อธิบายผลของ event",
      color: "var(--color-accent)",
      icon: "🎁",
      enabled: true,
      dropRate: 0.1,
      effect: "none",
      effectParams: {},
    };
    setConfig((prev) => ({
      ...prev,
      events: [...prev.events, newEvent],
    }));
  };

  const removeEvent = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      events: prev.events.filter((_, i) => i !== index),
    }));
  };

  const resetToDefaults = () => {
    setConfig(DEFAULT_GAME_CONFIG);
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

  const totalDropRate = config.events
    .filter((e) => e.enabled)
    .reduce((sum, e) => sum + e.dropRate, 0);

  return (
    <main className="min-h-screen bg-grid">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black">ตั้งค่า Event & เกม</h1>
            <p className="text-sm text-[var(--color-text-dim)] mt-1">จัดการ event drops และตั้งค่าเกม</p>
          </div>
          <div className="flex gap-3">
            <button onClick={resetToDefaults} className="btn-secondary text-sm px-4 py-2">
              รีเซ็ต
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary text-sm px-6 py-2 disabled:opacity-50"
            >
              {saving ? "กำลังบันทึก..." : saved ? "บันทึกแล้ว!" : "บันทึก"}
            </button>
          </div>
        </div>

        {/* Game Settings */}
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">ตั้งค่าเกม</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-dim)] mb-1.5 uppercase tracking-wider">
                จำนวนคำถามต่อเกม
              </label>
              <input
                type="number"
                min={5}
                max={50}
                value={config.totalQuestions}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    totalQuestions: Math.max(5, Math.min(50, parseInt(e.target.value) || 5)),
                  }))
                }
                className="w-full px-4 py-2.5 rounded text-sm focus:outline-none"
                style={{
                  background: "var(--color-bg)",
                  border: "2px solid var(--color-surface-border)",
                  color: "var(--color-text)",
                }}
              />
              <p className="text-xs text-[var(--color-text-dim)] mt-1">5 - 50 ข้อ</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-dim)] mb-1.5 uppercase tracking-wider">
                เวลาต่อข้อ (วินาที)
              </label>
              <input
                type="number"
                min={5}
                max={60}
                value={config.timePerQuestion}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    timePerQuestion: Math.max(5, Math.min(60, parseInt(e.target.value) || 5)),
                  }))
                }
                className="w-full px-4 py-2.5 rounded text-sm focus:outline-none"
                style={{
                  background: "var(--color-bg)",
                  border: "2px solid var(--color-surface-border)",
                  color: "var(--color-text)",
                }}
              />
              <p className="text-xs text-[var(--color-text-dim)] mt-1">5 - 60 วินาที</p>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-[var(--color-text-dim)] mb-1.5 uppercase tracking-wider">
                Event Drop Rate (%)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(config.eventDropRate * 100)}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      eventDropRate: parseInt(e.target.value) / 100,
                    }))
                  }
                  className="flex-1"
                />
                <span className="text-lg font-bold text-[var(--color-accent)] w-16 text-right tabular-nums">
                  {Math.round(config.eventDropRate * 100)}%
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-dim)] mt-1">โอกาสที่จะเกิด event แต่ละข้อ</p>
            </div>
          </div>
        </div>

        {/* Events */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold">Event List</h2>
              <p className="text-xs text-[var(--color-text-dim)] mt-0.5">
                เปิดใช้ {config.events.filter((e) => e.enabled).length}/{config.events.length} event
                {totalDropRate > 0 && (
                  <span className="ml-2 text-[var(--color-accent)]">
                    (รวม drop rate: {(totalDropRate * 100).toFixed(1)}%)
                  </span>
                )}
              </p>
            </div>
            <button onClick={addEvent} className="btn-secondary text-sm px-4 py-2">
              + เพิ่ม Event
            </button>
          </div>

          <div className="space-y-4">
            {config.events.map((event, index) => (
              <div
                key={event.type}
                className="p-4 rounded-lg"
                style={{
                  background: "var(--color-bg)",
                  border: `1px solid ${event.enabled ? event.color + "40" : "var(--color-surface-border)"}`,
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <input
                      type="text"
                      value={event.icon}
                      onChange={(e) => updateEvent(index, { icon: e.target.value })}
                      className="w-12 h-12 text-center text-2xl rounded focus:outline-none"
                      style={{
                        background: "var(--color-surface)",
                        border: "1px solid var(--color-surface-border)",
                      }}
                    />
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={event.enabled}
                        onChange={(e) => updateEvent(index, { enabled: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-[var(--color-surface-border)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--color-emerald)]"></div>
                    </label>
                  </div>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-[var(--color-text-dim)] mb-1">Label</label>
                      <input
                        type="text"
                        value={event.label}
                        onChange={(e) => updateEvent(index, { label: e.target.value })}
                        className="w-full px-3 py-2 rounded text-sm focus:outline-none"
                        style={{
                          background: "var(--color-surface)",
                          border: "1px solid var(--color-surface-border)",
                          color: "var(--color-text)",
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[var(--color-text-dim)] mb-1">Description</label>
                      <input
                        type="text"
                        value={event.description}
                        onChange={(e) => updateEvent(index, { description: e.target.value })}
                        className="w-full px-3 py-2 rounded text-sm focus:outline-none"
                        style={{
                          background: "var(--color-surface)",
                          border: "1px solid var(--color-surface-border)",
                          color: "var(--color-text)",
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[var(--color-text-dim)] mb-1">Effect</label>
                      <select
                        value={event.effect}
                        onChange={(e) => {
                          const newEffect = e.target.value as EventEffect;
                          const effectOption = EVENT_EFFECT_OPTIONS.find((o) => o.value === newEffect);
                          const newParams = { ...event.effectParams };
                          if (effectOption?.paramKey && effectOption?.paramDefault !== undefined) {
                            newParams[effectOption.paramKey] = effectOption.paramDefault;
                          }
                          updateEvent(index, { effect: newEffect, effectParams: newParams });
                        }}
                        className="w-full px-3 py-2 rounded text-sm focus:outline-none"
                        style={{
                          background: "var(--color-surface)",
                          border: "1px solid var(--color-surface-border)",
                          color: "var(--color-text)",
                        }}
                      >
                        {EVENT_EFFECT_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label} — {opt.description}
                          </option>
                        ))}
                      </select>
                    </div>
                    {(() => {
                      const effectOption = EVENT_EFFECT_OPTIONS.find((o) => o.value === event.effect);
                      if (effectOption?.paramKey && effectOption?.paramLabel) {
                        const paramKey = effectOption.paramKey;
                        const currentValue = event.effectParams[paramKey] ?? effectOption.paramDefault ?? 1;
                        return (
                          <div>
                            <label className="block text-xs text-[var(--color-text-dim)] mb-1">{effectOption.paramLabel}</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="range"
                                min={effectOption.paramMin ?? 1}
                                max={effectOption.paramMax ?? 100}
                                value={currentValue}
                                onChange={(e) =>
                                  updateEvent(index, {
                                    effectParams: {
                                      ...event.effectParams,
                                      [paramKey]: parseInt(e.target.value),
                                    },
                                  })
                                }
                                className="flex-1"
                              />
                              <span className="text-sm font-bold w-10 text-right tabular-nums" style={{ color: event.color }}>
                                {currentValue}
                              </span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}
                    <div>
                      <label className="block text-xs text-[var(--color-text-dim)] mb-1">Drop Rate</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={Math.round(event.dropRate * 100)}
                          onChange={(e) =>
                            updateEvent(index, { dropRate: parseInt(e.target.value) / 100 })
                          }
                          className="flex-1"
                        />
                        <span className="text-sm font-bold w-10 text-right tabular-nums" style={{ color: event.color }}>
                          {Math.round(event.dropRate * 100)}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-[var(--color-text-dim)] mb-1">Color</label>
                      <div className="flex gap-2">
                        {EVENT_COLORS.map((c) => (
                          <button
                            key={c.value}
                            onClick={() => updateEvent(index, { color: c.value })}
                            className="w-7 h-7 rounded-full border-2 transition-all"
                            style={{
                              background: c.value,
                              borderColor: event.color === c.value ? "white" : "transparent",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeEvent(index)}
                    className="text-[var(--color-text-dim)] hover:text-[var(--color-rose)] transition-colors p-1"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary text-sm px-8 py-3 disabled:opacity-50"
          >
            {saving ? "กำลังบันทึก..." : saved ? "บันทึกแล้ว!" : "บันทึกการตั้งค่า"}
          </button>
        </div>
      </div>
    </main>
  );
}
