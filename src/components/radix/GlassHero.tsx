/**
 * GlassHero — Rebuilt smoked-glass hero composition for CAIRN landing page.
 *
 * Architecture:
 *  - Responsive two-column desktop composition:
 *      Left (~56%): Eyebrow, editorial serif headline, description, CTAs, platform highlights.
 *      Right (~44%): Readiness Index panel & 12 Skill Dimensions panel.
 *  - Straight, aligned edges with rounded corners and smoked-glass aesthetic (#17171B).
 *  - Contained subtle 3D depth and hover sheen, fully responsive with zero viewport overflow.
 *  - Removed the broken clip-path diagonal wedge while preserving the dark glass aesthetic.
 *  - Accessible keyboard navigation and respect for prefers-reduced-motion.
 */

import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, LayoutDashboard, Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { RADIX_CATEGORIES, categoryName } from "@/lib/radix/categories";
import type { TalentCheckResult, SkillMatchingResult, CategoryCode } from "@/lib/radix/types";

/* ─── Types ─── */
interface GlassHeroProps {
  tcResult: TalentCheckResult;
  smResult: SkillMatchingResult;
  targetJobRole: string;
}

/* ─── Reduced-motion detection ─── */
function checkPrefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ─── Spring lerp util ─── */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/* ─── All 12 skill codes ─── */
const SKILL_CODES: readonly CategoryCode[] = [
  "COD",
  "DSA",
  "OOD",
  "APTI",
  "COMM",
  "AI",
  "CLOUD",
  "SQL",
  "SWE",
  "SYSD",
  "NETW",
  "OS",
] as const;

/* ─── Second view evaluation principles ─── */
const PRINCIPLES = [
  {
    label: "Readiness Index",
    desc: "Holistic technical preparation measured against verified hiring baselines.",
  },
  {
    label: "Technical Depth",
    desc: "Rigorous competency validation across algorithms, systems, and practical coding.",
  },
  {
    label: "Communication",
    desc: "Clarity, architectural articulation, and structured engineering discourse.",
  },
  {
    label: "Role Alignment",
    desc: "Granular fit scoring between candidate skills and target role requirements.",
  },
  {
    label: "Skill Gaps",
    desc: "Prioritized, actionable gap analysis to guide targeted preparation.",
  },
];

