import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  FileText,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  Wand2,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  CategoryBadge,
  PageHeader,
  Panel,
  PanelTitle,
  ProgressBar,
  SkillChip,
} from "@/components/radix/primitives";
import { validateFile } from "@/components/radix/FileUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CAIRN_CATEGORIES } from "@/lib/radix/categories";
import { pageMeta } from "@/lib/radix/meta";
import { profileCompletion, scoreTone } from "@/lib/radix/scoring";
import type { CandidateProfile, CategoryCode } from "@/lib/radix/types";
import { SAMPLE_CANDIDATES, SAMPLE_PARSED_RESUME } from "@/mocks/data";
import { emptyProfile, loadProfile, saveProfile } from "@/services/profile-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({
  head: () =>
    pageMeta(
      "Profile Builder",
      "Build and edit the candidate profile used for readiness and job matching.",
    ),
  component: ProfileBuilder,
});

type ListKey = "hackathons" | "internships" | "certifications" | "preferred_roles";
const LISTS: { key: ListKey; label: string; placeholder: string }[] = [
  { key: "hackathons", label: "Hackathons", placeholder: "e.g. HackCAIRN 2026 — Finalist" },
  {
    key: "internships",
    label: "Internships",
    placeholder: "e.g. Backend Intern, Sample Fintech (3 months)",
  },
  { key: "certifications", label: "Certifications", placeholder: "e.g. AWS Cloud Practitioner" },
  {
    key: "preferred_roles",
    label: "Preferred Roles",
    placeholder: "e.g. Software Engineer, Fullstack Developer",
  },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function RepeatableList({
  label,
  placeholder,
  items,
  onChange,
}: {
  label: string;
  placeholder: string;
  items: string[];
  onChange: (v: string[]) => void;
}) {
  const [draft, setDraft] = useState("");
  const add = () => {
    if (draft.trim()) {
      onChange([...items, draft.trim()]);
      setDraft("");
    }
  };
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
          {label}
        </Label>
        <span className="font-mono text-[11px] text-zinc-500">{items.length} items</span>
      </div>
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li
            key={`${it}-${i}`}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#131316] px-3.5 py-2 text-sm"
          >
            <span className="flex-1 truncate text-xs sm:text-sm text-zinc-200">{it}</span>
            <button
              type="button"
              aria-label={`Remove ${it}`}
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="rounded p-1 text-zinc-500 hover:bg-rose-500/20 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="size-3.5" />
            </button>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <Input
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          className="text-xs sm:text-sm rounded-xl border-white/10 bg-[#131316] text-zinc-100 placeholder:text-zinc-600 focus:border-champagne/50"
        />
        <Button
          type="button"
          variant="glass"
          onClick={add}
          aria-label={`Add ${label}`}
          className="rounded-xl"
        >
          <Plus className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function ProfileBuilder() {
  const navigate = useNavigate();
  const [p, setP] = useState<CandidateProfile>(emptyProfile());
  const [saved, setSaved] = useState<CandidateProfile>(emptyProfile());
  const [touched, setTouched] = useState(false);
  const [skillName, setSkillName] = useState("");
  const [skillCat, setSkillCat] = useState<CategoryCode>("COD");

  useEffect(() => {
    const l = loadProfile();
    setP(l);
    setSaved(l);
  }, []);

  const errors = {
    name: !p.name.trim() ? "Name is required" : null,
    email: !p.email.trim()
      ? "Email is required"
      : !EMAIL_RE.test(p.email)
        ? "Enter a valid email"
        : null,
    education: !p.education.trim() ? "Education is required" : null,
  };
  const hasErrors = Object.values(errors).some(Boolean);
  const completion = profileCompletion(p);
  const dirty = JSON.stringify(p) !== JSON.stringify(saved);

  const set = <K extends keyof CandidateProfile>(k: K, v: CandidateProfile[K]) =>
    setP((x) => ({ ...x, [k]: v }));

  const addSkill = () => {
    const n = skillName.trim();
    if (!n || p.skills.some((s) => s.skill_name.toLowerCase() === n.toLowerCase())) return;
    set("skills", [
      ...p.skills,
      {
        skill_name: n,
        category_code: skillCat,
        confidence: "medium",
        evidence: "Added during profile review",
      },
    ]);
    setSkillName("");
  };

  const onSave = () => {
    setTouched(true);
    if (hasErrors) {
      toast.error("Please fill in required fields", {
        description: "Name, email, and education are required.",
      });
      return false;
    }
    saveProfile(p);
    setSaved(p);
    toast.success("Profile saved successfully", {
      description: "Updated active profile. Ready for Talent Check.",
    });
    return true;
  };

  const onSaveAndProceed = () => {
    if (onSave()) {
      navigate({ to: "/talent-check" });
    }
  };

  const loadPresetPersona = (personaId: "aarav" | "meera") => {
    const cand = SAMPLE_CANDIDATES.find((c) => c.id === personaId);
    if (!cand) return;
    setP({ ...cand.profile });
    toast.info(`Loaded ${cand.profile.name} profile`, {
      description: "Review and click 'Save profile' to make this your active candidate.",
    });
  };

  const prefillFromResume = () => {
    const r = SAMPLE_PARSED_RESUME;
    setP((x) => ({
      ...x,
      name: r.personal.name,
      email: r.personal.email,
      education: r.education[0] ?? x.education,
      skills: r.extracted.skills,
      internships: r.internships,
      certifications: r.certifications,
      cv_file: r.extracted.source_file,
    }));
    toast.success("Prefilled from sample parsed resume");
  };

  const field = (key: "name" | "email" | "education", label: string, type = "text") => (
    <div className="space-y-1.5">
      <Label
        htmlFor={key}
        className="font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-400"
      >
        {label} <span className="text-rose-400">*</span>
      </Label>
      <Input
        id={key}
        type={type}
        value={p[key]}
        onChange={(e) => set(key, e.target.value)}
        onBlur={() => setTouched(true)}
        aria-invalid={touched && !!errors[key]}
        className={cn(
          "rounded-xl border-white/10 bg-[#131316] text-zinc-100 placeholder:text-zinc-600 focus:border-champagne/50",
          touched && errors[key] && "border-rose-500/50 focus-visible:ring-rose-500/50",
        )}
      />
      {touched && errors[key] && <p className="text-xs font-medium text-rose-400">{errors[key]}</p>}
    </div>
  );

  return (
    <>
      <PageHeader
        eyebrow="Step 3 · Candidate Profile"
        title="Profile Builder"
        description="The single source of truth for your profile. Your skills and background determine your readiness levels across all 12 CAIRN categories."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="glass" size="sm" onClick={() => loadPresetPersona("aarav")}>
              <UserCheck className="size-3.5" /> Load Aarav (Fullstack)
            </Button>
            <Button variant="glass" size="sm" onClick={() => loadPresetPersona("meera")}>
              <UserCheck className="size-3.5" /> Load Meera (AI/ML)
            </Button>
            <Button variant="glass" size="sm" onClick={prefillFromResume}>
              <Wand2 className="size-3.5 text-champagne" /> Prefill from CV
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Panel>
            <PanelTitle>Basic Information</PanelTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              {field("name", "Full Name")}
              {field("email", "Email", "email")}
              <div className="sm:col-span-2">{field("education", "Education / Institution")}</div>
            </div>
          </Panel>

          <Panel>
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
              <PanelTitle>Skills & Proficiencies</PanelTitle>
              <span className="font-mono text-xs text-zinc-400">{p.skills.length} skills</span>
            </div>
            <div className="mb-5 flex flex-wrap gap-2">
              {p.skills.length ? (
                p.skills.map((s) => (
                  <SkillChip
                    key={s.skill_name}
                    name={s.skill_name}
                    code={s.category_code}
                    onRemove={() =>
                      set(
                        "skills",
                        p.skills.filter((x) => x.skill_name !== s.skill_name),
                      )
                    }
                  />
                ))
              ) : (
                <p className="text-xs text-zinc-500">No skills added yet. Add a few below.</p>
              )}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                value={skillName}
                placeholder="Skill name, e.g. Docker, PyTorch, SQL"
                onChange={(e) => setSkillName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                className="rounded-xl border-white/10 bg-[#131316] text-zinc-100 placeholder:text-zinc-600 focus:border-champagne/50"
              />
              <select
                value={skillCat}
                onChange={(e) => setSkillCat(e.target.value as CategoryCode)}
                aria-label="Skill category"
                className="h-10 rounded-xl border border-white/10 bg-[#131316] px-3 text-xs font-semibold text-zinc-100"
              >
                {CAIRN_CATEGORIES.map((c) => (
                  <option key={c.code} value={c.code} className="bg-[#131316] text-zinc-100">
                    {c.code} — {c.name}
                  </option>
                ))}
              </select>
              <Button
                type="button"
                variant="champagne"
                onClick={addSkill}
                className="rounded-xl shrink-0"
              >
                <Plus className="size-4" /> Add Skill
              </Button>
            </div>
          </Panel>

          <Panel>
            <PanelTitle>Experience & Domain Signals</PanelTitle>
            <div className="grid gap-6 sm:grid-cols-2">
              {LISTS.map((l) => (
                <RepeatableList
                  key={l.key}
                  label={l.label}
                  placeholder={l.placeholder}
                  items={p[l.key]}
                  onChange={(v) => set(l.key, v)}
                />
              ))}
            </div>
          </Panel>

          <Panel>
            <PanelTitle>Attached Resume File</PanelTitle>
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 font-mono text-xs sm:text-sm text-zinc-200">
                <FileText className="size-4 text-champagne" /> {p.cv_file || "No document attached"}
              </span>
              <label className="cursor-pointer text-xs font-semibold uppercase tracking-wider text-zinc-300 hover:text-champagne transition-colors">
                {p.cv_file ? "Replace document" : "Attach document"}
                <input
                  type="file"
                  accept=".pdf,.docx"
                  className="sr-only"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    const err = validateFile(f);
                    if (err) {
                      toast.error(err);
                      return;
                    }
                    set("cv_file", f.name);
                    toast.success(`Attached ${f.name}`);
                  }}
                />
              </label>
              {p.cv_file && (
                <button
                  type="button"
                  className="text-xs text-zinc-500 hover:text-rose-400 transition-colors"
                  onClick={() => set("cv_file", "")}
                >
                  Remove
                </button>
              )}
            </div>
          </Panel>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
          <Panel>
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Profile Completeness
            </p>
            <p className="mt-1 font-display text-4xl font-bold text-zinc-100">{completion}%</p>
            <ProgressBar value={completion} tone={scoreTone(completion)} className="mt-3" />
            <dl className="mt-5 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <dt className="text-zinc-500">Full Name</dt>
                <dd className="font-semibold truncate max-w-[140px] text-zinc-200">
                  {p.name || "—"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500">Skills</dt>
                <dd className="font-mono font-semibold text-zinc-200">{p.skills.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500">Hackathons</dt>
                <dd className="font-mono font-semibold text-zinc-200">{p.hackathons.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500">Internships</dt>
                <dd className="font-mono font-semibold text-zinc-200">{p.internships.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500">Certifications</dt>
                <dd className="font-mono font-semibold text-zinc-200">{p.certifications.length}</dd>
              </div>
            </dl>

            <div className="mt-5 pt-3.5 border-t border-white/10">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Categories Represented
              </p>
              <div className="flex flex-wrap gap-1">
                {[...new Set(p.skills.map((s) => s.category_code))].map((c) => (
                  <CategoryBadge key={c} code={c} />
                ))}
                {p.skills.length === 0 && <span className="text-xs text-zinc-500">None</span>}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2.5">
              <Button variant="champagne" onClick={onSave} disabled={!dirty && !hasErrors}>
                <Save className="size-4" /> Save Profile
              </Button>
              <Button variant="glass" onClick={onSaveAndProceed}>
                Save & Run Talent Check <ArrowRight className="size-4" />
              </Button>
              {dirty && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setP(saved);
                    setTouched(false);
                  }}
                  className="text-xs text-zinc-400 hover:text-zinc-200"
                >
                  <RotateCcw className="size-3.5" /> Discard Unsaved Changes
                </Button>
              )}
            </div>

            {dirty && (
              <p className="mt-3 text-center text-xs font-semibold text-champagne">
                You have unsaved edits
              </p>
            )}
          </Panel>
        </aside>
      </div>
    </>
  );
}
