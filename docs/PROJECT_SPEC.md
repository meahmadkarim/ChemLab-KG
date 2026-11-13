# CHEMISTRY LEARNING PLATFORM — COMPLETE MASTER PROJECT BRIEF

**For:** Google Antigravity using Claude Opus (Thinking)  
**Project:** Independent internship portfolio demonstration for a chemistry experiment-learning platform relevant to schools in Kyrgyzstan  
**Status:** Requirements consolidation and planning. **Do not write code or change files until the user explicitly approves implementation.**  
**Version:** 1.0 — consolidated from planning discussions through 12 November 2026

---

## 0. READ THIS FIRST — NON-NEGOTIABLE INSTRUCTIONS FOR THE CODING AGENT

You are acting as a senior product designer, full-stack developer, software architect, accessibility specialist, quality engineer, and patient technical mentor. Read this entire brief before proposing anything.

1. **Start by summarizing your understanding, proposing an architecture, design direction, page map, implementation stages, and open questions. DO NOT CODE until the user tells you to begin.** Do not run scaffolding, install packages, edit files, or create migrations before approval.
2. This is an **independent sample/portfolio website**, not a commissioned or officially endorsed government, U.S. Embassy, or UCA production website. Never imply official endorsement, ownership, authorization, or partnership of this particular demo.
3. The website is **not** a general school LMS organized by grades or weeks. The experiment library will have **approximately 20–30 videos maximum**, browsable primarily as a straightforward gallery. **Do not add grade selectors, grade labels, grade-based learning paths, weekly lessons, semesters, week numbers, fixed teaching schedules, or grade/week classification to the experiment library or experiment detail pages.** This explicit correction overrides older internship wording about curriculum alignment and any earlier suggested designs mentioning grades.
4. Public browsing and watching videos should not require an account. Accounts are optional for students and teachers; administrators have secured roles.
5. The user's priority is an exceptional **simple, attractive, user-friendly, mobile-first educational experience** for teachers and learners, with more interactive learning support than the reference website.
6. Build **one Antigravity/Claude Opus project independently**. A **separate second project** will later be built with Codex. Do not share code or repositories between them; use the same product brief for a meaningful comparison.
7. Use **Next.js App Router + React + TypeScript + Tailwind CSS + shadcn/ui + Supabase/PostgreSQL + Supabase Auth**, initially targeting Vercel deployment, subject to any later user-approved change.
8. Work in small, reviewable, testable phases; seek approval before substantial decisions and actions, explain technical choices clearly, verify changes in the running application, and preserve working functionality.
9. Identify facts, user-approved decisions, proposed enhancements, and still-open details separately. Do not assume suggested features have been formally approved for the MVP.

---

## 1. ORIGINAL INTERNSHIP ANNOUNCEMENT (BACKGROUND)

The user initially shared a Co-Op listing titled **“IT Intern (Web Development Support)”**, listed at `https://ucacoop.org/internships-api/student-internship/136/`, located in Naryn, Kyrgyzstan. The listing presented UCA/EES in its display, but the later email and formal Terms of Reference clarified that the real programme is coordinated through **UCA's School of Professional and Continuing Education (SPCE)** in cooperation with the **U.S. Embassy Bishkek**. Do not describe it simply as a website “offered by UCA” or a website “for UCA.” UCA SPCE helps implement the programme and arrange internships.

Details shared in the announcement:

- Job title: **IT Intern (Web Development Support)**.
- Category: Web Development; part-time; Naryn, Kyrgyzstan.
- Two positions are available for Computer Science students.
- The listing showed a date of **1 December 2026**, but the specific role's formal engagement period is **February to mid-April 2027**. Do not assert the December date is the job start date without confirmation.
- Posted: **16 October 2026**.
- Required application documents: **resume, transcript, portfolio**.
- Undergraduate or recent graduate in CS/IT/Web Development or related field.
- Originally sought familiarity with WordPress CMS, basic HTML/CSS and website management; organization of content or databases; problem-solving, teamwork, detail; Kyrgyz and Russian communication, English useful.

**Crucial update:** The user subsequently said the project team announced that developers/interns **may choose any technology**. WordPress is therefore **not a constraint for this independent sample**. This later information overrides any assumption that WordPress must be used.

### 1.1 Email about the STEM initiative

