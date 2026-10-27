// Demo scoring logic. Replace with backend results once the Python modules are wired up.
import { RADIX_CATEGORIES } from "./categories";
import type {
  CategoryCode, SkillGap, SkillMatchingResult, TalentCheckResult,
} from "./types";

export type LevelMap = Record<CategoryCode, number>;

/**
 * Readiness = average of per-category coverage, where coverage = min(candidate / required, 1).
 * A category with no gap contributes 100%.
 */
export function computeTalentCheck(
  company: string, required: LevelMap, candidate: LevelMap,
): TalentCheckResult {
  const skillset_gap: SkillGap[] = RADIX_CATEGORIES.map(({ code }) => ({
    category_code: code,
    required_level: required[code],
    candidate_level: candidate[code],
    gap: candidate[code] < required[code],
  }));
  const coverage =
    skillset_gap.reduce(
      (sum, g) => sum + Math.min(g.candidate_level / Math.max(g.required_level, 1), 1),
      0,
    ) / skillset_gap.length;
  return { company, skillset_gap, readiness_score: Math.round(coverage * 100) };
}

/** Gaps sorted by size, largest first. */
export function priorityGaps(result: TalentCheckResult, limit = 3) {
  return result.skillset_gap
    .filter((g) => g.gap)
    .sort((a, b) => b.required_level - b.candidate_level - (a.required_level - a.candidate_level))
    .slice(0, limit);
}

const norm = (s: string) => s.trim().toLowerCase();

/** Match score = matched required skills / total required skills. */
export function computeSkillMatch(
  jdSourceFile: string, requiredSkills: string[], candidateSkills: string[],
): SkillMatchingResult {
  const have = new Set(candidateSkills.map(norm));
  const matched_skills = requiredSkills.filter((s) => have.has(norm(s)));
  const missing_skills = requiredSkills.filter((s) => !have.has(norm(s)));
  const match_score = requiredSkills.length
    ? Math.round((matched_skills.length / requiredSkills.length) * 100)
    : 0;
  return { jd_source_file: jdSourceFile, match_score, matched_skills, missing_skills };
}

export function profileCompletion(p: {
  name: string; email: string; education: string; skills: unknown[];
  hackathons: string[]; internships: string[]; certifications: string[];
  preferred_roles: string[]; cv_file: string;
}) {
  const checks = [
    !!p.name, !!p.email, !!p.education, p.skills.length > 0, p.hackathons.length > 0,
    p.internships.length > 0, p.certifications.length > 0, p.preferred_roles.length > 0, !!p.cv_file,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export const scoreTone = (score: number) =>
  score >= 80 ? "success" : score >= 60 ? "warning" : "destructive";
