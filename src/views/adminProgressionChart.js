import Chart from 'chart.js/auto';
import { listDisciplines, getRecordHistoryForDiscipline } from '../api/records.js';
import { isCoach } from '../api/profiles.js';
import { formatDate } from '../utils/format.js';
import { emptyState } from './shared.js';

let chartInstance = null;

export async function renderAdminProgressionChart(root) {
  root.innerHTML = '<div class="card"><p>Laster...</p></div>';
  const coach = await isCoach().catch(() => false);
  if (!coach) {
    root.innerHTML = '<div class="card"><p>Du har ikke tilgang til denne siden.</p></div>';
    return;
  }

  const disciplines = await listDisciplines().catch(() => []);

  root.innerHTML = `
    <div class="card">
      <a href="#/admin">&larr; Tilbake til oversikt</a>
      <h2>Samlet utvikling per disiplin</h2>
      <label>Velg ovelse/distanse</label>
      <select id="fp-discipline-select">
        <option value="">-- velg disiplin --</option>
        ${disciplines.map(d => `<option value="${d}">${d}</option>`).join('')}
      </select>
    </div>
    <div class="card">
      <canvas id="fp-progression-canvas" height="120"></canvas>
      <div id="fp-no-data"></div>
    </div>
  `;

  root.querySelector('a[href="#/admin"]').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.hash = '/admin';
  });

  root.querySelector('#fp-discipline-select').addEventListener('change', async (e) => {
    const discipline = e.target.value;
    const noData = root.querySelector('#fp-no-data');
    noData.innerHTML = '';
    if (!discipline) return;

    const records = await getRecordHistoryForDiscipline(discipline).catch(() => []);
    if (!records.length) {
      noData.innerHTML = emptyState('Ingen registrerte resultater for denne disiplinen.');
      if (chartInstance) chartInstance.destroy();
      return;
    }

    const athleteNames = [...new Set(records.map(r => r.profiles?.full_name || 'Ukjent'))];
    const allDates = [...new Set(records.map(r => r.recorded_at.slice(0, 10)))].sort();

    const palette = ['#2165AC', '#F2BA03', '#C0392B', '#1B7A43', '#8E44AD', '#E67E22', '#16A085', '#7F8C8D'];

    const datasets = athleteNames.map((name, i) => {
      const athleteRecords = records.filter(r => (r.profiles?.full_name || 'Ukjent') === name);
      const dataPoints = allDates.map(date => {
        const rec = athleteRecords.find(r => r.recorded_at.slice(0, 10) === date);
        return rec ? (rec.result_seconds ?? parseFloat(rec.result_value)) : null;
      });
      return {
        label: name,
        data: dataPoints,
        borderColor: palette[i % palette.length],
        backgroundColor: palette[i % palette.length],
        spanGaps: true,
        tension: 0.2,
      };
    });

    if (chartInstance) chartInstance.destroy();
    const ctx = root.querySelector('#fp-progression-canvas').getContext('2d');
    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: allDates.map(d => formatDate(d)),
        datasets,
      },
      options: {
        responsive: true,
        plugins: { title: { display: true, text: `Utvikling: ${discipline}` } },
        scales: { y: { title: { display: true, text: 'Resultat (sekunder eller verdi)' } } },
      },
    });
  });
}
