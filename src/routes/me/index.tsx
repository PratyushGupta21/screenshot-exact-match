import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Clock,
  Compass,
  FileSearch,
  FileText,
  FolderOpen,
  GraduationCap,
  History,
  Layers,
  Mail,
  Plus,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  User,
  UserCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  CategoryBadge,
  PageHeader,
  Panel,
  PanelTitle,
  ProgressBar,
  SampleBadge,
  StatCard,
} from "@/components/radix/primitives";
import { loadApplications, type JobApplication } from "@/services/applications-store";
import { loadHistory } from "@/services/history-store";
import { getActiveCandidate, loadProfile } from "@/services/profile-store";
import { loadRoadmapState, type RoadmapState } from "@/services/roadmap-store";
import { loadVaultResumes, type VaultResumeItem } from "@/services/vault-store";

export const Route = createFileRoute("/me/")({
  component: CandidateWorkspacePage,
});

export function CandidateWorkspacePage() {
  const candidate = getActiveCandidate();
  const [resumes, setResumes] = useState<VaultResumeItem[]>(() => loadVaultResumes());
  const [applications, setApplications] = useState<JobApplication[]>(() => loadApplications());
  const [roadmap, setRoadmap] = useState<RoadmapState>(() => loadRoadmapState());
  const [analyses] = useState(() => loadHistory().slice(0, 4));

  const primaryResume = resumes.find((r) => r.isPrimary) || resumes[0];
  const activeApplicationsCount = applications.filter((a) => a.stage !== "rejected").length;
  const completedMilestones = roadmap.tasks.filter((t) => t.completed).length;
  const roadmapProgress = Math.round((completedMilestones / roadmap.tasks.length) * 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        eyebrow="Candidate Hub"
        title="Candidate Workspace & Portfolio"
        description="Your unified space for managing verified resume variants, tracking enterprise applications, and monitoring personalized skill development."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <SampleBadge label="Client-side candidate state" />
            <Link
              to="/me/settings"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all"
              style={{
                background: "rgba(201,205,208,0.06)",
                border: "1px solid rgba(201,205,208,0.15)",
                color: "#DCDCE0",
              }}
            >
              <Settings className="size-3.5" />
              <span>Settings & Export</span>
            </Link>
          </div>
        }
      />

      {/* ── Candidate Profile Hero Card ── */}
      <div
        className="rounded-2xl border p-6 sm:p-8 backdrop-blur-md relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(20,20,24,0.4) 0%, rgba(18,18,22,0.5) 100%)",
          borderColor: "rgba(201,205,208,0.14)",
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div
              className="size-16 rounded-2xl grid place-items-center text-xl font-bold font-display shrink-0 border"
              style={{
                background: "rgba(196,165,116,0.1)",
                borderColor: "rgba(196,165,116,0.25)",
                color: "#C4A574",
              }}
            >
              {candidate.profile.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase() || "CP"}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="font-display text-2xl font-bold text-frost-white">
                  {candidate.profile.name}
                </h2>
                <span className="inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded-full bg-success-green/10 text-success-green border border-success-green/20">
                  <CheckCircle2 className="size-3" /> Verified Candidate
                </span>
              </div>
              <p className="text-xs text-slate-grey font-mono">{candidate.profile.email}</p>
              <p className="text-xs text-mist-silver flex items-center gap-1.5 pt-0.5">
                <GraduationCap className="size-3.5 text-champagne" />
                <span>{candidate.profile.education}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start md:self-center">
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all bg-white/5 border border-white/10 text-cloud-silver hover:bg-white/10"
            >
              <User className="size-3.5" />
              <span>Edit Profile</span>
            </Link>
            <Link
              to="/me/resumes"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all bg-cloud-silver text-obsidian shadow-lg hover:scale-[1.02]"
            >
              <FolderOpen className="size-3.5" />
              <span>Resume Vault ({resumes.length})</span>
            </Link>
          </div>
        </div>

        {/* Roles & Primary Resume Footer */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-grey">Target Roles:</span>
            {candidate.profile.preferred_roles.map((r) => (
              <span
                key={r}
                className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-cloud-silver"
              >
                {r}
              </span>
            ))}
          </div>

          {primaryResume && (
            <div className="flex items-center gap-2 text-slate-grey">
              <span>Primary Document:</span>
              <span className="text-champagne font-semibold flex items-center gap-1">
                <FileText className="size-3" /> {primaryResume.fileName}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Quick Stat Cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Readiness Index"
          value={<span className="text-success-green">{roadmap.currentReadiness} / 100</span>}
          hint="Calibrated to Tier-1 hiring baselines"
          icon={<Sparkles className="size-4" />}
        />
        <StatCard
          label="Stored Resumes"
          value={<span>{resumes.length} files</span>}
          hint={primaryResume ? `Active: ${primaryResume.versionLabel || "Primary"}` : "None primary"}
          icon={<FolderOpen className="size-4" />}
        />
        <StatCard
          label="Active Applications"
          value={<span className="text-champagne">{activeApplicationsCount} pipelines</span>}
          hint="Saved, applied, or in interview stages"
          icon={<Briefcase className="size-4" />}
        />
        <StatCard
          label="Roadmap Progress"
          value={<span>{roadmapProgress}%</span>}
          hint={`${completedMilestones} of ${roadmap.tasks.length} milestones complete`}
          icon={<Compass className="size-4" />}
        />
      </div>

      {/* ── Core Workspace Hub Cards ── */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            to: "/me/resumes",
            title: "Resume Vault",
            desc: "Store and manage tailored resume versions for different engineering sub-disciplines.",
            icon: FolderOpen,
            badge: `${resumes.length} Documents`,
          },
          {
            to: "/me/applications",
            title: "Application Pipeline",
            desc: "Kanban and table tracking for enterprise job stages from saved to offers.",
            icon: Briefcase,
            badge: `${applications.length} Tracked`,
          },
          {
            to: "/me/analyses",
            title: "Analysis History",
            desc: "Review past talent checks, skill gap matrices, and deterministic ATS integrity logs.",
            icon: History,
            badge: `${analyses.length} Records`,
          },
          {
            to: "/me/settings",
            title: "Settings & Privacy",
            desc: "Export your complete candidate profile dataset as JSON or reset browser state.",
            icon: Settings,
            badge: "Client-side",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-2xl border p-5 flex flex-col justify-between space-y-4 backdrop-blur-md transition-all hover:border-white/25 hover:scale-[1.01]"
              style={{
                background: "rgba(20,20,24,0.35)",
                borderColor: "rgba(201,205,208,0.12)",
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="grid size-9 place-items-center rounded-xl"
                    style={{
                      background: "rgba(196,165,116,0.1)",
                      color: "#C4A574",
                    }}
                  >
                    <Icon className="size-4" />
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-grey">
                    {item.badge}
                  </span>
                </div>
                <h3 className="font-display text-base font-bold text-frost-white">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-grey mt-1 leading-relaxed">{item.desc}</p>
              </div>

              <div className="flex items-center gap-1.5 font-mono text-xs text-champagne pt-2 border-t border-white/5">
                <span>Open Section</span>
                <ArrowRight className="size-3" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── Active Applications & Recent Analyses Summary ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Applications */}
        <Panel>
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <PanelTitle icon={<Briefcase className="size-4" />}>
              Active Applications ({activeApplicationsCount})
            </PanelTitle>
            <Link
              to="/me/applications"
              className="font-mono text-xs text-champagne hover:underline inline-flex items-center gap-1"
            >
              <span>View Kanban</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {applications.slice(0, 3).map((app) => (
              <div
                key={app.id}
                className="rounded-xl border p-3.5 transition-colors hover:bg-white/[0.015] flex items-center justify-between gap-3"
                style={{
                  background: "rgba(201,205,208,0.02)",
                  borderColor: "rgba(201,205,208,0.08)",
                }}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <p className="font-display text-sm font-bold text-frost-white">
                      {app.company}
                    </p>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded-full uppercase bg-white/5 border border-white/10 text-slate-grey">
                      {app.stage}
                    </span>
                  </div>
                  <p className="text-xs text-slate-grey">{app.role}</p>
                </div>

                <div className="text-right font-mono text-xs">
                  {app.matchScore && (
                    <span className="font-bold text-success-green">{app.matchScore}% match</span>
                  )}
                  <p className="text-[10px] text-slate-grey mt-0.5">Applied {app.appliedDate}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Recent Analyses */}
        <Panel>
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <PanelTitle icon={<History className="size-4" />}>
              Recent Candidate Analyses
            </PanelTitle>
            <Link
              to="/me/analyses"
              className="font-mono text-xs text-champagne hover:underline inline-flex items-center gap-1"
            >
              <span>All History</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {analyses.map((rec) => (
              <div
                key={rec.id}
                className="rounded-xl border p-3.5 transition-colors hover:bg-white/[0.015] flex items-center justify-between gap-3"
                style={{
                  background: "rgba(201,205,208,0.02)",
                  borderColor: "rgba(201,205,208,0.08)",
                }}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <p className="font-display text-sm font-bold text-frost-white">
                      {rec.company}
                    </p>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded-full uppercase bg-champagne/10 text-champagne border border-champagne/20">
                      {rec.type === "talent_check" ? "Talent Check" : "Skill Match"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-grey">{rec.role}</p>
                </div>

                <div className="text-right font-mono text-xs">
                  {rec.score !== null && (
                    <span className="font-bold text-frost-white">{rec.score} / 100</span>
                  )}
                  <p className="text-[10px] text-slate-grey mt-0.5">{rec.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

