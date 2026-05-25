-- =============================================================================
-- Phase 3 — Storage buckets + public published catalog read + lesson-video policies
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Storage buckets
-- -----------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  (
    'lesson-videos',
    'lesson-videos',
    false,
    524288000,
    array['video/mp4', 'video/webm', 'video/quicktime']
  ),
  (
    'assignment-files',
    'assignment-files',
    false,
    52428800,
    array['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  ),
  (
    'submissions',
    'submissions',
    false,
    52428800,
    array['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png']
  )
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- -----------------------------------------------------------------------------
-- Storage RLS: avatars (public read)
-- -----------------------------------------------------------------------------

create policy "Avatar images are publicly accessible"
  on storage.objects for select
  to public
  using (bucket_id = 'avatars');

create policy "Users upload own avatar"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users update own avatar"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users delete own avatar"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- -----------------------------------------------------------------------------
-- Storage RLS: lesson-videos (teachers/admins manage; enrolled read in Phase 4)
-- -----------------------------------------------------------------------------

create policy "Teachers read lesson videos"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'lesson-videos' and public.is_teacher());

create policy "Teachers upload lesson videos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'lesson-videos' and public.is_teacher());

create policy "Teachers update lesson videos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'lesson-videos' and public.is_teacher());

create policy "Teachers delete lesson videos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'lesson-videos' and public.is_teacher());

-- -----------------------------------------------------------------------------
-- Storage RLS: assignment-files + submissions (minimal Phase 3 shell)
-- -----------------------------------------------------------------------------

create policy "Teachers manage assignment files"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'assignment-files' and public.is_teacher())
  with check (bucket_id = 'assignment-files' and public.is_teacher());

create policy "Students upload submissions"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'submissions'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Students read own submissions"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'submissions'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Teachers read submissions for grading"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'submissions' and public.is_teacher());

create policy "Admins full access submissions storage"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'submissions' and public.is_admin())
  with check (bucket_id = 'submissions' and public.is_admin());

-- -----------------------------------------------------------------------------
-- Public catalog: anonymous read of published curriculum (marketing site)
-- -----------------------------------------------------------------------------

create policy "Anonymous read published courses"
  on public.courses for select
  to anon
  using (is_published = true);

create policy "Anonymous read modules of published courses"
  on public.course_modules for select
  to anon
  using (
    exists (
      select 1 from public.courses c
      where c.id = course_id and c.is_published = true
    )
  );

create policy "Anonymous read lesson outline for published courses"
  on public.lessons for select
  to anon
  using (
    is_preview = true
    or exists (
      select 1
      from public.course_modules cm
      join public.courses c on c.id = cm.course_id
      where cm.id = module_id and c.is_published = true
    )
  );
