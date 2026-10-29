// ATS Integrity & Anti-Cheat Analysis Service
// Deterministic detection model covering 6 integrity vectors.
// Illustrative analysis — sample data and simulated client-side audits.

export type IntegritySeverity = "low" | "medium" | "high";
export type RiskCategory = "Low" | "Medium" | "High";

export interface IntegrityFinding {
  id: string;
  vectorId: string;
  vectorName: string;
  severity: IntegritySeverity;
  title: string;
  explanation: string;
  evidence: string;
  impact: string;
  recommendation: string;
}

export interface IntegrityAuditResult {
  candidateId: string;
  fileName: string;
  targetRole?: string;
  analyzedAt: string;
  overallScore: number; // 0-100 (Risk Score: lower is safer)
  riskCategory: RiskCategory;
  findings: IntegrityFinding[];
  vectorScores: {
    hiddenText: number; // 0-100 risk
    zeroWidth: number;
    keywordStuffing: number;
    verbatimJD: number;
    unsupportedClaims: number;
    documentParseability: number;
  };
  metrics: {
    cleanCharactersRatio: number;
    parsableTextDensity: number;
    keywordVarianceIndex: number;
    evidenceBackingRate: number;
  };
}

export const INTEGRITY_VECTORS = [
  { id: "hidden_text", name: "Hidden Text Detection", desc: "Scans for 1pt micro-fonts, white-on-white text, or opacity-0 blocks hidden in headers/footers." },
  { id: "zero_width", name: "Zero-Width Characters", desc: "Identifies Unicode zero-width spaces (U+200B), non-joiners (U+200C), and invisible character injection." },
  { id: "keyword_stuffing", name: "Keyword Stuffing", desc: "Analyzes semantic keyword frequency anomalies and unnatural skill repetition in white space." },
  { id: "verbatim_jd", name: "Verbatim JD Copying", desc: "Flags exact paragraph or multi-sentence verbatim blocks lifted directly from job specifications." },
  { id: "unsupported_claims", name: "Unsupported Skill Claims", desc: "Detects specialized tools or languages listed without corresponding project, work, or education evidence." },
  { id: "parseability", name: "Parseability Audit", desc: "Evaluates multi-column tables, complex vector paths, text layer layering, and font encoding health." },
] as const;

export interface SampleIntegrityAudits {
  aarav: IntegrityAuditResult;
  high_risk_demo: IntegrityAuditResult;
  [key: string]: IntegrityAuditResult | undefined;
}

