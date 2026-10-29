// Git Provenance & Public Code Evidence Service
// Explanatory breakdown: 40% Claim Support, 30% Repo Strength, 20% Activity Consistency, 10% Engineering Hygiene
// Illustrative demonstration profiles — does not claim live unauthorized API scraping.

export interface RepoEvidenceItem {
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  commits: number;
  hasReadme: boolean;
  hasTests: boolean;
  hasCi: boolean;
  hasLicense: boolean;
  licenseName?: string;
  matchedClaim?: string;
  evidenceStatus: "Evidence found" | "Not found in sample" | "Unable to verify";
  updatedAt: string;
}

export interface CommitHistoryPoint {
  month: string;
  commits: number;
  pullRequests: number;
}

export interface ClaimVerification {
  claim: string;
  category: string;
  status: "Evidence found" | "Not found in sample" | "Unable to verify";
  backingRepo?: string;
  evidenceNotes: string;
}

export interface ProvenanceReport {
  username: string;
  avatarUrl: string;
  fullName: string;
  bio: string;
  publicReposCount: number;
  totalStars: number;
  followers: number;
  accountAgeYears: number;
  overallScore: number; // 0-100
  scoreBreakdown: {
    claimSupport: { score: number; weight: number; contribution: number }; // 40%
    repoStrength: { score: number; weight: number; contribution: number }; // 30%
    activityConsistency: { score: number; weight: number; contribution: number }; // 20%
    engineeringHygiene: { score: number; weight: number; contribution: number }; // 10%
  };
  languages: { name: string; percentage: number; bytes: number }[];
  repositories: RepoEvidenceItem[];
  commitTimeline: CommitHistoryPoint[];
  claims: ClaimVerification[];
  hygieneSummary: {
    readmeCoverage: number;
    testSuiteCoverage: number;
    ciAutomationCoverage: number;
    openSourceLicenses: number;
  };
  suggestedImprovements: string[];
}