According to the user's supplied email, **UCA SPCE together with the U.S. Embassy Bishkek** will implement a STEM programme for **29 chemistry teachers from across Kyrgyzstan**. Through the UCA Co-Op programme, they sought:

- **One C&M student** to support work **January–March 2027**.
- **Two Computer Science students** to support work **February–April 2027**.
- Monthly remuneration communicated as **USD 200** for selected students, with the IT Terms of Reference specifying **$200 February, $200 March, $100 April**, total **$500** over the roughly 2.5-month IT engagement.

The email says further detailed Terms of Reference and selection criteria would follow.

### 1.2 Formal Terms of Reference: IT Intern

The UCA SPCE Naryn Terms of Reference describes a support role reporting to a project manager/coordinator, collaborating with a lead web designer and project consultants to build, localize, and codify an **experimentium.org-inspired Minimum Viable Product (MVP)** aligned in purpose with chemistry education in Kyrgyzstan. Listed responsibilities:

- Assist with development and structure of the educational digital platform.
- Codify and upload chemistry experiments, safety guidance, lesson plans, and classroom materials.
- Integrate educational videos, translated subtitles, and digital resources prepared by trainers and the communications team.
- Test across browsers and mobile/desktop, links and functionality.
- Prepare documentation and support review and eventual handover to the relevant education ministry (named “Ministry of Enlightenment” in the supplied ToR; official naming and handover procedures must be verified by the project organizers).

Performance indicators: responsive support to lead designer; successful upload/formatting/content codification; functional bug-free MVP ready for testing; adherence to timelines.

**Important factual boundary:** The supplied correspondence establishes U.S. Embassy–UCA SPCE collaboration and intended education-sector beneficiaries. It does **not** independently establish who legally owns, commissions, funds, authorizes, or will operate the final website. Never invent those details.

---

## 2. USER'S EXPLANATION OF THE REAL EDUCATIONAL NEED

The user explained that chemistry education in Kyrgyzstan is perceived by the project organizers as insufficiently practical or experiment-based, and the initiative aims to help teachers bring **practical laboratory experiments** into schools. As the user understands the programme, experiments will be **conducted and professionally recorded in University of Central Asia laboratories**. Teachers and students in Kyrgyzstan should be able to watch and learn from those recordings even when they cannot perform every experiment in their own school laboratories.

The inspiration/reference is **https://experimentium.org/**. The website should be **similar in educational purpose**, but **more accessible, intuitive, polished, engaging, and interactive**. Do not copy that site's trademarks, copyrighted layouts, media, text, or assets. Treat it as a reference, not an exact specification. The user may provide further examples or requirements.

We are producing a **credible portfolio sample** to strengthen a competitive application for one of the two CS internship places, and potentially demonstrate a direction that could inform a real implementation. Make it clearly a demonstration until authorized otherwise.

### 2.1 Project mission

> Make practical chemistry easier to see, understand, teach and explore through a small, expertly organized library of real-world experiment videos, clear explanations, safety information and interactive knowledge checks.

This is **not** intended as a huge course marketplace, full national curriculum portal, grade-based e-learning school, or 1,000-video catalog.

### 2.2 Target users and permissions — CONFIRMED

**Public visitor (no login):** Browse the site; search and view available experiments; watch videos; read explanations and safety notes; download publicly available learning materials; optionally complete a practice quiz without permanent progress tracking if implemented.

**Student (optional account):** Everything public visitors can do, plus take MCQ quizzes and retain scores, receive answer explanations, see experiment completion and learning progress, bookmark favorites, join teacher classrooms with a join code or invitation, and finish assigned experiments/quizzes.

**Teacher (account):** Everything public visitors can do, plus establish one or more private classrooms, invite/enroll students, select existing experiments, create or select associated quizzes, issue assignments/deadlines, and see class-level and individual student performance as authorized. Teacher dashboards should be simple rather than overly analytical.

**Administrator (privileged account):** Manage educational content, experiments, video links, subtitle tracks, supporting documents, quiz questions, translations, categories/topics, account roles, and appropriate administration/moderation actions. Access must be protected server-side.

A public-first site with **optional** student/teacher authentication is essential. Do not introduce mandatory login just to watch experiments.

---

## 3. EXPLICIT USER DECISIONS (LATEST INSTRUCTIONS WIN)

