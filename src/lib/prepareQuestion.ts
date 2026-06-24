import { shuffleArray } from "./shuffle";
import { Question } from "./types";

export interface PreparedQuestion extends Omit<Question, "correctIndex"> {
  correctAnswer: string;
}

export function prepareQuestion(q: Question): PreparedQuestion {
  const correctAnswer = q.options[q.correctIndex];
  const shuffledOptions = shuffleArray(q.options);
  return {
    ...q,
    options: shuffledOptions,
    correctAnswer,
  };
}
