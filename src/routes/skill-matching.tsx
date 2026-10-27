import { createFileRoute, Link, useLocation } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  GitCompareArrows,
  Info,
  X,
  ExternalLink,
  Sparkles,
  UserRound,
  FileSearch,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  CategoryBadge,
  EmptyState,
  LoadingState,
  PageHeader,
  Panel,
  PanelTitle,
  SampleBadge,
  ScoreIndicator,
  SkillChip,
} from "@/components/radix/primitives";
import { NativeSelect } from "@/components/radix/Selectors";
import { Button } from "@/components/ui/button";
import { pageMeta } from "@/lib/radix/meta";
import type { SkillMatchingResult } from "@/lib/radix/types";
import { subscribeJobs } from "@/services/jd-store";
import {
  getCandidate,
  getCandidates,
  getJob,
  getJobs,
  runSkillMatching,
  skillMatchSync,
} from "@/services/radix-api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/skill-matching")({
  head: () =>
    pageMeta(
      "Skill Matching",
      "Match your profile against one specific job description and see matched and missing skills.",
    ),
  component: SkillMatching,
});

function SkillMatching() {
  const location = useLocation();
  const rawSearch = location.search as Record<string, unknown> | undefined;
  const candidateParam =
    typeof rawSearch?.["candidate"] === "string" ? (rawSearch["candidate"] as string) : undefined;
  const jobIdParam =
    typeof rawSearch?.["jobId"] === "string" ? (rawSearch["jobId"] as string) : undefined;

  const [jobs, setJobs] = useState(getJobs);
  const [candidateId, setCandidateId] = useState(() => candidateParam || "my-profile");
  const [jobId, setJobId] = useState<string>(() => jobIdParam || jobs[0]?.id || "g-swe");
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<{
    result: SkillMatchingResult;
    candidateId: string;
    jobId: string;
  } | null>(() => {
    if (jobIdParam || candidateParam) {
      const cId = candidateParam || "my-profile";
      const jId = jobIdParam || jobs[0]?.id || "g-swe";
      return { result: skillMatchSync(cId, jId), candidateId: cId, jobId: jId };
    }
    return null;
  });

  useEffect(() => {
    const unsub = subscribeJobs(() => setJobs(getJobs()));
    return unsub;
  }, []);

  useEffect(() => {
    if (candidateParam) setCandidateId(candidateParam);
    if (jobIdParam) setJobId(jobIdParam);
    if (candidateParam || jobIdParam) {
      const cId = candidateParam ?? "my-profile";
      const jId = jobIdParam ?? getJobs()[0]?.id ?? "g-swe";
      setState({ result: skillMatchSync(cId, jId), candidateId: cId, jobId: jId });
    }
  }, [candidateParam, jobIdParam]);

  const run = async () => {
    setLoading(true);
    try {
      const result = await runSkillMatching(candidateId, jobId);
      setState({ result, candidateId, jobId });
      toast.success("Skill matching complete", {
        description: `Match score: ${result.match_score}%. Recorded to analysis history.`,
      });
    } catch {
      toast.error("Matching failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const job = state ? getJob(state.jobId) : getJob(jobId);
  const cand = state ? getCandidate(state.candidateId) : getCandidate(candidateId);
  const evidence = (skill: string) =>
    cand?.profile.skills.find((s) => s.skill_name.toLowerCase() === skill.toLowerCase());

  return (
    <>
      <PageHeader
        eyebrow="Job-Specific Fit"
        title="Skill Matching"
        description="Compare candidate skills against the exact requirements of a specific target job description."
        actions={<SampleBadge label="Intersection Engine" />}
      />

      <Panel className="mb-6">
        <div className="grid items-end gap-4 sm:grid-cols-[1fr_1.5fr_auto]">
          <NativeSelect
            id="cand"
            label="Candidate Profile"
            value={candidateId}
            onChange={(v) => {
              setCandidateId(v);
              setState(null);
            }}
            options={getCandidates().map((c) => ({ value: c.id, label: c.profile.name }))}
          />
          <NativeSelect
            id="job"
            label="Job Description"
            value={jobId}
            onChange={(v) => {
              setJobId(v);
              setState(null);
            }}
            options={jobs.map((j) => ({
              value: j.id,
              label: `${j.company} — ${j.role} (${j.required_skills.length} skills)`,
            }))}
          />
          <Button
            variant="champagne"
            size="lg"
            onClick={run}
            disabled={loading}
            className="rounded-xl"
          >
            <GitCompareArrows className="size-4" /> {loading ? "Matching…" : "Run Match"}
          </Button>
        </div>
      </Panel>

      {loading ? (
        <LoadingState label="Computing skill intersection and cross-referencing candidate profile evidence…" />
      ) : !state ? (
        <EmptyState
          icon={<GitCompareArrows className="size-6 text-champagne" />}
          title="Select Candidate and Target Job"
          description="Evaluate exact skill matches, missing requirements, and evidence citations for any job in the catalog."
          action={
            <div className="flex flex-wrap gap-2 justify-center">
              <Button variant="champagne" onClick={run}>
                Run Match with Default Selection
              </Button>
              <Link to="/jd-analytics">
                <Button variant="glass">
                  <FileSearch className="size-4" /> Analyze New JD
                </Button>
              </Link>
            </div>
          }
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <div className="space-y-6">
            <Panel className="flex flex-col items-center text-center">
              <SampleBadge label="Job Specification" />
              <div className="mt-4">
                <ScoreIndicator
                  score={state.result.match_score}
                  label="Role Fit Score"
                  size={145}
                />
              </div>
              <p className="mt-3 text-sm font-bold text-zinc-100">{job.role}</p>
              <p className="text-xs text-zinc-400">{job.company}</p>
              <p className="mt-1 font-mono text-[11px] text-zinc-500">
                {state.result.jd_source_file}
              </p>

              <div className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 p-3.5 text-left text-xs leading-relaxed text-zinc-400">
                <span className="font-semibold text-zinc-200">
                  {state.result.matched_skills.length} of {job.required_skills.length}
                </span>{" "}
                required skills matched on{" "}
                <strong className="text-zinc-200">{cand.profile.name}</strong>'s profile.
              </div>

              <div className="mt-4 flex w-full flex-col gap-2">
                <Link to="/profile" className="w-full">
                  <Button variant="glass" size="sm" className="w-full text-xs rounded-xl">
                    <UserRound className="size-3.5" /> Edit Profile to Add Skills
                  </Button>
                </Link>
                <Link to="/jd-analytics" className="w-full">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs rounded-xl text-zinc-400 hover:text-champagne"
                  >
                    <ExternalLink className="size-3.5" /> Ingest Another JD
                  </Button>
                </Link>
              </div>
            </Panel>

            <Panel>
              <PanelTitle icon={<Sparkles className="size-4 text-champagne" />}>
                Suggested Improvements
              </PanelTitle>
              <ul className="space-y-2.5">
                {state.result.missing_skills.length > 0 ? (
                  state.result.missing_skills.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-xs sm:text-sm text-zinc-400">
                      <ArrowRight className="mt-0.5 size-3.5 shrink-0 text-champagne" />
                      <span>
                        Build and showcase <strong className="text-zinc-200">“{s}”</strong> with
                        demonstrable projects or certifications.
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="text-xs sm:text-sm text-emerald-400 font-medium">
                    Profile satisfies all explicit skills requested by this job description!
                  </li>
                )}
              </ul>
            </Panel>
          </div>

          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <Panel>
                <div className="mb-3.5 flex items-center justify-between border-b border-white/10 pb-2.5">
                  <PanelTitle icon={<Check className="size-4 text-emerald-400" />}>
                    Matched Skills ({state.result.matched_skills.length})
                  </PanelTitle>
                </div>
                <div className="flex flex-wrap gap-2">
                  {state.result.matched_skills.length > 0 ? (
                    state.result.matched_skills.map((s) => (
                      <SkillChip key={s} name={s} tone="matched" />
                    ))
                  ) : (
                    <p className="text-xs text-zinc-400">No overlapping skills found</p>
                  )}
                </div>
              </Panel>

              <Panel>
                <div className="mb-3.5 flex items-center justify-between border-b border-white/10 pb-2.5">
                  <PanelTitle icon={<X className="size-4 text-rose-400" />}>
                    Missing Skills ({state.result.missing_skills.length})
                  </PanelTitle>
                </div>
                <div className="flex flex-wrap gap-2">
                  {state.result.missing_skills.length > 0 ? (
                    state.result.missing_skills.map((s) => (
                      <SkillChip key={s} name={s} tone="missing" />
                    ))
                  ) : (
                    <p className="text-xs text-emerald-400">None — 100% skill coverage</p>
                  )}
                </div>
              </Panel>
            </div>

            <Panel>
              <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
                <PanelTitle>Skill-by-Skill Requirements Audit</PanelTitle>
                <span className="font-mono text-xs text-zinc-400">
                  {job.required_skills.length} requirements
                </span>
              </div>

              <div className="divide-y divide-white/10">
                {job.required_skills.map((s) => {
                  const ev = evidence(s);
                  return (
                    <div key={s} className="flex items-start gap-3 py-3">
                      <span
                        className={cn(
                          "mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border",
                          ev
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                            : "border-rose-500/30 bg-rose-500/10 text-rose-400",
                        )}
                      >
                        {ev ? <Check className="size-3" /> : <X className="size-3" />}
                      </span>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-sm text-zinc-200">{s}</span>
                          {ev && <CategoryBadge code={ev.category_code} />}
                        </div>
                        <p className="mt-0.5 text-xs text-zinc-400">
                          {ev ? ev.evidence : "No supporting evidence found in candidate profile"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="mt-4 flex items-start gap-2 text-xs text-zinc-400 border-t border-white/10 pt-3">
                <Info className="mt-0.5 size-3.5 shrink-0 text-champagne" />
                Matching is computed as exact normalized intersection between JD required skills and
                profile skills.
              </p>
            </Panel>
          </div>
        </div>
      )}
    </>
  );
}
