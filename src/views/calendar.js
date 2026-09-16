import { listSessions } from '../api/sessions.js';
import { formatDate, weekNumber } from '../utils/format.js';
import { emptyState } from './shared.js';

function startOfWeek(date) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  return d;
}

export async function renderCalendar(root) {
  root.innerHTML = '<div class="card"><p>Laster ukesplan...</p></div>';
  const now = new Date();
  const monday = startOfWeek(now);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const from = monday.toISOString().slice(0, 10);
  const to = sunday.toISOString().slice(0, 10);
  const sessions = await listSessions({ from, to }).catch(() => []);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });

  const dayCards = days.map(d => {
    const dateStr = d.toISOString().slice(0, 10);
    const daySessions = sessions.filter(s => s.date === dateStr);
    return `
      <div class="card">
        <strong>${d.toLocaleDateString('nb-NO', { weekday: 'long' })} ${formatDate(dateStr)}</strong>
        ${daySessions.length
          ? daySessions.map(s => `
            <p>
              <a href="#/session/${s.id}">${s.title || 'Okt'}</a>
              <span class="badge">${s.type || 'trening'}</span>
              ${s.time ? `<br><small>${s.time}${s.location ? ' - ' + s.location : ''}</small>` : (s.location ? `<br><small>${s.location}</small>` : '')}
            </p>`).join('')
          : '<p style="opacity:0.6">Ingen okt</p>'}
      </div>`;
  }).join('');

  root.innerHTML = `
    <div class="card"><h2>Ukesplan - uke ${weekNumber(now)}</h2></div>
    ${dayCards || emptyState('Ingen okter denne uken.')}
    <a class="btn btn-accent" href="#/session/new">Legg til ny okt</a>
  `;
}
