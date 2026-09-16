const routes = {};

export function registerRoute(path, renderFn) {
  routes[path] = renderFn;
}

function matchRoute(hash) {
  for (const path in routes) {
    if (path.includes(':')) {
      const pathParts = path.split('/');
      const hashParts = hash.split('/');
      if (pathParts.length !== hashParts.length) continue;
      const params = {};
      const isMatch = pathParts.every((part, i) => {
        if (part.startsWith(':')) {
          params[part.slice(1)] = hashParts[i];
          return true;
        }
        return part === hashParts[i];
      });
      if (isMatch) return { renderFn: routes[path], params };
    } else if (path === hash) {
      return { renderFn: routes[path], params: {} };
    }
  }
  return null;
}

export function initRouter(rootId) {
  const root = document.getElementById(rootId);
  async function render() {
    const hash = window.location.hash.slice(1) || '/dashboard';
    const match = matchRoute(hash);
    root.innerHTML = '';
    if (match) {
      await match.renderFn(root, match.params);
    } else {
      root.innerHTML = '<p>Fant ikke siden.</p>';
    }
    document.querySelectorAll('.fp-nav a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + hash.split('/')[0]);
    });
  }
  window.addEventListener('hashchange', render);
  window.addEventListener('DOMContentLoaded', render);
  render();
}

export function navigate(path) {
  window.location.hash = path;
}
