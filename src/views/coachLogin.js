import { signIn } from '../api/auth.js';
import { navigate } from '../router.js';

export async function renderCoachLogin(root) {
  root.innerHTML = `
    <div class="card" style="max-width:380px;margin:40px auto;">
      <a href="#/">&larr; Tilbake</a>
      <h2>Trener - logg inn</h2>
      <p style="font-size:0.85rem;opacity:0.75">Kun en trener/admin-konto finnes i Fyllingenportalen. Kontakt klubben hvis du mangler tilgang.</p>
      <label>E-post</label>
      <input type="email" id="fp-email" />
      <label>Passord</label>
      <input type="password" id="fp-password" />
      <button class="btn btn-accent" id="fp-login-btn">Logg inn</button>
      <p id="fp-login-error" style="color:#C0392B"></p>
    </div>
  `;

  root.querySelector('a[href="#/"]').addEventListener('click', (e) => {
    e.preventDefault();
    navigate('/');
  });

  root.querySelector('#fp-login-btn').addEventListener('click', async () => {
    const email = root.querySelector('#fp-email').value;
    const password = root.querySelector('#fp-password').value;
    try {
      await signIn({ email, password });
      navigate('/admin');
    } catch (err) {
      root.querySelector('#fp-login-error').textContent = err.message;
    }
  });
}
