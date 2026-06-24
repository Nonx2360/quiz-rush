"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface UseTimerReturn {
  timeLeft: number;
  isRunning: boolean;
  start: (duration?: number) => void;
  stop: () => void;
  reset: (duration?: number) => void;
}

export function useTimer(
  defaultDuration: number = 15,
  onTimeout?: () => void
): UseTimerReturn {
  const [timeLeft, setTimeLeft] = useState(defaultDuration);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const durationRef = useRef(defaultDuration);
  const onTimeoutRef = useRef(onTimeout);

  onTimeoutRef.current = onTimeout;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    setTimeLeft((prev) => {
      const next = Math.max(0, prev - 0.1);
      if (next <= 0) {
        clearTimer();
        setIsRunning(false);
        onTimeoutRef.current?.();
      }
      return Math.round(next * 10) / 10;
    });
  }, [clearTimer]);

  const start = useCallback(
    (duration?: number) => {
      clearTimer();
      const d = duration ?? durationRef.current;
      durationRef.current = d;
      setTimeLeft(d);
      setIsRunning(true);
      intervalRef.current = setInterval(tick, 100);
    },
    [clearTimer, tick]
  );

  const stop = useCallback(() => {
    clearTimer();
    setIsRunning(false);
  }, [clearTimer]);

  const reset = useCallback(
    (duration?: number) => {
      clearTimer();
      const d = duration ?? durationRef.current;
      durationRef.current = d;
      setTimeLeft(d);
      setIsRunning(false);
    },
    [clearTimer]
  );

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return { timeLeft, isRunning, start, stop, reset };
}
