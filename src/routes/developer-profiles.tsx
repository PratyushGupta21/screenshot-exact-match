import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Award,
  CheckCircle2,
  Code,
  ExternalLink,
  Flame,
  Globe,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
  Trophy,
  UserCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  EmptyState,
  PageHeader,
  Panel,
  PanelTitle,
  ProgressBar,
  SampleBadge,
} from "@/components/radix/primitives";
import {
  addDeveloperProfile,
  loadDeveloperProfiles,
  PLATFORM_CONFIG,
  removeDeveloperProfile,
  resetDeveloperProfiles,
  subscribeDeveloperProfiles,
  type DeveloperProfileItem,
  type ProfilePlatform,
} from "@/services/developer-profiles-store";

export const Route = createFileRoute("/developer-profiles")({
  component: DeveloperProfilesPage,
});

export function DeveloperProfilesPage() {
  const [profiles, setProfiles] = useState<DeveloperProfileItem[]>(() =>
    loadDeveloperProfiles(),
  );
  const [selectedPlatform, setSelectedPlatform] = useState<ProfilePlatform>("leetcode");
  const [handleInput, setHandleInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const update = () => setProfiles(loadDeveloperProfiles());
    return subscribeDeveloperProfiles(update);
  }, []);

  const handleAddProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleInput.trim()) {
      setErrorMessage("Please provide a valid username or profile URL.");
      return;
    }
    setErrorMessage("");
    addDeveloperProfile(selectedPlatform, handleInput);
    setHandleInput("");
    setIsAdding(false);
  };

  const handleRemove = (id: string) => {
    if (confirm("Remove this developer profile link?")) {
      removeDeveloperProfile(id);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        eyebrow="Identity & Competitive Programming"
        title="Developer Profiles & Verified Handles"
        description="Connect your competitive coding, open-source, and professional profiles to correlate algorithm ratings and project evidence directly with CAIRN hiring baselines."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <SampleBadge label="Illustrative statistics & demo badges" />
            <button
              type="button"
              onClick={() => setIsAdding(!isAdding)}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all hover:scale-[1.02] shadow-lg"
              style={{
                background: "#DCDCE0",
                color: "#050507",
              }}
            >
              <Plus className="size-3.5" />
              <span>Connect Profile</span>
            </button>
          </div>
        }
      />

      {/* ── Add Profile Panel (Toggleable) ── */}
      {isAdding && (
        <Panel className="border-champagne/30 bg-[#17171B]/90 animate-in slide-in-from-top-4 duration-200">
          <PanelTitle icon={<Plus className="size-4 text-champagne" />}>
            Connect a New Developer Profile
          </PanelTitle>

          <form onSubmit={handleAddProfile} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-grey mb-1.5">
                  Platform
                </label>
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value as ProfilePlatform)}
                  className="w-full rounded-xl px-3.5 py-2.5 text-xs font-mono border focus:outline-none focus:ring-1 focus:ring-champagne"
                  style={{
                    background: "rgba(201,205,208,0.06)",
                    borderColor: "rgba(201,205,208,0.15)",
                    color: "#DCDCE0",
                  }}
                >
                  {Object.entries(PLATFORM_CONFIG).map(([key, cfg]) => (
                    <option key={key} value={key}>
                      {cfg.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-grey mb-1.5">
                  Username or Full Profile URL
                </label>
                <input
                  type="text"
                  value={handleInput}
                  onChange={(e) => {
                    setHandleInput(e.target.value);
                    if (errorMessage) setErrorMessage("");
                  }}
                  placeholder={`e.g. ${PLATFORM_CONFIG[selectedPlatform].baseUrl}username`}
                  className="w-full rounded-xl px-3.5 py-2.5 text-xs font-mono placeholder:text-muted-foreground/50 transition-colors focus:outline-none focus:ring-1 focus:ring-champagne"
                  style={{
                    background: "rgba(201,205,208,0.04)",
                    border: "1px solid rgba(201,205,208,0.14)",
                    color: "#DCDCE0",
                  }}
                />
              </div>
            </div>

            {errorMessage && (
              <p className="text-xs font-mono text-danger-red">{errorMessage}</p>
            )}

            <div className="flex items-center justify-between pt-2">
              <p className="text-[11px] text-slate-grey">
                Snapshot previews are generated client-side for demonstration.
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-grey hover:text-frost-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all hover:scale-[1.02]"
                  style={{
                    background: "#C4A574",
                    color: "#050507",
                  }}
                >
                  Save & Link
                </button>
              </div>
            </div>
          </form>
        </Panel>
      )}

      {/* ── Overview Metrics Row ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          className="rounded-2xl border p-5 backdrop-blur-md"
          style={{
            background: "rgba(20,20,24,0.35)",
            borderColor: "rgba(201,205,208,0.12)",
          }}
        >
          <span className="font-mono text-[11px] uppercase tracking-wider text-slate-grey">
            Connected Profiles
          </span>
          <p className="font-display text-3xl font-bold text-frost-white mt-2">
            {profiles.length} <span className="text-sm font-normal text-slate-grey">active</span>
          </p>
          <p className="text-xs text-slate-grey mt-1">Across 7 supported technical communities</p>
        </div>

        <div
          className="rounded-2xl border p-5 backdrop-blur-md"
          style={{
            background: "rgba(20,20,24,0.35)",
            borderColor: "rgba(201,205,208,0.12)",
          }}
        >
          <span className="font-mono text-[11px] uppercase tracking-wider text-slate-grey">
            LeetCode Solved
          </span>
          <p className="font-display text-3xl font-bold text-champagne mt-2">
            342 <span className="text-sm font-normal text-slate-grey">/ 3,200</span>
          </p>
          <p className="text-xs text-slate-grey mt-1">185 Medium · 37 Hard</p>
        </div>

        <div
          className="rounded-2xl border p-5 backdrop-blur-md"
          style={{
            background: "rgba(20,20,24,0.35)",
            borderColor: "rgba(201,205,208,0.12)",
          }}
        >
          <span className="font-mono text-[11px] uppercase tracking-wider text-slate-grey">
            Codeforces Peak
          </span>
          <p className="font-display text-3xl font-bold text-success-green mt-2">
            1,698 <span className="text-xs font-mono text-slate-grey">Expert</span>
          </p>
          <p className="text-xs text-slate-grey mt-1">32 rated contests verified</p>
        </div>

        <div
          className="rounded-2xl border p-5 backdrop-blur-md"
          style={{
            background: "rgba(20,20,24,0.35)",
            borderColor: "rgba(201,205,208,0.12)",
          }}
        >
          <span className="font-mono text-[11px] uppercase tracking-wider text-slate-grey">
            Open Source Stars
          </span>
          <p className="font-display text-3xl font-bold text-frost-white mt-2">
            48 ★ <span className="text-sm font-normal text-slate-grey">earned</span>
          </p>
          <p className="text-xs text-slate-grey mt-1">Across 14 public Git repositories</p>
        </div>
      </div>

      {/* ── Profiles Cards Grid ── */}
      {profiles.length === 0 ? (
        <EmptyState
          title="No developer profiles linked yet"
          description="Link your GitHub, LeetCode, Codeforces, or LinkedIn profiles to present competitive coding and open-source metrics."
          action={
            <button
              onClick={() => setIsAdding(true)}
              className="rounded-xl px-5 py-2.5 text-xs font-semibold uppercase tracking-wider bg-cloud-silver text-obsidian"
            >
              Add First Profile
            </button>
          }
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {profiles.map((p) => {
            const config = PLATFORM_CONFIG[p.platform];
            return (
              <div
                key={p.id}
                className="rounded-2xl border p-6 flex flex-col justify-between space-y-4 backdrop-blur-md transition-all hover:border-white/20"
                style={{
                  background: "rgba(20,20,24,0.35)",
                  borderColor: "rgba(201,205,208,0.12)",
                }}
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div
                        className="grid size-9 place-items-center rounded-xl font-bold font-mono text-sm"
                        style={{
                          background: "rgba(201,205,208,0.08)",
                          border: "1px solid rgba(201,205,208,0.15)",
                          color: config.color,
                        }}
                      >
                        {config.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display text-base font-bold text-frost-white">
                            {config.name}
                          </h3>
                          <span
                            className="font-mono text-[10px] px-2 py-0.5 rounded-full border uppercase"
                            style={{
                              background:
                                p.status === "verified"
                                  ? "rgba(54,214,126,0.1)"
                                  : "rgba(196,165,116,0.1)",
                              borderColor:
                                p.status === "verified"
                                  ? "rgba(54,214,126,0.25)"
                                  : "rgba(196,165,116,0.25)",
                              color: p.status === "verified" ? "#36D67E" : "#C4A574",
                            }}
                          >
                            {p.status === "verified" ? "Verified" : "Sample Metrics"}
                          </span>
                        </div>
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-xs text-slate-grey hover:text-champagne flex items-center gap-1 mt-0.5"
                        >
                          <span>@{p.username}</span>
                          <ExternalLink className="size-3" />
                        </a>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemove(p.id)}
                      className="rounded-lg p-2 text-slate-grey hover:text-danger-red hover:bg-white/5 transition-colors"
                      title="Disconnect profile"
                      aria-label="Disconnect profile"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  {/* Stats Highlights */}
                  {p.stats && (
                    <div className="mt-4 space-y-3">
                      <div className="flex items-baseline justify-between">
                        <span className="font-display text-xl font-bold text-frost-white">
                          {p.stats.primaryMetric}
                        </span>
                        {p.stats.secondaryMetric && (
                          <span className="font-mono text-xs text-champagne font-semibold">
                            {p.stats.secondaryMetric}
                          </span>
                        )}
                      </div>

                      {p.stats.breakdown && (
                        <div className="space-y-2 pt-2 border-t border-white/5">
                          {p.stats.breakdown.map((b) => (
                            <div key={b.label} className="space-y-1">
                              <div className="flex items-center justify-between text-xs font-mono">
                                <span className="text-slate-grey">{b.label}</span>
                                <span className="text-frost-white font-semibold">
                                  {b.value} {b.max ? `/ ${b.max}` : ""}
                                </span>
                              </div>
                              {b.max && typeof b.value === "number" && (
                                <ProgressBar
                                  value={b.value}
                                  max={b.max}
                                  tone="warning"
                                  className="h-1.5"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {(p.stats.detail1 || p.stats.detail2) && (
                        <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] font-mono text-slate-grey">
                          {p.stats.detail1 && <span>• {p.stats.detail1}</span>}
                          {p.stats.detail2 && <span>• {p.stats.detail2}</span>}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-grey">
                  <span>Linked {p.addedAt}</span>
                  {p.stats?.rankBadge && (
                    <span className="inline-flex items-center gap-1 text-champagne font-semibold">
                      <Trophy className="size-3" /> {p.stats.rankBadge}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reset presets button */}
      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={() => {
            if (confirm("Reset developer profiles to initial demonstration presets?")) {
              resetDeveloperProfiles();
            }
          }}
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-grey hover:text-frost-white transition-colors"
        >
          <RefreshCw className="size-3" />
          <span>Restore Default Demo Profiles</span>
        </button>
      </div>
    </div>
  );
}

