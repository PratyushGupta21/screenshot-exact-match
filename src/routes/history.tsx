import { createFileRoute, Link } from "@tanstack/react-router";
import { GitCompareArrows, History as HistoryIcon, Radar } from "lucide-react";
import { useState } from "react";
import { EmptyState, PageHeader, Panel, SampleBadge } from "@/components/radix/primitives";
import { pageMeta } from "@/lib/radix/meta";
import { scoreTone } from "@/lib/radix/scoring";
import type { HistoryRecord } from "@/lib/radix/types";
import { getCandidate, getHistory } from "@/services/radix-api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/history")({
  head: () => pageMeta("Analysis History", "Your previous Talent Check and Skill Matching runs."),
  component: HistoryPage,
});

const FILTERS = [
  { value: "all", label: "All" },
  { value: "talent_check", label: "Talent Check" },
  { value: "skill_matching", label: "Skill Matching" },
] as const;

const scoreCls = { success: "text-success", warning: "text-warning", destructive: "text-destructive" };

function TypeLabel({ type }: { type: HistoryRecord["type"] }) {
  const tc = type === "talent_check";
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium">
      {tc ? <Radar className="size-4 text-primary" /> : <GitCompareArrows className="size-4 text-primary" />}
      {tc ? "Talent Check" : "Skill Matching"}
    </span>
  );
}

function Status({ s }: { s: HistoryRecord["status"] }) {
  return (
    <span className={cn("inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold capitalize",
      s === "completed" && "border-success bg-success-soft text-success",
      s === "failed" && "border-destructive bg-destructive-soft text-destructive",
      s === "processing" && "border-warning bg-warning-soft text-warning-foreground")}>{s}</span>
  );
}

function ViewLink({ r }: { r: HistoryRecord }) {
  return (
    <Link to={r.type === "talent_check" ? "/talent-check" : "/skill-matching"} className="text-sm font-semibold text-primary hover:underline">
      View results
    </Link>
  );
}

function HistoryPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["value"]>("all");
  const rows = getHistory().filter((r) => filter === "all" || r.type === filter);
  const score = (r: HistoryRecord) =>
    r.score == null ? <span className="text-muted-foreground">—</span>
      : <span className={cn("font-mono font-bold", scoreCls[scoreTone(r.score)])}>{r.score}</span>;

  return (
    <>
      <PageHeader eyebrow="Records" title="Analysis History" description="Every Talent Check and Skill Matching run in one place."
        actions={<SampleBadge label="Illustrative records" />} />

      <div className="mb-4 flex gap-2" role="tablist">
        {FILTERS.map((f) => (
          <button key={f.value} role="tab" aria-selected={filter === f.value} onClick={() => setFilter(f.value)}
            className={cn("rounded-md px-3 py-1.5 text-sm font-semibold transition-colors",
              filter === f.value ? "brut-sm bg-primary text-primary-foreground" : "border-2 border-transparent hover:bg-muted")}>
            {f.label}
          </button>
        ))}
      </div>

      {!rows.length ? <EmptyState icon={<HistoryIcon className="size-5" />} title="No analyses yet" description="Run a Talent Check or Skill Matching to see it here." /> : (
        <>
          <Panel className="hidden overflow-x-auto p-0 sm:p-0 md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b-2 border-ink bg-muted font-mono text-xs uppercase tracking-wide text-muted-foreground">
                <tr>{["Type", "Company", "Role / JD", "Candidate", "Date", "Score", "Status", ""].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-background">
                    <td className="px-4 py-3"><TypeLabel type={r.type} /></td>
                    <td className="px-4 py-3 font-medium">{r.company}</td>
                    <td className="max-w-[220px] truncate px-4 py-3 text-muted-foreground">{r.role}</td>
                    <td className="px-4 py-3">{getCandidate(r.candidate).profile.name}</td>
                    <td className="px-4 py-3 font-mono text-xs">{r.date}</td>
                    <td className="px-4 py-3">{score(r)}</td>
                    <td className="px-4 py-3"><Status s={r.status} /></td>
                    <td className="px-4 py-3 text-right"><ViewLink r={r} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
          <div className="space-y-3 md:hidden">
            {rows.map((r) => (
              <Panel key={r.id} className="p-4 sm:p-4">
                <div className="flex items-center justify-between"><TypeLabel type={r.type} /><Status s={r.status} /></div>
                <p className="mt-2 font-semibold">{r.company}</p>
                <p className="text-sm text-muted-foreground">{r.role}</p>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span>{getCandidate(r.candidate).profile.name} · <span className="font-mono text-xs">{r.date}</span></span>
                  {score(r)}
                </div>
                <div className="mt-3 border-t border-border pt-3"><ViewLink r={r} /></div>
              </Panel>
            ))}
          </div>
        </>
      )}
    </>
  );
}
