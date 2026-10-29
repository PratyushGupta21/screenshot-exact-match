import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Download,
  FolderOpen,
  Github,
  HardDrive,
  Info,
  Lock,
  RotateCcw,
  Save,
  Shield,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  PageHeader,
  Panel,
  PanelTitle,
  SampleBadge,
} from "@/components/radix/primitives";
import { loadApplications, resetApplications } from "@/services/applications-store";
import { loadDeveloperProfiles, resetDeveloperProfiles } from "@/services/developer-profiles-store";
import { loadHistory, resetHistory } from "@/services/history-store";
import { loadProfile, saveProfile } from "@/services/profile-store";
import { loadRoadmapState, resetRoadmap } from "@/services/roadmap-store";
import { loadVaultResumes, resetVaultResumes } from "@/services/vault-store";

export const Route = createFileRoute("/me/settings")({
  component: AccountSettingsPage,
});

export function AccountSettingsPage() {
  const [profile, setProfile] = useState(() => loadProfile());
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [education, setEducation] = useState(profile.education);
  const [preferredRole, setPreferredRole] = useState(profile.preferred_roles[0] || "");
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationWord, setDeleteConfirmationWord] = useState("");

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...profile,
      name: name.trim(),
      email: email.trim(),
      education: education.trim(),
      preferred_roles: preferredRole.trim() ? [preferredRole.trim()] : profile.preferred_roles,
    };
    saveProfile(updated);
    setProfile(updated);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  const handleExportData = () => {
    const exportBundle = {
      exportVersion: "1.0",
      generatedAt: new Date().toISOString(),
      platform: "CAIRN Talent Intelligence",
      candidateProfile: loadProfile(),
      vaultResumes: loadVaultResumes(),
      jobApplications: loadApplications(),
      roadmapState: loadRoadmapState(),
      developerProfiles: loadDeveloperProfiles(),
      analysisHistory: loadHistory(),
    };

    const blob = new Blob([JSON.stringify(exportBundle, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cairn-candidate-data-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleConfirmReset = () => {
    if (deleteConfirmationWord.trim().toLowerCase() !== "reset") return;

    // Reset all local stores to fresh demonstration baseline
    resetVaultResumes();
    resetApplications();
    resetRoadmap();
    resetDeveloperProfiles();
    resetHistory();

    setIsDeleteModalOpen(false);
    setDeleteConfirmationWord("");
    alert("All local demo caches have been reset to initial baseline values.");
    window.location.reload();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        eyebrow="Preferences & Data Control"
        title="Account Settings & Privacy Control"
        description="Manage your on-device candidate profile, download a verified copy of all stored records as JSON, or reset demonstration state."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <SampleBadge label="Client-side privacy architecture" />
            <button
              type="button"
              onClick={handleExportData}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all bg-cloud-silver text-obsidian shadow hover:scale-[1.02]"
            >
              <Download className="size-3.5" />
              <span>Export All Data (.json)</span>
            </button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Profile Form & Preferences */}
        <div className="lg:col-span-2 space-y-6">
          <Panel>
            <PanelTitle icon={<User className="size-4" />}>
              Candidate Profile Information
            </PanelTitle>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-grey mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl px-3.5 py-2.5 text-xs font-mono bg-white/5 border border-white/10 text-frost-white focus:outline-none focus:border-champagne"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-grey mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl px-3.5 py-2.5 text-xs font-mono bg-white/5 border border-white/10 text-frost-white focus:outline-none focus:border-champagne"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-grey mb-1">
                  Education & Academic Institution
                </label>
                <input
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="w-full rounded-xl px-3.5 py-2.5 text-xs font-mono bg-white/5 border border-white/10 text-frost-white focus:outline-none focus:border-champagne"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-grey mb-1">
                  Primary Target Engineering Role
                </label>
                <input
                  type="text"
                  value={preferredRole}
                  onChange={(e) => setPreferredRole(e.target.value)}
                  placeholder="e.g. Software Engineer — Backend"
                  className="w-full rounded-xl px-3.5 py-2.5 text-xs font-mono bg-white/5 border border-white/10 text-frost-white focus:outline-none focus:border-champagne"
                />
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                {isSavedNotice ? (
                  <span className="font-mono text-xs text-success-green flex items-center gap-1.5">
                    <CheckCircle2 className="size-4" /> Profile updated successfully!
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-grey">
                    Updates persist directly to your browser's localStorage.
                  </span>
                )}

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold uppercase tracking-wider bg-champagne text-obsidian shadow hover:scale-[1.02]"
                >
                  <Save className="size-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </Panel>

          {/* Privacy & Storage Architecture */}
          <Panel>
            <PanelTitle icon={<Shield className="size-4" />}>
              Privacy & Zero Cloud Transmission
            </PanelTitle>

            <div className="space-y-3 text-xs text-slate-grey leading-relaxed">
              <p>
                CAIRN runs its entire talent-intelligence heuristics, skill matching matrix, and ATS
                integrity audit directly in your browser.
              </p>
              <ul className="space-y-2 pt-2 border-t border-white/5 font-mono text-[11px]">
                <li className="flex items-start gap-2">
                  <span className="text-success-green font-bold">✓</span>
                  <span>Zero resumes uploaded to remote cloud buckets or AI scraping servers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success-green font-bold">✓</span>
                  <span>Evaluations and 12-dimension skill levels derived locally.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success-green font-bold">✓</span>
                  <span>Export full data snapshot anytime with standard JSON format.</span>
                </li>
              </ul>
            </div>
          </Panel>
        </div>

        {/* Right Col: Data Export & Reset Controls */}
        <div className="space-y-6">
          <Panel>
            <PanelTitle icon={<Download className="size-4" />}>
              Candidate Data Export
            </PanelTitle>

            <p className="text-xs text-slate-grey leading-relaxed mb-4">
              Download your complete candidate profile, application pipeline, roadmap progress, and
              historical talent evaluations in a single portable JSON file.
            </p>

            <button
              type="button"
              onClick={handleExportData}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-semibold uppercase tracking-wider bg-white/5 border border-white/10 text-frost-white hover:bg-white/10 transition-colors"
            >
              <Download className="size-4 text-champagne" />
              <span>Download JSON Export</span>
            </button>
          </Panel>

          {/* Danger Zone: Reset Demonstration Data */}
          <Panel className="border-danger-red/30">
            <PanelTitle icon={<AlertTriangle className="size-4 text-danger-red" />}>
              Danger Zone: Reset Local State
            </PanelTitle>

            <p className="text-xs text-slate-grey leading-relaxed mb-4">
              Clears all locally saved resumes, tracked applications, roadmap task checkmarks, and
              history records, restoring the default demonstration sample state.
            </p>

            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold uppercase tracking-wider bg-danger-red/10 border border-danger-red/25 text-danger-red hover:bg-danger-red/15 transition-colors"
            >
              <Trash2 className="size-4" />
              <span>Reset Local Demonstration Data</span>
            </button>
          </Panel>
        </div>
      </div>

      {/* ── Confirmation Modal ── */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-md rounded-2xl border p-6 space-y-4 bg-[#17171B] shadow-2xl relative"
            style={{ borderColor: "rgba(224,82,82,0.3)" }}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-display text-lg font-bold text-danger-red flex items-center gap-2">
                <AlertTriangle className="size-5" />
                <span>Confirm Local State Reset</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-slate-grey hover:text-frost-white"
              >
                <X className="size-5" />
              </button>
            </div>

            <p className="text-xs text-slate-grey leading-relaxed">
              This action will reset your on-device resume vault, application tracking board, and
              customized roadmap checkboxes to default demonstration baselines.
            </p>

            <div>
              <label className="block text-xs font-mono text-slate-grey mb-1">
                Type <span className="font-bold text-danger-red">RESET</span> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmationWord}
                onChange={(e) => setDeleteConfirmationWord(e.target.value)}
                placeholder="RESET"
                className="w-full rounded-xl px-3 py-2 text-xs font-mono bg-black/40 border border-white/10 text-frost-white focus:outline-none focus:border-danger-red"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-grey hover:text-frost-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteConfirmationWord.trim().toLowerCase() !== "reset"}
                onClick={handleConfirmReset}
                className="rounded-xl px-5 py-2 text-xs font-semibold uppercase tracking-wider bg-danger-red text-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Reset All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

