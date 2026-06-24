"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getComboMultiplier } from "@/lib/scoring";

interface ComboIndicatorProps {
  combo: number;
}

export default function ComboIndicator({ combo }: ComboIndicatorProps) {
  const [show, setShow] = useState(false);
  const [prevCombo, setPrevCombo] = useState(0);
  const multiplier = getComboMultiplier(combo);

  useEffect(() => {
    if (combo > 0 && combo !== prevCombo && combo >= 3) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 1500);
      setPrevCombo(combo);
      return () => clearTimeout(timer);
    }
    setPrevCombo(combo);
  }, [combo, prevCombo]);

  return (
    <AnimatePresence>
      {show && combo >= 3 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: -20 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
        >
          <div
            className="px-8 py-3 font-bold text-lg rounded"
            style={{
              background: "var(--color-rose)",
              color: "#fff",
            }}
          >
            <svg className="w-5 h-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
            </svg>
            Combo x{combo}!
            <span className="ml-2 text-sm opacity-80">({multiplier}x)</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
