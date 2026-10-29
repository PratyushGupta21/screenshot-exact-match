import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Clock,
  Code2,
  Compass,
  FileCheck2,
  FileSearch,
  FileText,
  FolderOpen,
  GitCompareArrows,
  Github,
  Radar,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  User,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  CategoryBadge,
  EmptyState,
  PageHeader,
  Panel,
  PanelTitle,
  ProgressBar,
  SampleBadge,
  ScoreIndicator,
  StatCard,
} from "@/components/radix/primitives";
import { CAIRN_CATEGORIES, categoryName } from "@/lib/radix/categories";
import { pageMeta } from "@/lib/radix/meta";
import { priorityGaps, profileCompletion, scoreTone } from "@/lib/radix/scoring";
import type { HistoryRecord } from "@/lib/radix/types";
import { SAMPLE_CANDIDATES } from "@/mocks/data";
import { loadApplications, type JobApplication } from "@/services/applications-store";
import { loadDeveloperProfiles } from "@/services/developer-profiles-store";
import { subscribeHistory } from "@/services/history-store";
import { SAMPLE_INTEGRITY_AUDITS } from "@/services/integrity-store";
import { getActiveCandidate, saveProfile, subscribeProfile } from "@/services/profile-store";
import { lookupProvenance } from "@/services/provenance-store";
import { getHistory, getJobs, skillMatchSync, talentCheckSync } from "@/services/radix-api";
import { loadRoadmapState, type RoadmapState } from "@/services/roadmap-store";

export const Route = createFileRoute("/dashboard")({
  head: () =>
    pageMeta("Dashboard", "Your talent readiness overview, recent analyses and next steps."),
  component: Dashboard,
});