1. The main public website is usable without logging in; optional accounts exist for **students, teachers, and administrators**.
2. Users can take **multiple-choice quizzes** with **scores, explanations, and personal progress**.
3. When a teacher creates a classroom, the platform supports **full classroom quizzes, assignments, teacher dashboards, and student performance monitoring**.
4. Offer a beautiful, trustworthy public homepage, experiment library, experiment detail/learning pages, student dashboard, teacher dashboard, administrator content interface.
5. The reference is **experimentium.org**, but we should aim for a **more user-friendly** experience and selectively add useful features.
6. Consider **interactive experiment simulations, progress tracking, downloadable teaching materials, and low-bandwidth accessibility**, but prioritize core functionality and mark simulations as a later enhancement.
7. **Maximum ~20–30 chemistry experiment videos.** Keep the catalog small, discoverable and visually appealing.
8. **Do not mention or organize by grades or weeks** in the **experiment library or experiment learning pages**. This is a direct correction to earlier proposals. No grade-based filters, grade badges, grade-specific paths, or week-based units; also avoid course schedules/semesters in the public catalog.
9. The technology can be chosen freely; the preferred and agreed stack is **Next.js + TypeScript + Supabase** with React, Tailwind CSS and shadcn/ui.
10. The user wants **two separate implementations**, one built by **Claude Opus within Google Antigravity**, another later by **OpenAI Codex**. Build only the Antigravity version in this project. Use independent codebase, database environment, Git repository and deployment.
11. **Do not begin coding until the user explicitly requests it.** Initial agent output should be analysis, product plan and design/architecture proposals.

---

## 4. PRODUCT SCOPE: PROPOSED PAGES AND EXPERIENCE

The following is a working plan, not a claim that every sub-feature is already approved or built.

### 4.1 Public homepage

Make an immediately understandable, elegant introduction to an experiment-based chemistry platform. Potential sections:

- Simple accessible header with logo/wordmark, Experiments, About/How it works, Teachers, language switcher, Login/Sign Up and a clear Explore Experiments call-to-action.
- Strong hero: approachable science visual language, compelling short headline, supporting sentence and action to explore the 20–30 experiments.
- Featured or popular experiment thumbnails (use clearly labeled safe demo content where official videos unavailable).
- “How it works” section showing watch → understand → check knowledge.
- Clear student and teacher paths, with teacher classroom features presented without forcing visitors to join.
- Information about practical experiment learning and safe responsible use.
- Footer with support/about, legal/demo disclaimer, accessibility and language options.

Do **not** claim to be the official website of the Kyrgyz government, U.S. Embassy, or UCA; do not use their logos without permission.

### 4.2 Experiment library — small, easy catalog

For **roughly 20–30 videos**, not thousands. Favor a gallery rather than elaborate hierarchies.

- Grid/list of beautifully designed cards with thumbnail, experiment title, short description, duration and accessible play action.
- Fast keyword/name search.
- Optional **topic** filtering only if useful: e.g. acids & bases, reactions, solutions, gases, indicators, separation, etc. Treat exact taxonomy as draft until content is supplied.
- Maybe sorting by alphabetical title or duration; do not overengineer.
- Empty, loading and error states; keyboard accessibility; smooth mobile layout.
- Favorites/bookmarks available for signed-in students if approved.
- Absolutely **no grade-based or week-based labels, filters, categories, tracks, or timing**.

### 4.3 Individual experiment learning page

This is the key page in the entire platform. Potential layout:

- Prominent responsive experiment video player, with accessible playback controls, caption/subtitle tracks when available, playback speed and fullscreen if supported.
- Clear title and brief experiment overview.
- Learning objectives: what viewers can understand after watching.
- Equipment/materials, and prominently placed safety guidance written/approved by subject experts.
- Summary of the observed procedure and a scientific explanation, potentially with a concise chemical equation where relevant and verified.
- Supporting resources/lesson handouts and subtitles/transcript when supplied.
- “Check your understanding” MCQ quiz with scores, explanations, and optional saved progress.
- Related experiment suggestions selected by topic, not grade or week.
- For authenticated teachers: action to assign the experiment and associated quiz to a classroom.

**Safety and accuracy:** Never manufacture actual UCA experiments, claim unrecorded videos are UCA recordings, or invent validated chemistry procedures. Use carefully chosen demo placeholders clearly marked as such. Do not suggest untrained minors replicate hazardous experiments at home; distinguish demonstration observation from supervised laboratory activity.

