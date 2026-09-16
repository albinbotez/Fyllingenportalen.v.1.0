import { navigate } from '../router.js';

const links = [
  { path: '/dashboard', label: 'Dashbord' },
  { path: '/calendar', label: 'Kalender' },
  { path: '/history', label: 'Historikk' },
  { path: '/progression', label: 'Progresjon' },
  { path: '/injuries', label: 'Skader' },
  { path: '/suggestions', label: 'Forslag' },
];

export function renderNav(navEl) {
  navEl.innerHTML = links
    .map(l => `<a href="#${l.path}">${l.label}</a>`)
    .join('');
  navEl.addEventListener('click', (e) => {
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
