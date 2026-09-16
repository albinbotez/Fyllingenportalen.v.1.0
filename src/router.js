import { supabase } from './supabaseClient.js';

const routes = {};

export function registerRoute(path, renderFn, options = {}) {
  routes[path] = { renderFn, public: !!options.public };
}

function matchRoute(path) {
  for (const routePath in routes) {
    if (routePath.includes(':')) {
      const routeParts = routePath.split('/');
      const pathParts = path.split('/');
      if (routeParts.length !== pathParts.length) continue;
      const params = {};
      const isMatch = routeParts.every((part, i) => {
        if (part.startsWith(':')) {
          params[part.slice(1)] = pathParts[i];
          return true;
        }
        return part === pathParts[i];
      });
      if (isMatch) return { entry: routes[routePath], params };
    } else if (routePath === path) {
      return { entry: routes[routePath], params: {} };
    }
  }
  return null;
}

export function initRouter(rootId) {
  const root = document.getElementById(rootId);
  async function render() {
    const raw = window.location.hash.slice(1) || '/';
    const [path, queryString] = raw.split('?');
    const queryParams = Object.fromEntries(new URLSearchParams(queryString || ''));
    const match = matchRoute(path);

    const { data: sessionData } = await supabase.auth.getSession();
    const isLoggedIn = !!sessionData.session;

    if (!match) {
      root.innerHTML = '<p>Fant ikke siden.</p>';
      return;
    }

    if (!match.entry.public && !isLoggedIn) {
      window.location.hash = '/';
      return;
    }
    if (match.entry.public && isLoggedIn && (path === '/login' || path === '/trener/login' || path === '/')) {
      window.location.hash = '/dashboard';
      return;
    }

    root.innerHTML = '';
    await match.entry.renderFn(root, { ...match.params, ...queryParams });

    document.querySelectorAll('.fp-nav a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + path.split('/')[0] + (path.split('/')[1] ? '/' + path.split('/')[1] : ''));
    });
  }
  window.addEventListener('hashchange', render);
  window.addEventListener('DOMContentLoaded', render);
  render();
}

export function navigate(path) {
  window.location.hash = path;
}
