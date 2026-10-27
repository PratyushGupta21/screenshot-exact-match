import { createFileRoute } from "@tanstack/react-router";
import { FileSearch, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { FileUpload } from "@/components/radix/FileUpload";
import {
  CategoryBadge, ConfidenceBadge, EmptyState, ErrorState, LoadingState, PageHeader, Panel, PanelTitle, SampleBadge,
} from "@/components/radix/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { categoryName, COMPANIES } from "@/lib/radix/categories";
import { pageMeta } from "@/lib/radix/meta";
import type { ExtractedSkillList } from "@/lib/radix/types";
import { analyzeJobDescription } from "@/services/radix-api";

export const Route = createFileRoute("/jd-analytics")({
  head: () => pageMeta("JD Analytics", "Upload a job description and see the skills it asks for, grouped by RADIX category."),
  component: JdAnalytics,
});

function JdAnalytics() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExtractedSkillList | null>(null);

  const analyze = async () => {
    if (!file) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const r = await analyzeJobDescription(file, { company, role });
      setResult(r);
      toast.success("Sample analysis ready", { description: `${r.skills.length} skills shown` });
    } catch {
      setError("We couldn't analyze this file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const grouped = result
    ? Object.entries(
        result.skills.reduce<Record<string, typeof result.skills>>((acc, s) => {
          (acc[s.category_code] ??= []).push(s); return acc;
        }, {}),
      )
    : [];

  return (
    <>
      <PageHeader
        eyebrow="Step 1 · Understand the role"
        title="JD Analytics"
        description="Upload a job description to see which skills it asks for, grouped into RADIX categories with a confidence level."
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
        <Panel variant="brut" className="h-fit space-y-5">
          <FileUpload file={file} onFile={setFile} onError={setError} label="Upload job description" />
          {error && <ErrorState message={error} />}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="space-y-1.5">
              <Label htmlFor="company">Company</Label>
              <Input id="company" list="companies" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Google LLC" />
              <datalist id="companies">{COMPANIES.map((c) => <option key={c} value={c} />)}</datalist>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="role">Role</Label>
              <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Software Engineer" />
            </div>
          </div>
          <Button variant="brut" size="lg" className="w-full" disabled={!file || loading} onClick={analyze}>
            <Sparkles /> {loading ? "Analyzing…" : "Analyze job description"}
          </Button>
        </Panel>

        <div>
          {loading ? (
            <LoadingState label="Extracting skills from the job description…" />
          ) : result ? (
            <Panel>
              <PanelTitle action={<SampleBadge label="Mock result" />}>
                {result.role} <span className="font-sans text-sm font-normal text-muted-foreground">· {result.company}</span>
              </PanelTitle>
              <p className="-mt-2 mb-5 font-mono text-xs text-muted-foreground">Source: {result.source_file} · {result.skills.length} skills</p>
              <div className="space-y-6">
                {grouped.map(([code, skills]) => (
                  <div key={code}>
                    <div className="mb-2 flex items-center gap-2">
                      <CategoryBadge code={code} />
                      <h3 className="text-sm font-bold">{categoryName(code)}</h3>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {skills.map((s) => (
                        <div key={s.skill_name} className="rounded-lg border border-border bg-background p-3">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold">{s.skill_name}</span>
                            <ConfidenceBadge level={s.confidence} />
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">{s.evidence}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          ) : (
            <EmptyState
              icon={<FileSearch className="size-5" />}
              title="No analysis yet"
              description="Upload a PDF or DOCX job description and press Analyze. Results here are sample data until the analysis service is connected."
            />
          )}
        </div>
      </div>
    </>
  );
}
