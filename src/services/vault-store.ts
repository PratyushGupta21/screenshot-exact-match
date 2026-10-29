// Candidate Resume Vault Store
// Manages local candidate resume files and metadata in browser localStorage.
// All files and extracted previews remain on-device.

export interface VaultResumeItem {
  id: string;
  fileName: string;
  fileSizeFormatted: string;
  fileSizeBytes: number;
  fileType: "pdf" | "docx";
  uploadedAt: string;
  isPrimary: boolean;
  versionLabel?: string;
  extractedSkillsCount: number;
  parsedSummary: {
    name: string;
    email: string;
    targetRole: string;
    skills: string[];
    experienceSnippets: string[];
  };
}

const STORAGE_KEY = "cairn.vault.v1";
const EVENT_NAME = "cairn:vault-updated";

const SEED_RESUMES: VaultResumeItem[] = [
  {
    id: "vr-1",
    fileName: "aarav_sharma_cv_2026.pdf",
    fileSizeFormatted: "348 KB",
    fileSizeBytes: 356352,
    fileType: "pdf",
    uploadedAt: "2026-10-24",
    isPrimary: true,
    versionLabel: "v2.4 Final",
    extractedSkillsCount: 16,
    parsedSummary: {
      name: "Aarav Sharma",
      email: "aarav.sharma@example.com",
      targetRole: "Software Engineer — Backend",
      skills: ["Python", "Go", "PostgreSQL", "Redis", "Docker", "Algorithms", "Git"],
      experienceSnippets: [
        "Backend Intern, Sample Fintech Pvt Ltd — Built asynchronous payment reconciliation pipelines.",
        "Finalist, Smart India Hackathon 2025 — Architected high-concurrency event registration backend.",
      ],
    },
  },
  {
    id: "vr-2",
    fileName: "aarav_sharma_systems_focused.pdf",
    fileSizeFormatted: "412 KB",
    fileSizeBytes: 421888,
    fileType: "pdf",
    uploadedAt: "2026-10-12",
    isPrimary: false,
    versionLabel: "v2.1 Systems Variant",
    extractedSkillsCount: 14,
    parsedSummary: {
      name: "Aarav Sharma",
      email: "aarav.sharma@example.com",
      targetRole: "Distributed Systems Engineer",
      skills: ["Go", "LSM Trees", "Concurrency", "Linux Kernel", "gRPC", "Docker"],
      experienceSnippets: [
        "Authored custom LSM-tree storage engine in Go with Write-Ahead Logging and WAL recovery.",
      ],
    },
  },
  {
    id: "vr-3",
    fileName: "aarav_resume_draft.docx",
    fileSizeFormatted: "186 KB",
    fileSizeBytes: 190464,
    fileType: "docx",
    uploadedAt: "2026-09-28",
    isPrimary: false,
    versionLabel: "v1.8 Word Draft",
    extractedSkillsCount: 11,
    parsedSummary: {
      name: "Aarav Sharma",
      email: "aarav.sharma@example.com",
      targetRole: "Full Stack Developer",
      skills: ["Python", "Flask", "React", "SQL", "HTML/CSS"],
      experienceSnippets: [
        "Full stack hackathon web applications and collegiate coursework portals.",
      ],
    },
  },
];

function safeGetItem(key: string): string | null {
  try {
    if (typeof window !== "undefined" && window.localStorage && typeof window.localStorage.getItem === "function") {
      return window.localStorage.getItem(key);
    }
  } catch {}
  return null;
}

function safeSetItem(key: string, value: string) {
  try {
    if (typeof window !== "undefined" && window.localStorage && typeof window.localStorage.setItem === "function") {
      window.localStorage.setItem(key, value);
    }
  } catch {}
}

export function loadVaultResumes(): VaultResumeItem[] {
  try {
    const raw = safeGetItem(STORAGE_KEY);
    if (!raw) {
      safeSetItem(STORAGE_KEY, JSON.stringify(SEED_RESUMES));
      return SEED_RESUMES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED_RESUMES;
  } catch {
    return SEED_RESUMES;
  }
}

export function saveVaultResumes(items: VaultResumeItem[]) {
  safeSetItem(STORAGE_KEY, JSON.stringify(items));
  if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
    try {
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: items }));
    } catch {}
  }
}

export function addVaultResume(file: File): VaultResumeItem {
  const current = loadVaultResumes();
  const isDocx = file.name.toLowerCase().endsWith(".docx");
  const sizeKb = Math.round(file.size / 1024);

  const newItem: VaultResumeItem = {
    id: `vr-${Date.now()}`,
    fileName: file.name,
    fileSizeFormatted: `${sizeKb} KB`,
    fileSizeBytes: file.size,
    fileType: isDocx ? "docx" : "pdf",
    uploadedAt: new Date().toISOString().split("T")[0]!,
    isPrimary: current.length === 0, // First resume becomes primary automatically
    versionLabel: `v${(current.length + 1).toFixed(1)} Upload`,
    extractedSkillsCount: 12 + (file.name.length % 6),
    parsedSummary: {
      name: "Candidate Profile",
      email: "candidate@example.com",
      targetRole: "Software Engineer",
      skills: ["Python", "SQL", "Git", "Problem Solving", "Data Structures"],
      experienceSnippets: [
        `Local file upload: ${file.name}. Parsed on-device without remote transmission.`,
      ],
    },
  };

  const updated = [newItem, ...current];
  saveVaultResumes(updated);
  return newItem;
}

export function setPrimaryResume(id: string) {
  const current = loadVaultResumes();
  const updated = current.map((item) => ({
    ...item,
    isPrimary: item.id === id,
  }));
  saveVaultResumes(updated);
}

export function renameVaultResume(id: string, newFileName: string) {
  const current = loadVaultResumes();
  const updated = current.map((item) =>
    item.id === id ? { ...item, fileName: newFileName.trim() } : item,
  );
  saveVaultResumes(updated);
}

export function deleteVaultResume(id: string) {
  const current = loadVaultResumes();
  const updated = current.filter((item) => item.id !== id);
  // If we deleted the primary, make the first remaining resume primary
  if (updated.length > 0 && !updated.some((r) => r.isPrimary)) {
    updated[0]!.isPrimary = true;
  }
  saveVaultResumes(updated);
}

export function resetVaultResumes() {
  saveVaultResumes(SEED_RESUMES);
}

export function subscribeVaultResumes(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener("storage", handler);
  };
}
