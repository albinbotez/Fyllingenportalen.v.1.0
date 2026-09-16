import { listAthletes, isCoach } from '../api/profiles.js';
import { listSessions } from '../api/sessions.js';
import { emptyState } from './shared.js';
import { navigate } from '../router.js';

export async function renderAdmin(root) {
  root.innerHTML = '<div class="card"><p>Laster admin-panel...</p></div>';
  const coach = await isCoach().catch(() => false);
  if (!coach) {
    root.innerHTML = '<div class="card"><p>Du har ikke tilgang til admin/trener-siden.</p></div>';
    return;
  }

  const athletes = await listAthletes().catch(() => []);
  const today = new Date().toISOString().slice(0, 10);
  const in7 = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);

  const rows = await Promise.all(athletes.map(async (a) => {
    const upcoming = await listSessions({ from: today, to: in7, athleteId: a.id }).catch(() => []);
    return { athlete: a, upcomingCount: upcoming.length };
  }));

  root.innerHTML = `
    <div class="card">
      <h2>Trener/admin - oversikt over utovere</h2>
      <p>${athletes.length} utovere registrert. Trykk pa en utover for a se profil, historikk og planlegge okter.</p>
      <div style="display:flex;gap:8px;margin-bottom:12px;">
        <a class="btn btn-accent" href="#/session/new">Publiser ny okt</a>
        <a class="btn" href="#/admin/progression">Samlet utvikling</a>
      </div>
      <table>
        <thead><tr><th>Navn</th><th>Gruppe/niva</th><th>Okter (7 dager)</th><th></th></tr></thead>
        <tbody>
          ${rows.map(r => `
            <tr>
              <td>${r.athlete.full_name}</td>
              <td>${r.athlete.group_level || '-'}</td>
              <td>${r.upcomingCount}</td>
              <td><a href="#/admin/athlete/${r.athlete.id}">Se profil</a></td>
            </tr>`).join('')}
        </tbody>
      </table>
      ${!athletes.length ? emptyState('Ingen utovere registrert enda.') : ''}
    </div>
  `;

  root.querySelectorAll('a[href^="#/"]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      navigate(a.getAttribute('href').slice(1));
    });
  });
}
