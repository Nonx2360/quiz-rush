import { EventConfig, EventEffect, EventEffectParams } from "./config";

export interface RolledEvent {
  type: string;
  effect: EventEffect;
  effectParams: EventEffectParams;
}

export function rollRandomEvent(
  eventDropRate: number,
  events: EventConfig[]
): RolledEvent | null {
  if (Math.random() > eventDropRate) {
    return null;
  }

  const enabledEvents = events.filter((e) => e.enabled);
  if (enabledEvents.length === 0) {
    return null;
  }

  const totalDropRate = enabledEvents.reduce((sum, e) => sum + e.dropRate, 0);
  let random = Math.random() * totalDropRate;

  for (const event of enabledEvents) {
    random -= event.dropRate;
    if (random <= 0) {
      return { type: event.type, effect: event.effect, effectParams: event.effectParams };
    }
  }

  const last = enabledEvents[enabledEvents.length - 1];
  return { type: last.type, effect: last.effect, effectParams: last.effectParams };
}
