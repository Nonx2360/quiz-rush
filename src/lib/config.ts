export type EventEffect =
  | "bonus_time"
  | "double_points"
  | "combo_shield"
  | "hint"
  | "freeze_timer"
  | "skip"
  | "none";

export interface EventEffectParams {
  seconds?: number;
  multiplier?: number;
  eliminateCount?: number;
}

export const EVENT_EFFECT_OPTIONS: {
  value: EventEffect;
  label: string;
  description: string;
  paramLabel?: string;
  paramKey?: keyof EventEffectParams;
  paramMin?: number;
  paramMax?: number;
  paramDefault?: number;
}[] = [
  { value: "bonus_time", label: "เพิ่มเวลา", description: "เพิ่มเวลาให้ answering", paramLabel: "วินาที", paramKey: "seconds", paramMin: 1, paramMax: 30, paramDefault: 5 },
  { value: "double_points", label: "แต้ม x2", description: "คูณคะแนน", paramLabel: "จำนวนเท่า (x)", paramKey: "multiplier", paramMin: 2, paramMax: 10, paramDefault: 2 },
  { value: "combo_shield", label: "โล่คอมโบ", description: "ตอบผิดไม่เสียมคอมโบ" },
  { value: "hint", label: "คำใบ้", description: "ลบตัวเลือกผิด", paramLabel: "จำนวนข้อ", paramKey: "eliminateCount", paramMin: 1, paramMax: 3, paramDefault: 1 },
  { value: "freeze_timer", label: "หยุดเวลา", description: "เวลาหยุดชั่วคราว", paramLabel: "วินาที", paramKey: "seconds", paramMin: 1, paramMax: 15, paramDefault: 5 },
  { value: "skip", label: "ข้าม", description: "ข้ามคำถามนี้" },
  { value: "none", label: "ไม่มีผล", description: "แค่แสดงข้อความ" },
];

export interface EventConfig {
  type: string;
  label: string;
  description: string;
  color: string;
  icon: string;
  enabled: boolean;
  dropRate: number;
  effect: EventEffect;
  effectParams: EventEffectParams;
}

export interface GameConfig {
  totalQuestions: number;
  timePerQuestion: number;
  eventDropRate: number;
  events: EventConfig[];
}

export const DEFAULT_EVENTS: EventConfig[] = [
  {
    type: "BONUS_TIME",
    label: "เวลาเพิ่ม!",
    description: "+5 วินาที",
    color: "var(--color-cyan)",
    icon: "⏰",
    enabled: true,
    dropRate: 0.167,
    effect: "bonus_time",
    effectParams: { seconds: 5 },
  },
  {
    type: "DOUBLE_POINTS",
    label: "แต้ม x2!",
    description: "ข้อถูกต่อไปได้คะแนน 2 เท่า",
    color: "var(--color-accent)",
    icon: "🔥",
    enabled: true,
    dropRate: 0.167,
    effect: "double_points",
    effectParams: { multiplier: 2 },
  },
  {
    type: "COMBO_SHIELD",
    label: "โล่คอมโบ!",
    description: "ตอบผิดไม่เสียมคอมโบ",
    color: "var(--color-emerald)",
    icon: "🛡️",
    enabled: true,
    dropRate: 0.167,
    effect: "combo_shield",
    effectParams: {},
  },
  {
    type: "HINT",
    label: "คำใบ้!",
    description: "ตัวเลือกผิด 1 ข้อถูกลบ",
    color: "var(--color-violet)",
    icon: "💡",
    enabled: true,
    dropRate: 0.167,
    effect: "hint",
    effectParams: { eliminateCount: 1 },
  },
  {
    type: "FREEZE_TIMER",
    label: "หยุดเวลา!",
    description: "เวลาหยุด 5 วินาที",
    color: "var(--color-cyan)",
    icon: "⏸️",
    enabled: true,
    dropRate: 0.167,
    effect: "freeze_timer",
    effectParams: { seconds: 5 },
  },
  {
    type: "SKIP",
    label: "ข้ามเลย!",
    description: "ข้ามคำถามนี้ ไม่มีผล",
    color: "var(--color-rose)",
    icon: "⏭️",
    enabled: true,
    dropRate: 0.165,
    effect: "skip",
    effectParams: {},
  },
];

export const DEFAULT_GAME_CONFIG: GameConfig = {
  totalQuestions: 15,
  timePerQuestion: 15,
  eventDropRate: 0.3,
  events: DEFAULT_EVENTS,
};

export function getEventMeta(type: string, events: EventConfig[]): EventConfig | undefined {
  return events.find((e) => e.type === type);
}
