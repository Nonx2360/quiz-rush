"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface UseTimerReturn {
  timeLeft: number;
  isRunning: boolean;
  isFrozen: boolean;
  start: (duration?: number) => void;
  stop: () => void;
  reset: (duration?: number) => void;
  freeze: (seconds: number) => void;
  addTime: (seconds: number) => void;
}

export function useTimer(
  defaultDuration: number = 15,
  onTimeout?: () => void
): UseTimerReturn {
  const [timeLeft, setTimeLeft] = useState(defaultDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const freezeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const durationRef = useRef(defaultDuration);
  const onTimeoutRef = useRef(onTimeout);
  const frozenRef = useRef(false);

  onTimeoutRef.current = onTimeout;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const clearFreezeTimeout = useCallback(() => {
    if (freezeTimeoutRef.current) {
      clearTimeout(freezeTimeoutRef.current);
      freezeTimeoutRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    setTimeLeft((prev) => {
      if (frozenRef.current) return prev;
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
      frozenRef.current = false;
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
      clearFreezeTimeout();
      const d = duration ?? durationRef.current;
      durationRef.current = d;
      setTimeLeft(d);
      setIsRunning(false);
      setIsFrozen(false);
      frozenRef.current = false;
    },
    [clearTimer, clearFreezeTimeout]
  );

  const freeze = useCallback(
    (seconds: number) => {
      if (!isRunning) return;
      clearTimer();
      frozenRef.current = true;
      setIsFrozen(true);
      freezeTimeoutRef.current = setTimeout(() => {
        frozenRef.current = false;
        setIsFrozen(false);
        intervalRef.current = setInterval(tick, 100);
      }, seconds * 1000);
    },
    [isRunning, clearTimer, tick]
  );

  const addTime = useCallback((seconds: number) => {
    setTimeLeft((prev) => {
      const newTime = Math.min(prev + seconds, durationRef.current + seconds);
      return Math.round(newTime * 10) / 10;
    });
  }, []);

  useEffect(() => {
    return () => {
      clearTimer();
      clearFreezeTimeout();
    };
  }, [clearTimer, clearFreezeTimeout]);

  return { timeLeft, isRunning, isFrozen, start, stop, reset, freeze, addTime };
}
