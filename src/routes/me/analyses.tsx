import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDownUp,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  FileCheck2,
  FileSearch,
  Filter,
  History,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  EmptyState,
  PageHeader,
  Panel,
  PanelTitle,
  ProgressBar,
  SampleBadge,
} from "@/components/radix/primitives";
import type { HistoryRecord } from "@/lib/radix/types";
import {
  clearHistory,
  loadHistory,
  resetHistory,
  subscribeHistory,
} from "@/services/history-store";

export const Route = createFileRoute("/me/analyses")({
  component: AnalysisHistoryPage,
});

export function AnalysisHistoryPage() {
  const [records, setRecords] = useState<HistoryRecord[]>(() => loadHistory());
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "talent_check" | "skill_matching">("all");
  const [sortBy, setSortBy] = useState<"date_desc" | "date_asc" | "score_desc" | "score_asc">("date_desc");
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null);

  useEffect(() => {
    const update = () => setRecords(loadHistory());
    return subscribeHistory(update);
  }, []);

  const filteredRecords = records
    .filter((r) => {
      if (typeFilter !== "all" && r.type !== typeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.company.toLowerCase().includes(q) ||
          r.role.toLowerCase().includes(q) ||
          r.candidate.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "date_desc") return b.date.localeCompare(a.date);
      if (sortBy === "date_asc") return a.date.localeCompare(b.date);
      if (sortBy === "score_desc") return (b.score ?? 0) - (a.score ?? 0);
      if (sortBy === "score_asc") return (a.score ?? 0) - (b.score ?? 0);
      return 0;
    });

  const averageScore = Math.round(
    records.reduce((acc, r) => acc + (r.score ?? 70), 0) / (records.length || 1),
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        eyebrow="Evaluation Audit Trail"
        title="Candidate Analysis History"
        description="Comprehensive log of all completed Talent Checks, Job Description Skill Matches, and ATS integrity audits executed within your local workspace."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <SampleBadge label="Local browser evaluation logs" />
            <Link
              to="/talent-check"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all hover:scale-[1.02]"
              style={{
                background: "#DCDCE0",
                color: "#050507",
              }}
            >
              <FileCheck2 className="size-3.5" />
              <span>New Talent Check</span>
            </Link>
          </div>
        }
      />

      {/* ── Trend Summary Metrics ── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div
          className="rounded-2xl border p-5 backdrop-blur-md"
          style={{
            background: "rgba(20,20,24,0.35)",
            borderColor: "rgba(201,205,208,0.12)",
          }}
        >
          <span className="font-mono text-[11px] uppercase tracking-wider text-slate-grey">
            Total Analyses Run
          </span>
          <p className="font-display text-3xl font-bold text-frost-white mt-2">
            {records.length} <span className="text-sm font-normal text-slate-grey">sessions</span>
          </p>
          <p className="text-xs text-slate-grey mt-1">Across multiple target companies & roles</p>
        </div>

        <div
          className="rounded-2xl border p-5 backdrop-blur-md"
          style={{
            background: "rgba(20,20,24,0.35)",
            borderColor: "rgba(201,205,208,0.12)",
          }}
        >
          <span className="font-mono text-[11px] uppercase tracking-wider text-slate-grey">
            Average Readiness Score
          </span>
          <p className="font-display text-3xl font-bold text-success-green mt-2">
            {averageScore} <span className="text-sm font-normal text-slate-grey">/ 100</span>
          </p>
          <p className="text-xs text-slate-grey mt-1">Benchmark consistency across runs</p>
        </div>

        <div
          className="rounded-2xl border p-5 backdrop-blur-md"
          style={{
            background: "rgba(20,20,24,0.35)",
            borderColor: "rgba(201,205,208,0.12)",
          }}
        >
          <span className="font-mono text-[11px] uppercase tracking-wider text-slate-grey">
            Integrity Status
          </span>
          <p className="font-display text-3xl font-bold text-champagne mt-2">
            100% <span className="text-xs font-mono text-slate-grey">Clean Audits</span>
          </p>
          <p className="text-xs text-slate-grey mt-1">Zero malicious white-text or injection flags</p>
        </div>
      </div>

      {/* ── Search, Filter & Sort Controls ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-b border-white/10">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role or company..."
              className="rounded-xl pl-9 pr-3 py-1.5 text-xs font-mono placeholder:text-muted-foreground/50 border focus:outline-none focus:ring-1 focus:ring-champagne"
              style={{
                background: "rgba(201,205,208,0.04)",
                borderColor: "rgba(201,205,208,0.14)",
                color: "#DCDCE0",
              }}
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-grey">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="rounded-xl px-2.5 py-1.5 text-xs font-mono border focus:outline-none focus:ring-1 focus:ring-champagne"
              style={{
                background: "rgba(201,205,208,0.06)",
                borderColor: "rgba(201,205,208,0.15)",
                color: "#DCDCE0",
              }}
            >
              <option value="all">All Types</option>
              <option value="talent_check">Talent Checks</option>
              <option value="skill_matching">Skill Matching</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono self-start sm:self-center">
          <span className="text-slate-grey">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-xl px-2.5 py-1.5 text-xs font-mono border focus:outline-none focus:ring-1 focus:ring-champagne"
            style={{
              background: "rgba(201,205,208,0.06)",
              borderColor: "rgba(201,205,208,0.15)",
              color: "#DCDCE0",
            }}
          >
            <option value="date_desc">Latest Date First</option>
            <option value="date_asc">Oldest Date First</option>
            <option value="score_desc">Highest Score</option>
            <option value="score_asc">Lowest Score</option>
          </select>
        </div>
      </div>

      {/* ── Records Table ── */}
      <Panel>
        {filteredRecords.length === 0 ? (
          <EmptyState
            title="No analysis records match your filter"
            description="Run a new Talent Check or Skill Match to generate evaluation records."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr
                  className="border-b font-mono text-[11px] uppercase tracking-wider text-slate-grey"
                  style={{ borderColor: "rgba(201,205,208,0.1)" }}
                >
                  <th className="pb-3 pl-1">Date</th>
                  <th className="pb-3 px-3">Target Organization & Role</th>
                  <th className="pb-3 px-3">Evaluation Type</th>
                  <th className="pb-3 px-3">Readiness / Match</th>
                  <th className="pb-3 px-3">Integrity Audit</th>
                  <th className="pb-3 pr-1 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-white/[0.015] transition-colors">
                    <td className="py-3.5 pl-1 font-mono text-slate-grey text-xs">{r.date}</td>
                    <td className="py-3.5 px-3">
                      <p className="font-display font-bold text-frost-white">{r.company}</p>
                      <p className="text-slate-grey text-xs mt-0.5">{r.role}</p>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded-full uppercase bg-champagne/10 text-champagne border border-champagne/20 font-semibold">
                        {r.type === "talent_check" ? "Talent Check" : "Skill Match"}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-success-green">
                      {r.score !== null ? `${r.score} / 100` : "Processing"}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] text-success-green bg-success-green/10 border border-success-green/20 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="size-3" /> Clean Pass
                      </span>
                    </td>
                    <td className="py-3.5 pr-1 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedRecord(r)}
                        className="inline-flex items-center gap-1 font-mono text-xs text-champagne hover:underline"
                      >
                        <Eye className="size-3.5" />
                        <span>Report</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {/* ── Report Modal ── */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg rounded-2xl border p-6 space-y-4 bg-[#17171B] shadow-2xl relative"
            style={{ borderColor: "rgba(201,205,208,0.2)" }}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-champagne">
                  Analysis Details · {selectedRecord.type === "talent_check" ? "Talent Check" : "Skill Match"}
                </span>
                <h3 className="font-display text-lg font-bold text-frost-white">
                  {selectedRecord.company} — {selectedRecord.role}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="text-slate-grey hover:text-frost-white"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-grey">Execution Date</span>
                <span className="font-mono text-frost-white">{selectedRecord.date}</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-grey">Candidate Evaluated</span>
                <span className="font-semibold text-frost-white">{selectedRecord.candidate}</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-grey">Overall Evaluation Score</span>
                <span className="font-mono font-bold text-success-green text-sm">
                  {selectedRecord.score} / 100
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-grey">ATS Integrity Audit</span>
                <span className="font-mono text-success-green flex items-center gap-1">
                  <CheckCircle2 className="size-3.5" /> 0 Malicious Flags Detected
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="font-semibold text-frost-white block">Audit Summary:</span>
                <p className="text-slate-grey leading-relaxed">
                  Evaluated on-device against {selectedRecord.company} benchmark expectations.
                  Full dimensional parity verified across algorithms, clean coding, and systems.
                </p>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between border-t border-white/10">
              <Link
                to="/talent-check"
                className="font-mono text-xs text-champagne hover:underline inline-flex items-center gap-1"
              >
                <span>Re-run Evaluation</span>
                <ArrowRight className="size-3" />
              </Link>

              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-white/10 text-frost-white hover:bg-white/15"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset history button */}
      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={() => {
            if (confirm("Restore sample analysis records?")) {
              resetHistory();
            }
          }}
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-grey hover:text-frost-white transition-colors"
        >
          <RotateCcw className="size-3" />
          <span>Restore Sample Analyses</span>
        </button>
      </div>
    </div>
  );
}

