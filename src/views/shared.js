import { navigate } from '../router.js';
import { isCoach } from '../api/profiles.js';
import { signOut } from '../api/auth.js';
import { supabase } from '../supabaseClient.js';

const links = [
  { path: '/dashboard', label: 'Dashbord' },
  { path: '/calendar', label: 'Kalender' },
  { path: '/history', label: 'Historikk' },
  { path: '/progression', label: 'Progresjon' },
  { path: '/injuries', label: 'Skader' },
  { path: '/suggestions', label: 'Forslag' },
];

export async function renderNav(navEl) {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) {
    navEl.innerHTML = '';
    return;
  }

  const coach = await isCoach().catch(() => false);
  const allLinks = coach ? [...links, { path: '/admin', label: 'Admin' }] : links;
  navEl.innerHTML = allLinks
    .map(l => `<a href="#${l.path}">${l.label}</a>`)
    .join('') + '<a href="#/logout" id="fp-logout-link">Logg ut</a>';

  navEl.addEventListener('click', async (e) => {
    if (e.target.id === 'fp-logout-link') {
      e.preventDefault();
      await signOut();
      navigate('/');
      window.location.reload();
      return;
    }
    if (e.target.tagName === 'A') {
      e.preventDefault();
      navigate(e.target.getAttribute('href').slice(1));
    }
  });
}

export function card(contentHtml) {
  const div = document.createElement('div');
  div.className = 'card';
  div.innerHTML = contentHtml;
  return div;
}

export function emptyState(message) {
  return `<div class="card"><p>${message}</p></div>`;
}
