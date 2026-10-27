// Integration layer & client service facade.
// In demo mode, processes requests with shared local stores and deterministic scoring.
// To connect the Python backend, replace bodies with fetch calls to REST endpoints.
import { computeSkillMatch, computeTalentCheck } from "@/lib/radix/scoring";
import type {
  ExtractedSkillList,
  HistoryRecord,
  ParsedResume,
  SkillMatchingResult,
  TalentCheckResult,
} from "@/lib/radix/types";
import {
  SAMPLE_CANDIDATES,
  SAMPLE_COMPANY_REQUIREMENTS,
  SAMPLE_JD_EXTRACTION,
  SAMPLE_PARSED_RESUME,
  type DemoCandidate,
} from "@/mocks/data";
import { loadHistory, addHistoryRecord } from "./history-store";
import { loadSavedJobs, getJobById } from "./jd-store";
import { getActiveCandidate } from "./profile-store";

const delay = (ms = 900) => new Promise((r) => setTimeout(r, ms));

export function getCandidates(): DemoCandidate[] {
  const active = getActiveCandidate();
  // Name label clarifies that this is the candidate's active profile
  const myCandidate: DemoCandidate = {
    ...active,
    profile: {
      ...active.profile,
      name: active.profile.name ? `${active.profile.name} (Active Profile)` : "My Profile (Active)",
    },
  };
  return [myCandidate, ...SAMPLE_CANDIDATES];
}

export function getCandidate(id: string): DemoCandidate {
  if (id === "my-profile") {
    return getActiveCandidate();
  }
  const found = SAMPLE_CANDIDATES.find((c) => c.id === id);
  return found ?? getActiveCandidate();
}

export function getJobs() {
  return loadSavedJobs();
}

export function getJob(id: string) {
  const found = getJobById(id);
  if (found) return found;
  const all = loadSavedJobs();
  return all[0]!;
}

export async function analyzeJobDescription(
  file: File | { name: string },
  meta: { company: string; role: string },
): Promise<ExtractedSkillList> {
  await delay(1000);
  return {
    ...SAMPLE_JD_EXTRACTION,
    source_file: file.name,
    company: meta.company || SAMPLE_JD_EXTRACTION.company,
    role: meta.role || SAMPLE_JD_EXTRACTION.role,
  };
}

export async function parseResume(file: File | { name: string }): Promise<ParsedResume> {
  await delay(1000);
  return {
    ...SAMPLE_PARSED_RESUME,
    extracted: {
      ...SAMPLE_PARSED_RESUME.extracted,
      source_file: file.name,
    },
  };
}

/** Synchronous calculation (used by dashboard + history to stay consistent). */
export function talentCheckSync(candidateId: string, company: string): TalentCheckResult {
  const requirements =
    SAMPLE_COMPANY_REQUIREMENTS[company] ?? SAMPLE_COMPANY_REQUIREMENTS["Google LLC"]!;
  const cand = getCandidate(candidateId);
  return computeTalentCheck(company, requirements, cand.levels);
}

export function skillMatchSync(candidateId: string, jobId: string): SkillMatchingResult {
  const job = getJob(jobId);
  const cand = getCandidate(candidateId);
  const candidateSkills = cand.profile.skills.map((s) => s.skill_name);
  return computeSkillMatch(job.source_file, job.required_skills, candidateSkills);
}

export async function runTalentCheck(
  candidateId: string,
  company: string,
): Promise<TalentCheckResult> {
  await delay(800);
  const result = talentCheckSync(candidateId, company);
  const cand = getCandidate(candidateId);

  // Automatically record this run to persistent history
  addHistoryRecord({
    type: "talent_check",
    company,
    role: "Company-wide 12-category check",
    candidate: cand.profile.name,
    candidateId,
    score: result.readiness_score,
    status: "completed",
  });

  return result;
}

export async function runSkillMatching(
  candidateId: string,
  jobId: string,
): Promise<SkillMatchingResult> {
  await delay(800);
  const result = skillMatchSync(candidateId, jobId);
  const cand = getCandidate(candidateId);
  const job = getJob(jobId);

  // Automatically record this run to persistent history
  addHistoryRecord({
    type: "skill_matching",
    company: job.company,
    role: job.role,
    candidate: cand.profile.name,
    candidateId,
    jobId,
    score: result.match_score,
    status: "completed",
  });

  return result;
}

export function getHistory(): HistoryRecord[] {
  return loadHistory();
}
