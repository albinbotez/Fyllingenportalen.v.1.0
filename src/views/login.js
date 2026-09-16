import { supabase } from '../supabaseClient.js';
import { navigate } from '../router.js';

export async function renderLogin(root) {
  root.innerHTML = `
    <div class="card" style="max-width:360px;margin:40px auto;">
      <h2>Logg inn - Fyllingen Friidrett</h2>
      <label>E-post</label>
      <input type="email" id="fp-email" placeholder="navn@fyllingenfriidrett.no" />
      <label>Passord</label>
      <input type="password" id="fp-password" />
      <button class="btn btn-accent" id="fp-login-btn">Logg inn</button>
      <p id="fp-login-error" style="color:#C0392B"></p>
    </div>
  `;

  root.querySelector('#fp-login-btn').addEventListener('click', async () => {
    const email = root.querySelector('#fp-email').value;
    const password = root.querySelector('#fp-password').value;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      root.querySelector('#fp-login-error').textContent = error.message;
      return;
    }
    navigate('/dashboard');
  });
}
