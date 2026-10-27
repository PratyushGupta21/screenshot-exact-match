import type { CategoryCode } from "./types";

/** Single source of truth for the 12 RADIX skill categories. */
export const RADIX_CATEGORIES: { code: CategoryCode; name: string }[] = [
  { code: "COD", name: "Coding" },
  { code: "DSA", name: "Data Structures & Algorithms" },
  { code: "OOD", name: "Object-Oriented Design" },
  { code: "APTI", name: "Aptitude" },
  { code: "COMM", name: "Communication" },
  { code: "AI", name: "Artificial Intelligence" },
  { code: "CLOUD", name: "Cloud" },
  { code: "SQL", name: "SQL" },
  { code: "SWE", name: "Software Engineering" },
  { code: "SYSD", name: "System Design" },
  { code: "NETW", name: "Networking" },
  { code: "OS", name: "Operating Systems" },
];

export const categoryName = (code: string) =>
  RADIX_CATEGORIES.find((c) => c.code === code)?.name ?? code;

export const COMPANIES = [
  "Google LLC",
  "Microsoft Corporation",
  "Oracle Financial Services Software",
] as const;
export type Company = (typeof COMPANIES)[number];
