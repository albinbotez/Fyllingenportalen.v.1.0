-- Fyllingenportalen v1.0 - databaseskjema (Supabase / Postgres)

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null default 'utover' check (role in ('utover', 'trener', 'admin')),
  group_level text,
  created_at timestamptz default now()
);

create table if not exists exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  description text,
  created_at timestamptz default now()
);

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid references profiles(id),
  title text,
  date date not null,
  type text default 'trening',
  description text,
  status text default 'planlagt',
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

create table if not exists session_exercises (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade,
  exercise_id uuid references exercises(id),
  exercise_name text,
  sets int,
  reps int,
  notes text
);

create table if not exists records (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid references profiles(id),
  discipline text not null,
  result_seconds numeric,
  result_value text,
  recorded_at timestamptz default now(),
  unique (athlete_id, discipline, recorded_at)
);

create table if not exists injuries (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid references profiles(id),
  description text,
  status text default 'aktiv',
  reported_at timestamptz default now()
);

create table if not exists suggested_sessions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  group_level text,
  description text,
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

alter table profiles enable row level security;
alter table sessions enable row level security;
alter table records enable row level security;
alter table injuries enable row level security;

create policy "Utovere ser eget, trenere ser alt" on sessions
  for select using (
    auth.uid() = athlete_id
    or exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('trener', 'admin'))
  );

create policy "Utovere ser eget, trenere ser alt records" on records
  for select using (
    auth.uid() = athlete_id
    or exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('trener', 'admin'))
  );