### 4.4 Quizzes and learning progress — confirmed concept

**Independent learning:** MCQs linked to individual experiments; clear instructions, one/multiple answer choices as appropriate, scoring, useful explanations for correct and incorrect responses, completion summary; a student account retains quiz attempt/results and progress.

**Classroom learning:** A teacher can assign an existing experiment/quiz and, later, create or edit classroom quizzes if included in MVP; class assignment availability/deadline; student submission; teacher review of attempts, scores and completion. Clarify quiz retakes, attempts, time limits, question randomization, and gradebook needs before implementing them.

Public users may optionally try nonpersistent quizzes; the exact no-login quiz behavior is an implementation proposal, not a user-confirmed requirement.

### 4.5 Student dashboard

Signed-in students can see recently watched and completed experiments (tracking definition to be agreed), their quiz attempts/scores, overall progress, saved experiments, classes they joined, assigned quizzes and deadlines, and clear pathways back to relevant videos. Avoid unnecessary gamification, rankings or public student comparison.

### 4.6 Teacher dashboard / virtual classrooms

- Create a classroom with a custom name and secure share/join code.
- Manage enrollment (ideally approve requests or enable controlled invites; exact policy to decide).
- Assign existing videos/experiments and quizzes to the class.
- Create/manage quizzes or select a reusable quiz for the class.
- Set due dates if needed; classroom assignments need deadlines even though the public experiment library has **no weeks/grades**.
- See student completion and scores; simple summaries and individual views with least-privilege permissions.
- Export results only if approved and with appropriate privacy controls.

Classroom due dates are **not** grade/week organization of public educational content; they are specific teacher assignments.

### 4.7 Administrator dashboard and content organization

A true content management interface is needed because Next.js does not provide an editor automatically. Provide permissioned workflows to:

- Add/edit/archive experiments; upload thumbnail or link to appropriate video-hosting system.
- Edit experiment title, descriptions, subtitles, explanation, objectives, materials, safety notes, procedure summaries, topic tags and optional downloads.
- Manage multilingual content and untranslated fields clearly.
- Attach quizzes and answer explanations.
- Manage publication states (draft/published), content ordering and revision history if scope permits.
- Assign appropriate account roles; prevent accidental exposure of private records.

Not every advanced CMS feature belongs in the first MVP.

### 4.8 Future enhancements, separate from MVP

Possible later features: interactive simulations of selected safe chemical concepts; richer downloadable PDFs; enhanced search; learning recommendations; improved offline access; extra accessibility tools; optional English; moderated teacher resource sharing; usage insights with privacy safeguards. **Do not overpromise or automatically implement AI features, chatbots, complex analytics, or simulations.**

---

## 5. LANGUAGES, CONTENT AND ACCESSIBILITY

- The original internship asks for Kyrgyz and Russian communication and localized multimedia/subtitles. Plan multilingual site architecture from the beginning. **Kyrgyz and Russian are the primary likely site languages; English is optional and the final language set/default has not been explicitly chosen by the user.** Confirm before committing to translation scope.
- UI translations and experiment content translations are distinct: model titles, descriptions, scientific text, subtitles and quizzes appropriately.
- Don't generate fake officially reviewed Kyrgyz/Russian scientific translations. Unverified sample translations must be identified for expert review.
- Fonts must support Kyrgyz Cyrillic and Russian; ensure Unicode handling.
- Mobile-first is critical for teachers/students nationwide. Design for low-cost phones, slower internet, smaller screens and intermittent connectivity.
- Optimize image sizes and loading, avoid heavy decorative effects, choose adaptive video delivery where practical, expose subtitle options and printable/downloadable text resources when authorized.
- Target accessible navigation: semantic elements, keyboard focus, contrast, headings, labels, descriptive controls, captions and sensible reduced-motion behavior.

---

## 6. DESIGN DIRECTION — NOT YET FINAL APPROVED MOCKUPS

The user wants a website that feels **professional, highly polished, trustworthy, modern, simple and genuinely usable by school teachers and students**, possibly with the credibility of a national educational service. We have **not yet finalized colors, logo, fonts, precise layout, imagery, copywriting or a Figma design**. Propose choices instead of assuming they were approved.

Design principles:

