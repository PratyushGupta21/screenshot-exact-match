import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileSearch,
  FileText,
  Info,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Upload,
  X,
  FileCheck,
} from "lucide-react";
import { useState } from "react";
import {
  PageHeader,
  Panel,
  PanelTitle,
  ProgressBar,
  SampleBadge,
} from "@/components/radix/primitives";
import {
  INTEGRITY_VECTORS,
  SAMPLE_INTEGRITY_AUDITS,
  simulateIntegrityCheck,
  type IntegrityAuditResult,
  type IntegrityFinding,
  type IntegritySeverity,
} from "@/services/integrity-store";

export const Route = createFileRoute("/ats-integrity")({
  component: AtsIntegrityPage,
});

export function AtsIntegrityPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetJobDescription, setTargetJobDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [activeSampleKey, setActiveSampleKey] = useState<string>("aarav");
  const [auditResult, setAuditResult] = useState<IntegrityAuditResult>(
    SAMPLE_INTEGRITY_AUDITS.aarav,
  );
  const [expandedFindings, setExpandedFindings] = useState<Record<string, boolean>>({
    "f-1": true,
  });
  const [activeVectorFilter, setActiveVectorFilter] = useState<string>("all");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const result = simulateIntegrityCheck(file.name, targetJobDescription);
      setAuditResult(result);
      setActiveSampleKey("custom");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      const result = simulateIntegrityCheck(file.name, targetJobDescription);
      setAuditResult(result);
      setActiveSampleKey("custom");
    }
  };

  const loadSampleAudit = (key: string) => {
    setActiveSampleKey(key);
    setSelectedFile(null);
    setAuditResult(SAMPLE_INTEGRITY_AUDITS[key] ?? SAMPLE_INTEGRITY_AUDITS.aarav);
  };

  const toggleFinding = (id: string) => {
    setExpandedFindings((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFindings =
    activeVectorFilter === "all"
      ? auditResult.findings
      : auditResult.findings.filter((f) => f.vectorId === activeVectorFilter);

  const riskBadgeColor =
    auditResult.riskCategory === "Low"
      ? { bg: "rgba(54,214,126,0.1)", text: "#36D67E", border: "rgba(54,214,126,0.25)" }
      : auditResult.riskCategory === "Medium"
        ? { bg: "rgba(196,165,116,0.1)", text: "#C4A574", border: "rgba(196,165,116,0.25)" }
        : { bg: "rgba(224,82,82,0.1)", text: "#E05252", border: "rgba(224,82,82,0.25)" };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        eyebrow="Integrity & Compliance Engine"
        title="Resume Integrity & Anti-Cheat Audit"
        description="Scans candidate resumes for hidden white-text injection, Unicode zero-width sequences, keyword stuffing, and non-standard layout parseability errors."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <SampleBadge label="Illustrative analysis — sample data" />
            <Link
              to="/resume-parsing"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all"
              style={{
                background: "rgba(201,205,208,0.06)",
                border: "1px solid rgba(201,205,208,0.15)",
                color: "#DCDCE0",
              }}
            >
              <FileSearch className="size-3.5" />
              <span>Full Skill Extraction</span>
            </Link>
          </div>
        }
      />

      {/* ── Sample Switcher & Upload Form ── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: File Upload & Target JD */}
        <div className="lg:col-span-2 space-y-6">
          <Panel>
            <PanelTitle icon={<FileCheck className="size-4" />}>
              Upload Document for Integrity Scan
            </PanelTitle>

            <div className="space-y-5">
              {/* Drag & Drop Area */}
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
                  Drag and drop your resume file here, or{" "}
                  <label
                    htmlFor="integrity-file-input"
                    className="cursor-pointer underline underline-offset-2 transition-colors hover:text-champagne"
                    style={{ color: "#C4A574" }}
                  >
                    browse files
                  </label>
                </p>
                <p className="mt-1 text-xs" style={{ color: "#85858E" }}>
                  Supports PDF or DOCX files up to 10 MB. Processed entirely within your browser.
                </p>

                <input
                  id="integrity-file-input"
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  className="sr-only"
                />

                {selectedFile && (
                  <div
                    className="mt-4 flex items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-mono"
                    style={{
                      background: "rgba(54,214,126,0.08)",
                      border: "1px solid rgba(54,214,126,0.2)",
                      color: "#DCDCE0",
                    }}
                  >
                    <FileText className="size-4 text-success-green" />
                    <span>{selectedFile.name}</span>
                    <span style={{ color: "#85858E" }}>
                      ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        loadSampleAudit("aarav");
                      }}
                      className="ml-2 rounded p-1 hover:bg-white/10"
                      aria-label="Remove file"
                    >
                      <X className="size-3.5" style={{ color: "#E05252" }} />
                    </button>
                  </div>
                )}
              </div>

              {/* Target Job Description Context */}
              <div>
                <label
                  htmlFor="target-jd-context"
                  className="block text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: "#85858E" }}
                >
                  Target Job Description Text (Optional — checks for verbatim plagiarized copying)
                </label>
                <textarea
                  id="target-jd-context"
                  rows={3}
                  value={targetJobDescription}
                  onChange={(e) => setTargetJobDescription(e.target.value)}
                  placeholder="Paste target job responsibilities or qualifications to scan for word-for-word copy matching..."
                  className="w-full rounded-xl p-3 text-xs font-mono placeholder:text-muted-foreground/50 transition-colors focus:outline-none focus:ring-1 focus:ring-champagne"
                  style={{
                    background: "rgba(201,205,208,0.04)",
                    border: "1px solid rgba(201,205,208,0.12)",
                    color: "#DCDCE0",
                  }}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const name = selectedFile?.name || auditResult.fileName;
                    setAuditResult(simulateIntegrityCheck(name, targetJobDescription));
                  }}
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all hover:scale-[1.02] shadow-lg"
                  style={{
                    background: "#DCDCE0",
                    color: "#050507",
                  }}
                >
                  <ShieldCheck className="size-4" />
                  <span>Run Integrity Check</span>
                </button>

                <p className="text-[11px]" style={{ color: "#85858E" }}>
                  Deterministic heuristic analysis · Zero data uploaded to cloud
                </p>
              </div>
            </div>
          </Panel>
        </div>

        {/* Right Col: Benchmark Presets & Sample Loader */}
        <div className="space-y-6">
          <Panel>
            <PanelTitle icon={<RotateCcw className="size-4" />}>
              Illustrative Sample Profiles
            </PanelTitle>
            <p className="text-xs leading-relaxed mb-4" style={{ color: "#85858E" }}>
              Switch between realistic baseline records to inspect how different resume formatting
              patterns score against ATS integrity filters:
            </p>

            <div className="space-y-2.5">
              {[
                {
                  key: "aarav",
                  label: "Aarav Sharma (Clean CV)",
                  tag: "Score 8 / 100 · Low Risk",
                  tone: "text-success-green",
                },
                {
                  key: "meera",
                  label: "Meera Iyer (Research Docx)",
                  tag: "Score 6 / 100 · Low Risk",
                  tone: "text-success-green",
                },
                {
                  key: "high_risk_demo",
                  label: "Suspect Keyword Engineered",
                  tag: "Score 42 / 100 · High Risk",
                  tone: "text-danger-red",
                },
              ].map((s) => {
                const active = activeSampleKey === s.key;
                return (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => loadSampleAudit(s.key)}
                    className="w-full text-left rounded-xl p-3.5 transition-all"
                    style={{
                      background: active ? "rgba(196,165,116,0.08)" : "rgba(201,205,208,0.03)",
                      border: active
                        ? "1px solid rgba(196,165,116,0.3)"
                        : "1px solid rgba(201,205,208,0.1)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-display text-xs font-bold" style={{ color: "#DCDCE0" }}>
                        {s.label}
                      </p>
                      {active && (
                        <CheckCircle2 className="size-3.5" style={{ color: "#C4A574" }} />
                      )}
                    </div>
                    <p className={`mt-1 font-mono text-[11px] font-semibold ${s.tone}`}>
                      {s.tag}
                    </p>
                  </button>
                );
              })}
            </div>
          </Panel>

          {/* Quick Guidance Box */}
          <div
            className="rounded-2xl p-5 border text-xs space-y-2"
            style={{
              background: "rgba(196,165,116,0.05)",
              borderColor: "rgba(196,165,116,0.18)",
              color: "#BDBDC3",
            }}
          >
            <div className="flex items-center gap-2 font-semibold" style={{ color: "#C4A574" }}>
              <Info className="size-4" />
              <span>ATS Anti-Cheat Best Practice</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              Modern enterprise ATS parsers strip styling, rendering 1pt fonts, white text, and
              hidden metadata visible to reviewers. Honest alignment out-scores artificial keyword
              stuffing every time.
            </p>
          </div>
        </div>
      </div>

      {/* ── Results Dashboard ── */}
      <div className="space-y-6">
        {/* Top Score Banner */}
        <div
          className="rounded-2xl border p-6 sm:p-8 relative overflow-hidden backdrop-blur-md"
          style={{
            background:
              "linear-gradient(135deg, rgba(20,20,24,0.4) 0%, rgba(18,18,22,0.48) 100%)",
            borderColor: riskBadgeColor.border,
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider"
                  style={{
                    background: riskBadgeColor.bg,
                    color: riskBadgeColor.text,
                    border: `1px solid ${riskBadgeColor.border}`,
                  }}
                >
                  {auditResult.riskCategory === "High" ? (
                    <ShieldAlert className="size-3.5" />
                  ) : (
                    <ShieldCheck className="size-3.5" />
                  )}
                  {auditResult.riskCategory} Risk Profile
                </span>
                <span className="font-mono text-xs" style={{ color: "#85858E" }}>
                  File: {auditResult.fileName} · Analyzed {auditResult.analyzedAt}
                </span>
              </div>

              <h2
                className="font-display text-2xl sm:text-3xl font-bold tracking-tight"
                style={{ color: "#DCDCE0" }}
              >
                Overall Risk Score:{" "}
                <span style={{ color: riskBadgeColor.text }}>{auditResult.overallScore}</span>
                <span className="text-base font-normal text-slate-grey"> / 100</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-grey max-w-2xl leading-relaxed">
                {auditResult.riskCategory === "Low"
                  ? "This resume exhibits clean semantic structure with no intentional keyword concealment or malicious text stream injection."
                  : auditResult.riskCategory === "Medium"
                    ? "Minor integrity issues detected. A few unsupported skills or layout tab anomalies may impact enterprise ATS parsers."
                    : "Severe compliance red flags detected. Obfuscated text blocks, hidden fonts, or verbatim matching can trigger automated rejection."}
              </p>
            </div>

            {/* Score Ring / Metric pill */}
            <div className="flex items-center gap-4 sm:gap-6 self-start lg:self-center">
              <div
                className="flex flex-col items-center justify-center rounded-2xl p-4 min-w-[130px] border"
                style={{
                  background: "rgba(201,205,208,0.03)",
                  borderColor: "rgba(201,205,208,0.1)",
                }}
              >
                <span className="font-mono text-xs uppercase" style={{ color: "#85858E" }}>
                  Parse Density
                </span>
                <span className="font-mono text-2xl font-bold mt-1 text-frost-white">
                  {auditResult.metrics.parsableTextDensity}%
                </span>
                <span className="text-[10px] font-mono text-success-green mt-0.5">High Quality</span>
              </div>

              <div
                className="flex flex-col items-center justify-center rounded-2xl p-4 min-w-[130px] border"
                style={{
                  background: "rgba(201,205,208,0.03)",
                  borderColor: "rgba(201,205,208,0.1)",
                }}
              >
                <span className="font-mono text-xs uppercase" style={{ color: "#85858E" }}>
                  Clean Chars
                </span>
                <span className="font-mono text-2xl font-bold mt-1 text-frost-white">
                  {auditResult.metrics.cleanCharactersRatio}%
                </span>
                <span className="text-[10px] font-mono text-champagne mt-0.5">No Obfuscation</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 6 Detection Vectors Grid ── */}
        <div>
          <h3
            className="font-mono text-xs font-semibold uppercase tracking-widest text-champagne mb-4"
          >
            6-Vector Heuristic Breakdown
          </h3>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INTEGRITY_VECTORS.map((v) => {
              const vectorKey =
                v.id === "hidden_text"
                  ? "hiddenText"
                  : v.id === "zero_width"
                    ? "zeroWidth"
                    : v.id === "keyword_stuffing"
                      ? "keywordStuffing"
                      : v.id === "verbatim_jd"
                        ? "verbatimJD"
                        : v.id === "unsupported_claims"
                          ? "unsupportedClaims"
                          : "documentParseability";

              const score = auditResult.vectorScores[vectorKey] ?? 0;
              const isClean = score < 15;
              const isWarn = score >= 15 && score < 30;

              return (
                <div
                  key={v.id}
                  className="rounded-2xl border p-5 transition-all backdrop-blur-md flex flex-col justify-between"
                  style={{
                    background: "rgba(20,20,24,0.3)",
                    borderColor: isClean
                      ? "rgba(201,205,208,0.1)"
                      : isWarn
                        ? "rgba(196,165,116,0.3)"
                        : "rgba(224,82,82,0.35)",
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold" style={{ color: "#DCDCE0" }}>
                        {v.name}
                      </span>
                      <span
                        className="font-mono text-xs font-semibold"
                        style={{ color: isClean ? "#36D67E" : isWarn ? "#C4A574" : "#E05252" }}
                      >
                        {score}% risk
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-grey mb-4">{v.desc}</p>
                  </div>

                  <div>
                    <ProgressBar
                      value={score}
                      tone={isClean ? "success" : isWarn ? "warning" : "destructive"}
                      className="h-1.5"
                    />
                    <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-grey">
                      <span>Status:</span>
                      <span style={{ color: isClean ? "#36D67E" : isWarn ? "#C4A574" : "#E05252" }}>
                        {isClean ? "Clean Signal" : isWarn ? "Attention Needed" : "Flagged Issue"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Detailed Findings Section ── */}
        <Panel>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
            <div>
              <PanelTitle icon={<ShieldAlert className="size-4 text-champagne" />}>
                Detailed Inspection Findings ({auditResult.findings.length})
              </PanelTitle>
              <p className="text-xs text-slate-grey -mt-3">
                Review each flagged item, its concrete evidence snippet, and recommended next steps.
              </p>
            </div>

            {/* Filter by vector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-grey">Filter:</span>
              <select
                value={activeVectorFilter}
                onChange={(e) => setActiveVectorFilter(e.target.value)}
                className="rounded-lg px-2.5 py-1.5 text-xs font-mono border focus:outline-none focus:ring-1 focus:ring-champagne"
                style={{
                  background: "rgba(201,205,208,0.06)",
                  borderColor: "rgba(201,205,208,0.15)",
                  color: "#DCDCE0",
                }}
              >
                <option value="all">All Vectors</option>
                {INTEGRITY_VECTORS.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredFindings.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono text-slate-grey">
              No findings flagged under the selected filter.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFindings.map((finding) => {
                const isExpanded = expandedFindings[finding.id];
                const sevColor =
                  finding.severity === "high"
                    ? "#E05252"
                    : finding.severity === "medium"
                      ? "#C4A574"
                      : "#85858E";

                return (
                  <div
                    key={finding.id}
                    className="rounded-xl border transition-all overflow-hidden"
                    style={{
                      background: "rgba(201,205,208,0.02)",
                      borderColor: "rgba(201,205,208,0.1)",
                    }}
                  >
                    {/* Finding Header */}
                    <button
                      type="button"
                      onClick={() => toggleFinding(finding.id)}
                      className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-white/[0.02]"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="size-2 rounded-full shrink-0"
                          style={{ background: sevColor }}
                        />
                        <div>
                          <p className="font-display text-sm font-semibold text-frost-white">
                            {finding.title}
                          </p>
                          <p className="font-mono text-[11px] text-slate-grey mt-0.5">
                            Vector: {finding.vectorName} · Severity:{" "}
                            <span className="uppercase font-semibold" style={{ color: sevColor }}>
                              {finding.severity}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-slate-grey">
                        <span className="text-xs font-mono">
                          {isExpanded ? "Collapse" : "Inspect"}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="size-4" />
                        ) : (
                          <ChevronDown className="size-4" />
                        )}
                      </div>
                    </button>

                    {/* Expandable Details */}
                    {isExpanded && (
                      <div
                        className="p-4 pt-0 space-y-3.5 border-t border-white/5 text-xs text-slate-grey"
                      >
                        <div>
                          <span className="font-semibold text-mist-silver block mb-1">
                            Explanation:
                          </span>
                          <p className="leading-relaxed">{finding.explanation}</p>
                        </div>

                        <div>
                          <span className="font-semibold text-mist-silver block mb-1">
                            Evidence Snippet:
                          </span>
                          <div
                            className="rounded-lg p-3 font-mono text-[11px] leading-relaxed border"
                            style={{
                              background: "rgba(0,0,0,0.4)",
                              borderColor: "rgba(201,205,208,0.1)",
                              color: "#DCDCE0",
                            }}
                          >
                            {finding.evidence}
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3 pt-1">
                          <div
                            className="rounded-lg p-3 border"
                            style={{
                              background: "rgba(201,205,208,0.03)",
                              borderColor: "rgba(201,205,208,0.08)",
                            }}
                          >
                            <span className="font-semibold text-champagne block mb-1">
                              Why It Matters:
                            </span>
                            <p className="leading-relaxed">{finding.impact}</p>
                          </div>

                          <div
                            className="rounded-lg p-3 border"
                            style={{
                              background: "rgba(54,214,126,0.04)",
                              borderColor: "rgba(54,214,126,0.15)",
                            }}
                          >
                            <span className="font-semibold text-success-green block mb-1">
                              Recommended Fix:
                            </span>
                            <p className="leading-relaxed text-cloud-silver">
                              {finding.recommendation}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}

