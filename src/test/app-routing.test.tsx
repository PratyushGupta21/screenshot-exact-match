import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { CAIRN_CATEGORIES, RADIX_CATEGORIES, categoryName } from "@/lib/radix/categories";
import { priorityGaps, profileCompletion, scoreTone } from "@/lib/radix/scoring";
import { routeTree } from "@/routeTree.gen";
import { getActiveCandidate, loadProfile } from "@/services/profile-store";
import { talentCheckSync, skillMatchSync } from "@/services/radix-api";
import { simulateIntegrityCheck, SAMPLE_INTEGRITY_AUDITS, INTEGRITY_VECTORS } from "@/services/integrity-store";
import { lookupProvenance, SAMPLE_PROVENANCE_PROFILES } from "@/services/provenance-store";
import { loadDeveloperProfiles, PLATFORM_CONFIG } from "@/services/developer-profiles-store";
import { loadRoadmapState, toggleTaskCompleted, updateWeeklyHours } from "@/services/roadmap-store";
import { calibrateCandidateSkills, BENCHMARK_COMPANIES, BENCHMARK_ROLES } from "@/services/benchmark-store";
import { loadVaultResumes } from "@/services/vault-store";
import { loadApplications } from "@/services/applications-store";

describe("App routing", () => {
  const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

  it("matches a page for / (public landing page)", () => {
    const matches = router.matchRoutes("/");
    expect(matches.at(-1)?.routeId).toBe("/");
  });

  it("matches a page for /dashboard (application dashboard)", () => {
    const matches = router.matchRoutes("/dashboard");
    expect(matches.at(-1)?.routeId).toBe("/dashboard");
  });

  it("matches all core sub-application routes", () => {
    const coreRoutes = [
      "/jd-analytics",
      "/resume-parsing",
      "/profile",
      "/talent-check",
      "/skill-matching",
      "/history",
    ];

    for (const r of coreRoutes) {
      const matches = router.matchRoutes(r);
      expect(matches.at(-1)?.routeId).toBe(r);
    }
  });

  it("matches all 10 new CAIRN upgrade routes", () => {
    const routeChecks: { path: string; expectedId: string }[] = [
      { path: "/ats-integrity", expectedId: "/ats-integrity" },
      { path: "/provenance", expectedId: "/provenance" },
      { path: "/developer-profiles", expectedId: "/developer-profiles" },
      { path: "/roadmap", expectedId: "/roadmap" },
      { path: "/insights", expectedId: "/insights" },
      { path: "/me", expectedId: "/me/" },
      { path: "/me/resumes", expectedId: "/me/resumes" },
      { path: "/me/analyses", expectedId: "/me/analyses" },
      { path: "/me/applications", expectedId: "/me/applications" },
      { path: "/me/settings", expectedId: "/me/settings" },
    ];

    for (const { path, expectedId } of routeChecks) {
      const matches = router.matchRoutes(path);
      expect(matches.at(-1)?.routeId).toBe(expectedId);
    }
  });
});

describe("CAIRN Categories & Scoring Integrity", () => {
  it("preserves exactly the 12 official CAIRN skill dimensions", () => {
    const codes = CAIRN_CATEGORIES.map((c) => c.code);
    expect(codes).toEqual([
      "COD",
      "DSA",
      "OOD",
      "APTI",
      "COMM",
      "AI",
      "CLOUD",
      "SQL",
      "SWE",
      "SYSD",
      "NETW",
      "OS",
    ]);
    expect(CAIRN_CATEGORIES).toHaveLength(12);
    expect(RADIX_CATEGORIES).toEqual(CAIRN_CATEGORIES);

    for (const code of codes) {
      expect(categoryName(code)).toBeTruthy();
    }
  });

  it("executes deterministic talent check and skill match without errors", () => {
    const tc = talentCheckSync("my-profile", "Google LLC");
    expect(tc.readiness_score).toBeGreaterThan(0);
    expect(tc.skillset_gap).toHaveLength(12);

    const gaps = priorityGaps(tc);
    expect(Array.isArray(gaps)).toBe(true);

    const sm = skillMatchSync("my-profile", "g-swe");
    expect(sm.match_score).toBeGreaterThan(0);
    expect(Array.isArray(sm.matched_skills)).toBe(true);
    expect(Array.isArray(sm.missing_skills)).toBe(true);
  });

  it("calculates profile completion and score tone appropriately", () => {
    const profile = loadProfile();
    const comp = profileCompletion(profile);
    expect(comp).toBeGreaterThanOrEqual(0);
    expect(comp).toBeLessThanOrEqual(100);

    expect(scoreTone(85)).toBe("success");
    expect(scoreTone(65)).toBe("warning");
    expect(scoreTone(45)).toBe("destructive");
  });

  it("derives active candidate profile reliably", () => {
    const candidate = getActiveCandidate();
    expect(candidate.id).toBe("my-profile");
    expect(candidate.profile.name).toBeTruthy();
    expect(candidate.levels).toBeTruthy();
  });
});

