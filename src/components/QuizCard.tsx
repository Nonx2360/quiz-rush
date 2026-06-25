"use client";

import { PreparedQuestion } from "@/lib/prepareQuestion";

interface QuizCardProps {
  question: PreparedQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (option: string) => void;
  selectedAnswer: string | null;
  hintOption: number | null;
}

const optionAccents = [
  { letter: "A", color: "var(--color-accent)", bg: "rgba(232,145,45,0.1)" },
  { letter: "B", color: "var(--color-cyan)", bg: "rgba(62,201,209,0.1)" },
  { letter: "C", color: "var(--color-emerald)", bg: "rgba(52,184,122,0.1)" },
  { letter: "D", color: "var(--color-violet)", bg: "rgba(149,117,224,0.1)" },
];

export default function QuizCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  selectedAnswer,
  hintOption,
}: QuizCardProps) {
  return (
    <div className="w-full">
      <div className="card p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span
              className="text-sm font-bold px-3 py-1 rounded"
              style={{ background: "var(--color-surface-border)", color: "var(--color-text-muted)" }}
            >
              {questionNumber}/{totalQuestions}
            </span>
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded"
              style={{ background: "rgba(149,117,224,0.15)", color: "var(--color-violet)" }}
            >
              {question.category}
            </span>
          </div>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded ${
                question.difficulty === "easy"
                  ? "bg-[var(--color-emerald)]/15 text-[var(--color-emerald)]"
                  : question.difficulty === "medium"
                  ? "bg-[var(--color-accent)]/15 text-[var(--color-accent)]"
                  : "bg-[var(--color-rose)]/15 text-[var(--color-rose)]"
              }`}
          >
            {question.difficulty === "easy" ? "ง่าย" : question.difficulty === "medium" ? "ปานกลาง" : "ยาก"}
          </span>
        </div>

        {/* Question */}
        <h2 className="text-lg md:text-xl font-semibold leading-relaxed mb-6 text-[var(--color-text)]">
          {question.question}
        </h2>

        {/* Options */}
        <div className="grid grid-cols-1 gap-3">
          {question.options.map((option, index) => {
            const accent = optionAccents[index];
            const isSelected = selectedAnswer === option;
            const isCorrect = option === question.correctAnswer;
            const showResult = selectedAnswer !== null;
            const isHinted = hintOption === index;

            let className = "option-btn";

            if (showResult) {
              if (isCorrect) {
                className += " correct";
              } else if (isSelected && !isCorrect) {
                className += " wrong";
              } else {
                className += " opacity-30";
              }
            } else if (isHinted) {
              className += " hint-eliminated";
            }

            return (
              <button
                key={index}
                onClick={() => !selectedAnswer && !isHinted && onAnswer(option)}
                disabled={selectedAnswer !== null || isHinted}
                className={className}
              >
                <span
                  className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shrink-0"
                  style={{
                    background:
                      showResult && isCorrect
                        ? "var(--color-emerald)"
                        : showResult && isSelected && !isCorrect
                        ? "var(--color-rose)"
                        : isHinted
                        ? "var(--color-surface-border)"
                        : accent.bg,
                    color:
                      showResult && isCorrect
                        ? "#fff"
                        : showResult && isSelected && !isCorrect
                        ? "#fff"
                        : isHinted
                        ? "var(--color-text-dim)"
                        : accent.color,
                    border: `1px solid ${
                      showResult && isCorrect
                        ? "var(--color-emerald)"
                        : showResult && isSelected && !isCorrect
                        ? "var(--color-rose)"
                        : isHinted
                        ? "var(--color-surface-border)"
                        : "transparent"
                    }`,
                  }}
                >
                  {accent.letter}
                </span>
                <span className={`font-medium text-[15px] ${isHinted ? "line-through opacity-40" : ""}`}>
                  {option}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
