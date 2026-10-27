import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Award,
  Briefcase,
  Building2,
  FileText,
  FolderGit2,
  GraduationCap,
  Pencil,
  Sparkles,
  User,
  FileCheck2,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { FileUpload } from "@/components/radix/FileUpload";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  Panel,
  SampleBadge,
  SkillChip,
} from "@/components/radix/primitives";
import { Button } from "@/components/ui/button";
import { pageMeta } from "@/lib/radix/meta";
import type { ParsedResume } from "@/lib/radix/types";
import { loadProfile, saveProfile } from "@/services/profile-store";
import { parseResume } from "@/services/radix-api";

export const Route = createFileRoute("/resume-parsing")({
  head: () =>
    pageMeta(
      "Resume Parsing",
      "Upload your CV, review the extracted details, and send them to your profile.",
    ),
  component: ResumeParsing,
});

function Section({ title, icon, items }: { title: string; icon: ReactNode; items: string[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#131316] p-5 shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
      <h3 className="mb-3 flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-300">
        {icon}
        {title}
      </h3>
      {items.length ? (
        <ul className="space-y-2 text-sm">
          {items.map((i) => (
            <li
              key={i}
              className="border-l-2 border-champagne pl-3 text-xs sm:text-sm text-zinc-300"
            >
              {i}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-zinc-500">None identified</p>
      )}
    </div>
  );
}

function ResumeParsing() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | { name: string; size: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ParsedResume | null>(null);

  const loadDemoResume = () => {
    setFile({ name: "aarav_sharma_cv_2026.pdf", size: 380 * 1024 });
    setError(null);
    toast.info("Demo Resume loaded", {
      description: "Click 'Parse resume' to preview extracted entities.",
    });
  };

  const parse = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const parsed = await parseResume(file);
      setResult(parsed);
      toast.success("Resume parsed successfully", {
        description: `Identified ${parsed.extracted.skills.length} skills and background records.`,
      });
    } catch {
      setError("We couldn't read this resume. Try another file.");
    } finally {
      setLoading(false);
    }
  };

  const removeSkill = (skillName: string) => {
    if (!result) return;
    setResult({
      ...result,
      extracted: {
        ...result.extracted,
        skills: result.extracted.skills.filter((s) => s.skill_name !== skillName),
      },
    });
  };

  const sendToProfile = () => {
    if (!result) return;
    const current = loadProfile();
    saveProfile({
      ...current,
      name: result.personal.name || current.name,
      email: result.personal.email || current.email,
      education: result.education[0] ?? current.education,
      skills: result.extracted.skills,
      internships: result.internships.length > 0 ? result.internships : current.internships,
      certifications:
        result.certifications.length > 0 ? result.certifications : current.certifications,
      cv_file: result.extracted.source_file,
    });
    toast.success("Transferred to Profile Builder", {
      description: "You can now edit any section before running company readiness checks.",
    });
    navigate({ to: "/profile" });
  };

  return (
    <>
      <PageHeader
        eyebrow="Step 2 · Candidate Ingestion"
        title="Resume Parsing"
        description="Extract your core skills, education, and project background from a PDF or DOCX resume to jumpstart your profile."
        actions={<SampleBadge label="Simulation Mode" />}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
        <Panel className="h-fit space-y-5">
          <div className="flex items-center justify-between">
            <span className="font-display text-sm font-bold text-zinc-100">Resume Document</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={loadDemoResume}
              className="h-7 text-xs font-semibold text-zinc-300 hover:text-champagne"
            >
              <FileCheck2 className="size-3.5 text-champagne" /> Use demo CV
            </Button>
          </div>

          <FileUpload
            file={file as File | null}
            onFile={setFile}
            onError={setError}
            label="Upload your resume"
          />

          {error && <ErrorState message={error} />}

          <Button
            variant="champagne"
            size="lg"
            className="w-full rounded-xl"
            disabled={!file || loading}
            onClick={parse}
          >
            <Sparkles className="size-4" /> {loading ? "Extracting profile data…" : "Parse resume"}
          </Button>

          <div className="rounded-xl border border-dashed border-white/10 bg-white/5 p-3.5 text-xs text-zinc-400">
            <p className="font-semibold text-zinc-200">Demonstration Parser</p>
            <p className="mt-1 leading-relaxed">
              Simulates extraction of structured entities (personal, education, projects, skills).
              Review and transfer directly to your Candidate Profile.
            </p>
          </div>
        </Panel>

        <div>
          {loading ? (
            <LoadingState label="Analyzing document structure and extracting qualifications…" />
          ) : result ? (
            <Panel className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <h2 className="font-display text-lg font-bold text-zinc-100">
                    Review Extracted Information
                  </h2>
                  <p className="font-mono text-xs text-zinc-400">
                    Source: {result.extracted.source_file}
                  </p>
                </div>
                <Button
                  variant="champagne"
                  size="sm"
                  onClick={sendToProfile}
                  className="rounded-xl"
                >
                  <Pencil className="size-3.5" /> Transfer to Profile Builder
                </Button>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#131316] p-4 shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
                <span className="grid size-11 place-items-center rounded-xl border border-white/10 bg-white/5 text-champagne">
                  <User className="size-5" />
                </span>
                <div className="text-sm">
                  <p className="font-display font-bold text-base text-zinc-100">
                    {result.personal.name}
                  </p>
                  <p className="text-xs text-zinc-400 sm:text-sm">
                    {result.personal.email} · {result.personal.location}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#131316] p-5 shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-300">
                    <Sparkles className="size-3.5 text-champagne" /> Extracted Skills & Technologies
                    ({result.extracted.skills.length})
                  </h3>
                  <span className="text-xs text-zinc-500">Click × to exclude a skill</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.extracted.skills.map((s) => (
                    <SkillChip
                      key={s.skill_name}
                      name={s.skill_name}
                      code={s.category_code}
                      onRemove={() => removeSkill(s.skill_name)}
                    />
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Section
                  title="Education"
                  icon={<GraduationCap className="size-4 text-champagne" />}
                  items={result.education}
                />
                <Section
                  title="Projects"
                  icon={<FolderGit2 className="size-4 text-champagne" />}
                  items={result.projects}
                />
                <Section
                  title="Experience"
                  icon={<Briefcase className="size-4 text-champagne" />}
                  items={result.experience}
                />
                <Section
                  title="Internships"
                  icon={<Building2 className="size-4 text-champagne" />}
                  items={result.internships}
                />
                <div className="sm:col-span-2">
                  <Section
                    title="Certifications"
                    icon={<Award className="size-4 text-champagne" />}
                    items={result.certifications}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#131316] p-5 sm:flex-row sm:items-center">
                <p className="flex-1 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  Looks accurate? Transfer to your Candidate Profile — you will be able to review,
                  add, and fine-tune all fields before running Talent Check.
                </p>
                <Button variant="champagne" onClick={sendToProfile} className="rounded-xl shrink-0">
                  <Pencil className="size-4" /> Transfer to Profile Builder
                </Button>
              </div>
            </Panel>
          ) : (
            <EmptyState
              icon={<FileText className="size-6 text-champagne" />}
              title="No Resume Parsed Yet"
              description="Upload your CV or click 'Use demo CV' to extract candidate skills, education, internships, and certifications for your profile."
            />
          )}
        </div>
      </div>
    </>
  );
}
