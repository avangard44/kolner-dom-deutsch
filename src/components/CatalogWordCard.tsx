"use client";

import React, { useState } from "react";
import { VocabWord, WordStatus } from "@/types/vocab";
import { getGenderStyle, parseWordArticle } from "@/lib/gender";
import { speakGerman, soundEngine } from "@/lib/audio";
import { WordCardImage } from "./WordCardImage";
import {
  Volume2,
  Check,
  Plus,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Eye,
  EyeOff,
  RotateCcw,
  X,
} from "lucide-react";

interface CatalogWordCardProps {
  word: VocabWord;
  status: WordStatus;
  section: "catalog" | "studying" | "learned";
  customImageUrl?: string;
  onSetStatus: (wordId: string, nextStatus: WordStatus) => void;
  onEditImage: (word: VocabWord) => void;
}

export function CatalogWordCard({
  word,
  status,
  section,
  customImageUrl,
  onSetStatus,
  onEditImage,
}: CatalogWordCardProps) {
  const [showTranslation, setShowTranslation] = useState(false);
  const [showExamples, setShowExamples] = useState(false);

  const { article, baseGerman, fullGerman } = parseWordArticle(word);
  const genderStyle = getGenderStyle(article);

  const handleSpeak = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    speakGerman(text);
  };

  return (
    <div
      className={`group relative flex flex-col rounded-2xl border p-4 transition-all duration-300 backdrop-blur-xl shadow-xl ${
        status === "learned"
          ? "bg-amber-950/30 border-amber-300/35 shadow-[0_12px_32px_rgba(0,0,0,0.5)]"
          : status === "studying" && section === "catalog"
          ? "bg-sky-950/25 border-sky-300/35 shadow-[0_12px_32px_rgba(0,0,0,0.5)]"
          : `bg-black/50 border-white/15 ${genderStyle.cardBorderHover} hover:bg-black/65 shadow-[0_10px_28px_rgba(0,0,0,0.45)]`
      }`}
    >
      {/* Top Meta Bar: Colored Article Pill + Theme */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {article !== "none" ? (
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-[0.1em] uppercase border ${genderStyle.badgeBg} ${genderStyle.badgeText} ${genderStyle.badgeBorder}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${genderStyle.dotColor}`}
              />
              {article}
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-[0.1em] uppercase bg-white/10 text-stone-300 border border-white/15">
              Kelime
            </span>
          )}
          <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 truncate max-w-[130px]">
            {word.theme}
          </span>
        </div>

        {/* In "studying" section, quick button to remove back to catalog */}
        {section === "studying" && (
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onSetStatus(word.id, "catalog");
            }}
            title="Çalışma Listesinden Çıkar"
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-rose-500/25 text-stone-300 hover:text-rose-200 border border-white/15 flex items-center justify-center transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Image Frame */}
      <WordCardImage
        word={word}
        customImageUrl={customImageUrl}
        onEditImage={onEditImage}
        size="sm"
      />

      {/* German Word + Audio Pronunciation Button */}
      <div className="mt-3.5 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            {article !== "none" && (
              <span className={`text-xs font-semibold ${genderStyle.accentText}`}>
                {article}
              </span>
            )}
            <h3 className="text-base sm:text-lg font-semibold tracking-tight text-white truncate">
              {baseGerman}
            </h3>
          </div>
          {word.plural && (
            <p className="text-[11px] text-stone-400 font-mono">
              Çoğul: <span className="text-stone-300">{word.plural}</span>
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => handleSpeak(fullGerman, e)}
          title="Almanca Telaffuz (de-DE)"
          className="shrink-0 w-8 h-8 rounded-full bg-white/15 hover:bg-white text-white hover:text-stone-950 border border-white/15 flex items-center justify-center transition-all active:scale-95"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Expandable Toggle 1: Turkish Translation ("Çeviriyi Göster") */}
      <div className="mt-3 pt-2.5 border-t border-white/10">
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            setShowTranslation((v) => !v);
          }}
          className="w-full flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-300 hover:text-white transition-colors"
        >
          <span className="inline-flex items-center gap-1.5">
            {showTranslation ? (
              <EyeOff className="w-3.5 h-3.5 text-amber-300" />
            ) : (
              <Eye className="w-3.5 h-3.5 text-amber-300" />
            )}
            {showTranslation ? "ÇEVİRİYİ GİZLE" : "ÇEVİRİYİ GÖSTER"}
          </span>
          {showTranslation ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>

        {showTranslation && (
          <div className="mt-2 px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-sm font-semibold text-amber-100 animate-pop">
            {word.turkish}
          </div>
        )}
      </div>

      {/* Expandable Toggle 2: Example Sentences ("Örnek Cümleler") */}
      <div className="mt-2 pt-2 border-t border-white/10">
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            setShowExamples((v) => !v);
          }}
          className="w-full flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-400 hover:text-white transition-colors"
        >
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-300" />
            ÖRNEK CÜMLELER ({word.examples.length})
          </span>
          {showExamples ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>

        {showExamples && (
          <div className="mt-2 space-y-2 animate-pop">
            {word.examples.map((ex, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-black/55 border border-white/10 text-xs space-y-1"
              >
                <div className="flex items-start justify-between gap-1.5">
                  <p className="font-medium text-white leading-snug">{ex.de}</p>
                  <button
                    type="button"
                    onClick={(e) => handleSpeak(ex.de, e)}
                    className="shrink-0 p-1 rounded-full bg-white/10 text-stone-300 hover:bg-white hover:text-stone-950 transition-colors"
                    title="Cümleyi Dinle"
                  >
                    <Volume2 className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-stone-400 text-[11px]">{ex.tr}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Primary Bottom Action Button per Section */}
      <div className="mt-auto pt-3.5">
        {section === "catalog" && (
          <>
            {status === "catalog" && (
              <button
                type="button"
                onClick={() => {
                  soundEngine.playSuccess();
                  onSetStatus(word.id, "studying");
                }}
                className="w-full h-9 px-3 rounded-full bg-white hover:bg-amber-50 active:scale-95 text-stone-950 text-[11px] font-bold tracking-[0.12em] uppercase inline-flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>+ ÖĞRENMEYE EKLE</span>
              </button>
            )}

            {status === "studying" && (
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  onSetStatus(word.id, "catalog");
                }}
                className="w-full h-9 px-3 rounded-full bg-sky-400/20 hover:bg-sky-400/30 border border-sky-300/40 text-sky-100 text-[11px] font-bold tracking-[0.12em] uppercase inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer animate-pop"
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5] text-sky-300" />
                <span>✓ ÇALIŞMA LİSTESİNDE</span>
              </button>
            )}

            {status === "learned" && (
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  onSetStatus(word.id, "studying");
                }}
                className="w-full h-9 px-3 rounded-full bg-amber-300/20 hover:bg-amber-300/30 border border-amber-300/40 text-amber-100 text-[11px] font-bold tracking-[0.12em] uppercase inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5] text-amber-300" />
                <span>✓ ÖĞRENİLDİ</span>
              </button>
            )}
          </>
        )}

        {section === "studying" && (
          <button
            type="button"
            onClick={() => {
              soundEngine.playSuccess();
              onSetStatus(word.id, "learned");
            }}
            className="w-full h-9 px-3 rounded-full bg-white hover:bg-amber-50 active:scale-95 text-stone-950 text-[11px] font-bold tracking-[0.12em] uppercase inline-flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>✓ ÖĞRENDİM</span>
          </button>
        )}

        {section === "learned" && (
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onSetStatus(word.id, "studying");
            }}
            className="w-full h-9 px-3 rounded-full bg-white/15 hover:bg-white text-white hover:text-stone-950 border border-white/20 text-[11px] font-bold tracking-[0.12em] uppercase inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>TEKRAR ÇALIŞ</span>
          </button>
        )}
      </div>
    </div>
  );
}
