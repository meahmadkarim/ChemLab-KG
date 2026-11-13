# ChemLab KG — Developer & Operations Handover Guide

This document provides a fast-start onboarding guide (under 30 minutes) and operational reference for engineers and maintainers taking over **ChemLab KG**.

---

## 1. Quickstart (< 30 Minutes)

### Prerequisites
- **Node.js** 20+ and **npm**
- A dedicated **Supabase** project (never share a database with another app)
- Optional: A Google **Gemini API** key (`GEMINI_API_KEY`) for live AI tutor responses

### Local Setup
1. **Install dependencies:**
   ```bash
   npm ci
   ```
2. **Configure environment variables:**
   Copy `.env.example` to `.env.local` and fill in your values:
   ```bash
   cp .env.example .env.local
   ```
   - `NEXT_PUBLIC_SUPABASE_URL` — Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — Your Supabase publishable (`anon`) key
   - `AUTH_SESSION_SECRET` — Random secret string, at least 32 characters (used for isolated demo/signed sessions; keep different per environment)
   - `GEMINI_API_KEY` *(optional, server-only)* — Live AI tutor key; when omitted, the tutor automatically uses clearly labeled reference responses
   - `GEMINI_MODEL` *(optional)* — Defaults to `gemini-2.5-flash`

3. **Provision a fresh Supabase database:**
   - Apply SQL files in `supabase/migrations/` in filename order.
   - Apply `supabase/seed-catalog.sql` and `supabase/seed-quiz.sql` for initial experiments and quizzes.
   - **Do not** apply files in `supabase/legacy-reference/` (historical designs only).
   - **Do not** blindly replay migrations on an already-provisioned database without reconciling CLI migration history first (see [DEPLOYMENT.md](./DEPLOYMENT.md)).
   - Configure Supabase Auth **Site URL** and **Redirect URLs** to include `http://localhost:3000/auth/callback` (and your production HTTPS origin + `/auth/callback` on deploy).

4. **Verify & Run Locally:**
   ```bash
   npm run typecheck
   npm run lint
   npm test
   npm run build
   npm run start
   ```
   Open `http://localhost:3000`.

---

## 2. Architecture Overview

- **Framework:** Next.js `16.4.6` (App Router), React `19.3.0`, TypeScript, Tailwind CSS v4.
- **Internationalization (`[locale]`):** All user-facing pages are nested under `src/app/[locale]/` supporting English (`en`), Kyrgyz (`ky`), and Russian (`ru`).
- **Separated Public & Authenticated Workspaces:**
  - **Public Website (`/[locale]/...`):** Homepage, experiment library, Students/Teachers info pages, About, Login, and Signup.
  - **Student Workspace (`/[locale]/me/...`):** Full-screen sidebar shell with My Learning, Saved, Classrooms, Assignments, and Profile.
  - **Teacher Workspace (`/[locale]/teacher-dashboard/...`):** Full-screen sidebar shell with Dashboard, My Classrooms (create/edit/archive/delete, rotate join code, manage roster, remove students), Assignments (create, edit deadline, review submissions), Student Progress, Resources (Saved Lab Notes, Question Bank), and Profile.
  - **Admin Workspace (`/[locale]/admin`):** Experiment catalog/content editor (`ExperimentContentEditor`) and user role management (`AdminUsers`).
- **Role & Auth Security:**
  - All runtime database access uses the publishable key and the signed-in user's session with PostgreSQL Row-Level Security (RLS). No service-role key is required in the app runtime.
  - Sign-up never grants `teacher` or `admin` roles directly; an administrator approves role promotions via `/api/admin/users` and database RPCs.
- **Lab Notebooks & Classroom Sharing:**
  - Both Students and Teachers have structured 4-section Lab Notebooks (all sections collapsed by default on load) plus autosave/cloud save, deletion, submission/withdrawal, and teacher-to-classroom snapshot sharing/revocation.

---

## 3. Available Scripts (`package.json`)

| Script | Command | Purpose |
| :--- | :--- | :--- |
| `npm run dev` | `next dev` | Start local development server |
| `npm run build` | `next build` | Production build |
| `npm run start` | `next start` | Start production server |
| `npm run lint` | `eslint src` | Run ESLint across `src/` |
| `npm run typecheck` | `tsc --noEmit --incremental false` | Strict TypeScript typecheck |
| `npm test` | `tsx --test tests/*.test.ts` | Run unit/integration tests |
| `npm run test:smoke` | `node scripts/smoke.mjs` | Run HTTP smoke checks against running server |
| `npm run test:browser` | `playwright test` | Run Playwright E2E browser tests |

---

## 4. Cost Assumptions & Operational Limits

- **Hosting (Vercel):** Designed to run on Vercel Hobby/Pro with standard Next.js serverless routes and static/dynamic SSR pages. No background queues or paid Redis/worker add-ons are required.
- **Database & Auth (Supabase):** Runs cleanly within the Supabase Free or Pro tier using standard PostgreSQL + RLS + Supabase Auth. No service-role admin workers or paid Supabase Edge Functions are required.
- **AI Tutor (Google Gemini):**
  - Authenticated live AI tutor usage is rate-limited to **50 requests per UTC day** per user to keep API costs predictable.
  - Anonymous/demo users, missing `GEMINI_API_KEY`, or quota-exhausted states gracefully fall back to **reference mode** (deterministic, zero-cost curriculum replies clearly marked as reference output).

---

## 5. Pre-Launch Checklist (External / Owner Actions)

Before opening the platform to real classrooms and students:
1. **Hosting Deployment:** Deploy to Vercel (or target host) with production environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `AUTH_SESSION_SECRET`, and `GEMINI_API_KEY`).
2. **Supabase Security:** Enable **Leaked Password Protection** in the Supabase Auth dashboard and configure production Site URL + `/auth/callback` redirect URLs.
3. **Live AI Verification:** Add a valid `GEMINI_API_KEY` and verify live Ask ChemLab AI responses in production.
4. **Content & Translation Review:** Have a qualified chemistry educator review experiment videos, captions, safety notes, and Kyrgyz (`ky`) / Russian (`ru`) translations.
