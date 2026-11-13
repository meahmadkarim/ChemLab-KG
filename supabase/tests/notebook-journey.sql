begin;
insert into auth.users(id,email,raw_app_meta_data) values
('f3000000-0000-4000-8000-000000000001','qa-notebook-student@example.invalid','{"role":"student"}'),
('f3000000-0000-4000-8000-000000000002','qa-notebook-teacher@example.invalid','{"role":"teacher"}'),
('f3000000-0000-4000-8000-000000000003','qa-notebook-outsider@example.invalid','{"role":"teacher"}');
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"f3000000-0000-4000-8000-000000000002","role":"authenticated","app_metadata":{"role":"teacher"}}',true);
insert into public.learning_classrooms(id,name,join_code) values('f3000000-0000-4000-8000-000000000010','Notebook QA','QANB123456');
insert into public.learning_assignments(id,classroom_id,experiment_slug,due_date,permissions) values('f3000000-0000-4000-8000-000000000020','f3000000-0000-4000-8000-000000000010','red-cabbage-ph-indicator',now()+interval '1 day','{}');
insert into public.teacher_lab_notebooks(experiment_slug,teacher_id,aim,teaching_guidance) values('red-cabbage-ph-indicator',auth.uid(),'Shared aim','PRIVATE GUIDANCE');
select public.share_teacher_notebook('red-cabbage-ph-indicator',array['f3000000-0000-4000-8000-000000000010'::uuid],array['aim_hypothesis']);
select set_config('request.jwt.claims','{"sub":"f3000000-0000-4000-8000-000000000001","role":"authenticated","app_metadata":{"role":"student"}}',true);
do $$ begin
 if exists(select 1 from public.teacher_notebook_shares) then raise exception 'Unenrolled user sees shares'; end if;
 begin
 insert into public.student_lab_reports(user_id,experiment_slug,assignment_id) values(auth.uid(),'red-cabbage-ph-indicator','f3000000-0000-4000-8000-000000000020');
 raise exception 'Unenrolled assignment allowed';
 exception when insufficient_privilege then null; end;
end $$;
select public.join_learning_classroom('QANB123456');
insert into public.student_lab_reports(id,user_id,experiment_slug,assignment_id,aim,observations,conclusion) values('f3000000-0000-4000-8000-000000000030',auth.uid(),'red-cabbage-ph-indicator','f3000000-0000-4000-8000-000000000020','Aim','Observation','Conclusion');
do $$ begin
 if exists(select 1 from public.teacher_lab_notebooks) then raise exception 'Student sees private notebook'; end if;
 if not exists(select 1 from public.teacher_notebook_shares where published_snapshot->>'aim'='Shared aim' and published_snapshot->>'teachingGuidance'='') then raise exception 'Shared snapshot incorrect'; end if;
 begin
 update public.student_lab_reports set teacher_feedback='Forged',status='reviewed' where id='f3000000-0000-4000-8000-000000000030';
 raise exception 'Student forged review';
 exception when insufficient_privilege then null; end;
end $$;
select set_config('request.jwt.claims','{"sub":"f3000000-0000-4000-8000-000000000002","role":"authenticated","app_metadata":{"role":"teacher"}}',true);
do $$ begin if exists(select 1 from public.student_lab_reports) then raise exception 'Teacher sees unsubmitted draft'; end if; end $$;
select set_config('request.jwt.claims','{"sub":"f3000000-0000-4000-8000-000000000001","role":"authenticated","app_metadata":{"role":"student"}}',true);
update public.student_lab_reports set status='submitted' where id='f3000000-0000-4000-8000-000000000030';
select set_config('request.jwt.claims','{"sub":"f3000000-0000-4000-8000-000000000003","role":"authenticated","app_metadata":{"role":"teacher"}}',true);
do $$ begin
 if exists(select 1 from public.student_lab_reports) or exists(select 1 from public.teacher_notebook_shares) then raise exception 'Outsider sees notebook data'; end if;
end $$;
select set_config('request.jwt.claims','{"sub":"f3000000-0000-4000-8000-000000000002","role":"authenticated","app_metadata":{"role":"teacher"}}',true);
do $$ begin
 begin
 update public.student_lab_reports set aim='Altered',status='reviewed' where id='f3000000-0000-4000-8000-000000000030';
 raise exception 'Teacher altered student content';
 exception when insufficient_privilege then null; end;
end $$;
update public.student_lab_reports set teacher_feedback='Good observation',status='reviewed' where id='f3000000-0000-4000-8000-000000000030';
select public.revoke_teacher_notebook_shares('red-cabbage-ph-indicator');
select set_config('request.jwt.claims','{"sub":"f3000000-0000-4000-8000-000000000001","role":"authenticated","app_metadata":{"role":"student"}}',true);
do $$ begin
 if not exists(select 1 from public.student_lab_reports where teacher_feedback='Good observation' and reviewed_by='f3000000-0000-4000-8000-000000000002') then raise exception 'Review not saved'; end if;
 if exists(select 1 from public.teacher_notebook_shares) then raise exception 'Revoked share visible'; end if;
 begin
 update public.student_lab_reports set aim='Modified' where id='f3000000-0000-4000-8000-000000000030';
 raise exception 'Reviewed report editable';
 exception when insufficient_privilege then null; end;
end $$;
rollback;
