"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EventType, EVENT_CONFIG } from "@/lib/events";

interface RandomEventPopupProps {
  event: EventType | null;
  onDismiss: () => void;
}

export default function RandomEventPopup({ event, onDismiss }: RandomEventPopupProps) {
  const [show, setShow] = useState(false);
  const dismissTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (event) {
      setShow(true);
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
      }
      dismissTimerRef.current = setTimeout(() => {
        setShow(false);
        onDismiss();
      }, 2000);
    }
    return () => {
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
      }
    };
  }, [event, onDismiss]);

  const config = event ? EVENT_CONFIG[event] : null;

  return (
    <AnimatePresence>
      {show && config && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -30 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-50"
        >
          <div
            className="px-8 py-4 rounded-lg text-center min-w-[280px]"
            style={{
              background: "var(--color-surface)",
              border: `2px solid ${config.color}`,
              boxShadow: `0 0 30px ${config.color}40`,
            }}
          >
            <div className="text-4xl mb-2">{config.icon}</div>
            <div
              className="text-xl font-bold mb-1"
              style={{ color: config.color }}
            >
              {config.label}
            </div>
            <div className="text-sm text-[var(--color-text-muted)]">
              {config.description}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
