import { ArticleType, VocabWord } from "@/types/vocab";

export interface GenderStyle {
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  cardBorderHover: string;
  accentText: string;
  dotColor: string;
  gradientFallback: string;
  glowColor: string;
  labelTr: string;
}

export const GENDER_STYLES: Record<ArticleType, GenderStyle> = {
  der: {
    badgeBg: "bg-sky-400/15",
    badgeText: "text-sky-200",
    badgeBorder: "border-sky-300/30",
    cardBorderHover: "hover:border-sky-300/40",
    accentText: "text-sky-200",
    dotColor: "bg-sky-300",
    gradientFallback: "from-sky-400/20 via-stone-900/40 to-black/60",
    glowColor: "rgba(186, 230, 253, 0.16)",
    labelTr: "Eril (der)",
  },
  die: {
    badgeBg: "bg-rose-400/15",
    badgeText: "text-rose-200",
    badgeBorder: "border-rose-300/30",
    cardBorderHover: "hover:border-rose-300/40",
    accentText: "text-rose-200",
    dotColor: "bg-rose-300",
    gradientFallback: "from-rose-400/20 via-stone-900/40 to-black/60",
    glowColor: "rgba(254, 205, 211, 0.16)",
    labelTr: "Dişil (die)",
  },
  das: {
    badgeBg: "bg-amber-300/15",
    badgeText: "text-amber-200",
    badgeBorder: "border-amber-300/30",
    cardBorderHover: "hover:border-amber-200/45",
    accentText: "text-amber-200",
    dotColor: "bg-amber-300",
    gradientFallback: "from-amber-300/20 via-stone-900/40 to-black/60",
    glowColor: "rgba(253, 230, 138, 0.18)",
    labelTr: "Nötr (das)",
  },
  none: {
    badgeBg: "bg-white/10",
    badgeText: "text-stone-200",
    badgeBorder: "border-white/20",
    cardBorderHover: "hover:border-white/35",
    accentText: "text-stone-200",
    dotColor: "bg-stone-300",
    gradientFallback: "from-stone-400/20 via-stone-900/40 to-black/60",
    glowColor: "rgba(231, 229, 228, 0.14)",
    labelTr: "Fiil / Sıfat",
  },
};

export function parseWordArticle(wordOrText: VocabWord | string): {
  article: ArticleType;
  baseGerman: string;
  fullGerman: string;
} {
  if (typeof wordOrText === "string") {
    const trimmed = wordOrText.trim();
    const lower = trimmed.toLowerCase();
    if (lower.startsWith("der ")) {
      return { article: "der", baseGerman: trimmed.slice(4), fullGerman: trimmed };
    }
    if (lower.startsWith("die ")) {
      return { article: "die", baseGerman: trimmed.slice(4), fullGerman: trimmed };
    }
    if (lower.startsWith("das ")) {
      return { article: "das", baseGerman: trimmed.slice(4), fullGerman: trimmed };
    }
    if (trimmed === "der" || trimmed === "die" || trimmed === "das") {
      return { article: trimmed, baseGerman: trimmed, fullGerman: trimmed };
    }
    return { article: "none", baseGerman: trimmed, fullGerman: trimmed };
  }

  if (wordOrText.article && wordOrText.article !== "none") {
    const lower = wordOrText.german.toLowerCase();
    const prefix = `${wordOrText.article} `;
    const base = lower.startsWith(prefix)
      ? wordOrText.german.slice(prefix.length)
      : wordOrText.german;
    return {
      article: wordOrText.article,
      baseGerman: base,
      fullGerman: `${wordOrText.article} ${base}`,
    };
  }

  return parseWordArticle(wordOrText.german);
}

export function getGenderStyle(
  input?: ArticleType | VocabWord | string
): GenderStyle {
  if (!input) return GENDER_STYLES.none;
  if (input === "der" || input === "die" || input === "das" || input === "none") {
    return GENDER_STYLES[input];
  }
  const { article } = parseWordArticle(input);
  return GENDER_STYLES[article] || GENDER_STYLES.none;
}
