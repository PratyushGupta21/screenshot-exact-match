import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  FileSearch,
  Sparkles,
  Plus,
  Trash2,
  ArrowRight,
  Save,
  BookmarkCheck,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { FileUpload } from "@/components/radix/FileUpload";
import {
  CategoryBadge,
  ConfidenceBadge,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  Panel,
  PanelTitle,
  SampleBadge,
} from "@/components/radix/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { categoryName, COMPANIES, RADIX_CATEGORIES } from "@/lib/radix/categories";
import { pageMeta } from "@/lib/radix/meta";
import type {
  CategoryCode,
  Confidence,
  ExtractedSkillList,
  JobDescription,
  Skill,
} from "@/lib/radix/types";
import { saveJob } from "@/services/jd-store";
import { analyzeJobDescription } from "@/services/radix-api";

export const Route = createFileRoute("/jd-analytics")({
  head: () =>
    pageMeta(
      "JD Analytics",
      "Upload a job description and see the skills it asks for, grouped by CAIRN category.",
    ),
  component: JdAnalytics,
});

function JdAnalytics() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | { name: string; size: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [company, setCompany] = useState("Google LLC");
  const [role, setRole] = useState("Software Engineer, New Grad");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExtractedSkillList | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // New skill addition state
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCat, setNewSkillCat] = useState<CategoryCode>("COD");
  const [newSkillConf, setNewSkillConf] = useState<Confidence>("high");

  const loadDemoFile = () => {
    setFile({ name: "google_swe_newgrad_benchmark.pdf", size: 245 * 1024 });
    setCompany("Google LLC");
    setRole("Software Engineer, New Grad");
    setError(null);
    toast.info("Demo Job Description loaded", {
      description: "Click 'Analyze job description' to view extracted skills.",
    });
  };

  const analyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setIsSaved(false);
    try {
      const r = await analyzeJobDescription(file, { company, role });
      setResult(r);
      toast.success("Job description analysis ready", {
        description: `${r.skills.length} skills extracted across categories.`,
      });
    } catch {
      setError("We couldn't analyze this file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeSkill = (skillName: string) => {
    if (!result) return;
    setResult({
      ...result,
      skills: result.skills.filter((s) => s.skill_name.toLowerCase() !== skillName.toLowerCase()),
    });
    setIsSaved(false);
  };

  const addCustomSkill = () => {
    if (!result) return;
    const trimmed = newSkillName.trim();
    if (!trimmed) return;
    if (result.skills.some((s) => s.skill_name.toLowerCase() === trimmed.toLowerCase())) {
      toast.error("Skill already exists in the extracted list");
      return;
    }
    const newSkill: Skill = {
      skill_name: trimmed,
      category_code: newSkillCat,
      confidence: newSkillConf,
      evidence: "Added during manual candidate review",
    };
    setResult({
      ...result,
      skills: [...result.skills, newSkill],
    });
    setNewSkillName("");
    setIsSaved(false);
    toast.success(`Added ${trimmed}`);
  };

  const persistJob = (): JobDescription | null => {
    if (!result) return null;
    const jdId = `jd-${Date.now()}-${result.company
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 8)}`;
    const jobRecord: JobDescription = {
      id: jdId,
      company: result.company || company || "Target Company",
      role: result.role || role || "Target Role",
      source_file: result.source_file,
      required_skills: result.skills.map((s) => s.skill_name),
    };
    saveJob(jobRecord);
    setIsSaved(true);
    return jobRecord;
  };

  const handleSaveOnly = () => {
    const saved = persistJob();
    if (saved) {
      toast.success("Saved to Job Catalog", {
        description: "Available immediately in Skill Matching and Dashboard.",
      });
    }
  };

  const handleSaveAndMatch = () => {
    const saved = persistJob();
    if (saved) {
      toast.success("Saved! Navigating to Skill Matching…");
      navigate({
        to: "/skill-matching",
        search: { jobId: saved.id },
      });
    }
  };

  const grouped = result
    ? Object.entries(
        result.skills.reduce<Record<string, typeof result.skills>>((acc, s) => {
          (acc[s.category_code] ??= []).push(s);
          return acc;
        }, {}),
      )
    : [];

  return (
    <>
      <PageHeader
        eyebrow="Step 1 · Understand the role"
        title="JD Analytics"
        description="Upload a job description to extract required skills, categorized into the 12 CAIRN domains with evidence."
        actions={<SampleBadge label="Simulation Mode" />}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
        <Panel className="h-fit space-y-5">
          <div className="flex items-center justify-between">
            <span className="font-display text-sm font-bold text-zinc-100">Document Source</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={loadDemoFile}
              className="h-7 text-xs font-semibold text-zinc-300 hover:text-champagne"
            >
              <FileText className="size-3.5 text-champagne" /> Use demo JD
            </Button>
          </div>

          <FileUpload
            file={file as File | null}
            onFile={setFile}
            onError={setError}
            label="Upload job description"
          />

          {error && <ErrorState message={error} />}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="space-y-1.5">
              <Label
                htmlFor="company"
                className="font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-400"
              >
                Company
              </Label>
              <Input
                id="company"
                list="companies"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Google LLC"
                className="rounded-xl border-white/10 bg-[#131316] text-zinc-100 placeholder:text-zinc-600 focus:border-champagne/50"
              />
              <datalist id="companies">
                {COMPANIES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="role"
                className="font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-400"
              >
                Role Title
              </Label>
              <Input
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Software Engineer"
                className="rounded-xl border-white/10 bg-[#131316] text-zinc-100 placeholder:text-zinc-600 focus:border-champagne/50"
              />
            </div>
          </div>

          <Button
            variant="champagne"
            size="lg"
            className="w-full rounded-xl"
            disabled={!file || loading}
            onClick={analyze}
          >
            <Sparkles className="size-4" />{" "}
            {loading ? "Extracting skills…" : "Analyze job description"}
          </Button>

          <div className="rounded-xl border border-dashed border-white/10 bg-white/5 p-3.5 text-xs text-zinc-400">
            <p className="font-semibold text-zinc-200">Client Demonstration Mode</p>
            <p className="mt-1 leading-relaxed">
              Validates file metadata locally and returns structured skill categorization ready for
              candidate match.
            </p>
          </div>
        </Panel>

        <div>
          {loading ? (
            <LoadingState label="Extracting and categorizing required skills from document…" />
          ) : result ? (
            <Panel className="space-y-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4">
                <div>
                  <PanelTitle>
                    {result.role}{" "}
                    <span className="font-sans text-sm font-normal text-zinc-400">
                      · {result.company}
                    </span>
                  </PanelTitle>
                  <p className="font-mono text-xs text-zinc-400">
                    Source: {result.source_file} · {result.skills.length} skills identified
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="glass" size="sm" onClick={handleSaveOnly}>
                    {isSaved ? (
                      <CheckCircle2 className="size-4 text-emerald-400" />
                    ) : (
                      <Save className="size-4" />
                    )}
                    {isSaved ? "Saved in Catalog" : "Save to Catalog"}
                  </Button>
                  <Button
                    variant="champagne"
                    size="sm"
                    onClick={handleSaveAndMatch}
                    className="rounded-xl"
                  >
                    Match Candidate <ArrowRight className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Add custom skill inline editor */}
              <div className="rounded-2xl border border-white/10 bg-[#131316] p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Refine Extracted Skills
                </p>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Input
                    placeholder="Add missing required skill (e.g. Distributed Systems)"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomSkill();
                      }
                    }}
                    className="bg-[#18181D] border-white/10 text-zinc-100 placeholder:text-zinc-600 text-sm focus:border-champagne/50"
                  />
                  <select
                    value={newSkillCat}
                    onChange={(e) => setNewSkillCat(e.target.value as CategoryCode)}
                    className="h-9 rounded-md border border-white/10 bg-[#18181D] px-2.5 text-xs font-semibold text-zinc-200"
                    aria-label="Skill category"
                  >
                    {RADIX_CATEGORIES.map((c) => (
                      <option key={c.code} value={c.code} className="bg-[#131316] text-zinc-100">
                        {c.code} — {c.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={newSkillConf}
                    onChange={(e) => setNewSkillConf(e.target.value as Confidence)}
                    className="h-9 rounded-md border border-white/10 bg-[#18181D] px-2 text-xs text-zinc-200"
                    aria-label="Confidence level"
                  >
                    <option value="high" className="bg-[#131316]">
                      High Conf.
                    </option>
                    <option value="medium" className="bg-[#131316]">
                      Med Conf.
                    </option>
                    <option value="low" className="bg-[#131316]">
                      Low Conf.
                    </option>
                  </select>
                  <Button
                    type="button"
                    variant="champagne"
                    size="sm"
                    onClick={addCustomSkill}
                    className="rounded-xl shrink-0"
                  >
                    <Plus className="size-3.5" /> Add
                  </Button>
                </div>
              </div>

              {/* Skills grouped by category */}
              <div className="space-y-6">
                {grouped.map(([code, skills]) => (
                  <div key={code} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CategoryBadge code={code} showName />
                      <span className="font-mono text-xs text-zinc-500">({skills.length})</span>
                    </div>
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      {skills.map((s) => (
                        <div
                          key={s.skill_name}
                          className="group relative flex flex-col justify-between rounded-xl border border-white/10 bg-[#131316] p-3.5 transition-all hover:border-champagne/40 shadow-[0_4px_16px_rgba(0,0,0,0.25)]"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-semibold text-sm text-zinc-100">
                                {s.skill_name}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <ConfidenceBadge level={s.confidence} />
                                <button
                                  type="button"
                                  onClick={() => removeSkill(s.skill_name)}
                                  className="rounded p-1 text-zinc-500 opacity-60 hover:bg-rose-500/20 hover:text-rose-400 hover:opacity-100 transition-opacity cursor-pointer"
                                  title={`Remove ${s.skill_name}`}
                                  aria-label={`Remove ${s.skill_name}`}
                                >
                                  <Trash2 className="size-3.5" />
                                </button>
                              </div>
                            </div>
                            <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">
                              {s.evidence}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 border-t border-white/10 pt-4">
                <Button variant="champagne" onClick={handleSaveAndMatch} className="rounded-xl">
                  <BookmarkCheck className="size-4" /> Save & Proceed to Skill Matching
                </Button>
              </div>
            </Panel>
          ) : (
            <EmptyState
              icon={<FileSearch className="size-6 text-champagne" />}
              title="No Job Description Analyzed"
              description="Upload a PDF/DOCX job posting or click 'Use demo JD' on the left to extract requirements across all 12 CAIRN categories."
            />
          )}
        </div>
      </div>
    </>
  );
}
