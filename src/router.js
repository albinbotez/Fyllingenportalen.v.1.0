const routes = {};

export function registerRoute(path, renderFn) {
  routes[path] = renderFn;
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
      if (isMatch) return { renderFn: routes[routePath], params };
    } else if (routePath === path) {
      return { renderFn: routes[routePath], params: {} };
    }
  }
  return null;
}

export function initRouter(rootId) {
  const root = document.getElementById(rootId);
  async function render() {
    const raw = window.location.hash.slice(1) || '/dashboard';
    const [path, queryString] = raw.split('?');
    const queryParams = Object.fromEntries(new URLSearchParams(queryString || ''));
    const match = matchRoute(path);
    root.innerHTML = '';
    if (match) {
      await match.renderFn(root, { ...match.params, ...queryParams });
    } else {
      root.innerHTML = '<p>Fant ikke siden.</p>';
    }
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
