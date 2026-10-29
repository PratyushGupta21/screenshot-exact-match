// Personalized Learning Roadmap Store
// 12-week structured curriculum organized by CAIRN 12-dimension skill taxonomy.
// Toggles and preferences persist in localStorage.

import type { CategoryCode } from "@/lib/radix/types";

export type TaskType = "learning" | "practice" | "project" | "certification" | "improvement";
export type TaskDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface RoadmapTask {
  id: string;
  week: number;
  categoryCode: CategoryCode;
  title: string;
  objective: string;
  baseHours: number;
  difficulty: TaskDifficulty;
  type: TaskType;
  resourceTitle?: string;
  resourceUrl?: string;
  completed: boolean;
}

export interface RoadmapState {
  targetRole: string;
  weeklyHours: number; // 5 to 25 hours
  durationWeeks: number;
  currentReadiness: number;
  projectedReadiness: number;
  tasks: RoadmapTask[];
}

const STORAGE_KEY = "cairn.roadmap.v1";
const EVENT_NAME = "cairn:roadmap-updated";

const INITIAL_TASKS: RoadmapTask[] = [
  // Week 1: Quick Wins & Engineering Hygiene
  {
    id: "w1-t1",
    week: 1,
    categoryCode: "SWE",
    title: "Repository Hygiene & README Refactoring",
    objective: "Audit top 3 public repositories to add clear architectural diagrams, setup guides, and open-source licenses.",
    baseHours: 2.5,
    difficulty: "Beginner",
    type: "improvement",
    resourceTitle: "Make a README Standard",
    resourceUrl: "https://www.makeareadme.com/",
    completed: true,
  },
  {
    id: "w1-t2",
    week: 1,
    categoryCode: "SWE",
    title: "Automated CI Test Workflows",
    objective: "Configure GitHub Actions matrix to run pytest / jest and linter on every pull request.",
    baseHours: 3.0,
    difficulty: "Intermediate",
    type: "practice",
    resourceTitle: "GitHub Actions Starter Workflows",
    resourceUrl: "https://github.com/actions/starter-workflows",
    completed: true,
  },
  {
    id: "w1-t3",
    week: 1,
    categoryCode: "COMM",
    title: "Resume Integrity & Proof-point Alignment",
    objective: "Eliminate repetitive keywords, unsupported claims, and clarify project impact metrics with Star method.",
    baseHours: 2.0,
    difficulty: "Beginner",
    type: "improvement",
    resourceTitle: "Google XYZ Resume Formula",
    completed: true,
  },

  // Week 2: Core Algorithmic Competency (DSA)
  {
    id: "w2-t1",
    week: 2,
    categoryCode: "DSA",
    title: "Two Pointers & Sliding Window Mastery",
    objective: "Solve and document pattern templates for 15 LeetCode Medium sliding window and two-pointer problems.",
    baseHours: 4.0,
    difficulty: "Intermediate",
    type: "practice",
    resourceTitle: "NeetCode 150 Sliding Window",
    completed: false,
  },
  {
    id: "w2-t2",
    week: 2,
    categoryCode: "DSA",
    title: "Graph Traversal & Cycle Detection",
    objective: "Implement BFS, DFS, and topological sort from scratch with cycle detection in Python or Go.",
    baseHours: 3.5,
    difficulty: "Intermediate",
    type: "learning",
    resourceTitle: "Algorithms, Part I (Sedgewick)",
    completed: false,
  },

  // Week 3: Object-Oriented Design & Clean Code (OOD / COD)
  {
    id: "w3-t1",
    week: 3,
    categoryCode: "OOD",
    title: "Low-Level System Design: Parking Lot & Rate Limiter",
    objective: "Draft complete UML class models and write thread-safe OOP implementations for Token Bucket rate limiter.",
    baseHours: 4.5,
    difficulty: "Intermediate",
    type: "project",
    resourceTitle: "Refactoring.Guru Design Patterns",
    completed: false,
  },
  {
    id: "w3-t2",
    week: 3,
    categoryCode: "COD",
    title: "Concurrency & Thread Safety in Backend Services",
    objective: "Practice mutexes, read-write locks, and channel communication to prevent race conditions.",
    baseHours: 3.0,
    difficulty: "Advanced",
    type: "practice",
    resourceTitle: "Concurrency in Go / Python AsyncIO",
    completed: false,
  },

  // Week 4: Relational Databases & Query Performance (SQL)
  {
    id: "w4-t1",
    week: 4,
    categoryCode: "SQL",
    title: "B-Tree Indexing & Query Execution Plans",
    objective: "Analyze EXPLAIN ANALYZE traces in PostgreSQL to optimize slow table scans and multi-table joins.",
    baseHours: 3.5,
    difficulty: "Intermediate",
    type: "learning",
    resourceTitle: "Use The Index, Luke!",
    completed: false,
  },
  {
    id: "w4-t2",
    week: 4,
    categoryCode: "SQL",
    title: "ACID Isolation Levels & Lock Contention",
    objective: "Simulate Phantom Reads and Write Skew anomalies in Read Committed vs Serializable transactions.",
    baseHours: 3.0,
    difficulty: "Advanced",
    type: "practice",
    resourceTitle: "PostgreSQL Concurrency Documentation",
    completed: false,
  },

  // Week 5: Operating Systems & Systems Programming (OS)
  {
    id: "w5-t1",
    week: 5,
    categoryCode: "OS",
    title: "Virtual Memory, Page Tables & Linux System Calls",
    objective: "Trace process memory maps and system call overhead using strace and perf on Linux.",
    baseHours: 4.0,
    difficulty: "Intermediate",
    type: "learning",
    resourceTitle: "Operating Systems: Three Easy Pieces",
    completed: false,
  },

  // Week 6: Networking & Protocols (NETW)
  {
    id: "w6-t1",
    week: 6,
    categoryCode: "NETW",
    title: "TCP 3-Way Handshake, Flow Control & TLS 1.3",
    objective: "Capture Wireshark packets examining TCP window sizing, head-of-line blocking, and HTTP/2 vs HTTP/3 multiplexing.",
    baseHours: 3.5,
    difficulty: "Intermediate",
    type: "practice",
    resourceTitle: "High Performance Browser Networking",
    completed: false,
  },

  // Week 7: Distributed System Fundamentals (SYSD)
  {
    id: "w7-t1",
    week: 7,
    categoryCode: "SYSD",
    title: "CAP Theorem, Consistency Models & Gossip Protocols",
    objective: "Design a fault-tolerant distributed cache with consistent hashing and virtual nodes.",
    baseHours: 4.5,
    difficulty: "Advanced",
    type: "learning",
    resourceTitle: "Designing Data-Intensive Applications (Kleppmann)",
    completed: false,
  },

  // Week 8: Cloud Infrastructure & Container Orchestration (CLOUD)
  {
    id: "w8-t1",
    week: 8,
    categoryCode: "CLOUD",
    title: "Kubernetes Deployments, Ingress & Rolling Updates",
    objective: "Deploy a multi-service container cluster locally with Helm charts, readiness probes, and volume mounts.",
    baseHours: 4.0,
    difficulty: "Intermediate",
    type: "project",
    resourceTitle: "Kubernetes The Hard Way",
    completed: false,
  },

  // Week 9: Machine Learning & Practical AI Integration (AI)
  {
    id: "w9-t1",
    week: 9,
    categoryCode: "AI",
    title: "Vector Embeddings & Semantic Search Pipelines",
    objective: "Implement a vector search service using pgvector and sentence-transformers for resume-JD matching.",
    baseHours: 4.0,
    difficulty: "Intermediate",
    type: "project",
    resourceTitle: "pgvector Documentation",
    completed: false,
  },

  // Week 10: Aptitude, Metrics & Technical Problem Solving (APTI)
  {
    id: "w10-t1",
    week: 10,
    categoryCode: "APTI",
    title: "Back-of-the-Envelope Capacity Estimation",
    objective: "Calculate throughput, storage volume, and network bandwidth requirements for Twitter scale (500M tweets/day).",
    baseHours: 3.0,
    difficulty: "Intermediate",
    type: "practice",
    resourceTitle: "System Design Primer - Estimation",
    completed: false,
  },

  // Week 11: Portfolio Capstone Project & Articulation (SWE / COMM)
  {
    id: "w11-t1",
    week: 11,
    categoryCode: "SWE",
    title: "End-to-End Capstone: High-Throughput Job Queue",
    objective: "Build and benchmark a persistent job queue with dead-letter exchanges and prometheus telemetry.",
    baseHours: 5.0,
    difficulty: "Advanced",
    type: "project",
    resourceTitle: "Distributed Queue Architecture Guide",
    completed: false,
  },
  {
    id: "w11-t2",
    week: 11,
    categoryCode: "COMM",
    title: "Architectural Articulation & Design Defense",
    objective: "Record a 10-minute technical walkthrough defending trade-offs between Redis and Kafka for streaming workloads.",
    baseHours: 2.5,
    difficulty: "Intermediate",
    type: "practice",
    completed: false,
  },

  // Week 12: Hiring Bar Calibration & Final Readiness
  {
    id: "w12-t1",
    week: 12,
    categoryCode: "COD",
    title: "Mock Technical Screening Under Time Constraints",
    objective: "Complete 2 full 45-minute timed live coding sessions covering algorithms, complexity, and testing.",
    baseHours: 3.5,
    difficulty: "Advanced",
    type: "practice",
    completed: false,
  },
  {
    id: "w12-t2",
    week: 12,
    categoryCode: "COMM",
    title: "Behavioral & Engineering Leadership Evaluation",
    objective: "Prepare 6 detailed STAR case studies highlighting trade-offs, conflict resolution, and technical failure post-mortems.",
    baseHours: 2.5,
    difficulty: "Intermediate",
    type: "practice",
    completed: false,
  },
];

