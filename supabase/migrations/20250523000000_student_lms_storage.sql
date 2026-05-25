-- Phase 4 prep: enrolled students may stream lesson videos from private bucket
-- Path convention: {course_id}/{lesson_id}/{filename}

create policy "Enrolled students read lesson videos"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'lesson-videos'
    and (storage.foldername(name))[2] is not null
    and public.student_is_enrolled_in_lesson(((storage.foldername(name))[2])::uuid)
  );
