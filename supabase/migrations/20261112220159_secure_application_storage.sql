create table public.user_profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 data jsonb not null default '{}' check (jsonb_typeof(data) = 'object'),
 updated_at timestamptz not null default now()
);
alter table public.user_profiles enable row level security;
grant select, insert, update on public.user_profiles to authenticated;
create policy own_profile on public.user_profiles for all to authenticated using ((select auth.uid())=id) with check ((select auth.uid())=id);

create table public.learning_preferences (
 user_id uuid primary key references auth.users(id) on delete cascade,
 viewed_slugs text[] not null default '{}',
 bookmarked_slugs text[] not null default '{}',
 interests text[] not null default '{}',
 updated_at timestamptz not null default now()
);
alter table public.learning_preferences enable row level security;
grant select, insert, update on public.learning_preferences to authenticated;
create policy own_preferences on public.learning_preferences for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);

create table public.learning_classrooms (
 id uuid primary key default gen_random_uuid(),
 teacher_id uuid not null default auth.uid() references auth.users(id),
 name text not null check(length(name) between 1 and 120),
 join_code text not null unique default upper(substr(replace(gen_random_uuid()::text,'-',''),1,10)),
 created_at timestamptz not null default now()
);
create table public.learning_memberships (
 classroom_id uuid references public.learning_classrooms(id) on delete cascade,
 student_id uuid references auth.users(id) on delete cascade,
 joined_at timestamptz not null default now(),
 primary key(classroom_id,student_id)
);
create index memberships_student_idx on public.learning_memberships(student_id);
create index classrooms_teacher_idx on public.learning_classrooms(teacher_id);
create table public.learning_assignments (
 id uuid primary key default gen_random_uuid(),
 classroom_id uuid not null references public.learning_classrooms(id) on delete cascade,
 experiment_slug text not null,
 due_date timestamptz not null,
 permissions jsonb not null default '{"allowHints":true,"allowAiExplanations":true,"showImmediateFeedback":true,"showCorrectAnswers":true,"allowRetries":true}',
 created_at timestamptz not null default now()
);
create index assignments_classroom_idx on public.learning_assignments(classroom_id);
alter table public.learning_classrooms enable row level security;
alter table public.learning_memberships enable row level security;
alter table public.learning_assignments enable row level security;
grant select,insert,update,delete on public.learning_classrooms,public.learning_assignments to authenticated;
grant select,delete on public.learning_memberships to authenticated;

create policy teacher_classroom on public.learning_classrooms for all to authenticated
 using (teacher_id=(select auth.uid()))
 with check (teacher_id=(select auth.uid()) and (select auth.jwt()->'app_metadata'->>'role') in ('teacher','admin'));
create policy member_classroom on public.learning_classrooms for select to authenticated
 using (exists(select 1 from public.learning_memberships m where m.classroom_id=id and m.student_id=(select auth.uid())));
create policy own_membership on public.learning_memberships for select to authenticated using(student_id=(select auth.uid()));
-- Teacher membership access is supplied by an invoker function after checking classroom ownership.
create policy leave_classroom on public.learning_memberships for delete to authenticated using(student_id=(select auth.uid()));
create policy read_assignments on public.learning_assignments for select to authenticated
 using(exists(select 1 from public.learning_classrooms c where c.id=classroom_id));
create policy teacher_assignments on public.learning_assignments for all to authenticated
 using(exists(select 1 from public.learning_classrooms c where c.id=classroom_id and c.teacher_id=(select auth.uid())))
 with check(exists(select 1 from public.learning_classrooms c where c.id=classroom_id and c.teacher_id=(select auth.uid())));

create table public.learning_attempts (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 assignment_id uuid references public.learning_assignments(id),
 experiment_slug text not null,
 topic_id text not null,
 score integer not null check(score>=0),
 total integer not null check(total>0 and score<=total),
 responses jsonb not null,
 completed_at timestamptz not null default now()
);
create index attempts_user_idx on public.learning_attempts(user_id, completed_at desc);
create index attempts_assignment_idx on public.learning_attempts(assignment_id);
alter table public.learning_attempts enable row level security;
grant select on public.learning_attempts to authenticated;
create policy own_attempts on public.learning_attempts for select to authenticated using(user_id=(select auth.uid()));
create policy teacher_attempts on public.learning_attempts for select to authenticated
 using(exists(select 1 from public.learning_assignments a join public.learning_classrooms c on c.id=a.classroom_id where a.id=assignment_id and c.teacher_id=(select auth.uid())));

create table public.learning_feedback (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
 experiment_slug text not null,
 rating text not null check(rating in ('helpful','not_helpful')),
 created_at timestamptz not null default now()
);
alter table public.learning_feedback enable row level security;
grant insert,select on public.learning_feedback to authenticated;
create policy own_feedback on public.learning_feedback for all to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
 values('avatars','avatars',false,2097152,array['image/png','image/jpeg','image/webp']);
create policy own_avatar_read on storage.objects for select to authenticated using(bucket_id='avatars' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy own_avatar_insert on storage.objects for insert to authenticated with check(bucket_id='avatars' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy own_avatar_update on storage.objects for update to authenticated using(bucket_id='avatars' and (storage.foldername(name))[1]=(select auth.uid())::text) with check(bucket_id='avatars' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy own_avatar_delete on storage.objects for delete to authenticated using(bucket_id='avatars' and (storage.foldername(name))[1]=(select auth.uid())::text);
revoke all on public.user_profiles,public.learning_preferences,public.learning_classrooms,public.learning_memberships,public.learning_assignments,public.learning_attempts,public.learning_feedback from anon,authenticated;
grant select,insert,update on public.user_profiles,public.learning_preferences to authenticated;
grant select,insert,update,delete on public.learning_classrooms,public.learning_assignments to authenticated;
grant select,delete on public.learning_memberships to authenticated;
grant select on public.learning_attempts to authenticated;
grant select,insert on public.learning_feedback to authenticated;
