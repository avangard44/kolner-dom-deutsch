"use client";

import React, { useState, useId } from "react";
import { soundEngine } from "@/lib/audio";
import { Cologne3DScene } from "./Cologne3DScene";

interface CologneIntroHeroProps {
  onEnterWorkspace: (
    targetTab?: "catalog" | "studying" | "learned"
  ) => void;
  totalWords: number;
  learnedCount: number;
}

const BRAND_LETTERS = ["K", "Ö", "L", "N", "E", "R", "\u00A0", "D", "O", "M"];

/**
 * Monoline continuous-ribbon Cathedral + Loop mark in either solid or 3D Liquid Glass style
 * Uses exact pathLength={100} for mathematically precise stroke-dashoffset choreography
 */
export function KölnerDomLogo({
  className = "w-8 h-6",
  animated = true,
  liquid = false,
}: {
  className?: string;
  animated?: boolean;
  liquid?: boolean;
}) {
  const uid = useId().replace(/:/g, "");
  const bodyGradId = `liquid-body-${uid}`;
  const specGradId = `liquid-spec-${uid}`;
  const glowFilterId = `liquid-glow-${uid}`;

  const mainRibbonPath =
    "M 4 23 L 4 13 C 4 6.5 9.5 3.5 14 9.5 L 20.5 19 C 24 24 31 24.5 35.5 21 C 40 17.5 40 10.5 35.5 7 C 31.5 4 25.5 5 23.5 8.5";
  const crossRibbonPath =
    "M 9.2 2.6 L 9.2 5.2 M 31.5 2.2 L 31.5 4.8 M 22.5 12.5 C 26.5 15.5 32.5 15.5 37.5 11.5";

  if (!liquid) {
    return (
      <svg
        viewBox="0 0 44 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        <path
          d={mainRibbonPath}
          pathLength={100}
          stroke="currentColor"
          strokeWidth="3.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={animated ? "animate-logo-stroke" : ""}
        />
        <path
          d={crossRibbonPath}
          pathLength={100}
          stroke="currentColor"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={animated ? "animate-logo-cross" : ""}
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 44 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* Translucent Refractive Glass Tube Gradient */}
        <linearGradient id={bodyGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.98" />
          <stop offset="28%" stopColor="#E0F2FE" stopOpacity="0.62" />
          <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="80%" stopColor="#FEF3C7" stopOpacity="0.72" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.98" />
        </linearGradient>

        {/* Razor-sharp Wet Specular Crest Highlight */}
        <linearGradient id={specGradId} x1="0%" y1="0%" x2="90%" y2="20%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="50%" stopColor="#BAE6FD" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.98" />
        </linearGradient>

        {/* Soft Caustic Drop Shadow & Inner Refraction */}
        <filter id={glowFilterId} x="-35%" y="-35%" width="170%" height="170%">
          <feDropShadow
            dx="0"
            dy="4"
            stdDeviation="3"
            floodColor="#000000"
            floodOpacity="0.65"
          />
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="2.8"
            floodColor="#FFFFFF"
            floodOpacity="0.45"
          />
        </filter>
      </defs>

      <g filter={`url(#${glowFilterId})`}>
        {/* Outer Frosted Glass Volume */}
        <path
          d={mainRibbonPath}
          pathLength={100}
          stroke={`url(#${bodyGradId})`}
          strokeWidth="4.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={animated ? "animate-logo-stroke" : ""}
        />
        <path
          d={crossRibbonPath}
          pathLength={100}
          stroke={`url(#${bodyGradId})`}
          strokeWidth="3.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={animated ? "animate-logo-cross" : ""}
        />

        {/* Inner Specular Liquid Core Reflection */}
        <path
          d={mainRibbonPath}
          pathLength={100}
          stroke={`url(#${specGradId})`}
          strokeWidth="1.45"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={animated ? "animate-logo-stroke" : ""}
          style={{ transform: "translateY(-0.55px)" }}
        />
        <path
          d={crossRibbonPath}
          pathLength={100}
          stroke={`url(#${specGradId})`}
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={animated ? "animate-logo-cross" : ""}
          style={{ transform: "translateY(-0.5px)" }}
        />

        {/* Travelling Liquid Light Comet Head */}
        {animated && (
          <path
            d={mainRibbonPath}
            pathLength={100}
            stroke="#FFFFFF"
            strokeWidth="5.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-logo-comet"
          />
        )}
      </g>
    </svg>
  );
}

/**
 * Complete Kinetic Brand Lockup — Pure Borderless Liquid Glass with 2-Stage "nomics" Unfurl
 */
export function KölnerDomBrand({
  size = "md",
  animated = true,
  liquid = false,
}: {
  size?: "sm" | "md" | "lg" | "hero";
  animated?: boolean;
  liquid?: boolean;
}) {
  const iconSize =
    size === "hero"
      ? "w-20 h-14 sm:w-28 sm:h-20 md:w-36 md:h-24 shrink-0"
      : size === "lg"
      ? "w-10 h-7 sm:w-12 sm:h-8 shrink-0"
      : size === "sm"
      ? "w-7 h-5 shrink-0"
      : "w-8 h-6 sm:w-9 sm:h-6 shrink-0";

  const textSize =
    size === "hero"
      ? "text-3xl sm:text-5xl md:text-6xl tracking-[0.16em]"
      : size === "lg"
      ? "text-base sm:text-xl tracking-[0.14em]"
      : size === "sm"
      ? "text-xs tracking-[0.14em]"
      : "text-xs sm:text-sm tracking-[0.16em]";

  return (
    <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-5 select-none">
      <KölnerDomLogo className={iconSize} animated={animated} liquid={liquid} />

      {animated ? (
        <div className="animate-wordmark-expand py-2 px-1">
          <span
            className={`font-extrabold uppercase leading-none inline-flex ${textSize}`}
          >
            {BRAND_LETTERS.map((ch, idx) => (
              <span
                key={idx}
                style={{ animationDelay: `${0.38 + idx * 0.045}s` }}
                className="animate-liquid-char"
              >
                <span className={liquid ? "liquid-glass-text" : "text-white"}>
                  {ch}
                </span>
              </span>
            ))}
          </span>
        </div>
      ) : (
        <span
          className={`font-extrabold uppercase leading-none ${textSize} ${
            liquid ? "liquid-glass-text" : "text-white"
          }`}
        >
          KÖLNER DOM
        </span>
      )}
    </div>
  );
}

export function CologneIntroHero({
  onEnterWorkspace,
}: CologneIntroHeroProps) {
  const [phase, setPhase] = useState<
    "idle" | "revealing" | "zooming" | "exiting"
  >("revealing");
  const [animKey, setAnimKey] = useState(0);
  const [isLaunching, setIsLaunching] = useState(false);

  const handleEnter = () => {
    if (isLaunching) return;
    soundEngine.playSuccess();
    setIsLaunching(true);
    // Replay the 2-stage kinetic monoline draw + staggered liquid-glass wordmark unfurl
    setAnimKey((k) => k + 1);
    setPhase("zooming");

    setTimeout(() => {
      setPhase("exiting");
    }, 1550);

    setTimeout(() => {
      onEnterWorkspace("catalog");
    }, 2150);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#0c0d10] p-0 sm:p-4 select-none overflow-hidden transition-all duration-700 ${
        phase === "exiting"
          ? "opacity-0 scale-110 blur-xs pointer-events-none"
          : "opacity-100 scale-100 blur-0"
      }`}
    >
      {/* Full-Height Mobile & Desktop Frame Container */}
      <div className="relative w-full h-dvh sm:h-full sm:rounded-[28px] overflow-hidden flex flex-col justify-between bg-[#0c0d10]">
        {/* Full-Cathedral 4K WebGL Scene with 3D Perspective Fly-Through on Launch */}
        <Cologne3DScene phase={phase} />

        {/* Subtle Dark Top & Bottom Vignettes */}
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/50 via-black/15 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/75 via-black/30 to-transparent pointer-events-none z-10" />

        {/* PURE BORDERLESS LIQUID GLASS LOGO + 2-STAGE KINETIC WORDMARK */}
        <div
          className={`relative z-20 flex items-center justify-center px-4 pt-10 sm:pt-14 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isLaunching
              ? "translate-y-[24vh] scale-110 sm:scale-125"
              : "translate-y-0 scale-100"
          }`}
        >
          <div key={animKey}>
            <KölnerDomBrand size="hero" animated={true} liquid={true} />
          </div>
        </div>

        {/* BOTTOM CENTER: Borderless Liquid Glass Start Text Trigger */}
        <div
          className={`relative z-20 mt-auto px-4 pb-10 sm:pb-14 flex flex-col items-center justify-center transition-all duration-500 ${
            isLaunching
              ? "opacity-0 translate-y-6 scale-90 pointer-events-none"
              : "opacity-100 translate-y-0 scale-100"
          }`}
        >
          <button
            type="button"
            onClick={handleEnter}
            className="group py-3 px-6 hover:scale-110 active:scale-95 transition-transform duration-300 cursor-pointer focus:outline-none"
          >
            <span className="liquid-glass-text text-lg sm:text-2xl font-extrabold tracking-[0.34em] uppercase">
              BAŞLAT
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
