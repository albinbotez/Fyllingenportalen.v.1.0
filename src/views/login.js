import { signIn, signUpAthlete } from '../api/auth.js';
import { navigate } from '../router.js';

export async function renderLogin(root) {
  root.innerHTML = `
    <div class="card" style="max-width:380px;margin:40px auto;">
      <a href="#/">&larr; Tilbake</a>
      <h2>Utover - logg inn</h2>
      <label>E-post</label>
      <input type="email" id="fp-email" />
      <label>Passord</label>
      <input type="password" id="fp-password" />
      <button class="btn btn-accent" id="fp-login-btn">Logg inn</button>
      <p id="fp-login-error" style="color:#C0392B"></p>
      <hr />
      <h3>Ny utover? Registrer deg</h3>
      <label>Fullt navn</label>
      <input id="fp-fullname" />
      <label>Gruppe/niva (valgfritt)</label>
      <input id="fp-group" placeholder="F.eks. Sprint junior" />
      <label>E-post</label>
      <input type="email" id="fp-signup-email" />
      <label>Passord</label>
      <input type="password" id="fp-signup-password" />
      <button class="btn" id="fp-signup-btn">Registrer meg som utover</button>
      <p id="fp-signup-error" style="color:#C0392B"></p>
      <p id="fp-signup-success" style="color:#1B7A43"></p>
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
      navigate('/dashboard');
    } catch (err) {
      root.querySelector('#fp-login-error').textContent = err.message;
    }
  });

  root.querySelector('#fp-signup-btn').addEventListener('click', async () => {
    const fullName = root.querySelector('#fp-fullname').value;
    const groupLevel = root.querySelector('#fp-group').value;
    const email = root.querySelector('#fp-signup-email').value;
    const password = root.querySelector('#fp-signup-password').value;
    try {
      await signUpAthlete({ email, password, fullName, groupLevel });
      root.querySelector('#fp-signup-success').textContent = 'Konto opprettet! Du kan na logge inn ovenfor (bekreft e-post om nodvendig).';
      root.querySelector('#fp-signup-error').textContent = '';
    } catch (err) {
      root.querySelector('#fp-signup-error').textContent = err.message;
    }
  });
}
