begin;
insert into auth.users(id,email,raw_app_meta_data,raw_user_meta_data) values
 ('f2000000-0000-4000-8000-000000000001','qa-class-student@example.invalid','{"role":"student"}','{"name":"QA Learner"}'),
 ('f2000000-0000-4000-8000-000000000002','qa-teacher-one@example.invalid','{"role":"teacher"}','{"name":"QA Teacher"}'),
 ('f2000000-0000-4000-8000-000000000003','qa-teacher-two@example.invalid','{"role":"teacher"}','{"name":"Other Teacher"}');
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"f2000000-0000-4000-8000-000000000002","role":"authenticated","app_metadata":{"role":"teacher"}}',true);
insert into public.learning_classrooms(id,name,join_code) values('f2000000-0000-4000-8000-000000000010','QA Classroom','QAONLY1234');
insert into public.learning_assignments(id,classroom_id,experiment_slug,due_date,permissions) values('f2000000-0000-4000-8000-000000000020','f2000000-0000-4000-8000-000000000010','red-cabbage-ph-indicator',now()+interval '1 day','{"allowRetries":false}');
select set_config('request.jwt.claims','{"sub":"f2000000-0000-4000-8000-000000000001","role":"authenticated","app_metadata":{"role":"student"}}',true);
select public.join_learning_classroom('QAONLY1234');
do $$ declare result jsonb; begin
 if not exists(select 1 from public.learning_classrooms where id='f2000000-0000-4000-8000-000000000010') then raise exception 'Joined classroom not visible'; end if;
 result:=public.submit_learning_quiz('red-cabbage-ph-indicator','[{"questionId":"q1","selectedOptionId":"b"},{"questionId":"q2","selectedOptionId":"a"}]','f2000000-0000-4000-8000-000000000020');
 if (result->>'score')::int<>2 then raise exception 'Wrong server score'; end if;
 begin
 perform public.submit_learning_quiz('red-cabbage-ph-indicator','[{"questionId":"q1","selectedOptionId":"b"},{"questionId":"q2","selectedOptionId":"a"}]','f2000000-0000-4000-8000-000000000020');
 raise exception 'Retry incorrectly allowed';
 exception when raise_exception then
 if sqlerrm <> 'Retry not permitted' then raise; end if;
 end;
end $$;
select set_config('request.jwt.claims','{"sub":"f2000000-0000-4000-8000-000000000002","role":"authenticated","app_metadata":{"role":"teacher"}}',true);
do $$ declare result jsonb; begin
 result:=public.get_teacher_progress();
 if jsonb_array_length(result->'students')<>1 then raise exception 'Teacher cannot read own roster'; end if;
 if result->'students'->0->>'quizScore'<>'100%' then raise exception 'Teacher score incorrect'; end if;
end $$;
select set_config('request.jwt.claims','{"sub":"f2000000-0000-4000-8000-000000000003","role":"authenticated","app_metadata":{"role":"teacher"}}',true);
do $$ begin
 if exists(select 1 from public.learning_attempts) then raise exception 'Unrelated teacher sees submissions'; end if;
 if exists(select 1 from public.learning_classrooms) then raise exception 'Unrelated teacher sees classroom'; end if;
 if jsonb_array_length(public.get_teacher_progress()->'students')<>0 then raise exception 'Unrelated teacher sees roster'; end if;
end $$;
rollback;
