"use client";

import { useState, useCallback } from "react";
import { Question } from "@/lib/types";
import { pickRandomQuestions } from "@/lib/shuffle";
import { prepareQuestion, PreparedQuestion } from "@/lib/prepareQuestion";
import { calculateScore } from "@/lib/scoring";
import { RolledEvent, rollRandomEvent } from "@/lib/events";
import { GameConfig, DEFAULT_GAME_CONFIG } from "@/lib/config";

export interface Answer {
  questionId: string;
  correct: boolean;
  timeTaken: number;
}

interface ActiveEffects {
  doublePoints: boolean;
  pointsMultiplier: number;
  comboShield: boolean;
  hintOption: number | null;
}

interface QuizState {
  currentIndex: number;
  score: number;
  combo: number;
  maxCombo: number;
  gameState: "idle" | "playing" | "finished";
  questions: PreparedQuestion[];
  answers: Answer[];
  selectedAnswer: string | null;
  currentEvent: RolledEvent | null;
  activeEffects: ActiveEffects;
}

interface UseQuizEngineReturn extends QuizState {
  startGame: () => void;
  handleAnswer: (selectedOption: string) => void;
  nextQuestion: () => void;
  endGame: () => void;
  totalQuestions: number;
  accuracy: number;
  avgTime: number;
  consumeEvent: () => void;
}

const BASE_SCORE = 50;
const SPEED_MULTIPLIER = 10;

export function useQuizEngine(
  pool: Question[],
  config: GameConfig = DEFAULT_GAME_CONFIG
): UseQuizEngineReturn {
  const { totalQuestions, timePerQuestion, eventDropRate, events } = config;

  const [state, setState] = useState<QuizState>({
    currentIndex: 0,
    score: 0,
    combo: 0,
    maxCombo: 0,
    gameState: "idle",
    questions: [],
    answers: [],
    selectedAnswer: null,
    currentEvent: null,
    activeEffects: {
      doublePoints: false,
      pointsMultiplier: 2,
      comboShield: false,
      hintOption: null,
    },
  });

  const startGame = useCallback(() => {
    const selected = pickRandomQuestions(pool, totalQuestions);
    const prepared = selected.map(prepareQuestion);
    setState({
      currentIndex: 0,
      score: 0,
      combo: 0,
      maxCombo: 0,
      gameState: "playing",
      questions: prepared,
      answers: [],
      selectedAnswer: null,
      currentEvent: null,
      activeEffects: {
        doublePoints: false,
        pointsMultiplier: 2,
        comboShield: false,
        hintOption: null,
      },
    });
  }, [pool, totalQuestions]);

  const consumeEvent = useCallback(() => {
    setState((prev) => ({ ...prev, currentEvent: null }));
  }, []);

  const handleAnswer = useCallback(
    (selectedOption: string) => {
      setState((prev) => {
        if (prev.gameState !== "playing" || prev.selectedAnswer) return prev;

        const currentQ = prev.questions[prev.currentIndex];
        const isCorrect = selectedOption === currentQ.correctAnswer;
        const newCombo = isCorrect ? prev.combo + 1 : 0;
        const newMaxCombo = Math.max(prev.maxCombo, newCombo);

        let scoreGained = 0;
        if (isCorrect) {
          scoreGained = calculateScore({
            baseScore: BASE_SCORE,
            timeLeft: timePerQuestion,
            speedMultiplier: SPEED_MULTIPLIER,
            comboCount: prev.combo,
          });
          if (prev.activeEffects.doublePoints) {
            scoreGained *= prev.activeEffects.pointsMultiplier;
          }
        } else if (prev.activeEffects.comboShield) {
          const shieldedCombo = prev.combo;
          scoreGained = 0;
          const newAnswer: Answer = {
            questionId: currentQ.id,
            correct: false,
            timeTaken: timePerQuestion,
          };
          return {
            ...prev,
            combo: shieldedCombo,
            maxCombo: Math.max(prev.maxCombo, shieldedCombo),
            answers: [...prev.answers, newAnswer],
            selectedAnswer: selectedOption,
            activeEffects: {
              ...prev.activeEffects,
              comboShield: false,
            },
          };
        }

        const newAnswer: Answer = {
          questionId: currentQ.id,
          correct: isCorrect,
          timeTaken: timePerQuestion,
        };

        return {
          ...prev,
          score: prev.score + scoreGained,
          combo: newCombo,
          maxCombo: newMaxCombo,
          answers: [...prev.answers, newAnswer],
          selectedAnswer: selectedOption,
          activeEffects: {
            doublePoints: false,
            pointsMultiplier: 2,
            comboShield: false,
            hintOption: null,
          },
        };
      });
    },
    [timePerQuestion]
  );

  const nextQuestion = useCallback(() => {
    setState((prev) => {
      const nextIndex = prev.currentIndex + 1;
      if (nextIndex >= totalQuestions) {
        return { ...prev, gameState: "finished" };
      }

      const rolledEvent = rollRandomEvent(eventDropRate, events);
      const newEffects = { ...prev.activeEffects };

      if (rolledEvent) {
        if (rolledEvent.effect === "double_points") {
          newEffects.doublePoints = true;
          newEffects.pointsMultiplier = rolledEvent.effectParams.multiplier ?? 2;
        } else if (rolledEvent.effect === "combo_shield") {
          newEffects.comboShield = true;
        } else if (rolledEvent.effect === "hint") {
          const nextQ = prev.questions[nextIndex];
          const correctIdx = nextQ.options.indexOf(nextQ.correctAnswer);
          const wrongIndices = nextQ.options
            .map((_, i) => i)
            .filter((i) => i !== correctIdx);
          const eliminateCount = rolledEvent.effectParams.eliminateCount ?? 1;
          if (wrongIndices.length > 0) {
            const shuffled = [...wrongIndices].sort(() => Math.random() - 0.5);
            const toEliminate = shuffled.slice(0, Math.min(eliminateCount, shuffled.length));
            newEffects.hintOption = toEliminate[0];
          }
        }
      }

      return {
        ...prev,
        currentIndex: nextIndex,
        selectedAnswer: null,
        currentEvent: rolledEvent,
        activeEffects: newEffects,
      };
    });
  }, [totalQuestions, eventDropRate, events]);

  const endGame = useCallback(() => {
    setState((prev) => ({ ...prev, gameState: "finished" }));
  }, []);

  const correctCount = state.answers.filter((a) => a.correct).length;
  const totalTime = state.answers.reduce((sum, a) => sum + a.timeTaken, 0);

  return {
    ...state,
    startGame,
    handleAnswer,
    nextQuestion,
    endGame,
    totalQuestions,
    accuracy: state.answers.length > 0 ? (correctCount / state.answers.length) * 100 : 0,
    avgTime: state.answers.length > 0 ? totalTime / state.answers.length : 0,
    consumeEvent,
  };
}
