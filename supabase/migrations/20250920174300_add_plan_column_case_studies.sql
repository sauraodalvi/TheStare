-- Migration: Add `plan` column to `public.case_studies`
-- 0 = free, 1 = paid
-- Safe to run multiple times (IF NOT EXISTS used)

begin;

-- 1) Add column with constraint to only allow 0 or 1
alter table if exists public.case_studies
  add column if not exists plan smallint check (plan in (0,1));

-- 2) Backfill values based on existing boolean `free`
update public.case_studies
  set plan = case when coalesce(free, false) = true then 0 else 1 end
  where plan is null;

-- 3) Index to speed up filtering by plan
create index if not exists case_studies_plan_idx on public.case_studies (plan);

commit;
