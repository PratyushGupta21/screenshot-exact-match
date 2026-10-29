// Developer Profiles & Competitive Programming Store
// Manages linked social profiles and competitive coding metrics.
// Persists to localStorage with event-based subscription.

export type ProfilePlatform =
  | "github"
  | "leetcode"
  | "codeforces"
  | "codechef"
  | "hackerrank"
  | "kaggle"
  | "linkedin";

export interface DeveloperProfileItem {
  id: string;
  platform: ProfilePlatform;
  username: string;
  url: string;
  isVerified: boolean;
  status: "verified" | "sample_metrics" | "linked_only";
  addedAt: string;
  stats?: {
    primaryMetric: string;
    secondaryMetric?: string;
    detail1?: string;
    detail2?: string;
    rankBadge?: string;
    breakdown?: { label: string; value: number | string; max?: number }[];
  };
}

const STORAGE_KEY = "cairn.developer_profiles.v1";
const EVENT_NAME = "cairn:developer-profiles-updated";

export const PLATFORM_CONFIG: Record<
  ProfilePlatform,
  {
    name: string;
    baseUrl: string;
    color: string;
    defaultMetricLabel: string;
  }
> = {
  github: {
    name: "GitHub",
    baseUrl: "https://github.com/",
    color: "#DCDCE0",
    defaultMetricLabel: "Public Repos & Stars",
  },
  leetcode: {
    name: "LeetCode",
    baseUrl: "https://leetcode.com/",
    color: "#FFA116",
    defaultMetricLabel: "Problems Solved",
  },
  codeforces: {
    name: "Codeforces",
    baseUrl: "https://codeforces.com/profile/",
    color: "#1890FF",
    defaultMetricLabel: "Contest Rating",
  },
  codechef: {
    name: "CodeChef",
    baseUrl: "https://www.codechef.com/users/",
    color: "#5B4638",
    defaultMetricLabel: "Star Rating",
  },
  hackerrank: {
    name: "HackerRank",
    baseUrl: "https://www.hackerrank.com/",
    color: "#00EA64",
    defaultMetricLabel: "Badges & Stars",
  },
  kaggle: {
    name: "Kaggle",
    baseUrl: "https://www.kaggle.com/",
    color: "#20BEFF",
    defaultMetricLabel: "Competitions / Notebooks",
  },
  linkedin: {
    name: "LinkedIn",
    baseUrl: "https://www.linkedin.com/in/",
    color: "#0A66C2",
    defaultMetricLabel: "Profile Link",
  },
};

const DEFAULT_PROFILES: DeveloperProfileItem[] = [
  {
    id: "dp-1",
    platform: "github",
    username: "aarav-sharma",
    url: "https://github.com/aarav-sharma",
    isVerified: true,
    status: "sample_metrics",
    addedAt: "2026-09-15",
    stats: {
      primaryMetric: "14 Repositories",
      secondaryMetric: "48 Stars Received",
      detail1: "3.2 years active",
      detail2: "54% Python · 22% Go",
      rankBadge: "Active Contributor",
      breakdown: [
        { label: "Public Repos", value: 14 },
        { label: "Total Stars", value: 48 },
        { label: "Followers", value: 32 },
      ],
    },
  },
  {
    id: "dp-2",
    platform: "leetcode",
    username: "aarav_coder",
    url: "https://leetcode.com/aarav_coder",
    isVerified: true,
    status: "sample_metrics",
    addedAt: "2026-09-18",
    stats: {
      primaryMetric: "342 / 3,200 Solved",
      secondaryMetric: "Contest Rating 1,845",
      detail1: "Top 7.2% globally",
      detail2: "Knight badge rank",
      rankBadge: "Knight",
      breakdown: [
        { label: "Easy", value: 120, max: 800 },
        { label: "Medium", value: 185, max: 1700 },
        { label: "Hard", value: 37, max: 700 },
      ],
    },
  },
  {
    id: "dp-3",
    platform: "codeforces",
    username: "aarav_s",
    url: "https://codeforces.com/profile/aarav_s",
    isVerified: false,
    status: "sample_metrics",
    addedAt: "2026-10-02",
    stats: {
      primaryMetric: "Rating 1,624",
      secondaryMetric: "Max Rating 1,698",
      detail1: "Expert rank title",
      detail2: "32 rated contests",
      rankBadge: "Expert",
      breakdown: [
        { label: "Current Rating", value: 1624 },
        { label: "Max Rating", value: 1698 },
        { label: "Contests", value: 32 },
      ],
    },
  },
  {
    id: "dp-4",
    platform: "linkedin",
    username: "aarav-sharma-swe",
    url: "https://www.linkedin.com/in/aarav-sharma-swe",
    isVerified: false,
    status: "linked_only",
    addedAt: "2026-10-05",
    stats: {
      primaryMetric: "Profile Linked",
      secondaryMetric: "500+ Connections",
      detail1: "Verified identity badge",
      detail2: "Public bio indexed",
    },
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

export function loadDeveloperProfiles(): DeveloperProfileItem[] {
  try {
    const raw = safeGetItem(STORAGE_KEY);
    if (!raw) {
      safeSetItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROFILES));
      return DEFAULT_PROFILES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_PROFILES;
  } catch {
    return DEFAULT_PROFILES;
  }
}

export function saveDeveloperProfiles(profiles: DeveloperProfileItem[]) {
  safeSetItem(STORAGE_KEY, JSON.stringify(profiles));
  if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
    try {
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: profiles }));
    } catch {}
  }
}