export const SAMPLE_PROVENANCE_PROFILES: Record<string, ProvenanceReport> = {
  "aarav-sharma": {
    username: "aarav-sharma",
    avatarUrl: "https://api.dicebear.com/7.x/identicon/svg?seed=aarav",
    fullName: "Aarav Sharma",
    bio: "CS student & backend engineering enthusiast. Python, Go, and distributed storage.",
    publicReposCount: 14,
    totalStars: 48,
    followers: 32,
    accountAgeYears: 3.2,
    overallScore: 82,
    scoreBreakdown: {
      claimSupport: { score: 85, weight: 0.4, contribution: 34.0 },
      repoStrength: { score: 78, weight: 0.3, contribution: 23.4 },
      activityConsistency: { score: 82, weight: 0.2, contribution: 16.4 },
      engineeringHygiene: { score: 85, weight: 0.1, contribution: 8.5 },
    },
    languages: [
      { name: "Python", percentage: 54, bytes: 482000 },
      { name: "Go", percentage: 22, bytes: 196000 },
      { name: "TypeScript", percentage: 14, bytes: 125000 },
      { name: "SQL", percentage: 10, bytes: 89000 },
    ],
    repositories: [
      {
        name: "cairn-distributed-kv",
        description: "LSM-tree backed key-value store with Write-Ahead Logging (WAL) in Go.",
        language: "Go",
        stars: 26,
        forks: 5,
        commits: 114,
        hasReadme: true,
        hasTests: true,
        hasCi: true,
        hasLicense: true,
        licenseName: "MIT",
        matchedClaim: "Distributed systems & Go coursework project",
        evidenceStatus: "Evidence found",
        updatedAt: "2 weeks ago",
      },
      {
        name: "fintech-pipeline-sim",
        description: "Event-driven asynchronous transaction processor using Redis and Celery.",
        language: "Python",
        stars: 14,
        forks: 3,
        commits: 78,
        hasReadme: true,
        hasTests: true,
        hasCi: true,
        hasLicense: true,
        licenseName: "Apache-2.0",
        matchedClaim: "Backend Intern — Sample Fintech Pvt Ltd",
        evidenceStatus: "Evidence found",
        updatedAt: "1 month ago",
      },
      {
        name: "ml-sentiment-classifier",
        description: "Coursework project analyzing technical review sentiments with Scikit-Learn.",
        language: "Python",
        stars: 6,
        forks: 1,
        commits: 42,
        hasReadme: true,
        hasTests: false,
        hasCi: false,
        hasLicense: true,
        licenseName: "MIT",
        matchedClaim: "Machine Learning text classification",
        evidenceStatus: "Evidence found",
        updatedAt: "4 months ago",
      },
      {
        name: "leetcode-patterns-py",
        description: "Systematic solutions for 250+ algorithm problems organized by topic.",
        language: "Python",
        stars: 2,
        forks: 0,
        commits: 186,
        hasReadme: true,
        hasTests: true,
        hasCi: false,
        hasLicense: false,
        matchedClaim: "300+ solved practice problems",
        evidenceStatus: "Evidence found",
        updatedAt: "3 days ago",
      },
    ],
    commitTimeline: [
      { month: "Nov 25", commits: 24, pullRequests: 4 },
      { month: "Dec 25", commits: 38, pullRequests: 6 },
      { month: "Jan 26", commits: 45, pullRequests: 8 },
      { month: "Feb 26", commits: 52, pullRequests: 11 },
      { month: "Mar 26", commits: 64, pullRequests: 14 },
      { month: "Apr 26", commits: 42, pullRequests: 9 },
      { month: "May 26", commits: 58, pullRequests: 12 },
      { month: "Jun 26", commits: 71, pullRequests: 15 },
      { month: "Jul 26", commits: 60, pullRequests: 10 },
      { month: "Aug 26", commits: 48, pullRequests: 7 },
      { month: "Sep 26", commits: 62, pullRequests: 13 },
      { month: "Oct 26", commits: 55, pullRequests: 12 },
    ],
    claims: [
      {
        claim: "Python backend development with REST API architecture",
        category: "SWE / COD",
        status: "Evidence found",
        backingRepo: "fintech-pipeline-sim",
        evidenceNotes: "Consistent commit history, modular package layout, unit tests present.",
      },
      {
        claim: "Distributed Systems & Go storage engine",
        category: "SYSD / COD",
        status: "Evidence found",
        backingRepo: "cairn-distributed-kv",
        evidenceNotes: "Implements LSM-tree compaction, WAL recovery tests, GitHub Actions CI green.",
      },
      {
        claim: "AWS Cloud Infrastructure Practitioner",
        category: "CLOUD",
        status: "Unable to verify",
        evidenceNotes: "No Terraform, CloudFormation, or AWS CDK deployment scripts found in public repos.",
      },
      {
        claim: "Docker containerization",
        category: "CLOUD",
        status: "Evidence found",
        backingRepo: "fintech-pipeline-sim",
        evidenceNotes: "Dockerfile and docker-compose.yml verified with multi-stage builds.",
      },
    ],
    hygieneSummary: {
      readmeCoverage: 100,
      testSuiteCoverage: 75,
      ciAutomationCoverage: 50,
      openSourceLicenses: 75,
    },
    suggestedImprovements: [
      "Add GitHub Actions CI workflows to ml-sentiment-classifier to verify test passes automatically.",
      "Add an open source license (e.g. MIT) to leetcode-patterns-py to document explicit reuse permissions.",
      "Include a public repository demonstrating AWS infrastructure provisioning or Serverless templates.",
    ],
  },
  "meera-iyer": {
    username: "meera-iyer",
    avatarUrl: "https://api.dicebear.com/7.x/identicon/svg?seed=meera",
    fullName: "Meera Iyer",
    bio: "M.Sc Data Science. Recommender systems, PyTorch, statistical modeling.",
    publicReposCount: 18,
    totalStars: 86,
    followers: 64,
    accountAgeYears: 4.1,
    overallScore: 89,
    scoreBreakdown: {
      claimSupport: { score: 92, weight: 0.4, contribution: 36.8 },
      repoStrength: { score: 88, weight: 0.3, contribution: 26.4 },
      activityConsistency: { score: 85, weight: 0.2, contribution: 17.0 },
      engineeringHygiene: { score: 90, weight: 0.1, contribution: 9.0 },
    },
    languages: [
      { name: "Python", percentage: 76, bytes: 720000 },
      { name: "Jupyter Notebook", percentage: 16, bytes: 152000 },
      { name: "R", percentage: 8, bytes: 76000 },
    ],
    repositories: [
      {
        name: "neural-rec-benchmark",
        description: "Benchmarking collaborative filtering vs graph neural networks on MovieLens-25M.",
        language: "Python",
        stars: 48,
        forks: 12,
        commits: 142,
        hasReadme: true,
        hasTests: true,
        hasCi: true,
        hasLicense: true,
        licenseName: "MIT",
        matchedClaim: "Thesis on recommender systems",
        evidenceStatus: "Evidence found",
        updatedAt: "1 week ago",
      },
      {
        name: "pytorch-model-serve",
        description: "High-throughput model serving microservice using TorchScript and FastAPI.",
        language: "Python",
        stars: 24,
        forks: 6,
        commits: 88,
        hasReadme: true,
        hasTests: true,
        hasCi: true,
        hasLicense: true,
        licenseName: "Apache-2.0",
        matchedClaim: "Containerised ML model serving with Docker",
        evidenceStatus: "Evidence found",
        updatedAt: "3 weeks ago",
      },
    ],
    commitTimeline: [
      { month: "Nov 25", commits: 32, pullRequests: 5 },
      { month: "Dec 25", commits: 42, pullRequests: 8 },
      { month: "Jan 26", commits: 60, pullRequests: 12 },
      { month: "Feb 26", commits: 68, pullRequests: 14 },
      { month: "Mar 26", commits: 75, pullRequests: 18 },
      { month: "Apr 26", commits: 55, pullRequests: 10 },
      { month: "May 26", commits: 80, pullRequests: 16 },
      { month: "Jun 26", commits: 92, pullRequests: 21 },
      { month: "Jul 26", commits: 84, pullRequests: 18 },
      { month: "Aug 26", commits: 62, pullRequests: 11 },
      { month: "Sep 26", commits: 78, pullRequests: 14 },
      { month: "Oct 26", commits: 70, pullRequests: 15 },
    ],
    claims: [
      {
        claim: "Deep Learning with PyTorch research papers replication",
        category: "AI",
        status: "Evidence found",
        backingRepo: "neural-rec-benchmark",
        evidenceNotes: "Rigorous test harness, benchmark graphs, reproducibility seed logs.",
      },
    ],
    hygieneSummary: {
      readmeCoverage: 100,
      testSuiteCoverage: 100,
      ciAutomationCoverage: 100,
      openSourceLicenses: 100,
    },
    suggestedImprovements: [
      "Add benchmark reproduction scripts directly in root Makefile for 1-command evaluation.",
    ],
  },
};

