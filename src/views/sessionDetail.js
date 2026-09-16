import { getSession, deleteSession } from '../api/sessions.js';
import { formatDate } from '../utils/format.js';
import { navigate } from '../router.js';

export async function renderSessionDetail(root, params) {
  root.innerHTML = '<div class="card"><p>Laster okt...</p></div>';
  const session = await getSession(params.id).catch(() => null);
  if (!session) {
    root.innerHTML = '<div class="card"><p>Fant ikke okten.</p></div>';
    return;
  }

  root.innerHTML = `
    <div class="card">
      <h2>${session.title || 'Okt'} <span class="badge">${session.type || 'trening'}</span></h2>
      <p><strong>Dato:</strong> ${formatDate(session.date)}</p>
      <p><strong>Beskrivelse:</strong> ${session.description || '-'}</p>
      <h3>Ovelser</h3>
      ${session.session_exercises?.length ? `
        <table>
          <thead><tr><th>Ovelse</th><th>Sett x rep</th><th>Notat</th></tr></thead>
          <tbody>
            ${session.session_exercises.map(se => `
              <tr>
                <td>${se.exercise_name || se.exercise_id}</td>
                <td>${se.sets || '-'} x ${se.reps || '-'}</td>
                <td>${se.notes || '-'}</td>
              </tr>`).join('')}
          </tbody>
        </table>` : '<p>Ingen ovelser registrert.</p>'}
      <div style="margin-top:16px;display:flex;gap:8px;">
        <a class="btn" href="#/session/${session.id}/edit">Rediger</a>
        <button class="btn btn-danger" id="fp-delete-session">Slett</button>
      </div>
    </div>
  `;

  root.querySelector('#fp-delete-session').addEventListener('click', async () => {
    if (confirm('Slette denne okten?')) {
      await deleteSession(session.id);
      navigate('/calendar');
    }
  });
}
