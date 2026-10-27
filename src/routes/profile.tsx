import { createFileRoute } from "@tanstack/react-router";
import { FileText, Plus, RotateCcw, Save, Trash2, Wand2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  CategoryBadge, PageHeader, Panel, PanelTitle, ProgressBar, SkillChip,
} from "@/components/radix/primitives";
import { validateFile } from "@/components/radix/FileUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RADIX_CATEGORIES } from "@/lib/radix/categories";
import { pageMeta } from "@/lib/radix/meta";
import { profileCompletion, scoreTone } from "@/lib/radix/scoring";
import type { CandidateProfile, CategoryCode } from "@/lib/radix/types";
import { SAMPLE_PARSED_RESUME } from "@/mocks/data";
import { emptyProfile, loadProfile, saveProfile } from "@/services/profile-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({
  head: () => pageMeta("Profile Builder", "Build and edit the candidate profile used for readiness and job matching."),
  component: ProfileBuilder,
});

type ListKey = "hackathons" | "internships" | "certifications" | "preferred_roles";
const LISTS: { key: ListKey; label: string; placeholder: string }[] = [
  { key: "hackathons", label: "Hackathons", placeholder: "e.g. HackRADIX 2026 — Finalist" },
  { key: "internships", label: "Internships", placeholder: "e.g. Backend Intern, Company (3 months)" },
  { key: "certifications", label: "Certifications", placeholder: "e.g. AWS Cloud Practitioner" },
  { key: "preferred_roles", label: "Preferred roles", placeholder: "e.g. Software Engineer" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function RepeatableList({ label, placeholder, items, onChange }: {
  label: string; placeholder: string; items: string[]; onChange: (v: string[]) => void;
}) {
  const [draft, setDraft] = useState("");
  const add = () => { if (draft.trim()) { onChange([...items, draft.trim()]); setDraft(""); } };
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <ul className="space-y-1.5">
        {items.map((it, i) => (
          <li key={`${it}-${i}`} className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm">
            <span className="flex-1">{it}</span>
            <button type="button" aria-label={`Remove ${it}`} onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="rounded p-1 text-muted-foreground hover:bg-destructive-soft hover:text-destructive">
              <Trash2 className="size-3.5" />
            </button>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <Input value={draft} placeholder={placeholder} onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} />
        <Button type="button" variant="brutOutline" onClick={add} aria-label={`Add ${label}`}><Plus /></Button>
      </div>
    </div>
  );
}

function ProfileBuilder() {
  const [p, setP] = useState<CandidateProfile>(emptyProfile());
  const [saved, setSaved] = useState<CandidateProfile>(emptyProfile());
  const [touched, setTouched] = useState(false);
  const [skillName, setSkillName] = useState("");
  const [skillCat, setSkillCat] = useState<CategoryCode>("COD");

  useEffect(() => { const l = loadProfile(); setP(l); setSaved(l); }, []);

  const errors = {
    name: !p.name.trim() ? "Name is required" : null,
    email: !p.email.trim() ? "Email is required" : !EMAIL_RE.test(p.email) ? "Enter a valid email" : null,
    education: !p.education.trim() ? "Education is required" : null,
  };
  const hasErrors = Object.values(errors).some(Boolean);
  const completion = profileCompletion(p);
  const dirty = JSON.stringify(p) !== JSON.stringify(saved);

  const set = <K extends keyof CandidateProfile>(k: K, v: CandidateProfile[K]) => setP((x) => ({ ...x, [k]: v }));

  const addSkill = () => {
    const n = skillName.trim();
    if (!n || p.skills.some((s) => s.skill_name.toLowerCase() === n.toLowerCase())) return;
    set("skills", [...p.skills, { skill_name: n, category_code: skillCat, confidence: "medium", evidence: "Added manually" }]);
    setSkillName("");
  };

  const onSave = () => {
    setTouched(true);
    if (hasErrors) { toast.error("Please fix the highlighted fields"); return; }
    saveProfile(p); setSaved(p);
    toast.success("Profile saved", { description: "Stored on this device for the demo." });
  };

  const prefill = () => {
    const r = SAMPLE_PARSED_RESUME;
    setP((x) => ({
      ...x, name: r.personal.name, email: r.personal.email, education: r.education[0] ?? x.education,
      skills: r.extracted.skills, internships: r.internships, certifications: r.certifications,
      cv_file: r.extracted.source_file,
    }));
    toast("Prefilled from sample resume");
  };

  const field = (key: "name" | "email" | "education", label: string, type = "text") => (
    <div className="space-y-1.5">
      <Label htmlFor={key}>{label} <span className="text-destructive">*</span></Label>
      <Input id={key} type={type} value={p[key]} onChange={(e) => set(key, e.target.value)}
        onBlur={() => setTouched(true)} aria-invalid={touched && !!errors[key]}
        className={cn(touched && errors[key] && "border-destructive focus-visible:ring-destructive")} />
      {touched && errors[key] && <p className="text-xs font-medium text-destructive">{errors[key]}</p>}
    </div>
  );

  return (
    <>
      <PageHeader
        eyebrow="Step 3 · Your profile"
        title="Profile Builder"
        description="This profile powers your Talent Check and Skill Matching results."
        actions={<Button variant="brutOutline" onClick={prefill}><Wand2 /> Prefill from resume</Button>}
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Panel>
            <PanelTitle>Basics</PanelTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              {field("name", "Full name")}
              {field("email", "Email", "email")}
              <div className="sm:col-span-2">{field("education", "Education")}</div>
            </div>
          </Panel>

          <Panel>
            <PanelTitle>Skills</PanelTitle>
            <div className="mb-4 flex flex-wrap gap-2">
              {p.skills.length ? p.skills.map((s) => (
                <SkillChip key={s.skill_name} name={s.skill_name} code={s.category_code}
                  onRemove={() => set("skills", p.skills.filter((x) => x.skill_name !== s.skill_name))} />
              )) : <p className="text-sm text-muted-foreground">No skills yet — add a few below.</p>}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input value={skillName} placeholder="Skill name, e.g. Kubernetes" onChange={(e) => setSkillName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }} />
              <select value={skillCat} onChange={(e) => setSkillCat(e.target.value as CategoryCode)} aria-label="Skill category"
                className="h-9 rounded-md border border-input bg-background px-3 text-sm">
                {RADIX_CATEGORIES.map((c) => <option key={c.code} value={c.code}>{c.code} — {c.name}</option>)}
              </select>
              <Button type="button" variant="brut" onClick={addSkill}><Plus /> Add</Button>
            </div>
          </Panel>

          <Panel>
            <PanelTitle>Experience & preferences</PanelTitle>
            <div className="grid gap-6 sm:grid-cols-2">
              {LISTS.map((l) => (
                <RepeatableList key={l.key} label={l.label} placeholder={l.placeholder} items={p[l.key]} onChange={(v) => set(l.key, v)} />
              ))}
            </div>
          </Panel>

          <Panel>
            <PanelTitle>CV / resume file</PanelTitle>
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm">
                <FileText className="size-4 text-primary" /> {p.cv_file || "No file attached"}
              </span>
              <label className="cursor-pointer text-sm font-semibold text-primary hover:underline">
                {p.cv_file ? "Replace" : "Attach file"}
                <input type="file" accept=".pdf,.docx" className="sr-only" onChange={(e) => {
                  const f = e.target.files?.[0]; if (!f) return;
                  const err = validateFile(f); if (err) { toast.error(err); return; }
                  set("cv_file", f.name);
                }} />
              </label>
              {p.cv_file && <button className="text-sm text-muted-foreground hover:text-destructive" onClick={() => set("cv_file", "")}>Remove</button>}
            </div>
          </Panel>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
          <Panel variant="brut">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">Profile completion</p>
            <p className="mt-1 font-display text-4xl font-bold">{completion}%</p>
            <ProgressBar value={completion} tone={scoreTone(completion)} className="mt-3" />
            <dl className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Name</dt><dd className="font-medium">{p.name || "—"}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Skills</dt><dd className="font-medium">{p.skills.length}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Hackathons</dt><dd className="font-medium">{p.hackathons.length}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Internships</dt><dd className="font-medium">{p.internships.length}</dd></div>
            </dl>
            <div className="mt-4 flex flex-wrap gap-1">
              {[...new Set(p.skills.map((s) => s.category_code))].map((c) => <CategoryBadge key={c} code={c} />)}
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <Button variant="brut" onClick={onSave} disabled={!dirty && !hasErrors}><Save /> Save profile</Button>
              <Button variant="ghost" onClick={() => { setP(saved); setTouched(false); }} disabled={!dirty}><RotateCcw /> Discard changes</Button>
            </div>
            {dirty && <p className="mt-3 text-center text-xs text-warning-foreground">You have unsaved changes</p>}
          </Panel>
        </aside>
      </div>
    </>
  );
}
