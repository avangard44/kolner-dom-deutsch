"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { VocabWord, QuizStats, WordStatus } from "@/types/vocab";
import { speakGerman, soundEngine } from "@/lib/audio";
import { getGenderStyle, parseWordArticle } from "@/lib/gender";
import { WordCardImage } from "./WordCardImage";
import {
  CheckCircle2,
  XCircle,
  Trophy,
  Flame,
  Volume2,
  ArrowRight,
  RotateCcw,
  Check,
  Timer,
  Keyboard,
  Grid,
  HelpCircle,
} from "lucide-react";

export type StudyGameMode = "multiple" | "match" | "spelling";

interface QuizArenaProps {
  allWords: VocabWord[];
  studyPool: VocabWord[];
  customImages: Record<string, string>;
  quizStats: QuizStats;
  initialGameMode?: StudyGameMode;
  isRetentionTest?: boolean;
  spellingHelperEnabled?: boolean;
  onUpdateStats: (isCorrect: boolean) => void;
  onSetStatus: (wordId: string, status: WordStatus) => void;
  onBatchSetStatus: (wordIds: string[], status: WordStatus) => void;
}

interface QuestionItem {
  target: VocabWord;
  options: string[];
  correctAnswer: string;
}

interface MatchTile {
  tileId: string;
  wordId: string;
  side: "de" | "tr";
  label: string;
  subLabel?: string;
}

