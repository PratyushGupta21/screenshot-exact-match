import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Info, Radar } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  CategoryBadge, EmptyState, LoadingState, PageHeader, Panel, PanelTitle, SampleBadge, ScoreIndicator, SkillComparisonRow,
} from "@/components/radix/primitives";
import { NativeSelect } from "@/components/radix/Selectors";
import { Button } from "@/components/ui/button";
import { categoryName, COMPANIES } from "@/lib/radix/categories";
import { pageMeta } from "@/lib/radix/meta";
import { priorityGaps } from "@/lib/radix/scoring";
import type { TalentCheckResult } from "@/lib/radix/types";
import { getCandidate, getCandidates, runTalentCheck } from "@/services/radix-api";

export const Route = createFileRoute("/talent-check")({
  head: () => pageMeta("Talent Check", "Compare your profile with a company's expected levels across the 12 RADIX skill categories."),
  component: TalentCheck,
});

function TalentCheck() {
  const [candidateId, setCandidateId] = useState("aarav");
  const [company, setCompany] = useState<string>(COMPANIES[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TalentCheckResult | null>(null);
  const [ranFor, setRanFor] = useState("");

  const run = async () => {
    setLoading(true);
    try {
      const r = await runTalentCheck(candidateId, company);
      setResult(r); setRanFor(getCandidate(candidateId).profile.name);
    } catch {
      toast.error("Talent Check failed. Please try again.");
    } finally { setLoading(false); }
  };

  const gaps = result ? priorityGaps(result) : [];
  const met = result ? result.skillset_gap.filter((g) => !g.gap).length : 0;

  return (
    <>
      <PageHeader
        eyebrow="Company readiness"
        title="Talent Check"
        description="See how your levels compare with a company's expected level in each of the 12 RADIX skill categories."
      />

      <Panel variant="brut" className="mb-6">
        <div className="grid items-end gap-4 sm:grid-cols-[1fr_1fr_auto]">
          <NativeSelect id="cand" label="Candidate profile" value={candidateId} onChange={setCandidateId}
            options={getCandidates().map((c) => ({ value: c.id, label: c.profile.name }))} />
          <NativeSelect id="company" label="Company" value={company} onChange={setCompany}
            options={COMPANIES.map((c) => ({ value: c, label: c }))} />
          <Button variant="brut" size="lg" onClick={run} disabled={loading}><Radar /> {loading ? "Running…" : "Run Talent Check"}</Button>
        </div>
      </Panel>

      {loading ? <LoadingState label="Comparing your levels with company expectations…" /> : !result ? (
        <EmptyState icon={<Radar className="size-5" />} title="Pick a profile and company"
          description="Then run the check to see your readiness score and category-by-category gaps." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="space-y-6">
            <Panel className="flex flex-col items-center text-center">
              <SampleBadge />
              <div className="mt-4"><ScoreIndicator score={result.readiness_score} label="Readiness score" /></div>
              <p className="mt-3 text-sm text-muted-foreground">{ranFor} · {result.company}</p>
              <p className="mt-4 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
                {met} of 12 categories meet the required level. Score = average of your level ÷ required level per category (capped at 100%).
              </p>
            </Panel>
            <Panel>
              <PanelTitle>Priority gaps</PanelTitle>
              {gaps.length ? (
                <ul className="space-y-3">
                  {gaps.map((g) => (
                    <li key={g.category_code} className="rounded-lg border-2 border-destructive bg-destructive-soft p-3">
                      <div className="flex items-center gap-2"><CategoryBadge code={g.category_code} /><span className="text-sm font-semibold">{categoryName(g.category_code)}</span></div>
                      <p className="mt-1 text-xs">Level {g.candidate_level} → needs {g.required_level}</p>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-sm text-success">No gaps — you meet every sample requirement.</p>}
            </Panel>
          </div>

          <div className="space-y-6">
            <Panel>
              <PanelTitle action={<SampleBadge label="Sample required levels" />}>Category breakdown</PanelTitle>
              <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="size-3 rounded-sm bg-success" /> Your level (met)</span>
                <span className="flex items-center gap-1.5"><span className="size-3 rounded-sm bg-warning" /> Your level (gap)</span>
                <span className="flex items-center gap-1.5"><span className="h-3 w-0.5 bg-ink" /> Required level</span>
                <span>Scale 1–10</span>
              </div>
              <div className="divide-y divide-border">
                {result.skillset_gap.map((g) => (
                  <SkillComparisonRow key={g.category_code} code={g.category_code} candidate={g.candidate_level} required={g.required_level} />
                ))}
              </div>
              <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
                <Info className="mt-0.5 size-3.5 shrink-0" /> Required levels are placeholders, not real company expectations. They'll be replaced by the company skillset data.
              </p>
            </Panel>
            <Panel>
              <PanelTitle>Suggested next actions</PanelTitle>
              <ul className="space-y-2">
                {gaps.length ? gaps.map((g) => (
                  <li key={g.category_code} className="flex items-start gap-2 text-sm">
                    <ArrowRight className="mt-0.5 size-4 shrink-0 text-primary" />
                    Close the {g.required_level - g.candidate_level}-point gap in {categoryName(g.category_code)} with focused practice and a project that shows it.
                  </li>
                )) : <li className="text-sm">Try a stricter company or run Skill Matching against a specific job.</li>}
              </ul>
            </Panel>
          </div>
        </div>
      )}
    </>
  );
}
