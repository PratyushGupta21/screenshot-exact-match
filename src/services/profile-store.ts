// Local demo persistence for the candidate profile. Swap for a backend call later.
import type { CandidateProfile } from "@/lib/radix/types";
import { SAMPLE_CANDIDATES } from "@/mocks/data";

const KEY = "radix.profile.v1";

export const emptyProfile = (): CandidateProfile => ({
  name: "", email: "", education: "", skills: [], hackathons: [], internships: [],
  certifications: [], preferred_roles: [], cv_file: "",
});

export function loadProfile(): CandidateProfile {
  if (typeof window === "undefined") return SAMPLE_CANDIDATES[0]!.profile;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CandidateProfile) : SAMPLE_CANDIDATES[0]!.profile;
  } catch {
    return SAMPLE_CANDIDATES[0]!.profile;
  }
}

export function saveProfile(p: CandidateProfile) {
  window.localStorage.setItem(KEY, JSON.stringify(p));
}
