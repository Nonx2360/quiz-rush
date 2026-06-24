"use client";

import { useState, useCallback } from "react";
import { Question } from "@/lib/types";
import { pickRandomQuestions } from "@/lib/shuffle";
import { prepareQuestion, PreparedQuestion } from "@/lib/prepareQuestion";
import { calculateScore } from "@/lib/scoring";

export interface Answer {
  questionId: string;
  correct: boolean;
  timeTaken: number;
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
}

interface UseQuizEngineReturn extends QuizState {
  startGame: () => void;
  handleAnswer: (selectedOption: string) => void;
  nextQuestion: () => void;
  endGame: () => void;
  totalQuestions: number;
  accuracy: number;
  avgTime: number;
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
    });
  }, [pool]);

  const handleAnswer = useCallback(
    (selectedOption: string) => {
      setState((prev) => {
        if (prev.gameState !== "playing" || prev.selectedAnswer) return prev;

        const currentQ = prev.questions[prev.currentIndex];
        const isCorrect = selectedOption === currentQ.correctAnswer;
        const newCombo = isCorrect ? prev.combo + 1 : 0;
        const newMaxCombo = Math.max(prev.maxCombo, newCombo);
        const scoreGained = isCorrect
          ? calculateScore({
              baseScore: BASE_SCORE,
              timeLeft: TIME_PER_QUESTION,
              speedMultiplier: SPEED_MULTIPLIER,
              comboCount: prev.combo,
            })
          : 0;

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
      return {
        ...prev,
        currentIndex: nextIndex,
        selectedAnswer: null,
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
  };
}
