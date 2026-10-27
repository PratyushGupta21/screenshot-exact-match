import { AlertTriangle, FlaskConical, Inbox, Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { categoryName } from "@/lib/radix/categories";
import { scoreTone } from "@/lib/radix/scoring";
import type { Confidence } from "@/lib/radix/types";
import { cn } from "@/lib/utils";

export function PageHeader({ title, description, actions, eyebrow }: {
  title: string; description?: string; actions?: ReactNode; eyebrow?: string;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
        )}
        <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ children, className, variant = "soft" }: {
  children: ReactNode; className?: string; variant?: "soft" | "brut";
}) {
  return (
    <section
      className={cn(
        "rounded-xl bg-card p-5 sm:p-6",
        variant === "brut" ? "brut" : "border border-border shadow-soft",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function PanelTitle({ children, action, icon }: { children: ReactNode; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="flex items-center gap-2 text-lg font-bold">{icon}{children}</h2>
      {action}
    </div>
  );
}

export function SampleBadge({ label = "Sample data" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-dashed border-warning bg-warning-soft px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wide text-warning-foreground">
      <FlaskConical className="size-3" /> {label}
    </span>
  );
}

export function CategoryBadge({ code, showName = false }: { code: string; showName?: boolean }) {
  return (
    <span
      title={categoryName(code)}
      className="inline-flex items-center gap-1 rounded border border-ink bg-primary-soft px-1.5 py-0.5 font-mono text-[11px] font-bold text-accent-foreground"
    >
      {code}{showName && <span className="font-sans font-medium">· {categoryName(code)}</span>}
    </span>
  );
}

const confStyles: Record<Confidence, string> = {
  high: "bg-success-soft text-success border-success",
  medium: "bg-warning-soft text-warning-foreground border-warning",
  low: "bg-muted text-muted-foreground border-input",
};

export function ConfidenceBadge({ level }: { level: Confidence }) {
  return (
    <span className={cn("inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize", confStyles[level])}>
      {level}
    </span>
  );
}

export function SkillChip({ name, code, tone = "default", onRemove }: {
  name: string; code?: string; tone?: "default" | "matched" | "missing"; onRemove?: () => void;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-sm font-medium",
        tone === "default" && "border-ink bg-card",
        tone === "matched" && "border-success bg-success-soft text-foreground",
        tone === "missing" && "border-dashed border-destructive bg-destructive-soft text-foreground",
      )}
    >
      {name}
      {code && <span className="font-mono text-[10px] font-bold text-muted-foreground">{code}</span>}
      {onRemove && (
        <button
          type="button" onClick={onRemove} aria-label={`Remove ${name}`}
          className="-mr-1 rounded px-1 text-muted-foreground hover:bg-destructive-soft hover:text-destructive"
        >×</button>
      )}
    </span>
  );
}

const toneBar = { success: "bg-success", warning: "bg-warning", destructive: "bg-destructive" } as const;
const toneText = { success: "text-success", warning: "text-warning", destructive: "text-destructive" } as const;

export function ProgressBar({ value, max = 100, tone, className }: {
  value: number; max?: number; tone?: keyof typeof toneBar | "primary"; className?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={cn("h-2.5 w-full overflow-hidden rounded-full border border-ink bg-muted", className)}
      role="progressbar" aria-valuenow={value} aria-valuemax={max}>
      <div className={cn("h-full transition-all duration-700", tone && tone !== "primary" ? toneBar[tone] : "bg-primary")}
        style={{ width: `${pct}%` }} />
    </div>
  );
}

export function ScoreIndicator({ score, label, size = 160 }: { score: number; label: string; size?: number }) {
  const tone = scoreTone(score);
  const r = 42;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="size-full -rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" strokeWidth="10" className="stroke-muted" />
          <circle
            cx="50" cy="50" r={r} fill="none" strokeWidth="10" strokeLinecap="round"
            strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)}
            className={cn("transition-all duration-1000",
              tone === "success" ? "stroke-success" : tone === "warning" ? "stroke-warning" : "stroke-destructive")}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-display text-4xl font-bold", toneText[tone])}>{score}</span>
          <span className="text-xs text-muted-foreground">/ 100</span>
        </div>
      </div>
      <p className="mt-2 text-sm font-semibold">{label}</p>
    </div>
  );
}

export function StatCard({ label, value, hint, icon }: { label: string; value: ReactNode; hint?: string; icon?: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-soft">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        {label}{icon}
      </div>
      <p className="mt-2 font-display text-3xl font-bold">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function EmptyState({ title, description, icon, action }: {
  title: string; description?: string; icon?: ReactNode; action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-input bg-grid px-6 py-12 text-center">
      <div className="mb-3 grid size-12 place-items-center rounded-lg brut-sm bg-card">{icon ?? <Inbox className="size-5" />}</div>
      <p className="font-display text-lg font-bold">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function LoadingState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card px-6 py-12" aria-live="polite">
      <Loader2 className="size-7 animate-spin text-primary" />
      <p className="text-sm font-medium">{label}</p>
      <div className="w-48 space-y-2">
        <div className="h-2 animate-pulse rounded bg-muted" />
        <div className="h-2 w-3/4 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex items-start gap-3 rounded-xl border-2 border-destructive bg-destructive-soft p-4">
      <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />
      <div className="flex-1 text-sm">
        <p className="font-semibold text-destructive">Something went wrong</p>
        <p className="text-foreground">{message}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="text-sm font-semibold text-destructive underline underline-offset-2">Retry</button>
      )}
    </div>
  );
}

export function SkillComparisonRow({ code, candidate, required }: { code: string; candidate: number; required: number }) {
  const gap = candidate < required;
  return (
    <div className="grid grid-cols-[3.5rem_1fr_auto] items-center gap-3 py-2.5 sm:grid-cols-[4rem_10rem_1fr_6rem]">
      <CategoryBadge code={code} />
      <span className="hidden truncate text-sm sm:block">{categoryName(code)}</span>
      <div className="relative h-5 rounded-md border border-ink bg-muted">
        <div className={cn("h-full rounded-[5px] transition-all duration-700", gap ? "bg-warning" : "bg-success")}
          style={{ width: `${candidate * 10}%` }} />
        <div className="absolute inset-y-[-4px] w-0.5 bg-ink" style={{ left: `calc(${required * 10}% - 1px)` }}
          title={`Required: ${required}`} />
      </div>
      <div className="text-right text-xs">
        <span className="font-mono font-bold">{candidate}</span>
        <span className="text-muted-foreground"> / {required}</span>
        <p className={cn("font-semibold", gap ? "text-destructive" : "text-success")}>
          {gap ? `Gap −${required - candidate}` : "Met"}
        </p>
      </div>
    </div>
  );
}