export function QuizArena({
  allWords,
  studyPool,
  customImages,
  quizStats,
  initialGameMode = "multiple",
  isRetentionTest = false,
  spellingHelperEnabled = true,
  onUpdateStats,
  onSetStatus,
  onBatchSetStatus,
}: QuizArenaProps) {
  const [gameMode, setGameMode] = useState<StudyGameMode>(initialGameMode);

  useEffect(() => {
    setGameMode(initialGameMode);
  }, [initialGameMode]);

  // ============================================================================
  // 1. MULTIPLE CHOICE STATE
  // ============================================================================
  const [qIndex, setQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [sessionCorrectIds, setSessionCorrectIds] = useState<string[]>([]);
  const [sessionWrongIds, setSessionWrongIds] = useState<string[]>([]);
  const [seedKey, setSeedKey] = useState(0);

  const questions: QuestionItem[] = useMemo(() => {
    const source = studyPool.length > 0 ? studyPool : allWords;
    const shuffled = [...source].sort(() => Math.random() - 0.5).slice(0, 12);

    return shuffled.map((target) => {
      const distractors = allWords
        .filter((w) => w.id !== target.id && w.turkish !== target.turkish)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((w) => w.turkish);

      const options = [...distractors, target.turkish].sort(
        () => Math.random() - 0.5
      );
      return {
        target,
        options,
        correctAnswer: target.turkish,
      };
    });
  }, [studyPool, allWords, seedKey]);

  const currentQuestion = questions[qIndex];
  const isQuizFinished = qIndex >= questions.length && questions.length > 0;

  const handleSelectOption = (option: string) => {
    if (selectedOption !== null || !currentQuestion) return;
    setSelectedOption(option);

    const isCorrect = option === currentQuestion.correctAnswer;
    const wordId = currentQuestion.target.id;

    if (isCorrect) {
      soundEngine.playSuccess();
      setSessionCorrectIds((prev) =>
        prev.includes(wordId) ? prev : [...prev, wordId]
      );
      onUpdateStats(true);
      const { fullGerman } = parseWordArticle(currentQuestion.target);
      speakGerman(fullGerman);
    } else {
      soundEngine.playError();
      setSessionWrongIds((prev) =>
        prev.includes(wordId) ? prev : [...prev, wordId]
      );
      onUpdateStats(false);
      // Retention Rule: If user forgets a learned word during Retention Test, move it back to "studying"
      if (isRetentionTest) {
        onSetStatus(wordId, "studying");
      }
    }
  };

  const handleNextQuestion = () => {
    soundEngine.playClick();
    setSelectedOption(null);
    setQIndex((prev) => prev + 1);
  };

  const handleRestartQuiz = () => {
    soundEngine.playClick();
    setSelectedOption(null);
    setQIndex(0);
    setSessionCorrectIds([]);
    setSessionWrongIds([]);
    setSeedKey((k) => k + 1);
  };

  // ============================================================================
  // 2. MATCH GAME (6-PAIR TIMED GRID) STATE
  // ============================================================================
  const [matchSeed, setMatchSeed] = useState(0);
  const [selectedTile, setSelectedTile] = useState<MatchTile | null>(null);
  const [matchedWordIds, setMatchedWordIds] = useState<string[]>([]);
  const [wrongPairIds, setWrongPairIds] = useState<string[]>([]);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [movesCount, setMovesCount] = useState(0);
  const [graduatedMatchRound, setGraduatedMatchRound] = useState(false);

  const matchWords = useMemo(() => {
    const source = studyPool.length > 0 ? studyPool : allWords;
    return [...source].sort(() => Math.random() - 0.5).slice(0, 6);
  }, [studyPool, allWords, matchSeed]);

  const matchTiles: MatchTile[] = useMemo(() => {
    const tiles: MatchTile[] = [];
    matchWords.forEach((w) => {
      const { fullGerman } = parseWordArticle(w);
      tiles.push({
        tileId: `de-${w.id}`,
        wordId: w.id,
        side: "de",
        label: fullGerman,
        subLabel: "DE",
      });
      tiles.push({
        tileId: `tr-${w.id}`,
        wordId: w.id,
        side: "tr",
        label: w.turkish,
        subLabel: "TR",
      });
    });
    return tiles.sort(() => Math.random() - 0.5);
  }, [matchWords]);

  const isMatchFinished =
    matchWords.length > 0 && matchedWordIds.length === matchWords.length;

  useEffect(() => {
    if (gameMode !== "match" || isMatchFinished) return;
    const timer = setInterval(() => {
      setElapsedSec((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [gameMode, isMatchFinished, matchSeed]);

  const handleTileClick = (tile: MatchTile) => {
    if (matchedWordIds.includes(tile.wordId)) return;
    if (selectedTile?.tileId === tile.tileId) {
      setSelectedTile(null);
      return;
    }

    soundEngine.playClick();
    if (tile.side === "de") {
      speakGerman(tile.label);
    }

    if (!selectedTile) {
      setSelectedTile(tile);
      return;
    }

    setMovesCount((m) => m + 1);

    if (selectedTile.wordId === tile.wordId && selectedTile.side !== tile.side) {
      soundEngine.playSuccess();
      setMatchedWordIds((prev) => [...prev, tile.wordId]);
      onUpdateStats(true);
      setSelectedTile(null);
    } else {
      soundEngine.playError();
      setWrongPairIds([selectedTile.tileId, tile.tileId]);
      onUpdateStats(false);
      setTimeout(() => {
        setWrongPairIds([]);
        setSelectedTile(null);
      }, 480);
    }
  };

  const handleRestartMatch = () => {
    soundEngine.playClick();
    setSelectedTile(null);
    setMatchedWordIds([]);
    setWrongPairIds([]);
    setElapsedSec(0);
    setMovesCount(0);
    setGraduatedMatchRound(false);
    setMatchSeed((s) => s + 1);
  };

  // ============================================================================
  // 3. SPELLING BEE (KELİME YAZMA) STATE
  // ============================================================================
  const [spellIndex, setSpellIndex] = useState(0);
  const [spellInput, setSpellInput] = useState("");
  const [spellStatus, setSpellStatus] = useState<"idle" | "correct" | "wrong">(
    "idle"
  );
  const [spellCorrectIds, setSpellCorrectIds] = useState<string[]>([]);
  const [spellSeed, setSpellSeed] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const spellWords = useMemo(() => {
    const source = studyPool.length > 0 ? studyPool : allWords;
    return [...source].sort(() => Math.random() - 0.5).slice(0, 10);
  }, [studyPool, allWords, spellSeed]);

  const currentSpellWord = spellWords[spellIndex];
  const isSpellFinished =
    spellIndex >= spellWords.length && spellWords.length > 0;

  const insertHelperText = (snippet: string) => {
    soundEngine.playClick();
    if (snippet === "der " || snippet === "die " || snippet === "das ") {
      const stripped = spellInput.replace(/^(der|die|das)\s+/i, "");
      setSpellInput(`${snippet}${stripped}`);
    } else {
      setSpellInput((prev) => `${prev}${snippet}`);
    }
    inputRef.current?.focus();
  };

  const handleCheckSpelling = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSpellWord || spellStatus !== "idle") return;

    const { baseGerman, fullGerman } = parseWordArticle(currentSpellWord);
    const cleanedUser = spellInput.trim().toLowerCase().replace(/\s+/g, " ");
    const cleanedFull = fullGerman.trim().toLowerCase();
    const cleanedBase = baseGerman.trim().toLowerCase();

    if (cleanedUser === cleanedFull || cleanedUser === cleanedBase) {
      soundEngine.playSuccess();
      setSpellStatus("correct");
      setSpellCorrectIds((prev) =>
        prev.includes(currentSpellWord.id)
          ? prev
          : [...prev, currentSpellWord.id]
      );
      onUpdateStats(true);
      speakGerman(fullGerman);
    } else {
      soundEngine.playError();
      setSpellStatus("wrong");
      onUpdateStats(false);
      speakGerman(fullGerman);
    }
  };

  const handleNextSpelling = () => {
    soundEngine.playClick();
    setSpellInput("");
    setSpellStatus("idle");
    setSpellIndex((i) => i + 1);
  };

  const handleRestartSpelling = () => {
    soundEngine.playClick();
    setSpellInput("");
    setSpellStatus("idle");
    setSpellIndex(0);
    setSpellCorrectIds([]);
    setSpellSeed((s) => s + 1);
  };

  const accuracy =
    quizStats.totalAnswered > 0
      ? Math.round((quizStats.correctAnswers / quizStats.totalAnswered) * 100)
      : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Top Game Mode Bar & Streak Counter */}
      {!isRetentionTest && (
        <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-2xl bg-black/55 backdrop-blur-xl border border-white/15">
          <div className="w-full sm:w-auto grid grid-cols-3 sm:flex items-center gap-1 bg-black/50 p-1 rounded-xl sm:rounded-full border border-white/15">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setGameMode("multiple");
              }}
              className={`h-8 px-2.5 sm:px-4 rounded-lg sm:rounded-full text-[10px] sm:text-[11px] font-bold tracking-wider uppercase inline-flex items-center justify-center gap-1.5 transition-all ${
                gameMode === "multiple"
                  ? "bg-white text-stone-950 shadow-sm"
                  : "text-stone-300 hover:text-white"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">4 SEÇENEKLİ</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setGameMode("match");
              }}
              className={`h-8 px-2.5 sm:px-4 rounded-lg sm:rounded-full text-[10px] sm:text-[11px] font-bold tracking-wider uppercase inline-flex items-center justify-center gap-1.5 transition-all ${
                gameMode === "match"
                  ? "bg-white text-stone-950 shadow-sm"
                  : "text-stone-300 hover:text-white"
              }`}
            >
              <Grid className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">EŞLEŞTİRME</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setGameMode("spelling");
              }}
              className={`h-8 px-2.5 sm:px-4 rounded-lg sm:rounded-full text-[10px] sm:text-[11px] font-bold tracking-wider uppercase inline-flex items-center justify-center gap-1.5 transition-all ${
                gameMode === "spelling"
                  ? "bg-white text-stone-950 shadow-sm"
                  : "text-stone-300 hover:text-white"
              }`}
            >
              <Keyboard className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">KELİME YAZMA</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono ml-auto">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-amber-200">
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              <span>Seri: {quizStats.currentStreak}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-stone-200">
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              <span>%{accuracy}</span>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODE 1: DÖRT SEÇENEKLİ QUIZ (OR GENEL TEKRAR TESTİ)                   */}
      {/* ===================================================================== */}
      {gameMode === "multiple" && (
        <>
          {isQuizFinished ? (
            <div className="p-7 sm:p-8 rounded-2xl bg-black/60 backdrop-blur-2xl border border-white/15 text-center space-y-5 animate-pop shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 text-amber-200 flex items-center justify-center mx-auto">
                <Trophy className="w-8 h-8" />
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-amber-300 mb-1">
                  {isRetentionTest
                    ? "GENEL TEKRAR TESTİ TAMAMLANDI"
                    : "4 SEÇENEKLİ QUIZ TAMAMLANDI"}
                </div>
                <h2 className="text-2xl font-light tracking-[0.1em] uppercase text-white">
                  DOĞRU:{" "}
                  <span className="font-semibold bg-gradient-to-r from-amber-200 via-white to-sky-200 bg-clip-text text-transparent">
                    {sessionCorrectIds.length} / {questions.length}
                  </span>
                </h2>
                {isRetentionTest && sessionWrongIds.length > 0 && (
                  <p className="text-xs text-rose-200 mt-2">
                    Unutulan {sessionWrongIds.length} kelime tekrar pratik için{" "}
                    <strong>Öğreniliyor</strong> bölümüne taşındı.
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                {!isRetentionTest && sessionCorrectIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playSuccess();
                      onBatchSetStatus(sessionCorrectIds, "learned");
                    }}
                    className="h-10 px-6 rounded-full bg-emerald-400 hover:bg-emerald-300 text-stone-950 text-xs font-bold tracking-[0.12em] uppercase inline-flex items-center gap-2 transition-all shadow-md"
                  >
                    <Check className="w-4 h-4 stroke-[2.5]" />✓ DOĞRU BİLİNENLERİ
                    ({sessionCorrectIds.length}) ÖĞRENİLENLERE TAŞI
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleRestartQuiz}
                  className="h-10 px-6 rounded-full bg-white hover:bg-amber-50 text-stone-950 text-xs font-bold tracking-[0.14em] uppercase inline-flex items-center gap-2 transition-all shadow-md"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  YENİ TUR BAŞLAT
                </button>
              </div>
            </div>
          ) : currentQuestion ? (
            <div className="p-5 sm:p-7 rounded-2xl bg-black/55 backdrop-blur-2xl border border-white/15 shadow-2xl space-y-5">
              <div className="flex items-center justify-between text-xs font-mono text-stone-300">
                <span className="uppercase tracking-[0.16em] text-amber-300">
                  {isRetentionTest ? "GENEL TEKRAR" : "DÖRT SEÇENEKLİ QUIZ"} • SORU{" "}
                  {qIndex + 1} / {questions.length}
                </span>
                <span className="text-stone-400">{currentQuestion.target.theme}</span>
              </div>

              {/* Word Image + German Prompt */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center py-3 border-y border-white/10">
                <WordCardImage
                  word={currentQuestion.target}
                  customImageUrl={customImages[currentQuestion.target.id]}
                  size="md"
                />

                <div className="text-center sm:text-left space-y-2">
                  {(() => {
                    const { article, baseGerman, fullGerman } = parseWordArticle(
                      currentQuestion.target
                    );
                    const gs = getGenderStyle(article);
                    return (
                      <>
                        {article !== "none" && (
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase border ${gs.badgeBg} ${gs.badgeText} ${gs.badgeBorder}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${gs.dotColor}`}
                            />
                            {article}
                          </span>
                        )}
                        <div className="flex items-center justify-center sm:justify-start gap-2.5">
                          <h3 className="text-2xl sm:text-3xl font-semibold text-white">
                            {baseGerman}
                          </h3>
                          <button
                            type="button"
                            onClick={() => speakGerman(fullGerman)}
                            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white text-white hover:text-stone-950 border border-white/15 flex items-center justify-center transition-colors"
                            title="Almanca Telaffuz"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    );
                  })()}
                  <p className="text-xs text-stone-400">
                    Doğru Türkçe karşılığını seçin:
                  </p>
                </div>
              </div>

              {/* 4 Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedOption === option;
                  const isCorrectOption = option === currentQuestion.correctAnswer;

                  let btnStyle =
                    "bg-black/45 border-white/15 hover:border-white/40 hover:bg-white/10 text-white";

                  if (selectedOption !== null) {
                    if (isCorrectOption) {
                      btnStyle =
                        "bg-emerald-950/60 border-emerald-400/60 text-emerald-100 ring-1 ring-emerald-400/40";
                    } else if (isSelected && !isCorrectOption) {
                      btnStyle =
                        "bg-rose-950/60 border-rose-400/60 text-rose-100";
                    } else {
                      btnStyle =
                        "bg-black/30 border-white/10 text-stone-500 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={option}
                      type="button"
                      disabled={selectedOption !== null}
                      onClick={() => handleSelectOption(option)}
                      className={`p-4 rounded-xl border text-left font-medium text-sm transition-all flex items-center justify-between gap-2 backdrop-blur-md ${btnStyle}`}
                    >
                      <span>{option}</span>
                      {selectedOption !== null && isCorrectOption && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                      )}
                      {selectedOption !== null && isSelected && !isCorrectOption && (
                        <XCircle className="w-4 h-4 text-rose-300 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback & Graduate Action */}
              {selectedOption !== null && (
                <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10 animate-pop">
                  <div className="text-xs text-stone-300">
                    {selectedOption === currentQuestion.correctAnswer ? (
                      <span className="text-emerald-300 font-semibold uppercase tracking-wider">
                        ✓ Doğru cevap!
                      </span>
                    ) : isRetentionTest ? (
                      <span className="text-rose-300">
                        Doğru cevap:{" "}
                        <strong className="text-amber-200">
                          {currentQuestion.correctAnswer}
                        </strong>{" "}
                        • Kelime <strong>Öğreniliyor</strong> listesine taşındı.
                      </span>
                    ) : (
                      <span>
                        Doğru cevap:{" "}
                        <strong className="text-amber-200">
                          {currentQuestion.correctAnswer}
                        </strong>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {!isRetentionTest &&
                      selectedOption === currentQuestion.correctAnswer && (
                        <button
                          type="button"
                          onClick={() => {
                            soundEngine.playSuccess();
                            onSetStatus(currentQuestion.target.id, "learned");
                            handleNextQuestion();
                          }}
                          className="h-9 px-4 rounded-full text-[10px] font-bold tracking-wider uppercase border border-emerald-300/40 bg-emerald-400/20 hover:bg-emerald-400/30 text-emerald-100 inline-flex items-center gap-1.5 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />✓ ÖĞRENDİM
                        </button>
                      )}

                    {isRetentionTest &&
                      selectedOption === currentQuestion.correctAnswer && (
                        <button
                          type="button"
                          onClick={() => {
                            soundEngine.playClick();
                            onSetStatus(currentQuestion.target.id, "studying");
                            handleNextQuestion();
                          }}
                          className="h-9 px-3.5 rounded-full text-[10px] font-semibold tracking-wider uppercase border border-white/20 bg-white/10 hover:bg-white/20 text-white inline-flex items-center gap-1.5 transition-colors"
                        >
                          <RotateCcw className="w-3 h-3" />
                          TEKRAR ÇALIŞ
                        </button>
                      )}

                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      className="h-9 px-5 rounded-full bg-white hover:bg-amber-50 text-stone-950 text-[11px] font-bold tracking-[0.14em] uppercase inline-flex items-center gap-1.5 transition-all shadow-md"
                    >
                      SONRAKİ
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </>
      )}

      {/* ===================================================================== */}
      {/* MODE 2: EŞLEŞTİRME OYUNU (6-PAIR TIMED MATCHING GRID)                 */}
      {/* ===================================================================== */}
      {gameMode === "match" && (
        <div className="p-5 sm:p-7 rounded-2xl bg-black/55 backdrop-blur-2xl border border-white/15 shadow-2xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-amber-300">
                EŞLEŞTİRME OYUNU (ALMANCA ↔ TÜRKÇE)
              </span>
              <h3 className="text-base sm:text-lg font-semibold text-white">
                {matchedWordIds.length} / {matchWords.length} Çift Eşleşti
              </h3>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-amber-200 inline-flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5" />
                {elapsedSec} sn
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-stone-200">
                Hamle: {movesCount}
              </span>
              <button
                type="button"
                onClick={handleRestartMatch}
                className="h-8 px-3 rounded-full bg-white/15 hover:bg-white text-white hover:text-stone-950 text-[10px] font-bold uppercase tracking-wider transition-colors"
              >
                YENİLE
              </button>
            </div>
          </div>

          {isMatchFinished ? (
            <div className="py-8 text-center space-y-4 animate-pop">
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 text-amber-200 flex items-center justify-center mx-auto">
                <Trophy className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-semibold text-white">
                Tebrikler! {elapsedSec} saniyede {movesCount} hamlede tamamladınız.
              </h4>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {!graduatedMatchRound ? (
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playSuccess();
                      onBatchSetStatus(matchedWordIds, "learned");
                      setGraduatedMatchRound(true);
                    }}
                    className="h-10 px-6 rounded-full bg-emerald-400 hover:bg-emerald-300 text-stone-950 text-xs font-bold tracking-[0.12em] uppercase inline-flex items-center gap-2 shadow-md transition-all"
                  >
                    <Check className="w-4 h-4 stroke-[2.5]" />✓ EŞLEŞEN{" "}
                    {matchedWordIds.length} KELİMEYİ ÖĞRENİLENLERE TAŞI
                  </button>
                ) : (
                  <span className="px-4 py-2 rounded-full bg-emerald-400/20 border border-emerald-300/40 text-emerald-200 text-xs font-bold uppercase tracking-wider">
                    ✓ Kelimeler Öğrenilenler Bölümüne Eklendi!
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleRestartMatch}
                  className="h-10 px-6 rounded-full bg-white hover:bg-amber-50 text-stone-950 text-xs font-bold tracking-[0.12em] uppercase inline-flex items-center gap-2 shadow-md transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  TEKRAR OYNA
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3">
              {matchTiles.map((tile) => {
                const isMatched = matchedWordIds.includes(tile.wordId);
                const isSelected = selectedTile?.tileId === tile.tileId;
                const isWrong = wrongPairIds.includes(tile.tileId);

                return (
                  <button
                    key={tile.tileId}
                    type="button"
                    disabled={isMatched}
                    onClick={() => handleTileClick(tile)}
                    className={`min-h-[84px] p-3 rounded-xl border text-center flex flex-col items-center justify-center gap-1 transition-all select-none ${
                      isMatched
                        ? "bg-emerald-950/35 border-emerald-400/30 text-emerald-200/50 scale-95 opacity-45 cursor-default"
                        : isWrong
                        ? "bg-rose-950/70 border-rose-400 text-rose-100 scale-95"
                        : isSelected
                        ? "bg-white text-stone-950 border-white shadow-lg scale-[1.03]"
                        : "bg-black/45 border-white/15 hover:border-white/40 hover:bg-white/10 text-white"
                    }`}
                  >
                    <span className="text-[10px] font-mono uppercase tracking-widest opacity-70">
                      {tile.subLabel}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold leading-snug line-clamp-2">
                      {tile.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODE 3: KELİME YAZMA (SPELLING BEE WITH UMLAUT & ARTICLE KEYS)        */}
      {/* ===================================================================== */}
      {gameMode === "spelling" && (
        <>
          {isSpellFinished ? (
            <div className="p-7 sm:p-8 rounded-2xl bg-black/60 backdrop-blur-2xl border border-white/15 text-center space-y-5 animate-pop shadow-2xl">
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 text-amber-200 flex items-center justify-center mx-auto">
                <Keyboard className="w-7 h-7" />
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-amber-300 mb-1">
                  KELİME YAZMA TAMAMLANDI
                </div>
                <h2 className="text-2xl font-semibold text-white">
                  {spellCorrectIds.length} / {spellWords.length} Doğru Yazım
                </h2>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                {spellCorrectIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playSuccess();
                      onBatchSetStatus(spellCorrectIds, "learned");
                    }}
                    className="h-10 px-6 rounded-full bg-emerald-400 hover:bg-emerald-300 text-stone-950 text-xs font-bold tracking-[0.12em] uppercase inline-flex items-center gap-2 shadow-md transition-all"
                  >
                    <Check className="w-4 h-4 stroke-[2.5]" />✓ DOĞRU YAZILANLARI (
                    {spellCorrectIds.length}) ÖĞRENİLENLERE TAŞI
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleRestartSpelling}
                  className="h-10 px-6 rounded-full bg-white hover:bg-amber-50 text-stone-950 text-xs font-bold tracking-[0.14em] uppercase inline-flex items-center gap-2 shadow-md transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  YENİDEN BAŞLA
                </button>
              </div>
            </div>
          ) : currentSpellWord ? (
            <div className="p-5 sm:p-7 rounded-2xl bg-black/55 backdrop-blur-2xl border border-white/15 shadow-2xl space-y-5">
              <div className="flex items-center justify-between text-xs font-mono text-stone-300">
                <span className="uppercase tracking-[0.16em] text-amber-300">
                  KELİME YAZMA • {spellIndex + 1} / {spellWords.length}
                </span>
                <span>{currentSpellWord.theme}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center py-3 border-y border-white/10">
                <WordCardImage
                  word={currentSpellWord}
                  customImageUrl={customImages[currentSpellWord.id]}
                  size="md"
                />

                <div className="text-center sm:text-left space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-amber-300">
                    TÜRKÇE ANLAMI
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-semibold text-white">
                    {currentSpellWord.turkish}
                  </h3>
                  <p className="text-xs text-stone-400">
                    Almanca karşılığını yazın (İpucu:{" "}
                    {parseWordArticle(currentSpellWord).baseGerman[0]}...)
                  </p>
                </div>
              </div>

              {/* Quick Article & German Umlaut Helper Buttons */}
              <div className="space-y-2">
                {spellingHelperEnabled && (
                  <div className="flex flex-wrap items-center gap-1.5 animate-pop">
                    {(["der ", "die ", "das "] as const).map((art) => (
                      <button
                        key={art}
                        type="button"
                        onClick={() => insertHelperText(art)}
                        className="h-8 px-3 rounded-lg bg-white/10 hover:bg-white/25 border border-white/15 text-xs font-bold text-amber-200 transition-colors"
                      >
                        {art.trim()}
                      </button>
                    ))}
                    <span className="mx-1 text-white/20">|</span>
                    {["ä", "ö", "ü", "ß", "Ä", "Ö", "Ü"].map((ch) => (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => insertHelperText(ch)}
                        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white hover:text-stone-950 border border-white/15 text-xs font-bold text-white transition-colors"
                      >
                        {ch}
                      </button>
                    ))}
                  </div>
                )}

                <form onSubmit={handleCheckSpelling} className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={spellInput}
                    disabled={spellStatus !== "idle"}
                    onChange={(e) => setSpellInput(e.target.value)}
                    placeholder="Almanca kelimeyi yazın (örn: der Tisch)..."
                    className="flex-1 h-11 px-4 rounded-xl bg-black/60 border border-white/20 text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-200"
                  />
                  {spellStatus === "idle" && (
                    <button
                      type="submit"
                      className="h-11 px-6 rounded-xl bg-white hover:bg-amber-50 text-stone-950 text-xs font-bold tracking-[0.14em] uppercase shadow-md transition-all"
                    >
                      KONTROL ET
                    </button>
                  )}
                </form>
              </div>

              {spellStatus !== "idle" && (
                <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10 animate-pop">
                  <div className="text-xs">
                    {spellStatus === "correct" ? (
                      <span className="text-emerald-300 font-semibold uppercase tracking-wider">
                        ✓ Harika! Doğru yazdınız:{" "}
                        {parseWordArticle(currentSpellWord).fullGerman}
                      </span>
                    ) : (
                      <span className="text-rose-200">
                        Doğru yazılışı:{" "}
                        <strong className="text-amber-200">
                          {parseWordArticle(currentSpellWord).fullGerman}
                        </strong>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {spellStatus === "correct" && (
                      <button
                        type="button"
                        onClick={() => {
                          soundEngine.playSuccess();
                          onSetStatus(currentSpellWord.id, "learned");
                          handleNextSpelling();
                        }}
                        className="h-9 px-4 rounded-full text-[10px] font-bold tracking-wider uppercase border border-emerald-300/40 bg-emerald-400/20 hover:bg-emerald-400/30 text-emerald-100 inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />✓ ÖĞRENDİM
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleNextSpelling}
                      className="h-9 px-5 rounded-full bg-white hover:bg-amber-50 text-stone-950 text-[11px] font-bold tracking-[0.14em] uppercase inline-flex items-center gap-1.5 shadow-md transition-all"
                    >
                      SONRAKİ
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
