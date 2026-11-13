-- =============================================================================
-- ChemLab KG — User Profiles & Avatars Extension (Migration 0002)
-- Adds bio, school, avatar_url, email to public.profiles and configures
-- the avatars storage bucket with secure Row-Level Security (RLS) policies.
-- =============================================================================

-- 1. Extend public.profiles
alter table if exists public.profiles
  add column if not exists email text,
  add column if not exists bio text check (char_length(bio) <= 280),
  add column if not exists school text check (char_length(school) <= 100),
  add column if not exists avatar_url text;

-- 2. Verify RLS is enabled on profiles
alter table public.profiles enable row level security;

-- Drop existing overlapping policies if any to ensure idempotency
drop policy if exists "Profiles are viewable by authenticated users" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;

-- Allow users to view their own profile (and teachers to view enrolled students)
create policy "Profiles are viewable by authenticated users"
  on public.profiles
  for select
  to authenticated
  using (true);

-- Allow users to update their own profile fields
create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Allow users to insert their own profile on signup
create policy "Users can insert own profile"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

-- 3. Configure Supabase Storage Bucket for Avatars
-- Insert 'avatars' into storage.buckets if storage extension exists
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  2097152, -- 2MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 2097152,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

-- Storage RLS Policies for avatars bucket
-- Files are organized as avatars/<user_id>/avatar.<ext>
drop policy if exists "Avatar images are publicly readable" on storage.objects;
drop policy if exists "Users can upload their own avatar" on storage.objects;
drop policy if exists "Users can update their own avatar" on storage.objects;
drop policy if exists "Users can delete their own avatar" on storage.objects;

create policy "Avatar images are publicly readable"
  on storage.objects
  for select
  to public
  using (bucket_id = 'avatars');

create policy "Users can upload their own avatar"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'avatars' and
    (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update their own avatar"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'avatars' and
    (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'avatars' and
    (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete their own avatar"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'avatars' and
    (storage.foldername(name))[1] = auth.uid()::text
  );
