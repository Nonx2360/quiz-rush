"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuizEngine } from "@/hooks/useQuizEngine";
import { useTimer } from "@/hooks/useTimer";
import { Question } from "@/lib/types";
import QuizCard from "@/components/QuizCard";
import Timer from "@/components/Timer";
import ComboIndicator from "@/components/ComboIndicator";
import ScoreDisplay from "@/components/ScoreDisplay";
import ResultSummary from "@/components/ResultSummary";
import NameInputModal from "@/components/NameInputModal";
import Link from "next/link";
import questionsData from "@/data/questions.json";

const TIME_PER_QUESTION = 15;

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setQuestions(questionsData as Question[]);
  }, []);

  const {
    currentIndex,
    score,
    combo,
    maxCombo,
    gameState,
    questions: quizQuestions,
    answers,
    selectedAnswer,
    startGame,
    handleAnswer,
    nextQuestion,
    endGame,
    totalQuestions,
    accuracy,
    avgTime,
  } = useQuizEngine(questions);

  const onTimeout = useCallback(() => {
    if (gameState === "playing" && !selectedAnswer) {
      handleAnswer("");
      setTimeout(() => nextQuestion(), 500);
    }
  }, [gameState, selectedAnswer, handleAnswer, nextQuestion]);

  const timer = useTimer(TIME_PER_QUESTION, onTimeout);

  useEffect(() => {
    if (gameState === "playing" && selectedAnswer) {
      timer.stop();
      const timeout = setTimeout(() => {
        nextQuestion();
        timer.reset(TIME_PER_QUESTION);
        timer.start(TIME_PER_QUESTION);
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [gameState, selectedAnswer, nextQuestion, timer]);

  useEffect(() => {
    if (gameState === "playing" && !selectedAnswer && currentIndex > 0) {
      timer.start(TIME_PER_QUESTION);
    }
  }, [gameState, currentIndex, selectedAnswer, timer]);

  const handleStartGame = () => {
    startGame();
    timer.reset(TIME_PER_QUESTION);
    setTimeout(() => timer.start(TIME_PER_QUESTION), 100);
  };

  const handleSubmitScore = async (username: string) => {
    setIsSubmitting(true);
    try {
      await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, score, accuracy, avgTime }),
      });
      setSubmitted(true);
      setShowModal(false);
    } catch (error) {
      console.error("Failed to submit score:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (questions.length === 0) {
    return (
      <main className="min-h-screen bg-grid flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-[var(--color-text-dim)]">กำลังโหลด...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-grid">
      <ComboIndicator combo={combo} />

      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* ─── Idle State ─── */}
        {gameState === "idle" && (
          <div className="max-w-xl mx-auto text-center py-12">
            <div className="mb-5">
              <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[var(--color-accent)] border border-[var(--color-accent)]/30 px-3 py-1 rounded">
                Quiz Rush
              </span>
            </div>
            <h1 className="text-5xl font-black mb-4">สุนทรภู่</h1>
            <p className="text-sm text-[var(--color-text-dim)] mb-8">
              {totalQuestions} ข้อ ภายในเวลา {TIME_PER_QUESTION} วินาทีต่อข้อ
            </p>
            <button onClick={handleStartGame} className="btn-primary text-lg px-12 mb-6">
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                เริ่มเล่น
              </span>
            </button>
            <div>
              <Link href="/" className="text-sm text-[var(--color-text-dim)] hover:text-[var(--color-text-muted)] transition-colors">
                &larr; กลับหน้าแรก
              </Link>
            </div>
          </div>
        )}

        {/* ─── Playing State ─── */}
        {gameState === "playing" && quizQuestions[currentIndex] && (
          <div className="max-w-2xl mx-auto">
            <ScoreDisplay score={score} combo={combo} />
            <Timer timeLeft={timer.timeLeft} duration={TIME_PER_QUESTION} />
            <QuizCard
              question={quizQuestions[currentIndex]}
              questionNumber={currentIndex + 1}
              totalQuestions={totalQuestions}
              onAnswer={(opt) => {
                handleAnswer(opt);
                timer.stop();
              }}
              selectedAnswer={selectedAnswer}
            />
          </div>
        )}

        {/* ─── Finished State ─── */}
        {gameState === "finished" && (
          <ResultSummary
            score={score}
            answers={answers}
            accuracy={accuracy}
            avgTime={avgTime}
            maxCombo={maxCombo}
            onSubmit={() => setShowModal(true)}
            onPlayAgain={handleStartGame}
          />
        )}

        {/* ─── Success Toast ─── */}
        {submitted && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <div
              className="flex items-center gap-3 px-6 py-3 rounded font-medium text-sm"
              style={{
                background: "rgba(52,184,122,0.12)",
                border: "1px solid rgba(52,184,122,0.25)",
                color: "var(--color-emerald)",
              }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              ส่งคะแนนสำเร็จ!
              <Link href="/leaderboard" className="underline font-bold hover:text-white transition-colors">
                ดู Leaderboard
              </Link>
            </div>
          </div>
        )}
      </div>

      <NameInputModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmitScore}
        isLoading={isSubmitting}
      />
    </main>
  );
}
