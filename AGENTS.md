# CAIRN — Agent Notes

This is the **CAIRN Talent Intelligence Platform** — a React/TanStack Start application
with a dark smoked-glass design system, champagne-gold accents, and 12-category skill scoring.

## Key conventions

- **Framework**: React 19 + TanStack Start (SSR) + TanStack Router (file-based routing)
- **Styling**: Tailwind CSS v4 with custom design tokens in `src/styles.css`
- **Design system**: Obsidian backgrounds (`#050507`), smoked-glass panels (`#17171B`), champagne accent (`#C4A574`)
- **Brand**: CAIRN — do not use violet, purple, or generic AI sparkles
- **Routes**: `/`, `/dashboard`, `/jd-analytics`, `/resume-parsing`, `/profile`, `/talent-check`, `/skill-matching`, `/history`
- **Skill categories**: 12 fixed codes — `COD DSA OOD APTI COMM AI CLOUD SQL SWE SYSD NETW OS`
- **Persistence**: localStorage keys `cairn.profile.v1`, `cairn.history.v1`, `cairn.jobs.v1` (fallback to legacy `radix.*` keys)
- **Third-party UI**: `@radix-ui/*` npm packages — do **not** rename or remove these

## Editing guidelines

- Preserve all existing routes, business logic, scoring calculations, and localStorage persistence
- Do not rewrite the build config without verifying all plugin equivalents are installed
- Run `npx tsc --noEmit` after TypeScript changes; run `npm run build` before claiming a production build works
- Keep the CAIRN brand consistent — no Lovable references in source, documentation, or configuration
