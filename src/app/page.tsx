"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { SEED_WORDS } from "@/data/seedWords";
import {
  VocabWord,
  WordStatus,
  QuizStats,
} from "@/types/vocab";
import {
  loadCustomWordsFromIDB,
  saveCustomWordsToIDB,
} from "@/lib/storage";
import { soundEngine } from "@/lib/audio";
import { CatalogWordCard } from "@/components/CatalogWordCard";
import { FlashcardDeck } from "@/components/FlashcardDeck";
import { QuizArena, StudyGameMode } from "@/components/QuizArena";
import { ImageOverrideModal, BulkImportModal } from "@/components/Modals";
import { CologneIntroHero, KölnerDomLogo } from "@/components/CologneIntroHero";
import { Cologne3DScene } from "@/components/Cologne3DScene";
import {
  Search,
  Plus,
  Volume2,
  VolumeX,
  Sparkles,
  Check,
  Shuffle,
  Layers,
  Grid,
  HelpCircle,
  Keyboard,
  BookOpen,
  Trophy,
  ArrowLeft,
  Settings,
} from "lucide-react";

type MainSection = "catalog" | "studying" | "learned";
type StudyingSubMode = "cards" | "flashcards" | "match" | "multiple" | "spelling";

const LS_KEYS = {
  STATUS_MAP: "wm_word_status_map_v2",
  LEGACY_LEARNED: "wm_learned_ids_v1",
  IMAGES: "wm_custom_images_v1",
  STATS: "wm_quiz_stats_v1",
  SOUND: "wm_sound_enabled_v1",
  SPELLING_HELPER: "wm_spelling_helper_v1",
};

const INITIAL_STATS: QuizStats = {
  totalAnswered: 0,
  correctAnswers: 0,
  currentStreak: 0,
  bestStreak: 0,
};