function Dashboard() {
  const [candidate, setCandidate] = useState(getActiveCandidate);
  const [history, setHistory] = useState<HistoryRecord[]>(getHistory);
  const [applications, setApplications] = useState<JobApplication[]>(() => loadApplications());
  const [roadmap, setRoadmap] = useState<RoadmapState>(() => loadRoadmapState());
  const [selectedDemoId, setSelectedDemoId] = useState<string>("aarav");

  useEffect(() => {
    const onProfile = () => setCandidate(getActiveCandidate());
    const onHistory = () => setHistory(getHistory());
    const unsubP = subscribeProfile(onProfile);
    const unsubH = subscribeHistory(onHistory);
    return () => {
      unsubP();
      unsubH();
    };
  }, []);

  const handleSwitchCandidate = (candId: string) => {
    setSelectedDemoId(candId);
    const demo = SAMPLE_CANDIDATES.find((c) => c.id === candId);
    if (demo) {
      saveProfile(demo.profile);
    }
  };

  const jobs = getJobs();
  const defaultJobId = jobs[0]?.id ?? "g-swe";
  const defaultJob = jobs[0];

  const tc = talentCheckSync("my-profile", "Google LLC");
  const sm = skillMatchSync("my-profile", defaultJobId);
  const completion = profileCompletion(candidate.profile);
  const gaps = priorityGaps(tc);
  const recentHistory = history.slice(0, 5);

  const integrityAudit = SAMPLE_INTEGRITY_AUDITS.aarav;
  const provenanceReport = lookupProvenance("aarav-sharma");

  const latestTalentCheck = history.find((h) => h.type === "talent_check");
  const latestSkillMatch = history.find((h) => h.type === "skill_matching");

  const displayReadinessScore = latestTalentCheck?.score ?? tc.readiness_score;
  const displayMatchScore = latestSkillMatch?.score ?? sm.match_score;

  const activeAppsCount = applications.filter((a) => a.stage !== "rejected").length;
  const completedMilestones = roadmap.tasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* ── Dashboard Header ── */}
      <div
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b"
        style={{ borderColor: "rgba(201,205,208,0.1)" }}
      >
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-champagne" />
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-champagne">
              Talent Intelligence Workspace
            </p>
          </div>
          <h1
            className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-frost-white"
            style={{ letterSpacing: "-0.03em" }}
          >
            Welcome, {candidate.profile.name.split(" ")[0]}
          </h1>
          <p className="text-xs sm:text-sm text-slate-grey leading-relaxed">
            Here is your holistic talent readiness posture against verified hiring standards,
            repository provenance signals, and ATS integrity audits.
          </p>
        </div>

        {/* Candidate Switcher & Primary Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Candidate Switcher */}
          <div className="flex items-center gap-2 rounded-xl p-1.5 border border-white/10 bg-white/[0.02]">
            <span className="text-[11px] font-mono text-slate-grey pl-2">Candidate:</span>
            <select
              value={selectedDemoId}
              onChange={(e) => handleSwitchCandidate(e.target.value)}
              className="rounded-lg px-2 py-1 text-xs font-mono bg-[#17171B] border border-white/10 text-frost-white focus:outline-none focus:border-champagne"
            >
              {SAMPLE_CANDIDATES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.profile.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/resume-parsing"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold uppercase tracking-wider bg-cloud-silver text-obsidian shadow-lg hover:scale-[1.02] transition-all"
            >
              <FileSearch className="size-3.5" />
              <span>Analyze Resume</span>
            </Link>

            <Link
              to="/roadmap"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wider bg-white/5 border border-white/10 text-cloud-silver hover:bg-white/10 transition-colors"
            >
              <Compass className="size-3.5 text-champagne" />
              <span>View Roadmap</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Overview Metrics (6 Cards, Clearly Labeled Demo Data) ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-grey">
            Key Evaluation Indicators
          </span>
          <SampleBadge label="Demonstration Metrics · On-Device Baseline" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <StatCard
            label="Readiness Index"
            value={<span className="text-success-green">{displayReadinessScore} / 100</span>}
            hint="Google Tier-1 Baseline"
            icon={<Target className="size-4" />}
          />
          <StatCard
            label="Role Alignment"
            value={<span className="text-frost-white">{displayMatchScore}%</span>}
            hint={defaultJob?.role.slice(0, 16) ?? "Software Engineer"}
            icon={<GitCompareArrows className="size-4" />}
          />
          <StatCard
            label="ATS Integrity Risk"
            value={<span className="text-champagne">Low · {integrityAudit.overallScore}%</span>}
            hint="0 Hidden Text Flags"
            icon={<ShieldCheck className="size-4" />}
          />
          <StatCard
            label="Git Provenance"
            value={<span className="text-success-green">{provenanceReport.overallScore} / 100</span>}
            hint="14 Public Repositories"
            icon={<Github className="size-4" />}
          />
          <StatCard
            label="Priority Gaps"
            value={<span className="text-danger-red">{gaps.length} categories</span>}
            hint="Below Target Level"
            icon={<AlertCircle className="size-4" />}
          />
          <StatCard
            label="Applications"
            value={<span className="text-frost-white">{activeAppsCount} active</span>}
            hint="1 Offer · 2 Interviewing"
            icon={<Briefcase className="size-4" />}
          />
        </div>
      </div>

      {/* ── Section 1 & 2: Readiness Overview & Skill Gap Analysis ── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Readiness Overview Panel (2 cols) */}
        <Panel className="lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3 mb-5">
            <PanelTitle icon={<Radar className="size-4 text-champagne" />}>
              Readiness & Category Breakdown
            </PanelTitle>
            <span className="font-mono text-[10px] uppercase text-champagne bg-champagne/10 border border-champagne/20 px-2 py-0.5 rounded-full">
              Google Tier-1 Baseline
            </span>
          </div>

          <div className="grid items-center gap-6 sm:grid-cols-[auto_1fr]">
            <div className="flex flex-col items-center">
              <ScoreIndicator
                score={displayReadinessScore}
                label="Hiring Readiness"
                size={145}
              />
              <Link
                to="/talent-check"
                className="mt-2 font-mono text-[11px] text-champagne hover:underline inline-flex items-center gap-1"
              >
                <span>Run New Talent Check</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>

            {/* 12-Dimension Mini Grid */}
            <div className="space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-wider text-slate-grey block mb-1">
                12-Dimension Proficiency Status
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {CAIRN_CATEGORIES.map(({ code }) => {
                  const level = candidate.levels[code] ?? 5;
                  const req = 7;
                  const isMet = level >= req;
                  return (
                    <div
                      key={code}
                      className={`rounded-lg p-2 border font-mono text-xs flex flex-col justify-between ${
                        isMet
                          ? "bg-success-green/10 border-success-green/20 text-success-green"
                          : "bg-white/5 border-white/10 text-mist-silver"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{code}</span>
                        <span>L{level}</span>
                      </div>
                      <span className="text-[10px] text-slate-grey mt-0.5 truncate">
                        {categoryName(code)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Panel>

        {/* Priority Gaps & Next-Best Skills Panel */}
        <Panel>
          <PanelTitle icon={<Target className="size-4" />}>
            Priority Skill Gaps ({gaps.length})
          </PanelTitle>

          <div className="space-y-3">
            {gaps.length === 0 ? (
              <p className="text-xs text-success-green font-medium">
                Outstanding! All benchmark skill dimensions currently meet target criteria.
              </p>
            ) : (
              gaps.slice(0, 4).map((g) => (
                <div
                  key={g.category_code}
                  className="rounded-xl border border-white/5 bg-white/[0.015] p-3 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <CategoryBadge code={g.category_code} />
                      <span className="font-semibold text-frost-white truncate max-w-[120px]">
                        {categoryName(g.category_code)}
                      </span>
                    </div>
                    <span className="font-mono text-danger-red font-semibold">
                      −{g.required_level - g.candidate_level} levels
                    </span>
                  </div>
                  <ProgressBar
                    value={g.candidate_level * 10}
                    max={100}
                    tone="warning"
                    className="h-1.5"
                  />
                </div>
              ))
            )}

            <div className="pt-2">
              <Link
                to="/insights"
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold uppercase tracking-wider bg-white/5 border border-white/10 text-cloud-silver hover:bg-white/10 transition-colors"
              >
                <span>Calibrate All Skills</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>
        </Panel>
      </div>

      {/* ── Section 3 & 4: Integrity Signals & Developer Evidence ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* ATS Integrity Signals */}
        <Panel>
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <PanelTitle icon={<ShieldCheck className="size-4 text-success-green" />}>
              ATS Integrity & Anti-Cheat Signals
            </PanelTitle>
            <Link
              to="/ats-integrity"
              className="font-mono text-xs text-champagne hover:underline inline-flex items-center gap-1"
            >
              <span>Full Scan Report</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>

          <div className="space-y-3.5">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-success-green/[0.06] border border-success-green/20">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="size-4 text-success-green" />
                <span className="font-display text-xs font-bold text-frost-white">
                  Zero Malicious Obfuscation Flags
                </span>
              </div>
              <span className="font-mono text-xs font-bold text-success-green">Low Risk (8/100)</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="rounded-xl border border-white/5 bg-white/[0.015] p-3 space-y-1">
                <span className="text-slate-grey text-[10px] uppercase">Micro-Font Injection</span>
                <p className="font-bold text-success-green">0% Detected</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.015] p-3 space-y-1">
                <span className="text-slate-grey text-[10px] uppercase">Zero-Width Chars</span>
                <p className="font-bold text-success-green">0 Instances</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.015] p-3 space-y-1">
                <span className="text-slate-grey text-[10px] uppercase">Keyword Stuffing</span>
                <p className="font-bold text-champagne">12% Natural Density</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.015] p-3 space-y-1">
                <span className="text-slate-grey text-[10px] uppercase">Verbatim JD Plagiarism</span>
                <p className="font-bold text-success-green">5% Low Parity</p>
              </div>
            </div>

            <p className="text-xs text-slate-grey leading-relaxed">
              Document parse density verified at 94.5%. Layout streams cleanly linearize through
              Workday, Greenhouse, and Lever enterprise parsers.
            </p>
          </div>
        </Panel>

        {/* Developer Evidence (GitHub Provenance) */}
        <Panel>
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <PanelTitle icon={<Github className="size-4" />}>
              Public Repository Evidence & Provenance
            </PanelTitle>
            <Link
              to="/provenance"
              className="font-mono text-xs text-champagne hover:underline inline-flex items-center gap-1"
            >
              <span>Inspect Code Evidence</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>

          <div className="space-y-3.5">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
              <div className="flex items-center gap-3">
                <img
                  src={provenanceReport.avatarUrl}
                  alt={provenanceReport.username}
                  className="size-8 rounded-lg border border-white/10"
                />
                <div>
                  <p className="font-display text-xs font-bold text-frost-white">
                    @{provenanceReport.username}
                  </p>
                  <p className="text-[11px] font-mono text-champagne">
                    {provenanceReport.publicReposCount} Repos · {provenanceReport.totalStars} Stars
                  </p>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-success-green">
                Score {provenanceReport.overallScore} / 100
              </span>
            </div>

            {/* Hygiene Checks Progress */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between font-mono text-[11px] text-slate-grey">
                <span>README & Documentation Coverage</span>
                <span className="text-frost-white font-bold">100%</span>
              </div>
              <ProgressBar value={100} tone="success" className="h-1.5" />

              <div className="flex items-center justify-between font-mono text-[11px] text-slate-grey pt-1">
                <span>Test Suite Presence (Unit / Integration)</span>
                <span className="text-frost-white font-bold">75%</span>
              </div>
              <ProgressBar value={75} tone="success" className="h-1.5" />
            </div>

            <p className="text-[11px] text-slate-grey italic pt-1">
              “Public-code signals provide supporting evidence, not proof of skill or misconduct.”
            </p>
          </div>
        </Panel>
      </div>

      {/* ── Section 5 & 6: Learning Roadmap & Application Pipeline ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Learning Roadmap Widget */}
        <Panel>
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <PanelTitle icon={<Compass className="size-4 text-champagne" />}>
              12-Week Preparation Roadmap
            </PanelTitle>
            <Link
              to="/roadmap"
              className="font-mono text-xs text-champagne hover:underline inline-flex items-center gap-1"
            >
              <span>Interactive Curriculum</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-xs text-slate-grey uppercase block">
                  Current Week 2 Focus
                </span>
                <h4 className="font-display text-sm font-bold text-frost-white mt-0.5">
                  Core Algorithmic Foundations (DSA Sliding Window)
                </h4>
              </div>
              <span className="font-mono text-xs font-bold text-champagne bg-champagne/10 border border-champagne/20 px-2 py-0.5 rounded-full">
                {completedMilestones} / {roadmap.tasks.length} Done
              </span>
            </div>

            <ProgressBar
              value={Math.round((completedMilestones / roadmap.tasks.length) * 100)}
              tone="success"
              className="h-2"
            />

            <div className="space-y-2 pt-1">
              <span className="font-mono text-[11px] text-slate-grey uppercase block">
                Upcoming Milestone Tasks:
              </span>
              {roadmap.tasks.filter((t) => !t.completed).slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className="rounded-lg border border-white/5 bg-white/[0.015] p-2.5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <CategoryBadge code={task.categoryCode} />
                    <span className="truncate text-cloud-silver font-medium">{task.title}</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-grey shrink-0">
                    Week {task.week}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        {/* Application Pipeline Widget */}
        <Panel>
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <PanelTitle icon={<Briefcase className="size-4" />}>
              Application Pipeline ({activeAppsCount} Active)
            </PanelTitle>
            <Link
              to="/me/applications"
              className="font-mono text-xs text-champagne hover:underline inline-flex items-center gap-1"
            >
              <span>Kanban Tracker</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {applications.slice(0, 3).map((app) => (
              <div
                key={app.id}
                className="rounded-xl border border-white/10 bg-white/[0.015] p-3.5 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-display text-sm font-bold text-frost-white">
                      {app.company}
                    </h4>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded-full uppercase bg-white/5 border border-white/10 text-champagne font-semibold">
                      {app.stage}
                    </span>
                  </div>
                  <p className="text-xs text-slate-grey mt-0.5">{app.role}</p>
                </div>

                <div className="text-right font-mono text-xs">
                  {app.matchScore && (
                    <span className="text-success-green font-bold">{app.matchScore}% match</span>
                  )}
                  <p className="text-[10px] text-slate-grey mt-0.5">Applied {app.appliedDate}</p>
                </div>
              </div>
            ))}

            <div className="pt-2">
              <Link
                to="/me/applications"
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold uppercase tracking-wider bg-white/5 border border-white/10 text-cloud-silver hover:bg-white/10 transition-colors"
              >
                <span>Manage All {applications.length} Applications</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>
        </Panel>
      </div>

      {/* ── Section 7 & 8: Recent Analyses Table & Quick Launch ── */}
      <Panel>
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <PanelTitle icon={<Clock className="size-4" />}>
            Recent Candidate Evaluations ({history.length})
          </PanelTitle>
          <Link
            to="/me/analyses"
            className="font-mono text-xs text-champagne hover:underline inline-flex items-center gap-1"
          >
            <span>Full Audit Trail</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>

        {recentHistory.length === 0 ? (
          <EmptyState
            title="No evaluations recorded yet"
            description="Run a Talent Check or Skill Match to generate evaluation sessions."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b font-mono text-[11px] uppercase tracking-wider text-slate-grey border-white/10">
                  <th className="pb-3 pl-1">Target Organization</th>
                  <th className="pb-3 px-3">Role</th>
                  <th className="pb-3 px-3">Evaluation Type</th>
                  <th className="pb-3 px-3">Readiness Score</th>
                  <th className="pb-3 px-3">Date</th>
                  <th className="pb-3 pr-1 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {recentHistory.map((h) => (
                  <tr key={h.id} className="hover:bg-white/[0.015] transition-colors">
                    <td className="py-3 pl-1 font-bold text-frost-white">{h.company}</td>
                    <td className="py-3 px-3 text-slate-grey">{h.role}</td>
                    <td className="py-3 px-3 font-mono text-[10px] uppercase text-champagne">
                      {h.type === "talent_check" ? "Talent Check" : "Skill Match"}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-success-green">
                      {h.score ? `${h.score} / 100` : "—"}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-grey">{h.date}</td>
                    <td className="py-3 pr-1 text-right">
                      <Link
                        to="/me/analyses"
                        className="font-mono text-xs text-champagne hover:underline"
                      >
                        Details →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
