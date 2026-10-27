// Local demo persistence for the candidate profile with dynamic level derivation.
import { CAIRN_CATEGORIES } from "@/lib/radix/categories";
import type { LevelMap } from "@/lib/radix/scoring";
import type { CandidateProfile, CategoryCode, Skill } from "@/lib/radix/types";
import { SAMPLE_CANDIDATES, type DemoCandidate } from "@/mocks/data";

const KEY = "cairn.profile.v1";
const LEGACY_KEY = "radix.profile.v1";
const EVENT_NAME = "cairn:profile-updated";

export const emptyProfile = (): CandidateProfile => ({
  name: "",
  email: "",
  education: "",
  skills: [],
  hackathons: [],
  internships: [],
  certifications: [],
  preferred_roles: [],
  cv_file: "",
});

export function loadProfile(): CandidateProfile {
  if (typeof window === "undefined") return SAMPLE_CANDIDATES[0]!.profile;
  try {
    const raw = window.localStorage.getItem(KEY) || window.localStorage.getItem(LEGACY_KEY);
    if (!raw) return SAMPLE_CANDIDATES[0]!.profile;
    const parsed = JSON.parse(raw) as Partial<CandidateProfile>;
    return {
      name: parsed.name ?? SAMPLE_CANDIDATES[0]!.profile.name,
      email: parsed.email ?? SAMPLE_CANDIDATES[0]!.profile.email,
      education: parsed.education ?? SAMPLE_CANDIDATES[0]!.profile.education,
      skills: Array.isArray(parsed.skills) ? parsed.skills : SAMPLE_CANDIDATES[0]!.profile.skills,
      hackathons: Array.isArray(parsed.hackathons) ? parsed.hackathons : [],
      internships: Array.isArray(parsed.internships) ? parsed.internships : [],
      certifications: Array.isArray(parsed.certifications) ? parsed.certifications : [],
      preferred_roles: Array.isArray(parsed.preferred_roles) ? parsed.preferred_roles : [],
      cv_file: parsed.cv_file ?? "",
    };
  } catch {
    return SAMPLE_CANDIDATES[0]!.profile;
  }
}

export function saveProfile(p: CandidateProfile) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(p));
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: p }));
}

export function subscribeProfile(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener("storage", handler);
  };
}

/**
 * Deterministically derives 1-10 levels across all 12 CAIRN categories
 * from the candidate's skills, experience, and certifications.
 */
export function deriveCandidateLevels(p: CandidateProfile): LevelMap {
  const baseLevels: LevelMap = {
    COD: 2,
    DSA: 2,
    OOD: 2,
    APTI: 3,
    COMM: 4,
    AI: 1,
    CLOUD: 1,
    SQL: 2,
    SWE: 3,
    SYSD: 1,
    NETW: 2,
    OS: 2,
  };

  // Add points based on categorized skills and confidence
  p.skills.forEach((skill: Skill) => {
    const cat = skill.category_code;
    if (!(cat in baseLevels)) return;

    const weight = skill.confidence === "high" ? 2.5 : skill.confidence === "medium" ? 1.5 : 1.0;
    baseLevels[cat] += weight;
  });

  // Experiential bonuses
  if (p.internships.length > 0) {
    baseLevels.SWE += Math.min(2, p.internships.length * 1);
    baseLevels.COMM += 1;
    baseLevels.COD += 0.5;
  }
  if (p.hackathons.length > 0) {
    baseLevels.SWE += 1;
    baseLevels.COD += 1;
    baseLevels.APTI += 1;
  }
  if (p.certifications.length > 0) {
    const text = p.certifications.join(" ").toLowerCase();
    if (
      text.includes("cloud") ||
      text.includes("aws") ||
      text.includes("azure") ||
      text.includes("gcp")
    ) {
      baseLevels.CLOUD += 2;
    }
    if (text.includes("network") || text.includes("ccna")) {
      baseLevels.NETW += 2;
    }
    if (text.includes("ai") || text.includes("tensor") || text.includes("machine learning")) {
      baseLevels.AI += 2;
    }
  }

  // Education bonus for foundational computer science
  if (
    p.education.toLowerCase().includes("computer") ||
    p.education.toLowerCase().includes("technology")
  ) {
    baseLevels.DSA += 1;
    baseLevels.OOD += 1;
    baseLevels.OS += 1;
  }

  // Clamp every category between 1 and 10
  const result = {} as LevelMap;
  CAIRN_CATEGORIES.forEach(({ code }) => {
    result[code] = Math.max(1, Math.min(10, Math.round(baseLevels[code])));
  });

  return result;
}

export function getActiveCandidate(): DemoCandidate {
  const profile = loadProfile();
  return {
    id: "my-profile",
    profile,
    levels: deriveCandidateLevels(profile),
  };
}
