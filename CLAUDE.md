# CLAUDE.md — ChemLab KG (Project A)

Read `docs/PROJECT_SPEC.md` (master brief), `docs/IMPLEMENTATION_PLAN.md`, and `docs/DECISIONS.md` (latest decisions win) before making changes. Also follow `AGENTS.md` (Next.js 16 rules: consult `node_modules/next/dist/docs/` before writing framework code).

## Identity & Creative Direction (Confirmed)
- **Name:** ChemLab KG
- **Tagline:** Learn Chemistry Through Real Experiments
- **Creative Formula:**
  - **40% Brilliant.org:** Spacious layouts, bold typography, tactile interactive cards, immediate visual feedback, original scientific SVG illustrations.
  - **30% Labster:** Immersive virtual laboratory workspace, equipment & reagent displays, step-by-step procedural timeline, laboratory telemetry badges.
  - **20% Khan Academy:** Intuitive navigation, clear topic mastery tracking, accessible student & teacher dashboards.
  - **10% MasterClass:** Cinematic `#0B1220` video theater presentation, high-contrast dark surfaces for video focus, documentary-grade storytelling.
- **Confirmed Palette:**
  - Deep Navy (Cinema / Dark Hero / Lab Header): `#0B1220`
  - Electric Blue (Primary Interactive): `#1266F1`
  - Laboratory Teal (Scientific Highlight / Secondary Interactive): `#18B6A4`
  - Soft Background: `#F5F8FC`
  - Pure White (Card Surface): `#FFFFFF`
  - Warm Amber Accent: `#FFB547`
  - Heading Text: `#111827`
  - Secondary Text: `#475569`
- **Typography:** `Manrope` (headings) + `Inter` & `Noto Sans` (body, `cyrillic-ext`, `cyrillic`, `latin` subsets), verified for Kyrgyz (`Ң ң Ө ө Ү ү`).
- **Video Hosting:** YouTube embeds (`youtube-nocookie.com`) in a MasterClass-inspired cinematic container supporting video URLs or IDs, fullscreen, captions/subtitles, synchronized timestamp jumping, and *"Ask AI about this moment"*.
- **AI/ML Features:**
  1. **ChemLab AI Tutor** (RAG over approved experiment content & timestamped transcripts, 3 response styles, strict lab safety guardrails).
  2. **Intelligent Quiz Explanations** (deterministic app scoring, teacher-approved explanations first, misconception tags, optional *"Explain my mistake"* & *"Hint"*).
  3. **Personalized Experiment Recommendations** (transparent content-based ranking with human-readable reasons & cold-start support).

## Hard Rules
- ~20–30 experiments max (24 curated in catalog). **Never** add grades, weeks, semesters, schedules, or grade/week labels/filters to the library or experiment pages.
- Public browsing and watching never require login.
- Independent portfolio demo: never imply UCA / U.S. Embassy / government ownership or endorsement; no official logos. Keep the footer disclaimer.
- Never present placeholder content as real UCA footage or expert-approved chemistry. Mark demo/unverified content clearly.
- Secrets only in `.env.local` / Vercel env. Never import service-role keys or `GEMINI_API_KEY` into client code.

## Commands (Windows PowerShell: use `npm.cmd` / `npx.cmd`)
- `npm.cmd run dev` — dev server
- `npm.cmd run build` — production build
- `npm.cmd run lint` — ESLint
