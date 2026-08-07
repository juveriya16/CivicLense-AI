-- GovConnect Admin — core schema
-- Run this in the Supabase SQL editor for a fresh project.

-- ============================================================
-- 1. Profiles (roles live here, one row per auth.users row)
-- ============================================================
create type public.user_role as enum ('super_admin', 'admin');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role public.user_role not null default 'admin',
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Anyone signed in can read the directory (needed for admin management UI,
-- assigning complaints to a name, etc).
create policy "profiles are readable by any authenticated user"
  on public.profiles for select
  using (auth.role() = 'authenticated');

-- A user may update only their own display name — never their own role
-- or approval flag, so nobody can self-promote.
create policy "users can update their own name only"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id and role = (select role from public.profiles where id = auth.uid()));

-- Only a super_admin may change role / is_approved on any row.
create policy "super admins can manage all profiles"
  on public.profiles for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'super_admin'));

create policy "super admins can view all profiles too"
  on public.profiles for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'super_admin'));

-- ============================================================
-- 2. Auto-create a profile row whenever a new auth user signs up.
--    Domain is re-validated server-side as defense in depth —
--    the client already blocks non-.gov.in addresses.
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.email !~* '@gov\.in$' then
    raise exception 'Only @gov.in email addresses may register.';
  end if;

  insert into public.profiles (id, email, full_name, role, is_approved)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'admin',
    false
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- 3. Seed your first super admin manually after they sign up once, e.g.:
--    update public.profiles set role = 'super_admin', is_approved = true
--    where email = 'first.employee@gov.in';
-- ============================================================

-- ============================================================
-- 4. Core domain tables (complaints, duplicates, notifications, settings)
-- ============================================================
create type public.complaint_status as enum ('new', 'in_review', 'in_progress', 'resolved', 'rejected');
create type public.complaint_priority as enum ('low', 'medium', 'high', 'critical');

create table public.complaints (
  id uuid primary key default gen_random_uuid(),
  ticket_no text not null unique,
  title text not null,
  description text,
  category text not null,
  status public.complaint_status not null default 'new',
  priority public.complaint_priority not null default 'medium',
  citizen_name text,
  citizen_contact text,
  latitude double precision,
  longitude double precision,
  address text,
  assigned_to uuid references public.profiles(id),
  sla_due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.complaint_duplicates (
  id uuid primary key default gen_random_uuid(),
  primary_complaint_id uuid not null references public.complaints(id) on delete cascade,
  duplicate_complaint_id uuid not null references public.complaints(id) on delete cascade,
  distance_meters double precision,
  similarity_score double precision,
  status text not null default 'pending', -- pending | confirmed | dismissed
  reviewed_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid references public.profiles(id),
  complaint_id uuid references public.complaints(id) on delete cascade,
  title text not null,
  body text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.routing_settings (
  id uuid primary key default gen_random_uuid(),
  category text not null unique,
  sla_hours integer not null default 72,
  duplicate_radius_meters integer not null default 150,
  updated_by uuid references public.profiles(id),
  updated_at timestamptz not null default now()
);

alter table public.complaints enable row level security;
alter table public.complaint_duplicates enable row level security;
alter table public.notifications enable row level security;
alter table public.routing_settings enable row level security;

create policy "approved staff can read complaints"
  on public.complaints for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_approved));

create policy "approved staff can write complaints"
  on public.complaints for insert with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_approved));

create policy "approved staff can update complaints"
  on public.complaints for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_approved));

create policy "approved staff can read duplicates"
  on public.complaint_duplicates for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_approved));

create policy "approved staff can update duplicates"
  on public.complaint_duplicates for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_approved));

create policy "staff read own notifications"
  on public.notifications for select
  using (recipient_id = auth.uid());

create policy "staff update own notifications"
  on public.notifications for update
  using (recipient_id = auth.uid());

create policy "approved staff can read settings"
  on public.routing_settings for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_approved));

create policy "only super admins can write settings"
  on public.routing_settings for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'super_admin'));
