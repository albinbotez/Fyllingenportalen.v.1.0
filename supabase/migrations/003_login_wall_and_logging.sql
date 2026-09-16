-- Fyllingenportalen - migrasjon 003: innloggingsmur, engangs-admin, oktlogging

alter table profiles alter column role set default 'utover';

create or replace function enforce_single_admin() returns trigger as $$
begin
  if NEW.role in ('trener', 'admin') then
    if exists (
      select 1 from profiles
      where role in ('trener', 'admin') and id <> NEW.id
    ) then
      raise exception 'Kun en trener/admin-konto er tillatt i Fyllingenportalen';
    end if;
  end if;
  return NEW;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_single_admin on profiles;
create trigger trg_single_admin
  before insert or update on profiles
  for each row execute function enforce_single_admin();

-- Per-utover fullforingsstatus pa okter (viktig for gruppe/klubb-okter)
create table if not exists session_completions (
  session_id uuid references sessions(id) on delete cascade,
  athlete_id uuid references profiles(id) on delete cascade,
  status text not null default 'planlagt' check (status in ('planlagt', 'fullfort', 'avbrutt')),
  completed_at timestamptz,
  primary key (session_id, athlete_id)
);

alter table session_completions enable row level security;

drop policy if exists "Utover administrerer egen fullforing" on session_completions;
create policy "Utover administrerer egen fullforing" on session_completions
  for all using (
    auth.uid() = athlete_id
    or exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('trener', 'admin'))
  )
  with check (
    auth.uid() = athlete_id
    or exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('trener', 'admin'))
  );

-- Logg per ovelse: vekt (styrke) eller tid (lopetur/sprint/konkurranse)
create table if not exists exercise_logs (
  id uuid primary key default gen_random_uuid(),
  session_exercise_id uuid references session_exercises(id) on delete cascade,
  athlete_id uuid references profiles(id) on delete cascade,
  weight_kg numeric,
  time_seconds numeric,
  notes text,
  logged_at timestamptz default now(),
  unique (session_exercise_id, athlete_id)
);

alter table exercise_logs enable row level security;

drop policy if exists "Utover administrerer egne logger" on exercise_logs;
create policy "Utover administrerer egne logger" on exercise_logs
  for all using (
    auth.uid() = athlete_id
    or exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('trener', 'admin'))
  )
  with check (
    auth.uid() = athlete_id
    or exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('trener', 'admin'))
  );
