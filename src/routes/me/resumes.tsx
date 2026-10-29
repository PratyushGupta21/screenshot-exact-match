import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Check,
  CheckCircle2,
  Edit2,
  FileCheck,
  FileSearch,
  FileText,
  FolderOpen,
  Info,
  MoreVertical,
  Plus,
  RotateCcw,
  Star,
  Trash2,
  Upload,
  X,
  Eye,
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
  addVaultResume,
  deleteVaultResume,
  loadVaultResumes,
  renameVaultResume,
  resetVaultResumes,
  setPrimaryResume,
  subscribeVaultResumes,
  type VaultResumeItem,
} from "@/services/vault-store";

export const Route = createFileRoute("/me/resumes")({
  component: ResumeVaultPage,
});

export function ResumeVaultPage() {
  const [resumes, setResumes] = useState<VaultResumeItem[]>(() => loadVaultResumes());
  const [isDragging, setIsDragging] = useState(false);
  const [previewResume, setPreviewResume] = useState<VaultResumeItem | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  useEffect(() => {
    const update = () => setResumes(loadVaultResumes());
    return subscribeVaultResumes(update);
  }, []);

  const handleFileUpload = (file: File) => {
    if (!file.name.match(/\.(pdf|docx)$/i)) {
      alert("Please upload a PDF or DOCX file.");
      return;
    }
    const added = addVaultResume(file);
    setPreviewResume(added);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  const startRename = (item: VaultResumeItem) => {
    setRenamingId(item.id);
    setRenameValue(item.fileName);
  };

  const saveRename = (id: string) => {
    if (renameValue.trim()) {
      renameVaultResume(id, renameValue);
    }
    setRenamingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this resume variant from your local vault?")) {
      deleteVaultResume(id);
      if (previewResume?.id === id) setPreviewResume(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        eyebrow="Document Management"
        title="Candidate Resume Vault"
        description="Organize tailored resume variations for different engineering disciplines. Select a primary version to automatically feed talent checks and ATS audits."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <SampleBadge label="Browser-side local storage" />
            <Link
              to="/ats-integrity"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all"
              style={{
                background: "rgba(201,205,208,0.06)",
                border: "1px solid rgba(201,205,208,0.15)",
                color: "#DCDCE0",
              }}
            >
              <FileSearch className="size-3.5" />
              <span>ATS Integrity Scan</span>
            </Link>
          </div>
        }
      />

      {/* ── Privacy Notice Banner ── */}
      <div
        className="rounded-2xl border p-4 sm:p-5 flex items-start gap-3.5 text-xs text-slate-grey"
        style={{
          background: "rgba(54,214,126,0.04)",
          borderColor: "rgba(54,214,126,0.18)",
        }}
      >
        <Info className="size-5 shrink-0 text-success-green mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-frost-white">
            Client-Side Resume Vault Security
          </p>
          <p className="leading-relaxed">
            Resumes uploaded here are parsed and indexed exclusively inside your local browser
            storage. Files are never transmitted to a remote cloud storage bucket or third-party API.
          </p>
        </div>
      </div>

      {/* ── Drag & Drop Upload Zone ── */}
      <Panel>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all"
          style={{
            borderColor: isDragging ? "#C4A574" : "rgba(201,205,208,0.16)",
            background: isDragging ? "rgba(196,165,116,0.05)" : "rgba(201,205,208,0.02)",
          }}
        >
          <div
            className="mb-3 grid size-12 place-items-center rounded-xl"
            style={{
              background: "rgba(196,165,116,0.1)",
              border: "1px solid rgba(196,165,116,0.25)",
            }}
          >
            <Upload className="size-5" style={{ color: "#C4A574" }} />
          </div>

          <p className="font-display text-sm font-semibold" style={{ color: "#DCDCE0" }}>
            Add a new resume variant to your vault{" "}
            <label
              htmlFor="vault-file-upload"
              className="cursor-pointer underline underline-offset-2 transition-colors hover:text-champagne"
              style={{ color: "#C4A574" }}
            >
              browse local files
            </label>
          </p>
          <p className="mt-1 text-xs text-slate-grey">
            Accepts PDF and DOCX formats up to 10 MB.
          </p>

          <input
            id="vault-file-upload"
            type="file"
            accept=".pdf,.docx"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
            className="sr-only"
          />
        </div>
      </Panel>

      {/* ── Resumes List & Preview Drawer/Grid ── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Stored Resumes Table */}
        <div className="lg:col-span-2 space-y-4">
          <Panel>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <PanelTitle icon={<FolderOpen className="size-4" />}>
                Stored Resume Variants ({resumes.length})
              </PanelTitle>

              <span className="font-mono text-xs text-slate-grey">
                {resumes.filter((r) => r.isPrimary).length} Primary selected
              </span>
            </div>

            {resumes.length === 0 ? (
              <EmptyState
                title="Vault is empty"
                description="Upload your resume to begin evaluating technical skills and running integrity audits."
              />
            ) : (
              <div className="space-y-3">
                {resumes.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-xl border p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      item.isPrimary ? "border-champagne/40 bg-champagne/[0.03]" : "border-white/10 bg-white/[0.015]"
                    }`}
                  >
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      <div
                        className="grid size-10 place-items-center rounded-xl shrink-0 font-mono text-xs font-bold border"
                        style={{
                          background: item.fileType === "pdf" ? "rgba(224,82,82,0.1)" : "rgba(59,130,246,0.1)",
                          borderColor: item.fileType === "pdf" ? "rgba(224,82,82,0.25)" : "rgba(59,130,246,0.25)",
                          color: item.fileType === "pdf" ? "#E05252" : "#3B82F6",
                        }}
                      >
                        {item.fileType.toUpperCase()}
                      </div>

                      <div className="space-y-1 flex-1 min-w-0">
                        {renamingId === item.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={renameValue}
                              onChange={(e) => setRenameValue(e.target.value)}
                              className="rounded px-2 py-1 text-xs font-mono bg-black/50 border border-champagne text-frost-white focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => saveRename(item.id)}
                              className="p-1 text-success-green hover:bg-white/10 rounded"
                            >
                              <Check className="size-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setRenamingId(null)}
                              className="p-1 text-slate-grey hover:bg-white/10 rounded"
                            >
                              <X className="size-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-display text-sm font-bold text-frost-white truncate">
                              {item.fileName}
                            </p>
                            {item.isPrimary && (
                              <span className="inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded-full bg-champagne/15 text-champagne border border-champagne/30">
                                <Star className="size-2.5 fill-champagne" /> Primary
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-grey">
                          <span>{item.fileSizeFormatted}</span>
                          <span>•</span>
                          <span>Added {item.uploadedAt}</span>
                          <span>•</span>
                          <span className="text-cloud-silver">{item.extractedSkillsCount} skills parsed</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        type="button"
                        onClick={() => setPreviewResume(item)}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-grey hover:text-frost-white hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                        title="View parsed details"
                      >
                        <Eye className="size-3.5" />
                        <span>Inspect</span>
                      </button>

                      {!item.isPrimary && (
                        <button
                          type="button"
                          onClick={() => setPrimaryResume(item.id)}
                          className="rounded-lg px-2.5 py-1.5 text-xs font-mono text-champagne hover:bg-champagne/10 transition-colors"
                        >
                          Set Primary
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => startRename(item)}
                        className="p-1.5 rounded-lg text-slate-grey hover:text-frost-white hover:bg-white/5 transition-colors"
                        title="Rename file"
                        aria-label="Rename file"
                      >
                        <Edit2 className="size-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg text-slate-grey hover:text-danger-red hover:bg-white/5 transition-colors"
                        title="Delete resume"
                        aria-label="Delete resume"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>

        {/* Right Col: Details & Preview Inspector */}
        <div>
          <Panel>
            <PanelTitle icon={<FileText className="size-4" />}>
              Resume Document Inspector
            </PanelTitle>

            {previewResume ? (
              <div className="space-y-4 text-xs">
                <div>
                  <span className="font-mono text-[11px] text-champagne uppercase font-bold block mb-1">
                    Document Metadata
                  </span>
                  <p className="font-display text-base font-bold text-frost-white">
                    {previewResume.fileName}
                  </p>
                  <p className="font-mono text-slate-grey mt-0.5">
                    {previewResume.fileSizeFormatted} · {previewResume.fileType.toUpperCase()} · Added {previewResume.uploadedAt}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <span className="font-mono text-[11px] text-slate-grey block uppercase">
                    Extracted Candidate Header
                  </span>
                  <p className="font-semibold text-frost-white">
                    {previewResume.parsedSummary.name}
                  </p>
                  <p className="font-mono text-slate-grey">{previewResume.parsedSummary.email}</p>
                  <p className="text-champagne font-mono text-[11px]">
                    Role Target: {previewResume.parsedSummary.targetRole}
                  </p>
                </div>

                <div>
                  <span className="font-mono text-[11px] text-slate-grey block uppercase mb-2">
                    Extracted Skill Tokens ({previewResume.parsedSummary.skills.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {previewResume.parsedSummary.skills.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded-md font-mono text-[11px] bg-white/5 border border-white/10 text-cloud-silver"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 space-y-2">
                  <span className="font-mono text-[11px] text-slate-grey block uppercase">
                    Sample Experience Snippets
                  </span>
                  {previewResume.parsedSummary.experienceSnippets.map((snip, idx) => (
                    <p key={idx} className="text-slate-grey leading-relaxed italic bg-white/[0.015] p-2.5 rounded-lg border border-white/5">
                      “{snip}”
                    </p>
                  ))}
                </div>

                <div className="pt-3">
                  <Link
                    to="/ats-integrity"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold uppercase tracking-wider bg-cloud-silver text-obsidian shadow hover:scale-[1.01]"
                  >
                    <FileSearch className="size-3.5" />
                    <span>Run ATS Audit on This File</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-grey space-y-2">
                <FileCheck className="size-8 mx-auto text-slate-grey/50" />
                <p>Select a resume above to inspect its parsed metadata and skill extractions.</p>
              </div>
            )}
          </Panel>
        </div>
      </div>

      {/* Restore Demo Presets */}
      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={() => {
            if (confirm("Restore sample resume documents in vault?")) {
              resetVaultResumes();
            }
          }}
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-grey hover:text-frost-white transition-colors"
        >
          <RotateCcw className="size-3" />
          <span>Restore Sample Resume Vault</span>
        </button>
      </div>
    </div>
  );
}

