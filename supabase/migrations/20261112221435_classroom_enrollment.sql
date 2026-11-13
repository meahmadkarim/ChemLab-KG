create function private.join_classroom(p_code text) returns uuid
language plpgsql security definer set search_path='' as $$
declare v_user uuid:=auth.uid(); v_class uuid;
begin
 if v_user is null then raise exception 'Authentication required' using errcode='42501'; end if;
 if length(p_code)>20 then raise exception 'Invalid code'; end if;
 if (select count(*) from public.learning_memberships where student_id=v_user and joined_at>now()-interval '1 day')>=10 then raise exception 'Daily enrollment limit reached'; end if;
 select id into v_class from public.learning_classrooms where join_code=upper(trim(p_code));
 if not found then raise exception 'Classroom not found'; end if;
 insert into public.learning_memberships(classroom_id,student_id) values(v_class,v_user) on conflict do nothing;
 return v_class;
end $$;
revoke all on function private.join_classroom(text) from public,anon;
grant execute on function private.join_classroom(text) to authenticated;
create function public.join_learning_classroom(p_code text) returns uuid language sql security invoker set search_path='' as $$select private.join_classroom(p_code);$$;
revoke all on function public.join_learning_classroom(text) from public,anon;
grant execute on function public.join_learning_classroom(text) to authenticated;
