import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Award, Briefcase, Building2, FileText, FolderGit2, GraduationCap, Pencil, Sparkles, User,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { FileUpload } from "@/components/radix/FileUpload";
import {
  EmptyState, ErrorState, LoadingState, PageHeader, Panel, SampleBadge, SkillChip,
} from "@/components/radix/primitives";
import { Button } from "@/components/ui/button";
import { pageMeta } from "@/lib/radix/meta";
import type { ParsedResume } from "@/lib/radix/types";
import { loadProfile, saveProfile } from "@/services/profile-store";
import { parseResume } from "@/services/radix-api";

export const Route = createFileRoute("/resume-parsing")({
  head: () => pageMeta("Resume Parsing", "Upload your CV, review the extracted details, and send them to your profile."),
  component: ResumeParsing,
});

function Section({ title, icon, items }: { title: string; icon: ReactNode; items: string[] }) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <h3 className="mb-2 flex items-center gap-2 text-sm font-bold">{icon}{title}</h3>
      {items.length ? (
        <ul className="space-y-1.5 text-sm">{items.map((i) => <li key={i} className="border-l-2 border-primary pl-2">{i}</li>)}</ul>
      ) : <p className="text-sm text-muted-foreground">Nothing found</p>}
    </div>
  );
}

function ResumeParsing() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ParsedResume | null>(null);

  const parse = async () => {
    if (!file) return;
    setLoading(true); setError(null); setResult(null);
    try {
      setResult(await parseResume(file));
    } catch {
      setError("We couldn't read this resume. Try another file.");
    } finally {
      setLoading(false);
    }
  };

  const sendToProfile = () => {
    if (!result) return;
    const current = loadProfile();
    saveProfile({
      ...current,
      name: result.personal.name,
      email: result.personal.email,
      education: result.education[0] ?? current.education,
      skills: result.extracted.skills,
      internships: result.internships,
      certifications: result.certifications,
      cv_file: result.extracted.source_file,
    });
    toast.success("Sent to Profile Builder", { description: "Review and save your profile." });
    navigate({ to: "/profile" });
  };

  return (
    <>
      <PageHeader
        eyebrow="Step 2 · Know yourself"
        title="Resume Parsing"
        description="Upload your resume to pull out your skills and experience. You can review and correct everything before it goes into your profile."
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
        <Panel variant="brut" className="h-fit space-y-5">
          <FileUpload file={file} onFile={setFile} onError={setError} label="Upload your resume" />
          {error && <ErrorState message={error} />}
          <Button variant="brut" size="lg" className="w-full" disabled={!file || loading} onClick={parse}>
            <Sparkles /> {loading ? "Parsing…" : "Parse resume"}
          </Button>
        </Panel>

        <div>
          {loading ? (
            <LoadingState label="Reading your resume…" />
          ) : result ? (
            <Panel>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">Review extracted information</h2>
                  <p className="font-mono text-xs text-muted-foreground">Source: {result.extracted.source_file}</p>
                </div>
                <SampleBadge label="Mock extraction" />
              </div>

              <div className="mb-4 flex items-center gap-4 rounded-lg border border-border bg-background p-4">
                <span className="grid size-11 place-items-center rounded-lg bg-primary-soft text-primary"><User className="size-5" /></span>
                <div className="text-sm">
                  <p className="font-semibold">{result.personal.name}</p>
                  <p className="text-muted-foreground">{result.personal.email} · {result.personal.location}</p>
                </div>
              </div>

              <div className="mb-4 rounded-lg border border-border bg-background p-4">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold"><Sparkles className="size-4 text-primary" />Skills & technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {result.extracted.skills.map((s) => <SkillChip key={s.skill_name} name={s.skill_name} code={s.category_code} />)}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Section title="Education" icon={<GraduationCap className="size-4 text-primary" />} items={result.education} />
                <Section title="Projects" icon={<FolderGit2 className="size-4 text-primary" />} items={result.projects} />
                <Section title="Experience" icon={<Briefcase className="size-4 text-primary" />} items={result.experience} />
                <Section title="Internships" icon={<Building2 className="size-4 text-primary" />} items={result.internships} />
                <Section title="Certifications" icon={<Award className="size-4 text-primary" />} items={result.certifications} />
              </div>

              <div className="mt-6 flex flex-col gap-3 rounded-lg border-2 border-dashed border-primary bg-primary-soft p-4 sm:flex-row sm:items-center">
                <p className="flex-1 text-sm">Looks right? Send it to your profile — you can edit every field before saving.</p>
                <Button variant="brut" onClick={sendToProfile}><Pencil /> Review in Profile Builder</Button>
              </div>
            </Panel>
          ) : (
            <EmptyState
              icon={<FileText className="size-5" />}
              title="No resume parsed yet"
              description="Upload a PDF or DOCX resume. Extracted details shown here are sample data until the parser is connected."
            />
          )}
        </div>
      </div>
    </>
  );
}
