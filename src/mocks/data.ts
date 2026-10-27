// ILLUSTRATIVE SAMPLE DATA ONLY. Not real company expectations or real candidates.
import type { LevelMap } from "@/lib/radix/scoring";
import type {
  CandidateProfile, ExtractedSkillList, HistoryRecord, JobDescription, ParsedResume, Skill,
} from "@/lib/radix/types";

const sk = (
  skill_name: string, category_code: Skill["category_code"], confidence: Skill["confidence"], evidence: string,
): Skill => ({ skill_name, category_code, confidence, evidence });

export interface DemoCandidate {
  id: string;
  profile: CandidateProfile;
  levels: LevelMap;
}

export const SAMPLE_CANDIDATES: DemoCandidate[] = [
  {
    id: "aarav",
    profile: {
      name: "Aarav Sharma",
      email: "aarav.sharma@example.com",
      education: "B.Tech Computer Science, Example Institute of Technology (2026)",
      skills: [
        sk("Python", "COD", "high", "3 projects and internship work in Python"),
        sk("Java", "COD", "medium", "Coursework and one Android project"),
        sk("Data Structures", "DSA", "high", "300+ solved practice problems"),
        sk("SQL", "SQL", "high", "Built reporting queries during internship"),
        sk("Machine Learning", "AI", "medium", "Course project on text classification"),
        sk("Git", "SWE", "high", "Daily use across team projects"),
        sk("REST APIs", "SWE", "medium", "Built a Flask API for a hackathon"),
        sk("Linux", "OS", "medium", "Server setup for personal projects"),
      ],
      hackathons: ["Smart India Hackathon 2025 — Finalist", "HackRADIX 2026"],
      internships: ["Backend Intern, Sample Fintech Pvt Ltd (3 months)"],
      certifications: ["AWS Cloud Practitioner (sample)"],
      preferred_roles: ["Software Engineer", "Backend Developer"],
      cv_file: "aarav_sharma_cv.pdf",
    },
    levels: { COD: 8, DSA: 7, OOD: 6, APTI: 7, COMM: 6, AI: 5, CLOUD: 4, SQL: 7, SWE: 6, SYSD: 4, NETW: 4, OS: 5 },
  },
  {
    id: "meera",
    profile: {
      name: "Meera Iyer",
      email: "meera.iyer@example.com",
      education: "M.Sc Data Science, Sample University (2025)",
      skills: [
        sk("Python", "COD", "high", "Primary language across all projects"),
        sk("Machine Learning", "AI", "high", "Thesis on recommender systems"),
        sk("Deep Learning", "AI", "high", "PyTorch projects and paper replication"),
        sk("SQL", "SQL", "medium", "Analytics coursework"),
        sk("Statistics", "APTI", "high", "Core degree coursework"),
        sk("Docker", "CLOUD", "medium", "Containerised ML model serving"),
        sk("Communication", "COMM", "high", "Presented at two student conferences"),
      ],
      hackathons: ["Data for Good Hack 2024 — Winner"],
      internships: ["ML Research Intern, Sample AI Lab (6 months)"],
      certifications: ["TensorFlow Developer (sample)", "Google Cloud Digital Leader (sample)"],
      preferred_roles: ["ML Engineer", "Data Scientist"],
      cv_file: "meera_iyer_resume.docx",
    },
    levels: { COD: 7, DSA: 5, OOD: 5, APTI: 8, COMM: 8, AI: 9, CLOUD: 6, SQL: 6, SWE: 5, SYSD: 5, NETW: 3, OS: 4 },
  },
  {
    id: "rohan",
    profile: {
      name: "Rohan Verma",
      email: "rohan.verma@example.com",
      education: "B.E. Information Technology, Demo College of Engineering (2026)",
      skills: [
        sk("JavaScript", "COD", "high", "Full-stack web projects"),
        sk("React", "SWE", "high", "Two production-style apps"),
        sk("Node.js", "SWE", "medium", "Hackathon backend"),
        sk("Networking", "NETW", "medium", "CCNA coursework"),
        sk("SQL", "SQL", "low", "Basic CRUD queries"),
      ],
      hackathons: [],
      internships: [],
      certifications: ["CCNA (in progress, sample)"],
      preferred_roles: ["Frontend Developer"],
      cv_file: "",
    },
    levels: { COD: 6, DSA: 4, OOD: 4, APTI: 6, COMM: 7, AI: 2, CLOUD: 3, SQL: 4, SWE: 6, SYSD: 3, NETW: 6, OS: 4 },
  },
];

