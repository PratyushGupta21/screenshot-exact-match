import { Link } from "@tanstack/react-router";
import { ArrowRight, LayoutDashboard, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { CairnMark } from "@/components/radix/CairnMark";

export function PublicNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  const navLinks = [
    { href: "/#product", label: "Product" },
    { href: "/#how-it-works", label: "How It Works" },
    { href: "/#categories", label: "Skill Categories" },
  ];

  return (
    <header
      className="sticky top-0 z-40 w-full transition-all duration-300"
      style={{
        background: scrolled ? "rgba(5,5,7,0.92)" : "rgba(5,5,7,0.75)",
        backdropFilter: "blur(20px) saturate(1.4)",
        WebkitBackdropFilter: "blur(20px) saturate(1.4)",
        borderBottom: scrolled
          ? "1px solid rgba(201,205,208,0.12)"
          : "1px solid rgba(201,205,208,0.06)",
        boxShadow: scrolled
          ? "0 1px 0 rgba(201,205,208,0.05) inset, 0 4px 20px -4px rgba(0,0,0,0.5)"
          : "none",
      }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
        {/* Wordmark */}
        <Link
          to="/"
          className="flex items-center gap-3 group"
          aria-label="CAIRN Talent Intelligence — Home"
        >
          {/* Geometric mark */}
          <CairnMark className="size-8" />
          <span className="leading-tight">
            <span
              className="block font-display text-base font-bold tracking-tight"
              style={{ color: "#DCDCE0", letterSpacing: "-0.03em" }}
            >
              CAIRN
            </span>
            <span
              className="block font-mono text-[9px] uppercase tracking-[0.18em]"
              style={{ color: "#85858E" }}
            >
              Talent Intelligence
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Public Navigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs font-semibold uppercase tracking-wider transition-colors hover:text-frost-white"
              style={{ color: "#85858E" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#DCDCE0")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#85858E")}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-3 sm:flex">
          <Link
            to="/talent-check"
            search={{ company: "Google LLC" }}
            className="text-xs font-medium transition-colors"
            style={{ color: "#85858E" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#DCDCE0")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#85858E")}
          >
            Sample Hiring Bar
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all hover:scale-[1.02]"
            style={{
              background: "linear-gradient(135deg, #24242A 0%, #1A1A1F 100%)",
              border: "1px solid rgba(201,205,208,0.22)",
              color: "#DCDCE0",
              boxShadow: "inset 0 1px 0 rgba(220,220,224,0.08), 0 2px 8px rgba(0,0,0,0.4)",
            }}
          >
            <LayoutDashboard className="size-3.5" style={{ color: "#C4A574" }} />
            <span>Explore RADIX</span>
            <ArrowRight className="size-3" style={{ color: "#85858E" }} />
          </Link>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 sm:hidden">
          <Link
            to="/dashboard"
            className="rounded-lg px-3 py-1.5 text-xs font-semibold transition-all"
            style={{
              background: "#24242A",
              border: "1px solid rgba(201,205,208,0.18)",
              color: "#DCDCE0",
            }}
          >
            Dashboard
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="rounded-lg p-2 transition-colors"
            style={{
              background: "rgba(201,205,208,0.05)",
              border: "1px solid rgba(201,205,208,0.15)",
              color: "#BDBDC3",
            }}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="md:hidden animate-in slide-in-from-top-2 duration-200"
          style={{
            background: "rgba(5,5,7,0.97)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(201,205,208,0.12)",
          }}
        >
          <nav className="space-y-1 px-4 py-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-semibold transition-colors"
                style={{ color: "#BDBDC3" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#DCDCE0";
                  e.currentTarget.style.background = "rgba(201,205,208,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#BDBDC3";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {link.label}
              </a>
            ))}
            <div
              className="pt-4 border-t space-y-2"
              style={{ borderColor: "rgba(201,205,208,0.1)" }}
            >
              <Link
                to="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all"
                style={{
                  background: "#DCDCE0",
                  color: "#050507",
                }}
              >
                <LayoutDashboard className="size-4" />
                Explore CAIRN
                <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/talent-check"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center rounded-xl px-4 py-2.5 text-xs font-medium transition-all"
                style={{
                  background: "rgba(201,205,208,0.06)",
                  border: "1px solid rgba(201,205,208,0.15)",
                  color: "#85858E",
                }}
              >
                Inspect Sample Hiring Bar
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
