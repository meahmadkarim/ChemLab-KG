alter table public.learning_classrooms add column archived boolean not null default false;
create table private.ai_daily_usage(user_id uuid not null references auth.users(id) on delete cascade, day date not null, requests integer not null default 0,primary key(user_id,day));
alter table private.ai_daily_usage enable row level security;
revoke all on private.ai_daily_usage from public,anon,authenticated;
create policy deny_usage_reads on private.ai_daily_usage for select to authenticated using(false);
create function private.consume_ai_request() returns boolean language plpgsql security definer set search_path='' as $$
declare n integer;
begin
 if auth.uid() is null then return false; end if;
 insert into private.ai_daily_usage(user_id,day,requests) values(auth.uid(),current_date,1)
 on conflict(user_id,day) do update set requests=private.ai_daily_usage.requests+1 where private.ai_daily_usage.requests<50 returning requests into n;
 return n is not null;
end $$;
revoke all on function private.consume_ai_request() from public,anon;
grant execute on function private.consume_ai_request() to authenticated;
create function public.consume_ai_request() returns boolean language sql security invoker set search_path='' as $$select private.consume_ai_request();$$;
revoke all on function public.consume_ai_request() from public,anon;
grant execute on function public.consume_ai_request() to authenticated;

create function private.classroom_roster(p_class uuid) returns jsonb language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null or not exists(select 1 from public.learning_classrooms where id=p_class and teacher_id=auth.uid()) then raise exception 'Classroom owner required' using errcode='42501'; end if;
 return coalesce((select jsonb_agg(jsonb_build_object('id',u.id,'name',coalesce(p.data->>'displayName',u.raw_user_meta_data->>'name','Learner'))) from public.learning_memberships m join auth.users u on u.id=m.student_id left join public.user_profiles p on p.id=u.id where m.classroom_id=p_class),'[]');
end $$;
create function private.remove_classroom_member(p_class uuid,p_student uuid) returns boolean language plpgsql security definer set search_path='' as $$
declare n integer;
begin
 if auth.uid() is null or not exists(select 1 from public.learning_classrooms where id=p_class and teacher_id=auth.uid()) then raise exception 'Classroom owner required' using errcode='42501'; end if;
 delete from public.learning_memberships where classroom_id=p_class and student_id=p_student;
 get diagnostics n=row_count; return n>0;
end $$;
revoke all on function private.classroom_roster(uuid),private.remove_classroom_member(uuid,uuid) from public,anon;
grant execute on function private.classroom_roster(uuid),private.remove_classroom_member(uuid,uuid) to authenticated;
create function public.get_classroom_roster(p_class uuid) returns jsonb language sql security invoker set search_path='' as $$select private.classroom_roster(p_class);$$;
create function public.remove_classroom_member(p_class uuid,p_student uuid) returns boolean language sql security invoker set search_path='' as $$select private.remove_classroom_member(p_class,p_student);$$;
revoke all on function public.get_classroom_roster(uuid),public.remove_classroom_member(uuid,uuid) from public,anon;
grant execute on function public.get_classroom_roster(uuid),public.remove_classroom_member(uuid,uuid) to authenticated;

create or replace function private.join_classroom(p_code text) returns uuid
language plpgsql security definer set search_path='' as $$
declare v_user uuid:=auth.uid(); v_class uuid;
begin
 if v_user is null then raise exception 'Authentication required' using errcode='42501'; end if;
 if length(p_code)>20 then raise exception 'Invalid code'; end if;
 if (select count(*) from public.learning_memberships where student_id=v_user and joined_at>now()-interval '1 day')>=10 then raise exception 'Daily enrollment limit reached'; end if;
 select id into v_class from public.learning_classrooms where join_code=upper(trim(p_code)) and not archived;
 if not found then raise exception 'Classroom not found'; end if;
 insert into public.learning_memberships(classroom_id,student_id) values(v_class,v_user) on conflict do nothing;
 return v_class;
end $$;
