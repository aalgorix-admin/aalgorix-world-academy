-- Phase 6 — Parent ↔ student self-service link codes

create table public.parent_link_codes (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  code_digest text not null unique,
  code_hash text not null,
  expires_at timestamptz not null,
  used_at timestamptz,
  used_by_parent_id uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index parent_link_codes_student_idx on public.parent_link_codes (student_id);
create index parent_link_codes_expires_idx on public.parent_link_codes (expires_at);

alter table public.parent_link_codes enable row level security;

create policy "Students manage own parent link codes"
  on public.parent_link_codes for all
  using (
    student_id = auth.uid()
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'student'
    )
  )
  with check (
    student_id = auth.uid()
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'student'
    )
  );

create policy "Admins manage parent link codes"
  on public.parent_link_codes for all
  using (public.is_admin())
  with check (public.is_admin());

-- Students may read profiles of parents they are linked to (settings UI)
create policy "Students view linked parent profiles"
  on public.profiles for select
  using (
    exists (
      select 1
      from public.student_parent_relations spr
      where spr.student_id = auth.uid() and spr.parent_id = profiles.id
    )
  );
