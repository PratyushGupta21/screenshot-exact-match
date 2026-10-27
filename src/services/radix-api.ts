// Integration layer. Every function currently resolves mock data after a short delay.
// To connect the backend, replace each body with a fetch to your REST endpoint —
// the UI only depends on these signatures and the shared types.
import { computeSkillMatch, computeTalentCheck } from "@/lib/radix/scoring";
import type {
  ExtractedSkillList, HistoryRecord, ParsedResume, SkillMatchingResult, TalentCheckResult,
} from "@/lib/radix/types";
import {
  SAMPLE_CANDIDATES, SAMPLE_COMPANY_REQUIREMENTS, SAMPLE_HISTORY_BASE, SAMPLE_JD_EXTRACTION,
  SAMPLE_JOBS, SAMPLE_PARSED_RESUME,
} from "@/mocks/data";

const delay = (ms = 1200) => new Promise((r) => setTimeout(r, ms));

export const getCandidates = () => SAMPLE_CANDIDATES;
export const getJobs = () => SAMPLE_JOBS;
export const getCandidate = (id: string) => SAMPLE_CANDIDATES.find((c) => c.id === id)!;
export const getJob = (id: string) => SAMPLE_JOBS.find((j) => j.id === id)!;

export async function analyzeJobDescription(
  file: File, meta: { company: string; role: string },
): Promise<ExtractedSkillList> {
  await delay();
  return {
    ...SAMPLE_JD_EXTRACTION,
    source_file: file.name,
    company: meta.company || SAMPLE_JD_EXTRACTION.company,
    role: meta.role || SAMPLE_JD_EXTRACTION.role,
  };
}

export async function parseResume(file: File): Promise<ParsedResume> {
  await delay();
  return { ...SAMPLE_PARSED_RESUME, extracted: { ...SAMPLE_PARSED_RESUME.extracted, source_file: file.name } };
}

/** Synchronous demo calculation (used by history + dashboard to stay consistent). */
export function talentCheckSync(candidateId: string, company: string): TalentCheckResult {
  return computeTalentCheck(company, SAMPLE_COMPANY_REQUIREMENTS[company]!, getCandidate(candidateId).levels);
}

export function skillMatchSync(candidateId: string, jobId: string): SkillMatchingResult {
  const job = getJob(jobId);
  return computeSkillMatch(
    job.source_file, job.required_skills, getCandidate(candidateId).profile.skills.map((s) => s.skill_name),
  );
}

export async function runTalentCheck(candidateId: string, company: string) {
  await delay(900);
  return talentCheckSync(candidateId, company);
}

export async function runSkillMatching(candidateId: string, jobId: string) {
  await delay(900);
  return skillMatchSync(candidateId, jobId);
}

export function getHistory(): HistoryRecord[] {
  return SAMPLE_HISTORY_BASE.map((h) => {
    if (h.status !== "completed") return { ...h, score: null, role: h.type === "skill_matching" ? getJob(h.role).role : h.role };
    if (h.type === "talent_check") return { ...h, score: talentCheckSync(h.candidate, h.company).readiness_score };
    return { ...h, role: getJob(h.role).role, score: skillMatchSync(h.candidate, h.role).match_score };
  });
}
