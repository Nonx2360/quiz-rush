"use client";

import { EventConfig, getEventMeta } from "@/lib/config";

interface EventIndicatorProps {
  activeEffects: {
    doublePoints: boolean;
    comboShield: boolean;
    hintOption: number | null;
  };
  events: EventConfig[];
}

export default function EventIndicator({ activeEffects, events }: EventIndicatorProps) {
  const activeEventTypes: string[] = [];
  if (activeEffects.doublePoints) activeEventTypes.push("DOUBLE_POINTS");
  if (activeEffects.comboShield) activeEventTypes.push("COMBO_SHIELD");
  if (activeEffects.hintOption !== null) activeEventTypes.push("HINT");

  if (activeEventTypes.length === 0) return null;

  return (
    <div className="flex items-center gap-2 mb-4">
      {activeEventTypes.map((eventType) => {
        const meta = getEventMeta(eventType, events);
        if (!meta) return null;
        return (
          <div
            key={eventType}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold"
            style={{
              background: `${meta.color}15`,
              color: meta.color,
              border: `1px solid ${meta.color}30`,
            }}
          >
            <span>{meta.icon}</span>
            <span>{meta.label}</span>
          </div>
        );
      })}
    </div>
  );
}
