-- Support lesson video paths: courses/{course_id}/{filename} (and legacy {course_id}/{lesson_id}/…)

drop policy if exists "Enrolled students read lesson videos" on storage.objects;

create policy "Enrolled students read lesson videos"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'lesson-videos'
    and (
      (
        (storage.foldername(name))[1] = 'courses'
        and public.student_is_enrolled_in_course(((storage.foldername(name))[2])::uuid)
      )
      or (
        (storage.foldername(name))[1] is not null
        and (storage.foldername(name))[1] <> 'courses'
        and public.student_is_enrolled_in_lesson(((storage.foldername(name))[2])::uuid)
      )
    )
  );
