import { createFileRoute, useLocation } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Info, Radar, Sparkles } from "lucide-react";
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
  SkillComparisonRow,
} from "@/components/radix/primitives";
import { NativeSelect } from "@/components/radix/Selectors";
import { Button } from "@/components/ui/button";
import { categoryName, COMPANIES } from "@/lib/radix/categories";
import { pageMeta } from "@/lib/radix/meta";
import { priorityGaps } from "@/lib/radix/scoring";
import type { TalentCheckResult } from "@/lib/radix/types";
import { getCandidate, getCandidates, runTalentCheck, talentCheckSync } from "@/services/radix-api";

export const Route = createFileRoute("/talent-check")({
  head: () =>
    pageMeta(
      "Talent Check",
      "Compare your profile with a company's expected levels across the 12 CAIRN skill categories.",
    ),
  component: TalentCheck,
});

function TalentCheck() {
  const location = useLocation();
  const rawSearch = location.search as Record<string, unknown> | undefined;
  const candidateParam =
    typeof rawSearch?.["candidate"] === "string" ? (rawSearch["candidate"] as string) : undefined;
  const companyParam =
    typeof rawSearch?.["company"] === "string" ? (rawSearch["company"] as string) : undefined;

  const [candidateId, setCandidateId] = useState(() => candidateParam || "my-profile");
  const [company, setCompany] = useState<string>(() => companyParam || COMPANIES[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TalentCheckResult | null>(() => {
    if (candidateParam || companyParam) {
      return talentCheckSync(candidateParam || "my-profile", companyParam || COMPANIES[0]);
    }
    return null;
  });
  const [ranFor, setRanFor] = useState(
    () => getCandidate(candidateParam || "my-profile").profile.name,
  );

  useEffect(() => {
    if (candidateParam) setCandidateId(candidateParam);
    if (companyParam) setCompany(companyParam);
    if (candidateParam || companyParam) {
      const cId = candidateParam ?? "my-profile";
      const comp = companyParam ?? COMPANIES[0];
      setResult(talentCheckSync(cId, comp));
      setRanFor(getCandidate(cId).profile.name);
    }
  }, [candidateParam, companyParam]);

  const run = async () => {
    setLoading(true);
    try {
      const r = await runTalentCheck(candidateId, company);
      setResult(r);
      setRanFor(getCandidate(candidateId).profile.name);
      toast.success("Talent Check completed", {
        description: `Readiness score: ${r.readiness_score}/100. Saved to history.`,
      });
    } catch {
      toast.error("Talent Check failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const gaps = result ? priorityGaps(result, 4) : [];
  const strengths = result ? result.skillset_gap.filter((g) => !g.gap) : [];
  const met = strengths.length;

  return (
    <>
      <PageHeader
        eyebrow="Company-Level Hiring Bar"
        title="Talent Check"
        description="Benchmark candidate profile capabilities across the 12 core CAIRN domains against company-wide hiring bars on a 1–10 scale."
        actions={<SampleBadge label="Benchmark Engine" />}
      />

      <Panel className="mb-6">
        <div className="grid items-end gap-4 sm:grid-cols-[1fr_1fr_auto]">
          <NativeSelect
            id="cand"
            label="Candidate Profile"
            value={candidateId}
            onChange={(v) => {
              setCandidateId(v);
              setResult(null);
            }}
            options={getCandidates().map((c) => ({ value: c.id, label: c.profile.name }))}
          />
          <NativeSelect
            id="company"
            label="Target Hiring Bar (Company)"
            value={company}
            onChange={(v) => {
              setCompany(v);
              setResult(null);
            }}
            options={COMPANIES.map((c) => ({ value: c, label: c }))}
          />
          <Button
            variant="champagne"
            size="lg"
            onClick={run}
            disabled={loading}
            className="rounded-xl"
          >
            <Radar className="size-4" /> {loading ? "Benchmarking…" : "Run Talent Check"}
          </Button>
        </div>
      </Panel>

      <div className="mb-6 rounded-2xl border border-white/10 bg-[#17171B] px-4 py-3 text-xs text-zinc-400 shadow-[0_4px_16px_rgba(0,0,0,0.3)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <span>
          <strong className="text-zinc-200">Demonstration Benchmark:</strong> Criteria for {company}{" "}
          are educational approximations of hiring bars, calculated on-device without external
          corporate endorsement.
        </span>
        <span className="font-mono text-[11px] shrink-0 font-semibold text-champagne">
          Local Analysis Engine
        </span>
      </div>

      {loading ? (
        <LoadingState label="Computing category-by-category fulfillment against benchmark expectations…" />
      ) : !result ? (
        <EmptyState
          icon={<Radar className="size-6 text-champagne" />}
          title="Select Profile and Hiring Bar"
          description="Choose a candidate (your active saved profile or an example persona) and target company, then click Run Talent Check."
          action={
            <Button variant="champagne" onClick={run}>
              <Radar className="size-4" /> Run Talent Check with Defaults
            </Button>
          }
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <div className="space-y-6">
            <Panel className="flex flex-col items-center text-center">
              <SampleBadge label="Target Benchmark" />
              <div className="mt-4">
                <ScoreIndicator score={result.readiness_score} label="Readiness Index" size={145} />
              </div>
              <p className="mt-3 text-sm font-bold text-zinc-100">{ranFor}</p>
              <p className="text-xs text-zinc-400">{result.company}</p>
              <p className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3.5 text-xs text-zinc-400 leading-relaxed">
                <span className="font-semibold text-zinc-200">{met} of 12</span> CAIRN categories
                meet or exceed the target hiring bar. Overall readiness is the average coverage
                ratio across all 12 domains.
              </p>
            </Panel>

            <Panel>
              <PanelTitle icon={<Sparkles className="size-4 text-champagne" />}>
                Priority Gaps ({gaps.length})
              </PanelTitle>
              {gaps.length > 0 ? (
                <ul className="space-y-2.5">
                  {gaps.map((g) => (
                    <li
                      key={g.category_code}
                      className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CategoryBadge code={g.category_code} />
                          <span className="text-xs font-bold sm:text-sm text-zinc-100">
                            {categoryName(g.category_code)}
                          </span>
                        </div>
                        <span className="font-mono text-xs font-semibold text-rose-400">
                          −{g.required_level - g.candidate_level}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs text-zinc-400">
                        Candidate Level:{" "}
                        <span className="font-semibold text-zinc-200">{g.candidate_level}</span> ·
                        Required Bar:{" "}
                        <span className="font-semibold text-zinc-200">{g.required_level}</span>
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                  <CheckCircle2 className="size-4" /> No category gaps for this company!
                </div>
              )}
            </Panel>

            <Panel>
              <PanelTitle icon={<CheckCircle2 className="size-4 text-emerald-400" />}>
                Key Strengths ({strengths.length})
              </PanelTitle>
              <div className="flex flex-wrap gap-1.5">
                {strengths.map((s) => (
                  <span
                    key={s.category_code}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400"
                  >
                    <CategoryBadge code={s.category_code} />
                    Level {s.candidate_level}
                  </span>
                ))}
              </div>
            </Panel>
          </div>

          <div className="space-y-6">
            <Panel>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                <PanelTitle>All 12 CAIRN Categories Breakdown</PanelTitle>
                <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full bg-emerald-400" /> Level Met
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full bg-champagne" /> Gap Identified
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-0.5 bg-zinc-400" /> Benchmark Bar
                  </span>
                </div>
              </div>

              <div className="divide-y divide-white/10">
                {result.skillset_gap.map((g) => (
                  <SkillComparisonRow
                    key={g.category_code}
                    code={g.category_code}
                    candidate={g.candidate_level}
                    required={g.required_level}
                  />
                ))}
              </div>

              <p className="mt-4 flex items-start gap-2 text-xs text-zinc-400">
                <Info className="mt-0.5 size-3.5 shrink-0 text-champagne" />
                Levels are evaluated on a 1–10 scale. Candidate levels reflect verified skills and
                project evidence.
              </p>
            </Panel>

            <Panel>
              <PanelTitle>Recommended Preparation Roadmap</PanelTitle>
              <ul className="space-y-2.5">
                {gaps.length > 0 ? (
                  gaps.map((g) => (
                    <li
                      key={g.category_code}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-400"
                    >
                      <ArrowRight className="mt-0.5 size-3.5 shrink-0 text-champagne" />
                      <span>
                        Close the{" "}
                        <strong className="text-rose-400 font-semibold">
                          {g.required_level - g.candidate_level}-point gap
                        </strong>{" "}
                        in{" "}
                        <strong className="text-zinc-200">{categoryName(g.category_code)}</strong> (
                        {g.category_code}) through targeted problem solving or a demonstrative
                        project.
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-emerald-400 font-medium">
                    You satisfy all company-wide baseline hiring standards. Next, evaluate exact job
                    role fit via Skill Matching.
                  </li>
                )}
              </ul>
            </Panel>
          </div>
        </div>
      )}
    </>
  );
}
