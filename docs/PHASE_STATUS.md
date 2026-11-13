# Development phase comparison — 14 November 2026

Compared with `PROJECT_SPEC.md` section 10 and `IMPLEMENTATION_PLAN.md` section 7. “Implemented” means source and supporting schema exist; verification limits are stated separately. Earlier planning files contain proposed features and are not completion evidence.

| Original phase | Implemented in the current application | Still incomplete or not verified |
|---|---|---|
| 0 — Discovery and plan | Master brief, design direction, architecture and decision log; independent project/database. | No remaining planning prerequisite. Later content/operational decisions remain with the owner. |
| 1 — Design system and homepage | Responsive shell, navigation, homepage, chemistry illustrations, interactive widgets, footer, EN/RU/KY routing and dictionaries. | Some newer notebook/admin/classroom text remains English. Full keyboard, screen-reader and contrast audit is not complete. |
| 2 — Gallery and experiment pages | 24 database-published demonstration experiments; topic/search discovery; video embeds, chapters, safety, explanation/procedure sections and recommendations; no grade/week structure. | Authentic recordings, reviewed transcripts, exact timestamps, captions and human translation review. Live YouTube playback/caption behavior has not been fully verified across browsers. The general observation widget needs per-experiment scientific review. |
| 3 — Quiz, authentication and progress | Supabase email auth/recovery, role guards, isolated demo sessions, private answer catalog, server scoring, persisted attempts/bookmarks/progress, student dashboard and classroom join form. | Real-account email confirmation/recovery and complete signed-in student journey need final mailbox/browser acceptance tests. Full multi-tab preference conflict handling is not implemented. |
| 4 — Teacher classrooms and assignments | Private classrooms, enrollment, assignment deadlines and permissions, roster/removal/code rotation/archive controls, restricted progress summaries; teacher notebooks, selected-section sharing and student report review. SQL isolation/journey tests cover core paths. | Custom teacher question bank remains a local demonstration feature and is not connected to custom assignment grading. Real-account question-bank writes are explicitly unavailable rather than pretending to persist on Vercel. Complete teacher/student browser journey remains to be verified. |
| 5 — Administration and content | Secured admin role, published/draft lessons, per-language content and chapter editing, quiz authoring, maximum catalog size, optimistic concurrency, verified-user role management. First admin confirmed/approved. | Dedicated subtitle/media/document upload library and rich transcript/procedure editing workflow; full moderation/revision history; real authenticated administrator browser acceptance test. |
| 6 — Quality, deployment and handover | Production build, lint/typecheck, seven unit tests, four desktop/mobile Chrome browser cases, API smoke test, four transactional SQL suites, dependency audit, GitHub Actions and setup/deployment documentation. Existing Vercel production site found and checked. | Full Firefox/WebKit matrix, automated accessibility/performance budgets, backup/restore rehearsal and privacy/retention decisions for real learners. Git publication and the updated release are recorded in RELEASE.md after completion. |

## AI/ML additions

- Contextual tutor, three explanation styles, source/provider labels, timestamp context and deterministic reference fallback are implemented. Production has a Gemini key variable configured, but a configured variable is not proof of a successful live provider call. No paid/live provider test was performed during this release review.
- Intelligent quiz hints/explanations use the private database catalog and server-enforced assignment permissions. AI does not determine grades.
- Personalized recommendations use transparent content-based ranking and the published catalog. They are not a trained machine-learning model. Latest distinct question evidence avoids inflating mastery through repeated attempts.
- Authenticated live tutor requests have a shared database daily allowance; anonymous/demo use stays in reference mode.

## Verified evidence for this review

- Local production compilation generated 390 pages successfully.
- Unit tests: 7 passed. Desktop/mobile Chrome cases: 4 passed (public quiz from answer check to final score, teacher demo sign-in, admin-access denial). This is not coverage of every acceptance journey.
- Runtime API smoke tests passed on the existing public deployment: authorization boundaries, recommendations, answer-key privacy and server answer validation.
- Dependency audit reported zero vulnerabilities after removing the unused shadcn CLI while preserving its licensed stylesheet locally and patching the lint dependency.
- The prior security, classroom, notebook and catalog/admin SQL suites passed in rolled-back transactions. They test database behavior, not complete browser workflows.

## Deployment review

Existing project: `chemlab-kg`, owner/team `meahmad089-3827`, Hobby plan. Prior latest deployment: `dpl_G7PsYTX7uLi6hbn1UP2pjotmz31o`, created 14 November 2026 at 00:33 Bishkek time, status Ready, aliased to https://chemlab-kg.vercel.app. No other project is being replaced.

## Conclusion

The project has a substantial working full-stack implementation. It is not accurate to say every original phase or acceptance criterion is finished. Its code can be released as a portfolio project with labelled demonstration materials; content approval, the specific missing features above and broader real-account QA remain explicit work.
