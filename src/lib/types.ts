export interface Question {
  id: string;
  category: "ชีวิต" | "ผลงาน" | "ยุคสมัย" | "กลอน" | "บุคคล";
  difficulty: "easy" | "medium" | "hard";
  question: string;
  options: string[];
  correctIndex: number;
}

export interface LeaderboardEntry {
  username: string;
  score: number;
  accuracy: number;
  avgTime: number;
  playedAt: number;
  contact?: {
    line?: string;
    instagram?: string;
    phone?: string;
  };
}
