"use client";

import React, { useState } from "react";
import { VocabWord, ArticleType, PartOfSpeech } from "@/types/vocab";
import { soundEngine } from "@/lib/audio";
import {
  X,
  Check,
  RotateCcw,
  Plus,
  Trash2,
  Image as ImageIcon,
  Upload,
} from "lucide-react";

interface ImageModalProps {
  word: VocabWord | null;
  currentCustomUrl?: string;
  onClose: () => void;
  onSaveUrl: (wordId: string, url: string | null) => void;
}

export function ImageOverrideModal({
  word,
  currentCustomUrl,
  onClose,
  onSaveUrl,
}: ImageModalProps) {
  const [urlInput, setUrlInput] = useState(currentCustomUrl || "");

  if (!word) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === "string") {
        setUrlInput(ev.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="w-full max-w-md rounded-2xl bg-[#0c0d10]/95 backdrop-blur-2xl border border-white/15 shadow-2xl p-6 space-y-4 animate-pop">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-amber-300">
              GÖRSEL ÖZELLEŞTİRME
            </span>
            <h3 className="text-base font-semibold text-white">
              {word.article && word.article !== "none" ? `${word.article} ` : ""}
              {word.german} ({word.turkish})
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 text-stone-300 hover:bg-white hover:text-stone-950 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5">
          <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-300">
            Özel Görsel URL Adresi veya Bilgisayardan Seç
          </label>
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://ornek.com/gorsel.jpg"
            className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-black/60 text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-200/60"
          />
          <label className="w-full px-3 py-2 rounded-xl border border-dashed border-white/20 bg-white/5 hover:bg-white/10 text-xs font-medium text-amber-200 flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span>Bilgisayardan Görsel Yükle</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          <p className="text-[11px] text-stone-400">
            Boş bırakırsanız Wikipedia otomatik görseli kullanılır.
          </p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onSaveUrl(word.id, null);
              onClose();
            }}
            className="px-3.5 py-2 rounded-full text-xs font-medium text-stone-300 hover:bg-white/10 inline-flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Varsayılana Dön
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-medium text-stone-300 hover:bg-white/10 transition-colors"
            >
              İptal
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playSuccess();
                onSaveUrl(word.id, urlInput.trim() || null);
                onClose();
              }}
              className="px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase bg-white hover:bg-amber-50 text-stone-950 inline-flex items-center gap-1.5 transition-colors shadow-md"
            >
              <Check className="w-3.5 h-3.5" />
              KAYDET
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportWords: (words: VocabWord[], addToStudying?: boolean) => void;
}

