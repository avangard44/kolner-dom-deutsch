"use client";

import React, { useEffect, useState } from "react";
import { VocabWord } from "@/types/vocab";
import { fetchWikiThumbnail } from "@/lib/wikiImage";
import { getGenderStyle, parseWordArticle } from "@/lib/gender";
import { Camera } from "lucide-react";

interface WordCardImageProps {
  word: VocabWord;
  customImageUrl?: string;
  onEditImage?: (word: VocabWord) => void;
  size?: "sm" | "md" | "lg";
}

export function WordCardImage({
  word,
  customImageUrl,
  onEditImage,
  size = "md",
}: WordCardImageProps) {
  const [wikiUrl, setWikiUrl] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const [loading, setLoading] = useState(true);

  const genderStyle = getGenderStyle(word);
  const { article, baseGerman } = parseWordArticle(word);

  useEffect(() => {
    let isMounted = true;
    setImgError(false);

    if (customImageUrl) {
      setWikiUrl(customImageUrl);
      setLoading(false);
      return;
    }

    if (word.customImageUrl || word.imageUrl) {
      setWikiUrl(word.customImageUrl || word.imageUrl || null);
      setLoading(false);
      return;
    }

    const query = word.wikiSearchTerm || word.german;
    setLoading(true);
    fetchWikiThumbnail(query).then((url: string | null) => {
      if (!isMounted) return;
      setWikiUrl(url);
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [
    word.id,
    word.german,
    word.wikiSearchTerm,
    word.customImageUrl,
    word.imageUrl,
    customImageUrl,
  ]);

  const heightClass =
    size === "sm"
      ? "h-24"
      : size === "lg"
      ? "h-32 sm:h-48"
      : "h-28 sm:h-36";

  const showImage = wikiUrl && !imgError;

  return (
    <div
      className={`relative w-full ${heightClass} overflow-hidden rounded-xl bg-gradient-to-br ${genderStyle.gradientFallback} border border-white/15 group select-none flex items-center justify-center`}
    >
      {/* Subtle architectural vignette */}
      <div
        className="pointer-events-none absolute inset-0 opacity-80 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${genderStyle.glowColor} 0%, transparent 72%)`,
        }}
      />

      {showImage ? (
        <>
          <img
            src={wikiUrl}
            alt={word.german}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent pointer-events-none" />
        </>
      ) : (
        <div className="relative z-10 flex flex-col items-center justify-center px-3 text-center">
          <span
            className={`${
              size === "lg"
                ? "text-4xl sm:text-5xl"
                : size === "sm"
                ? "text-2xl"
                : "text-3xl"
            } font-extralight tracking-[0.22em] uppercase text-white/80 select-none transition-transform duration-300 group-hover:scale-105`}
          >
            {baseGerman.slice(0, 2)}
          </span>
          <span className="mt-1 text-[9px] font-mono uppercase tracking-[0.22em] text-white/45 truncate max-w-[160px]">
            {article !== "none" ? `${article} ${baseGerman}` : baseGerman}
          </span>
        </div>
      )}

      {loading && !showImage && (
        <div className="absolute inset-0 bg-white/5 animate-pulse pointer-events-none" />
      )}

      {onEditImage && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEditImage(word);
          }}
          title="Görseli Değiştir"
          className="absolute top-2 right-2 z-20 opacity-85 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200 p-1.5 rounded-full bg-black/60 hover:bg-white text-white hover:text-stone-950 backdrop-blur-md border border-white/20 shadow-md"
        >
          <Camera className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
