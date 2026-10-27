import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, GitCompareArrows, Info, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  CategoryBadge, EmptyState, LoadingState, PageHeader, Panel, PanelTitle, SampleBadge, ScoreIndicator, SkillChip,
} from "@/components/radix/primitives";
import { NativeSelect } from "@/components/radix/Selectors";
import { Button } from "@/components/ui/button";
import { pageMeta } from "@/lib/radix/meta";
import type { SkillMatchingResult } from "@/lib/radix/types";
import { getCandidate, getCandidates, getJob, getJobs, runSkillMatching } from "@/services/radix-api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/skill-matching")({
  head: () => pageMeta("Skill Matching", "Match your profile against one specific job description and see matched and missing skills."),
  component: SkillMatching,
});

function SkillMatching() {
  const [candidateId, setCandidateId] = useState("aarav");
  const [jobId, setJobId] = useState("g-swe");
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<{ result: SkillMatchingResult; candidateId: string; jobId: string } | null>(null);

  const run = async () => {
    setLoading(true);
    try {
      setState({ result: await runSkillMatching(candidateId, jobId), candidateId, jobId });
    } catch { toast.error("Matching failed. Please try again."); } finally { setLoading(false); }
  };

  const job = state ? getJob(state.jobId) : getJob(jobId);
  const cand = state ? getCandidate(state.candidateId) : null;
  const evidence = (skill: string) => cand?.profile.skills.find((s) => s.skill_name.toLowerCase() === skill.toLowerCase());

  return (
    <>
      <PageHeader
        eyebrow="Job-specific match"
        title="Skill Matching"
        description="Compare your profile with one specific job description. Unlike Talent Check (company-wide, 12 categories), this looks at the exact skills a single role asks for."
      />

      <Panel variant="brut" className="mb-6">
        <div className="grid items-end gap-4 sm:grid-cols-[1fr_1fr_auto]">
          <NativeSelect id="cand" label="Candidate profile" value={candidateId} onChange={setCandidateId}
            options={getCandidates().map((c) => ({ value: c.id, label: c.profile.name }))} />
          <NativeSelect id="job" label="Job description" value={jobId} onChange={setJobId}
            options={getJobs().map((j) => ({ value: j.id, label: `${j.company} — ${j.role}` }))} />
          <Button variant="brut" size="lg" onClick={run} disabled={loading}><GitCompareArrows /> {loading ? "Matching…" : "Run match"}</Button>
        </div>
      </Panel>

      {loading ? <LoadingState label="Comparing your skills with the job…" /> : !state || !cand ? (
        <EmptyState icon={<GitCompareArrows className="size-5" />} title="Choose a profile and a job"
          description="Run the match to see matched skills, missing skills and how to improve." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="space-y-6">
            <Panel className="flex flex-col items-center text-center">
              <SampleBadge label="Illustrative score" />
              <div className="mt-4"><ScoreIndicator score={state.result.match_score} label="Match score" /></div>
              <p className="mt-3 text-sm font-semibold">{job.role}</p>
              <p className="text-sm text-muted-foreground">{job.company}</p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">{state.result.jd_source_file}</p>
              <p className="mt-4 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
                {state.result.matched_skills.length} of {job.required_skills.length} required skills found on {cand.profile.name}'s profile.
              </p>
            </Panel>
            <Panel>
              <PanelTitle>Suggested improvements</PanelTitle>
              <ul className="space-y-2">
                {state.result.missing_skills.length ? state.result.missing_skills.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm"><ArrowRight className="mt-0.5 size-4 shrink-0 text-primary" />Build and showcase “{s}” with a small project or certification.</li>
                )) : <li className="text-sm text-success">You cover every skill in this JD.</li>}
              </ul>
            </Panel>
          </div>

          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <Panel>
                <PanelTitle icon={<Check className="size-5 text-success" />}>Matched ({state.result.matched_skills.length})</PanelTitle>
                <div className="flex flex-wrap gap-2">{state.result.matched_skills.map((s) => <SkillChip key={s} name={s} tone="matched" />)}</div>
              </Panel>
              <Panel>
                <PanelTitle icon={<X className="size-5 text-destructive" />}>Missing ({state.result.missing_skills.length})</PanelTitle>
                <div className="flex flex-wrap gap-2">
                  {state.result.missing_skills.length ? state.result.missing_skills.map((s) => <SkillChip key={s} name={s} tone="missing" />)
                    : <p className="text-sm text-muted-foreground">None</p>}
                </div>
              </Panel>
            </div>
            <Panel>
              <PanelTitle>Skill-by-skill comparison</PanelTitle>
              <div className="divide-y divide-border">
                {job.required_skills.map((s) => {
                  const ev = evidence(s);
                  return (
                    <div key={s} className="flex items-start gap-3 py-3">
                      <span className={cn("mt-0.5 grid size-6 shrink-0 place-items-center rounded-md border-2",
                        ev ? "border-success bg-success text-success-foreground" : "border-destructive bg-destructive-soft text-destructive")}>
                        {ev ? <Check className="size-3.5" /> : <X className="size-3.5" />}
                      </span>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold">{s}</span>
                          {ev && <CategoryBadge code={ev.category_code} />}
                        </div>
                        <p className="text-xs text-muted-foreground">{ev ? ev.evidence : "No evidence found on profile"}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
                <Info className="mt-0.5 size-3.5 shrink-0" /> Score = matched required skills ÷ total required skills, using sample JD data.
              </p>
            </Panel>
          </div>
        </div>
      )}
    </>
  );
}
