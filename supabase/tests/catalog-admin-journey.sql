begin;
insert into auth.users(id,email,email_confirmed_at,raw_app_meta_data) values
('f4000000-0000-4000-8000-000000000001','qa-admin@example.invalid',now(),'{"role":"admin"}'),
('f4000000-0000-4000-8000-000000000002','qa-role@example.invalid',now(),'{"role":"student"}');
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"f4000000-0000-4000-8000-000000000001","role":"authenticated","app_metadata":{"role":"admin"}}',true);
do $$ declare row jsonb; edited jsonb; saved timestamptz; result jsonb; begin
 select item into row from jsonb_array_elements(public.read_admin_catalog()) item where item->>'slug'='red-cabbage-ph-indicator';
 if row is null then raise exception 'Admin catalog missing'; end if;
 edited:=jsonb_set(row->'data','{title,en}','"QA Updated Title"');
 edited:=jsonb_set(edited,'{quiz,0,options,0,isCorrect}','true');
 edited:=jsonb_set(edited,'{quiz,0,options,1,isCorrect}','false');
 saved:=public.save_admin_catalog(edited,'published',(row->>'updated_at')::timestamptz);
 result:=public.get_quiz_feedback('red-cabbage-ph-indicator','q1','a');
 if result->'response'->>'isCorrect'<>'true' then raise exception 'Feedback did not use edited quiz'; end if;
 if exists(select 1 from public.experiment_publications where slug='red-cabbage-ph-indicator' and data::text like '%isCorrect%') then raise exception 'Public answer key leaked'; end if;
 begin perform public.save_admin_catalog(edited,'published',(row->>'updated_at')::timestamptz); raise exception 'Stale save allowed'; exception when raise_exception then if sqlerrm<>'Content changed; reload before saving' then raise; end if; end;
 perform public.set_admin_user_role('f4000000-0000-4000-8000-000000000002','teacher');
 if not exists(select 1 from jsonb_array_elements(public.read_admin_users()) u where u->>'id'='f4000000-0000-4000-8000-000000000002' and u->>'role'='teacher') then raise exception 'Role not persisted'; end if;
end $$;
select set_config('request.jwt.claims','{"sub":"f4000000-0000-4000-8000-000000000002","role":"authenticated","app_metadata":{"role":"student"}}',true);
do $$ declare n integer; begin
 begin perform public.read_admin_catalog(); raise exception 'Student read admin catalog'; exception when insufficient_privilege then null; end;
 begin perform public.read_admin_users(); raise exception 'Student read accounts'; exception when insufficient_privilege then null; end;
 for n in 1..50 loop if not public.consume_ai_request() then raise exception 'Premature budget denial'; end if; end loop;
 if public.consume_ai_request() then raise exception 'Daily AI cap bypassed'; end if;
end $$;
set local role anon;
select set_config('request.jwt.claims','{"role":"anon"}',true);
do $$ declare result jsonb; begin
 result:=public.get_quiz_feedback('red-cabbage-ph-indicator','q1',null,'hint');
 if result ? 'response' or result ? 'correctOptionId' then raise exception 'Hint disclosed grading'; end if;
end $$;
rollback;
