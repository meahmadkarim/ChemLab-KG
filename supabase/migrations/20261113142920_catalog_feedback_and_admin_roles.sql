create function private.quiz_feedback(p_slug text,p_question text,p_option text,p_mode text,p_assignment uuid) returns jsonb language plpgsql security definer set search_path='' as $$
declare q jsonb; opt jsonb; correct jsonb; topic text; perms jsonb:='{"allowHints":true,"allowAiExplanations":true,"showImmediateFeedback":true,"showCorrectAnswers":true}'; assignment public.learning_assignments;
begin
 if p_mode not in ('check','hint','mistake','more') then raise exception 'Invalid mode'; end if;
 if not exists(select 1 from public.experiment_publications where slug=p_slug and status='published') then raise exception 'Experiment not found'; end if;
 if p_assignment is not null then
  if auth.uid() is null then raise exception 'Sign in required' using errcode='42501'; end if;
  select * into assignment from public.learning_assignments where id=p_assignment and experiment_slug=p_slug;
  if not found or assignment.due_date<now() or not (exists(select 1 from public.learning_memberships where classroom_id=assignment.classroom_id and student_id=auth.uid()) or exists(select 1 from public.learning_classrooms where id=assignment.classroom_id and teacher_id=auth.uid())) then raise exception 'Assignment unavailable' using errcode='42501'; end if;
  perms:=perms||assignment.permissions;
 end if;
 select item, c.topic_id into q,topic from private.quiz_catalog c cross join lateral jsonb_array_elements(c.questions) item where c.slug=p_slug and item->>'id'=p_question;
 if q is null then raise exception 'Question not found'; end if;
 if p_mode='hint' then
  if not (perms->>'allowHints')::boolean then raise exception 'Hints disabled' using errcode='42501'; end if;
  return jsonb_build_object('hint',coalesce(q->'hint','{"en":"Review the observations and the scientific explanation.","ru":"Повторите наблюдения и научное объяснение.","ky":"Байкоолорду жана илимий түшүндүрмөнү карап чыгыңыз."}'::jsonb),'conceptTag',coalesce(q->>'conceptTag',topic));
 end if;
 if p_mode in ('mistake','more') and (not (perms->>'allowAiExplanations')::boolean or not (perms->>'showCorrectAnswers')::boolean) then raise exception 'Explanations disabled' using errcode='42501'; end if;
 select item into opt from jsonb_array_elements(q->'options') item where item->>'id'=p_option;
 if opt is null then raise exception 'Option not found'; end if;
 select item into correct from jsonb_array_elements(q->'options') item where (item->>'isCorrect')::boolean;
 return jsonb_strip_nulls(jsonb_build_object(
 'response',jsonb_strip_nulls(jsonb_build_object('questionId',p_question,'selectedOptionId',p_option,'conceptTag',coalesce(q->>'conceptTag',topic),'isCorrect',case when (perms->>'showImmediateFeedback')::boolean then opt->'isCorrect' end,'misconceptionTag',case when (perms->>'showImmediateFeedback')::boolean then opt->'misconceptionTag' end)),
 'explanation',case when (perms->>'showCorrectAnswers')::boolean and ((perms->>'showImmediateFeedback')::boolean or p_mode<>'check') then opt->'explanation' else '{"en":"Answer recorded.","ru":"Ответ записан.","ky":"Жооп сакталды."}'::jsonb end,
 'correctOptionId',case when (perms->>'showCorrectAnswers')::boolean and (perms->>'showImmediateFeedback')::boolean then correct->>'id' end,
 'misconceptionLabel',case when p_mode in ('mistake','more') then opt->'misconceptionLabel' end));
end $$;
revoke all on function private.quiz_feedback(text,text,text,text,uuid) from public;
grant usage on schema private to anon;
grant execute on function private.quiz_feedback(text,text,text,text,uuid) to anon,authenticated;
create function public.get_quiz_feedback(p_slug text,p_question text,p_option text default null,p_mode text default 'check',p_assignment uuid default null) returns jsonb language sql security invoker set search_path='' as $$select private.quiz_feedback(p_slug,p_question,p_option,p_mode,p_assignment);$$;
revoke all on function public.get_quiz_feedback(text,text,text,text,uuid) from public;
grant execute on function public.get_quiz_feedback(text,text,text,text,uuid) to anon,authenticated;

create function private.is_current_admin() returns boolean language sql security definer stable set search_path='' as $$select auth.uid() is not null and exists(select 1 from auth.users where id=auth.uid() and email_confirmed_at is not null and raw_app_meta_data->>'role'='admin');$$;
revoke all on function private.is_current_admin() from public,anon;
grant execute on function private.is_current_admin() to authenticated;
create function private.admin_users() returns jsonb language plpgsql security definer set search_path='' as $$
begin
 if not private.is_current_admin() then raise exception 'Admin required' using errcode='42501'; end if;
 return coalesce((select jsonb_agg(u) from (select id,email,coalesce(raw_user_meta_data->>'name','Learner') as name,coalesce(raw_app_meta_data->>'role','student') as role,raw_user_meta_data->>'requested_role' as requested_role,email_confirmed_at is not null as confirmed from auth.users order by created_at desc limit 500) u),'[]');