1. Simple and welcoming rather than complicated or corporate.
2. Video-first educational experience; high-quality experiment thumbnails.
3. Clear navigation; limit clutter and endless menus.
4. Consistent components, spacing, typography and responsive grids.
5. Clear separation of public learning and account dashboards without making two unrelated products.
6. Visually engaging science identity using original/licensed imagery or safe placeholders, never falsely attributed to UCA.
7. Modern UX, real content hierarchy and strong empty/error/loading states.
8. Focus on the small curated library; no bloated grade/week syllabus interface.

Before implementation, present a proposed sitemap, homepage section plan, text-only wireframes, design tokens and representative user journeys for review.

---

## 7. TECHNOLOGY CHOICE — OUR DISCUSSION AND CONCLUSION

We compared three options:

**A. WordPress + custom design** — excellent for fast educational publishing and nontechnical content editing; originally relevant because job ToR requested WordPress; however complex custom classrooms/quizzes often mean added plugins, customizations and compatibility work.

**B. Next.js + a database/Supabase** — flexibility to build refined custom UX, student progress, classrooms, assignments and quizzes with a coherent data model. Requires custom CMS/admin tools, authentication/authorization, deployment and disciplined maintenance; relatively more learning than a simple WordPress site.

**C. Next.js + headless WordPress** — combines WP CMS with a custom frontend but entails two systems, more deployment surfaces and complexity; not justified for a 20–30 video portfolio sample when the technology restriction is removed.

**Agreed choice for the independent Antigravity version:** **Option B, Next.js + TypeScript + Supabase**. Do not revert to WordPress unless instructed.

### 7.1 Preferred stack

- **Frontend and full-stack framework:** Next.js, App Router and React.
- **Language:** TypeScript.
- **CSS:** Tailwind CSS.
- **Component primitives:** shadcn/ui when appropriate; customize to avoid generic template aesthetics.
- **Database:** PostgreSQL, managed through Supabase.
- **Authentication:** Supabase Auth, with secured role-based authorization.
- **Server-side functions:** Next.js server components, server actions or route handlers as appropriate; avoid adding Express/Django or microservices without a reason.
- **Video:** Dedicated video hosting/streaming service or controlled mock assets for the demo. Actual provider is **not yet selected**. Don't store large video assets in Git or assume Supabase is suitable for nationwide adaptive streaming without traffic/cost assessment.
- **Version control:** Git and a dedicated GitHub repository for this project.
- **Initial deployment:** Vercel, with environmental secrets and production settings; ability to self-host later is desirable.
- **Optional external tools:** storage/CDN, email provider, monitoring and testing tools as needed, approved when requirements justify them.

### 7.2 Hosting/cost discussion

We previously discussed that an **individual portfolio demo may fit free tiers** subject to terms/limits; a paid production baseline using Vercel Pro and Supabase Pro was roughly **$45/month at the time of discussion**, **not** including domain, video hosting/streaming, bandwidth overages, email, taxes or operational support. **Do not treat those price estimates as guaranteed current prices or a final national deployment budget. Verify provider prices, free-tier eligibility, commercial-use rules, video usage and hosting jurisdiction before decisions.**

For eventual government or institutional use, anticipate stronger privacy, reliability, procurement, backup, monitoring, operations and hosting requirements. A national deployment is not equivalent to a free student demo.

### 7.3 Maintainability discussion

WordPress is easier for nontechnical publishing out of the box, while Next.js offers stronger control of complex custom workflows **if we build an administrative CMS-like interface**. Avoid vendor-specific lock-in where practical; keep modular interfaces, documented data schema, migrations, test coverage, and a deploy/handover guide.

### 7.4 Learning difficulty

The user is studying Computer Science and wants to learn from the AI-assisted development. Explain architecture, routing, React components, TypeScript, relational schema, authentication, authorization, CRUD, state management, deployment and testing clearly when they arise. Do not overwhelm with unrelated concepts or generate the entire solution in a single opaque pass.

---

## 8. PROPOSED TECHNICAL MODEL — TO REFINE BEFORE CODING

These are candidate domain entities, **not an approved database schema**:

