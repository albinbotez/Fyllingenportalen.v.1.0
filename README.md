# Fyllingenportalen v1.0

Portal for Fyllingen IL Friidrett - publisering av oktplaner, ukesplaner og oppfolging av utovere.

Bygget som en tilpasset versjon av TRENINGSDAGBOK.V.1.0, med Fyllingen sin bla/gule fargeprofil.

## Funksjoner
- Dashbord med oversikt over kommende okter og status per utover
- Kalender for ukesplaner og oktplaner
- Oktdetaljer og oktformular for trenere
- Historikk og progresjonstracking (PR-er, tider, resultater)
- Skaderegistrering og oppfolging
- Forslag/anbefalte okter basert pa gruppe/niva
- Innlogging via Supabase Auth (utover- og trenerroller)

## Teknisk stack
- Vite + vanilla JavaScript (samme arkitektur som originalen)
- Supabase (Postgres + Auth) som backend
- Netlify for deploy

## Kom i gang
1. `npm install`
2. Kopier `.env.example` til `.env` og fyll inn Supabase-nokler
3. Kjor `supabase/schema.sql` i ditt Supabase-prosjekt
4. `npm run dev`

## Fargeprofil (Fyllingen IL Friidrett)
- Primar bla: `#0C2340`
- Aksent gull/gul: `#F5B700`
- Bakgrunn: `#FFFFFF` / lys gra `#F4F5F7`

> Merk: Klubbens offisielle logofil er ikke lagt inn automatisk. Legg egen logo i `src/assets/logo.svg` og oppdater referansen i `index.html`.
