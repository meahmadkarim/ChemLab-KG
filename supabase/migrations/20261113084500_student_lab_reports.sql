-- ChemLab KG: Student Laboratory Notebook & Teacher Report Reviews
-- Provides persistent storage for student experiment reports and teacher evaluations.

create table if not exists public.student_lab_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  experiment_slug text not null,
  assignment_id uuid references public.learning_assignments(id) on delete set null,
  mode text not null check(mode in ('video_observation','supervised_lab')) default 'video_observation',
  aim text not null default '',
  research_question text not null default '',
  hypothesis text not null default '',
  procedure_steps jsonb not null default '[]'::jsonb,
  observations text not null default '',
  results text not null default '',
  conclusion text not null default '',
  status text not null check(status in ('draft','submitted','reviewed')) default 'draft',
  teacher_feedback text not null default '',
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null,
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Unique index so each student has one active report per experiment (and optional assignment)
create unique index if not exists lab_reports_user_exp_assignment_idx
  on public.student_lab_reports(user_id, experiment_slug, coalesce(assignment_id, '00000000-0000-0000-0000-000000000000'::uuid));

create index if not exists lab_reports_user_idx on public.student_lab_reports(user_id, updated_at desc);
create index if not exists lab_reports_assignment_idx on public.student_lab_reports(assignment_id);

alter table public.student_lab_reports enable row level security;
revoke all on public.student_lab_reports from public, anon, authenticated;
grant select, insert, update, delete on public.student_lab_reports to authenticated;

-- Students can read, create, and update their own lab reports
create policy own_lab_reports on public.student_lab_reports for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- Authorized teachers can view submitted reports for assignments in their classrooms
create policy teacher_read_reports on public.student_lab_reports for select to authenticated
  using (
    status in ('submitted','reviewed') and exists (
      select 1 from public.learning_assignments a
      join public.learning_classrooms c on c.id = a.classroom_id
      where a.id = student_lab_reports.assignment_id
        and c.teacher_id = (select auth.uid())
    )
  );

-- Authorized teachers can update feedback and review status on submitted reports in their classrooms
create policy teacher_review_reports on public.student_lab_reports for update to authenticated
  using (
    status in ('submitted','reviewed') and exists (
      select 1 from public.learning_assignments a
      join public.learning_classrooms c on c.id = a.classroom_id
      where a.id = student_lab_reports.assignment_id
        and c.teacher_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.learning_assignments a
      join public.learning_classrooms c on c.id = a.classroom_id
      where a.id = student_lab_reports.assignment_id
        and c.teacher_id = (select auth.uid())
    )
  );

-- RLS identifies eligible rows; this trigger protects review fields and content.
create function private.guard_lab_report() returns trigger language plpgsql security invoker set search_path='' as $$
begin
 if auth.uid() is null then raise exception 'Authentication required' using errcode='42501'; end if;
 if TG_OP='DELETE' then
  if old.user_id<>auth.uid() or old.status<>'draft' then raise exception 'Only your own draft can be deleted' using errcode='42501'; end if;
  return old;
 end if;
 if TG_OP='INSERT' then
  if new.user_id<>auth.uid() or new.status='reviewed' or new.teacher_feedback<>'' or new.reviewed_by is not null or new.reviewed_at is not null then raise exception 'Invalid report owner or review' using errcode='42501'; end if;
 elsif old.user_id=auth.uid() then
  if old.status='reviewed' or new.user_id<>old.user_id or new.assignment_id is distinct from old.assignment_id or new.experiment_slug<>old.experiment_slug or new.id<>old.id or new.status='reviewed' or new.teacher_feedback is distinct from old.teacher_feedback or new.reviewed_by is distinct from old.reviewed_by or new.reviewed_at is distinct from old.reviewed_at then raise exception 'Review fields are protected' using errcode='42501'; end if;
  if old.status='submitted' and (to_jsonb(new)-array['status','updated_at','submitted_at']) is distinct from (to_jsonb(old)-array['status','updated_at','submitted_at']) then raise exception 'Withdraw the report before editing' using errcode='42501'; end if;
 else
  if old.status not in ('submitted','reviewed') or new.status<>'reviewed' or not exists(select 1 from public.learning_assignments a join public.learning_classrooms c on c.id=a.classroom_id where a.id=old.assignment_id and c.teacher_id=auth.uid()) or (to_jsonb(new)-array['status','teacher_feedback','reviewed_at','reviewed_by','updated_at']) is distinct from (to_jsonb(old)-array['status','teacher_feedback','reviewed_at','reviewed_by','updated_at']) then raise exception 'Only the assigned teacher may review submitted work' using errcode='42501'; end if;
  new.reviewed_by:=auth.uid(); new.reviewed_at:=now();
 end if;
 if new.user_id=auth.uid() and new.assignment_id is not null and not exists(select 1 from public.learning_assignments a join public.learning_memberships m on m.classroom_id=a.classroom_id where a.id=new.assignment_id and a.experiment_slug=new.experiment_slug and m.student_id=auth.uid()) then raise exception 'Assignment enrollment required' using errcode='42501'; end if;
 if TG_OP='INSERT' then new.created_at:=now(); end if;
 new.updated_at:=now();
 if new.status='submitted' then new.submitted_at:=coalesce(new.submitted_at,now()); elsif new.status='draft' then new.submitted_at:=null; end if;
 return new;
end $$;
revoke all on function private.guard_lab_report() from public,anon,authenticated;
create trigger guard_lab_report before insert or update or delete on public.student_lab_reports for each row execute function private.guard_lab_report();