- `profiles` with user ID and role(s).
- `experiments` with basic metadata, publish state, thumbnail, duration, video reference and topic tags.
- `experiment_translations` with language-specific titles, descriptions, guidance and explanations.
- `topics` and experiment-topic relations, if topic filtering is approved.
- `video_assets` or media metadata, including localized subtitle tracks and transcripts.
- `resources` for authorized downloadable materials.
- `quizzes`, `quiz_questions`, `quiz_options`, `quiz_explanations` and experiment-to-quiz links.
- `quiz_attempts` and per-question responses, with sensible retake and data-retention rules.
- `student_experiment_progress` and optional `bookmarks`.
- `classrooms`, `classroom_memberships` and invitation/join-code logic.
- `assignments` and student-specific submissions/progress.
- Optional localized UI strings, moderation/audit history and admin review state.

Security is essential: use Supabase RLS and proper backend validation; protect student records and teacher-to-class access, prevent privilege escalation, never put service-role keys in browser code, avoid trusting user-supplied role claims, validate quiz scoring server-side when results are persisted. Consider children's privacy and obtain institutional/legal guidance before collecting real minors' data. Seed only fictional demo accounts/students/data unless authorized.

Plan accessible auth flows, error handling, loading states, tests and seed data. Explicitly consider the status of account creation for minors, teacher verification, public-vs-private content, moderation, retention and backups as **open policy questions**.

---

## 9. KEY USER JOURNEYS / DEMONSTRATION ACCEPTANCE SCENARIOS

A polished vertical slice should demonstrate:

1. An anonymous visitor opens the homepage and clearly understands what the platform does.
2. They browse/search an experiment among a small curated collection, without grade/week controls.
3. They open an experiment and watch a properly labeled demo video; read objectives, materials, safety information and an accurate explanation.
4. They answer a five-question sample MCQ quiz, see a score and helpful explanations.
5. A signed-in student repeats or completes quizzes and can view their saved performance/progress.
6. A teacher signs in, creates a classroom, and obtains an enrollment mechanism.
7. The teacher assigns a selected experiment/quiz to that class, optionally with a deadline.
8. A student joins the class, completes the assignment and sees the result.
9. The teacher sees the corresponding completion and score in a simple class dashboard, without seeing unrelated students' information.
10. An admin uploads or publishes a new experiment using the content interface without editing source code.
11. The interface works on mobile and desktop; navigation, links, forms, captions, language switch, and core flows are tested.

The **first deliverable** should be a beautiful, working public-facing experience; **then** the interactive student flow; **then** classroom workflow; **then** admin and hardened deployment. Do not attempt all complex workflows at once.

---

## 10. DEVELOPMENT PHASES (PROPOSED, REVIEWABLE)

**Phase 0 — Discovery, review and written plan (NO CODE).** Read this file; summarize correct scope; identify assumptions; present sitemap, architecture, page mockups/wireframes, suggested design system, domain model, MVP-vs-later prioritization, risks and open decisions. Await explicit approval.

**Phase 1 — Design system and public homepage.** Build the shell, navigation, hero, featured experiments, teacher/student messaging and footer with excellent responsive layouts and realistic clearly labeled demo content. Review actual browser output and refine.

**Phase 2 — Small experiment gallery and video learning pages.** Search/filter only by topics and keywords; show 20–30 maximum sample entries (not necessarily all populated immediately); build accurate video-page templates with caption support, safety sections and related content. No grades/weeks.

**Phase 3 — Independent quizzes, auth and student progress.** Implement Supabase, secured sign-in, MCQ quiz flow, scoring/explanations, stored attempts and student dashboard. Validate user experience and RLS.

**Phase 4 — Teacher classrooms and assignments.** Teacher accounts, private classrooms, enrollment, assignments with deadlines, class quiz workflow, restricted results dashboard.

**Phase 5 — Admin publishing/localization/content management.** Protected content editor, translated resources and subtitles, upload/publish workflows, test content and appropriate moderation/validation.

**Phase 6 — Quality, deployment and handover.** Cross-browser/mobile testing, accessibility checks, performance profiling, video cost assumptions, privacy review, link tests, secure configuration, backups, CI/test scripts, documentation, GitHub README and Vercel demo deployment.

**Future possibilities, not Phase 1 requirements:** interactive simulations, enhanced analytics, smarter learning recommendations, offline-first behavior, broader CMS/versioning, more advanced teaching tools.

---

## 11. HOW ANTIGRAVITY/CLAUDE OPUS SHOULD WORK WITH THE USER

