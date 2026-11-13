create table public.experiment_publications (
 slug text primary key,
 data jsonb not null,
 status text not null default 'draft' check(status in ('draft','published','archived')),
 updated_at timestamptz not null default now()
);
alter table public.experiment_publications enable row level security;
revoke all on public.experiment_publications from anon,authenticated;
grant select on public.experiment_publications to anon,authenticated;
grant insert,update on public.experiment_publications to authenticated;
create policy published_catalog on public.experiment_publications for select to anon,authenticated using(status='published');
create policy admin_catalog on public.experiment_publications for all to authenticated using((select auth.jwt()->'app_metadata'->>'role')='admin') with check((select auth.jwt()->'app_metadata'->>'role')='admin');
create policy deny_client_answers on private.quiz_catalog for select to authenticated using(false);
