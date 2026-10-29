import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  Compass,
  FileSearch,
  Filter,
  GraduationCap,
  Layers,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import {
  CategoryBadge,
  PageHeader,
  Panel,
  PanelTitle,
  ProgressBar,
  SampleBadge,
} from "@/components/radix/primitives";
import { CAIRN_CATEGORIES, categoryName } from "@/lib/radix/categories";
import type { CategoryCode } from "@/lib/radix/types";
import {
  BENCHMARK_COMPANIES,
  BENCHMARK_ROLES,
  calibrateCandidateSkills,
  type BenchmarkCompany,
  type BenchmarkRole,
} from "@/services/benchmark-store";
import { getActiveCandidate } from "@/services/profile-store";

export const Route = createFileRoute("/insights")({
  component: BenchmarkInsightsPage,
});

export function BenchmarkInsightsPage() {
  const navigate = useNavigate();
  const candidate = getActiveCandidate();

  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("google-tier1");
  const [selectedRoleId, setSelectedRoleId] = useState<string>("backend-mid");

  const company =
    BENCHMARK_COMPANIES.find((c) => c.id === selectedCompanyId) || BENCHMARK_COMPANIES[0]!;
  const role = BENCHMARK_ROLES.find((r) => r.id === selectedRoleId) || BENCHMARK_ROLES[0]!;

  const { gaps, nextBestSkills, overallAlignmentPercentage } = calibrateCandidateSkills(
    candidate.levels,
    role.requiredLevels,
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        eyebrow="Multi-Tier Calibration Engine"
        title="Benchmark Calibration & Next-Best Skills"
        description="Compare your current multi-dimensional skill evaluation against verified company hiring bars and prioritize the top 5 high-leverage skills to close your preparation gaps."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <SampleBadge label="Sample benchmark model · Illustrative expectations" />
            <Link
              to="/roadmap"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all"
              style={{
                background: "rgba(201,205,208,0.06)",
                border: "1px solid rgba(201,205,208,0.15)",
                color: "#DCDCE0",
              }}
            >
              <Compass className="size-3.5" />
              <span>Personalized Roadmap</span>
            </Link>
          </div>
        }
      />

      {/* ── Selectors & Alignment Score Hero ── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Benchmark Pickers */}
        <div className="lg:col-span-2">
          <Panel>
            <PanelTitle icon={<Building2 className="size-4" />}>
              Select Benchmark Baseline
            </PanelTitle>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-grey mb-1.5">
                  Target Organization / Hiring Tier
                </label>
                <select
                  value={selectedCompanyId}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                  className="w-full rounded-xl px-3.5 py-2.5 text-xs font-mono border focus:outline-none focus:ring-1 focus:ring-champagne"
                  style={{
                    background: "rgba(201,205,208,0.06)",
                    borderColor: "rgba(201,205,208,0.15)",
                    color: "#DCDCE0",
                  }}
                >
                  {BENCHMARK_COMPANIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} · {c.tier}
                    </option>
                  ))}
                </select>
                <p className="mt-1.5 text-[11px] text-slate-grey leading-relaxed">
                  {company.description}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-grey mb-1.5">
                  Target Technical Role & Seniority
                </label>
                <select
                  value={selectedRoleId}
                  onChange={(e) => setSelectedRoleId(e.target.value)}
                  className="w-full rounded-xl px-3.5 py-2.5 text-xs font-mono border focus:outline-none focus:ring-1 focus:ring-champagne"
                  style={{
                    background: "rgba(201,205,208,0.06)",
                    borderColor: "rgba(201,205,208,0.15)",
                    color: "#DCDCE0",
                  }}
                >
                  {BENCHMARK_ROLES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} ({r.experienceLevel})
                    </option>
                  ))}
                </select>
                <p className="mt-1.5 text-[11px] font-mono text-champagne">
                  Evaluated across all 12 CAIRN competency dimensions
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-grey">
              <span>
                Candidate Profile: <strong className="text-frost-white">{candidate.profile.name}</strong>
              </span>
              <span className="font-mono text-[11px]">
                Company Baseline: {company.baselineReadiness} / 100
              </span>
            </div>
          </Panel>
        </div>

        {/* Right Col: Overall Match Bar */}
        <div>
          <div
            className="rounded-2xl border p-6 flex flex-col justify-between space-y-4 backdrop-blur-md h-full"
            style={{
              background: "rgba(20,20,24,0.35)",
              borderColor: "rgba(201,205,208,0.12)",
            }}
          >
            <div>
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-champagne mb-1 block">
                Overall Role Alignment
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="font-display text-4xl font-bold text-success-green">
                  {overallAlignmentPercentage}%
                </span>
                <span className="text-xs font-mono text-slate-grey">
                  match against {company.name} {role.experienceLevel} baseline
                </span>
              </div>
              <p className="text-xs text-slate-grey mt-2 leading-relaxed">
                Aggregates point parity between your current 12 skill levels and the target role criteria.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/5">
              <ProgressBar value={overallAlignmentPercentage} tone="success" className="h-2" />
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-grey">
                <span>Critical Gaps: {gaps.filter((g) => g.priority === "Critical").length}</span>
                <span>Met Categories: {gaps.filter((g) => g.isMet).length} / 12</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Top 5 Next-Best Skills Recommendations ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-lg font-bold text-frost-white flex items-center gap-2">
              <Sparkles className="size-4 text-champagne" />
              <span>Next-Best Skills to Prioritize</span>
            </h2>
            <p className="text-xs text-slate-grey mt-0.5">
              The highest return-on-effort skills to advance your readiness for {company.name}.
            </p>
          </div>

          <Link
            to="/roadmap"
            className="font-mono text-xs text-champagne hover:underline inline-flex items-center gap-1"
          >
            <span>Open 12-Week Plan</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {nextBestSkills.map((rec, i) => (
            <div
              key={rec.code}
              className="rounded-2xl border p-5 flex flex-col justify-between space-y-3 backdrop-blur-md transition-all hover:border-white/20"
              style={{
                background: "rgba(20,20,24,0.35)",
                borderColor:
                  rec.priority === "Critical"
                    ? "rgba(224,82,82,0.3)"
                    : "rgba(196,165,116,0.25)",
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-champagne">
                    #{i + 1} Priority
                  </span>
                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 rounded-full uppercase font-bold border ${
                      rec.priority === "Critical"
                        ? "bg-danger-red/10 text-danger-red border-danger-red/25"
                        : "bg-champagne/10 text-champagne border-champagne/25"
                    }`}
                  >
                    {rec.priority} Gap
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-1.5">
                  <CategoryBadge code={rec.code} />
                  <h3 className="font-display text-sm font-bold text-frost-white truncate">
                    {rec.name}
                  </h3>
                </div>

                <p className="text-xs text-slate-grey leading-relaxed line-clamp-3 mb-2">
                  {rec.rationale}
                </p>
              </div>

              <div className="space-y-3 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-grey">
                  <span>Gap: −{rec.gap} levels</span>
                  <span className="text-success-green font-semibold">
                    {rec.expectedReadinessGain}
                  </span>
                </div>

                <Link
                  to="/roadmap"
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold uppercase tracking-wider transition-all bg-white/5 border border-white/10 text-cloud-silver hover:bg-white/10"
                >
                  <span>Week {rec.roadmapWeek} Task</span>
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 12-Dimension Skills Comparison Table & Bars ── */}
      <Panel>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4 mb-4">
          <div>
            <PanelTitle icon={<Target className="size-4" />}>
              12-Dimension Competency Gap Analysis
            </PanelTitle>
            <p className="text-xs text-slate-grey -mt-3">
              White indicator marks required level; colored bar reflects current candidate proficiency.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-grey">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-success-green" /> Met / Exceeded
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-champagne" /> Moderate Gap
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-danger-red" /> Critical Gap
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {gaps.map((item) => {
            const barPct = item.candidateLevel * 10;
            const targetPct = item.requiredLevel * 10;
            const toneColor = item.isMet
              ? "#36D67E"
              : item.priority === "Critical"
                ? "#E05252"
                : "#C4A574";

            return (
              <div
                key={item.code}
                className="rounded-xl border p-3.5 transition-colors hover:bg-white/[0.015]"
                style={{
                  background: "rgba(201,205,208,0.02)",
                  borderColor: "rgba(201,205,208,0.08)",
                }}
              >
                <div className="grid grid-cols-[3.5rem_1fr_auto] items-center gap-4 sm:grid-cols-[4rem_11rem_1fr_6rem]">
                  <CategoryBadge code={item.code} />

                  <span className="hidden truncate text-sm font-semibold text-frost-white sm:block">
                    {item.name}
                  </span>

                  {/* Horizontal Bar with Target Marker */}
                  <div className="space-y-1">
                    <div
                      className="relative h-2.5 rounded-full overflow-hidden"
                      style={{ background: "rgba(201,205,208,0.08)" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${barPct}%`,
                          background: toneColor,
                        }}
                      />
                      {/* Target Tick */}
                      <div
                        className="absolute inset-y-[-2px] w-1 rounded-full shadow"
                        style={{
                          left: `calc(${targetPct}% - 2px)`,
                          background: "#FFFFFF",
                        }}
                        title={`Required: Level ${item.requiredLevel}`}
                      />
                    </div>
                  </div>

                  <div className="text-right text-xs">
                    <span className="font-mono font-bold text-frost-white">
                      {item.candidateLevel}
                    </span>
                    <span className="text-slate-grey"> / {item.requiredLevel}</span>
                    <p
                      className="text-[11px] font-mono font-semibold mt-0.5"
                      style={{ color: toneColor }}
                    >
                      {item.isMet ? "✓ Target Met" : `−${item.gap} levels`}
                    </p>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-grey gap-2">
                  <p className="leading-relaxed">
                    <span className="font-semibold text-mist-silver">Action:</span>{" "}
                    {item.suggestedAction}
                  </p>
                  <Link
                    to="/roadmap"
                    className="font-mono text-[11px] text-champagne hover:underline shrink-0"
                  >
                    Week {item.roadmapWeek} milestone →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

