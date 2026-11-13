begin;
insert into auth.users(id,email,raw_app_meta_data) values
 ('f1000000-0000-4000-8000-000000000001','qa-student-one@example.invalid','{"role":"student"}'),
 ('f1000000-0000-4000-8000-000000000002','qa-student-two@example.invalid','{"role":"student"}');
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"f1000000-0000-4000-8000-000000000001","role":"authenticated","app_metadata":{"role":"student"}}',true);
insert into public.learning_preferences(user_id,bookmarked_slugs) values('f1000000-0000-4000-8000-000000000001',array['red-cabbage-ph-indicator']);
do $$ begin
 if has_table_privilege('authenticated','private.quiz_catalog','select') then raise exception 'Answer key is exposed'; end if;
 if has_table_privilege('authenticated','public.learning_attempts','insert') then raise exception 'Direct score writes allowed'; end if;
 begin
 insert into public.learning_preferences(user_id) values('f1000000-0000-4000-8000-000000000002');
 raise exception 'Cross-user insert allowed';
 exception when insufficient_privilege then null; end;
 begin
 insert into public.learning_classrooms(name) values('Unauthorized student classroom');
 raise exception 'Student created classroom';
 exception when insufficient_privilege then null; end;
end $$;
select public.submit_learning_quiz('red-cabbage-ph-indicator','[{"questionId":"q1","selectedOptionId":"b"},{"questionId":"q2","selectedOptionId":"a"}]');
select set_config('request.jwt.claims','{"sub":"f1000000-0000-4000-8000-000000000002","role":"authenticated","app_metadata":{"role":"student"}}',true);
do $$ begin
 if exists(select 1 from public.learning_preferences) then raise exception 'Cross-user preferences visible'; end if;
 if exists(select 1 from public.learning_attempts) then raise exception 'Cross-user attempts visible'; end if;
end $$;
rollback;
