create table private.role_approvals(email text primary key, role text not null check(role in ('teacher','admin')));
alter table private.role_approvals enable row level security;
revoke all on private.role_approvals from public,anon,authenticated;
create policy deny_role_approval_reads on private.role_approvals for select to authenticated using(false);
create function private.apply_verified_role() returns trigger language plpgsql security definer set search_path='' as $$
declare approved_role text;
begin
 -- Runs only as an Auth trigger. The email must have been verified by Supabase Auth.
 if new.email_confirmed_at is not null then
  select role into approved_role from private.role_approvals where email=lower(new.email);
  if found then new.raw_app_meta_data:=coalesce(new.raw_app_meta_data,'{}'::jsonb)||jsonb_build_object('role',approved_role); end if;
 end if;
 return new;
end $$;
revoke all on function private.apply_verified_role() from public,anon,authenticated;
create trigger apply_verified_chemlab_role before insert or update of email_confirmed_at on auth.users for each row execute function private.apply_verified_role();
