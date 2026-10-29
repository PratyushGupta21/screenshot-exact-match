// Benchmark Calibration & Next-Best Skills Service
// Compares candidate illustrative levels against multi-tier hiring bars across all 12 CAIRN categories.
// Sample benchmark model — not official company criteria.

import { CAIRN_CATEGORIES, categoryName } from "@/lib/radix/categories";
import type { CategoryCode } from "@/lib/radix/types";

export interface BenchmarkCompany {
  id: string;
  name: string;
  tier: "Tier-1 Tech" | "Scale-Up / Fintech" | "Cloud / Infrastructure" | "High-Growth Startup";
  description: string;
  baselineReadiness: number;
}

export interface BenchmarkRole {
  id: string;
  title: string;
  experienceLevel: "Entry" | "Mid-Level" | "Senior" | "Staff";
  requiredLevels: Record<CategoryCode, number>; // 1-10 scale
}

export interface SkillGapItem {
  code: CategoryCode;
  name: string;
  candidateLevel: number;
  requiredLevel: number;
  gap: number; // positive if candidate is below required
  isMet: boolean;
  priority: "Critical" | "High" | "Medium" | "Met";
  suggestedAction: string;
  whyItMatters: string;
  roadmapWeek: number;
}

export interface NextBestSkillRecommendation {
  code: CategoryCode;
  name: string;
  priority: "Critical" | "High" | "Medium";
  gap: number;
  expectedReadinessGain: string;
  rationale: string;
  roadmapWeek: number;
  roadmapTaskId: string;
  actionTitle: string;
}

export const BENCHMARK_COMPANIES: BenchmarkCompany[] = [
  {
    id: "google-tier1",
    name: "Google LLC",
    tier: "Tier-1 Tech",
    description: "Algorithmic rigor, clean coding practices, large-scale distributed systems, and collaborative engineering.",
    baselineReadiness: 82,
  },
  {
    id: "stripe-fintech",
    name: "Stripe",
    tier: "Scale-Up / Fintech",
    description: "High API polish, rigorous transaction safety, zero-downtime migrations, and defensive engineering.",
    baselineReadiness: 85,
  },
  {
    id: "amazon-scale",
    name: "Amazon Web Services",
    tier: "Cloud / Infrastructure",
    description: "Customer obsession, high-throughput cloud scale, operational excellence, and distributed state machines.",
    baselineReadiness: 78,
  },
  {
    id: "datadog-systems",
    name: "Datadog",
    tier: "Cloud / Infrastructure",
    description: "Kernel tracing, high-cardinality telemetry ingestion, eBPF, and real-time observability pipelines.",
    baselineReadiness: 80,
  },
  {
    id: "seed-startup",
    name: "Series-B AI Startup",
    tier: "High-Growth Startup",
    description: "Rapid velocity, full-stack pragmatism, LLM application architecture, and autonomous ownership.",
    baselineReadiness: 74,
  },
];

export const BENCHMARK_ROLES: BenchmarkRole[] = [
  {
    id: "backend-mid",
    title: "Backend Engineer",
    experienceLevel: "Mid-Level",
    requiredLevels: {
      COD: 8,
      DSA: 7,
      OOD: 7,
      APTI: 7,
      COMM: 7,
      AI: 4,
      CLOUD: 6,
      SQL: 8,
      SWE: 8,
      SYSD: 7,
      NETW: 6,
      OS: 6,
    },
  },
  {
    id: "backend-senior",
    title: "Senior Backend Engineer",
    experienceLevel: "Senior",
    requiredLevels: {
      COD: 9,
      DSA: 8,
      OOD: 8,
      APTI: 8,
      COMM: 8,
      AI: 5,
      CLOUD: 8,
      SQL: 9,
      SWE: 9,
      SYSD: 9,
      NETW: 7,
      OS: 8,
    },
  },
  {
    id: "ml-engineer",
    title: "Machine Learning Engineer",
    experienceLevel: "Senior",
    requiredLevels: {
      COD: 8,
      DSA: 7,
      OOD: 6,
      APTI: 9,
      COMM: 8,
      AI: 9,
      CLOUD: 7,
      SQL: 7,
      SWE: 8,
      SYSD: 7,
      NETW: 5,
      OS: 6,
    },
  },
  {
    id: "systems-engineer",
    title: "Distributed Systems Engineer",
    experienceLevel: "Senior",
    requiredLevels: {
      COD: 9,
      DSA: 8,
      OOD: 7,
      APTI: 8,
      COMM: 7,
      AI: 4,
      CLOUD: 8,
      SQL: 7,
      SWE: 9,
      SYSD: 10,
      NETW: 9,
      OS: 9,
    },
  },
  {
    id: "fullstack-mid",
    title: "Full Stack Software Engineer",
    experienceLevel: "Mid-Level",
    requiredLevels: {
      COD: 8,
      DSA: 6,
      OOD: 7,
      APTI: 7,
      COMM: 8,
      AI: 5,
      CLOUD: 6,
      SQL: 7,
      SWE: 8,
      SYSD: 6,
      NETW: 6,
      OS: 5,
    },
  },
];

