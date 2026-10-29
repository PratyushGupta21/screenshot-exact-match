import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  Filter,
  GraduationCap,
  Layers,
  RotateCcw,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  CategoryBadge,
  PageHeader,
  Panel,
  PanelTitle,
  ProgressBar,
  SampleBadge,
} from "@/components/radix/primitives";
import { CAIRN_CATEGORIES } from "@/lib/radix/categories";
import type { CategoryCode } from "@/lib/radix/types";
import {
  loadRoadmapState,
  resetRoadmap,
  subscribeRoadmap,
  toggleTaskCompleted,
  updateTargetRole,
  updateWeeklyHours,
  type RoadmapState,
  type RoadmapTask,
} from "@/services/roadmap-store";

export const Route = createFileRoute("/roadmap")({
  component: PersonalizedRoadmapPage,
});

export function PersonalizedRoadmapPage() {
  const [state, setState] = useState<RoadmapState>(() => loadRoadmapState());
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "completed" | "pending">("all");
  const [expandedWeeks, setExpandedWeeks] = useState<Record<number, boolean>>({
    1: true,
    2: true,
  });

  useEffect(() => {
    const update = () => setState(loadRoadmapState());
    return subscribeRoadmap(update);
  }, []);

  const totalTasks = state.tasks.length;
  const completedTasks = state.tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  const toggleWeek = (week: number) => {
    setExpandedWeeks((prev) => ({ ...prev, [week]: !prev[week] }));
  };

  const expandAll = () => {
    const all: Record<number, boolean> = {};
    for (let w = 1; w <= 12; w++) all[w] = true;
    setExpandedWeeks(all);
  };

  const collapseAll = () => {
    setExpandedWeeks({});
  };

  const handleToggle = (taskId: string) => {
    toggleTaskCompleted(taskId);
  };

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateWeeklyHours(Number(e.target.value));
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateTargetRole(e.target.value);
  };

  // Group filtered tasks by week
  const filteredTasks = state.tasks.filter((t) => {
    if (selectedCategory !== "all" && t.categoryCode !== selectedCategory) return false;
    if (selectedStatus === "completed" && !t.completed) return false;
    if (selectedStatus === "pending" && t.completed) return false;
    return true;
  });

  const weeks = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        eyebrow="Targeted Skill Progression"
        title="Personalized Learning Roadmap"
        description="A milestone-driven 12-week preparation curriculum calibrated against verified company hiring expectations and prioritized to close your highest-impact skill gaps."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <SampleBadge label="Illustrative projected curriculum" />
            <Link
              to="/insights"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all"
              style={{
                background: "rgba(201,205,208,0.06)",
                border: "1px solid rgba(201,205,208,0.15)",
                color: "#DCDCE0",
              }}
            >
              <Target className="size-3.5" />
              <span>Compare Benchmarks</span>
            </Link>
          </div>
        }
      />

      {/* ── Curriculum Controls & Hero Overview ── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Pacing & Role Configurator */}
        <div className="lg:col-span-2">
          <Panel>
            <PanelTitle icon={<Sparkles className="size-4" />}>
              Curriculum Parameters & Pace
            </PanelTitle>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-grey mb-1.5">
                  Target Engineering Role
                </label>
                <select
                  value={state.targetRole}
                  onChange={handleRoleChange}
                  className="w-full rounded-xl px-3.5 py-2.5 text-xs font-mono border focus:outline-none focus:ring-1 focus:ring-champagne"
                  style={{
                    background: "rgba(201,205,208,0.06)",
                    borderColor: "rgba(201,205,208,0.15)",
                    color: "#DCDCE0",
                  }}
                >
                  <option value="Backend Engineer">Backend Engineer (Distributed / API)</option>
                  <option value="Machine Learning Engineer">Machine Learning Engineer (PyTorch / MLOps)</option>
                  <option value="Distributed Systems Engineer">Distributed Systems Engineer (Go / Kernel)</option>
                  <option value="Full Stack Software Engineer">Full Stack Software Engineer (React / Node)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-grey mb-1.5">
                  <span>Weekly Study Commitment</span>
                  <span className="font-mono text-champagne font-bold">{state.weeklyHours} hrs / wk</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={25}
                  step={1}
                  value={state.weeklyHours}
                  onChange={handleHoursChange}
                  className="w-full accent-champagne cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-grey mt-1">
                  <span>5h (Light Pace)</span>
                  <span>12h (Standard)</span>
                  <span>25h (Intensive Bootcamp)</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-grey">
              <span className="font-mono">
                Duration: <strong className="text-frost-white">{state.durationWeeks} Weeks</strong> ·{" "}
                {totalTasks} Curated Milestones
              </span>
              <span className="font-mono text-champagne">
                Prioritizing 12 CAIRN Categories
              </span>
            </div>
          </Panel>
        </div>

        {/* Right Col: Readiness Projection Scorecard */}
        <div>
          <div
            className="rounded-2xl border p-6 flex flex-col justify-between space-y-4 backdrop-blur-md h-full"
            style={{
              background: "rgba(20,20,24,0.35)",
              borderColor: "rgba(201,205,208,0.12)",
            }}
          >
            <div>
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-champagne mb-1 block">
                Estimated Readiness Trajectory
              </span>
              <div className="flex items-baseline gap-3 mt-2">
                <span className="font-display text-4xl font-bold text-frost-white">
                  {state.currentReadiness}
                </span>
                <ArrowRight className="size-5 text-champagne" />
                <span className="font-display text-4xl font-bold text-success-green">
                  {state.projectedReadiness}
                </span>
                <span className="text-xs font-mono text-slate-grey">/ 100</span>
              </div>
              <p className="text-xs text-slate-grey mt-2 leading-relaxed">
                Projected readiness upon milestone completion calibrated for top-tier hiring baselines.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-grey">Curriculum Completion</span>
                <span className="text-frost-white font-bold">{progressPercent}%</span>
              </div>
              <ProgressBar value={progressPercent} tone="success" className="h-2" />
              <p className="text-[11px] font-mono text-slate-grey text-right">
                {completedTasks} of {totalTasks} milestones completed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter Bar & Expand Controls ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-white/10">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-grey">
            <Filter className="size-3.5" />
            <span>Category:</span>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg px-2.5 py-1 text-xs font-mono border focus:outline-none focus:ring-1 focus:ring-champagne"
            style={{
              background: "rgba(201,205,208,0.06)",
              borderColor: "rgba(201,205,208,0.15)",
              color: "#DCDCE0",
            }}
          >
            <option value="all">All 12 Categories</option>
            {CAIRN_CATEGORIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} — {c.name}
              </option>
            ))}
          </select>

          <div className="flex items-center rounded-lg border border-white/10 p-0.5 text-xs font-mono">
            {(["all", "pending", "completed"] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setSelectedStatus(status)}
                className={`rounded-md px-2.5 py-1 capitalize transition-colors ${
                  selectedStatus === status
                    ? "bg-white/10 text-frost-white font-semibold"
                    : "text-slate-grey hover:text-cloud-silver"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-slate-grey">
          <button
            type="button"
            onClick={expandAll}
            className="hover:text-frost-white transition-colors"
          >
            Expand All Weeks
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={collapseAll}
            className="hover:text-frost-white transition-colors"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* ── 12-Week Structured Accordion ── */}
      <div className="space-y-4">
        {weeks.map((weekNum) => {
          const weekTasks = filteredTasks.filter((t) => t.week === weekNum);
          if (weekTasks.length === 0 && selectedCategory !== "all") return null;

          const isExpanded = expandedWeeks[weekNum] ?? false;
          const allCompleted = weekTasks.length > 0 && weekTasks.every((t) => t.completed);

          // Week theme labels
          const weekThemes: Record<number, string> = {
            1: "Quick Wins & Engineering Hygiene (Resume & CI)",
            2: "Core Algorithmic Foundations (DSA Sliding Window & Graphs)",
            3: "Low-Level Design & Concurrency (OOD / Thread Safety)",
            4: "Database Performance & Query Optimization (SQL Indexing)",
            5: "Operating Systems Internals & Systems Calls (Linux VMM)",
            6: "Computer Networking & Transport Protocols (TCP / HTTP/3)",
            7: "Distributed Systems & Consistency Architectures (CAP / WAL)",
            8: "Cloud Native Deployment & Container Lifecycle (Kubernetes)",
            9: "Practical AI Integration & Vector Search (Embeddings)",
            10: "Back-of-Envelope Estimation & Scale Sizing (APTI)",
            11: "Capstone Project Architecture & Technical Articulation",
            12: "Hiring Bar Mock Screening & Final Review",
          };

          return (
            <div
              key={weekNum}
              className="rounded-2xl border transition-all overflow-hidden backdrop-blur-md"
              style={{
                background: "rgba(20,20,24,0.3)",
                borderColor: allCompleted
                  ? "rgba(54,214,126,0.3)"
                  : "rgba(201,205,208,0.12)",
              }}
            >
              {/* Week Accordion Header */}
              <button
                type="button"
                onClick={() => toggleWeek(weekNum)}
                className="w-full flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 text-left transition-colors hover:bg-white/[0.02] gap-3"
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className="size-8 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0 border"
                    style={{
                      background: allCompleted ? "rgba(54,214,126,0.1)" : "rgba(196,165,116,0.1)",
                      borderColor: allCompleted
                        ? "rgba(54,214,126,0.25)"
                        : "rgba(196,165,116,0.25)",
                      color: allCompleted ? "#36D67E" : "#C4A574",
                    }}
                  >
                    W{weekNum}
                  </span>
                  <div>
                    <h3 className="font-display text-sm sm:text-base font-bold text-frost-white">
                      Week {weekNum}: {weekThemes[weekNum] || `Module ${weekNum}`}
                    </h3>
                    <p className="font-mono text-[11px] text-slate-grey mt-0.5">
                      {weekTasks.filter((t) => t.completed).length} / {weekTasks.length} milestones
                      completed
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono text-slate-grey self-end sm:self-center">
                  {allCompleted && (
                    <span className="inline-flex items-center gap-1 text-success-green font-semibold">
                      <CheckCircle2 className="size-3.5" /> Complete
                    </span>
                  )}
                  {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                </div>
              </button>

              {/* Tasks List for the Week */}
              {isExpanded && (
                <div className="p-4 sm:p-5 pt-0 border-t border-white/5 space-y-3">
                  {weekTasks.length === 0 ? (
                    <p className="text-xs font-mono text-slate-grey py-3 text-center">
                      No matching tasks found for the current filter.
                    </p>
                  ) : (
                    weekTasks.map((task) => {
                      // Adjust time based on chosen weekly pacing (baseline is 12 hrs/wk)
                      const pacingFactor = state.weeklyHours / 12;
                      const adjustedHours = (task.baseHours * pacingFactor).toFixed(1);

                      return (
                        <div
                          key={task.id}
                          className="rounded-xl border p-4 transition-all flex flex-col sm:flex-row items-start justify-between gap-4"
                          style={{
                            background: task.completed
                              ? "rgba(54,214,126,0.03)"
                              : "rgba(201,205,208,0.02)",
                            borderColor: task.completed
                              ? "rgba(54,214,126,0.2)"
                              : "rgba(201,205,208,0.08)",
                          }}
                        >
                          <div className="flex items-start gap-3.5 flex-1">
                            {/* Checkbox */}
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => handleToggle(task.id)}
                              aria-label={`Mark ${task.title} as completed`}
                              className="mt-1 size-4 rounded accent-champagne cursor-pointer"
                            />

                            <div className="space-y-1.5 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <CategoryBadge code={task.categoryCode} showName />
                                <span className="font-mono text-[10px] px-2 py-0.5 rounded uppercase border bg-white/5 text-slate-grey border-white/10">
                                  {task.difficulty}
                                </span>
                                <span className="font-mono text-[10px] px-2 py-0.5 rounded uppercase border bg-champagne/10 text-champagne border-champagne/20">
                                  {task.type}
                                </span>
                              </div>

                              <p
                                className={`font-display text-sm font-bold transition-colors ${
                                  task.completed
                                    ? "text-slate-grey line-through decoration-slate-grey"
                                    : "text-frost-white"
                                }`}
                              >
                                {task.title}
                              </p>

                              <p className="text-xs text-slate-grey leading-relaxed">
                                {task.objective}
                              </p>

                              {task.resourceTitle && (
                                <div className="pt-1">
                                  <a
                                    href={task.resourceUrl || "#"}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 font-mono text-[11px] text-champagne hover:underline"
                                  >
                                    <BookOpen className="size-3" />
                                    <span>Resource: {task.resourceTitle}</span>
                                    {task.resourceUrl && <ExternalLink className="size-2.5" />}
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 sm:self-center font-mono text-xs text-slate-grey shrink-0">
                            <Clock className="size-3.5 text-champagne" />
                            <span>~{adjustedHours} hrs</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Reset Curriculum */}
      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={() => {
            if (confirm("Reset learning roadmap progress to default state?")) {
              resetRoadmap();
            }
          }}
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-grey hover:text-frost-white transition-colors"
        >
          <RotateCcw className="size-3" />
          <span>Reset Roadmap Progress</span>
        </button>
      </div>
    </div>
  );
}

