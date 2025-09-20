-- Migration: Add a primary key to public.case_studies so rows can be updated from UI
-- Uses UUID primary key. Safe to run multiple times.

begin;

-- Ensure pgcrypto is available for gen_random_uuid()
create extension if not exists pgcrypto;

-- 1) Add id column if missing
alter table if exists public.case_studies
  add column if not exists id uuid;

-- 2) Backfill null ids
update public.case_studies
  set id = gen_random_uuid()
  where id is null;

-- 3) Enforce NOT NULL on id
alter table public.case_studies
  alter column id set not null;

-- 4) Add primary key on id if not already present
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.case_studies'::regclass
      and contype = 'p'
  ) then
    alter table public.case_studies
      add constraint case_studies_pkey primary key (id);
  end if;
end$$;

commit;
