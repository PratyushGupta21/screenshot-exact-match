import { AlertTriangle, FlaskConical, Inbox, Loader2 } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { categoryName } from "@/lib/radix/categories";
import { scoreTone } from "@/lib/radix/scoring";
import type { Confidence } from "@/lib/radix/types";
import { cn } from "@/lib/utils";

/* ─── Shared style constants ─── */
const GLASS_BORDER = "1px solid rgba(201,205,208,0.14)";
const GLASS_BG = "#17171B";
const GLASS_BG_HOVER = "#1C1C22";
const TEXT_PRIMARY = "#DCDCE0";
const TEXT_SECONDARY = "#85858E";
const TEXT_MUTED = "#85858E";
const CHAMPAGNE = "#C4A574";
const SUCCESS_GREEN = "#36D67E";
const DANGER_RED = "#E05252";

/* ─── PageHeader ─── */
export function PageHeader({
  title,
  description,
  actions,
  eyebrow,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  eyebrow?: string;
}) {
  return (
    <div
      className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between pb-6 border-b"
      style={{ borderColor: "rgba(201,205,208,0.1)" }}
    >
      <div className="max-w-2xl">
        {eyebrow && (
          <p
            className="mb-2 font-mono text-xs font-semibold uppercase tracking-widest"
            style={{ color: CHAMPAGNE }}
          >
            {eyebrow}
          </p>
        )}
        <h1
          className="font-display text-3xl font-bold tracking-tight sm:text-4xl"
          style={{ color: TEXT_PRIMARY, letterSpacing: "-0.03em" }}
        >
          {title}
        </h1>
        {description && (
          <p
            className="mt-2 text-sm sm:text-base leading-relaxed"
            style={{ color: TEXT_SECONDARY }}
          >
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

/* ─── Panel ─── */
export function Panel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
  variant?: "soft" | "brut";
}) {
  return (
    <section
      className={cn("rounded-2xl p-6 transition-all duration-200", className)}
      style={{
        background: GLASS_BG,
        border: GLASS_BORDER,
        boxShadow: "0 0 0 1px rgba(201,205,208,0.05), 0 8px 24px -4px rgba(0,0,0,0.4)",
      }}
    >
      {children}
    </section>
  );
}

/* ─── PanelTitle ─── */
export function PanelTitle({
  children,
  action,
  icon,
}: {
  children: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div
      className="mb-5 flex items-center justify-between gap-3 border-b pb-3"
      style={{ borderColor: "rgba(201,205,208,0.1)" }}
    >
      <h2
        className="flex items-center gap-2.5 font-display text-base sm:text-lg font-bold"
        style={{ color: TEXT_PRIMARY }}
      >
        {icon && <span style={{ color: CHAMPAGNE }}>{icon}</span>}
        {children}
      </h2>
      {action}
    </div>
  );
}

/* ─── SampleBadge ─── */
export function SampleBadge({ label = "Sample data" }: { label?: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[11px] font-medium"
      style={{
        background: "rgba(196,165,116,0.1)",
        border: "1px solid rgba(196,165,116,0.25)",
        color: CHAMPAGNE,
      }}
    >
      <FlaskConical className="size-3" /> {label}
    </span>
  );
}

/* ─── CategoryBadge ─── */
export function CategoryBadge({ code, showName = false }: { code: string; showName?: boolean }) {
  return (
    <span
      title={categoryName(code)}
      className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 font-mono text-[11px] font-semibold"
      style={{
        background: "rgba(201,205,208,0.06)",
        border: "1px solid rgba(201,205,208,0.15)",
        color: "#BDBDC3",
      }}
    >
      <span style={{ color: "#DCDCE0" }}>{code}</span>
      {showName && (
        <span className="font-sans font-normal" style={{ color: TEXT_MUTED }}>
          · {categoryName(code)}
        </span>
      )}
    </span>
  );
}

/* ─── ConfidenceBadge ─── */
const confStyles: Record<Confidence, { bg: string; color: string; border: string }> = {
  high: { bg: "rgba(54,214,126,0.08)", color: "#36D67E", border: "rgba(54,214,126,0.2)" },
  medium: { bg: "rgba(196,165,116,0.1)", color: "#C4A574", border: "rgba(196,165,116,0.25)" },
  low: { bg: "rgba(201,205,208,0.06)", color: "#85858E", border: "rgba(201,205,208,0.15)" },
};

export function ConfidenceBadge({ level }: { level: Confidence }) {
  const s = confStyles[level];
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize"
      style={{
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
      }}
    >
      {level}
    </span>
  );
}

/* ─── SkillChip ─── */
export function SkillChip({
  name,
  code,
  tone = "default",
  onRemove,
}: {
  name: string;
  code?: string;
  tone?: "default" | "matched" | "missing";
  onRemove?: () => void;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
      style={
        tone === "matched"
          ? {
              background: "rgba(54,214,126,0.08)",
              border: "1px solid rgba(54,214,126,0.2)",
              color: "#36D67E",
            }
          : tone === "missing"
            ? {
                background: "rgba(224,82,82,0.08)",
                border: "1px dashed rgba(224,82,82,0.3)",
                color: "#E05252",
              }
            : {
                background: "rgba(201,205,208,0.06)",
                border: "1px solid rgba(201,205,208,0.15)",
                color: "#BDBDC3",
              }
      }
    >
      {name}
      {code && (
        <span className="font-mono text-[10px]" style={{ color: TEXT_MUTED }}>
          ({code})
        </span>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${name}`}
          className="ml-0.5 -mr-1 rounded px-1 transition-colors"
          style={{ color: TEXT_MUTED }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#E05252")}
          onMouseLeave={(e) => (e.currentTarget.style.color = TEXT_MUTED)}
        >
          ×
        </button>
      )}
    </span>
  );
}

/* ─── ProgressBar ─── */
const toneBar = {
  success: "#36D67E",
  warning: "#C4A574",
  destructive: "#E05252",
} as const;

export function ProgressBar({
  value,
  max = 100,
  tone,
  className,
}: {
  value: number;
  max?: number;
  tone?: keyof typeof toneBar | "primary";
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const barColor = tone && tone !== "primary" ? toneBar[tone] : "#DCDCE0";

  return (
    <div
      className={cn("h-2 w-full overflow-hidden rounded-full", className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemax={max}
      style={{ background: "rgba(201,205,208,0.1)" }}
    >
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${pct}%`, background: barColor }}
      />
    </div>
  );
}

/* ─── ScoreIndicator ─── */
export function ScoreIndicator({
  score,
  label,
  size = 150,
}: {
  score: number;
  label: string;
  size?: number;
}) {
  const tone = scoreTone(score);
  const r = 42;
  const c = 2 * Math.PI * r;

  const reducedMotion = useRef(
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [displayed, setDisplayed] = useState(reducedMotion.current ? score : 0);
  const [offset, setOffset] = useState(reducedMotion.current ? c * (1 - score / 100) : c);
  const prevScore = useRef(score);

  useEffect(() => {
    if (reducedMotion.current) {
      setDisplayed(score);
      setOffset(c * (1 - score / 100));
      prevScore.current = score;
      return;
    }
    if (prevScore.current !== score) {
      setDisplayed(0);
      setOffset(c);
      prevScore.current = score;
    }
    const duration = 900;
    const start = performance.now();
    let rafId: number;
    const tick = (now: number) => {
      const elapsed = Math.min(now - start, duration);
      const eased = 1 - Math.pow(1 - elapsed / duration, 3);
      setDisplayed(Math.round(score * eased));
      setOffset(c * (1 - (score * eased) / 100));
      if (elapsed < duration) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [score, c]);

  const strokeColor =
    tone === "success" ? SUCCESS_GREEN : tone === "warning" ? CHAMPAGNE : DANGER_RED;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="size-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            strokeWidth="6"
            stroke="rgba(201,205,208,0.1)"
          />
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            stroke={strokeColor}
            style={{ transition: reducedMotion.current ? "none" : undefined }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-display text-4xl font-bold tracking-tight"
            style={{ color: strokeColor }}
          >
            {displayed}
          </span>
          <span
            className="font-mono text-[11px] uppercase tracking-wider"
            style={{ color: TEXT_MUTED }}
          >
            / 100
          </span>
        </div>
      </div>
      <p
        className="mt-2.5 text-xs font-semibold uppercase tracking-wider"
        style={{ color: TEXT_MUTED }}
      >
        {label}
      </p>
    </div>
  );
}

/* ─── StatCard ─── */
export function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
}) {
  return (
    <div
      className="rounded-2xl p-5 transition-all"
      style={{
        background: GLASS_BG,
        border: GLASS_BORDER,
        boxShadow: "0 0 0 1px rgba(201,205,208,0.05), 0 4px 16px -4px rgba(0,0,0,0.4)",
      }}
    >
      <div
        className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider"
        style={{ color: TEXT_MUTED }}
      >
        <span>{label}</span>
        {icon && <span style={{ color: CHAMPAGNE }}>{icon}</span>}
      </div>
      <p
        className="mt-3 font-display text-3xl font-bold"
        style={{ color: TEXT_PRIMARY, letterSpacing: "-0.03em" }}
      >
        {value}
      </p>
      {hint && (
        <p className="mt-1 text-xs" style={{ color: TEXT_MUTED }}>
          {hint}
        </p>
      )}
    </div>
  );
}

/* ─── EmptyState ─── */
export function EmptyState({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl px-6 py-12 text-center animate-in fade-in duration-300"
      style={{
        background: "rgba(23,23,27,0.6)",
        border: "1px dashed rgba(201,205,208,0.15)",
      }}
    >
      <div
        className="mb-3 grid size-12 place-items-center rounded-xl"
        style={{
          background: "rgba(196,165,116,0.08)",
          border: "1px solid rgba(196,165,116,0.2)",
        }}
      >
        {icon ?? <Inbox className="size-5" style={{ color: CHAMPAGNE }} />}
      </div>
      <p className="font-display text-lg font-bold" style={{ color: TEXT_PRIMARY }}>
        {title}
      </p>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* ─── LoadingState ─── */
export function LoadingState({ label }: { label: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 rounded-2xl px-6 py-12"
      aria-live="polite"
      style={{
        background: GLASS_BG,
        border: GLASS_BORDER,
      }}
    >
      <Loader2 className="size-6 animate-spin" style={{ color: CHAMPAGNE }} />
      <p className="text-sm font-medium" style={{ color: TEXT_PRIMARY }}>
        {label}
      </p>
      <div className="w-44 space-y-2">
        <div
          className="h-1.5 animate-pulse rounded-full"
          style={{ background: "rgba(201,205,208,0.1)" }}
        />
        <div
          className="h-1.5 w-3/4 animate-pulse rounded-full"
          style={{ background: "rgba(201,205,208,0.07)" }}
        />
      </div>
    </div>
  );
}

/* ─── ErrorState ─── */
export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3.5 rounded-2xl p-5"
      style={{
        background: "rgba(224,82,82,0.06)",
        border: "1px solid rgba(224,82,82,0.2)",
      }}
    >
      <AlertTriangle className="mt-0.5 size-5 shrink-0" style={{ color: DANGER_RED }} />
      <div className="flex-1 text-sm">
        <p className="font-semibold" style={{ color: DANGER_RED }}>
          Something went wrong
        </p>
        <p className="mt-0.5" style={{ color: TEXT_SECONDARY }}>
          {message}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs font-semibold underline underline-offset-2 transition-opacity hover:opacity-80"
          style={{ color: DANGER_RED }}
        >
          Retry
        </button>
      )}
    </div>
  );
}

