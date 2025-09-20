-- Migration: Add subscription_type_int (0=free, 1=paid) to profiles without dropping existing text column
-- Safe to run multiple times

begin;

-- 1) Add column
alter table if exists public.profiles
  add column if not exists subscription_type_int smallint default 0 not null
  check (subscription_type_int in (0,1));

-- 2) Backfill from existing text subscription_type
update public.profiles
set subscription_type_int = case when subscription_type = 'paid' then 1 else 0 end
where true;

-- 3) Index
create index if not exists idx_profiles_subscription_type_int on public.profiles(subscription_type_int);

commit;
