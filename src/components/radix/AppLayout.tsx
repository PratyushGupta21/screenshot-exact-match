import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell, FileSearch, FileText, GitCompareArrows, History, LayoutDashboard, Menu, Radar, UserRound, X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/jd-analytics", label: "JD Analytics", icon: FileSearch },
  { to: "/resume-parsing", label: "Resume Parsing", icon: FileText },
  { to: "/profile", label: "Profile Builder", icon: UserRound },
  { to: "/talent-check", label: "Talent Check", icon: Radar },
  { to: "/skill-matching", label: "Skill Matching", icon: GitCompareArrows },
  { to: "/history", label: "Analysis History", icon: History },
] as const;

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-lg border-2 border-sidebar-primary-foreground bg-primary font-display text-lg font-bold text-primary-foreground shadow-brut-primary">
        R
      </span>
      <span className="leading-tight">
        <span className="block font-display text-base font-bold tracking-tight text-sidebar-accent-foreground">RADIX</span>
        <span className="block font-mono text-[10px] uppercase tracking-widest text-sidebar-foreground">Talent Match</span>
      </span>
    </Link>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="mt-8 space-y-1" aria-label="Main">
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = to === "/" ? path === "/" : path.startsWith(to);
        return (
          <Link
            key={to} to={to} onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-brut-sm"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <Icon className="size-[18px]" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col p-5">
      <Logo />
      <NavList onNavigate={onNavigate} />
      <div className="mt-auto rounded-lg border border-sidebar-border bg-sidebar-accent p-3 text-xs text-sidebar-foreground">
        <p className="font-semibold text-sidebar-accent-foreground">Demo mode</p>
        <p className="mt-1">All results use illustrative sample data until the backend is connected.</p>
      </div>
    </div>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const current = NAV.find((n) => (n.to === "/" ? path === "/" : path.startsWith(n.to)));

  return (
    <div className="min-h-screen lg:pl-64">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-sidebar lg:block">
        <SidebarBody />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-sidebar animate-in slide-in-from-left">
            <button onClick={() => setOpen(false)} aria-label="Close menu"
              className="absolute right-3 top-5 rounded-md p-1.5 text-sidebar-foreground hover:bg-sidebar-accent">
              <X className="size-5" />
            </button>
            <SidebarBody onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b-2 border-ink bg-background/90 px-4 backdrop-blur sm:px-8">
        <button onClick={() => setOpen(true)} className="rounded-md p-2 hover:bg-muted lg:hidden" aria-label="Open menu">
          <Menu className="size-5" />
        </button>
        <div className="flex items-center gap-2 text-sm">
          <span className="hidden text-muted-foreground sm:inline">RADIX</span>
          <span className="hidden text-muted-foreground sm:inline">/</span>
          <span className="font-semibold">{current?.label ?? "Page"}</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="relative rounded-md p-2 hover:bg-muted" aria-label="Notifications">
            <Bell className="size-5" />
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive" />
          </button>
          <Link to="/profile" className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 hover:bg-muted">
            <span className="grid size-8 place-items-center rounded-md brut-sm bg-warning font-display text-sm font-bold text-warning-foreground">AS</span>
            <span className="hidden text-sm font-medium sm:inline">Aarav S.</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-10">{children}</main>
    </div>
  );
}
