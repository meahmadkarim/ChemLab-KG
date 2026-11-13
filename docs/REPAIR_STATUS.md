# Current status

See [PHASE_STATUS.md](PHASE_STATUS.md) for the 14 November 2026 comparison and current limitations. The entries below are historical repair checkpoints and may describe issues subsequently fixed.

# Repair log — 13 November 2026

This file supersedes implementation claims in older planning documents. The Claude project remains independent. No public deployment or paid service has been enabled.

## Implemented

- Dedicated Supabase project `chemlab-kg-claude`, reference `qmnzfqnvpoqndlkwbxdl`, Mumbai region.
- Supabase SSR authentication for real accounts, email-confirmation handling, callback, password recovery/completion, logout, protected role metadata, and separate signed demo sessions. No insecure session-secret fallback or in-memory real-account registry.
- Canonical and rewritten dashboard routes protected; server layout guards for student, teacher, and admin workspaces. Teacher demo cannot access admin. Same-origin sign-in redirects.
- Profile data and private avatars stored through user-scoped Supabase clients; ownership policies prevent cross-account access.
- Persisted learning preferences, attempts, classrooms, enrollment, assignments and teacher progress. Server/database grading never accepts a browser score. Assignment grading verifies membership, deadline and retry policy.
- Quiz answers separated from the public catalog. Practice answers checked by a server endpoint. Assignment explanation permissions resolved from the database.
- Recommendations endpoint repaired; real accounts use persisted learning records. Mastery uses the latest response for each distinct experiment/question.
- Database-backed published catalog and admin editor for translations, video, equation and publication status, with concurrency checks and cache invalidation.
- Verified-email role approval provisioned for the administrator email designated by the user. The user must complete sign-up and email verification; no password was created or read by the agent.
- Tutor provider and sources displayed, model output validated, reference material labelled as unreviewed demonstration notes. Video moment uses YouTube's playback clock. Feedback is saved only after a successful authenticated database write.
- Broken catalog links corrected; fabricated real-account progress totals removed; teaching outline downloads implemented; privacy, demonstration terms and accessibility information added.

## Verification performed

- Production build passed before the final catalog/player changes; final rerun tracked in the conversation.
- TypeScript and lint checks run throughout. Recommendation/catalog tests cover cold starts, repeated-question evidence, and answer-key privacy.
- Runtime API checks: recommendations 200; anonymous canonical/alias dashboards 307; profile 401.
- Browser: demo teacher sign-in works; teacher admin access redirects away.
- Transactional SQL tests: cross-user isolation, private answers, no direct score writes, server scoring, code enrollment, retry denial, teacher roster and unrelated-teacher isolation. Test records rolled back.
- Supabase security advisor returned no findings after the database changes.

## Remaining release checks and limitations

- Complete real email sign-up, confirmation and recovery using the designated administrator's own password; verify the admin editor through that authenticated account.
- Finish full mobile/desktop and keyboard regression checks on the final build. The new YouTube clock integration needs live playback verification.
- Gemini is not configured. Tutor uses labelled deterministic reference responses; live Gemini behavior is not verified. Quiz explanations currently use deterministic reference explanations.
- Subject-expert content review, authentic transcripts/timestamps, unique approved experiment footage and human translation review remain external content work. Some recent account/admin/policy messages are English.
- Admin currently edits existing catalog metadata/publication; a complete rich content/quiz-authoring and user-role-management interface remains to be finished.
- Classroom lifecycle controls (remove members, rotate codes, edit deadlines), distributed daily AI budgets and broader accessibility/performance testing remain to be finished.
- New SQL was applied through the connected database tool. Before using CLI migration push against this existing project, reconcile migration history; do not replay the schema blindly. Historical insecure migrations were preserved under `supabase/legacy-reference`, outside the active migration folder.

This is a working repair checkpoint, not a claim that every original requirement is complete or that the platform is ready for real student deployment.

## Continuation checkpoint — local reliability fixes

- Proxy redirects now preserve rotated/expired Supabase cookies and are marked private/no-store. Password-recovery callback redirects retain the allowed reset destination.
- Preference writes from a single tab are serialized and abandoned before sending if the signed-in identity changes. Save failures appear in an accessible EN/RU/KY notification instead of remaining silent. Multi-tab conflict resolution is still a release concern.
- Admin metadata editor initializes from the saved database record, disables saves until loading completes, blocks duplicate submissions, has accessible input names, and scrolls within the application shell.
- Notebook sharing/review modals reset by mounting a fresh form on open. Removed unsafe catch-variable types and resolved React lint errors in the current classroom/notebook changes. URL-selected experiment tabs use an external-store subscription with a stable server snapshot.
- Verification: TypeScript passes; ESLint reports no errors (unused-import warnings remain); all four existing automated tests pass, including the new rotated-cookie redirect regression.
- The Supabase introspection request was NOT executed: automatic approval review reached a usage limit. The presence of the content-authoring functions and the newer notebook migrations in the live database has not been confirmed in this continuation. Do not treat local migration files as proof of deployed schema.
- Final production build passed (389 pages). Production server started at http://127.0.0.1:3000; runtime smoke tests passed for authorization, recommendations, public answer privacy, and server answer validation.
- New browser verification could not start: the browser-control tool returned `Transport closed`. Earlier browser checks do not verify these newest edits.

## Notebook persistence and authorization repair

- Verified the designated administrator email is confirmed and granted its requested admin role. A fresh sign-in is needed to refresh existing JWT claims.
- Installed the student-report, teacher-notebook and classroom-share tables. Added field-level report guards: students cannot forge reviews, submitted work must be withdrawn before editing, reviewed work is immutable, and teachers can change only review fields on submitted work assigned through their classroom.
- Implemented database-only real-account notebook reads/writes, with explicit failures rather than silent local fallback. Demo reads exclude real-account cache records; old files were preserved.
- Added transactional share/revoke functions. Sharing checks every classroom's ownership and copies only selected notebook sections, excluding private teaching guidance. Student reads are limited by enrollment policies.
- Corrected autosave's stale closure and serialized requests. Submit/share flush the latest save and stop on failure.
- Transactional notebook database tests passed: enrollment, private draft isolation, selected-section sharing, unrelated teacher isolation, forged-review denial, reviewed-content protection and revocation. All synthetic records were rolled back.
- Five automated tests pass. TypeScript and ESLint (no errors) pass. Production build passed with 389 pages and the local server was restarted with these repairs.
- Security advisor reports only leaked-password protection disabled; no notebook policy findings. No account-plan changes or purchases were made. Browser verification remains unavailable through the connected browser-control tool.
- Final runtime smoke checks passed, including anonymous denial for student notebooks, teacher notebooks, shared notes, and teacher reviews. The teacher-review endpoint intentionally returns 403 for anonymous callers.
