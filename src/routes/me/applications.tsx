import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  DollarSign,
  Edit2,
  ExternalLink,
  FileText,
  Filter,
  Kanban,
  List,
  MapPin,
  MoreVertical,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  EmptyState,
  PageHeader,
  Panel,
  PanelTitle,
  SampleBadge,
} from "@/components/radix/primitives";
import {
  addApplication,
  deleteApplication,
  loadApplications,
  moveApplicationStage,
  resetApplications,
  STAGES,
  subscribeApplications,
  updateApplication,
  type ApplicationStage,
  type JobApplication,
} from "@/services/applications-store";
import { loadVaultResumes } from "@/services/vault-store";

export const Route = createFileRoute("/me/applications")({
  component: ApplicationTrackerPage,
});

export function ApplicationTrackerPage() {
  const [applications, setApplications] = useState<JobApplication[]>(() => loadApplications());
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<JobApplication | null>(null);
  const [detailApp, setDetailApp] = useState<JobApplication | null>(null);

  // Form states
  const [formCompany, setFormCompany] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formStage, setFormStage] = useState<ApplicationStage>("applied");
  const [formDate, setFormDate] = useState(() => new Date().toISOString().split("T")[0]!);
  const [formResume, setFormResume] = useState("aarav_sharma_cv_2026.pdf");
  const [formSalary, setFormSalary] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formNotes, setFormNotes] = useState("");

  const storedResumes = loadVaultResumes();

  useEffect(() => {
    const update = () => setApplications(loadApplications());
    return subscribeApplications(update);
  }, []);

  const openAddModal = () => {
    setEditingApp(null);
    setFormCompany("");
    setFormRole("");
    setFormStage("applied");
    setFormDate(new Date().toISOString().split("T")[0]!);
    setFormResume(storedResumes[0]?.fileName || "aarav_sharma_cv_2026.pdf");
    setFormSalary("");
    setFormLocation("");
    setFormNotes("");
    setIsAddModalOpen(true);
  };

  const openEditModal = (app: JobApplication) => {
    setEditingApp(app);
    setFormCompany(app.company);
    setFormRole(app.role);
    setFormStage(app.stage);
    setFormDate(app.appliedDate);
    setFormResume(app.linkedResume);
    setFormSalary(app.salaryExpectation || "");
    setFormLocation(app.location || "");
    setFormNotes(app.notes || "");
    setIsAddModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCompany.trim() || !formRole.trim()) return;

    if (editingApp) {
      updateApplication(editingApp.id, {
        company: formCompany.trim(),
        role: formRole.trim(),
        stage: formStage,
        appliedDate: formDate,
        linkedResume: formResume,
        salaryExpectation: formSalary.trim() || undefined,
        location: formLocation.trim() || undefined,
        notes: formNotes.trim() || undefined,
      });
    } else {
      addApplication({
        company: formCompany.trim(),
        role: formRole.trim(),
        stage: formStage,
        appliedDate: formDate,
        linkedResume: formResume,
        matchScore: 80 + (formCompany.length % 15),
        salaryExpectation: formSalary.trim() || undefined,
        location: formLocation.trim() || undefined,
        notes: formNotes.trim() || undefined,
      });
    }

    setIsAddModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this application record?")) {
      deleteApplication(id);
      if (detailApp?.id === id) setDetailApp(null);
    }
  };

  const filteredApps = applications.filter((app) => {
    if (stageFilter !== "all" && app.stage !== stageFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        app.company.toLowerCase().includes(q) ||
        app.role.toLowerCase().includes(q) ||
        app.notes?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        eyebrow="Career Pipeline Tracker"
        title="Job Application Pipeline"
        description="Track enterprise job applications across Saved, Applied, Interview, Offer, and Archived stages with linked resume versions and readiness match references."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <SampleBadge label="Local browser pipeline" />
            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all hover:scale-[1.02] shadow-lg"
              style={{
                background: "#DCDCE0",
                color: "#050507",
              }}
            >
              <Plus className="size-3.5" />
              <span>Add Application</span>
            </button>
          </div>
        }
      />

      {/* ── Filter & View Toggle Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-b border-white/10">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search companies, roles..."
              className="rounded-xl pl-9 pr-3 py-1.5 text-xs font-mono placeholder:text-muted-foreground/50 border focus:outline-none focus:ring-1 focus:ring-champagne"
              style={{
                background: "rgba(201,205,208,0.04)",
                borderColor: "rgba(201,205,208,0.14)",
                color: "#DCDCE0",
              }}
            />
          </div>

          {/* Stage filter dropdown */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-grey">Stage:</span>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="rounded-xl px-2.5 py-1.5 text-xs font-mono border focus:outline-none focus:ring-1 focus:ring-champagne"
              style={{
                background: "rgba(201,205,208,0.06)",
                borderColor: "rgba(201,205,208,0.15)",
                color: "#DCDCE0",
              }}
            >
              <option value="all">All Stages ({applications.length})</option>
              {STAGES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label} ({applications.filter((a) => a.stage === s.id).length})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* View mode toggle (Kanban vs Table) */}
        <div className="flex items-center gap-1 rounded-xl p-1 border border-white/10 self-start sm:self-center">
          <button
            type="button"
            onClick={() => setViewMode("kanban")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono transition-colors ${
              viewMode === "kanban"
                ? "bg-white/10 text-frost-white font-semibold"
                : "text-slate-grey hover:text-cloud-silver"
            }`}
          >
            <Kanban className="size-3.5" />
            <span>Kanban Board</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono transition-colors ${
              viewMode === "table"
                ? "bg-white/10 text-frost-white font-semibold"
                : "text-slate-grey hover:text-cloud-silver"
            }`}
          >
            <List className="size-3.5" />
            <span>Table View</span>
          </button>
        </div>
      </div>

      {/* ── Stage Metrics Pills ── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {STAGES.map((s) => {
          const count = applications.filter((a) => a.stage === s.id).length;
          return (
            <div
              key={s.id}
              className="rounded-xl border p-3 flex flex-col justify-between"
              style={{
                background: "rgba(20,20,24,0.3)",
                borderColor: "rgba(201,205,208,0.1)",
              }}
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-grey">{s.label}</span>
                <span className="size-2 rounded-full" style={{ background: s.color }} />
              </div>
              <p className="font-display text-2xl font-bold mt-2" style={{ color: s.color }}>
                {count}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── Kanban View ── */}
      {viewMode === "kanban" ? (
        <div className="grid gap-4 md:grid-cols-5 items-start">
          {STAGES.map((stage) => {
            const stageApps = filteredApps.filter((a) => a.stage === stage.id);
            return (
              <div
                key={stage.id}
                className="rounded-2xl border p-3 space-y-3 min-h-[400px] flex flex-col backdrop-blur-md"
                style={{
                  background: "rgba(20,20,24,0.25)",
                  borderColor: "rgba(201,205,208,0.08)",
                }}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between px-1.5 py-1">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full" style={{ background: stage.color }} />
                    <span className="font-display text-xs font-bold text-frost-white">
                      {stage.label}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-slate-grey bg-white/5 px-2 py-0.5 rounded-full">
                    {stageApps.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-3 flex-1">
                  {stageApps.length === 0 ? (
                    <div className="h-28 rounded-xl border border-dashed border-white/5 flex items-center justify-center text-[11px] font-mono text-slate-grey/50">
                      Empty column
                    </div>
                  ) : (
                    stageApps.map((app) => (
                      <div
                        key={app.id}
                        className="rounded-xl border p-3.5 space-y-2.5 transition-all hover:border-white/20 hover:scale-[1.01]"
                        style={{
                          background: "rgba(23,23,27,0.7)",
                          borderColor: "rgba(201,205,208,0.1)",
                        }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-display text-xs font-bold text-frost-white">
                              {app.company}
                            </h4>
                            <p className="text-[11px] text-slate-grey leading-tight mt-0.5">
                              {app.role}
                            </p>
                          </div>
                          {app.matchScore && (
                            <span className="font-mono text-[10px] font-bold text-success-green bg-success-green/10 border border-success-green/20 px-1.5 py-0.5 rounded">
                              {app.matchScore}%
                            </span>
                          )}
                        </div>

                        {app.notes && (
                          <p className="text-[11px] text-slate-grey line-clamp-2 leading-relaxed bg-black/20 p-2 rounded border border-white/5">
                            {app.notes}
                          </p>
                        )}

                        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-grey">
                          <span>{app.appliedDate}</span>

                          {/* Quick stage mover dropdown */}
                          <select
                            value={app.stage}
                            onChange={(e) => moveApplicationStage(app.id, e.target.value as ApplicationStage)}
                            className="bg-transparent text-[10px] text-champagne border border-champagne/30 rounded px-1 py-0.5 focus:outline-none"
                            aria-label="Move stage"
                          >
                            {STAGES.map((st) => (
                              <option key={st.id} value={st.id} className="bg-obsidian text-frost-white">
                                → {st.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Card footer actions */}
                        <div className="flex items-center justify-between pt-1 text-[11px]">
                          <button
                            type="button"
                            onClick={() => setDetailApp(app)}
                            className="font-mono text-champagne hover:underline"
                          >
                            Details
                          </button>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEditModal(app)}
                              className="p-1 text-slate-grey hover:text-frost-white rounded"
                              aria-label="Edit application"
                            >
                              <Edit2 className="size-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(app.id)}
                              className="p-1 text-slate-grey hover:text-danger-red rounded"
                              aria-label="Delete application"
                            >
                              <Trash2 className="size-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── Table View ── */
        <Panel>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr
                  className="border-b font-mono text-[11px] uppercase tracking-wider text-slate-grey"
                  style={{ borderColor: "rgba(201,205,208,0.1)" }}
                >
                  <th className="pb-3 pl-1">Company & Role</th>
                  <th className="pb-3 px-3">Stage</th>
                  <th className="pb-3 px-3">Match Score</th>
                  <th className="pb-3 px-3">Applied Date</th>
                  <th className="pb-3 px-3">Linked Resume</th>
                  <th className="pb-3 pr-1 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-white/[0.015] transition-colors">
                    <td className="py-3.5 pl-1">
                      <p className="font-display font-bold text-frost-white">{app.company}</p>
                      <p className="text-slate-grey text-xs mt-0.5">{app.role}</p>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded-full uppercase bg-white/5 border border-white/10 text-cloud-silver font-semibold">
                        {app.stage}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-success-green">
                      {app.matchScore ? `${app.matchScore}%` : "—"}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-grey">{app.appliedDate}</td>
                    <td className="py-3.5 px-3 font-mono text-xs text-slate-grey truncate max-w-[140px]">
                      {app.linkedResume}
                    </td>
                    <td className="py-3.5 pr-1 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setDetailApp(app)}
                          className="font-mono text-xs text-champagne hover:underline"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditModal(app)}
                          className="p-1 text-slate-grey hover:text-frost-white rounded"
                        >
                          <Edit2 className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(app.id)}
                          className="p-1 text-slate-grey hover:text-danger-red rounded"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {/* ── Add / Edit Modal ── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg rounded-2xl border p-6 space-y-5 bg-[#17171B] shadow-2xl relative"
            style={{ borderColor: "rgba(201,205,208,0.2)" }}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-display text-lg font-bold text-frost-white">
                {editingApp ? "Edit Job Application" : "Track New Job Application"}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-grey hover:text-frost-white"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-grey mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    placeholder="e.g. Stripe, Google, Datadog"
                    className="w-full rounded-xl px-3 py-2 text-xs font-mono bg-white/5 border border-white/10 text-frost-white focus:outline-none focus:border-champagne"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-grey mb-1">
                    Job Role
                  </label>
                  <input
                    type="text"
                    required
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    placeholder="e.g. Senior Backend Engineer"
                    className="w-full rounded-xl px-3 py-2 text-xs font-mono bg-white/5 border border-white/10 text-frost-white focus:outline-none focus:border-champagne"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-grey mb-1">
                    Current Stage
                  </label>
                  <select
                    value={formStage}
                    onChange={(e) => setFormStage(e.target.value as ApplicationStage)}
                    className="w-full rounded-xl px-3 py-2 text-xs font-mono bg-[#17171B] border border-white/10 text-frost-white focus:outline-none focus:border-champagne"
                  >
                    {STAGES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-grey mb-1">
                    Applied Date
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full rounded-xl px-3 py-2 text-xs font-mono bg-white/5 border border-white/10 text-frost-white focus:outline-none focus:border-champagne"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-grey mb-1">
                    Salary Range
                  </label>
                  <input
                    type="text"
                    value={formSalary}
                    onChange={(e) => setFormSalary(e.target.value)}
                    placeholder="e.g. $160k - $180k"
                    className="w-full rounded-xl px-3 py-2 text-xs font-mono bg-white/5 border border-white/10 text-frost-white focus:outline-none focus:border-champagne"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-grey mb-1">
                  Linked Resume Version
                </label>
                <select
                  value={formResume}
                  onChange={(e) => setFormResume(e.target.value)}
                  className="w-full rounded-xl px-3 py-2 text-xs font-mono bg-[#17171B] border border-white/10 text-frost-white focus:outline-none focus:border-champagne"
                >
                  {storedResumes.map((r) => (
                    <option key={r.id} value={r.fileName}>
                      {r.fileName} {r.isPrimary ? "(Primary)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-grey mb-1">
                  Notes & Interview Intel
                </label>
                <textarea
                  rows={3}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Notes on recruiters, interview topics, pending questions..."
                  className="w-full rounded-xl p-3 text-xs font-mono bg-white/5 border border-white/10 text-frost-white focus:outline-none focus:border-champagne"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-grey hover:text-frost-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl px-5 py-2 text-xs font-semibold uppercase tracking-wider bg-cloud-silver text-obsidian shadow"
                >
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Detail Modal ── */}
      {detailApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-md rounded-2xl border p-6 space-y-4 bg-[#17171B] shadow-2xl relative"
            style={{ borderColor: "rgba(201,205,208,0.2)" }}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-champagne">
                  Application Record
                </span>
                <h3 className="font-display text-lg font-bold text-frost-white">
                  {detailApp.company}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDetailApp(null)}
                className="text-slate-grey hover:text-frost-white"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-slate-grey">Role</span>
                <span className="font-semibold text-frost-white">{detailApp.role}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-slate-grey">Current Stage</span>
                <span className="font-mono font-bold uppercase text-champagne">{detailApp.stage}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-slate-grey">Applied Date</span>
                <span className="font-mono text-frost-white">{detailApp.appliedDate}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-slate-grey">Linked Resume</span>
                <span className="font-mono text-frost-white">{detailApp.linkedResume}</span>
              </div>
              {detailApp.salaryExpectation && (
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-slate-grey">Salary Target</span>
                  <span className="font-mono text-success-green">{detailApp.salaryExpectation}</span>
                </div>
              )}
              {detailApp.notes && (
                <div className="pt-1">
                  <span className="text-slate-grey block mb-1">Notes:</span>
                  <p className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-slate-grey leading-relaxed">
                    {detailApp.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setDetailApp(null)}
                className="rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-white/10 text-frost-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Demo Applications */}
      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={() => {
            if (confirm("Reset applications pipeline to initial sample demonstration data?")) {
              resetApplications();
            }
          }}
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-grey hover:text-frost-white transition-colors"
        >
          <RotateCcw className="size-3" />
          <span>Restore Sample Pipeline</span>
        </button>
      </div>
    </div>
  );
}

