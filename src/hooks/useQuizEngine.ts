"use client";

import { useState, useCallback } from "react";
import { Question } from "@/lib/types";
import { pickRandomQuestions } from "@/lib/shuffle";
import { prepareQuestion, PreparedQuestion } from "@/lib/prepareQuestion";
import { calculateScore } from "@/lib/scoring";
import { EventType, rollRandomEvent } from "@/lib/events";

export interface Answer {
  questionId: string;
  correct: boolean;
  timeTaken: number;
}

interface ActiveEffects {
  doublePoints: boolean;
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
  currentEvent: EventType | null;
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

const TOTAL_QUESTIONS = 15;
const TIME_PER_QUESTION = 15;
const BASE_SCORE = 50;
const SPEED_MULTIPLIER = 10;

export function useQuizEngine(pool: Question[]): UseQuizEngineReturn {
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
      comboShield: false,
      hintOption: null,
    },
  });

  const startGame = useCallback(() => {
    const selected = pickRandomQuestions(pool, TOTAL_QUESTIONS);
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
        comboShield: false,
        hintOption: null,
      },
    });
  }, [pool]);

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
            timeLeft: TIME_PER_QUESTION,
            speedMultiplier: SPEED_MULTIPLIER,
            comboCount: prev.combo,
          });
          if (prev.activeEffects.doublePoints) {
            scoreGained *= 2;
          }
        } else if (prev.activeEffects.comboShield) {
          // Combo shield: wrong answer doesn't break combo
          const shieldedCombo = prev.combo;
          scoreGained = 0;
          const newAnswer: Answer = {
            questionId: currentQ.id,
            correct: false,
            timeTaken: TIME_PER_QUESTION,
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
          timeTaken: TIME_PER_QUESTION,
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
            comboShield: false,
            hintOption: null,
          },
        };
      });
    },
    []
  );

  const nextQuestion = useCallback(() => {
    setState((prev) => {
      const nextIndex = prev.currentIndex + 1;
      if (nextIndex >= TOTAL_QUESTIONS) {
        return { ...prev, gameState: "finished" };
      }

      const eventType = rollRandomEvent();
      const newEffects = { ...prev.activeEffects };

      if (eventType === "DOUBLE_POINTS") {
        newEffects.doublePoints = true;
      } else if (eventType === "COMBO_SHIELD") {
        newEffects.comboShield = true;
      } else if (eventType === "HINT") {
        const nextQ = prev.questions[nextIndex];
        const correctIdx = nextQ.options.indexOf(nextQ.correctAnswer);
        const wrongIndices = nextQ.options
          .map((_, i) => i)
          .filter((i) => i !== correctIdx);
        if (wrongIndices.length > 0) {
          const randomWrongIdx = wrongIndices[Math.floor(Math.random() * wrongIndices.length)];
          newEffects.hintOption = randomWrongIdx;
        }
      }

      return {
        ...prev,
        currentIndex: nextIndex,
        selectedAnswer: null,
        currentEvent: eventType,
        activeEffects: newEffects,
      };
    });
  }, []);

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
    totalQuestions: TOTAL_QUESTIONS,
    accuracy: state.answers.length > 0 ? (correctCount / state.answers.length) * 100 : 0,
    avgTime: state.answers.length > 0 ? totalTime / state.answers.length : 0,
    consumeEvent,
  };
}
