create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;
create table private.quiz_catalog(slug text primary key, topic_id text not null, questions jsonb not null);
alter table private.quiz_catalog enable row level security;
revoke all on private.quiz_catalog from public, anon, authenticated;

create function private.grade_quiz(p_slug text, p_answers jsonb, p_assignment uuid default null)
returns jsonb language plpgsql security definer set search_path='' as $$
declare
 v_user uuid := auth.uid(); v_quiz private.quiz_catalog; v_question jsonb; v_option jsonb;
 v_selected text; v_score integer:=0; v_responses jsonb:='[]'; v_attempt public.learning_attempts;
 v_assignment public.learning_assignments; v_count integer;
begin
 if v_user is null then raise exception 'Authentication required' using errcode='42501'; end if;
 select * into v_quiz from private.quiz_catalog where slug=p_slug;
 if not found or jsonb_typeof(p_answers)<>'array' then raise exception 'Invalid quiz'; end if;
 if jsonb_array_length(p_answers)<>jsonb_array_length(v_quiz.questions) then raise exception 'Answer every question'; end if;
 if p_assignment is not null then
   select a.* into v_assignment from public.learning_assignments a
   join public.learning_memberships m on m.classroom_id=a.classroom_id and m.student_id=v_user
   where a.id=p_assignment and a.experiment_slug=p_slug;
   if not found then raise exception 'Assignment not accessible' using errcode='42501'; end if;
   perform pg_advisory_xact_lock(hashtextextended(v_user::text || p_assignment::text,0));
   if v_assignment.due_date < now() then raise exception 'Assignment is closed'; end if;
   if not coalesce((v_assignment.permissions->>'allowRetries')::boolean,false)
     and exists(select 1 from public.learning_attempts where user_id=v_user and assignment_id=p_assignment)
     then raise exception 'Retry not permitted'; end if;
 end if;
 for v_question in select value from jsonb_array_elements(v_quiz.questions) loop
   select count(*), min(value->>'selectedOptionId') into v_count,v_selected
     from jsonb_array_elements(p_answers) where value->>'questionId'=v_question->>'id';
   if v_count<>1 then raise exception 'Invalid or duplicate question'; end if;
   select value into v_option from jsonb_array_elements(v_question->'options') where value->>'id'=v_selected;
   if not found then raise exception 'Invalid answer option'; end if;
   if (v_option->>'isCorrect')::boolean then v_score:=v_score+1; end if;
   v_responses:=v_responses || jsonb_build_array(jsonb_build_object(
     'questionId',v_question->>'id','selectedOptionId',v_selected,'isCorrect',(v_option->>'isCorrect')::boolean,
     'conceptTag',v_quiz.topic_id,'misconceptionTag',v_option->>'misconceptionTag'));
 end loop;
 insert into public.learning_attempts(user_id,assignment_id,experiment_slug,topic_id,score,total,responses)
 values(v_user,p_assignment,p_slug,v_quiz.topic_id,v_score,jsonb_array_length(v_quiz.questions),v_responses)
 returning * into v_attempt;
 return to_jsonb(v_attempt);
end $$;
revoke all on function private.grade_quiz(text,jsonb,uuid) from public,anon;
grant execute on function private.grade_quiz(text,jsonb,uuid) to authenticated;
create function public.submit_learning_quiz(p_slug text,p_answers jsonb,p_assignment uuid default null)
returns jsonb language sql security invoker set search_path='' as $$ select private.grade_quiz(p_slug,p_answers,p_assignment); $$;
revoke all on function public.submit_learning_quiz(text,jsonb,uuid) from public,anon;
grant execute on function public.submit_learning_quiz(text,jsonb,uuid) to authenticated;
