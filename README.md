# Fyllingenportalen v1.2

Portal for Fyllingen IL Friidrett - publisering av oktplaner, ukesplaner og oppfolging av utovere.

## Innloggingsmur
- Landingsside (`/`) lar besokende velge **utover** eller **trener**.
- Utovere logger inn eller registrerer seg selv pa `/login` - alle som registrerer seg far automatisk rollen `utover`.
- Trener logger inn pa `/trener/login` - det finnes **kun en** trener/admin-konto, sikret med en databasetrigger som blokkerer flere trener/admin-profiler.
- Alle andre sider krever innlogging - uinnloggede blir automatisk sendt til landingssiden.

## Funksjoner
- Dashbord og kalender med ukesplan, tid og sted per okt
- Trener publiserer okter (oktplan) - til enkelt utover, gruppe/niva, eller hele klubben
- Utover apner "Se oktplan" fra kalender/dashbord for a se ovelser, sett/rep og notater
- Utover logger **vekt (kg)** pa styrkeokter og **tid (sekunder)** pa lopeokter/sprint/konkurranse, per ovelse
- Utover merker okten som fullfort - status vises i kalender og dashbord
- Historikk og progresjonstracking (PR-er, tider, resultater)
- Skaderegistrering og oppfolging
- **Admin/trener-panel**: oversikt over alle utovere, individuell profilside, og samlet utviklingsgraf per disiplin for alle utovere

## Teknisk stack
- Vite + vanilla JavaScript
- Supabase (Postgres + Auth) som backend
- Chart.js for utviklingsgrafer
- Netlify for deploy

## Kom i gang
1. `npm install`
2. Kopier `.env.example` til `.env` og fyll inn Supabase-nokler
3. Kjor i rekkefolge i Supabase SQL Editor:
   - `supabase/schema.sql`
   - `supabase/migrations/002_admin_coach.sql`
   - `supabase/migrations/003_login_wall_and_logging.sql`
4. Opprett din egen trener-konto: registrer deg via appens signup (blir `utover`), deretter oppdater raden din i `profiles`-tabellen manuelt til `role = 'trener'`. Databasetriggeren garanterer at ingen andre kan fa samme rolle.
5. `npm run dev`

## Datamodell for logging
- `session_completions` (session_id, athlete_id, status) - egen fullforingsstatus per utover, selv om okten er delt med en gruppe.
- `exercise_logs` (session_exercise_id, athlete_id, weight_kg, time_seconds, notes) - en logg-rad per utover per ovelse. Hvilket felt som vises (vekt vs. tid) styres av oktens `type`.

## Fargeprofil (Fyllingen IL Friidrett)
- Primar bla: `#2165AC`
- Aksent gull/gul: `#F2BA03`
- Bakgrunn: `#FFFFFF` / lys gra `#F4F5F7`
