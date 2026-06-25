export type EventType =
  | "BONUS_TIME"
  | "DOUBLE_POINTS"
  | "COMBO_SHIELD"
  | "HINT"
  | "FREEZE_TIMER"
  | "SKIP";

export interface RandomEvent {
  type: EventType;
  label: string;
  description: string;
  color: string;
  icon: string;
}

export const EVENT_CONFIG: Record<EventType, RandomEvent> = {
  BONUS_TIME: {
    type: "BONUS_TIME",
    label: "เวลาเพิ่ม!",
    description: "+5 วินาที",
    color: "var(--color-cyan)",
    icon: "⏰",
  },
  DOUBLE_POINTS: {
    type: "DOUBLE_POINTS",
    label: "แต้ม x2!",
    description: "ข้อถูกต่อไปได้คะแนน 2 เท่า",
    color: "var(--color-accent)",
    icon: "🔥",
  },
  COMBO_SHIELD: {
    type: "COMBO_SHIELD",
    label: "โล่คอมโบ!",
    description: "ตอบผิดไม่เสียมคอมโบ",
    color: "var(--color-emerald)",
    icon: "🛡️",
  },
  HINT: {
    type: "HINT",
    label: "คำใบ้!",
    description: "ตัวเลือกผิด 1 ข้อถูกลบ",
    color: "var(--color-violet)",
    icon: "💡",
  },
  FREEZE_TIMER: {
    type: "FREEZE_TIMER",
    label: "หยุดเวลา!",
    description: "เวลาหยุด 5 วินาที",
    color: "var(--color-cyan)",
    icon: "⏸️",
  },
  SKIP: {
    type: "SKIP",
    label: "ข้ามเลย!",
    description: "ข้ามคำถามนี้ ไม่มีผล",
    color: "var(--color-rose)",
    icon: "⏭️",
  },
};

export const EVENT_TYPES: EventType[] = [
  "BONUS_TIME",
  "DOUBLE_POINTS",
  "COMBO_SHIELD",
  "HINT",
  "FREEZE_TIMER",
  "SKIP",
];

export function rollRandomEvent(): EventType | null {
  if (Math.random() < 0.3) {
    const idx = Math.floor(Math.random() * EVENT_TYPES.length);
    return EVENT_TYPES[idx];
  }
  return null;
}
