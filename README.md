# CAIRN — Talent Intelligence Platform

A premium dark-glass web application for evaluating candidate readiness across 12 structured skill domains.

## Features

- **Talent Check** — Score a candidate's readiness against company hiring benchmarks
- **Skill Matching** — Match a candidate profile to a job description across 12 CAIRN categories
- **JD Analytics** — Extract and analyse skill requirements from job descriptions
- **Resume Parsing** — Parse a CV and derive skill levels per domain
- **Profile Management** — Persistent candidate profile with skill editing
- **History** — Full audit trail of all checks and matches

## Skill Dimensions

`COD` · `DSA` · `OOD` · `APTI` · `COMM` · `AI` · `CLOUD` · `SQL` · `SWE` · `SYSD` · `NETW` · `OS`

## Tech Stack

- **React 19** + **TanStack Start** (SSR) + **TanStack Router** (file-based)
- **Tailwind CSS v4** with a custom smoked-glass design system
- **Vite 8** + **Nitro** (Cloudflare Worker deploy target)
- **TypeScript 5** strict mode

## Development

```sh
git clone <repository-url>
cd CAIRN
npm install
npm run dev
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build (Nitro + Cloudflare) |
| `npm run lint` | ESLint check |
| `npm run format` | Prettier format |
| `npm run test` | Vitest unit tests |
