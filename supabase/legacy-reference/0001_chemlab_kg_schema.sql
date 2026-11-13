-- =============================================================================
-- ChemLab KG — Shared Relational & AI/ML Database Schema (Supabase PostgreSQL)
-- Strictly organized by scientific topics (ZERO grade or week columns).
-- =============================================================================

create extension if not exists "pgcrypto";

-- 1. User Profiles & Roles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'student' check (role in ('student', 'teacher', 'admin')),
  display_name text not null,
  preferred_locale text not null default 'ky' check (preferred_locale in ('ky', 'ru', 'en')),
  explicit_interests text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Experiments Catalog (~20-30 curated videos, topic-based, zero grades/weeks)
create table if not exists public.experiments (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  topic_id text not null check (
    topic_id in (
      'acids-bases',
      'reactions',
      'gases',
      'metals',
      'solutions',
      'separation',
      'electrochemistry',
      'energy'
    )
  ),
  duration_seconds integer not null check (duration_seconds > 0),
  safety_level text not null check (safety_level in ('observe', 'teacher_demo', 'student_lab')),
  youtube_video text not null,
  chemical_equation text not null,
  illustration text not null,
  featured boolean not null default false,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Localized Experiment Educational Content (KY / RU / EN)
create table if not exists public.experiment_contents (
  id uuid primary key default gen_random_uuid(),
  experiment_id uuid not null references public.experiments(id) on delete cascade,
  locale text not null check (locale in ('ky', 'ru', 'en')),
  title text not null,
  short_description text not null,
  scientific_explanation text[] not null default '{}',
  learning_objectives text[] not null default '{}',
  materials text[] not null default '{}',
  safety_notes text[] not null default '{}',
  procedure_steps jsonb not null default '[]'::jsonb,
  content_revision integer not null default 1,
  reviewed_by_educator boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (experiment_id, locale)
);

-- 4. Timestamped Video Transcript Segments (for "Ask AI about this moment" RAG)
create table if not exists public.transcript_segments (
  id uuid primary key default gen_random_uuid(),
  experiment_id uuid not null references public.experiments(id) on delete cascade,
  locale text not null check (locale in ('ky', 'ru', 'en')),
  start_seconds integer not null check (start_seconds >= 0),
  end_seconds integer not null check (end_seconds >= start_seconds),
  transcript_text text not null,
  review_status text not null default 'approved' check (review_status in ('draft', 'approved')),
  created_at timestamptz not null default now()
);

create index if not exists idx_transcript_experiment_time
  on public.transcript_segments (experiment_id, locale, start_seconds, end_seconds);

-- 5. Quiz Questions & Misconception Mappings
create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  experiment_id uuid not null references public.experiments(id) on delete cascade,
  concept_tag text not null,
  sort_order integer not null default 1,
  prompt_ky text not null,
  prompt_ru text not null,
  prompt_en text not null,
  hint_ky text,
  hint_ru text,
  hint_en text,
  created_at timestamptz not null default now()
);

create table if not exists public.quiz_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.quiz_questions(id) on delete cascade,
  option_key text not null,
  is_correct boolean not null default false,
  text_ky text not null,
  text_ru text not null,
  text_en text not null,
  approved_explanation_ky text not null,
  approved_explanation_ru text not null,
  approved_explanation_en text not null,
  misconception_tag text,
  misconception_label_ky text,
  misconception_label_ru text,
  misconception_label_en text,
  unique (question_id, option_key)
);

