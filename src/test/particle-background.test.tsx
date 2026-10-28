import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { QueryClient } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";
import { ParticleCloudBackground } from "@/components/radix/ParticleCloudBackground";

describe("AXON Particle Cloud Background & GlassHero Integration", () => {
  it("renders ParticleCloudBackground cleanly without crashing in test environment", () => {
    const { container } = render(<ParticleCloudBackground />);
    expect(container).toBeDefined();
    const el = container.firstChild as HTMLElement;
    expect(el).toBeTruthy();
    expect(el.style.backgroundColor).toBe("rgb(0, 0, 0)");
  });

  it("ensures landing page Hero uses pure black #000000 background", async () => {
    const queryClient = new QueryClient();
    const router = createRouter({ routeTree, context: { queryClient } });
    await router.load();

    const { container } = render(<RouterProvider router={router} />);
    const heroSection = container.querySelector('section[aria-label="Hero"]');
    expect(heroSection).toBeTruthy();
    const heroDiv = heroSection?.firstElementChild as HTMLElement;
    expect(heroDiv).toBeTruthy();
    expect(heroDiv.style.backgroundColor).toBe("rgb(0, 0, 0)");
  });

  it("verifies no glass video elements exist on the landing page", async () => {
    const queryClient = new QueryClient();
    const router = createRouter({ routeTree, context: { queryClient } });
    await router.load();

    const { container } = render(<RouterProvider router={router} />);
    const videos = container.querySelectorAll("video");
    expect(videos.length).toBe(0);

    const html = container.innerHTML;
    expect(html).not.toContain("facet-glass-hero.mp4");
    expect(html).not.toContain("oraciteslArea.mp4");
    expect(html).not.toContain("stellarmind-hero.mp4");
    expect(html).not.toContain("thedropthroughArea.mp4");
  });

  it("verifies all CAIRN hero interactive buttons, links, and content remain intact", async () => {
    const queryClient = new QueryClient();
    const router = createRouter({ routeTree, context: { queryClient } });
    await router.load();

    const { getAllByText, getByText } = render(<RouterProvider router={router} />);

    expect(getAllByText("Talent Intelligence Platform").length).toBeGreaterThan(0);
    expect(getByText("See skills.")).toBeDefined();
    expect(getByText("Reveal potential.")).toBeDefined();
    expect(getAllByText("Explore CAIRN").length).toBeGreaterThan(0);
    expect(getByText("Explore how CAIRN works")).toBeDefined();
    expect(getAllByText("Readiness Index").length).toBeGreaterThan(0);
    expect(getAllByText("Skill Dimensions").length).toBeGreaterThan(0);
  });
});
