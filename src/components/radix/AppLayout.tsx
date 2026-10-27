import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  FileSearch,
  FileText,
  GitCompareArrows,
  History,
  LayoutDashboard,
  Menu,
  Radar,
  UserRound,
  X,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { CairnMark } from "@/components/radix/CairnMark";
import { AppFooter } from "@/components/radix/Footers";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { loadHistory, subscribeHistory } from "@/services/history-store";
import { loadProfile, subscribeProfile } from "@/services/profile-store";

export const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/jd-analytics", label: "JD Analytics", icon: FileSearch },
  { to: "/resume-parsing", label: "Resume Parsing", icon: FileText },
  { to: "/profile", label: "Profile Builder", icon: UserRound },
  { to: "/talent-check", label: "Talent Check", icon: Radar },
  { to: "/skill-matching", label: "Skill Matching", icon: GitCompareArrows },
  { to: "/history", label: "Analysis History", icon: History },
] as const;

/* ─── Logo ─── */
function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3 group" title="Return to Public Landing Page">
      <CairnMark className="size-9" />
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
  );
}

/* ─── Nav list ─── */
function NavList({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="mt-8 space-y-1" aria-label="Main Navigation">
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = path === to || (to !== "/dashboard" && path.startsWith(to));

        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-150 relative",
            )}
            style={{
              background: active ? "rgba(201,205,208,0.07)" : "transparent",
              color: active ? "#DCDCE0" : "#85858E",
              border: active ? "1px solid rgba(201,205,208,0.15)" : "1px solid transparent",
            }}
            onMouseEnter={(e) => {
              if (!active) {
                e.currentTarget.style.background = "rgba(201,205,208,0.04)";
                e.currentTarget.style.color = "#BDBDC3";
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#85858E";
              }
            }}
          >
            {/* Active indicator */}
            {active && (
              <span
                className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                style={{ background: "#C4A574" }}
              />
            )}
            <Icon
              className="size-4 transition-colors"
              style={{ color: active ? "#C4A574" : "#85858E" }}
            />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

