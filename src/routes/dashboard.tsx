import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  FileSearch,
  FileText,
  GitCompareArrows,
  Radar,
  Sparkles,
  Target,
  UserRound,
  AlertCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  PageHeader,
  Panel,
  PanelTitle,
  ProgressBar,
  SampleBadge,
  ScoreIndicator,
  StatCard,
  CategoryBadge,
} from "@/components/radix/primitives";
import { categoryName } from "@/lib/radix/categories";
import { pageMeta } from "@/lib/radix/meta";
import { priorityGaps, profileCompletion, scoreTone } from "@/lib/radix/scoring";
import type { HistoryRecord } from "@/lib/radix/types";
import { subscribeHistory } from "@/services/history-store";
import { getActiveCandidate, subscribeProfile } from "@/services/profile-store";
import { getHistory, getJobs, skillMatchSync, talentCheckSync } from "@/services/radix-api";

// --- Skeleton helpers ---
function Bone({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`animate-pulse rounded-xl bg-white/5 ${className ?? ""}`} />
  );
}

function DashboardSkeleton() {
  return (
    <div aria-label="Loading dashboard" aria-busy="true">
      {/* Page header skeleton */}
      <div className="mb-8 space-y-2 border-b border-white/10 pb-6">
        <Bone className="h-3 w-28" />
        <Bone className="h-8 w-64" />
        <Bone className="h-4 w-96 max-w-full" />
      </div>

      {/* Hero row: score panels + profile completion */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-[#17171B] p-6 space-y-4">
          <div className="grid sm:grid-cols-[auto_auto_1fr] items-center gap-6">
            <Bone className="size-[140px] rounded-full" />
            <Bone className="size-[140px] rounded-full" />
            <div className="space-y-3">
              <Bone className="h-3 w-24" />
              <Bone className="h-4 w-full" />
              <Bone className="h-4 w-4/5" />
              <Bone className="h-4 w-3/5" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#17171B] p-6 space-y-4">
          <Bone className="h-5 w-36" />
          <Bone className="h-10 w-20" />
          <Bone className="h-2 w-full rounded-full" />
          <Bone className="h-4 w-4/5" />
        </div>
      </div>

      {/* Quick actions row */}
      <Bone className="mt-10 h-6 w-32" />
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-[#17171B] p-5 space-y-2">
            <Bone className="size-10 rounded-xl" />
            <Bone className="h-4 w-3/4" />
            <Bone className="h-3 w-full" />
          </div>
        ))}
      </div>

      {/* Stat cards row */}
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-[#17171B] p-5 space-y-2">
            <Bone className="h-3 w-28" />
            <Bone className="h-9 w-16" />
            <Bone className="h-3 w-36" />
          </div>
        ))}
      </div>

      {/* Bottom panels */}
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-[#17171B] p-6 space-y-3">
            <Bone className="h-5 w-36" />
            <Bone className="h-4 w-full" />
            <Bone className="h-4 w-5/6" />
            <Bone className="h-4 w-4/6" />
          </div>
        ))}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/dashboard")({
  head: () =>
    pageMeta("Dashboard", "Your talent readiness overview, recent analyses and next steps."),
  component: Dashboard,
});

const ACTIONS = [
  {
    to: "/jd-analytics",
    title: "Analyze Job Description",
    desc: "Extract skills from target opening",
    icon: FileSearch,
  },
  {
    to: "/resume-parsing",
    title: "Parse Resume",
    desc: "Ingest skills & experience from CV",
    icon: FileText,
  },
  {
    to: "/profile",
    title: "Candidate Profile",
    desc: "Review credentials & skill taxonomy",
    icon: UserRound,
  },
  {
    to: "/talent-check",
    title: "Run Talent Check",
    desc: "Evaluate readiness across 12 dimensions",
    icon: Radar,
  },
  {
    to: "/skill-matching",
    title: "Run Skill Matching",
    desc: "Calculate direct role intersection",
    icon: GitCompareArrows,
  },
] as const;

