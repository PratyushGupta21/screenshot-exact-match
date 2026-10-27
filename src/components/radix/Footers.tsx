import { Link } from "@tanstack/react-router";
import { ArrowUpRight, CheckCircle2, Mail, Send } from "lucide-react";
import { useState } from "react";
import { CairnMark } from "@/components/radix/CairnMark";

/* ─── Public Footer ─── */
export function PublicFooter() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmed) {
      setNewsletterStatus("error");
      setErrorMessage("Please enter an email address.");
      return;
    }
    if (!emailRegex.test(trimmed)) {
      setNewsletterStatus("error");
      setErrorMessage("Please provide a valid email format (name@example.com).");
      return;
    }
    setNewsletterStatus("success");
    setErrorMessage("");
    setEmail("");
  };

  return (
    <footer
      className="relative overflow-hidden"
      aria-label="Public Footer"
      style={{
        background: "#0A0A0D",
        borderTop: "1px solid rgba(201,205,208,0.1)",
      }}
    >
      {/* Subtle top glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(196,165,116,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand + Newsletter (span 5) */}
          <div className="space-y-6 lg:col-span-5">
            {/* Wordmark */}
            <Link
              to="/"
              className="inline-flex items-center gap-3 group"
              title="Return to Public Homepage"
            >
              <CairnMark className="size-9" />
              <span className="leading-tight">
                <span
                  className="block font-display text-lg font-bold tracking-tight"
                  style={{ color: "#DCDCE0", letterSpacing: "-0.03em" }}
                >
                  CAIRN
                </span>
                <span
                  className="block font-mono text-[9px] uppercase tracking-[0.18em]"
                  style={{ color: "#C4A574" }}
                >
                  Talent Intelligence
                </span>
              </span>
            </Link>

            <p className="max-w-md text-sm leading-relaxed" style={{ color: "#85858E" }}>
              A precision talent intelligence platform for modern engineering hiring bars. Map
              candidate readiness across 12 verified competencies and benchmark against genuine role
              expectations.
            </p>

            {/* Newsletter */}
            <div
              className="rounded-2xl p-5 space-y-3"
              style={{
                background: "rgba(201,205,208,0.04)",
                border: "1px solid rgba(201,205,208,0.12)",
              }}
            >
              <div
                className="flex items-center gap-2 text-xs font-semibold"
                style={{ color: "#DCDCE0" }}
              >
                <Mail className="size-3.5" style={{ color: "#C4A574" }} />
                <span>Receive Technical Hiring Insights</span>
              </div>
              <p className="text-xs" style={{ color: "#85858E" }}>
                Quarterly technical benchmark briefs covering algorithmic, systems, and cloud
                evaluation standards.
              </p>

              {newsletterStatus === "success" ? (
                <div
                  className="rounded-xl p-3.5 text-xs space-y-1"
                  style={{
                    background: "rgba(54,214,126,0.07)",
                    border: "1px solid rgba(54,214,126,0.2)",
                  }}
                >
                  <div
                    className="flex items-center gap-2 font-semibold"
                    style={{ color: "#36D67E" }}
                  >
                    <CheckCircle2 className="size-4" />
                    <span>Demo Subscription Confirmed</span>
                  </div>
                  <p className="text-[11px]" style={{ color: "#85858E" }}>
                    Recorded in your local session. In production this registers your inbox for
                    quarterly benchmark briefs.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (newsletterStatus === "error") setNewsletterStatus("idle");
                      }}
                      placeholder="engineer@domain.com"
                      aria-label="Email address for engineering updates"
                      className="w-full rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                      style={{
                        background: "rgba(201,205,208,0.06)",
                        border: "1px solid rgba(201,205,208,0.15)",
                        color: "#F4F4F5",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "rgba(196,165,116,0.5)";
                        e.currentTarget.style.boxShadow = "0 0 0 1px rgba(196,165,116,0.2)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "rgba(201,205,208,0.15)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                    <button
                      type="submit"
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all"
                      style={{ background: "#C4A574", color: "#050507" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#B39362")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#C4A574")}
                    >
                      <span>Join</span>
                      <Send className="size-3" />
                    </button>
                  </div>
                  {newsletterStatus === "error" && (
                    <p className="text-[11px] font-medium" style={{ color: "#E05252" }}>
                      {errorMessage}
                    </p>
                  )}
                </form>
              )}
            </div>

            <div
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs"
              style={{
                background: "rgba(54,214,126,0.06)",
                border: "1px solid rgba(54,214,126,0.15)",
                color: "#85858E",
              }}
            >
              <span className="size-1.5 rounded-full" style={{ background: "#36D67E" }} />
              <span className="font-mono text-[11px]">Deterministic Client Analysis Engine</span>
            </div>
          </div>

          {/* Platform Modules (span 3) */}
          <div className="lg:col-span-3 lg:col-start-7">
            <h3
              className="font-mono text-xs font-semibold uppercase tracking-widest"
              style={{ color: "#C4A574" }}
            >
              Platform Modules
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs">
              {[
                { to: "/dashboard", label: "Application Dashboard" },
                { to: "/jd-analytics", label: "Job Description Analytics" },
                { to: "/resume-parsing", label: "Resume Parsing Studio" },
                { to: "/profile" as const, label: "Candidate Profile Builder" },
                { to: "/talent-check" as const, label: "Talent Readiness Check" },
                { to: "/skill-matching" as const, label: "Skill Alignment Matcher" },
                { to: "/history" as const, label: "Analysis Run History" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="flex items-center justify-between group transition-colors"
                    style={{ color: "#85858E" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#DCDCE0")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#85858E")}
                  >
                    <span>{label}</span>
                    <ArrowUpRight
                      className="size-3 transition-opacity group-hover:opacity-100 opacity-0"
                      style={{ color: "#C4A574" }}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Skill Dimensions (span 3) */}
          <div className="lg:col-span-3">
            <h3
              className="font-mono text-xs font-semibold uppercase tracking-widest"
              style={{ color: "#C4A574" }}
            >
              Skill Dimensions
            </h3>
            <div className="mt-4 flex flex-wrap gap-1.5 font-mono text-[11px]">
              {[
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
              ].map((c) => (
                <span
                  key={c}
                  className="rounded-md px-2 py-0.5"
                  style={{
                    background: "rgba(201,205,208,0.06)",
                    border: "1px solid rgba(201,205,208,0.12)",
                    color: "#85858E",
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
            <div
              className="mt-6 rounded-xl p-4 text-xs space-y-1.5"
              style={{
                background: "rgba(201,205,208,0.04)",
                border: "1px solid rgba(201,205,208,0.1)",
              }}
            >
              <p className="font-semibold" style={{ color: "#DCDCE0" }}>
                Standardized Taxonomy
              </p>
              <p className="text-[11px] leading-relaxed" style={{ color: "#85858E" }}>
                Mapped against Tier-1 tech industry hiring bars with zero arbitrary metrics.
              </p>
            </div>
          </div>
        </div>

        {/* Giant watermark */}
        <div
          className="relative mt-20 select-none overflow-hidden border-t pt-8 pb-4"
          style={{ borderColor: "rgba(201,205,208,0.06)" }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none text-center font-display font-black leading-none tracking-tighter"
            style={{
              fontSize: "clamp(4rem, 16vw, 14rem)",
              color: "rgba(201,205,208,0.025)",
              letterSpacing: "-0.05em",
            }}
          >
            CAIRN
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-4 flex flex-col items-center justify-between gap-4 border-t pt-8 text-xs sm:flex-row"
          style={{ borderColor: "rgba(201,205,208,0.08)", color: "#85858E" }}
        >
          <p>© {currentYear} CAIRN Talent Intelligence. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a
              href="/#product"
              className="transition-colors"
              style={{ color: "#85858E" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#DCDCE0")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#85858E")}
            >
              Product Overview
            </a>
            <a
              href="/#how-it-works"
              className="transition-colors"
              style={{ color: "#85858E" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#DCDCE0")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#85858E")}
            >
              Methodology
            </a>
            <Link
              to="/dashboard"
              className="font-semibold transition-colors"
              style={{ color: "#C4A574" }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
            >
              Enter Workspace →
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── App Footer (compact) ─── */
export function AppFooter({ className = "" }: { className?: string }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`py-6 text-xs ${className}`}
      aria-label="Application Footer"
      style={{
        background: "#0A0A0D",
        borderTop: "1px solid rgba(201,205,208,0.08)",
        color: "#85858E",
      }}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-8">
        <div className="flex items-center gap-3">
          <span
            className="font-display font-bold tracking-tight"
            style={{ color: "#DCDCE0", letterSpacing: "-0.02em" }}
          >
            CAIRN
          </span>
          <span style={{ color: "rgba(201,205,208,0.2)" }}>·</span>
          <span>Talent Intelligence Workspace</span>
          <span style={{ color: "rgba(201,205,208,0.2)" }}>·</span>
          <span className="font-mono text-[11px]" style={{ color: "#C4A574" }}>
            v1.2
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 font-medium">
          {[
            { to: "/" as const, label: "Public Overview" },
            { to: "/dashboard" as const, label: "Dashboard" },
            { to: "/jd-analytics" as const, label: "JD Analytics" },
            { to: "/resume-parsing" as const, label: "Resume Parsing" },
            { to: "/talent-check" as const, label: "Talent Check" },
            { to: "/skill-matching" as const, label: "Skill Matching" },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="transition-colors"
              style={{ color: "#85858E" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#BDBDC3")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#85858E")}
            >
              {label}
            </Link>
          ))}
        </div>

        <p className="text-[11px]" style={{ color: "#85858E" }}>
          © {currentYear} CAIRN Talent Intelligence
        </p>
      </div>
    </footer>
  );
}
