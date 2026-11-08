"use client";

import React, { useState, useEffect, useCallback } from "react";
import { VocabWord, WordStatus } from "@/types/vocab";
import { getGenderStyle, parseWordArticle } from "@/lib/gender";
import { speakGerman, soundEngine } from "@/lib/audio";
import { WordCardImage } from "./WordCardImage";
import {
  RotateCw,
  Volume2,
  Check,
  Shuffle,
  RotateCcw,
} from "lucide-react";

interface FlashcardDeckProps {
  words: VocabWord[];
  customImages: Record<string, string>;
  onSetStatus: (wordId: string, status: WordStatus) => void;
  onEditImage: (word: VocabWord) => void;
}

export function FlashcardDeck({
  words,
  customImages,
  onSetStatus,
  onEditImage,
}: FlashcardDeckProps) {
  const [deck, setDeck] = useState<VocabWord[]>(words);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    setDeck(words);
    setCurrentIndex((prev) =>
      words.length === 0 ? 0 : Math.min(prev, words.length - 1)
    );
    setIsFlipped(false);
  }, [words]);

  const currentWord = deck[currentIndex];

  const handleFlip = useCallback(() => {
    soundEngine.playFlip();
    setIsFlipped((prev) => !prev);
  }, []);

  const handleRepeat = useCallback(() => {
    if (deck.length === 0) return;
    soundEngine.playClick();
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % deck.length);
  }, [deck.length]);

  const handleGraduated = useCallback(() => {
    if (!currentWord) return;
    soundEngine.playSuccess();
    setIsFlipped(false);
    onSetStatus(currentWord.id, "learned");
  }, [currentWord, onSetStatus]);

  const handleShuffle = () => {
    soundEngine.playClick();
    const copy = [...deck];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    setDeck(copy);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }
      if (e.code === "Space") {
        e.preventDefault();
        handleFlip();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        handleGraduated();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        handleRepeat();
      } else if (e.key.toLowerCase() === "s" && currentWord) {
        e.preventDefault();
        const { fullGerman } = parseWordArticle(currentWord);
        speakGerman(fullGerman);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleFlip, handleGraduated, handleRepeat, currentWord]);

  if (!currentWord) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center bg-black/50 backdrop-blur-xl rounded-2xl border border-white/15 p-8">
        <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 text-amber-200 flex items-center justify-center mb-3">
          <Check className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold tracking-wider uppercase text-white">
          Çalışma Listesindeki Tüm Kartlar Tamamlandı!
        </h3>
        <p className="text-xs text-stone-300 mt-1 max-w-sm">
          Tüm Kelimeler (Katalog) bölümünden yeni kelimeler ekleyebilirsiniz.
        </p>
      </div>
    );
  }

  const { article, baseGerman, fullGerman } = parseWordArticle(currentWord);
  const genderStyle = getGenderStyle(article);
  const progressPct = Math.round(((currentIndex + 1) / deck.length) * 100);

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center">
      {/* Top Progress & Controls */}
      <div className="w-full flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/15 text-[11px] font-mono text-amber-200 tracking-wider">
            {currentIndex + 1} / {deck.length}
          </span>
          <span className="text-xs font-mono uppercase tracking-wider text-stone-300">
            {currentWord.theme}
          </span>
        </div>

        <button
          type="button"
          onClick={handleShuffle}
          className="h-8 px-3.5 rounded-full bg-black/55 hover:bg-white/20 text-white text-[11px] font-semibold tracking-[0.14em] uppercase border border-white/15 inline-flex items-center gap-1.5 backdrop-blur-md transition-all"
        >
          <Shuffle className="w-3.5 h-3.5 text-amber-300" />
          KARIŞTIR
        </button>
      </div>

      {/* Thin Glass Progress Bar */}
      <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden mb-5 border border-white/10">
        <div
          className="h-full bg-gradient-to-r from-amber-200 via-white to-sky-200 transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* 3D Flip Card with Swipe Support */}
      <div
        onClick={handleFlip}
        onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchStartX === null) return;
          const deltaX = e.changedTouches[0].clientX - touchStartX;
          setTouchStartX(null);
          if (deltaX > 65) {
            handleGraduated();
          } else if (deltaX < -65) {
            handleRepeat();
          }
        }}
        className="w-full h-[360px] sm:h-[440px] perspective-1000 cursor-pointer select-none"
      >
        <div
          className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {/* FRONT FACE */}
          <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl bg-black/55 backdrop-blur-2xl border border-white/15 shadow-2xl p-4 sm:p-7 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              {article !== "none" ? (
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border ${genderStyle.badgeBg} ${genderStyle.badgeText} ${genderStyle.badgeBorder}`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${genderStyle.dotColor}`}
                  />
                  {genderStyle.labelTr}
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-white/10 text-stone-200 border border-white/15">
                  Kelime
                </span>
              )}

              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                SOLA KAYDIR: TEKRAR • SAĞA KAYDIR: ÖĞRENDİM
              </span>
            </div>

            <div className="my-2">
              <WordCardImage
                word={currentWord}
                customImageUrl={customImages[currentWord.id]}
                onEditImage={onEditImage}
                size="lg"
              />
            </div>

            <div className="text-center space-y-1.5">
              <div className="flex items-center justify-center gap-2.5">
                <h2 className="text-2xl sm:text-4xl font-light tracking-[0.06em] text-white">
                  {article !== "none" && (
                    <span className={`${genderStyle.accentText} mr-2 font-normal`}>
                      {article}
                    </span>
                  )}
                  <span className="font-semibold">{baseGerman}</span>
                </h2>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    speakGerman(fullGerman);
                  }}
                  className="w-10 h-10 rounded-full bg-white text-stone-950 hover:bg-amber-100 flex items-center justify-center transition-transform active:scale-95 shadow-md"
                  title="Almanca Seslendir"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {currentWord.plural && (
                <p className="text-xs font-mono text-stone-300">
                  Çoğul: <span className="text-amber-200">{currentWord.plural}</span>
                </p>
              )}
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-stone-300 pt-1">
              <RotateCw className="w-3 h-3 text-amber-300" />
              <span>TÜRKÇE ANLAMI İÇİN KARTA DOKUNUN (SPACE)</span>
            </div>
          </div>

          {/* BACK FACE */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl bg-black/70 backdrop-blur-2xl border border-amber-200/30 shadow-2xl p-4 sm:p-8 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5 sm:pb-3">
              <div className="min-w-0">
                <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.18em] text-amber-300">
                  TÜRKÇE ANLAMI
                </span>
                <h3 className="text-lg sm:text-3xl font-semibold text-white mt-0.5 truncate">
                  {currentWord.turkish}
                </h3>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  speakGerman(fullGerman);
                }}
                className="shrink-0 flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white text-stone-950 text-[10px] sm:text-xs font-bold tracking-wider uppercase shadow-md"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span className="truncate max-w-[110px] sm:max-w-none">{fullGerman}</span>
              </button>
            </div>

            <div
              className="space-y-2 sm:space-y-3 my-auto py-2 overflow-y-auto max-h-[195px] sm:max-h-none"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.18em] text-stone-300">
                ÖRNEK CÜMLELER & TELAFFUZ
              </div>
              {currentWord.examples.map((ex, i) => (
                <div
                  key={i}
                  className="p-2.5 sm:p-3.5 rounded-xl bg-black/50 border border-white/15 space-y-1"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs sm:text-sm font-medium text-white leading-snug">{ex.de}</p>
                    <button
                      type="button"
                      onClick={() => speakGerman(ex.de)}
                      className="shrink-0 p-1.5 rounded-full bg-white/15 text-white hover:bg-white hover:text-stone-950 transition-colors"
                      title="Cümleyi Dinle"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] sm:text-xs text-stone-300">{ex.tr}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.14em] text-stone-400 border-t border-white/10 pt-2.5">
              <span className="truncate">Kategori: {currentWord.theme}</span>
              <span>Ön yüz için dokunun</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quizlet-style Action Buttons: Tekrar Et (Left) | Çevir (Center) | Öğrendim (Right) */}
      <div className="mt-4 sm:mt-5 grid grid-cols-3 sm:flex items-center justify-center gap-2 sm:gap-3 w-full">
        <button
          type="button"
          onClick={handleRepeat}
          className="h-11 px-3 sm:px-6 rounded-full bg-black/55 backdrop-blur-md border border-white/15 hover:bg-white/20 text-white text-[10px] sm:text-[11px] font-bold tracking-[0.12em] uppercase inline-flex items-center justify-center gap-1.5 transition-all active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5 text-sky-300 shrink-0" />
          <span>TEKRAR ET</span>
        </button>

        <button
          type="button"
          onClick={handleFlip}
          className="h-11 px-3 sm:px-6 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white text-[10px] sm:text-[11px] font-bold tracking-[0.12em] uppercase inline-flex items-center justify-center gap-1.5 transition-all active:scale-95"
        >
          <RotateCw className="w-3.5 h-3.5 shrink-0" />
          <span>ÇEVİR</span>
        </button>

        <button
          type="button"
          onClick={handleGraduated}
          className="h-11 px-3 sm:px-6 rounded-full bg-white hover:bg-amber-50 text-stone-950 text-[10px] sm:text-[11px] font-bold tracking-[0.12em] uppercase inline-flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
        >
          <Check className="w-4 h-4 stroke-[2.5] text-emerald-700 shrink-0" />
          <span>✓ ÖĞRENDİM</span>
        </button>
      </div>
    </div>
  );
}