- Development environment: **Google Antigravity**, Claude Opus selected if available.
- Project directory suggestion: `chemistry-learning-platform-claude`.
- This is **Project A**, developed separately from a future **Project B** produced with Codex. Keep separate GitHub repo, Supabase project and deployment.
- Prefer planning/review mode at first. Always explain intended filesystem/terminal actions, especially destructive actions or installing dependencies.
- Never secretly change architecture, add services/costs, obtain paid resources, or call external APIs requiring user credentials without discussing first.
- Do not request the user to paste production secrets into a prompt. Use local `.env` with `.gitignore`, and provide safe setup instructions.
- Never present untested placeholder features as fully functional. Mark prototype, demo and completed states truthfully.
- Once coding is explicitly authorized, deliver small increments with test procedures, verify in the browser, and report what works, what is mocked and what remains.
- Capture user-approved decisions in this brief as it evolves. If later directions contradict earlier ones, follow the latest explicit user direction and document the change.
- Give clear explanations suitable for a CS student learning practical development.
- Source imagery/video legally, preserve attribution where required, and do not copy reference-site assets.

### Example project instruction files (to write only after approval)

- `PROJECT_SPEC.md`: this consolidated brief.
- `AGENTS.md` if needed for shared instructions.
- `CLAUDE.md` for Claude-specific reference to this file, architecture standards, phase rules and project commands.

The user may paste this specification directly in Antigravity instead of asking for files to be created by the agent, but the **initial instruction is planning, not implementation**.

---

## 12. WHAT HAS NOT YET BEEN SETTLED

Do not invent answers or treat proposals as confirmed:

1. Final public website name and branding.
2. Exact logo, palette, fonts, hero copy, and detailed visual design.
3. Final interface languages and default language (Kyrgyz and Russian are recommended/expected; English optional).
4. Real chemistry videos, subtitles, approved chemical explanations, exact titles and descriptions have **not** been provided.
5. Exactly which 20–30 experiments will appear, and their topic categories.
6. Media provider, storage configuration, streaming costs and licensing/consent for official UCA laboratory footage.
7. Whether unauthenticated users can submit quizzes with temporary nonpersistent scores.
8. Teacher verification, class invitation policies, class enrollment and permissions.
9. Quiz retake rules, attempt limits, grading options, deadlines, custom questions and analytics detail.
10. Student account policies, especially for minors, privacy and data retention.
11. Public content publishing process, expert review and approval authority.
12. Production domain, official host/operator, ministry handover, commercial-scale funding and hosting jurisdiction.
13. Full scope of low-bandwidth/offline access and interactive simulations.
14. Whether any portfolio demonstration needs actual deployment before the internship application deadline.

These questions should **not** block a first planning output. Propose sensible defaults and explicitly mark them as assumptions for later confirmation.

---

## 13. FIRST RESPONSE REQUIRED FROM ANTIGRAVITY — STOP BEFORE CODING

After reading this document, return:

1. **Understanding and scope check**: What is the platform, who is it for, why does it exist, what is officially known vs what is part of our proposed portfolio demo? Explicitly affirm **20–30 experiment videos, no grades, no weeks**.
2. **Product and design plan**: Public sitemap, homepage content hierarchy, experiment library design, experiment-detail page structure, student, teacher and admin UX, mobile navigation and language treatment.
3. **MVP feature matrix**: Prioritize must-have features vs good-to-have vs later enhancements. Include a small but complete end-to-end showcase.
4. **Architecture proposal**: Next.js App Router, TypeScript, Tailwind, shadcn/ui, Supabase/Auth/Postgres, media hosting choices, reasonable folder organization and data-flow concept.
5. **Data/security plan**: Candidate entities, access/role model, RLS, privacy, safe demo accounts and secure quiz scoring.
6. **Quality plan**: Responsiveness, accessibility, browser testing, performance, localization testing, automated tests and documentation.
7. **Build milestones**: Small verifiable phases with acceptance criteria, starting with homepage/public library, not all features at once.
8. **Design proposals**: Two or three distinct high-quality visual directions with rationale, but do not assume user approved any one.
9. **Key open decisions**: Keep concise, only those that would materially alter early implementation; do not demand dozens of answers before producing a plan.
10. **Explicitly state that you will not create or modify files, run setup commands or start coding until the user authorizes it.**

**End of master brief.**
