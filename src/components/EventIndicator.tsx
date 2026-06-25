"use client";

import { EventType, EVENT_CONFIG } from "@/lib/events";

interface EventIndicatorProps {
  activeEffects: {
    doublePoints: boolean;
    comboShield: boolean;
    hintOption: number | null;
  };
}

export default function EventIndicator({ activeEffects }: EventIndicatorProps) {
  const activeEvents: EventType[] = [];
  if (activeEffects.doublePoints) activeEvents.push("DOUBLE_POINTS");
  if (activeEffects.comboShield) activeEvents.push("COMBO_SHIELD");
  if (activeEffects.hintOption !== null) activeEvents.push("HINT");

  if (activeEvents.length === 0) return null;

  return (
    <div className="flex items-center gap-2 mb-4">
      {activeEvents.map((eventType) => {
        const config = EVENT_CONFIG[eventType];
        return (
          <div
            key={eventType}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold"
            style={{
              background: `${config.color}15`,
              color: config.color,
              border: `1px solid ${config.color}30`,
            }}
          >
            <span>{config.icon}</span>
            <span>{config.label}</span>
          </div>
        );
      })}
    </div>
  );
}
