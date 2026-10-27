// Persistent client store for Talent Check & Skill Matching analysis history.
import type { HistoryRecord } from "@/lib/radix/types";
import { SAMPLE_HISTORY_BASE } from "@/mocks/data";

const KEY = "cairn.history.v1";
const LEGACY_KEY = "radix.history.v1";
const EVENT_NAME = "cairn:history-updated";

function initialHistory(): HistoryRecord[] {
  return SAMPLE_HISTORY_BASE.map((h) => ({
    ...h,
    candidateId: h.candidate,
    score: h.type === "talent_check" ? 78 : 75,
  }));
}

export function loadHistory(): HistoryRecord[] {
  if (typeof window === "undefined") return initialHistory();
  try {
    const raw = window.localStorage.getItem(KEY) || window.localStorage.getItem(LEGACY_KEY);
    if (!raw) {
      const init = initialHistory();
      window.localStorage.setItem(KEY, JSON.stringify(init));
      return init;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed as HistoryRecord[];
    }
    return initialHistory();
  } catch {
    return initialHistory();
  }
}

export function addHistoryRecord(record: {
  type: "talent_check" | "skill_matching";
  company: string;
  role: string;
  candidate: string;
  candidateId: string;
  jobId?: string;
  score: number | null;
  status?: "completed" | "failed" | "processing";
}): HistoryRecord {
  const current = loadHistory();
  const newRecord: HistoryRecord = {
    id: `run-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type: record.type,
    company: record.company,
    role: record.role,
    candidate: record.candidate,
    candidateId: record.candidateId,
    jobId: record.jobId,
    date: new Date().toISOString().split("T")[0]!,
    score: record.score,
    status: record.status ?? "completed",
  };

  const updated = [newRecord, ...current];
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: updated }));
  }
  return newRecord;
}

export function clearHistory() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify([]));
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: [] }));
}

export function resetHistory() {
  if (typeof window === "undefined") return;
  const init = initialHistory();
  window.localStorage.setItem(KEY, JSON.stringify(init));
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: init }));
}

export function subscribeHistory(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener("storage", handler);
  };
}