function Dashboard() {
  const [hydrated, setHydrated] = useState(false);
  const [candidate, setCandidate] = useState(getActiveCandidate);
  const [history, setHistory] = useState<HistoryRecord[]>(getHistory);

  useEffect(() => {
    setHydrated(true);
    const onProfile = () => setCandidate(getActiveCandidate());
    const onHistory = () => setHistory(getHistory());
    const unsubP = subscribeProfile(onProfile);
    const unsubH = subscribeHistory(onHistory);
    return () => {
      unsubP();
      unsubH();
    };
  }, []);

  const jobs = getJobs();
  const defaultJobId = jobs[0]?.id ?? "g-swe";
  const defaultJob = jobs[0];

  const tc = talentCheckSync("my-profile", "Google LLC");
  const sm = skillMatchSync("my-profile", defaultJobId);
  const completion = profileCompletion(candidate.profile);
  const gaps = priorityGaps(tc);
  const recentHistory = history.slice(0, 4);

  // Check if candidate has recorded runs in history
  const latestTalentCheck = history.find((h) => h.type === "talent_check");
  const latestSkillMatch = history.find((h) => h.type === "skill_matching");

  const displayReadinessScore = latestTalentCheck?.score ?? tc.readiness_score;
  const displayReadinessLabel = latestTalentCheck
    ? `Latest Run · ${latestTalentCheck.company}`
    : "Illustrative Demo · Google LLC";

  const displayMatchScore = latestSkillMatch?.score ?? sm.match_score;
  const displayMatchLabel = latestSkillMatch
    ? `Latest Run · ${latestSkillMatch.role.slice(0, 16)}…`
    : `Illustrative Demo · ${defaultJob?.role.slice(0, 14) ?? "SWE"}…`;

  const firstName = candidate.profile.name.trim()
    ? candidate.profile.name.trim().split(" ")[0]
    : "Candidate";

  return !hydrated ? (
    <DashboardSkeleton />
  ) : (
    <>
      <PageHeader
        eyebrow="Analytical Workspace"
        title={`Welcome back, ${firstName}`}
        description="Here is your technical readiness posture against verified hiring standards and job requirements."
        actions={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 font-mono text-[11px] font-medium text-zinc-300 shadow-sm backdrop-blur-md">
              <span
                className={`size-1.5 rounded-full ${latestTalentCheck ? "bg-emerald-400" : "bg-champagne"}`}
              />
              {latestTalentCheck
                ? "Calculated from Your Analysis"
                : "Interactive Demonstration State"}
            </span>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-champagne">
              Core Technical Evaluation
            </span>
            <span className="rounded-full border border-champagne/30 bg-champagne/10 px-2.5 py-0.5 font-mono text-[10px] text-champagne">
              {latestTalentCheck ? "Derived from your evaluation" : "Demo baseline: Google Tier-1"}
            </span>
          </div>

          <div className="grid items-center gap-6 sm:grid-cols-[auto_auto_1fr]">
            <ScoreIndicator
              score={displayReadinessScore}
              label={displayReadinessLabel}
              size={135}
            />
            <ScoreIndicator score={displayMatchScore} label={displayMatchLabel} size={135} />
            <div className="space-y-3">
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Priority Gaps
              </p>
              {gaps.length === 0 ? (
                <p className="text-xs text-emerald-400 font-medium">
                  All benchmark categories met for this target!
                </p>
              ) : (
                gaps.map((g) => (
                  <div key={g.category_code} className="flex items-center gap-2.5">
                    <CategoryBadge code={g.category_code} />
                    <span className="flex-1 truncate text-xs font-medium text-zinc-200">
                      {categoryName(g.category_code)}
                    </span>
                    <span className="font-mono text-xs font-semibold text-rose-400">
                      −{g.required_level - g.candidate_level}
                    </span>
                  </div>
                ))
              )}
              <Link
                to="/talent-check"
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-300 hover:text-champagne transition-colors pt-1"
              >
                <span>Inspect all 12 categories</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </Panel>

        <Panel>
          <PanelTitle icon={<UserRound className="size-4 text-champagne" />}>
            Profile Completion
          </PanelTitle>
          <p className="font-display text-4xl font-bold text-zinc-100">{completion}%</p>
          <ProgressBar value={completion} tone={scoreTone(completion)} className="mt-3" />
          <p className="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed">
            {completion < 70
              ? "Add more skills, certifications, and experience to increase readiness evaluation accuracy."
              : "Your profile has high fidelity and is primed for multi-role comparison."}
          </p>
          <Link
            to="/profile"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-300 hover:text-champagne transition-colors"
          >
            <span>{completion < 100 ? "Complete profile" : "Review profile"}</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </Panel>
      </div>

      <div className="mt-12 flex items-center justify-between border-b border-white/10 pb-3">
        <h2 className="font-display text-lg font-bold text-zinc-100">Quick Actions</h2>
        <span className="text-xs font-mono text-zinc-400">5 Workspace Modules</span>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {ACTIONS.map(({ to, title, desc, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-[#17171B] p-5 shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-all hover:border-champagne/40 hover:bg-[#1C1C22] hover:-translate-y-0.5"
          >
            <div>
              <span className="mb-3.5 grid size-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-champagne transition-colors group-hover:border-champagne group-hover:bg-champagne group-hover:text-black">
                <Icon className="size-4.5" />
              </span>
              <span className="block font-display text-sm font-bold text-zinc-100 leading-snug group-hover:text-white transition-colors">
                {title}
              </span>
              <span className="mt-1.5 block text-xs text-zinc-400 leading-relaxed">{desc}</span>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-zinc-300 group-hover:text-champagne transition-colors">
              <span>Launch</span>
              <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Skills on active profile"
          value={candidate.profile.skills.length}
          hint="From CV parsing and manual additions"
          icon={<Sparkles className="size-4" />}
        />
        <StatCard
          label="Categories meeting bar"
          value={`${tc.skillset_gap.filter((g) => !g.gap).length}/12`}
          hint="Google LLC hiring benchmark"
          icon={<Target className="size-4" />}
        />
        <StatCard
          label="Matched JD skills"
          value={`${sm.matched_skills.length}/${sm.matched_skills.length + sm.missing_skills.length}`}
          hint={`${defaultJob?.role ?? "Active Job"}`}
          icon={<GitCompareArrows className="size-4" />}
        />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Panel>
          <PanelTitle
            action={
              <Link
                to="/history"
                className="text-xs font-semibold text-zinc-400 hover:text-champagne transition-colors"
              >
                View all ({history.length}) →
              </Link>
            }
          >
            Recent Analyses
          </PanelTitle>
          {recentHistory.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 bg-white/5 p-6 text-center text-xs text-zinc-400">
              <p>No analysis runs yet. Try running Talent Check or Skill Matching!</p>
            </div>
          ) : (
            <ul className="divide-y divide-white/10">
              {recentHistory.map((h) => (
                <li key={h.id} className="flex items-center gap-3 py-3">
                  <span className="grid size-8 place-items-center rounded-lg border border-white/10 bg-white/5 text-zinc-300">
                    {h.type === "talent_check" ? (
                      <Radar className="size-3.5 text-champagne" />
                    ) : (
                      <GitCompareArrows className="size-3.5 text-champagne" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-zinc-200">{h.company}</p>
                    <p className="truncate text-[11px] text-zinc-400">
                      {h.role} · {h.date}
                    </p>
                  </div>
                  <span className="font-mono text-xs font-bold text-zinc-100">
                    {h.score ?? "—"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel>
          <PanelTitle>Recommended Next Actions</PanelTitle>
          <ol className="space-y-3">
            {[
              ...gaps
                .slice(0, 2)
                .map(
                  (g) =>
                    `Raise ${categoryName(g.category_code)} from Level ${g.candidate_level} to ${g.required_level} — target high-impact problem sets.`,
                ),
              ...sm.missing_skills
                .slice(0, 2)
                .map(
                  (s) =>
                    `Target required skill “${s}” in ${defaultJob?.role ?? "target JD"} by preparing sample evidence.`,
                ),
            ].map((t, i) => (
              <li key={t} className="flex gap-3 text-xs sm:text-sm">
                <span className="grid size-5 shrink-0 place-items-center rounded-md bg-champagne/10 border border-champagne/30 font-mono text-[11px] font-semibold text-champagne">
                  {i + 1}
                </span>
                <span className="text-zinc-300 leading-relaxed">{t}</span>
              </li>
            ))}
            {gaps.length === 0 && sm.missing_skills.length === 0 && (
              <li className="flex items-center gap-2 text-xs sm:text-sm text-emerald-400 font-medium">
                <AlertCircle className="size-4" /> Outstanding readiness across benchmarks!
              </li>
            )}
          </ol>
        </Panel>
      </div>
    </>
  );
}