export default function WortMeisterApp() {
  const [hydrated, setHydrated] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [customWords, setCustomWords] = useState<VocabWord[]>([]);

  // Single state map in localStorage: wordId -> 'catalog' | 'studying' | 'learned'
  const [wordStatusMap, setWordStatusMap] = useState<Record<string, WordStatus>>({});
  const [customImages, setCustomImages] = useState<Record<string, string>>({});
  const [quizStats, setQuizStats] = useState<QuizStats>(INITIAL_STATS);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [spellingHelperEnabled, setSpellingHelperEnabled] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Strict 3-Section Navigation
  const [activeSection, setActiveSection] = useState<MainSection>("catalog");
  const [studyingMode, setStudyingMode] = useState<StudyingSubMode>("cards");
  const [learnedTestActive, setLearnedTestActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [editingImageWord, setEditingImageWord] = useState<VocabWord | null>(null);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);

  // Pagination for smooth 2000+ words rendering (48 cards per page)
  const [visibleLimit, setVisibleLimit] = useState(48);

  // Hydrate from localStorage + IndexedDB
  useEffect(() => {
    try {
      const savedMap = localStorage.getItem(LS_KEYS.STATUS_MAP);
      if (savedMap) {
        setWordStatusMap(JSON.parse(savedMap));
      } else {
        // Migrate legacy learned IDs if present
        const legacyLearned = localStorage.getItem(LS_KEYS.LEGACY_LEARNED);
        if (legacyLearned) {
          const ids: string[] = JSON.parse(legacyLearned);
          const migrated: Record<string, WordStatus> = {};
          ids.forEach((id) => {
            migrated[id] = "learned";
          });
          setWordStatusMap(migrated);
        }
      }

      const savedImages = localStorage.getItem(LS_KEYS.IMAGES);
      if (savedImages) setCustomImages(JSON.parse(savedImages));

      const savedStats = localStorage.getItem(LS_KEYS.STATS);
      if (savedStats) setQuizStats(JSON.parse(savedStats));

      const savedSound = localStorage.getItem(LS_KEYS.SOUND);
      if (savedSound !== null) {
        const enabled = JSON.parse(savedSound);
        setSoundEnabled(enabled);
        soundEngine.setEnabled(enabled);
      }

      const savedSpellingHelper = localStorage.getItem(LS_KEYS.SPELLING_HELPER);
      if (savedSpellingHelper !== null) {
        setSpellingHelperEnabled(JSON.parse(savedSpellingHelper));
      }
    } catch {
      // ignore storage errors
    }

    loadCustomWordsFromIDB().then((idbWords) => {
      if (idbWords && idbWords.length > 0) {
        setCustomWords(idbWords);
      }
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(LS_KEYS.STATUS_MAP, JSON.stringify(wordStatusMap));
  }, [wordStatusMap, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(LS_KEYS.IMAGES, JSON.stringify(customImages));
  }, [customImages, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(LS_KEYS.STATS, JSON.stringify(quizStats));
  }, [quizStats, hydrated]);

  const allWords = useMemo(() => {
    return [...customWords, ...SEED_WORDS];
  }, [customWords]);

  const getWordStatus = useCallback(
    (wordId: string): WordStatus => {
      return wordStatusMap[wordId] || "catalog";
    },
    [wordStatusMap]
  );

  // Set status of a single word ('catalog' | 'studying' | 'learned')
  const handleSetWordStatus = useCallback(
    (wordId: string, nextStatus: WordStatus) => {
      setWordStatusMap((prev) => {
        const next = { ...prev };
        if (nextStatus === "catalog") {
          delete next[wordId];
        } else {
          next[wordId] = nextStatus;
        }
        return next;
      });
    },
    []
  );

  // Set status for multiple words at once (e.g. graduating round words or adding 10 random words)
  const handleBatchSetStatus = useCallback(
    (wordIds: string[], nextStatus: WordStatus) => {
      setWordStatusMap((prev) => {
        const next = { ...prev };
        wordIds.forEach((id) => {
          if (nextStatus === "catalog") {
            delete next[id];
          } else {
            next[id] = nextStatus;
          }
        });
        return next;
      });
    },
    []
  );

  // Add 10 random unselected catalog words to "Öğreniliyor"
  const handleAddRandom10 = () => {
    const unselected = allWords.filter(
      (w) => getWordStatus(w.id) === "catalog"
    );
    if (unselected.length === 0) return;
    soundEngine.playSuccess();
    const picked = [...unselected]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10)
      .map((w) => w.id);
    handleBatchSetStatus(picked, "studying");
  };

  // Derived word lists per section
  const studyingWords = useMemo(
    () => allWords.filter((w) => getWordStatus(w.id) === "studying"),
    [allWords, getWordStatus]
  );

  const learnedWords = useMemo(
    () => allWords.filter((w) => getWordStatus(w.id) === "learned"),
    [allWords, getWordStatus]
  );

  // Search-filtered words for current active section
  const filteredWords = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const baseList =
      activeSection === "studying"
        ? studyingWords
        : activeSection === "learned"
        ? learnedWords
        : allWords;

    if (!q) return baseList;

    return baseList.filter((word) => {
      const matchDe = word.german.toLowerCase().includes(q);
      const matchTr = word.turkish.toLowerCase().includes(q);
      const matchTheme = word.theme.toLowerCase().includes(q);
      return matchDe || matchTr || matchTheme;
    });
  }, [activeSection, allWords, studyingWords, learnedWords, searchQuery]);

  useEffect(() => {
    setVisibleLimit(48);
  }, [activeSection, searchQuery]);

  const handleSaveCustomImage = (wordId: string, url: string | null) => {
    setCustomImages((prev) => {
      const next = { ...prev };
      if (!url) {
        delete next[wordId];
      } else {
        next[wordId] = url;
      }
      return next;
    });
  };

  const handleBulkImport = async (
    newWords: VocabWord[],
    addToStudying = true
  ) => {
    const updated = [...newWords, ...customWords];
    setCustomWords(updated);
    if (addToStudying) {
      handleBatchSetStatus(
        newWords.map((w) => w.id),
        "studying"
      );
    }
    await saveCustomWordsToIDB(updated);
  };

  const handleUpdateQuizStats = (isCorrect: boolean) => {
    setQuizStats((prev) => {
      const nextStreak = isCorrect ? prev.currentStreak + 1 : 0;
      return {
        totalAnswered: prev.totalAnswered + 1,
        correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
        currentStreak: nextStreak,
        bestStreak: Math.max(prev.bestStreak, nextStreak),
      };
    });
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEngine.setEnabled(next);
    localStorage.setItem(LS_KEYS.SOUND, JSON.stringify(next));
    if (next) soundEngine.playClick();
  };

  const toggleSpellingHelper = () => {
    const next = !spellingHelperEnabled;
    setSpellingHelperEnabled(next);
    localStorage.setItem(LS_KEYS.SPELLING_HELPER, JSON.stringify(next));
    soundEngine.playClick();
  };

  const visibleWords = filteredWords.slice(0, visibleLimit);

  return (
    <div className="min-h-dvh bg-[#0c0d10] p-0 sm:p-4 flex items-center justify-center select-none sm:select-auto">
      {/* Intro Splash Overlay */}
      {showIntro && (
        <CologneIntroHero
          totalWords={allWords.length}
          learnedCount={learnedWords.length}
          onEnterWorkspace={(targetTab) => {
            if (targetTab) setActiveSection(targetTab);
            setShowIntro(false);
          }}
        />
      )}

      {/* Main Rounded Architectural Frame — Identical to Intro Screen */}
      <div className="relative w-full h-dvh sm:h-[calc(100dvh-2rem)] sm:rounded-[28px] overflow-hidden sm:border border-white/15 shadow-2xl flex flex-col justify-between bg-[#5a6575]">
        {/* Persistent 4K Kölner Dom Interactive WebGL Background */}
        <Cologne3DScene phase="revealing" />

        {/* Atmospheric Dark Glass Veil */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80 pointer-events-none z-10" />

        {/* TOP BAR */}
        <header className="relative z-30 flex items-center justify-between px-3.5 sm:px-7 pt-3.5 sm:pt-5 pb-3 gap-2.5 border-b border-white/10 bg-black/35 backdrop-blur-md">
          {/* Brand Logo */}
          <div
            onClick={() => {
              soundEngine.playClick();
              setShowIntro(true);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-stone-950 cursor-pointer shadow-sm transition-all shrink-0"
            title="4K Kölner Dom Sahnesini Göster"
          >
            <KölnerDomLogo className="w-7 h-5" animated={false} />
            <span className="hidden sm:inline-block text-[11px] font-bold tracking-[0.16em] uppercase text-stone-950">
              KÖLNER DOM
            </span>
          </div>

          {/* Instant Search Input in Frosted Pill */}
          <div className="flex-1 max-w-md relative">
            <Search className="w-3.5 h-3.5 text-stone-300 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Almanca veya Türkçe kelime ara..."
              className="w-full h-9 pl-9 pr-4 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-xs text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-200/60 transition-colors"
            />
          </div>

          {/* Right Action Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <div className="hidden lg:inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-black/50 border border-white/15 text-[11px] font-medium tracking-wider text-amber-200 backdrop-blur-md">
              <span>Toplam {allWords.length.toLocaleString("tr-TR")} Almanca Kelime</span>
            </div>

            {/* Settings Button & Popover (Replaces Sound Button) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setSettingsOpen((prev) => !prev);
                }}
                title="Ayarlar"
                className={`w-9 h-9 rounded-full border flex items-center justify-center backdrop-blur-md transition-all cursor-pointer ${
                  settingsOpen
                    ? "bg-white text-stone-950 border-white shadow-md"
                    : "bg-black/50 hover:bg-white/20 border-white/15 text-white"
                }`}
              >
                <Settings className="w-4 h-4" />
              </button>

              {settingsOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setSettingsOpen(false)}
                  />
                  <div className="absolute right-0 mt-2.5 w-72 sm:w-80 rounded-2xl bg-[#0c0d10]/95 backdrop-blur-2xl border border-white/15 shadow-2xl p-4 space-y-3 z-50 animate-pop">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-300">
                        UYGULAMA AYARLARI
                      </span>
                    </div>

                    {/* Setting 1: Sound Effects */}
                    <button
                      type="button"
                      onClick={toggleSound}
                      className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {soundEnabled ? (
                          <Volume2 className="w-4 h-4 text-amber-300 shrink-0" />
                        ) : (
                          <VolumeX className="w-4 h-4 text-stone-400 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-white">
                            Ses Efektleri
                          </div>
                          <div className="text-[10px] text-stone-400 truncate">
                            Arayüz ve oyun sesleri
                          </div>
                        </div>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                          soundEnabled
                            ? "bg-emerald-400/20 text-emerald-200 border border-emerald-300/35"
                            : "bg-white/10 text-stone-400 border border-white/10"
                        }`}
                      >
                        {soundEnabled ? "Açık" : "Kapalı"}
                      </span>
                    </button>

                    {/* Setting 2: Special Spelling Helper Buttons (der/die/das & ä, ö, ü, ß) */}
                    <button
                      type="button"
                      onClick={toggleSpellingHelper}
                      className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Keyboard
                          className={`w-4 h-4 shrink-0 ${
                            spellingHelperEnabled
                              ? "text-sky-300"
                              : "text-stone-400"
                          }`}
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-white">
                            Yazım Yardımcı Tuşları
                          </div>
                          <div className="text-[10px] text-stone-400">
                            Kelime Yazma modunda der/die/das ve ä, ö, ü, ß tuşları
                          </div>
                        </div>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                          spellingHelperEnabled
                            ? "bg-emerald-400/20 text-emerald-200 border border-emerald-300/35"
                            : "bg-white/10 text-stone-400 border border-white/10"
                        }`}
                      >
                        {spellingHelperEnabled ? "Açık" : "Kapalı"}
                      </span>
                    </button>
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setBulkModalOpen(true);
              }}
              className="h-9 px-3.5 sm:px-4 rounded-full bg-white hover:bg-amber-50 active:scale-95 text-stone-950 text-[10px] sm:text-[11px] font-bold tracking-[0.12em] uppercase inline-flex items-center gap-1.5 shadow-md transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden md:inline">KELİME EKLE</span>
            </button>
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="relative z-20 flex-1 overflow-y-auto px-3.5 sm:px-7 py-5">
          {/* =============================================================== */}
          {/* SECTION 1: TÜM KELİMELER (MASTER CATALOG)                       */}
          {/* =============================================================== */}
          {activeSection === "catalog" && (
            <>
              <div className="mb-5 p-4 sm:p-5 rounded-2xl bg-black/45 backdrop-blur-md border border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-300">
                    1. BÖLÜM • TÜM KELİMELER • TOPLAM {allWords.length.toLocaleString("tr-TR")} ALMANCA KELİME
                  </div>
                  <h1 className="text-lg sm:text-2xl font-light tracking-[0.08em] uppercase text-white mt-0.5">
                    ALMANCA KELİME{" "}
                    <span className="font-semibold bg-gradient-to-r from-amber-200 via-white to-sky-200 bg-clip-text text-transparent">
                      KATALOĞU ({filteredWords.length.toLocaleString("tr-TR")})
                    </span>
                  </h1>
                  <p className="text-xs text-stone-300 mt-1">
                    Öğrenmek istediğiniz kelimeleri <strong>+ Öğrenmeye Ekle</strong>{" "}
                    ile çalışma alanınıza aktarın.
                  </p>
                </div>

                {/* Quick "Rastgele 10 Kelime Ekle" Button */}
                <button
                  type="button"
                  onClick={handleAddRandom10}
                  className="h-10 px-5 rounded-full bg-white hover:bg-amber-50 active:scale-95 text-stone-950 text-[11px] font-bold tracking-[0.14em] uppercase inline-flex items-center gap-2 shadow-md transition-all shrink-0 cursor-pointer"
                >
                  <Shuffle className="w-3.5 h-3.5 text-amber-600" />
                  <span>RASTGELE 10 KELİME EKLE</span>
                </button>
              </div>

              {filteredWords.length === 0 ? (
                <div className="p-12 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/15 text-center space-y-3 max-w-lg mx-auto my-8">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 text-amber-200 flex items-center justify-center mx-auto">
                    <Search className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold uppercase tracking-[0.14em] text-white">
                    Eşleşen Kelime Bulunamadı
                  </h3>
                  <p className="text-xs text-stone-300">
                    Arama kutusunu temizleyerek tüm kataloğu görüntüleyebilirsiniz.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {visibleWords.map((word) => (
                      <CatalogWordCard
                        key={word.id}
                        word={word}
                        status={getWordStatus(word.id)}
                        section="catalog"
                        customImageUrl={customImages[word.id]}
                        onSetStatus={handleSetWordStatus}
                        onEditImage={(w) => setEditingImageWord(w)}
                      />
                    ))}
                  </div>

                  {visibleLimit < filteredWords.length && (
                    <div className="mt-8 flex justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          soundEngine.playClick();
                          setVisibleLimit((prev) => prev + 48);
                        }}
                        className="h-10 px-6 rounded-full bg-white hover:bg-amber-50 text-stone-950 text-xs font-bold tracking-[0.14em] uppercase shadow-lg transition-all cursor-pointer"
                      >
                        DAHA FAZLA GÖSTER ({filteredWords.length - visibleLimit} KALDI)
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* =============================================================== */}
          {/* SECTION 2: ÖĞRENİLİYOR (ACTIVE STUDY & MINI-GAMES HUB)          */}
          {/* =============================================================== */}
          {activeSection === "studying" && (
            <>
              {/* Interactive Oyunlar ve Çalışma Modları (Games & Study Hub) Banner */}
              <div className="mb-5 p-4 sm:p-5 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/15 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-300">
                      2. BÖLÜM • OYUNLAR VE ÇALIŞMA MODLARI
                    </div>
                    <h1 className="text-lg sm:text-2xl font-light tracking-[0.08em] uppercase text-white mt-0.5">
                      ÖĞRENİLİYOR{" "}
                      <span className="font-semibold bg-gradient-to-r from-amber-200 via-white to-sky-200 bg-clip-text text-transparent">
                        ({studyingWords.length} KELİME)
                      </span>
                    </h1>
                  </div>

                  {studyingMode !== "cards" && (
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playClick();
                        setStudyingMode("cards");
                      }}
                      className="h-9 px-4 rounded-full bg-white/15 hover:bg-white text-white hover:text-stone-950 text-[11px] font-bold tracking-wider uppercase inline-flex items-center gap-1.5 transition-all"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      KELİME KARTLARINA DÖN
                    </button>
                  )}
                </div>

                {/* 5 Mode Pills: Kelime Listesi + 4 Interactive Mini-Games */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      setStudyingMode("cards");
                    }}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                      studyingMode === "cards"
                        ? "bg-white text-stone-950 border-white shadow-md font-bold"
                        : "bg-black/45 text-white border-white/15 hover:bg-white/15"
                    }`}
                  >
                    <BookOpen className="w-4 h-4 shrink-0 text-amber-400" />
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold uppercase tracking-wider truncate">
                        Çalışma Listesi
                      </div>
                      <div className="text-[10px] opacity-70 truncate">
                        {studyingWords.length} Kelime
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      setStudyingMode("flashcards");
                    }}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                      studyingMode === "flashcards"
                        ? "bg-white text-stone-950 border-white shadow-md font-bold"
                        : "bg-black/45 text-white border-white/15 hover:bg-white/15"
                    }`}
                  >
                    <Layers className="w-4 h-4 shrink-0 text-sky-400" />
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold uppercase tracking-wider truncate">
                        Kartlarla Çalış
                      </div>
                      <div className="text-[10px] opacity-70 truncate">
                        3D Quizlet Kartları
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      setStudyingMode("match");
                    }}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                      studyingMode === "match"
                        ? "bg-white text-stone-950 border-white shadow-md font-bold"
                        : "bg-black/45 text-white border-white/15 hover:bg-white/15"
                    }`}
                  >
                    <Grid className="w-4 h-4 shrink-0 text-emerald-400" />
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold uppercase tracking-wider truncate">
                        Eşleştirme
                      </div>
                      <div className="text-[10px] opacity-70 truncate">
                        6 Çift Hafıza Oyunu
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      setStudyingMode("multiple");
                    }}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                      studyingMode === "multiple"
                        ? "bg-white text-stone-950 border-white shadow-md font-bold"
                        : "bg-black/45 text-white border-white/15 hover:bg-white/15"
                    }`}
                  >
                    <HelpCircle className="w-4 h-4 shrink-0 text-amber-300" />
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold uppercase tracking-wider truncate">
                        4 Seçenekli Quiz
                      </div>
                      <div className="text-[10px] opacity-70 truncate">
                        Çoktan Seçmeli Test
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      setStudyingMode("spelling");
                    }}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 col-span-2 sm:col-span-1 ${
                      studyingMode === "spelling"
                        ? "bg-white text-stone-950 border-white shadow-md font-bold"
                        : "bg-black/45 text-white border-white/15 hover:bg-white/15"
                    }`}
                  >
                    <Keyboard className="w-4 h-4 shrink-0 text-rose-300" />
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold uppercase tracking-wider truncate">
                        Kelime Yazma
                      </div>
                      <div className="text-[10px] opacity-70 truncate">
                        ä, ö, ü, ß Klavyeli
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Empty State if No Words in Studying */}
              {studyingWords.length === 0 ? (
                <div className="p-12 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/15 text-center space-y-4 max-w-lg mx-auto my-8">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 text-amber-200 flex items-center justify-center mx-auto">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold uppercase tracking-[0.14em] text-white">
                    Çalışma Listenizde Henüz Kelime Yok
                  </h3>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Katalogdan istediğiniz kelimeleri <strong>+ Öğrenmeye Ekle</strong>{" "}
                    ile seçin veya hemen başlamak için rastgele 10 kelime ekleyin.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={handleAddRandom10}
                      className="h-10 px-5 rounded-full bg-white hover:bg-amber-50 text-stone-950 text-[11px] font-bold tracking-[0.14em] uppercase inline-flex items-center gap-2 shadow-md"
                    >
                      <Shuffle className="w-3.5 h-3.5 text-amber-600" />
                      RASTGELE 10 KELİME EKLE
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSection("catalog")}
                      className="h-10 px-5 rounded-full bg-white/15 hover:bg-white/25 text-white text-[11px] font-semibold tracking-[0.14em] uppercase inline-flex items-center gap-2 border border-white/15"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      KATALOĞA GİT
                    </button>
                  </div>
                </div>
              ) : studyingMode === "flashcards" ? (
                <FlashcardDeck
                  words={studyingWords}
                  customImages={customImages}
                  onSetStatus={handleSetWordStatus}
                  onEditImage={(w) => setEditingImageWord(w)}
                />
              ) : studyingMode === "match" ||
                studyingMode === "multiple" ||
                studyingMode === "spelling" ? (
                <QuizArena
                  allWords={allWords}
                  studyPool={studyingWords}
                  customImages={customImages}
                  quizStats={quizStats}
                  initialGameMode={studyingMode as StudyGameMode}
                  isRetentionTest={false}
                  spellingHelperEnabled={spellingHelperEnabled}
                  onUpdateStats={handleUpdateQuizStats}
                  onSetStatus={handleSetWordStatus}
                  onBatchSetStatus={handleBatchSetStatus}
                />
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {visibleWords.map((word) => (
                      <CatalogWordCard
                        key={word.id}
                        word={word}
                        status="studying"
                        section="studying"
                        customImageUrl={customImages[word.id]}
                        onSetStatus={handleSetWordStatus}
                        onEditImage={(w) => setEditingImageWord(w)}
                      />
                    ))}
                  </div>
                  {visibleLimit < filteredWords.length && (
                    <div className="mt-8 flex justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          soundEngine.playClick();
                          setVisibleLimit((prev) => prev + 48);
                        }}
                        className="h-10 px-6 rounded-full bg-white hover:bg-amber-50 text-stone-950 text-xs font-bold tracking-[0.14em] uppercase shadow-lg transition-all cursor-pointer"
                      >
                        DAHA FAZLA GÖSTER ({filteredWords.length - visibleLimit} KALDI)
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* =============================================================== */}
          {/* SECTION 3: ÖĞRENİLENLER (MASTERED ARCHIVE & FINAL TEST)         */}
          {/* =============================================================== */}
          {activeSection === "learned" && (
            <>
              <div className="mb-5 p-4 sm:p-5 rounded-2xl bg-black/45 backdrop-blur-md border border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-300">
                    3. BÖLÜM • ÖĞRENİLENLER (EZBERLENENLER ARŞİVİ)
                  </div>
                  <h1 className="text-lg sm:text-2xl font-light tracking-[0.08em] uppercase text-white mt-0.5">
                    EZBERLENEN{" "}
                    <span className="font-semibold bg-gradient-to-r from-amber-200 via-white to-sky-200 bg-clip-text text-transparent">
                      KELİMELER ({learnedWords.length})
                    </span>
                  </h1>
                  <p className="text-xs text-stone-300 mt-1">
                    Genel Tekrar Testinde unuttuğunuz kelimeler otomatik olarak{" "}
                    <strong>Öğreniliyor</strong> bölümüne geri taşınır.
                  </p>
                </div>

                {learnedWords.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      setLearnedTestActive((v) => !v);
                    }}
                    className="h-10 px-5 rounded-full bg-white hover:bg-amber-50 active:scale-95 text-stone-950 text-[11px] font-bold tracking-[0.14em] uppercase inline-flex items-center gap-2 shadow-md shrink-0 cursor-pointer"
                  >
                    <Trophy className="w-3.5 h-3.5 text-amber-600" />
                    <span>
                      {learnedTestActive
                        ? "ARŞİV LİSTESİNE DÖN"
                        : "GENEL TEKRAR TESTİ"}
                    </span>
                  </button>
                )}
              </div>

              {learnedWords.length === 0 ? (
                <div className="p-12 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/15 text-center space-y-3 max-w-lg mx-auto my-8">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 text-amber-200 flex items-center justify-center mx-auto">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold uppercase tracking-[0.14em] text-white">
                    Henüz Ezberlenen Kelime Yok
                  </h3>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    <strong>Öğreniliyor</strong> bölümündeki kelimelerde veya
                    oyunlarda <strong>✓ Öğrendim</strong> düğmesine tıklayarak
                    kelimeleri buraya mezun edebilirsiniz.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveSection("studying")}
                    className="h-9 px-5 rounded-full bg-white text-stone-950 text-[11px] font-bold tracking-[0.14em] uppercase inline-flex items-center gap-2 shadow-md"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    ÇALIŞMA ALANINA GİT
                  </button>
                </div>
              ) : learnedTestActive ? (
                <QuizArena
                  allWords={allWords}
                  studyPool={learnedWords}
                  customImages={customImages}
                  quizStats={quizStats}
                  initialGameMode="multiple"
                  isRetentionTest={true}
                  spellingHelperEnabled={spellingHelperEnabled}
                  onUpdateStats={handleUpdateQuizStats}
                  onSetStatus={handleSetWordStatus}
                  onBatchSetStatus={handleBatchSetStatus}
                />
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {visibleWords.map((word) => (
                      <CatalogWordCard
                        key={word.id}
                        word={word}
                        status="learned"
                        section="learned"
                        customImageUrl={customImages[word.id]}
                        onSetStatus={handleSetWordStatus}
                        onEditImage={(w) => setEditingImageWord(w)}
                      />
                    ))}
                  </div>
                  {visibleLimit < filteredWords.length && (
                    <div className="mt-8 flex justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          soundEngine.playClick();
                          setVisibleLimit((prev) => prev + 48);
                        }}
                        className="h-10 px-6 rounded-full bg-white hover:bg-amber-50 text-stone-950 text-xs font-bold tracking-[0.14em] uppercase shadow-lg transition-all cursor-pointer"
                      >
                        DAHA FAZLA GÖSTER ({filteredWords.length - visibleLimit} KALDI)
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </main>

        {/* BOTTOM DOCK NAVIGATION — STRICT 3-SECTION SYSTEM */}
        <footer className="relative z-30 px-2.5 sm:px-8 py-2.5 sm:py-3 border-t border-white/10 bg-black/55 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Left Status Pill */}
          <div
            onClick={() => {
              soundEngine.playClick();
              setShowIntro(true);
            }}
            className="hidden sm:flex items-center gap-3 rounded-xl bg-black/50 backdrop-blur-md border border-white/15 px-3.5 py-1.5 cursor-pointer hover:border-white/35 transition-all"
          >
            <div>
              <div className="text-[9px] font-mono uppercase tracking-wider text-amber-300">
                KÖLNER DOM • 3 AŞAMALI SİSTEM
              </div>
              <div className="text-[11px] font-semibold text-white">
                {allWords.length} Katalog • {studyingWords.length} Öğreniliyor •{" "}
                {learnedWords.length} Öğrenildi
              </div>
            </div>
          </div>

          {/* Center 3 Section Tabs */}
          <div className="w-full sm:w-auto grid grid-cols-3 sm:flex items-center justify-center gap-1.5 bg-black/60 backdrop-blur-md p-1 sm:px-2 sm:py-1.5 rounded-2xl sm:rounded-full border border-white/15">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setActiveSection("catalog");
              }}
              className={`h-9 px-2 sm:px-5 rounded-xl sm:rounded-full text-[10px] sm:text-[11px] font-bold tracking-wider uppercase truncate transition-all cursor-pointer ${
                activeSection === "catalog"
                  ? "bg-white text-stone-950 shadow-sm"
                  : "bg-white/15 hover:bg-white/30 text-white"
              }`}
            >
              TÜM KELİMELER ({allWords.length})
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setActiveSection("studying");
              }}
              className={`h-9 px-2 sm:px-5 rounded-xl sm:rounded-full text-[10px] sm:text-[11px] font-bold tracking-wider uppercase truncate transition-all cursor-pointer ${
                activeSection === "studying"
                  ? "bg-white text-stone-950 shadow-sm"
                  : "bg-white/15 hover:bg-white/30 text-white"
              }`}
            >
              ÖĞRENİLİYOR ({studyingWords.length})
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setActiveSection("learned");
                setLearnedTestActive(false);
              }}
              className={`h-9 px-2 sm:px-5 rounded-xl sm:rounded-full text-[10px] sm:text-[11px] font-bold tracking-wider uppercase truncate transition-all cursor-pointer inline-flex items-center justify-center gap-1 ${
                activeSection === "learned"
                  ? "bg-white text-stone-950 shadow-sm"
                  : "bg-white/15 hover:bg-white/30 text-white"
              }`}
            >
              <Check className="w-3.5 h-3.5 hidden sm:inline shrink-0" />
              <span className="truncate">ÖĞRENİLENLER ({learnedWords.length})</span>
            </button>
          </div>

          {/* Right Audio Indicator */}
          <div className="hidden lg:flex items-center gap-2 text-white/80 text-xs">
            <Volume2 className="w-4 h-4 text-amber-200" />
            <span className="tracking-wider uppercase text-[10px] font-mono">
              DE-DE TELAFFUZ
            </span>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <ImageOverrideModal
        word={editingImageWord}
        currentCustomUrl={
          editingImageWord ? customImages[editingImageWord.id] : undefined
        }
        onClose={() => setEditingImageWord(null)}
        onSaveUrl={handleSaveCustomImage}
      />

      <BulkImportModal
        isOpen={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
        onImportWords={handleBulkImport}
      />
    </div>
  );
}