function safeGetItem(key: string): string | null {
  try {
    if (typeof window !== "undefined" && window.localStorage && typeof window.localStorage.getItem === "function") {
      return window.localStorage.getItem(key);
    }
  } catch {}
  return null;
}

function safeSetItem(key: string, value: string) {
  try {
    if (typeof window !== "undefined" && window.localStorage && typeof window.localStorage.setItem === "function") {
      window.localStorage.setItem(key, value);
    }
  } catch {}
}

export function loadRoadmapState(): RoadmapState {
  try {
    const raw = safeGetItem(STORAGE_KEY);
    if (!raw) {
      const init: RoadmapState = {
        targetRole: "Backend Engineer",
        weeklyHours: 12,
        durationWeeks: 12,
        currentReadiness: 76,
        projectedReadiness: 94,
        tasks: INITIAL_TASKS,
      };
      safeSetItem(STORAGE_KEY, JSON.stringify(init));
      return init;
    }
    const parsed = JSON.parse(raw) as RoadmapState;
    return parsed;
  } catch {
    return {
      targetRole: "Backend Engineer",
      weeklyHours: 12,
      durationWeeks: 12,
      currentReadiness: 76,
      projectedReadiness: 94,
      tasks: INITIAL_TASKS,
    };
  }
}

export function saveRoadmapState(state: RoadmapState) {
  safeSetItem(STORAGE_KEY, JSON.stringify(state));
  if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
    try {
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: state }));
    } catch {}
  }
}

