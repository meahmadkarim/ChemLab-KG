# Deployment and handover

## Configuration

Use a dedicated Supabase project. Never share this application's database with another implementation. All runtime database access uses the publishable key and the signed-in user's session; no service-role key is required by the application.

For a fresh database, apply SQL files from `supabase/migrations` in filename order, followed by `supabase/seed-catalog.sql` and `supabase/seed-quiz.sql`. Do not apply files in `supabase/legacy-reference`; these are historical designs. Do not reseed a catalog with user-authored changes.

The connected development database was provisioned with SQL through the database connector. Its CLI migration history must be compared and reconciled before using `supabase db push`. Do not blindly replay these migrations on that existing database. For a fresh project, normal CLI migration application records history automatically.

Set environment variables from `.env.example` in the deployment environment. `AUTH_SESSION_SECRET` must be randomly generated, at least 32 characters, and different between environments. `GEMINI_API_KEY` is server-only and optional. Do not put secrets in `NEXT_PUBLIC_*` variables. Public Supabase URL and publishable key are intended for browser use; RLS provides data protection.

Configure the Supabase Auth site URL and explicit callback URLs, including `http://localhost:3000/auth/callback` during local development. On deployment add the actual HTTPS origin and callback. Test confirmation and password recovery with your own mailbox. No administrator password is stored in project documentation.

## Roles

Sign-up does not grant a trusted teacher or administrator role. An existing administrator approves verified accounts through the administration workspace. The first administrator must be provisioned by the database owner using the verified role-approval mechanism. Role changes require a fresh sign-in to refresh existing sessions. Administrator RPCs also check the current confirmed database identity, protecting against stale privileged JWT claims.

The designated first administrator has been verified and approved in the connected development project. Sign out and back in to activate the updated role.

## Verification and release

1. Run `npm ci`, lint, typecheck, unit tests and dependency audit.
2. Run the transactional SQL suites under `supabase/tests` in a development project.
3. Build with the configured published catalog; start the production server, then run smoke and browser tests.
4. Verify real-account confirmation, recovery, teacher approval, assignment submission, notebook sharing/review and admin publication with accounts you control.
5. Check supplied media, captions, translations and safety notes with a chemistry educator before real classroom use.
6. Deploy only after the project owner's explicit authorization. No hosting deployment is configured automatically by this repository.

GitHub Actions runs code checks. The build step runs when repository variables `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are set, with `AUTH_SESSION_SECRET` stored as an Actions secret. Database and browser integration tests require a configured development environment and are separate from that default workflow.

## Operations

- Back up database records before schema changes; test migrations separately first.
- Archive classrooms to close new enrollment; rotate join codes after unwanted disclosure.
- Publish only reviewed content. Optimistic save checks prevent overwriting an administrator's newer catalog edit.
- Teacher note sharing copies selected sections into a snapshot; edit and republish to update student-visible notes.
- Tutor calls use reference mode for anonymous/demo users, missing provider configuration, or exhausted daily allowance. Authenticated live use is limited to 50 requests per UTC day. Reference replies are not live AI output.
- Local `.data`, `.env.local`, caches, test traces and avatars are excluded from Git. Do not upload them manually.
- The dependency override for `@typescript-eslint/typescript-estree` selects patched `minimatch` 11.0.8. Lint must be checked when updating that toolchain; remove the override once upstream adopts a safe version.
- The build disables Turbopack's filesystem cache to avoid stale loader artifacts seen in the Windows/OneDrive workspace. `.next-release` is dedicated generated output; do not place source files there.

## Current external dependencies

Production now has a Gemini key variable configured; successful live replies still require a separate provider acceptance test. Real experiment footage, precise transcripts and expert-reviewed translations must be supplied or approved by the content owner. The database security advisor reports leaked-password protection disabled; no paid plan or account setting was changed. Verify that setting in Supabase before operating with real learners.
