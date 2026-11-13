-- ChemLab KG: Role-Based Teacher Lab Notebook & Classroom Sharing
-- Provides persistent storage for teacher experimental notes, immutable published snapshots, and secure classroom sharing.

create table if not exists public.teacher_lab_notebooks (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references auth.users(id) on delete cascade,
  experiment_slug text not null,
  mode text not null check(mode in ('video_observation','supervised_lab')) default 'video_observation',
  aim text not null default '',
  research_question text not null default '',
  hypothesis text not null default '',
  procedure_steps jsonb not null default '[]'::jsonb,
  expected_observations text not null default '',
  actual_observations text not null default '',
  measurements text not null default '',
  explanatory_notes text not null default '',
  results text not null default '',
  conclusion text not null default '',
  teaching_guidance text not null default '',
  status text not null check(status in ('draft','published')) default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (teacher_id, experiment_slug)
);

create index if not exists teacher_notebooks_teacher_idx on public.teacher_lab_notebooks(teacher_id, updated_at desc);
create index if not exists teacher_notebooks_exp_idx on public.teacher_lab_notebooks(experiment_slug);

create table if not exists public.teacher_notebook_shares (
  id uuid primary key default gen_random_uuid(),
  notebook_id uuid not null references public.teacher_lab_notebooks(id) on delete cascade,
  teacher_id uuid not null references auth.users(id) on delete cascade,
  classroom_id uuid not null references public.learning_classrooms(id) on delete cascade,
  experiment_slug text not null,
  shared_sections text[] not null default array[]::text[],
  published_snapshot jsonb not null default '{}'::jsonb,
  version int not null default 1,
  published_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (notebook_id, classroom_id)
);

create index if not exists teacher_shares_classroom_idx on public.teacher_notebook_shares(classroom_id);
create index if not exists teacher_shares_exp_idx on public.teacher_notebook_shares(experiment_slug);

alter table public.teacher_lab_notebooks enable row level security;
alter table public.teacher_notebook_shares enable row level security;

revoke all on public.teacher_lab_notebooks, public.teacher_notebook_shares from public, anon, authenticated;
grant select, insert, update, delete on public.teacher_lab_notebooks to authenticated;
grant select, insert, update, delete on public.teacher_notebook_shares to authenticated;

-- Teachers can fully manage their own private notebook drafts
create policy teacher_manage_own_notebooks on public.teacher_lab_notebooks for all to authenticated
  using (teacher_id = (select auth.uid()) and (select auth.jwt()->'app_metadata'->>'role') in ('teacher','admin'))
  with check (teacher_id = (select auth.uid()) and (select auth.jwt()->'app_metadata'->>'role') in ('teacher','admin'));

-- Teachers can manage their classroom shares for classrooms they teach
create policy teacher_manage_own_shares on public.teacher_notebook_shares for all to authenticated
  using (
    teacher_id = (select auth.uid()) and
    exists (select 1 from public.teacher_lab_notebooks n where n.id=teacher_notebook_shares.notebook_id and n.teacher_id=(select auth.uid()) and n.experiment_slug=teacher_notebook_shares.experiment_slug) and
    exists (
      select 1 from public.learning_classrooms c
      where c.id = teacher_notebook_shares.classroom_id and c.teacher_id = (select auth.uid())
    )
  )
  with check (
    teacher_id = (select auth.uid()) and
    exists (select 1 from public.teacher_lab_notebooks n where n.id=teacher_notebook_shares.notebook_id and n.teacher_id=(select auth.uid()) and n.experiment_slug=teacher_notebook_shares.experiment_slug) and
    exists (
      select 1 from public.learning_classrooms c
      where c.id = teacher_notebook_shares.classroom_id and c.teacher_id = (select auth.uid())
    )
  );

-- Enrolled students can only read published shares for classrooms they are actively enrolled in
create policy student_read_classroom_shares on public.teacher_notebook_shares for select to authenticated
  using (
    exists (
      select 1 from public.learning_memberships m
      where m.classroom_id = teacher_notebook_shares.classroom_id
        and m.student_id = (select auth.uid())
    )
  );