export function toggleTaskCompleted(taskId: string): RoadmapState {
  const current = loadRoadmapState();
  const updatedTasks = current.tasks.map((t) =>
    t.id === taskId ? { ...t, completed: !t.completed } : t,
  );
  const completedCount = updatedTasks.filter((t) => t.completed).length;
  const progressRatio = completedCount / updatedTasks.length;
  const updatedState: RoadmapState = {
    ...current,
    tasks: updatedTasks,
    currentReadiness: Math.min(94, Math.round(76 + progressRatio * 18)),
  };
  saveRoadmapState(updatedState);
  return updatedState;
}

export function updateWeeklyHours(hours: number): RoadmapState {
  const current = loadRoadmapState();
  const updated = { ...current, weeklyHours: hours };
  saveRoadmapState(updated);
  return updated;
}

export function updateTargetRole(role: string): RoadmapState {
  const current = loadRoadmapState();
  const updated = { ...current, targetRole: role };
  saveRoadmapState(updated);
  return updated;
}

export function resetRoadmap() {
  const init: RoadmapState = {
    targetRole: "Backend Engineer",
    weeklyHours: 12,
    durationWeeks: 12,
    currentReadiness: 76,
    projectedReadiness: 94,
    tasks: INITIAL_TASKS,
  };
  saveRoadmapState(init);
}

export function subscribeRoadmap(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener("storage", handler);
  };
}
