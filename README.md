# Fyllingenportalen v1.1

Portal for Fyllingen IL Friidrett - publisering av oktplaner, ukesplaner og oppfolging av utovere.

## Funksjoner
- Dashbord med oversikt over kommende okter og status per utover
- Kalender for ukesplaner med tid og sted
- Oktdetaljer og oktformular for trenere (individuell, gruppe eller hele klubben)
- Historikk og progresjonstracking (PR-er, tider, resultater)
- Skaderegistrering og oppfolging
- Forslag/anbefalte okter basert pa gruppe/niva
- **Admin/trener-panel**: oversikt over alle utovere, individuell profilside per utover, publisering av okter med tid/sted, og samlet utviklingsgraf per disiplin for alle utovere
- Innlogging via Supabase Auth (utover- og trenerroller)

## Teknisk stack
- Vite + vanilla JavaScript
- Supabase (Postgres + Auth) som backend
- Chart.js for utviklingsgrafer
- Netlify for deploy

## Kom i gang
1. `npm install`
2. Kopier `.env.example` til `.env` og fyll inn Supabase-nokler
3. Kjor `supabase/schema.sql`, deretter `supabase/migrations/002_admin_coach.sql` i ditt Supabase-prosjekt
4. `npm run dev`

## Admin/trener-panel
Brukere med `role = 'trener'` eller `role = 'admin'` i `profiles`-tabellen far automatisk opp en "Admin"-lenke i menyen, og kan:
- Se alle utovere med antall planlagte okter kommende uke
- Trykke inn pa hver utovers profil (kommende okter, historikk, PR-er, skader)
- Publisere nye okter - tildelt en enkelt utover, en gruppe/niva, eller hele klubben - med dato, klokkeslett og sted
- Se en samlet linjegraf som sammenligner alle utoveres utvikling for en valgt ovelse/distanse

## Fargeprofil (Fyllingen IL Friidrett)
- Primar bla: `#2165AC`
- Aksent gull/gul: `#F2BA03`
- Bakgrunn: `#FFFFFF` / lys gra `#F4F5F7`

Logo ligger som rekonstruert SVG i `src/assets/logo.svg`. Bytt inn original logofil manuelt for 100% norgeoi presisjon.
