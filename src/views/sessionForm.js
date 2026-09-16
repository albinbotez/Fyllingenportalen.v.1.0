import { createSession, updateSession, getSession } from '../api/sessions.js';
import { listExercises } from '../api/exercises.js';
import { navigate } from '../router.js';

export async function renderSessionForm(root, params) {
  const isEdit = !!params.id;
  root.innerHTML = '<div class="card"><p>Laster formular...</p></div>';

  const existing = isEdit ? await getSession(params.id).catch(() => null) : null;
  const exercises = await listExercises().catch(() => []);

  root.innerHTML = `
    <div class="card">
      <h2>${isEdit ? 'Rediger okt' : 'Ny okt'}</h2>
      <label>Tittel</label>
      <input id="fp-title" value="${existing?.title || ''}" />
      <label>Dato</label>
      <input id="fp-date" type="date" value="${existing?.date || new Date().toISOString().slice(0, 10)}" />
      <label>Type</label>
      <select id="fp-type">
        ${['trening', 'sprint', 'styrke', 'lopetur', 'konkurranse'].map(t =>
          `<option value="${t}" ${existing?.type === t ? 'selected' : ''}>${t}</option>`).join('')}
      </select>
      <label>Beskrivelse</label>
      <textarea id="fp-description">${existing?.description || ''}</textarea>
      <label>Ovelser (kommaseparert navn)</label>
      <input id="fp-exercises" placeholder="F.eks: 6x60m, Startoving, Hoftefleksor" />
      <p style="font-size:0.8rem;opacity:0.7">Tilgjengelige ovelser i biblioteket: ${exercises.map(e => e.name).join(', ') || 'ingen enda'}</p>
      <button class="btn btn-accent" id="fp-save-session">Lagre okt</button>
    </div>
  `;

  root.querySelector('#fp-save-session').addEventListener('click', async () => {
    const payload = {
      title: root.querySelector('#fp-title').value,
      date: root.querySelector('#fp-date').value,
      type: root.querySelector('#fp-type').value,
      description: root.querySelector('#fp-description').value,
    };
    const saved = isEdit
      ? await updateSession(params.id, payload)
      : await createSession(payload);
    navigate(`/session/${saved.id}`);
  });
}