export function lookupProvenance(input: string): ProvenanceReport {
  const clean = input.trim().toLowerCase().replace(/^https?:\/\/github\.com\//, "").replace(/\/$/, "");
  if (clean.includes("meera")) return SAMPLE_PROVENANCE_PROFILES["meera-iyer"]!;
  if (clean.includes("aarav") || clean === "") return SAMPLE_PROVENANCE_PROFILES["aarav-sharma"]!;

  // Deterministic mock generation for any other entered handle
  const hash = clean.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const claimScore = 65 + (hash % 30);
  const repoScore = 60 + ((hash * 3) % 35);
  const actScore = 70 + ((hash * 7) % 25);
  const hygScore = 75 + ((hash * 5) % 20);
  const overall = Math.round(claimScore * 0.4 + repoScore * 0.3 + actScore * 0.2 + hygScore * 0.1);

  return {
    username: clean,
    avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${clean}`,
    fullName: clean.charAt(0).toUpperCase() + clean.slice(1),
    bio: `Public developer profile for ${clean} · Illustrative demonstration snapshot.`,
    publicReposCount: 8 + (hash % 15),
    totalStars: 10 + (hash % 60),
    followers: 5 + (hash % 40),
    accountAgeYears: 2 + Number(((hash % 40) / 10).toFixed(1)),
    overallScore: overall,
    scoreBreakdown: {
      claimSupport: { score: claimScore, weight: 0.4, contribution: Number((claimScore * 0.4).toFixed(1)) },
      repoStrength: { score: repoScore, weight: 0.3, contribution: Number((repoScore * 0.3).toFixed(1)) },
      activityConsistency: { score: actScore, weight: 0.2, contribution: Number((actScore * 0.2).toFixed(1)) },
      engineeringHygiene: { score: hygScore, weight: 0.1, contribution: Number((hygScore * 0.1).toFixed(1)) },
    },
    languages: [
      { name: "TypeScript", percentage: 55, bytes: 340000 },
      { name: "Python", percentage: 30, bytes: 185000 },
      { name: "Shell", percentage: 15, bytes: 92000 },
    ],
    repositories: [
      {
        name: `${clean}-core-service`,
        description: "Primary engineering repository showcasing architecture patterns and test coverage.",
        language: "TypeScript",
        stars: 12 + (hash % 20),
        forks: 3,
        commits: 84 + (hash % 50),
        hasReadme: true,
        hasTests: true,
        hasCi: (hash % 2 === 0),
        hasLicense: true,
        licenseName: "MIT",
        matchedClaim: "Full-stack application development",
        evidenceStatus: "Evidence found",
        updatedAt: "2 weeks ago",
      },
    ],
    commitTimeline: [
      { month: "Jun 26", commits: 20 + (hash % 15), pullRequests: 4 },
      { month: "Jul 26", commits: 35 + (hash % 20), pullRequests: 8 },
      { month: "Aug 26", commits: 42 + (hash % 25), pullRequests: 10 },
      { month: "Sep 26", commits: 50 + (hash % 30), pullRequests: 12 },
      { month: "Oct 26", commits: 45 + (hash % 25), pullRequests: 9 },
    ],
    claims: [
      {
        claim: "Modern web & backend development",
        category: "SWE",
        status: "Evidence found",
        backingRepo: `${clean}-core-service`,
        evidenceNotes: "Commit cadence shows active branch workflow with modular code structure.",
      },
      {
        claim: "Cloud deployment verification",
        category: "CLOUD",
        status: "Unable to verify",
        evidenceNotes: "No direct infrastructure as code or deployment pipelines observed in sample snapshot.",
      },
    ],
    hygieneSummary: {
      readmeCoverage: 85,
      testSuiteCoverage: 70,
      ciAutomationCoverage: 60,
      openSourceLicenses: 80,
    },
    suggestedImprovements: [
      "Ensure all public repositories include informative README documentation.",
      "Add continuous integration test verification badges to pin proof of code health.",
    ],
  };
}