-- 6. Virtual Classrooms & Teacher Assignment Rules
create table if not exists public.classrooms (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  join_code text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.classroom_memberships (
  classroom_id uuid not null references public.classrooms(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (classroom_id, student_id)
);

create table if not exists public.classroom_assignments (
  id uuid primary key default gen_random_uuid(),
  classroom_id uuid not null references public.classrooms(id) on delete cascade,
  experiment_id uuid not null references public.experiments(id) on delete cascade,
  due_date date,
  allow_hints boolean not null default true,
  allow_ai_explanations boolean not null default true,
  show_immediate_feedback boolean not null default true,
  show_correct_answers boolean not null default true,
  allow_retries boolean not null default true,
  created_at timestamptz not null default now()
);

-- 7. Deterministic Student Quiz Attempts & Responses
create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  experiment_id uuid not null references public.experiments(id) on delete cascade,
  assignment_id uuid references public.classroom_assignments(id) on delete set null,
  score integer not null check (score >= 0),
  total integer not null check (total > 0),
  completed_at timestamptz not null default now()
);

create table if not exists public.quiz_responses (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.quiz_attempts(id) on delete cascade,
  question_id uuid not null references public.quiz_questions(id) on delete cascade,
  selected_option_key text not null,
  is_correct boolean not null,
  concept_tag text not null,
  misconception_tag text
);

create index if not exists idx_quiz_attempts_student
  on public.quiz_attempts (student_id, completed_at desc);

-- 8. Student Progress, Topic Performance & Personalized Recommendations
create table if not exists public.student_experiment_progress (
  student_id uuid not null references public.profiles(id) on delete cascade,
  experiment_id uuid not null references public.experiments(id) on delete cascade,
  viewed boolean not null default true,
  completed boolean not null default false,
  bookmarked boolean not null default false,
  last_activity_at timestamptz not null default now(),
  primary key (student_id, experiment_id)
);

create table if not exists public.topic_performance (
  student_id uuid not null references public.profiles(id) on delete cascade,
  topic_id text not null,
  question_count integer not null default 0,
  correct_count integer not null default 0,
  evidence_status text not null default 'no_data'
    check (evidence_status in ('no_data', 'preliminary', 'needs_practice', 'proficient')),
  recent_misconceptions text[] not null default '{}',
  updated_at timestamptz not null default now(),
  primary key (student_id, topic_id)
);

create table if not exists public.experiment_recommendations (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  experiment_id uuid not null references public.experiments(id) on delete cascade,
  reason_type text not null,
  reason_ky text not null,
  reason_ru text not null,
  reason_en text not null,
  ranking_score numeric(6,2) not null,
  generated_at timestamptz not null default now()
);

-- 9. Ephemeral AI Tutor Session Metadata & Non-Identifying Feedback
create table if not exists public.ai_conversation_sessions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.profiles(id) on delete cascade,
  experiment_id uuid not null references public.experiments(id) on delete cascade,
  locale text not null check (locale in ('ky', 'ru', 'en')),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '24 hours')
);

create table if not exists public.ai_response_feedback (
  id uuid primary key default gen_random_uuid(),
  experiment_slug text not null,
  rating text not null check (rating in ('helpful', 'not_helpful')),
  locale text not null default 'ky',
  created_at timestamptz not null default now()
);

-- =============================================================================
-- Row Level Security (RLS) Policies
-- =============================================================================
alter table public.profiles enable row level security;
alter table public.experiments enable row level security;
alter table public.experiment_contents enable row level security;
alter table public.transcript_segments enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_options enable row level security;
alter table public.classrooms enable row level security;
alter table public.classroom_memberships enable row level security;
alter table public.classroom_assignments enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.quiz_responses enable row level security;
alter table public.student_experiment_progress enable row level security;
alter table public.topic_performance enable row level security;
alter table public.experiment_recommendations enable row level security;
alter table public.ai_conversation_sessions enable row level security;
alter table public.ai_response_feedback enable row level security;

-- Public Read Access for Published Experiments & Educational Content
create policy "Public read published experiments"
  on public.experiments for select
  using (is_published = true);

create policy "Public read experiment contents"
  on public.experiment_contents for select
  using (true);

create policy "Public read approved transcripts"
  on public.transcript_segments for select
  using (review_status = 'approved');

create policy "Public read quiz questions"
  on public.quiz_questions for select
  using (true);

-- Students manage their own profile, progress, quiz attempts, and recommendations
create policy "Users read/update own profile"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Students manage own experiment progress"
  on public.student_experiment_progress for all
  using (auth.uid() = student_id)
  with check (auth.uid() = student_id);

create policy "Students read/insert own quiz attempts"
  on public.quiz_attempts for all
  using (auth.uid() = student_id)
  with check (auth.uid() = student_id);

create policy "Students read own topic performance"
  on public.topic_performance for select
  using (auth.uid() = student_id);

create policy "Students read own recommendations"
  on public.experiment_recommendations for select
  using (auth.uid() = student_id);

-- Teachers can read attempts for students enrolled in their classrooms
create policy "Teachers view classroom student attempts"
  on public.quiz_attempts for select
  using (
    exists (
      select 1
      from public.classroom_assignments ca
      join public.classrooms c on c.id = ca.classroom_id
      where ca.id = quiz_attempts.assignment_id
        and c.teacher_id = auth.uid()
    )
  );
