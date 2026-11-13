# ChemLab KG

A chemistry learning platform for Kyrgyzstan, built with Next.js, TypeScript, Tailwind CSS, shadcn/ui and Supabase PostgreSQL. Public experiment exploration connects to student progress, teacher classrooms, laboratory notebooks and a secured administration workspace.

## Features

- 24 demonstration experiments, searchable by chemistry topic and safety level, with English, Kyrgyz and Russian content.
- Responsive experiment workspaces, privacy-enhanced YouTube embeds, chapter navigation and contextual learning support.
- Server-checked quizzes, explanations, hints and persisted account progress. Assignment membership, deadlines, retries and feedback permissions are enforced on the server.
- Student bookmarks, classroom enrollment and assignments; teacher classroom management, code rotation, rosters and progress summaries.
- Student lab reports and teacher notebooks with selected-section sharing, review controls and database ownership policies.
- Administrator lesson, translation and quiz editing, draft publication, concurrent-edit protection and verified-account role management.
- Contextual chemistry tutor with an optional Gemini provider and explicitly labelled reference responses when no provider is configured; transparent content-based recommendations.
- Supabase email authentication, password recovery, private avatars and isolated demonstration sessions.

## Local setup

Use Node.js 24 or newer and npm. On Windows PowerShell, use `npm.cmd` where script execution policy requires it.

```sh
npm ci
```

Copy `.env.example` to `.env.local`. Set the Supabase project URL and publishable key, then generate a random `AUTH_SESSION_SECRET` of at least 32 characters. Never commit credentials. `GEMINI_API_KEY` is optional; without it the tutor provides labelled reference responses.

Provision a dedicated Supabase project using the instructions in [Deployment and handover](docs/DEPLOYMENT.md). Apply the active migrations and seeds before building. Configure Supabase Auth callback URLs for your local origin.

```sh
npm run dev
# or production mode:
npm run build
npm start
```

Open http://localhost:3000/en (also `/ky` and `/ru`). Login offers clearly labelled demo accounts. Real teacher access requires administrator approval; real admin access cannot be obtained through a demo account.

## Verification

```sh
npm run lint
npm run typecheck
npm test
npm audit
npm run build
# With the production server running:
npm run test:smoke
npm run test:browser
```

Browser tests use installed Google Chrome at desktop and mobile viewport sizes. SQL regression tests in `supabase/tests` execute synthetic journeys inside transactions and roll back their records. Run these only against a development database.

## Architecture

`src/app` contains localized routes and API handlers. `src/features` groups authentication, experiments, classrooms, progress, quizzes, notebooks, administration and AI. `src/lib/supabase` handles user-scoped clients and SSR cookies. PostgreSQL row-level policies and narrowly scoped functions enforce ownership and grading. Private quiz answers are separated from public lesson data. Live AI usage has a database-backed daily allowance; AI never determines quiz grades.

Published catalog reads are cached and invalidated on administrator saves. Runtime recommendations use the published database catalog. Demo state is isolated from real account persistence. Build output is generated in `.next-release` and excluded from Git.

See [verification status](docs/REPAIR_STATUS.md), [deployment and handover](docs/DEPLOYMENT.md) and the original planning records in `docs` for operational detail and project history.

## Content and identity

ChemLab KG is an independent software engineering portfolio project. It is not an official or endorsed government, embassy or university website. Included experiments, translations, video references and transcripts are clearly labelled demonstration materials; authentic recordings and subject-expert review are separate content-production work. No public deployment is performed by the local setup instructions.
