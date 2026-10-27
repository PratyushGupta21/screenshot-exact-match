// Persistent client store for Job Descriptions.
import type { JobDescription } from "@/lib/radix/types";
import { SAMPLE_JOBS } from "@/mocks/data";

const KEY = "cairn.jobs.v1";
const LEGACY_KEY = "radix.jobs.v1";
const EVENT_NAME = "cairn:jobs-updated";

export function loadSavedJobs(): JobDescription[] {
  if (typeof window === "undefined") return SAMPLE_JOBS;
  try {
    const raw = window.localStorage.getItem(KEY) || window.localStorage.getItem(LEGACY_KEY);
    if (!raw) {
      window.localStorage.setItem(KEY, JSON.stringify(SAMPLE_JOBS));
      return SAMPLE_JOBS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed as JobDescription[];
    }
    return SAMPLE_JOBS;
  } catch {
    return SAMPLE_JOBS;
  }
}

export function saveJob(job: JobDescription) {
  if (typeof window === "undefined") return;
  const current = loadSavedJobs();
  const index = current.findIndex((j) => j.id === job.id);
  const updated = index >= 0 ? current.map((j) => (j.id === job.id ? job : j)) : [job, ...current];
  window.localStorage.setItem(KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: updated }));
}

export function deleteJob(id: string) {
  if (typeof window === "undefined") return;
  const current = loadSavedJobs();
  const updated = current.filter((j) => j.id !== id);
  window.localStorage.setItem(KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: updated }));
}

export function getJobById(id: string): JobDescription | undefined {
  return loadSavedJobs().find((j) => j.id === id);
}

export function subscribeJobs(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener("storage", handler);
  };
}