/* ─── Sidebar body ─── */
function SidebarBody({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  return (
    <div className="flex h-full flex-col p-5">
      <Logo />
      <NavList onNavigate={onNavigate} />
      <div
        className="mt-auto space-y-3 pt-6 border-t"
        style={{ borderColor: "rgba(201,205,208,0.08)" }}
      >
        <Link
          to="/"
          onClick={onNavigate}
          className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all"
          style={{
            background: "rgba(201,205,208,0.04)",
            border: "1px solid rgba(201,205,208,0.1)",
            color: "#85858E",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#BDBDC3";
            e.currentTarget.style.background = "rgba(201,205,208,0.07)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#85858E";
            e.currentTarget.style.background = "rgba(201,205,208,0.04)";
          }}
        >
          <span>← Public Overview</span>
        </Link>
        <div
          className="rounded-xl p-3.5 text-xs space-y-1"
          style={{
            background: "rgba(54,214,126,0.05)",
            border: "1px solid rgba(54,214,126,0.12)",
          }}
        >
          <p className="font-semibold" style={{ color: "#36D67E" }}>
            Deterministic Engine
          </p>
          <p className="text-[11px] leading-relaxed" style={{ color: "#85858E" }}>
            All evaluations run on-device. No data leaves your browser.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── AppLayout ─── */
export function AppLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [candidateName, setCandidateName] = useState("Candidate");
  const [initials, setInitials] = useState("CP");
  const [recentRuns, setRecentRuns] = useState(() => loadHistory().slice(0, 3));
  const path = useRouterState({ select: (s) => s.location.pathname });
  const current = NAV.find((n) =>
    n.to === "/dashboard" ? path === "/dashboard" : path.startsWith(n.to),
  );

  useEffect(() => {
    const update = () => {
      const p = loadProfile();
      const name = p.name.trim() || "Candidate";
      setCandidateName(name);
      const parts = name.split(/\s+/).filter(Boolean);
      const init =
        parts.length >= 2
          ? `${parts[0]![0]}${parts[1]![0]}`.toUpperCase()
          : name.slice(0, 2).toUpperCase();
      setInitials(init || "CP");
    };
    update();
    return subscribeProfile(update);
  }, []);

  useEffect(() => {
    const updateHistory = () => setRecentRuns(loadHistory().slice(0, 3));
    updateHistory();
    return subscribeHistory(updateHistory);
  }, []);

  return (
    <div className="flex min-h-screen flex-col lg:pl-64" style={{ background: "#050507" }}>
      {/* ── Desktop sidebar ── */}
      <aside
        className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block"
        style={{
          background: "#0A0A0D",
          borderRight: "1px solid rgba(201,205,208,0.1)",
          boxShadow: "1px 0 0 rgba(201,205,208,0.04)",
        }}
      >
        <SidebarBody />
      </aside>

      {/* ── Mobile drawer ── */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0"
            style={{ background: "rgba(5,5,7,0.7)", backdropFilter: "blur(8px)" }}
            onClick={() => setOpen(false)}
          />
          <aside
            className="absolute inset-y-0 left-0 w-72 animate-in slide-in-from-left duration-200"
            style={{
              background: "#0A0A0D",
              borderRight: "1px solid rgba(201,205,208,0.12)",
            }}
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute right-4 top-4 rounded-lg p-2 transition-colors"
              style={{ color: "#85858E" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#DCDCE0")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#85858E")}
            >
              <X className="size-5" />
            </button>
            <SidebarBody onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      {/* ── Top header ── */}
      <header
        className="sticky top-0 z-20 flex h-16 items-center gap-3 px-4 sm:px-8"
        style={{
          background: "rgba(5,5,7,0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(201,205,208,0.1)",
          boxShadow: "0 1px 0 rgba(201,205,208,0.04) inset",
        }}
      >
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg p-2 transition-colors lg:hidden"
          aria-label="Open menu"
          style={{ color: "#85858E" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#DCDCE0")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#85858E")}
        >
          <Menu className="size-5" />
        </button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-wider">
          <Link
            to="/"
            className="hidden sm:inline transition-colors"
            style={{ color: "#85858E" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#BDBDC3")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#85858E")}
          >
            CAIRN
          </Link>
          <span className="hidden sm:inline" style={{ color: "rgba(201,205,208,0.2)" }}>
            /
          </span>
          <span className="font-semibold" style={{ color: "#DCDCE0" }}>
            {current?.label ?? "Workspace"}
          </span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          {/* Activity bell */}
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="relative rounded-xl p-2 transition-all"
                aria-label="Activity & Notifications"
                style={{
                  background: "rgba(201,205,208,0.05)",
                  border: "1px solid rgba(201,205,208,0.12)",
                  color: "#85858E",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#DCDCE0";
                  e.currentTarget.style.borderColor = "rgba(201,205,208,0.22)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#85858E";
                  e.currentTarget.style.borderColor = "rgba(201,205,208,0.12)";
                }}
              >
                <Bell className="size-4" />
                {recentRuns.length > 0 && (
                  <span
                    className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full"
                    style={{ background: "#C4A574" }}
                  />
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-80 rounded-2xl p-5"
              style={{
                background: "#17171B",
                border: "1px solid rgba(201,205,208,0.15)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
              }}
            >
              <div
                className="mb-3.5 flex items-center justify-between border-b pb-2.5"
                style={{ borderColor: "rgba(201,205,208,0.1)" }}
              >
                <span
                  className="font-display text-xs font-bold uppercase tracking-wider"
                  style={{ color: "#DCDCE0" }}
                >
                  Recent Activity
                </span>
                <span
                  className="flex items-center gap-1 font-mono text-[10px] font-semibold"
                  style={{ color: "#36D67E" }}
                >
                  <CheckCircle2 className="size-3" /> System Ready
                </span>
              </div>
              {recentRuns.length === 0 ? (
                <p className="text-xs" style={{ color: "#85858E" }}>
                  No recent analysis runs recorded yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {recentRuns.map((r) => (
                    <Link
                      key={r.id}
                      to={r.type === "talent_check" ? "/talent-check" : "/skill-matching"}
                      className="block rounded-xl p-2.5 transition-all"
                      style={{
                        background: "rgba(201,205,208,0.04)",
                        border: "1px solid rgba(201,205,208,0.1)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(201,205,208,0.07)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(201,205,208,0.04)";
                      }}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold" style={{ color: "#DCDCE0" }}>
                          {r.company}
                        </span>
                        <span className="font-mono font-bold" style={{ color: "#C4A574" }}>
                          {r.score ?? "—"}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-[11px]" style={{ color: "#85858E" }}>
                        {r.type === "talent_check" ? "Talent Check" : "Skill Match"} · {r.date}
                      </p>
                    </Link>
                  ))}
                  <div className="pt-2 text-center">
                    <Link
                      to="/history"
                      className="text-xs font-semibold transition-colors"
                      style={{ color: "#85858E" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#C4A574")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#85858E")}
                    >
                      View all history →
                    </Link>
                  </div>
                </div>
              )}
            </PopoverContent>
          </Popover>

          {/* Profile chip */}
          <Link
            to="/profile"
            className="flex items-center gap-2.5 rounded-xl py-1 pl-1 pr-3 transition-all"
            title="Edit Candidate Profile"
            style={{
              background: "rgba(201,205,208,0.05)",
              border: "1px solid rgba(201,205,208,0.12)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(201,205,208,0.22)";
              e.currentTarget.style.background = "rgba(201,205,208,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(201,205,208,0.12)";
              e.currentTarget.style.background = "rgba(201,205,208,0.05)";
            }}
          >
            <span
              className="grid size-7 place-items-center rounded-lg font-display text-xs font-bold"
              style={{
                background: "rgba(196,165,116,0.12)",
                border: "1px solid rgba(196,165,116,0.25)",
                color: "#C4A574",
              }}
            >
              {initials}
            </span>
            <span
              className="hidden max-w-[130px] truncate text-xs font-semibold sm:inline"
              style={{ color: "#DCDCE0" }}
            >
              {candidateName}
            </span>
          </Link>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-8 sm:py-10 animate-in fade-in duration-200">
        {children}
      </main>

      <AppFooter className="mt-auto" />
    </div>
  );
}
