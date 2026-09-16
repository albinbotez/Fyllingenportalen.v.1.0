import { createSession, updateSession, getSession } from '../api/sessions.js';
import { listExercises } from '../api/exercises.js';
import { listAthletes, isCoach, listGroupLevels } from '../api/profiles.js';
import { navigate } from '../router.js';

export async function renderSessionForm(root, params) {
  const isEdit = !!params.id;
  root.innerHTML = '<div class="card"><p>Laster formular...</p></div>';

  const existing = isEdit ? await getSession(params.id).catch(() => null) : null;
  const exercises = await listExercises().catch(() => []);
  const coach = await isCoach().catch(() => false);
  const athletes = coach ? await listAthletes().catch(() => []) : [];
  const groupLevels = coach ? await listGroupLevels().catch(() => []) : [];
  const preselectedAthlete = params.athlete || existing?.athlete_id || '';

  root.innerHTML = `
    <div class="card">
      <h2>${isEdit ? 'Rediger okt' : 'Ny okt'}</h2>
      <label>Tittel</label>
      <input id="fp-title" value="${existing?.title || ''}" />

      <div class="grid-2">
        <div>
          <label>Dato</label>
          <input id="fp-date" type="date" value="${existing?.date || new Date().toISOString().slice(0, 10)}" />
        </div>
        <div>
          <label>Klokkeslett</label>
          <input id="fp-time" type="time" value="${existing?.time || ''}" />
        </div>
      </div>

      <label>Sted</label>
      <input id="fp-location" placeholder="F.eks. Varden Idrettspark" value="${existing?.location || ''}" />

      <label>Type</label>
      <select id="fp-type">
        ${['trening', 'sprint', 'styrke', 'lopetur', 'konkurranse'].map(t =>
          `<option value="${t}" ${existing?.type === t ? 'selected' : ''}>${t}</option>`).join('')}
      </select>

      ${coach ? `
        <label>Tildel til</label>
        <select id="fp-assign-type">
          <option value="athlete" ${preselectedAthlete ? 'selected' : ''}>Enkelt utover</option>
          <option value="group">Gruppe/niva</option>
          <option value="alle">Hele klubben</option>
        </select>
        <select id="fp-athlete-select" style="display:${preselectedAthlete ? 'block' : 'none'}">
          <option value="">-- velg utover --</option>
          ${athletes.map(a => `<option value="${a.id}" ${a.id === preselectedAthlete ? 'selected' : ''}>${a.full_name}</option>`).join('')}
        </select>
        <select id="fp-group-select" style="display:none">
          <option value="">-- velg gruppe --</option>
          ${groupLevels.map(g => `<option value="${g}" ${existing?.assigned_group === g ? 'selected' : ''}>${g}</option>`).join('')}
        </select>
      ` : ''}

      <label>Beskrivelse</label>
      <textarea id="fp-description">${existing?.description || ''}</textarea>
      <label>Ovelser (kommaseparert navn)</label>
      <input id="fp-exercises" placeholder="F.eks: 6x60m, Startoving, Hoftefleksor" />
      <p style="font-size:0.8rem;opacity:0.7">Tilgjengelige ovelser i biblioteket: ${exercises.map(e => e.name).join(', ') || 'ingen enda'}</p>
      <button class="btn btn-accent" id="fp-save-session">Lagre okt</button>
    </div>
  `;

  if (coach) {
    const assignType = root.querySelector('#fp-assign-type');
    const athleteSelect = root.querySelector('#fp-athlete-select');
    const groupSelect = root.querySelector('#fp-group-select');
    assignType.addEventListener('change', () => {
      athleteSelect.style.display = assignType.value === 'athlete' ? 'block' : 'none';
      groupSelect.style.display = assignType.value === 'group' ? 'block' : 'none';
    });
  }

  root.querySelector('#fp-save-session').addEventListener('click', async () => {
    const payload = {
      title: root.querySelector('#fp-title').value,
      date: root.querySelector('#fp-date').value,
      time: root.querySelector('#fp-time').value || null,
      location: root.querySelector('#fp-location').value || null,
      type: root.querySelector('#fp-type').value,
      description: root.querySelector('#fp-description').value,
    };

    if (coach) {
      const assignType = root.querySelector('#fp-assign-type').value;
      if (assignType === 'athlete') {
        payload.athlete_id = root.querySelector('#fp-athlete-select').value || null;
        payload.assigned_group = null;
      } else if (assignType === 'group') {
        payload.assigned_group = root.querySelector('#fp-group-select').value || null;
        payload.athlete_id = null;
      } else {
        payload.assigned_group = 'alle';
        payload.athlete_id = null;
      }
    }

    const saved = isEdit
      ? await updateSession(params.id, payload)
      : await createSession(payload);
    navigate(`/session/${saved.id}`);
  });
}