const SKILL_ACTIONS: Record<CategoryCode, { action: string; why: string; week: number; taskId: string }> = {
  COD: {
    action: "Refactor async concurrency code and practice live coding with unit tests.",
    why: "Writing robust, error-handled production code without syntax stumbles is essential in technical screens.",
    week: 3,
    taskId: "w3-t2",
  },
  DSA: {
    action: "Master sliding window, graph traversals, and dynamic programming memoization.",
    why: "Tier-1 companies use DSA screens to test asymptotic efficiency reasoning under time limits.",
    week: 2,
    taskId: "w2-t1",
  },
  OOD: {
    action: "Practice Low-Level Design (LLD) with SOLID principles and design patterns.",
    why: "Evaluators examine modular separation of concerns and extensibility in real interview prompts.",
    week: 3,
    taskId: "w3-t1",
  },
  APTI: {
    action: "Practice back-of-the-envelope estimations for storage, throughput, and memory.",
    why: "Crucial for sizing distributed caches, database clusters, and networking budgets in architecture rounds.",
    week: 10,
    taskId: "w10-t1",
  },
  COMM: {
    action: "Record structured STAR technical explanations defending trade-offs.",
    why: "Senior engineers must clearly articulate why a design was chosen over viable alternatives.",
    week: 11,
    taskId: "w11-t2",
  },
  AI: {
    action: "Implement a semantic search pipeline using vector embeddings and pgvector.",
    why: "Modern engineering teams prioritize engineers who can integrate practical AI services safely.",
    week: 9,
    taskId: "w9-t1",
  },
  CLOUD: {
    action: "Deploy containerized services to a local Kubernetes cluster with rolling health probes.",
    why: "Ensures practical competency in CI/CD deployment and modern container lifecycle management.",
    week: 8,
    taskId: "w8-t1",
  },
  SQL: {
    action: "Optimize query execution plans and benchmark transaction isolation levels.",
    why: "Prevents high-latency table scans and race conditions in concurrent transactional pipelines.",
    week: 4,
    taskId: "w4-t1",
  },
  SWE: {
    action: "Implement CI/CD test automation and structured package architectures.",
    why: "Signals mature engineering hygiene and adherence to production code standards.",
    week: 1,
    taskId: "w1-t2",
  },
  SYSD: {
    action: "Design a fault-tolerant distributed cache with consistent hashing and write-ahead logs.",
    why: "Central requirement for senior technical interviews evaluating scale, failure modes, and consistency.",
    week: 7,
    taskId: "w7-t1",
  },
  NETW: {
    action: "Analyze packet traces examining TCP handshakes, window sizing, and HTTP/3 multiplexing.",
    why: "Fundamental for debugging latency anomalies, connection leaks, and API gateways at scale.",
    week: 6,
    taskId: "w6-t1",
  },
  OS: {
    action: "Trace memory maps and system call overhead using strace and perf on Linux.",
    why: "Demanded for performance tuning, resource contention diagnosis, and low-latency systems.",
    week: 5,
    taskId: "w5-t1",
  },
};

export function calibrateCandidateSkills(
  candidateLevels: Record<CategoryCode, number>,
  requiredLevels: Record<CategoryCode, number>,
): {
  gaps: SkillGapItem[];
  nextBestSkills: NextBestSkillRecommendation[];
  overallAlignmentPercentage: number;
} {
  const gaps: SkillGapItem[] = CAIRN_CATEGORIES.map(({ code }) => {
    const candidateLevel = candidateLevels[code] ?? 5;
    const requiredLevel = requiredLevels[code] ?? 7;
    const diff = requiredLevel - candidateLevel;
    const isMet = diff <= 0;
    const gap = isMet ? 0 : diff;

    let priority: SkillGapItem["priority"] = "Met";
    if (diff >= 3) priority = "Critical";
    else if (diff === 2) priority = "High";
    else if (diff === 1) priority = "Medium";

    const meta = SKILL_ACTIONS[code];

    return {
      code,
      name: categoryName(code),
      candidateLevel,
      requiredLevel,
      gap,
      isMet,
      priority,
      suggestedAction: meta.action,
      whyItMatters: meta.why,
      roadmapWeek: meta.week,
    };
  });

  // Calculate top 5 next-best skills by gap size and priority
  const prioritizedGaps = gaps
    .filter((g) => !g.isMet)
    .sort((a, b) => b.gap - a.gap || a.name.localeCompare(b.name))
    .slice(0, 5);

  const nextBestSkills: NextBestSkillRecommendation[] = prioritizedGaps.map((g) => ({
    code: g.code,
    name: g.name,
    priority: g.priority === "Met" ? "Medium" : g.priority,
    gap: g.gap,
    expectedReadinessGain: `+${Math.min(12, g.gap * 3.5).toFixed(0)}% readiness alignment`,
    rationale: g.whyItMatters,
    roadmapWeek: g.roadmapWeek,
    roadmapTaskId: SKILL_ACTIONS[g.code].taskId,
    actionTitle: SKILL_ACTIONS[g.code].action,
  }));

  // Overall alignment score
  const totalRequired = Object.values(requiredLevels).reduce((acc, v) => acc + v, 0);
  const totalEarned = CAIRN_CATEGORIES.reduce((acc, { code }) => {
    const req = requiredLevels[code] ?? 7;
    const cand = candidateLevels[code] ?? 5;
    return acc + Math.min(req, cand);
  }, 0);
  const overallAlignmentPercentage = Math.round((totalEarned / totalRequired) * 100);

  return { gaps, nextBestSkills, overallAlignmentPercentage };
}

