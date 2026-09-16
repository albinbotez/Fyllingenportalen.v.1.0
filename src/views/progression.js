import { listAthletes } from '../api/profiles.js';
import { listRecords, getRecordHistory } from '../api/records.js';
import { formatDate, formatTime } from '../utils/format.js';
import { emptyState } from './shared.js';

export async function renderProgression(root) {
  root.innerHTML = '<div class="card"><p>Laster progresjon...</p></div>';
  const athletes = await listAthletes().catch(() => []);

  root.innerHTML = `
    <div class="card">
      <h2>Progresjon og personlige rekorder</h2>
      <label>Velg utover</label>
      <select id="fp-athlete-select">
        <option value="">-- velg --</option>
        ${athletes.map(a => `<option value="${a.id}">${a.full_name}</option>`).join('')}
      </select>
    </div>
    <div id="fp-records-container"></div>
  `;

  root.querySelector('#fp-athlete-select').addEventListener('change', async (e) => {
    const athleteId = e.target.value;
    const container = root.querySelector('#fp-records-container');
    if (!athleteId) { container.innerHTML = ''; return; }
    const records = await listRecords(athleteId).catch(() => []);
    container.innerHTML = records.length ? `
      <div class="card">
        <table>
          <thead><tr><th>Disiplin</th><th>Resultat</th><th>Dato</th><th></th></tr></thead>
          <tbody>
            ${records.map(r => `
              <tr>
                <td>${r.discipline}</td>
                <td>${formatTime(r.result_seconds) || r.result_value || '-'}</td>
                <td>${formatDate(r.recorded_at)}</td>
                <td><a href="#/progression/${athleteId}">Se utvikling</a></td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>` : emptyState('Ingen registrerte resultater for denne utoveren.');
  });
}

export async function renderProgressionDetail(root, params) {
  const athleteId = params.id;
  root.innerHTML = '<div class="card"><p>Laster utvikling...</p></div>';
  const records = await listRecords(athleteId).catch(() => []);
  const disciplines = [...new Set(records.map(r => r.discipline))];

  const sections = await Promise.all(disciplines.map(async (d) => {
    const history = await getRecordHistory(athleteId, d).catch(() => []);
    return `
      <div class="card">
        <h3>${d}</h3>
        <table>
          <thead><tr><th>Dato</th><th>Resultat</th></tr></thead>
          <tbody>
            ${history.map(h => `<tr><td>${formatDate(h.recorded_at)}</td><td>${formatTime(h.result_seconds) || h.result_value}</td></tr>`).join('')}
          </tbody>
        </table>
      </div>`;
  }));

  root.innerHTML = `
    <div class="card"><h2>Utvikling per disiplin</h2></div>
    ${sections.join('') || emptyState('Ingen data enda.')}
  `;
}