export const SAMPLE_INTEGRITY_AUDITS: SampleIntegrityAudits = {
  aarav: {
    candidateId: "aarav",
    fileName: "aarav_sharma_cv.pdf",
    targetRole: "Software Engineer — Backend",
    analyzedAt: "2026-10-28",
    overallScore: 8,
    riskCategory: "Low",
    vectorScores: {
      hiddenText: 0,
      zeroWidth: 0,
      keywordStuffing: 12,
      verbatimJD: 5,
      unsupportedClaims: 15,
      documentParseability: 8,
    },
    metrics: {
      cleanCharactersRatio: 99.8,
      parsableTextDensity: 94.5,
      keywordVarianceIndex: 88.0,
      evidenceBackingRate: 91.5,
    },
    findings: [
      {
        id: "f-1",
        vectorId: "unsupported_claims",
        vectorName: "Unsupported Skill Claims",
        severity: "low",
        title: "Docker Listed with Minimal Project Elaboration",
        explanation: "Docker appears in the technical skills inventory but lacks contextual usage descriptions in the 3 project blurbs.",
        evidence: 'Skills section includes "Docker, Linux, Git", but project bullet points only describe Python and Flask APIs.',
        impact: "Recruiters and automated screeners may classify Docker competency as theoretical or introductory.",
        recommendation: "Add 1 bullet point explaining how you containerized your Flask hackathon service (e.g., Dockerfile configuration, compose setup).",
      },
      {
        id: "f-2",
        vectorId: "keyword_stuffing",
        vectorName: "Keyword Stuffing",
        severity: "low",
        title: "Repeated Generic Database Mentions",
        explanation: 'The token "Database" is repeated 7 times across the summary and coursework sections within 180 words.',
        evidence: '"database management, relational databases, database query optimization, database design"',
        impact: "Slightly reduces semantic density; does not trigger harsh ATS penalties.",
        recommendation: 'Replace generic "database" repetitions with specific tech stacks like "PostgreSQL relational schemas" or "SQL indexing".',
      },
      {
        id: "f-3",
        vectorId: "parseability",
        vectorName: "Parseability Audit",
        severity: "low",
        title: "Two-Column Education Layout",
        explanation: "Education dates and institution names use dual floating tab stops which older legacy ATS parsers may linearize out of order.",
        evidence: "Example Institute of Technology [Tab Stop 3.5in] 2022 - 2026",
        impact: "Minor risk of date misalignment on older enterprise ATS portals (e.g. legacy Taleo/Workday).",
        recommendation: "Use standard single-column stacked blocks for education headers for 100% universal parsing compliance.",
      },
    ],
  },
  meera: {
    candidateId: "meera",
    fileName: "meera_iyer_resume.docx",
    targetRole: "ML Engineer — Research",
    analyzedAt: "2026-10-29",
    overallScore: 6,
    riskCategory: "Low",
    vectorScores: {
      hiddenText: 0,
      zeroWidth: 0,
      keywordStuffing: 8,
      verbatimJD: 4,
      unsupportedClaims: 10,
      documentParseability: 4,
    },
    metrics: {
      cleanCharactersRatio: 100.0,
      parsableTextDensity: 97.2,
      keywordVarianceIndex: 92.4,
      evidenceBackingRate: 96.0,
    },
    findings: [
      {
        id: "f-4",
        vectorId: "unsupported_claims",
        vectorName: "Unsupported Skill Claims",
        severity: "low",
        title: "Kubernetes Mentioned in Headline Only",
        explanation: 'Headline mentions "MLOps & K8s", but thesis work focuses primarily on PyTorch model weights without cluster orchestrations.',
        evidence: 'Headline: "Machine Learning Researcher | PyTorch & K8s" vs Body: PyTorch research papers and thesis work.',
        impact: "May invite deep infrastructure interview questions that do not reflect candidate core thesis focus.",
        recommendation: "Clarify whether Kubernetes experience was production cluster administration or local minikube test deploys.",
      },
    ],
  },
  high_risk_demo: {
    candidateId: "flagged_sample",
    fileName: "suspect_engineered_cv.pdf",
    targetRole: "Senior Systems Engineer",
    analyzedAt: "2026-10-27",
    overallScore: 42,
    riskCategory: "High",
    vectorScores: {
      hiddenText: 65,
      zeroWidth: 40,
      keywordStuffing: 58,
      verbatimJD: 35,
      unsupportedClaims: 48,
      documentParseability: 32,
    },
    metrics: {
      cleanCharactersRatio: 84.2,
      parsableTextDensity: 71.0,
      keywordVarianceIndex: 45.2,
      evidenceBackingRate: 52.0,
    },
    findings: [
      {
        id: "f-5",
        vectorId: "hidden_text",
        vectorName: "Hidden Text Detection",
        severity: "high",
        title: "Micro-font Keyword Block in Footer Layer",
        explanation: "1-point font text block detected in footer margins containing 42 high-frequency systems engineering keywords.",
        evidence: 'Footer stream contains: "Kubernetes Kafka eBPF Linux Kernel Distributed Systems Paxos Raft Golang Rust C++" at font-size 1.2pt in color #FEFEFE.',
        impact: "Modern ATS platforms (Greenhouse, Lever, Workday) actively flag intentional prompt/keyword injection and will auto-disqualify.",
        recommendation: "Immediately remove hidden text blocks. ATS systems parse raw text streams regardless of rendered opacity.",
      },
      {
        id: "f-6",
        vectorId: "zero_width",
        vectorName: "Zero-Width Characters",
        severity: "medium",
        title: "Zero-Width Space Sequences Detected",
        explanation: "18 instances of U+200B (Zero-Width Space) found embedded between keyword syllables.",
        evidence: "K​u​b​e​r​n​e​t​e​s, D​i​s​t​r​i​b​u​t​e​d, S​y​s​t​e​m​s",
        impact: "Often introduced by copy-pasting from online obfuscation tools or automated generative prompt templates.",
        recommendation: "Export resume directly from source markdown/word processor without third-party text injection cleaners.",
      },
      {
        id: "f-7",
        vectorId: "verbatim_jd",
        vectorName: "Verbatim JD Copying",
        severity: "high",
        title: "98% Verbatim Match to Public Job Specification",
        explanation: "The summary section contains two 34-word sentences copied word-for-word from a known cloud infrastructure job listing.",
        evidence: '"Architect, deploy, and maintain mission-critical distributed data pipelines handling over 50,000 queries per second with sub-10ms p99 latency."',
        impact: "Plagiarism checkers and technical recruiters easily recognize verbatim JD phrasing in candidate work summaries.",
        recommendation: "Rephrase achievements in terms of your actual contributions, metrics, and technical constraints.",
      },
    ],
  },
};

export function simulateIntegrityCheck(fileName: string, targetRole?: string): IntegrityAuditResult {
  // Deterministic calculation based on file name characteristics
  const lower = fileName.toLowerCase();
  const isDocx = lower.endsWith(".docx");
  const isHighRisk = lower.includes("cheat") || lower.includes("hack") || lower.includes("stuff");

  if (isHighRisk) {
    return {
      ...SAMPLE_INTEGRITY_AUDITS.high_risk_demo,
      fileName,
      targetRole: targetRole || "Systems Architect",
      analyzedAt: new Date().toISOString().split("T")[0]!,
    };
  }

  const base = SAMPLE_INTEGRITY_AUDITS.aarav;
  return {
    ...base,
    fileName,
    targetRole: targetRole || "Software Engineer",
    analyzedAt: new Date().toISOString().split("T")[0]!,
    overallScore: isDocx ? 7 : 9,
    riskCategory: "Low",
  };
}