/** SAMPLE required levels — placeholders until the real company skillset JSON is connected. */
export const SAMPLE_COMPANY_REQUIREMENTS: Record<string, LevelMap> = {
  "Google LLC": { COD: 9, DSA: 9, OOD: 7, APTI: 7, COMM: 7, AI: 6, CLOUD: 6, SQL: 6, SWE: 8, SYSD: 7, NETW: 5, OS: 6 },
  "Microsoft Corporation": { COD: 8, DSA: 8, OOD: 8, APTI: 6, COMM: 7, AI: 6, CLOUD: 7, SQL: 6, SWE: 8, SYSD: 6, NETW: 5, OS: 6 },
  "Oracle Financial Services Software": { COD: 7, DSA: 6, OOD: 7, APTI: 8, COMM: 7, AI: 4, CLOUD: 5, SQL: 8, SWE: 7, SYSD: 5, NETW: 4, OS: 5 },
};

export const SAMPLE_JOBS: JobDescription[] = [
  {
    id: "g-swe",
    company: "Google LLC",
    role: "Software Engineer, New Grad (sample JD)",
    source_file: "google_swe_newgrad_sample.pdf",
    required_skills: ["Python", "Java", "Data Structures", "System Design", "Git", "Linux", "REST APIs", "Distributed Systems"],
  },
  {
    id: "ms-ml",
    company: "Microsoft Corporation",
    role: "ML Engineer I (sample JD)",
    source_file: "microsoft_ml_engineer_sample.docx",
    required_skills: ["Python", "Machine Learning", "Deep Learning", "SQL", "Docker", "Azure", "Communication"],
  },
  {
    id: "ofss-dev",
    company: "Oracle Financial Services Software",
    role: "Associate Application Developer (sample JD)",
    source_file: "ofss_associate_dev_sample.pdf",
    required_skills: ["Java", "SQL", "PL/SQL", "Object-Oriented Design", "REST APIs", "Git"],
  },
];

export const SAMPLE_JD_EXTRACTION: ExtractedSkillList = {
  source_type: "jd",
  source_file: "google_swe_newgrad_sample.pdf",
  company: "Google LLC",
  role: "Software Engineer, New Grad",
  skills: [
    sk("Python", "COD", "high", "“Proficiency in one or more of Python, Java, C++”"),
    sk("Java", "COD", "high", "Listed in minimum qualifications"),
    sk("Data Structures", "DSA", "high", "“Strong foundation in data structures and algorithms”"),
    sk("Algorithms", "DSA", "high", "Mentioned alongside data structures"),
    sk("Object-Oriented Design", "OOD", "medium", "Implied by “design maintainable software components”"),
    sk("System Design", "SYSD", "medium", "“Design large-scale systems” in preferred qualifications"),
    sk("Distributed Systems", "SYSD", "low", "Mentioned once in team description"),
    sk("Git", "SWE", "medium", "“Experience with version control”"),
    sk("Code Review", "SWE", "medium", "“Participate in code reviews”"),
    sk("Linux", "OS", "low", "Development environment note"),
    sk("Communication", "COMM", "medium", "“Collaborate across teams”"),
  ],
};

export const SAMPLE_PARSED_RESUME: ParsedResume = {
  personal: { name: "Aarav Sharma", email: "aarav.sharma@example.com", location: "Pune, India" },
  education: ["B.Tech Computer Science, Example Institute of Technology — CGPA 8.6 (2022–2026)"],
  projects: [
    "Campus Ride — carpool matching app (Flask, PostgreSQL)",
    "SentimentLens — text classification with scikit-learn",
  ],
  experience: ["Teaching Assistant, Data Structures lab (1 semester)"],
  internships: ["Backend Intern, Sample Fintech Pvt Ltd — built reporting APIs (3 months)"],
  certifications: ["AWS Cloud Practitioner (sample)"],
  extracted: {
    source_type: "resume",
    source_file: "aarav_sharma_cv.pdf",
    company: "",
    role: "",
    skills: SAMPLE_CANDIDATES[0]!.profile.skills,
  },
};

export const SAMPLE_HISTORY_BASE: Omit<HistoryRecord, "score">[] = [
  { id: "h1", type: "talent_check", company: "Google LLC", role: "Company-level check", candidate: "aarav", date: "2026-10-24", status: "completed" },
  { id: "h2", type: "skill_matching", company: "Google LLC", role: "g-swe", candidate: "aarav", date: "2026-10-24", status: "completed" },
  { id: "h3", type: "talent_check", company: "Microsoft Corporation", role: "Company-level check", candidate: "meera", date: "2026-10-21", status: "completed" },
  { id: "h4", type: "skill_matching", company: "Microsoft Corporation", role: "ms-ml", candidate: "meera", date: "2026-10-20", status: "completed" },
  { id: "h5", type: "talent_check", company: "Oracle Financial Services Software", role: "Company-level check", candidate: "rohan", date: "2026-10-18", status: "completed" },
  { id: "h6", type: "skill_matching", company: "Oracle Financial Services Software", role: "ofss-dev", candidate: "rohan", date: "2026-10-15", status: "failed" },
];
