import { createFileRoute, Link } from "@tanstack/react-router";
import {
  GitCompareArrows,
  History as HistoryIcon,
  Radar,
  RotateCcw,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { EmptyState, PageHeader, Panel } from "@/components/radix/primitives";
import { Button } from "@/components/ui/button";
import { pageMeta } from "@/lib/radix/meta";
import { scoreTone } from "@/lib/radix/scoring";
import type { HistoryRecord } from "@/lib/radix/types";
import {
  clearHistory,
  loadHistory,
  resetHistory,
  subscribeHistory,
} from "@/services/history-store";
import { getCandidate } from "@/services/radix-api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/history")({
  head: () => pageMeta("Analysis History", "Your previous Talent Check and Skill Matching runs."),
  component: HistoryPage,
});

const FILTERS = [
  { value: "all", label: "All Runs" },
  { value: "talent_check", label: "Talent Check" },
  { value: "skill_matching", label: "Skill Matching" },
] as const;

const scoreCls = {
  success: "text-emerald-400",
  warning: "text-champagne",
  destructive: "text-rose-400",
};

function TypeLabel({ type }: { type: HistoryRecord["type"] }) {
  const tc = type === "talent_check";
  return (
    <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-200">
      {tc ? (
        <Radar className="size-4 text-emerald-400" />
      ) : (
        <GitCompareArrows className="size-4 text-champagne" />
      )}
      {tc ? "Talent Check" : "Skill Matching"}
    </span>
  );
}

function Status({ s }: { s: HistoryRecord["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize",
        s === "completed" && "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
        s === "failed" && "border-rose-500/30 bg-rose-500/10 text-rose-400",
        s === "processing" && "border-champagne/30 bg-champagne/10 text-champagne",
      )}
    >
      {s}
    </span>
  );
}

function ViewLink({ r }: { r: HistoryRecord }) {
  const to = r.type === "talent_check" ? "/talent-check" : "/skill-matching";
  const search =
    r.type === "talent_check"
      ? { candidate: r.candidateId || r.candidate, company: r.company }
      : { candidate: r.candidateId || r.candidate, jobId: r.jobId || "g-swe" };

  return (
    <Link
      to={to}
      search={search}
      className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-zinc-300 hover:text-champagne transition-colors"
      title="Load and inspect this exact run"
    >
      <span>Inspect</span>
      <ExternalLink className="size-3" />
    </Link>
  );
}

function HistoryPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["value"]>("all");
  const [records, setRecords] = useState<HistoryRecord[]>(loadHistory);

  useEffect(() => {
    const unsub = subscribeHistory(() => setRecords(loadHistory()));
    return unsub;
  }, []);

  const handleReset = () => {
    resetHistory();
    toast.success("History reset to initial benchmark records");
  };

  const handleClear = () => {
    clearHistory();
    toast.info("Analysis history cleared");
  };

  const rows = records.filter((r) => filter === "all" || r.type === filter);

  const resolveCandidateName = (r: HistoryRecord) => {
    if (
      r.candidate &&
      r.candidate !== "my-profile" &&
      r.candidate !== "aarav" &&
      r.candidate !== "meera" &&
      r.candidate !== "rohan"
    ) {
      return r.candidate;
    }
    const cand = getCandidate(r.candidateId || r.candidate);
    return cand?.profile?.name || r.candidate;
  };

  const renderScore = (r: HistoryRecord) => {
    if (r.score == null) return <span className="text-zinc-500">—</span>;
    return (
      <span className={cn("font-mono font-bold text-sm", scoreCls[scoreTone(r.score)])}>
        {r.score}
      </span>
    );
  };

  return (
    <>
      <PageHeader
        eyebrow="Evaluation Audit Log"
        title="Analysis History"
        description="Every executed Talent Check and Skill Matching evaluation is recorded here. Click 'Inspect' to revisit any run."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="glass"
              size="sm"
              onClick={handleReset}
              title="Restore standard sample records"
            >
              <RotateCcw className="size-3.5" /> Reset Demo History
            </Button>
            {records.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="text-zinc-400 hover:text-rose-400"
              >
                <Trash2 className="size-3.5" /> Clear All
              </Button>
            )}
          </div>
        }
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2" role="tablist">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              role="tab"
              aria-selected={filter === f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "rounded-xl px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer",
                filter === f.value
                  ? "bg-champagne text-black shadow-[0_0_15px_rgba(196,165,116,0.3)] font-bold"
                  : "border border-white/10 bg-[#131316] text-zinc-400 hover:text-zinc-100 hover:border-white/25",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <span className="font-mono text-xs text-zinc-500">
          Showing {rows.length} of {records.length} runs
        </span>
      </div>

      {!rows.length ? (
        <EmptyState
          icon={<HistoryIcon className="size-6 text-champagne" />}
          title="No Matching Records Found"
          description={
            filter === "all"
              ? "No evaluation history recorded yet. Run a Talent Check or Skill Match to generate records."
              : `No runs found for filter '${filter}'. Try switching to 'All Runs'.`
          }
          action={
            <Button variant="champagne" onClick={handleReset}>
              <RotateCcw className="size-4" /> Load Sample Run Records
            </Button>
          }
        />
      ) : (
        <>
          <Panel className="hidden overflow-x-auto p-0 sm:p-0 md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 bg-white/5 font-mono text-[11px] uppercase tracking-wider text-zinc-400">
                <tr>
                  {[
                    "Evaluation Type",
                    "Target Entity",
                    "Role / Benchmark",
                    "Candidate",
                    "Timestamp",
                    "Score",
                    "Status",
                    "",
                  ].map((h) => (
                    <th key={h} className="px-5 py-3.5 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {rows.map((r) => (
                  <tr key={r.id} className="transition-colors hover:bg-white/5">
                    <td className="px-5 py-3.5">
                      <TypeLabel type={r.type} />
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-zinc-100">{r.company}</td>
                    <td className="max-w-[220px] truncate px-5 py-3.5 text-zinc-400 text-xs">
                      {r.role}
                    </td>
                    <td className="px-5 py-3.5 text-xs sm:text-sm font-medium text-zinc-200">
                      {resolveCandidateName(r)}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-zinc-500">{r.date}</td>
                    <td className="px-5 py-3.5">{renderScore(r)}</td>
                    <td className="px-5 py-3.5">
                      <Status s={r.status} />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <ViewLink r={r} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>

          <div className="space-y-3 md:hidden">
            {rows.map((r) => (
              <Panel key={r.id} className="p-5 sm:p-5">
                <div className="flex items-center justify-between">
                  <TypeLabel type={r.type} />
                  <Status s={r.status} />
                </div>
                <p className="mt-2 font-semibold text-sm text-zinc-100">{r.company}</p>
                <p className="text-xs text-zinc-400">{r.role}</p>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="font-medium text-zinc-200">{resolveCandidateName(r)}</span>
                  <span className="font-mono text-zinc-500">{r.date}</span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-zinc-400">Score:</span>
                    {renderScore(r)}
                  </div>
                  <ViewLink r={r} />
                </div>
              </Panel>
            ))}
          </div>
        </>
      )}
    </>
  );
}
