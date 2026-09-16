import { listSuggestions } from '../api/suggestions.js';
import { emptyState } from './shared.js';

export async function renderSuggestions(root) {
  root.innerHTML = '<div class="card"><p>Laster forslag...</p></div>';
  const suggestions = await listSuggestions().catch(() => []);

  root.innerHTML = `
    <div class="card">
      <h2>Forslag til okter</h2>
      <p>Anbefalte okter basert pa gruppe og niva, satt opp av trenerteamet.</p>
    </div>
    ${suggestions.length ? suggestions.map(s => `
      <div class="card">
        <h3>${s.title} <span class="badge">${s.group_level || 'alle'}</span></h3>
        <p>${s.description || ''}</p>
      </div>`).join('') : emptyState('Ingen forslag registrert enda.')}
  `;
}
