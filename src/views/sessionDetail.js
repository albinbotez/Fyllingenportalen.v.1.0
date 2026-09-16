import { getSession, deleteSession } from '../api/sessions.js';
import { getCompletion, upsertCompletion } from '../api/completions.js';
import { listLogsForSession, upsertLog } from '../api/exerciseLogs.js';
import { getMyProfile, isCoach } from '../api/profiles.js';
import { formatDate } from '../utils/format.js';
import { navigate } from '../router.js';

function needsTime(sessionType) {
  return ['sprint', 'lopetur', 'konkurranse'].includes(sessionType);
}
function needsWeight(sessionType) {
  return sessionType === 'styrke';
}

export async function renderSessionDetail(root, params) {
  root.innerHTML = '<div class="card"><p>Laster okt...</p></div>';
  const session = await getSession(params.id).catch(() => null);
  if (!session) {
    root.innerHTML = '<div class="card"><p>Fant ikke okten.</p></div>';
    return;
  }

  const coach = await isCoach().catch(() => false);
  const profile = await getMyProfile().catch(() => null);
  const athleteId = profile?.id;

  const completion = (!coach && athleteId)
    ? await getCompletion(session.id, athleteId).catch(() => null)
    : null;

  const exerciseIds = (session.session_exercises || []).map(se => se.id);
  const logs = (!coach && athleteId)
    ? await listLogsForSession(exerciseIds, athleteId).catch(() => [])
    : [];
  const logMap = Object.fromEntries(logs.map(l => [l.session_exercise_id, l]));

  const showTime = needsTime(session.type);
  const showWeight = needsWeight(session.type);

  root.innerHTML = `
    <div class="card">
      <h2>${session.title || 'Okt'} <span class="badge">${session.type || 'trening'}</span></h2>
      <p><strong>Dato:</strong> ${formatDate(session.date)} ${session.time ? 'kl. ' + session.time : ''}</p>
      <p><strong>Sted:</strong> ${session.location || '-'}</p>
      <p><strong>Tildelt:</strong> ${session.assigned_group ? session.assigned_group : (session.athlete_id ? 'Individuell' : '-')}</p>
      <p><strong>Beskrivelse:</strong> ${session.description || '-'}</p>
      ${!coach ? `
        <p><strong>Status:</strong> <span class="badge">${completion?.status || 'planlagt'}</span></p>
        <button class="btn btn-accent" id="fp-mark-done">Merk okt som fullfort</button>
      ` : ''}
    </div>

    <div class="card">
      <h3>Ovingsplan</h3>
      ${session.session_exercises?.length ? `
        <table>
          <thead>
            <tr>
              <th>Ovelse</th><th>Sett x rep</th><th>Notat</th>
              ${!coach ? `<th>${showWeight ? 'Din vekt (kg)' : showTime ? 'Din tid (sek)' : 'Logg'}</th><th></th>` : ''}
            </tr>
          </thead>
          <tbody>
            ${session.session_exercises.map(se => {
              const existingLog = logMap[se.id];
              return `
              <tr data-exercise-id="${se.id}">
                <td>${se.exercise_name || se.exercise_id}</td>
                <td>${se.sets || '-'} x ${se.reps || '-'}</td>
                <td>${se.notes || '-'}</td>
                ${!coach ? `
                  <td>
                    <input type="number" step="0.1" class="fp-log-input" style="margin-bottom:0"
                      value="${showWeight ? (existingLog?.weight_kg ?? '') : showTime ? (existingLog?.time_seconds ?? '') : ''}"
                      placeholder="${showWeight ? 'kg' : showTime ? 'sekunder' : 'valgfritt'}" />
                  </td>
                  <td><button class="btn fp-save-log" style="padding:6px 10px;">Lagre</button></td>
                ` : ''}
              </tr>`;
            }).join('')}
          </tbody>
        </table>` : '<p>Ingen ovelser registrert.</p>'}
      <div style="margin-top:16px;display:flex;gap:8px;">
        ${coach ? `<a class="btn" href="#/session/${session.id}/edit">Rediger</a>
        <button class="btn btn-danger" id="fp-delete-session">Slett</button>` : ''}
      </div>
    </div>
  `;

  if (coach) {
    root.querySelector('#fp-delete-session')?.addEventListener('click', async () => {
      if (confirm('Slette denne okten?')) {
        await deleteSession(session.id);
        navigate('/calendar');
      }
    });
  }

  if (!coach && athleteId) {
    root.querySelector('#fp-mark-done')?.addEventListener('click', async () => {
      await upsertCompletion(session.id, athleteId, 'fullfort');
      renderSessionDetail(root, params);
    });

    root.querySelectorAll('.fp-save-log').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const row = e.target.closest('tr');
        const sessionExerciseId = row.dataset.exerciseId;
        const value = parseFloat(row.querySelector('.fp-log-input').value);
        await upsertLog({
          sessionExerciseId,
          athleteId,
          weightKg: showWeight ? value : null,
          timeSeconds: showTime ? value : null,
        });
        btn.textContent = 'Lagret!';
        setTimeout(() => { btn.textContent = 'Lagre'; }, 1500);
      });
    });
  }
}
