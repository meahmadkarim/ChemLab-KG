create function public.share_teacher_notebook(p_slug text,p_classrooms uuid[],p_sections text[]) returns void language plpgsql security invoker set search_path='' as $$
declare nb public.teacher_lab_notebooks; snapshot jsonb; class_id uuid;
begin
 if auth.uid() is null or coalesce(auth.jwt()->'app_metadata'->>'role','') not in ('teacher','admin') then raise exception 'Teacher required' using errcode='42501'; end if;
 if coalesce(cardinality(p_classrooms),0) not between 1 and 50 or coalesce(cardinality(p_sections),0) not between 1 and 4 or not p_sections <@ array['aim_hypothesis','procedure','observations','conclusion'] then raise exception 'Invalid sharing selection'; end if;
 select * into strict nb from public.teacher_lab_notebooks where teacher_id=auth.uid() and experiment_slug=p_slug for update;
 if exists(select 1 from unnest(p_classrooms) c where not exists(select 1 from public.learning_classrooms l where l.id=c and l.teacher_id=auth.uid())) then raise exception 'Classroom ownership required' using errcode='42501'; end if;
 snapshot:=jsonb_build_object('aim',case when 'aim_hypothesis'=any(p_sections) then nb.aim else '' end,'researchQuestion',case when 'aim_hypothesis'=any(p_sections) then nb.research_question else '' end,'hypothesis',case when 'aim_hypothesis'=any(p_sections) then nb.hypothesis else '' end,'procedureSteps',case when 'procedure'=any(p_sections) then nb.procedure_steps else '[]'::jsonb end,'expectedObservations',case when 'observations'=any(p_sections) then nb.expected_observations else '' end,'actualObservations',case when 'observations'=any(p_sections) then nb.actual_observations else '' end,'measurements',case when 'observations'=any(p_sections) then nb.measurements else '' end,'explanatoryNotes',case when 'observations'=any(p_sections) then nb.explanatory_notes else '' end,'results',case when 'conclusion'=any(p_sections) then nb.results else '' end,'conclusion',case when 'conclusion'=any(p_sections) then nb.conclusion else '' end,'teachingGuidance','');
 foreach class_id in array p_classrooms loop
 insert into public.teacher_notebook_shares(notebook_id,teacher_id,classroom_id,experiment_slug,shared_sections,published_snapshot) values(nb.id,auth.uid(),class_id,p_slug,p_sections,snapshot)
 on conflict(notebook_id,classroom_id) do update set shared_sections=excluded.shared_sections,published_snapshot=excluded.published_snapshot,version=public.teacher_notebook_shares.version+1,updated_at=now();
 end loop;
 update public.teacher_lab_notebooks set status='published',updated_at=now() where id=nb.id;
end $$;
create function public.revoke_teacher_notebook_shares(p_slug text,p_classroom uuid default null) returns boolean language plpgsql security invoker set search_path='' as $$
declare nb public.teacher_lab_notebooks; removed integer;
begin
 if auth.uid() is null or coalesce(auth.jwt()->'app_metadata'->>'role','') not in ('teacher','admin') then raise exception 'Teacher required' using errcode='42501'; end if;
 select * into nb from public.teacher_lab_notebooks where teacher_id=auth.uid() and experiment_slug=p_slug for update;
 if not found then return false; end if;
 delete from public.teacher_notebook_shares where notebook_id=nb.id and (p_classroom is null or classroom_id=p_classroom);
 get diagnostics removed=row_count;
 if not exists(select 1 from public.teacher_notebook_shares where notebook_id=nb.id) then update public.teacher_lab_notebooks set status='draft',updated_at=now() where id=nb.id; end if;
 return removed>0;
end $$;
revoke all on function public.share_teacher_notebook(text,uuid[],text[]),public.revoke_teacher_notebook_shares(text,uuid) from public,anon;
grant execute on function public.share_teacher_notebook(text,uuid[],text[]),public.revoke_teacher_notebook_shares(text,uuid) to authenticated;
