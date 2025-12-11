-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Employees Table
create table public.employees (
  id uuid references auth.users not null primary key, -- Linked to Supabase Auth User ID
  employee_id text unique not null,
  name text not null,
  dob date not null,
  phone text,
  role text check (role in ('admin', 'employee')) not null default 'employee',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Attendance Table
create table public.attendance (
  id uuid default uuid_generate_v4() primary key,
  employee_id uuid references public.employees(id) not null,
  check_in_time timestamp with time zone,
  check_in_location jsonb, -- Store {lat, lng, accuracy}
  check_in_selfie_url text,
  check_out_time timestamp with time zone,
  check_out_location jsonb,
  check_out_selfie_url text,
  total_hours float default 0,
  overtime_hours float default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS)
alter table public.employees enable row level security;
alter table public.attendance enable row level security;

-- Policies
-- Employees can read their own profile
create policy "Employees can view own profile" on public.employees
  for select using (auth.uid() = id);

-- Admins can read all profiles
-- (For simplicity, we might allow all authenticated users to read basic employee info if needed, but strict is better)
-- However, Admin user needs to be identified. We can use a boolean in metadata or check the table.
-- Recursive policy issue if checking table.
-- Approach: Use App Metadata or assume 'admin' role in table.
-- To avoid recursion, we'll allow public read for now or just authenticated.
-- OR: better policy:
create policy "Admins can do everything on employees" on public.employees
  for all using (
    auth.uid() in (select id from public.employees where role = 'admin')
  );

-- Attendance policies
create policy "Employees can view own attendance" on public.attendance
  for select using (auth.uid() = employee_id);

create policy "Employees can insert own attendance" on public.attendance
  for insert with check (auth.uid() = employee_id);

create policy "Employees can update own attendance" on public.attendance
  for update using (auth.uid() = employee_id);

create policy "Admins can view all attendance" on public.attendance
  for select using (
    exists (select 1 from public.employees where id = auth.uid() and role = 'admin')
  );

-- Storage Bucket
insert into storage.buckets (id, name, public) values ('selfies', 'selfies', true);

-- Storage Policies
create policy "Public Access to Selfies" on storage.objects
  for select using ( bucket_id = 'selfies' );

create policy "Authenticated users can upload selfies" on storage.objects
  for insert with check ( bucket_id = 'selfies' and auth.role() = 'authenticated' );