export function BulkImportModal({
  isOpen,
  onClose,
  onImportWords,
}: BulkImportModalProps) {
  const [article, setArticle] = useState<ArticleType>("der");
  const [germanInput, setGermanInput] = useState("");
  const [pluralInput, setPluralInput] = useState("");
  const [turkishInput, setTurkishInput] = useState("");
  const [themeInput, setThemeInput] = useState("Günlük Yaşam");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [wikiTermInput, setWikiTermInput] = useState("");
  const [addToStudying, setAddToStudying] = useState(true);
  const [examples, setExamples] = useState<{ de: string; tr: string }[]>([
    { de: "", tr: "" },
  ]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === "string") {
        setImageUrlInput(ev.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddExampleRow = () => {
    soundEngine.playClick();
    setExamples((prev) => [...prev, { de: "", tr: "" }]);
  };

  const handleRemoveExampleRow = (idx: number) => {
    soundEngine.playClick();
    setExamples((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleExampleChange = (
    idx: number,
    field: "de" | "tr",
    val: string
  ) => {
    setExamples((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: val } : item))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    let cleanGerman = germanInput.trim();
    const cleanTurkish = turkishInput.trim();

    if (!cleanGerman || !cleanTurkish) {
      setErrorMsg("Lütfen en az Almanca kelimeyi ve Türkçe anlamını yazın.");
      return;
    }

    // Strip leading article if user typed it inside the word box as well
    let resolvedArticle: ArticleType = article;
    const lower = cleanGerman.toLowerCase();
    if (lower.startsWith("der ")) {
      resolvedArticle = "der";
      cleanGerman = cleanGerman.slice(4).trim();
    } else if (lower.startsWith("die ")) {
      resolvedArticle = "die";
      cleanGerman = cleanGerman.slice(4).trim();
    } else if (lower.startsWith("das ")) {
      resolvedArticle = "das";
      cleanGerman = cleanGerman.slice(4).trim();
    }

    const fullGerman =
      resolvedArticle !== "none"
        ? `${resolvedArticle} ${cleanGerman}`
        : cleanGerman;

    const partOfSpeech: PartOfSpeech =
      resolvedArticle !== "none" ? "isim" : "fiil";

    const validExamples = examples
      .map((ex) => ({ de: ex.de.trim(), tr: ex.tr.trim() }))
      .filter((ex) => ex.de || ex.tr)
      .map((ex) => ({
        de: ex.de || `${fullGerman} ist wichtig.`,
        tr: ex.tr || cleanTurkish,
      }));

    const finalExamples =
      validExamples.length > 0
        ? validExamples
        : [
            {
              de: `Auf Deutsch sagt man „${fullGerman}“.`,
              tr: `Türkçe anlamı: ${cleanTurkish}.`,
            },
          ];

    const newWord: VocabWord = {
      id: `custom-${Date.now()}`,
      german: fullGerman,
      article: resolvedArticle,
      plural: pluralInput.trim() || undefined,
      turkish: cleanTurkish,
      level: "A1",
      partOfSpeech,
      theme: themeInput.trim() || "Günlük Yaşam",
      customImageUrl: imageUrlInput.trim() || undefined,
      wikiSearchTerm: wikiTermInput.trim() || cleanGerman,
      emoji: "",
      examples: finalExamples,
    };

    soundEngine.playSuccess();
    onImportWords([newWord], addToStudying);

    // Reset form
    setGermanInput("");
    setPluralInput("");
    setTurkishInput("");
    setImageUrlInput("");
    setWikiTermInput("");
    setExamples([{ de: "", tr: "" }]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl rounded-2xl bg-[#0c0d10]/95 backdrop-blur-2xl border border-white/15 shadow-2xl p-5 sm:p-6 space-y-4 max-h-[92vh] overflow-y-auto flex flex-col animate-pop"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-300">
              ÖZEL KELİME OLUŞTURUCU
            </span>
            <h3 className="text-lg font-semibold text-white">
              Yeni Almanca Kelime Ekle
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 text-stone-300 hover:bg-white hover:text-stone-950 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Article Selector (der / die / das / none) */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-mono uppercase tracking-wider text-stone-400">
            1. Artikel Seçimi (İsimler İçin der / die / das)
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(
              [
                {
                  val: "der",
                  label: "der",
                  activeCls:
                    "bg-sky-500/25 border-sky-400 text-sky-200 shadow-sm",
                },
                {
                  val: "die",
                  label: "die",
                  activeCls:
                    "bg-rose-500/25 border-rose-400 text-rose-200 shadow-sm",
                },
                {
                  val: "das",
                  label: "das",
                  activeCls:
                    "bg-emerald-500/25 border-emerald-400 text-emerald-200 shadow-sm",
                },
                {
                  val: "none",
                  label: "Yok (Fiil/Sıfat)",
                  activeCls:
                    "bg-white/20 border-white text-white shadow-sm",
                },
              ] as const
            ).map((item) => (
              <button
                key={item.val}
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setArticle(item.val);
                }}
                className={`h-9 px-2 rounded-xl border text-xs font-bold tracking-wider transition-all cursor-pointer ${
                  article === item.val
                    ? item.activeCls
                    : "bg-black/50 border-white/15 text-stone-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. German Word + Turkish Translation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono uppercase tracking-wider text-stone-300">
                2. Almanca Kelime *
              </label>
              <div className="flex items-center gap-1">
                {["ä", "ö", "ü", "ß"].map((ch) => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => setGermanInput((p) => `${p}${ch}`)}
                    className="w-5 h-5 rounded bg-white/10 hover:bg-white hover:text-stone-950 text-[10px] font-bold text-amber-200 transition-colors"
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="text"
              value={germanInput}
              onChange={(e) => setGermanInput(e.target.value)}
              placeholder={
                article !== "none" ? "Örn: Tisch, Katze..." : "Örn: lernen, schön..."
              }
              className="w-full h-10 px-3.5 rounded-xl border border-white/15 bg-black/60 text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-200/60"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono uppercase tracking-wider text-stone-300">
              3. Türkçe Anlamı *
            </label>
            <input
              type="text"
              value={turkishInput}
              onChange={(e) => setTurkishInput(e.target.value)}
              placeholder="Örn: Masa, Kedi, Öğrenmek..."
              className="w-full h-10 px-3.5 rounded-xl border border-white/15 bg-black/60 text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-200/60"
            />
          </div>
        </div>

        {/* 3. Plural + Category/Theme */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono uppercase tracking-wider text-stone-400">
              Çoğul Hali (İsteğe Bağlı)
            </label>
            <input
              type="text"
              value={pluralInput}
              onChange={(e) => setPluralInput(e.target.value)}
              placeholder="Örn: die Tische"
              className="w-full h-9 px-3 rounded-xl border border-white/15 bg-black/60 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-200/60"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono uppercase tracking-wider text-stone-400">
              Kategori / Tema
            </label>
            <input
              type="text"
              value={themeInput}
              onChange={(e) => setThemeInput(e.target.value)}
              placeholder="Örn: Günlük Yaşam, Ev, İş..."
              className="w-full h-9 px-3 rounded-xl border border-white/15 bg-black/60 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-200/60"
            />
          </div>
        </div>

        {/* 4. Image URL / Upload / Wikipedia Term */}
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-200 inline-flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" />
              4. Görsel Ayarı (URL, Dosya Yükle veya Otomatik)
            </span>
            <label className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white hover:text-stone-950 text-[10px] font-bold uppercase tracking-wider text-white cursor-pointer inline-flex items-center gap-1 transition-colors">
              <Upload className="w-3 h-3" />
              <span>Dosya Seç</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <input
              type="text"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              placeholder="Özel Görsel URL (https://...)"
              className="w-full h-9 px-3 rounded-lg border border-white/15 bg-black/60 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-200/60"
            />
            <input
              type="text"
              value={wikiTermInput}
              onChange={(e) => setWikiTermInput(e.target.value)}
              placeholder="veya İngilizce Wikipedia konusu (örn: Table)"
              className="w-full h-9 px-3 rounded-lg border border-white/15 bg-black/60 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-200/60"
            />
          </div>
        </div>

        {/* 5. Example Sentences */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-mono uppercase tracking-wider text-stone-300">
              5. Örnek Cümleler (Almanca & Türkçe)
            </label>
            <button
              type="button"
              onClick={handleAddExampleRow}
              className="text-[10px] font-bold uppercase tracking-wider text-amber-300 hover:text-white inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              Cümle Ekle
            </button>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {examples.map((ex, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2 items-center bg-black/40 p-2 rounded-xl border border-white/10"
              >
                <input
                  type="text"
                  value={ex.de}
                  onChange={(e) =>
                    handleExampleChange(idx, "de", e.target.value)
                  }
                  placeholder={`${idx + 1}. Almanca örnek cümle...`}
                  className="w-full h-8 px-2.5 rounded-lg border border-white/10 bg-black/60 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-200/50"
                />
                <input
                  type="text"
                  value={ex.tr}
                  onChange={(e) =>
                    handleExampleChange(idx, "tr", e.target.value)
                  }
                  placeholder={`${idx + 1}. Türkçe çevirisi...`}
                  className="w-full h-8 px-2.5 rounded-lg border border-white/10 bg-black/60 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-200/50"
                />
                {examples.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveExampleRow(idx)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-stone-400 hover:text-rose-300 transition-colors"
                    title="Cümleyi Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Target Section Checkbox */}
        <label className="flex items-center gap-2.5 text-xs text-stone-200 cursor-pointer select-none pt-1">
          <input
            type="checkbox"
            checked={addToStudying}
            onChange={(e) => setAddToStudying(e.target.checked)}
            className="w-4 h-4 rounded accent-amber-400"
          />
          <span>
            Ekledikten sonra doğrudan <strong>Öğreniliyor (Çalışma Alanı)</strong>{" "}
            listesine dahil et
          </span>
        </label>

        {errorMsg && (
          <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-400/40 text-xs text-rose-200">
            {errorMsg}
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full text-xs font-medium text-stone-300 hover:bg-white/10 transition-colors cursor-pointer"
          >
            İptal
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-full text-xs font-bold tracking-[0.14em] uppercase bg-white hover:bg-amber-50 text-stone-950 inline-flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            KELİMEYİ KAYDET
          </button>
        </div>
      </form>
    </div>
  );
}
