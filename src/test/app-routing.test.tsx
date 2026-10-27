import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { CAIRN_CATEGORIES, RADIX_CATEGORIES, categoryName } from "@/lib/radix/categories";
import { priorityGaps, profileCompletion, scoreTone } from "@/lib/radix/scoring";
import { routeTree } from "@/routeTree.gen";
import { getActiveCandidate, loadProfile } from "@/services/profile-store";
import { talentCheckSync, skillMatchSync } from "@/services/radix-api";

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

  it("matches all 6 sub-application routes", () => {
    const routes = [
      "/jd-analytics",
      "/resume-parsing",
      "/profile",
      "/talent-check",
      "/skill-matching",
      "/history",
    ];

    for (const r of routes) {
      const matches = router.matchRoutes(r);
      expect(matches.at(-1)?.routeId).toBe(r);
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
