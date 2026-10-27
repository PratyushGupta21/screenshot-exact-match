import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileSearch, FileText, GitCompareArrows, Radar } from "lucide-react";
import { useState } from "react";
import { PublicFooter } from "@/components/radix/Footers";
import { GlassHero } from "@/components/radix/GlassHero";
import { CategoryBadge, ScoreIndicator } from "@/components/radix/primitives";
import { PublicNav } from "@/components/radix/PublicNav";
import { RADIX_CATEGORIES, categoryName, COMPANIES } from "@/lib/radix/categories";
import { pageMeta } from "@/lib/radix/meta";
import { priorityGaps } from "@/lib/radix/scoring";
import { getJobs, skillMatchSync, talentCheckSync } from "@/services/radix-api";

export const Route = createFileRoute("/")({
  head: () =>
    pageMeta(
      "CAIRN — Precision Talent Intelligence Platform",
      "Understand technical readiness, explore skill alignment, and turn complex talent signals into clearer decisions.",
    ),
  component: LandingPage,
});

/* ─── Shared section style helpers ─── */
const SECTION_DARK = {
  background: "#050507",
  borderTop: "1px solid rgba(201,205,208,0.08)",
  borderBottom: "1px solid rgba(201,205,208,0.08)",
} as const;

const SECTION_ALT = {
  background: "#0C0C0F",
  borderTop: "1px solid rgba(201,205,208,0.06)",
  borderBottom: "1px solid rgba(201,205,208,0.06)",
} as const;

const GLASS_CARD = {
  background: "#17171B",
  border: "1px solid rgba(201,205,208,0.14)",
  boxShadow: "0 0 0 1px rgba(201,205,208,0.05), 0 8px 24px -4px rgba(0,0,0,0.4)",
} as const;

