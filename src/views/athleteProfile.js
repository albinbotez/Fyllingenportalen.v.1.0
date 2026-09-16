import { getAthleteById, isCoach } from '../api/profiles.js';
import { listSessions } from '../api/sessions.js';
import { listRecords } from '../api/records.js';
import { supabase } from '../supabaseClient.js';
import { formatDate, formatTime } from '../utils/format.js';
import { emptyState } from './shared.js';
import { navigate } from '../router.js';

export async function renderAthleteProfile(root, params) {
  root.innerHTML = '<div class="card"><p>Laster profil...</p></div>';
  const coach = await isCoach().catch(() => false);
  if (!coach) {
    root.innerHTML = '<div class="card"><p>Du har ikke tilgang til denne siden.</p></div>';
    return;
  }

  const athleteId = params.id;
  const athlete = await getAthleteById(athleteId).catch(() => null);
  if (!athlete) {
    root.innerHTML = '<div class="card"><p>Fant ikke utoveren.</p></div>';
    return;
  }

  const today = new Date().toISOString().slice(0, 10);
  const in14 = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);
  const past90 = new Date(Date.now() - 90 * 86400000).toISOString().slice(0, 10);

  const upcoming = await listSessions({ from: today, to: in14, athleteId }).catch(() => []);
  const history = await listSessions({ from: past90, to: today, athleteId }).catch(() => []);
  const records = await listRecords(athleteId).catch(() => []);
  const { data: injuries } = await supabase
    .from('injuries')
    .select('*')
    .eq('athlete_id', athleteId)
    .order('reported_at', { ascending: false });

  root.innerHTML = `
    <div class="card">
      <a href="#/admin">&larr; Tilbake til oversikt</a>
      <h2>${athlete.full_name} <span class="badge">${athlete.group_level || 'ingen gruppe'}</span></h2>
      <a class="btn btn-accent" href="#/session/new?athlete=${athleteId}">Planlegg ny okt for ${athlete.full_name}</a>
    </div>

    <div class="grid-2">
      <div class="card">
        <h3>Kommende okter</h3>
        ${upcoming.length ? `<table><thead><tr><th>Dato</th><th>Okt</th><th>Tid/sted</th></tr></thead><tbody>
          ${upcoming.map(s => `<tr><td>${formatDate(s.date)}</td><td><a href="#/session/${s.id}">${s.title || 'Okt'}</a></td><td>${s.time || '-'} ${s.location ? '@ ' + s.location : ''}</td></tr>`).join('')}
        </tbody></table>` : emptyState('Ingen planlagte okter.')}
      </div>
      <div class="card">
        <h3>Personlige rekorder</h3>
        ${records.length ? `<table><thead><tr><th>Disiplin</th><th>Resultat</th><th>Dato</th></tr></thead><tbody>
          ${records.map(r => `<tr><td>${r.discipline}</td><td>${formatTime(r.result_seconds) || r.result_value || '-'}</td><td>${formatDate(r.recorded_at)}</td></tr>`).join('')}
        </tbody></table>` : emptyState('Ingen registrerte resultater.')}
      </div>
    </div>

    <div class="card">
      <h3>Okthistorikk (90 dager)</h3>
      ${history.length ? `<table><thead><tr><th>Dato</th><th>Okt</th><th>Status</th></tr></thead><tbody>
        ${history.map(s => `<tr><td>${formatDate(s.date)}</td><td><a href="#/session/${s.id}">${s.title || 'Okt'}</a></td><td><span class="badge">${s.status || 'planlagt'}</span></td></tr>`).join('')}
      </tbody></table>` : emptyState('Ingen historikk siste 90 dager.')}
    </div>

    <div class="card">
      <h3>Skader</h3>
      ${injuries?.length ? `<table><thead><tr><th>Dato</th><th>Beskrivelse</th><th>Status</th></tr></thead><tbody>
        ${injuries.map(i => `<tr><td>${formatDate(i.reported_at)}</td><td>${i.description || '-'}</td><td><span class="badge">${i.status}</span></td></tr>`).join('')}
      </tbody></table>` : emptyState('Ingen registrerte skader.')}
    </div>
  `;

  root.querySelectorAll('a[href^="#/"]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      navigate(a.getAttribute('href').slice(1));
    });
  });
}
