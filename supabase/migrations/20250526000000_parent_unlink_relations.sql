-- Phase 6 — Parents may remove their own student_parent_relations links

create policy "Parents delete own relations"
  on public.student_parent_relations for delete
  using (parent_id = auth.uid());