export function LandingPage() {
  const [selectedCompany, setSelectedCompany] = useState<(typeof COMPANIES)[number]>(COMPANIES[0]);
  const defaultCandidateId = "my-profile";
  const defaultJobId = "g-swe";

  const tcResult = talentCheckSync(defaultCandidateId, selectedCompany);
  const smResult = skillMatchSync(defaultCandidateId, defaultJobId);
  const gaps = priorityGaps(tcResult);
  const targetJob = getJobs().find((j) => j.id === defaultJobId) ??
    getJobs()[0] ?? { role: "Software Engineer" };

  return (
    <div
      className="min-h-screen flex flex-col selection:bg-champagne/20 selection:text-frost-white"
      style={{ background: "#050507", color: "#F4F4F5" }}
    >
      <div id="top" />

      {/* Sticky glass nav */}
      <PublicNav />

      {/* ── HERO — Glass Installation ── */}
      <section aria-label="Hero">
        <GlassHero tcResult={tcResult} smResult={smResult} targetJobRole={targetJob.role} />
      </section>

      {/* ── PRODUCT SECTION ── */}
      <section id="product" style={SECTION_ALT} className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-12 items-start">
            {/* Header */}
            <div className="lg:col-span-5 space-y-4">
              <p
                className="font-mono text-xs font-semibold uppercase tracking-widest"
                style={{ color: "#C4A574" }}
              >
                Purposeful Architecture
              </p>
              <h2
                className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-tight"
                style={{ color: "#DCDCE0", letterSpacing: "-0.03em" }}
              >
                Clarity across every dimension of technical capability.
              </h2>
              <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#85858E" }}>
                Traditional engineering hiring relies on opaque signals. CAIRN structures candidate
                capabilities against verified competencies — making readiness measurable.
              </p>
              <div className="pt-4">
                <Link
                  to="/talent-check"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider transition-colors"
                  style={{ color: "#BDBDC3" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#C4A574")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#BDBDC3")}
                >
                  <span>Inspect Talent Check Criteria</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>

            {/* Capability cards */}
            <div className="lg:col-span-7 grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: <Radar className="size-4.5" />,
                  title: "Evaluate Readiness",
                  desc: "Assess technical proficiency across 12 standardized categories against curated hiring standards like Google, Stripe, and high-growth startups.",
                  iconColor: "#C4A574",
                },
                {
                  icon: <FileSearch className="size-4.5" />,
                  title: "Analyze Job Descriptions",
                  desc: "Deconstruct raw job descriptions to extract concrete technical competencies, seniority benchmarks, and core domain requirements.",
                  iconColor: "#36D67E",
                },
                {
                  icon: <FileText className="size-4.5" />,
                  title: "Parse Resume Information",
                  desc: "Extract skills, education, and career experience from resumes directly into your persistent candidate profile with instant synchronization.",
                  iconColor: "#BDBDC3",
                },
                {
                  icon: <GitCompareArrows className="size-4.5" />,
                  title: "Compare Alignment & History",
                  desc: "Intersect abilities against specific roles to view matched strengths, missing prerequisites, and track assessment progress over time.",
                  iconColor: "#C4A574",
                },
              ].map((cap) => (
                <div
                  key={cap.title}
                  className="rounded-2xl p-6 transition-all glass-shimmer"
                  style={GLASS_CARD}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(201,205,208,0.22)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(201,205,208,0.14)";
                  }}
                >
                  <span
                    className="grid size-9 place-items-center rounded-xl"
                    style={{
                      background: "rgba(201,205,208,0.06)",
                      border: "1px solid rgba(201,205,208,0.12)",
                      color: cap.iconColor,
                    }}
                  >
                    {cap.icon}
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold" style={{ color: "#DCDCE0" }}>
                    {cap.title}
                  </h3>
                  <p
                    className="mt-2 text-xs sm:text-sm leading-relaxed"
                    style={{ color: "#85858E" }}
                  >
                    {cap.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={SECTION_DARK} className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="mx-auto max-w-2xl text-center space-y-3 mb-16">
            <p
              className="font-mono text-xs font-semibold uppercase tracking-widest"
              style={{ color: "#C4A574" }}
            >
              Workflow Methodology
            </p>
            <h2
              className="font-display text-3xl sm:text-5xl font-bold tracking-tight"
              style={{ color: "#DCDCE0", letterSpacing: "-0.03em" }}
            >
              Three steps to objective clarity.
            </h2>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#85858E" }}>
              A structured progression from candidate background to hiring benchmark alignment.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                num: "01",
                title: "Build your profile",
                desc: "Enter candidate information manually or parse from a resume. Review verified capabilities and establish your technical foundation.",
                to: "/profile" as const,
                cta: "Profile Builder",
              },
              {
                num: "02",
                title: "Evaluate your skills",
                desc: "Explore technical readiness across all 12 CAIRN categories. Discover level-by-level fulfillments and highlight critical preparation gaps.",
                to: "/talent-check" as const,
                cta: "Talent Check",
              },
              {
                num: "03",
                title: "Understand your alignment",
                desc: "Compare your skill set against specific role requirements using deterministic overlap calculations and missing prerequisite analysis.",
                to: "/skill-matching" as const,
                cta: "Skill Matching",
              },
            ].map((step) => (
              <div
                key={step.num}
                className="rounded-2xl p-8 flex flex-col justify-between glass-shimmer"
                style={GLASS_CARD}
              >
                <div className="space-y-4">
                  <span className="font-serif text-3xl italic" style={{ color: "#C4A574" }}>
                    {step.num}
                  </span>
                  <h3 className="font-display text-xl font-bold" style={{ color: "#DCDCE0" }}>
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "#85858E" }}>
                    {step.desc}
                  </p>
                </div>
                <div
                  className="mt-8 pt-4 border-t"
                  style={{ borderColor: "rgba(201,205,208,0.1)" }}
                >
                  <Link
                    to={step.to}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider transition-colors"
                    style={{ color: "#85858E" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#C4A574")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#85858E")}
                  >
                    <span>{step.cta}</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 12-CATEGORY SHOWCASE ── */}
      <section id="categories" style={SECTION_ALT} className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          {/* Header */}
          <div
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-8 mb-10"
            style={{ borderColor: "rgba(201,205,208,0.08)" }}
          >
            <div className="max-w-2xl space-y-2">
              <p
                className="font-mono text-xs font-semibold uppercase tracking-widest"
                style={{ color: "#C4A574" }}
              >
                Competency Matrix
              </p>
              <h2
                className="font-display text-3xl sm:text-4xl font-bold tracking-tight"
                style={{ color: "#DCDCE0", letterSpacing: "-0.03em" }}
              >
                The 12 CAIRN Skill Categories
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "#85858E" }}>
                A standardized taxonomy spanning algorithms, architecture, systems engineering, and
                professional aptitude.
              </p>
            </div>

            {/* Benchmark switcher */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono shrink-0" style={{ color: "#85858E" }}>
                Preview Bar:
              </span>
              {COMPANIES.map((company) => {
                const active = company === selectedCompany;
                return (
                  <button
                    key={company}
                    onClick={() => setSelectedCompany(company)}
                    className="rounded-xl px-3 py-1.5 font-mono text-xs font-medium transition-all"
                    style={
                      active
                        ? { background: "#DCDCE0", color: "#050507" }
                        : {
                            background: "rgba(201,205,208,0.06)",
                            border: "1px solid rgba(201,205,208,0.15)",
                            color: "#85858E",
                          }
                    }
                    onMouseEnter={(e) => {
                      if (!active) e.currentTarget.style.color = "#DCDCE0";
                    }}
                    onMouseLeave={(e) => {
                      if (!active) e.currentTarget.style.color = "#85858E";
                    }}
                  >
                    {company
                      .replace(" Corporation", "")
                      .replace(" Financial Services Software", "")}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category grid */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {/* Readiness summary tile (span 2) */}
            <div
              className="sm:col-span-2 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 justify-between"
              style={GLASS_CARD}
            >
              <div className="flex items-center gap-6">
                <ScoreIndicator score={tcResult.readiness_score} size={120} label="Readiness" />
                <div className="space-y-1">
                  <span
                    className="font-mono text-[11px] font-semibold uppercase tracking-wider"
                    style={{ color: "#C4A574" }}
                  >
                    Evaluated Target
                  </span>
                  <h3 className="font-display text-2xl font-bold" style={{ color: "#DCDCE0" }}>
                    {selectedCompany}
                  </h3>
                  <p className="text-xs" style={{ color: "#85858E" }}>
                    {tcResult.skillset_gap.filter((g) => !g.gap).length} of 12 benchmark categories
                    satisfied
                  </p>
                </div>
              </div>
              <Link
                to="/talent-check"
                search={{ company: selectedCompany }}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all"
                style={{
                  background: "#DCDCE0",
                  color: "#050507",
                }}
              >
                <span>Inspect Details</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>

            {/* Priority gap tile */}
            <div
              className="rounded-2xl p-6 flex flex-col justify-between"
              style={{
                background: "rgba(196,165,116,0.06)",
                border: "1px solid rgba(196,165,116,0.18)",
              }}
            >
              <div>
                <span
                  className="font-mono text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: "#C4A574" }}
                >
                  Priority Gap Focus
                </span>
                <h3 className="mt-2 font-display text-lg font-bold" style={{ color: "#DCDCE0" }}>
                  {gaps[0] ? categoryName(gaps[0].category_code) : "All Met"}
                </h3>
                <p className="mt-1 text-xs" style={{ color: "#85858E" }}>
                  {gaps[0]
                    ? `Level ${gaps[0].candidate_level} vs Level ${gaps[0].required_level}`
                    : "Baseline fulfilled across all categories"}
                </p>
              </div>
              <div
                className="mt-4 flex items-center justify-between border-t pt-3"
                style={{ borderColor: "rgba(196,165,116,0.15)" }}
              >
                <span className="font-mono text-xs font-semibold" style={{ color: "#E05252" }}>
                  {gaps[0]
                    ? `−${gaps[0].required_level - gaps[0].candidate_level} Delta`
                    : "0 Delta"}
                </span>
                {gaps[0] && <CategoryBadge code={gaps[0].category_code} />}
              </div>
            </div>

            {/* Role match tile */}
            <div className="rounded-2xl p-6 flex flex-col justify-between" style={GLASS_CARD}>
              <div>
                <span
                  className="font-mono text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: "#36D67E" }}
                >
                  Target Match
                </span>
                <h3 className="mt-2 font-display text-3xl font-bold" style={{ color: "#DCDCE0" }}>
                  {smResult.match_score}%
                </h3>
                <p className="mt-1 text-xs truncate" style={{ color: "#85858E" }}>
                  Role: {targetJob.role}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t" style={{ borderColor: "rgba(201,205,208,0.1)" }}>
                <Link
                  to="/skill-matching"
                  className="inline-flex items-center gap-1 text-xs font-semibold transition-colors"
                  style={{ color: "#85858E" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#C4A574")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#85858E")}
                >
                  <span>View Intersection</span>
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>

            {/* Individual category cards */}
            {RADIX_CATEGORIES.map((cat) => {
              const gapItem = tcResult.skillset_gap.find((g) => g.category_code === cat.code);
              const isFulfilled = !gapItem?.gap;

              return (
                <div
                  key={cat.code}
                  className="rounded-2xl p-5 transition-all"
                  style={GLASS_CARD}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(201,205,208,0.22)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(201,205,208,0.14)";
                  }}
                >
                  <div className="flex items-center justify-between">
                    <CategoryBadge code={cat.code} />
                    <span
                      className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={
                        isFulfilled
                          ? {
                              background: "rgba(54,214,126,0.1)",
                              color: "#36D67E",
                              border: "1px solid rgba(54,214,126,0.2)",
                            }
                          : {
                              background: "rgba(196,165,116,0.1)",
                              color: "#C4A574",
                              border: "1px solid rgba(196,165,116,0.2)",
                            }
                      }
                    >
                      {isFulfilled
                        ? "TIER MET"
                        : `−${(gapItem?.required_level ?? 2) - (gapItem?.candidate_level ?? 1)}`}
                    </span>
                  </div>
                  <h4
                    className="mt-3 font-display text-sm font-bold truncate"
                    style={{ color: "#DCDCE0" }}
                  >
                    {cat.name}
                  </h4>
                  <div
                    className="mt-3 flex items-center justify-between text-[11px] font-mono border-t pt-2.5"
                    style={{ borderColor: "rgba(201,205,208,0.08)", color: "#85858E" }}
                  >
                    <span>Candidate: L{gapItem?.candidate_level ?? 1}</span>
                    <span className="font-semibold" style={{ color: "#DCDCE0" }}>
                      Target: L{gapItem?.required_level ?? 2}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Demo notice */}
          <div
            className="mt-8 rounded-xl p-4 text-center text-xs"
            style={{
              background: "rgba(201,205,208,0.04)",
              border: "1px solid rgba(201,205,208,0.1)",
              color: "#85858E",
            }}
          >
            <span className="font-semibold" style={{ color: "#BDBDC3" }}>
              Demonstration Notice:
            </span>{" "}
            Benchmark values and category scoring criteria are calculated deterministically
            on-device as illustrative models.
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCT PREVIEW ── */}
      <section style={SECTION_DARK} className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            <div className="lg:col-span-5 space-y-5">
              <p
                className="font-mono text-xs font-semibold uppercase tracking-widest"
                style={{ color: "#C4A574" }}
              >
                Decision Workspace
              </p>
              <h2
                className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-tight"
                style={{ color: "#DCDCE0", letterSpacing: "-0.03em" }}
              >
                From complex signals to clear direction.
              </h2>
              <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#85858E" }}>
                Instead of generic scoring, CAIRN breaks down concrete skill fulfillment,
                prerequisite coverage, and actionable recommendations.
              </p>
              <div className="pt-2">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-xs font-semibold uppercase tracking-wider transition-all hover:scale-[1.02]"
                  style={{ background: "#DCDCE0", color: "#050507" }}
                >
                  <span>Launch Dashboard Workspace</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>

            {/* Product UI preview */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl p-6 sm:p-8 space-y-5" style={GLASS_CARD}>
                <div
                  className="flex items-center justify-between border-b pb-4"
                  style={{ borderColor: "rgba(201,205,208,0.1)" }}
                >
                  <div>
                    <span
                      className="font-mono text-xs uppercase tracking-wider"
                      style={{ color: "#85858E" }}
                    >
                      Active Workspace Session
                    </span>
                    <h3 className="font-display text-lg font-bold" style={{ color: "#DCDCE0" }}>
                      Software Engineer Evaluation
                    </h3>
                  </div>
                  <span
                    className="rounded-full px-3 py-1 font-mono text-xs font-medium"
                    style={{
                      background: "rgba(196,165,116,0.1)",
                      border: "1px solid rgba(196,165,116,0.2)",
                      color: "#C4A574",
                    }}
                  >
                    Deterministic Run
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    {
                      label: "Overall Readiness",
                      value: `${tcResult.readiness_score} / 100`,
                      sub: "Google SWE Benchmark",
                      subColor: "#36D67E",
                    },
                    {
                      label: "Role Match Rate",
                      value: `${smResult.match_score}%`,
                      sub: targetJob.role,
                      subColor: "#85858E",
                    },
                    {
                      label: "Profile Completion",
                      value: "85%",
                      sub: "12 Verified Skills",
                      subColor: "#C4A574",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl p-4"
                      style={{
                        background: "rgba(201,205,208,0.04)",
                        border: "1px solid rgba(201,205,208,0.1)",
                      }}
                    >
                      <p className="font-mono text-[11px]" style={{ color: "#85858E" }}>
                        {stat.label}
                      </p>
                      <p
                        className="mt-1 font-display text-2xl font-bold"
                        style={{ color: "#DCDCE0", letterSpacing: "-0.02em" }}
                      >
                        {stat.value}
                      </p>
                      <p className="mt-1 text-[11px]" style={{ color: stat.subColor }}>
                        {stat.sub}
                      </p>
                    </div>
                  ))}
                </div>

                <div
                  className="rounded-xl p-4 space-y-2.5"
                  style={{
                    background: "rgba(201,205,208,0.03)",
                    border: "1px solid rgba(201,205,208,0.08)",
                  }}
                >
                  <p
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "#85858E" }}
                  >
                    Priority Competency Check
                  </p>
                  <div className="space-y-2">
                    {RADIX_CATEGORIES.slice(0, 3).map((c) => (
                      <div key={c.code} className="flex items-center justify-between text-xs">
                        <span className="font-medium" style={{ color: "#BDBDC3" }}>
                          {c.name}
                        </span>
                        <span className="font-mono" style={{ color: "#36D67E" }}>
                          Tier-1 Satisfied
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CINEMATIC CLOSING CTA ── */}
      <section
        className="relative overflow-hidden py-24 sm:py-32"
        style={{
          background: "#0C0C0F",
          borderTop: "1px solid rgba(201,205,208,0.08)",
        }}
      >
        {/* Ambient glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 left-1/2 -translate-x-1/2 size-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(196,165,116,0.08) 0%, transparent 70%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 right-20 w-96 h-96 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(180,195,210,0.05) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-8 text-center space-y-8">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-mono text-xs"
            style={{
              background: "rgba(196,165,116,0.08)",
              border: "1px solid rgba(196,165,116,0.2)",
              color: "#C4A574",
            }}
          >
            <span className="size-1.5 rounded-full" style={{ background: "#C4A574" }} />
            <span className="tracking-widest uppercase">The Precision Talent Studio</span>
          </div>

          <h2
            className="font-display text-4xl sm:text-6xl font-bold tracking-tight leading-tight"
            style={{ color: "#DCDCE0", letterSpacing: "-0.04em" }}
          >
            Make talent easier to understand.
          </h2>

          <p
            className="mx-auto max-w-2xl text-base sm:text-lg leading-relaxed"
            style={{ color: "#85858E" }}
          >
            Bring candidate skills, technical readiness, and job requirements into one considered
            experience.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2.5 rounded-xl px-8 py-4 text-xs font-semibold uppercase tracking-wider transition-all hover:scale-[1.02]"
              style={{ background: "#DCDCE0", color: "#050507" }}
            >
              <span>Explore CAIRN</span>
              <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/talent-check"
              className="inline-flex items-center gap-2 rounded-xl px-7 py-4 text-xs font-semibold uppercase tracking-wider transition-all"
              style={{
                background: "rgba(201,205,208,0.06)",
                border: "1px solid rgba(201,205,208,0.18)",
                color: "#BDBDC3",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(201,205,208,0.3)";
                e.currentTarget.style.color = "#DCDCE0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(201,205,208,0.18)";
                e.currentTarget.style.color = "#BDBDC3";
              }}
            >
              <span>Review Hiring Standards</span>
              <ArrowRight className="size-3.5" style={{ color: "#85858E" }} />
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
