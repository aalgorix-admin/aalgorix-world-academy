-- Students may remove parent guardian links from their passport hub

create policy "Students delete own parent relations"
  on public.student_parent_relations for delete
  using (student_id = auth.uid());
