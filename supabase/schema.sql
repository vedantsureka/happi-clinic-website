-- Run in Supabase SQL Editor. Set up admin users as instructed in README.
create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  patient_name text not null check (char_length(trim(patient_name)) between 2 and 120),
  phone text not null check (phone ~ '^[6-9][0-9]{9}$'),
  preferred_date date not null,
  preferred_time text not null check (char_length(preferred_time) between 1 and 40),
  service text not null check (char_length(service) between 1 and 120),
  message text not null default '' check (char_length(message) <= 1000),
  consent boolean not null check (consent = true),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  scheduled_date date,
  scheduled_time text,
  admin_note text not null default '' check (char_length(admin_note) <= 1000)
);

create index if not exists appointments_preferred_date_idx on public.appointments (preferred_date);
create index if not exists appointments_created_at_idx on public.appointments (created_at desc);
create index if not exists appointments_status_idx on public.appointments (status);

create or replace function public.set_appointment_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
drop trigger if exists trg_appointments_updated_at on public.appointments;
create trigger trg_appointments_updated_at before update on public.appointments
for each row execute function public.set_appointment_updated_at();

alter table public.admin_users enable row level security;
alter table public.appointments enable row level security;

revoke all on public.admin_users from anon, authenticated;
revoke all on public.appointments from anon, authenticated;
grant select on public.admin_users to authenticated;
grant select, update on public.appointments to authenticated;
grant insert on public.appointments to anon, authenticated;

drop policy if exists admin_users_read_self on public.admin_users;
create policy admin_users_read_self on public.admin_users for select to authenticated
using (user_id = (select auth.uid()));

drop policy if exists patient_can_request on public.appointments;
create policy patient_can_request on public.appointments for insert to anon, authenticated
with check (
  status = 'pending' and scheduled_date is null and scheduled_time is null
  and admin_note = '' and preferred_date >= (now() at time zone 'Asia/Kolkata')::date
);

drop policy if exists admins_can_read on public.appointments;
create policy admins_can_read on public.appointments for select to authenticated
using (exists (select 1 from public.admin_users u where u.user_id = (select auth.uid())));

drop policy if exists admins_can_update on public.appointments;
create policy admins_can_update on public.appointments for update to authenticated
using (exists (select 1 from public.admin_users u where u.user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users u where u.user_id = (select auth.uid())));

-- Enable realtime for the appointments table; safe to rerun.
do $$ begin
  alter publication supabase_realtime add table public.appointments;
exception when duplicate_object then null;
end $$;