end $$;
create function private.set_user_role(p_user uuid,p_role text) returns void language plpgsql security definer set search_path='' as $$
declare target_email text;
begin
 if not private.is_current_admin() then raise exception 'Admin required' using errcode='42501'; end if;
 if p_role not in ('student','teacher','admin') or (p_user=auth.uid() and p_role<>'admin') then raise exception 'Invalid role change'; end if;
 select email into target_email from auth.users where id=p_user and email_confirmed_at is not null;
 if not found then raise exception 'Verified account required'; end if;
 update auth.users set raw_app_meta_data=coalesce(raw_app_meta_data,'{}'::jsonb)||jsonb_build_object('role',p_role,'teacher_status',case when p_role='teacher' then 'approved' else null end) where id=p_user;
 if p_role='student' then delete from private.role_approvals where email=lower(target_email);
 else insert into private.role_approvals(email,role) values(lower(target_email),p_role) on conflict(email) do update set role=excluded.role; end if;
end $$;
revoke all on function private.admin_users(),private.set_user_role(uuid,text) from public,anon;
grant execute on function private.admin_users(),private.set_user_role(uuid,text) to authenticated;
create function public.read_admin_users() returns jsonb language sql security invoker set search_path='' as $$select private.admin_users();$$;
create function public.set_admin_user_role(p_user uuid,p_role text) returns void language sql security invoker set search_path='' as $$select private.set_user_role(p_user,p_role);$$;
revoke all on function public.read_admin_users(),public.set_admin_user_role(uuid,text) from public,anon;
grant execute on function public.read_admin_users(),public.set_admin_user_role(uuid,text) to authenticated;
revoke insert,update,delete on public.experiment_publications from authenticated;
create or replace function private.admin_catalog() returns jsonb language plpgsql security definer set search_path='' as $$
begin
 if not private.is_current_admin() then raise exception 'Admin required' using errcode='42501'; end if;
 return coalesce((select jsonb_agg(jsonb_build_object('slug',p.slug,'status',p.status,'updated_at',p.updated_at,'data',p.data||jsonb_build_object('quiz',q.questions))) from public.experiment_publications p join private.quiz_catalog q on q.slug=p.slug),'[]');
end $$;
create or replace function private.save_catalog(p_data jsonb,p_status text,p_expected timestamptz) returns timestamptz language plpgsql security definer set search_path='' as $$
declare v_slug text:=p_data->>'slug'; v_questions jsonb:=p_data->'quiz'; v_public jsonb; v_now timestamptz:=clock_timestamp(); v_previous timestamptz;
begin
 if not private.is_current_admin() then raise exception 'Admin required' using errcode='42501'; end if;
 if p_status not in ('published','draft','archived') or v_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$' or length(v_slug)>160 then raise exception 'Invalid content'; end if;
 if jsonb_typeof(v_questions)<>'array' or jsonb_array_length(v_questions) not between 1 and 20 then raise exception 'Quiz required'; end if;
 perform pg_advisory_xact_lock(78273912);
 select updated_at into v_previous from public.experiment_publications where slug=v_slug for update;
 if found then
  if p_expected is null or v_previous<>p_expected then raise exception 'Content changed; reload before saving'; end if;
 elsif (select count(*) from public.experiment_publications)>=30 then raise exception 'Catalog maximum is 30'; end if;
 if exists(select 1 from jsonb_array_elements(v_questions) q where (select count(*) from jsonb_array_elements(q->'options') o where (o->>'isCorrect')::boolean)<>1) then raise exception 'Each question needs one correct answer'; end if;
 select jsonb_agg(jsonb_build_object('id',q->>'id','prompt',q->'prompt','conceptTag',q->'conceptTag','options',
   (select jsonb_agg(jsonb_build_object('id',o->>'id','text',o->'text')) from jsonb_array_elements(q->'options') o))) into v_public from jsonb_array_elements(v_questions) q;
 insert into public.experiment_publications(slug,data,status,updated_at) values(v_slug,p_data||jsonb_build_object('quiz',v_public),p_status,v_now)
 on conflict(slug) do update set data=excluded.data,status=excluded.status,updated_at=excluded.updated_at;
 insert into private.quiz_catalog(slug,topic_id,questions) values(v_slug,p_data->>'topicId',v_questions)
 on conflict(slug) do update set topic_id=excluded.topic_id,questions=excluded.questions;
 return v_now;
end $$;
