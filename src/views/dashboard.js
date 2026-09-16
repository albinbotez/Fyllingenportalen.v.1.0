import { listSessions } from '../api/sessions.js';
import { getMyProfile, isCoach } from '../api/profiles.js';
import { listCompletionsForAthlete } from '../api/completions.js';
import { formatDate, weekNumber } from '../utils/format.js';
import { emptyState } from './shared.js';

export async function renderDashboard(root) {
  root.innerHTML = '<div class="card"><p>Laster dashbord...</p></div>';
  const profile = await getMyProfile().catch(() => null);
  const coach = await isCoach().catch(() => false);
  const today = new Date().toISOString().slice(0, 10);
  const in7 = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
  const sessions = await listSessions({ from: today, to: in7 }).catch(() => []);

  const completions = (!coach && profile)
    ? await listCompletionsForAthlete(profile.id, sessions.map(s => s.id)).catch(() => [])
    : [];
  const completionMap = Object.fromEntries(completions.map(c => [c.session_id, c.status]));

  const upcomingHtml = sessions.length
    ? `<table><thead><tr><th>Dato</th><th>Okt</th><th>Tid/sted</th><th>Type</th>${!coach ? '<th>Status</th>' : ''}</tr></thead><tbody>
        ${sessions.map(s => `
          <tr>
            <td>${formatDate(s.date)}</td>
            <td><a href="#/session/${s.id}">Se oktplan: ${s.title || 'Okt'}</a></td>
            <td>${s.time || '-'}${s.location ? ' @ ' + s.location : ''}</td>
            <td><span class="badge">${s.type || 'trening'}</span></td>
            ${!coach ? `<td>${completionMap[s.id] || 'planlagt'}</td>` : ''}
          </tr>`).join('')}
      </tbody></table>`
    : emptyState('Ingen planlagte okter denne uken.');

  root.innerHTML = `
    <div class="card">
      <h2>Hei${profile?.full_name ? ', ' + profile.full_name : ''} - uke ${weekNumber()}</h2>
      <p>Velkommen til Fyllingenportalen. Her ser du kommende okter og ukesplan.</p>
    </div>
    <div class="grid-2">
      <div class="card">
        <h3>Kommende okter (7 dager)</h3>
        ${upcomingHtml}
        ${coach ? '<a class="btn btn-accent" href="#/session/new" style="margin-top:12px;display:inline-block;">Ny okt</a>' : ''}
      </div>
      <div class="card">
        <h3>Snarveier</h3>
        <p><a href="#/calendar">Se ukesplan i kalender</a></p>
        <p><a href="#/progression">Progresjon og PR-er</a></p>
        <p><a href="#/suggestions">Forslag til okter</a></p>
        <p><a href="#/injuries">Registrer/se skader</a></p>
        ${coach ? '<p><a href="#/admin">Admin/trener-panel</a></p>' : ''}
      </div>
    </div>
  `;
}