export function addDeveloperProfile(
  platform: ProfilePlatform,
  usernameOrUrl: string,
): DeveloperProfileItem {
  const current = loadDeveloperProfiles();
  const config = PLATFORM_CONFIG[platform];

  let username = usernameOrUrl.trim();
  let url = usernameOrUrl.trim();

  if (url.startsWith("http://") || url.startsWith("https://")) {
    const parts = url.split("/").filter(Boolean);
    username = parts[parts.length - 1] || "user";
  } else {
    url = `${config.baseUrl}${username.replace(/^@/, "")}`;
    username = username.replace(/^@/, "");
  }

  // Generate deterministic mock statistics for newly linked accounts
  const newProfile: DeveloperProfileItem = {
    id: `dp-${Date.now()}`,
    platform,
    username,
    url,
    isVerified: false,
    status: platform === "linkedin" ? "linked_only" : "sample_metrics",
    addedAt: new Date().toISOString().split("T")[0]!,
    stats: generateSampleStats(platform, username),
  };

  const updated = [newProfile, ...current];
  saveDeveloperProfiles(updated);
  return newProfile;
}

export function removeDeveloperProfile(id: string) {
  const current = loadDeveloperProfiles();
  const updated = current.filter((p) => p.id !== id);
  saveDeveloperProfiles(updated);
}

export function updateDeveloperProfile(id: string, updates: Partial<DeveloperProfileItem>) {
  const current = loadDeveloperProfiles();
  const updated = current.map((p) => (p.id === id ? { ...p, ...updates } : p));
  saveDeveloperProfiles(updated);
}

export function resetDeveloperProfiles() {
  saveDeveloperProfiles(DEFAULT_PROFILES);
}

export function subscribeDeveloperProfiles(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener("storage", handler);
  };
}

function generateSampleStats(platform: ProfilePlatform, username: string) {
  switch (platform) {
    case "github":
      return {
        primaryMetric: "8 Repositories",
        secondaryMetric: "12 Stars Received",
        detail1: "Sample profile preview",
        detail2: "Active commit graph",
        rankBadge: "Contributor",
        breakdown: [
          { label: "Repos", value: 8 },
          { label: "Stars", value: 12 },
          { label: "Followers", value: 6 },
        ],
      };
    case "leetcode":
      return {
        primaryMetric: "180 / 3,200 Solved",
        secondaryMetric: "Contest Rating 1,620",
        detail1: "Sample demonstration",
        rankBadge: "Specialist",
        breakdown: [
          { label: "Easy", value: 85, max: 800 },
          { label: "Medium", value: 80, max: 1700 },
          { label: "Hard", value: 15, max: 700 },
        ],
      };
    case "codeforces":
      return {
        primaryMetric: "Rating 1,480",
        secondaryMetric: "Max Rating 1,520",
        detail1: "Specialist rank",
        rankBadge: "Specialist",
        breakdown: [
          { label: "Rating", value: 1480 },
          { label: "Contests", value: 16 },
        ],
      };
    case "kaggle":
      return {
        primaryMetric: "Contributor Rank",
        secondaryMetric: "2 Notebooks Published",
        detail1: "Tabular and NLP datasets",
        rankBadge: "Contributor",
      };
    case "hackerrank":
      return {
        primaryMetric: "5-Star Problem Solving",
        secondaryMetric: "Gold Python Badge",
        detail1: "Verified algorithmic skill tests",
        rankBadge: "Gold Badge",
      };
    case "codechef":
      return {
        primaryMetric: "3-Star Coder",
        secondaryMetric: "Rating 1,640",
        detail1: "Division 2 contender",
        rankBadge: "3-Star",
      };
    case "linkedin":
    default:
      return {
        primaryMetric: "Profile Linked",
        secondaryMetric: "Identity Connected",
        detail1: `Connected as @${username}`,
      };
  }
}
