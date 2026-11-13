create function private.admin_catalog() returns jsonb language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null or coalesce(auth.jwt()->'app_metadata'->>'role','')<>'admin' then raise exception 'Admin required' using errcode='42501'; end if;
 return coalesce((select jsonb_agg(jsonb_build_object('slug',p.slug,'status',p.status,'updated_at',p.updated_at,'data',p.data||jsonb_build_object('quiz',q.questions))) from public.experiment_publications p join private.quiz_catalog q on q.slug=p.slug),'[]');
end $$;
create function private.save_catalog(p_data jsonb,p_status text,p_expected timestamptz) returns timestamptz language plpgsql security definer set search_path='' as $$
declare v_slug text:=p_data->>'slug'; v_questions jsonb:=p_data->'quiz'; v_public jsonb; v_now timestamptz:=clock_timestamp(); v_previous timestamptz;
begin
 if auth.uid() is null or coalesce(auth.jwt()->'app_metadata'->>'role','')<>'admin' then raise exception 'Admin required' using errcode='42501'; end if;
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
revoke all on function private.admin_catalog(),private.save_catalog(jsonb,text,timestamptz) from public,anon;
grant execute on function private.admin_catalog(),private.save_catalog(jsonb,text,timestamptz) to authenticated;
create function public.read_admin_catalog() returns jsonb language sql security invoker set search_path='' as $$select private.admin_catalog();$$;
create function public.save_admin_catalog(p_data jsonb,p_status text,p_expected timestamptz default null) returns timestamptz language sql security invoker set search_path='' as $$select private.save_catalog(p_data,p_status,p_expected);$$;
revoke all on function public.read_admin_catalog(),public.save_admin_catalog(jsonb,text,timestamptz) from public,anon;
grant execute on function public.read_admin_catalog(),public.save_admin_catalog(jsonb,text,timestamptz) to authenticated;
