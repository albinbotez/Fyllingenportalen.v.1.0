import { listSessions } from '../api/sessions.js';
import { formatDate } from '../utils/format.js';
import { emptyState } from './shared.js';

export async function renderHistory(root) {
  root.innerHTML = '<div class="card"><p>Laster historikk...</p></div>';
  const to = new Date().toISOString().slice(0, 10);
  const from = new Date(Date.now() - 90 * 86400000).toISOString().slice(0, 10);
  const sessions = await listSessions({ from, to }).catch(() => []);

  root.innerHTML = `
    <div class="card">
      <h2>Historikk (siste 90 dager)</h2>
      ${sessions.length ? `
        <table>
          <thead><tr><th>Dato</th><th>Okt</th><th>Type</th><th>Status</th></tr></thead>
          <tbody>
            ${sessions.map(s => `
              <tr>
                <td>${formatDate(s.date)}</td>
                <td><a href="#/session/${s.id}">${s.title || 'Okt'}</a></td>
                <td>${s.type || '-'}</td>
                <td><span class="badge">${s.status || 'planlagt'}</span></td>
              </tr>`).join('')}
          </tbody>
        </table>` : emptyState('Ingen okter registrert de siste 90 dagene.')}
    </div>
  `;
}
