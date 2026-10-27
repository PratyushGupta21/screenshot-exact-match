import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, FileSearch, FileText, GitCompareArrows, Radar, Sparkles, Target, UserRound,
} from "lucide-react";
import {
  PageHeader, Panel, PanelTitle, ProgressBar, SampleBadge, ScoreIndicator, StatCard, CategoryBadge,
} from "@/components/radix/primitives";
import { categoryName } from "@/lib/radix/categories";
import { pageMeta } from "@/lib/radix/meta";
import { priorityGaps, profileCompletion, scoreTone } from "@/lib/radix/scoring";
import { getCandidate, getHistory, skillMatchSync, talentCheckSync } from "@/services/radix-api";

export const Route = createFileRoute("/")({
  head: () => pageMeta("Dashboard", "Your talent readiness overview, recent analyses and next steps."),
  component: Dashboard,
});

const ACTIONS = [
  { to: "/jd-analytics", title: "Analyze a job description", desc: "Extract required skills from a JD", icon: FileSearch },
  { to: "/resume-parsing", title: "Parse a resume", desc: "Pull skills & experience from your CV", icon: FileText },
  { to: "/profile", title: "Edit candidate profile", desc: "Keep your skills up to date", icon: UserRound },
  { to: "/talent-check", title: "Run Talent Check", desc: "Company readiness across 12 categories", icon: Radar },
  { to: "/skill-matching", title: "Run Skill Matching", desc: "Compare against a specific job", icon: GitCompareArrows },
] as const;

function Dashboard() {
  const candidate = getCandidate("aarav");
  const tc = talentCheckSync("aarav", "Google LLC");
  const sm = skillMatchSync("aarav", "g-swe");
  const completion = profileCompletion(candidate.profile);
  const gaps = priorityGaps(tc);
  const history = getHistory().slice(0, 4);

  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title={`Welcome back, ${candidate.profile.name.split(" ")[0]}`}
        description="Here's where you stand against your target companies and roles."
        actions={<SampleBadge label="Illustrative results" />}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel variant="brut" className="lg:col-span-2">
          <div className="grid items-center gap-6 sm:grid-cols-[auto_auto_1fr]">
            <ScoreIndicator score={tc.readiness_score} label="Readiness · Google LLC" size={140} />
            <ScoreIndicator score={sm.match_score} label="Match · Google SWE" size={140} />
            <div className="space-y-3">
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">Biggest gaps</p>
              {gaps.map((g) => (
                <div key={g.category_code} className="flex items-center gap-3">
                  <CategoryBadge code={g.category_code} />
                  <span className="flex-1 text-sm">{categoryName(g.category_code)}</span>
                  <span className="font-mono text-sm font-bold text-destructive">−{g.required_level - g.candidate_level}</span>
                </div>
              ))}
              <Link to="/talent-check" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                Full breakdown <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </Panel>

        <Panel>
          <PanelTitle icon={<UserRound className="size-5 text-primary" />}>Profile completion</PanelTitle>
          <p className="font-display text-4xl font-bold">{completion}%</p>
          <ProgressBar value={completion} tone={scoreTone(completion)} className="mt-3" />
          <p className="mt-3 text-sm text-muted-foreground">
            A complete profile gives more reliable readiness and match results.
          </p>
          <Link to="/profile" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            Complete profile <ArrowRight className="size-4" />
          </Link>
        </Panel>
      </div>

      <h2 className="mb-4 mt-10 text-xl font-bold">Quick actions</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {ACTIONS.map(({ to, title, desc, icon: Icon }) => (
          <Link key={to} to={to} className="group flex flex-col rounded-xl brut-sm brut-press bg-card p-4">
            <span className="mb-3 grid size-10 place-items-center rounded-lg bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Icon className="size-5" />
            </span>
            <span className="font-semibold leading-snug">{title}</span>
            <span className="mt-1 text-xs text-muted-foreground">{desc}</span>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <StatCard label="Skills on profile" value={candidate.profile.skills.length} hint="From parsed CV & manual edits" icon={Sparkles} />
        <StatCard label="Categories meeting bar" value={`${tc.skillset_gap.filter((g) => !g.gap).length}/12`} hint="Google LLC · sample levels" icon={Target} />
        <StatCard label="Matched JD skills" value={`${sm.matched_skills.length}/${sm.matched_skills.length + sm.missing_skills.length}`} hint="Google SWE · sample JD" icon={GitCompareArrows} />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Panel>
          <PanelTitle action={<Link to="/history" className="text-sm font-semibold text-primary hover:underline">View all</Link>}>
            Recent analyses
          </PanelTitle>
          <ul className="divide-y divide-border">
            {history.map((h) => (
              <li key={h.id} className="flex items-center gap-3 py-3">
                <span className="grid size-9 place-items-center rounded-lg bg-muted">
                  {h.type === "talent_check" ? <Radar className="size-4" /> : <GitCompareArrows className="size-4" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{h.company}</p>
                  <p className="truncate text-xs text-muted-foreground">{h.role} · {h.date}</p>
                </div>
                <span className="font-mono text-sm font-bold">{h.score ?? "—"}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel>
          <PanelTitle>Recommended next actions</PanelTitle>
          <ol className="space-y-3">
            {[
              ...gaps.map((g) => `Raise ${categoryName(g.category_code)} from ${g.candidate_level} to ${g.required_level} — practice targeted problems.`),
              ...sm.missing_skills.slice(0, 2).map((s) => `Add evidence of “${s}” — a small project or certification.`),
            ].map((t, i) => (
              <li key={t} className="flex gap-3 text-sm">
                <span className="grid size-6 shrink-0 place-items-center rounded-md brut-sm bg-warning font-mono text-xs font-bold text-warning-foreground">{i + 1}</span>
                {t}
              </li>
            ))}
          </ol>
        </Panel>
      </div>
    </>
  );
}