describe("New Feature Services & Stores", () => {
  it("computes ATS integrity report with 6 diagnostic vectors", () => {
    expect(INTEGRITY_VECTORS).toHaveLength(6);
    expect(Object.keys(SAMPLE_INTEGRITY_AUDITS).length).toBeGreaterThanOrEqual(2);

    const audit = simulateIntegrityCheck("resume_eval.pdf", "Software Engineer");
    expect(audit.overallScore).toBeGreaterThanOrEqual(0);
    expect(audit.overallScore).toBeLessThanOrEqual(100);
    expect(audit.riskCategory).toBeDefined();
    expect(audit.vectorScores.hiddenText).toBeDefined();
    expect(audit.vectorScores.zeroWidth).toBeDefined();
    expect(audit.vectorScores.keywordStuffing).toBeDefined();
    expect(audit.vectorScores.verbatimJD).toBeDefined();
    expect(audit.vectorScores.unsupportedClaims).toBeDefined();
    expect(audit.vectorScores.documentParseability).toBeDefined();
  });

  it("generates GitHub provenance reports across 4 weighted dimensions", () => {
    expect(Object.keys(SAMPLE_PROVENANCE_PROFILES).length).toBeGreaterThanOrEqual(2);
    const rep = lookupProvenance("aarav-sharma");
    expect(rep.overallScore).toBeGreaterThanOrEqual(0);
    expect(rep.overallScore).toBeLessThanOrEqual(100);
    expect(rep.scoreBreakdown.claimSupport).toBeDefined();
    expect(rep.scoreBreakdown.repoStrength).toBeDefined();
    expect(rep.scoreBreakdown.activityConsistency).toBeDefined();
    expect(rep.scoreBreakdown.engineeringHygiene).toBeDefined();
    expect(rep.claims.length).toBeGreaterThan(0);
    expect(rep.repositories.length).toBeGreaterThan(0);
  });

  it("manages developer social profiles and platforms", () => {
    const profiles = loadDeveloperProfiles();
    expect(profiles.length).toBeGreaterThanOrEqual(3);
    const platforms = Object.keys(PLATFORM_CONFIG);
    expect(platforms.length).toBe(7);
  });

  it("structures 12-week roadmap curriculum", () => {
    const state = loadRoadmapState();
    expect(state.weeklyHours).toBeGreaterThanOrEqual(5);
    expect(state.tasks.length).toBeGreaterThanOrEqual(12);

    const updated = updateWeeklyHours(15);
    expect(updated.weeklyHours).toBe(15);
  });

  it("calibrates company benchmarks and calculates alignment", () => {
    expect(BENCHMARK_COMPANIES.length).toBeGreaterThanOrEqual(4);
    expect(BENCHMARK_ROLES.length).toBeGreaterThanOrEqual(4);

    const cand = getActiveCandidate().levels;
    const roleReq = BENCHMARK_ROLES[0]!.requiredLevels;
    const calibration = calibrateCandidateSkills(cand, roleReq);

    expect(calibration.overallAlignmentPercentage).toBeGreaterThanOrEqual(0);
    expect(calibration.nextBestSkills.length).toBeGreaterThanOrEqual(1);
    expect(calibration.gaps).toHaveLength(12);
  });

  it("reads resume vault and application pipeline stores", () => {
    const resumes = loadVaultResumes();
    expect(resumes.length).toBeGreaterThanOrEqual(1);
    expect(resumes.some((r) => r.isPrimary)).toBe(true);

    const apps = loadApplications();
    expect(apps.length).toBeGreaterThanOrEqual(3);
    expect(["saved", "applied", "interview", "offer", "rejected"]).toContain(apps[0]!.stage);
  });
});
