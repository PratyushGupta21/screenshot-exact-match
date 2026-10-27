// Shared CAIRN data contracts. Keep in sync with the Python modules' JSON output.

export type Confidence = "high" | "medium" | "low";

export type CategoryCode =
  "COD" | "DSA" | "OOD" | "APTI" | "COMM" | "AI" | "CLOUD" | "SQL" | "SWE" | "SYSD" | "NETW" | "OS";

export interface Skill {
  skill_name: string;
  category_code: CategoryCode;
  evidence: string;
  confidence: Confidence;
}

export interface ExtractedSkillList {
  source_type: "jd" | "resume";
  source_file: string;
  company: string;
  role: string;
  skills: Skill[];
}

export interface CandidateProfile {
  name: string;
  email: string;
  education: string;
  skills: Skill[];
  hackathons: string[];
  internships: string[];
  certifications: string[];
  preferred_roles: string[];
  cv_file: string;
}

export interface SkillGap {
  category_code: CategoryCode;
  required_level: number;
  candidate_level: number;
  gap: boolean;
}

export interface TalentCheckResult {
  company: string;
  skillset_gap: SkillGap[];
  readiness_score: number;
}

export interface SkillMatchingResult {
  jd_source_file: string;
  match_score: number;
  matched_skills: string[];
  missing_skills: string[];
}

/** Frontend-only extras used by the demo (not part of the backend contract). */
export interface ParsedResume {
  extracted: ExtractedSkillList;
  personal: { name: string; email: string; location: string };
  education: string[];
  projects: string[];
  experience: string[];
  internships: string[];
  certifications: string[];
}

export interface JobDescription {
  id: string;
  company: string;
  role: string;
  source_file: string;
  required_skills: string[];
}

export interface HistoryRecord {
  id: string;
  type: "talent_check" | "skill_matching";
  company: string;
  role: string;
  candidate: string;
  candidateId?: string | undefined;
  jobId?: string | undefined;
  date: string;
  score: number | null;
  status: "completed" | "failed" | "processing";
}
