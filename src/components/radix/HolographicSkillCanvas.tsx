import { Link } from "@tanstack/react-router";
import { ArrowRight, Compass, Cpu, Layers, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CategoryBadge } from "@/components/radix/primitives";

export function HolographicSkillCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [sheen, setSheen] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);
    const listener = () => setPrefersReducedMotion(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle 3D tilt (-5 to +5 degrees)
    const rotateY = ((x - centerX) / centerX) * 6;
    const rotateX = -((y - centerY) / centerY) * 6;

    setRotate({ x: rotateX, y: rotateY });
    setSheen({
      x: Math.round((x / rect.width) * 100),
      y: Math.round((y / rect.height) * 100),
    });
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={handlePointerLeave}
      className="relative select-none [perspective:1400px]"
      aria-label="Reflective Chrome Skill Sculpture"
    >
      {/* Dimensional 3D Card */}
      <div
        className="relative overflow-hidden rounded-3xl border border-mist bg-soft-white p-6 sm:p-8 shadow-card transition-all duration-300 ease-out"
        style={{
          transform: prefersReducedMotion
            ? "none"
            : `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        }}
      >
        {/* Dynamic Champagne & Chrome Specular Lighting Layer */}
        <div
          className="pointer-events-none absolute -inset-1 opacity-70 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 420px at ${sheen.x}% ${sheen.y}%, rgba(220, 208, 187, 0.35), rgba(196, 165, 116, 0.12) 45%, transparent 75%)`,
          }}
        />

        {/* Ambient Warm Champagne Glow */}
        <div className="pointer-events-none absolute -top-24 right-1/4 size-72 rounded-full bg-champagne/10 blur-3xl" />

        {/* Card Header & Studio Plaque */}
        <div className="relative z-10 mb-6 flex items-center justify-between border-b border-mist/80 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="size-2 rounded-full bg-champagne" />
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-charcoal">
              CAIRN // Specimen 01
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sand bg-champagne-soft px-3 py-1 font-mono text-[10px] font-medium text-warm-grey">
            <Sparkles className="size-3 text-champagne" />
            CHROME ARTICULATION
          </span>
        </div>

        {/* Layered Reflective Chrome Sculpture (Peculiar Atelier Inspired SVG) */}
        <div className="relative my-2 h-48 w-full overflow-hidden rounded-2xl border border-mist bg-ivory sm:h-56">
          {/* Subtle grid backing */}
          <div className="absolute inset-0 bg-grid-editorial opacity-40" />

          {/* Chrome & Champagne Metallic Folds SVG */}
          <svg
            viewBox="0 0 500 240"
            className="absolute inset-0 size-full"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              {/* Chrome Gradient 1 */}
              <linearGradient id="chrome-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FCFBF8" stopOpacity="0.95" />
                <stop offset="35%" stopColor="#C9CDD0" stopOpacity="0.85" />
                <stop offset="65%" stopColor="#8E959B" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#E4E3DE" stopOpacity="0.8" />
              </linearGradient>

              {/* Champagne Metallic Gradient */}
              <linearGradient id="champagne-grad-1" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#DFCA9F" stopOpacity="0.95" />
                <stop offset="45%" stopColor="#C4A574" stopOpacity="0.9" />
                <stop offset="80%" stopColor="#8C6F42" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#FCFBF8" stopOpacity="0.6" />
              </linearGradient>

              {/* Platinum Specular Gradient */}
              <linearGradient id="platinum-grad-1" x1="20%" y1="10%" x2="80%" y2="90%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                <stop offset="40%" stopColor="#E8E9EA" stopOpacity="0.7" />
                <stop offset="70%" stopColor="#B5B8BC" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#2A2A28" stopOpacity="0.6" />
              </linearGradient>

              {/* Soft Drop Shadow Filter for layers */}
              <filter id="soft-shadow" x="-10%" y="-10%" width="120%" height="130%">
                <feDropShadow
                  dx="0"
                  dy="6"
                  stdDeviation="8"
                  floodColor="#1C1C1A"
                  floodOpacity="0.12"
                />
              </filter>
            </defs>

            {/* Rear Deep Ribbon */}
            <path
              d="M -20,210 C 120,230 190,130 310,140 C 420,150 470,80 520,70 L 520,250 L -20,250 Z"
              fill="url(#platinum-grad-1)"
              opacity="0.35"
            />

            {/* Sculptural Ribbon Wave 1 (Silver Chrome) */}
            <path
              d="M -10,170 C 90,120 180,210 280,120 C 370,50 430,90 510,40 L 510,170 C 410,210 320,130 220,190 C 130,240 60,190 -10,220 Z"
              fill="url(#chrome-grad-1)"
              filter="url(#soft-shadow)"
              opacity="0.9"
            />

            {/* Sculptural Ribbon Wave 2 (Champagne Highlighted Edge) */}
            <path
              d="M 20,40 C 140,15 210,110 320,50 C 410,2 450,45 520,10 L 520,55 C 440,95 380,50 290,105 C 190,160 110,70 20,80 Z"
              fill="url(#champagne-grad-1)"
              filter="url(#soft-shadow)"
              opacity="0.85"
            />

            {/* Sharp Specular Edge Accent Lines */}
            <path
              d="M -10,170 C 90,120 180,210 280,120 C 370,50 430,90 510,40"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.95"
            />
            <path
              d="M 20,40 C 140,15 210,110 320,50 C 410,2 450,45 520,10"
              fill="none"
              stroke="#FAF4EB"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.9"
            />
            <path
              d="M 220,190 C 310,140 400,200 510,160"
              fill="none"
              stroke="#C4A574"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              opacity="0.8"
            />
          </svg>

          {/* Floating Data Plaque with Benchmark Metric */}
          <div
            className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl border border-mist bg-soft-white/95 px-3.5 py-2 backdrop-blur-md"
            title="Illustrative demo benchmark score for specimen demonstration"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-warm-grey">
                Illustrative Benchmark
              </span>
              <span className="font-mono text-xs font-bold text-charcoal">COD · DSA · SYSD</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-sage" />
              <span className="font-mono text-xs font-bold text-sage">84 / 100</span>
            </div>
          </div>
        </div>

        {/* 4 Interactive Competency Nodes */}
        <div className="mt-5 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-warm-grey">
            <span className="font-mono text-[11px] uppercase tracking-wider">
              Multidimensional Competencies
            </span>
            <span className="font-mono text-[10px] text-champagne">4 of 12 Monitored</span>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { code: "COD", name: "Coding", val: "92%", icon: Cpu },
              { code: "DSA", name: "Algorithms", val: "88%", icon: Layers },
              { code: "SYSD", name: "System Design", val: "79%", icon: Compass },
              { code: "CLOUD", name: "Cloud Arch", val: "85%", icon: Sparkles },
            ].map(({ code, name, val, icon: Icon }) => (
              <div
                key={code}
                className="group/item flex flex-col justify-between rounded-xl border border-mist bg-ivory/60 p-2.5 transition-all hover:bg-soft-white hover:border-sand"
              >
                <div className="flex items-center justify-between">
                  <CategoryBadge code={code} />
                  <Icon className="size-3 text-warm-grey transition-colors group-hover/item:text-champagne" />
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="truncate text-[11px] text-warm-grey">{name}</span>
                  <span className="font-mono text-xs font-bold text-charcoal">{val}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Interactive Link */}
        <div className="mt-5 pt-4 border-t border-mist/70 flex items-center justify-between">
          <p className="text-[11px] text-warm-grey">
            Illustrative specimen · Deterministic on-device simulation
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal hover:text-champagne transition-colors"
          >
            <span>Explore profile</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
