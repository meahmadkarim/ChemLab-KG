create function private.teacher_progress() returns jsonb language plpgsql security definer set search_path='' as $$
declare v_user uuid:=auth.uid(); v_result jsonb;
begin
 if v_user is null then raise exception 'Authentication required' using errcode='42501'; end if;
 select jsonb_build_object(
 'classrooms',coalesce((select jsonb_agg(jsonb_build_object('id',c.id,'studentCount',(select count(*) from public.learning_memberships m where m.classroom_id=c.id))) from public.learning_classrooms c where c.teacher_id=v_user),'[]'),
 'students',coalesce((select jsonb_agg(row_to_json(s)) from (
   select u.id,coalesce(p.data->>'displayName',u.raw_user_meta_data->>'name','Learner') as name,
   count(distinct a.assignment_id)::text || ' / ' || count(distinct ass.id)::text as completed,
   case when sum(a.total)>0 then round(sum(a.score)::numeric/sum(a.total)*100)::text || '%' else '—' end as "quizScore",
   case when count(a.id)>0 then 'In Progress' else 'Not Started' end as status, 'gray' as "statusTone"
   from public.learning_classrooms c
   join public.learning_memberships m on m.classroom_id=c.id
   join auth.users u on u.id=m.student_id
   left join public.user_profiles p on p.id=u.id
   left join public.learning_assignments ass on ass.classroom_id=c.id
   left join lateral (select * from public.learning_attempts aa where aa.assignment_id=ass.id and aa.user_id=u.id order by aa.completed_at desc limit 1) a on true
   where c.teacher_id=v_user group by u.id,p.data
 ) s),'[]')) into v_result;
 return v_result;
end $$;
revoke all on function private.teacher_progress() from public,anon;
grant execute on function private.teacher_progress() to authenticated;
create function public.get_teacher_progress() returns jsonb language sql security invoker set search_path='' as $$select private.teacher_progress();$$;
revoke all on function public.get_teacher_progress() from public,anon;
grant execute on function public.get_teacher_progress() to authenticated;
