// Job Application Pipeline Store
// Manages candidate job applications across 5 pipeline stages:
// saved, applied, interview, offer, rejected.
// Persists in localStorage with reactive dispatch.

export type ApplicationStage = "saved" | "applied" | "interview" | "offer" | "rejected";

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  stage: ApplicationStage;
  appliedDate: string;
  lastUpdated: string;
  linkedResume: string;
  matchScore?: number | undefined;
  salaryExpectation?: string | undefined;
  location?: string | undefined;
  notes?: string | undefined;
  contactPerson?: string | undefined;
  interviewRound?: string | undefined;
}

const STORAGE_KEY = "cairn.applications.v1";
const EVENT_NAME = "cairn:applications-updated";

export const STAGES: { id: ApplicationStage; label: string; color: string; bg: string }[] = [
  { id: "saved", label: "Saved", color: "#85858E", bg: "rgba(133,133,142,0.1)" },
  { id: "applied", label: "Applied", color: "#C4A574", bg: "rgba(196,165,116,0.1)" },
  { id: "interview", label: "Interviewing", color: "#3B82F6", bg: "rgba(59,130,246,0.1)" },
  { id: "offer", label: "Offer Received", color: "#36D67E", bg: "rgba(54,214,126,0.1)" },
  { id: "rejected", label: "Archived / Rejected", color: "#E05252", bg: "rgba(224,82,82,0.1)" },
];

const SEED_APPLICATIONS: JobApplication[] = [
  {
    id: "app-1",
    company: "Stripe",
    role: "Backend Engineer — Payments Infrastructure",
    stage: "interview",
    appliedDate: "2026-10-14",
    lastUpdated: "2026-10-27",
    linkedResume: "aarav_sharma_cv_2026.pdf",
    matchScore: 88,
    salaryExpectation: "$165k - $185k",
    location: "Remote (US/EU)",
    notes: "Passed technical screen. Round 2: Architecture & Concurrency round scheduled for Friday.",
    contactPerson: "Elena Vance (Technical Recruiter)",
    interviewRound: "Round 2: System Architecture",
  },
  {
    id: "app-2",
    company: "Google LLC",
    role: "Software Engineer III (L4)",
    stage: "interview",
    appliedDate: "2026-10-10",
    lastUpdated: "2026-10-25",
    linkedResume: "aarav_sharma_cv_2026.pdf",
    matchScore: 84,
    salaryExpectation: "$170k - $195k",
    location: "Mountain View, CA",
    notes: "Completed phone screen. 5 on-site virtual interview loops arranged across Algorithms and Distributed Systems.",
    contactPerson: "Marcus Chen",
    interviewRound: "Onsite Technical Rounds",
  },
  {
    id: "app-3",
    company: "Datadog",
    role: "Systems Software Engineer — Telemetry",
    stage: "applied",
    appliedDate: "2026-10-20",
    lastUpdated: "2026-10-20",
    linkedResume: "aarav_sharma_systems_focused.pdf",
    matchScore: 82,
    salaryExpectation: "$160k - $180k",
    location: "New York, NY",
    notes: "Application submitted with custom LSM-tree project writeup attached.",
  },
  {
    id: "app-4",
    company: "Cloudflare",
    role: "Systems Engineer — Edge Compute",
    stage: "offer",
    appliedDate: "2026-09-28",
    lastUpdated: "2026-10-28",
    linkedResume: "aarav_sharma_systems_focused.pdf",
    matchScore: 92,
    salaryExpectation: "$175k base + equity",
    location: "San Francisco, CA (Hybrid)",
    notes: "Written offer letter received. Reviewing compensation breakdown and team matching options.",
    contactPerson: "Sarah Jenkins (Talent Partner)",
    interviewRound: "Offer Evaluation Stage",
  },
  {
    id: "app-5",
    company: "Amazon AWS",
    role: "Software Development Engineer (SDE II)",
    stage: "saved",
    appliedDate: "2026-10-26",
    lastUpdated: "2026-10-26",
    linkedResume: "aarav_sharma_cv_2026.pdf",
    matchScore: 79,
    location: "Seattle, WA",
    notes: "Bookmarked posting. Reviewing team focus on DynamoDB storage engine.",
  },
  {
    id: "app-6",
    company: "Meta",
    role: "Production Engineer — Infrastructure",
    stage: "rejected",
    appliedDate: "2026-09-12",
    lastUpdated: "2026-10-04",
    linkedResume: "aarav_resume_draft.docx",
    matchScore: 71,
    location: "Menlo Park, CA",
    notes: "Received standard high-volume notification after resume screen. Re-evaluate in 6 months with stronger Linux networking depth.",
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

export function loadApplications(): JobApplication[] {
  try {
    const raw = safeGetItem(STORAGE_KEY);
    if (!raw) {
      safeSetItem(STORAGE_KEY, JSON.stringify(SEED_APPLICATIONS));
      return SEED_APPLICATIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED_APPLICATIONS;
  } catch {
    return SEED_APPLICATIONS;
  }
}

export function saveApplications(apps: JobApplication[]) {
  safeSetItem(STORAGE_KEY, JSON.stringify(apps));
  if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
    try {
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: apps }));
    } catch {}
  }
}

export function addApplication(app: Omit<JobApplication, "id" | "lastUpdated">): JobApplication {
  const current = loadApplications();
  const newApp: JobApplication = {
    ...app,
    id: `app-${Date.now()}`,
    lastUpdated: new Date().toISOString().split("T")[0]!,
  };
  const updated = [newApp, ...current];
  saveApplications(updated);
  return newApp;
}

export function updateApplication(id: string, updates: Partial<JobApplication>): JobApplication | null {
  const current = loadApplications();
  let updatedApp: JobApplication | null = null;
  const updated = current.map((app) => {
    if (app.id === id) {
      updatedApp = {
        ...app,
        ...updates,
        lastUpdated: new Date().toISOString().split("T")[0]!,
      };
      return updatedApp;
    }
    return app;
  });
  saveApplications(updated);
  return updatedApp;
}

export function moveApplicationStage(id: string, stage: ApplicationStage) {
  return updateApplication(id, { stage });
}

export function deleteApplication(id: string) {
  const current = loadApplications();
  const updated = current.filter((app) => app.id !== id);
  saveApplications(updated);
}

export function resetApplications() {
  saveApplications(SEED_APPLICATIONS);
}

export function subscribeApplications(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener("storage", handler);
  };
}
