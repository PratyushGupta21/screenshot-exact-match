import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Code2,
  ExternalLink,
  FileCheck2,
  GitBranch,
  GitCommit,
  GitFork,
  Github,
  HelpCircle,
  Info,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import {
  PageHeader,
  Panel,
  PanelTitle,
  ProgressBar,
  SampleBadge,
  ScoreIndicator,
} from "@/components/radix/primitives";
import {
  lookupProvenance,
  type ProvenanceReport,
  type RepoEvidenceItem,
} from "@/services/provenance-store";

export const Route = createFileRoute("/provenance")({
  component: GitProvenancePage,
});

export function GitProvenancePage() {
  const [handleInput, setHandleInput] = useState("aarav-sharma");
  const [report, setReport] = useState<ProvenanceReport>(() =>
    lookupProvenance("aarav-sharma"),
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleInput.trim()) return;
    setReport(lookupProvenance(handleInput));
  };

  const loadPreset = (user: string) => {
    setHandleInput(user);
    setReport(lookupProvenance(user));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        eyebrow="Public Code Verification"
        title="Git Provenance & Public Code Evidence"
        description="Analyzes public code repositories to verify resume project claims, examine commit consistency, and evaluate engineering hygiene across test suites and CI workflows."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <SampleBadge label="Sample code evidence snapshot" />
            <Link
              to="/developer-profiles"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all"
              style={{
                background: "rgba(201,205,208,0.06)",
                border: "1px solid rgba(201,205,208,0.15)",
                color: "#DCDCE0",
              }}
            >
              <Github className="size-3.5" />
              <span>Manage Social Profiles</span>
            </Link>
          </div>
        }
      />

      {/* ── Prominent Notice ── */}
      <div
        className="rounded-2xl border p-4 sm:p-5 flex items-start gap-3.5 text-xs text-slate-grey"
        style={{
          background: "rgba(196,165,116,0.05)",
          borderColor: "rgba(196,165,116,0.2)",
        }}
      >
        <Info className="size-5 shrink-0 text-champagne mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-frost-white">
            “Public-code signals provide supporting evidence, not proof of skill or misconduct.”
          </p>
          <p className="leading-relaxed">
            Many talented engineers build proprietary software within private enterprise organizations or under NDAs.
            CAIRN treats open-source activity as positive corroborating proof points, never as a negative penalty.
          </p>
        </div>
      </div>

      {/* ── Search Input & Quick Presets ── */}
      <Panel>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch gap-3">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-grey">
              <Github className="size-4" />
            </div>
            <input
              type="text"
              value={handleInput}
              onChange={(e) => setHandleInput(e.target.value)}
              placeholder="Enter GitHub username or repository URL (e.g. aarav-sharma, meera-iyer)..."
              className="w-full rounded-xl pl-10 pr-4 py-3 text-xs font-mono placeholder:text-muted-foreground/50 transition-colors focus:outline-none focus:ring-1 focus:ring-champagne"
              style={{
                background: "rgba(201,205,208,0.04)",
                border: "1px solid rgba(201,205,208,0.14)",
                color: "#DCDCE0",
              }}
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-xs font-semibold uppercase tracking-wider transition-all hover:scale-[1.02] shadow-lg"
            style={{
              background: "#DCDCE0",
              color: "#050507",
            }}
          >
            <Search className="size-4" />
            <span>Analyze Public Profile</span>
          </button>
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-white/5 text-xs text-slate-grey">
          <span className="font-mono text-[11px]">Quick Samples:</span>
          {[
            { label: "Aarav Sharma (Backend & Go)", user: "aarav-sharma" },
            { label: "Meera Iyer (ML & PyTorch)", user: "meera-iyer" },
            { label: "Alex River (Full Stack)", user: "alex-river" },
          ].map((preset) => (
            <button
              key={preset.user}
              type="button"
              onClick={() => loadPreset(preset.user)}
              className="rounded-lg px-2.5 py-1 text-xs font-mono transition-colors hover:text-frost-white hover:bg-white/10"
              style={{
                background: "rgba(201,205,208,0.04)",
                border: "1px solid rgba(201,205,208,0.1)",
                color: handleInput === preset.user ? "#C4A574" : "#85858E",
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </Panel>

      {/* ── Profile Summary & Score Ring Hero ── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div
          className="rounded-2xl border p-6 flex flex-col justify-between space-y-4 backdrop-blur-md"
          style={{
            background: "rgba(20,20,24,0.35)",
            borderColor: "rgba(201,205,208,0.12)",
          }}
        >
          <div>
            <div className="flex items-center gap-3.5 mb-3">
              <img
                src={report.avatarUrl}
                alt={report.username}
                className="size-12 rounded-xl border border-white/10"
              />
              <div>
                <h3 className="font-display text-lg font-bold text-frost-white">
                  {report.fullName}
                </h3>
                <p className="font-mono text-xs text-champagne">@{report.username}</p>
              </div>
            </div>
            <p className="text-xs text-slate-grey leading-relaxed">{report.bio}</p>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/5 text-center">
            <div className="rounded-xl p-2.5 bg-white/[0.02] border border-white/5">
              <span className="block font-mono text-lg font-bold text-frost-white">
                {report.publicReposCount}
              </span>
              <span className="text-[10px] font-mono text-slate-grey uppercase">Repos</span>
            </div>
            <div className="rounded-xl p-2.5 bg-white/[0.02] border border-white/5">
              <span className="block font-mono text-lg font-bold text-champagne">
                {report.totalStars}
              </span>
              <span className="text-[10px] font-mono text-slate-grey uppercase">Stars</span>
            </div>
            <div className="rounded-xl p-2.5 bg-white/[0.02] border border-white/5">
              <span className="block font-mono text-lg font-bold text-frost-white">
                {report.accountAgeYears}y
              </span>
              <span className="text-[10px] font-mono text-slate-grey uppercase">Age</span>
            </div>
          </div>
        </div>

        {/* Provenance Score Ring & Weighted Breakdown */}
        <div
          className="lg:col-span-2 rounded-2xl border p-6 sm:p-7 flex flex-col sm:flex-row items-center gap-6 justify-between backdrop-blur-md"
          style={{
            background: "rgba(20,20,24,0.35)",
            borderColor: "rgba(201,205,208,0.12)",
          }}
        >
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-champagne mb-1">
              Deterministic Evidence Model
            </span>
            <h2 className="font-display text-2xl font-bold text-frost-white">
              Git Provenance Score:{" "}
              <span className="text-success-green">{report.overallScore}</span>
              <span className="text-sm font-normal text-slate-grey"> / 100</span>
            </h2>
            <p className="text-xs text-slate-grey mt-1 max-w-sm leading-relaxed">
              Synthesized from repository code volume, consistency of commit activity, and
              observable engineering hygiene (CI, tests, and documentation).
            </p>
          </div>

          {/* 4-Part Weighted Model */}
          <div className="w-full sm:w-72 space-y-2.5 pt-2 sm:pt-0">
            {[
              {
                label: "Claim Support (40%)",
                score: report.scoreBreakdown.claimSupport.score,
                contrib: report.scoreBreakdown.claimSupport.contribution,
              },
              {
                label: "Repository Strength (30%)",
                score: report.scoreBreakdown.repoStrength.score,
                contrib: report.scoreBreakdown.repoStrength.contribution,
              },
              {
                label: "Activity Consistency (20%)",
                score: report.scoreBreakdown.activityConsistency.score,
                contrib: report.scoreBreakdown.activityConsistency.contribution,
              },
              {
                label: "Engineering Hygiene (10%)",
                score: report.scoreBreakdown.engineeringHygiene.score,
                contrib: report.scoreBreakdown.engineeringHygiene.contribution,
              },
            ].map((part) => (
              <div key={part.label} className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-grey">{part.label}</span>
                  <span className="text-frost-white font-semibold">
                    {part.score}% (+{part.contrib})
                  </span>
                </div>
                <ProgressBar value={part.score} tone="warning" className="h-1.5" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Claim Verification Table ── */}
      <Panel>
        <PanelTitle icon={<ShieldCheck className="size-4" />}>
          Resume Claims vs Public Code Evidence
        </PanelTitle>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr
                className="border-b font-mono text-[11px] uppercase tracking-wider text-slate-grey"
                style={{ borderColor: "rgba(201,205,208,0.1)" }}
              >
                <th className="pb-3 pl-1">Resume Skill / Claim</th>
                <th className="pb-3 px-3">Category</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3">Backing Repository</th>
                <th className="pb-3 pr-1">Evidence Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {report.claims.map((claim, i) => (
                <tr key={i} className="hover:bg-white/[0.015] transition-colors">
                  <td className="py-3.5 pl-1 font-semibold text-frost-white max-w-xs">
                    {claim.claim}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-champagne text-[11px]">
                    {claim.category}
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase"
                      style={{
                        background:
                          claim.status === "Evidence found"
                            ? "rgba(54,214,126,0.1)"
                            : "rgba(196,165,116,0.1)",
                        color:
                          claim.status === "Evidence found" ? "#36D67E" : "#C4A574",
                        border: `1px solid ${
                          claim.status === "Evidence found"
                            ? "rgba(54,214,126,0.25)"
                            : "rgba(196,165,116,0.25)"
                        }`,
                      }}
                    >
                      {claim.status === "Evidence found" ? (
                        <CheckCircle2 className="size-3" />
                      ) : (
                        <HelpCircle className="size-3" />
                      )}
                      {claim.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-grey">
                    {claim.backingRepo ? (
                      <span className="text-cloud-silver underline underline-offset-2">
                        {claim.backingRepo}
                      </span>
                    ) : (
                      <span className="text-slate-grey italic">Not observed in sample</span>
                    )}
                  </td>
                  <td className="py-3.5 pr-1 text-slate-grey leading-relaxed max-w-sm">
                    {claim.evidenceNotes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* ── 12-Month Commit Cadence & Engineering Hygiene ── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Commit Cadence Graph (Horizontal Monthly Bars) */}
        <div className="lg:col-span-2">
          <Panel>
            <PanelTitle icon={<GitCommit className="size-4" />}>
              12-Month Commit Activity Cadence
            </PanelTitle>
            <p className="text-xs text-slate-grey mb-6 leading-relaxed">
              Visualizes sustained engineering momentum across branch merges and production commits:
            </p>

            <div className="space-y-2.5">
              {report.commitTimeline.map((pt) => {
                const maxCommits = 100;
                const pct = Math.min(100, Math.round((pt.commits / maxCommits) * 100));
                return (
                  <div key={pt.month} className="grid grid-cols-[3.5rem_1fr_4rem] items-center gap-3 text-xs">
                    <span className="font-mono text-slate-grey text-[11px]">{pt.month}</span>
                    <div
                      className="h-4 rounded-md overflow-hidden flex items-center"
                      style={{ background: "rgba(201,205,208,0.06)" }}
                    >
                      <div
                        className="h-full rounded-md transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          background: "linear-gradient(90deg, #C4A574 0%, #36D67E 100%)",
                        }}
                      />
                    </div>
                    <span className="font-mono text-right text-frost-white font-semibold text-[11px]">
                      {pt.commits} commits
                    </span>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>

        {/* Engineering Hygiene Scorecard */}
        <div>
          <Panel>
            <PanelTitle icon={<FileCheck2 className="size-4" />}>
              Engineering Hygiene
            </PanelTitle>

            <div className="space-y-4">
              {[
                { label: "README Documentation Coverage", value: report.hygieneSummary.readmeCoverage },
                { label: "Test Suite Presence (pytest/unit)", value: report.hygieneSummary.testSuiteCoverage },
                { label: "CI Automation (GitHub Actions)", value: report.hygieneSummary.ciAutomationCoverage },
                { label: "Open Source Licensing (MIT/Apache)", value: report.hygieneSummary.openSourceLicenses },
              ].map((h) => (
                <div key={h.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-grey">{h.label}</span>
                    <span className="text-frost-white font-bold">{h.value}%</span>
                  </div>
                  <ProgressBar value={h.value} tone="success" className="h-2" />
                </div>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-white/5 space-y-2">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-champagne block">
                Suggested Improvements
              </span>
              <ul className="space-y-2 text-xs text-slate-grey">
                {report.suggestedImprovements.map((imp, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-champagne font-bold">•</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Panel>
        </div>
      </div>

      {/* ── Public Repository Evidence Table ── */}
      <Panel>
        <PanelTitle icon={<Code2 className="size-4" />}>
          Verified Public Repositories ({report.repositories.length})
        </PanelTitle>

        <div className="grid gap-4 sm:grid-cols-2">
          {report.repositories.map((repo) => (
            <div
              key={repo.name}
              className="rounded-xl border p-4 flex flex-col justify-between space-y-3 transition-colors hover:border-white/20"
              style={{
                background: "rgba(201,205,208,0.02)",
                borderColor: "rgba(201,205,208,0.1)",
              }}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-sm font-bold text-frost-white hover:text-champagne cursor-pointer">
                    {repo.name}
                  </span>
                  <span
                    className="font-mono text-[10px] px-2 py-0.5 rounded-md border"
                    style={{
                      background: "rgba(196,165,116,0.08)",
                      borderColor: "rgba(196,165,116,0.25)",
                      color: "#C4A574",
                    }}
                  >
                    {repo.language}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-slate-grey leading-relaxed">
                  {repo.description}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-grey">
                  <span className="inline-flex items-center gap-1">
                    <Star className="size-3 text-champagne" /> {repo.stars}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <GitFork className="size-3" /> {repo.forks}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <GitCommit className="size-3" /> {repo.commits} commits
                  </span>
                  <span className="ml-auto text-[11px] text-muted-foreground">
                    Updated {repo.updatedAt}
                  </span>
                </div>

                {/* Hygiene tags */}
                <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                  <span
                    className={`px-1.5 py-0.5 rounded ${
                      repo.hasReadme
                        ? "bg-success-green/10 text-success-green border border-success-green/20"
                        : "bg-white/5 text-slate-grey"
                    }`}
                  >
                    README {repo.hasReadme ? "✓" : "✗"}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded ${
                      repo.hasTests
                        ? "bg-success-green/10 text-success-green border border-success-green/20"
                        : "bg-white/5 text-slate-grey"
                    }`}
                  >
                    Tests {repo.hasTests ? "✓" : "✗"}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded ${
                      repo.hasCi
                        ? "bg-success-green/10 text-success-green border border-success-green/20"
                        : "bg-white/5 text-slate-grey"
                    }`}
                  >
                    CI Pipeline {repo.hasCi ? "✓" : "✗"}
                  </span>
                  {repo.licenseName && (
                    <span className="px-1.5 py-0.5 rounded bg-white/5 text-slate-grey border border-white/10">
                      {repo.licenseName}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

