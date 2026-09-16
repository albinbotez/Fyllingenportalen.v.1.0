-- Fyllingenportalen - migrasjon 002: admin/trener-funksjonalitet
-- Kjores etter schema.sql

alter table sessions add column if not exists time text;
alter table sessions add column if not exists location text;
alter table sessions add column if not exists assigned_group text;
alter table sessions alter column athlete_id drop not null;

drop policy if exists "Trenere kan administrere okter" on sessions;
create policy "Trenere kan administrere okter" on sessions
  for all using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('trener', 'admin'))
  )
  with check (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('trener', 'admin'))
  );

drop policy if exists "Utovere ser eget og gruppeokter" on sessions;
create policy "Utovere ser eget og gruppeokter" on sessions
  for select using (
    auth.uid() = athlete_id
    or assigned_group is null
    or assigned_group = 'alle'
    or assigned_group = (select group_level from profiles where id = auth.uid())
    or exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('trener', 'admin'))
  );

drop policy if exists "Trenere ser alle profiler" on profiles;
create policy "Trenere ser alle profiler" on profiles
  for select using (
    auth.uid() = id
    or exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('trener', 'admin'))
  );

drop policy if exists "Trenere administrerer records" on records;
create policy "Trenere administrerer records" on records
  for all using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('trener', 'admin'))
    or auth.uid() = athlete_id
  )
  with check (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('trener', 'admin'))
    or auth.uid() = athlete_id
  );
