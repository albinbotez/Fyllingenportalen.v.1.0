import { supabase } from '../supabaseClient.js';
import { formatDate } from '../utils/format.js';
import { emptyState } from './shared.js';

export async function renderInjuries(root) {
  root.innerHTML = '<div class="card"><p>Laster skaderegister...</p></div>';
  const { data: injuries, error } = await supabase
    .from('injuries')
    .select('*, profiles(full_name)')
    .order('reported_at', { ascending: false });

  const listHtml = (!error && injuries?.length)
    ? `<table><thead><tr><th>Dato</th><th>Utover</th><th>Type</th><th>Status</th></tr></thead><tbody>
        ${injuries.map(i => `
          <tr>
            <td>${formatDate(i.reported_at)}</td>
            <td>${i.profiles?.full_name || '-'}</td>
            <td>${i.description || '-'}</td>
            <td><span class="badge">${i.status || 'aktiv'}</span></td>
          </tr>`).join('')}
      </tbody></table>`
    : emptyState('Ingen registrerte skader.');

  root.innerHTML = `
    <div class="card">
      <h2>Skaderegister</h2>
      ${listHtml}
    </div>
    <div class="card">
      <h3>Meld inn ny skade</h3>
      <label>Beskrivelse</label>
      <textarea id="fp-injury-desc"></textarea>
      <button class="btn btn-danger" id="fp-report-injury">Meld inn skade</button>
    </div>
  `;

  root.querySelector('#fp-report-injury').addEventListener('click', async () => {
    const description = root.querySelector('#fp-injury-desc').value;
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return;
    await supabase.from('injuries').insert({
      athlete_id: userData.user.id,
      description,
      status: 'aktiv',
      reported_at: new Date().toISOString(),
    });
    renderInjuries(root);
  });
}