export function GlassHero({ tcResult, smResult, targetJobRole }: GlassHeroProps) {
  const [showSecondView, setShowSecondView] = useState(false);
  const [entered, setEntered] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const installRef = useRef<HTMLDivElement>(null);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const tiltX = useRef(0);
  const tiltY = useRef(0);
  const targetX = useRef(0);
  const targetY = useRef(0);
  const rafRef = useRef<number>(0);
  const isTilting = useRef(false);

  /* Entrance settle */
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 40);
    return () => clearTimeout(t);
  }, []);

  /* Check reduced motion & listen for changes */
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  /* Handlers for video readiness and fallback */
  const handleVideoReady = useCallback(() => {
    setVideoReady(true);
  }, []);

  const handleVideoError = useCallback(() => {
    setVideoFailed(true);
  }, []);

  /* Play/pause video in sync with prefers-reduced-motion */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;

    if (video.readyState >= 2) {
      setVideoReady(true);
    }

    if (prefersReducedMotion) {
      video.pause();
    } else {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setVideoReady(true);
          })
          .catch(() => {
            // Autoplay restricted by browser policy; static frame remains visible
          });
      }
    }
  }, [prefersReducedMotion]);

  /* Escape key to close second view */
  useEffect(() => {
    if (!showSecondView) return undefined;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowSecondView(false);
        triggerButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showSecondView]);

  /* Controlled subtle tilt loop (desktop only, contained) */
  const startTiltLoop = useCallback(() => {
    if (checkPrefersReducedMotion()) return;
    if (isTilting.current) return;
    isTilting.current = true;

    const tick = () => {
      tiltX.current = lerp(tiltX.current, targetX.current, 0.08);
      tiltY.current = lerp(tiltY.current, targetY.current, 0.08);

      if (installRef.current) {
        installRef.current.style.transform = `perspective(1200px) rotateX(${tiltY.current.toFixed(2)}deg) rotateY(${tiltX.current.toFixed(2)}deg)`;
      }

      if (isTilting.current) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const stopTiltLoop = useCallback(() => {
    targetX.current = 0;
    targetY.current = 0;

    const relax = () => {
      tiltX.current = lerp(tiltX.current, 0, 0.1);
      tiltY.current = lerp(tiltY.current, 0, 0.1);

      if (installRef.current) {
        installRef.current.style.transform = `perspective(1200px) rotateX(${tiltY.current.toFixed(2)}deg) rotateY(${tiltX.current.toFixed(2)}deg)`;
      }

      if (Math.abs(tiltX.current) > 0.01 || Math.abs(tiltY.current) > 0.01) {
        rafRef.current = requestAnimationFrame(relax);
      } else {
        isTilting.current = false;
        if (installRef.current) {
          installRef.current.style.transform = "none";
        }
      }
    };
    rafRef.current = requestAnimationFrame(relax);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onMouseMove = (e: MouseEvent) => {
      if (checkPrefersReducedMotion() || window.innerWidth < 1024) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);

      // Subtle rotation clamped to ±2.2deg
      targetX.current = Math.max(-2.2, Math.min(2.2, dx * 2.2));
      targetY.current = Math.max(-1.8, Math.min(1.8, -dy * 1.8));

      if (!isTilting.current) {
        startTiltLoop();
      }
    };

    const onMouseLeave = () => {
      stopTiltLoop();
    };

    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseleave", onMouseLeave);

    return () => {
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [startTiltLoop, stopTiltLoop]);

  const readinessScore = tcResult.readiness_score;
  const metCategoriesCount = tcResult.skillset_gap.filter((g) => !g.gap).length;

  return (
    <div
      ref={containerRef}
      className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-start lg:justify-center items-center overflow-hidden py-8 sm:py-12 lg:py-16 selection:bg-champagne/20 bg-obsidian"
    >
      {/* ── Layer 1: Page background is bg-obsidian (#050507) ── */}

      {/* ── Layer 2: Background Video ── */}
      {!videoFailed && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        >
          <video
            ref={videoRef}
            autoPlay={!prefersReducedMotion}
            muted
            loop
            playsInline
            preload="auto"
            src="https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/aaaf/facet-glass-hero.mp4"
            onCanPlay={handleVideoReady}
            onPlaying={handleVideoReady}
            onLoadedData={handleVideoReady}
            onLoadedMetadata={handleVideoReady}
            onError={handleVideoError}
            className="w-full h-full object-cover object-center pointer-events-none"
            style={{
              opacity: 0.78,
            }}
          >
            <source
              src="https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/aaaf/facet-glass-hero.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      )}

      {/* ── Layer 3: Subtle Dark Gradient Overlay for Readability ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(5,5,7,0.7) 0%, rgba(5,5,7,0.25) 25%, rgba(5,5,7,0.3) 70%, rgba(5,5,7,0.85) 100%)",
        }}
      />

      {/* ── Ambient Studio Lighting Layers ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/4 size-[650px] rounded-full opacity-20 z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(201,205,208,0.12) 0%, rgba(201,205,208,0.02) 50%, transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 right-1/4 size-[600px] rounded-full opacity-15 z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(196,165,116,0.12) 0%, rgba(196,165,116,0.02) 55%, transparent 75%)",
        }}
      />

      {/* ── Second View: Architecture & Evaluation Breakdown ── */}
      {showSecondView && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="How CAIRN Works"
          className="absolute inset-0 z-50 flex items-center justify-center px-4 sm:px-8 py-12 backdrop-blur-2xl"
          style={{
            background: "rgba(5, 5, 7, 0.94)",
            animation: checkPrefersReducedMotion()
              ? "none"
              : "fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="max-w-3xl w-full space-y-8 rounded-3xl border border-white/10 bg-smoked-glass/95 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            {/* Top bevel highlight */}
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <button
                type="button"
                onClick={() => {
                  setShowSecondView(false);
                  triggerButtonRef.current?.focus();
                }}
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-grey hover:text-frost-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
              >
                <ArrowLeft className="size-3.5" />
                <span>Return to Hero View</span>
              </button>
              <span className="font-mono text-xs uppercase tracking-wider text-champagne">
                Architecture Spec
              </span>
            </div>

            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-champagne mb-2">
                Talent Intelligence Framework
              </p>
              <h2
                className="text-3xl sm:text-5xl font-bold tracking-tight text-cloud-silver leading-[1.08] mb-3"
                style={{ letterSpacing: "-0.03em" }}
              >
                Evaluated in dimensions,{" "}
                <span className="font-serif font-normal italic text-mist-silver">
                  not guesswork.
                </span>
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-slate-grey">
                CAIRN transforms ambiguous resumes and technical interviews into quantifiable,
                verified dimensions of candidate readiness.
              </p>
            </div>

            <ol className="space-y-3">
              {PRINCIPLES.map((p, i) => (
                <li
                  key={p.label}
                  className="flex items-start gap-4 rounded-xl p-4 transition-colors bg-white/5 border border-white/10"
                >
                  <span className="size-7 rounded-lg flex items-center justify-center shrink-0 font-mono text-xs font-bold text-champagne bg-champagne/10 border border-champagne/25">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-cloud-silver mb-0.5">{p.label}</p>
                    <p className="text-xs leading-relaxed text-slate-grey">{p.desc}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-white/10">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2.5 rounded-xl px-6 py-3 text-xs font-semibold uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] shadow-lg bg-cloud-silver text-obsidian"
              >
                <LayoutDashboard className="size-3.5" />
                <span>Explore CAIRN Dashboard</span>
                <ArrowRight className="size-3" />
              </Link>
              <button
                type="button"
                onClick={() => {
                  setShowSecondView(false);
                  triggerButtonRef.current?.focus();
                }}
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-all duration-200 hover:bg-white/10 bg-white/5 border border-white/15 text-mist-silver"
              >
                <ArrowLeft className="size-3" />
                <span>Back to the glass</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Two-Column Hero Composition ── */}
      <div
        className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-opacity duration-300 relative z-10 ${
          showSecondView ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div
          ref={installRef}
          className={`relative transition-all duration-700 ease-out ${
            entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ willChange: "transform" }}
        >
          {/* Responsive Two-Column Layout: Left ~56%, Right ~44% */}
          <div className="flex flex-col lg:flex-row items-stretch gap-6 lg:gap-8">
            {/* ── LEFT COLUMN: Headline, Story, CTAs, Highlights (~56%) ── */}
            <div
              className="w-full lg:w-[56%] rounded-2xl sm:rounded-3xl border border-white/10 p-6 sm:p-8 lg:p-10 shadow-[0_16px_40px_-8px_rgba(0,0,0,0.5)] flex flex-col justify-between relative overflow-hidden backdrop-blur-xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(23, 23, 27, 0.72) 0%, rgba(20, 20, 24, 0.78) 100%)",
              }}
            >
              {/* Top bevel highlight */}
              <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

              <div>
                {/* Eyebrow with Champagne Indicator */}
                <div className="flex items-center gap-2.5 mb-6">
                  <span className="size-2 rounded-full bg-champagne shadow-[0_0_10px_rgba(196,165,116,0.6)]" />
                  <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-champagne">
                    Talent Intelligence Platform
                  </p>
                </div>

                {/* Main Headline */}
                <div className="space-y-1 mb-6">
                  <h1
                    className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.04] text-cloud-silver"
                    style={{ letterSpacing: "-0.04em" }}
                  >
                    See skills.
                  </h1>
                  <h1
                    className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] font-normal leading-[1.04] text-mist-silver italic"
                    style={{ letterSpacing: "-0.03em" }}
                  >
                    Reveal potential.
                  </h1>
                </div>

                {/* Subtitle / Description */}
                <p className="text-sm sm:text-base leading-relaxed text-slate-grey max-w-xl mb-8">
                  Understand technical readiness, explore skill alignment, and turn complex talent
                  signals into clearer decisions.
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8">
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2.5 rounded-xl px-6 py-3.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne bg-cloud-silver text-obsidian"
                  >
                    <LayoutDashboard className="size-3.5" />
                    <span>Explore CAIRN</span>
                    <ArrowRight className="size-3" />
                  </Link>

                  <button
                    ref={triggerButtonRef}
                    type="button"
                    onClick={() => setShowSecondView(true)}
                    className="inline-flex items-center gap-2 rounded-xl px-5 py-3.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne bg-white/5 border border-white/15 text-mist-silver"
                  >
                    <Sparkles className="size-3.5 text-champagne" />
                    <span>Explore how CAIRN works</span>
                    <ArrowRight className="size-3" />
                  </button>
                </div>
              </div>

              {/* Platform Highlights / Meta Badges */}
              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-grey">
                <span className="inline-flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-success-green" />
                  <span>12 Skill Dimensions</span>
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-champagne" />
                  <span>Multi-Tier Hiring Bars</span>
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-mist-silver" />
                  <span>On-Device Engine</span>
                </span>
              </div>
            </div>

            {/* ── RIGHT COLUMN: Readiness Panel & Skill Dimensions Panel (~44%) ── */}
            <div className="w-full lg:w-[44%] flex flex-col gap-6">
              {/* 1. Readiness Index Panel */}
              <div
                className="rounded-2xl sm:rounded-3xl border border-white/10 p-6 sm:p-7 shadow-[0_16px_40px_-8px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col items-center justify-center text-center space-y-4 backdrop-blur-xl"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(23, 23, 27, 0.72) 0%, rgba(20, 20, 24, 0.78) 100%)",
                }}
              >
                {/* Top bevel highlight */}
                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

                <div className="w-full flex items-center justify-between border-b border-white/10 pb-3">
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-champagne">
                    Readiness Index
                  </p>
                  <span className="font-mono text-[10px] text-slate-grey uppercase tracking-wider">
                    Benchmark Model
                  </span>
                </div>

                {/* Centered and Proportionate Score Ring */}
                <div className="py-1">
                  <MiniScoreRing score={readinessScore} />
                </div>

                {/* Score Summary */}
                <div className="space-y-1">
                  <p className="text-xs font-mono text-slate-grey">
                    <span className="text-frost-white font-semibold">{metCategoriesCount}</span> of
                    12 categories met
                  </p>
                </div>

                {/* Clearly Labeled Illustrative Benchmark */}
                <div className="w-full space-y-1.5 pt-1">
                  <div className="w-full rounded-lg px-3 py-2 text-xs font-mono font-medium text-center border bg-success-green/10 border-success-green/25 text-success-green">
                    Illustrative Benchmark · Google Tier-1
                  </div>
                  <p className="text-[10px] font-mono text-slate-grey text-center">
                    Demonstration sample · Not real-time candidate results
                  </p>
                </div>
              </div>

              {/* 2. Skill Dimensions Panel (All 12 Categories in Responsive Grid) */}
              <div
                className="rounded-2xl sm:rounded-3xl border border-white/10 p-6 sm:p-7 shadow-[0_16px_40px_-8px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col justify-between space-y-4 backdrop-blur-xl"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(23, 23, 27, 0.72) 0%, rgba(20, 20, 24, 0.78) 100%)",
                }}
              >
                {/* Top bevel highlight */}
                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-champagne">
                    Skill Dimensions
                  </p>
                  <span className="font-mono text-[10px] text-slate-grey uppercase tracking-wider">
                    All 12 Categories
                  </span>
                </div>

                {/* Responsive Grid for all 12 Categories: 3 cols mobile, 4 cols tablet, 6 cols desktop */}
                <div className="grid grid-cols-3 sm:grid-cols-4 xl:grid-cols-6 gap-2">
                  {SKILL_CODES.map((code) => {
                    const isMet = !tcResult.skillset_gap.find((g) => g.category_code === code)?.gap;

                    return (
                      <div
                        key={code}
                        className={`group relative h-9 flex items-center justify-center rounded-lg font-mono text-xs font-semibold transition-all duration-200 cursor-default border ${
                          isMet
                            ? "bg-success-green/10 border-success-green/25 text-success-green"
                            : "bg-white/5 border-white/10 text-mist-silver"
                        }`}
                        title={`${code}: ${categoryName(code)}`}
                      >
                        <span>{code}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Supporting description without truncation */}
                <div className="space-y-2 pt-1 border-t border-white/10">
                  <p className="text-xs leading-relaxed text-slate-grey">
                    Standardized taxonomy spanning algorithmic competence, system architecture, and
                    professional aptitude.
                  </p>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-grey pt-1">
                    <span>Target Role Alignment</span>
                    <span className="text-cloud-silver font-medium">
                      {targetJobRole} · {smResult.match_score}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

/* ─── Proportionate & Centered Score Ring ─── */
function MiniScoreRing({ score }: { score: number }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.min(100, Math.max(0, score)) / 100);
  const color = score >= 65 ? "#36D67E" : score >= 45 ? "#C4A574" : "#E05252";

  return (
    <div className="relative size-28 mx-auto flex items-center justify-center select-none">
      <svg viewBox="0 0 100 100" className="size-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" strokeWidth="6" stroke="rgba(201,205,208,0.1)" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          stroke={color}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.22, 1, 0.36, 1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span
          className="text-2xl font-bold font-mono tracking-tight leading-none"
          style={{ color }}
        >
          {score}
        </span>
        <span className="text-[10px] font-mono tracking-wider mt-1 text-slate-grey">/100</span>
      </div>
    </div>
  );
}
