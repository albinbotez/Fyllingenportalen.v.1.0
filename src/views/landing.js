import { navigate } from '../router.js';

export async function renderLanding(root) {
  root.innerHTML = `
    <div class="card" style="max-width:420px;margin:40px auto;text-align:center;">
      <h2>Velkommen til Fyllingenportalen</h2>
      <p>Velg hvem du er for a logge inn.</p>
      <div style="display:flex;flex-direction:column;gap:12px;margin-top:16px;">
        <a class="btn btn-accent" href="#/login">Jeg er utover</a>
        <a class="btn" href="#/trener/login">Jeg er trener</a>
      </div>
    </div>
  `;
  root.querySelectorAll('a[href^="#/"]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      navigate(a.getAttribute('href').slice(1));
    });
  });
}
