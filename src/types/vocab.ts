export type CEFRLevel = "A1" | "A2" | "B1" | "B2";
export type CefrLevel = CEFRLevel;

export type PartOfSpeech = "isim" | "fiil" | "sıfat" | "zarf" | "ifade";

export type ArticleType = "der" | "die" | "das" | "none";

export type WordStatus = "catalog" | "studying" | "learned";

export interface WordExample {
  de: string;
  tr: string;
}

export interface VocabWord {
  id: string;
  german: string;
  article?: ArticleType;
  plural?: string;
  turkish: string;
  level: CEFRLevel;
  partOfSpeech?: PartOfSpeech;
  theme: string;
  wikiSearchTerm: string;
  emoji?: string;
  customImageUrl?: string;
  imageUrl?: string;
  examples: WordExample[];
}

export interface QuizStats {
  totalAnswered: number;
  correctAnswers: number;
  currentStreak: number;
  bestStreak: number;
}

export interface AppBackupData {
  version: number;
  exportedAt: string;
  wordStatusMap: Record<string, WordStatus>;
  customImages: Record<string, string>;
  customWords: VocabWord[];
  quizStats: QuizStats;
}