/* ─── SkillComparisonRow ─── */
export function SkillComparisonRow({
  code,
  candidate,
  required,
}: {
  code: string;
  candidate: number;
  required: number;
}) {
  const gap = candidate < required;
  return (
    <div
      className="grid grid-cols-[3.5rem_1fr_auto] items-center gap-3 py-3 border-b sm:grid-cols-[4rem_10rem_1fr_6rem]"
      style={{ borderColor: "rgba(201,205,208,0.08)" }}
    >
      <CategoryBadge code={code} />
      <span
        className="hidden truncate text-sm font-medium sm:block"
        style={{ color: TEXT_PRIMARY }}
      >
        {categoryName(code)}
      </span>
      <div
        className="relative h-2 rounded-full overflow-hidden"
        style={{ background: "rgba(201,205,208,0.08)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${candidate * 10}%`,
            background: gap ? CHAMPAGNE : SUCCESS_GREEN,
          }}
        />
        <div
          className="absolute inset-y-[-3px] w-0.5 rounded-full"
          style={{
            left: `calc(${required * 10}% - 1px)`,
            background: "#DCDCE0",
          }}
          title={`Required: ${required}`}
        />
      </div>
      <div className="text-right text-xs">
        <span className="font-mono font-semibold" style={{ color: TEXT_PRIMARY }}>
          {candidate}
        </span>
        <span style={{ color: TEXT_MUTED }}> / {required}</span>
        <p
          className="text-[11px] font-medium mt-0.5"
          style={{ color: gap ? DANGER_RED : SUCCESS_GREEN }}
        >
          {gap ? `Gap −${required - candidate}` : "Target Met"}
        </p>
      </div>
    </div>
  );
}
