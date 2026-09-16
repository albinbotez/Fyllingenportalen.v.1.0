import { initRouter, registerRoute } from './router.js';
import { renderDashboard } from './views/dashboard.js';
import { renderCalendar } from './views/calendar.js';
import { renderHistory } from './views/history.js';
import { renderInjuries } from './views/injuries.js';
import { renderLogin } from './views/login.js';
import { renderProgression, renderProgressionDetail } from './views/progression.js';
import { renderSessionDetail } from './views/sessionDetail.js';
import { renderSessionForm } from './views/sessionForm.js';
import { renderSuggestions } from './views/suggestions.js';
import { renderNav } from './views/shared.js';

registerRoute('/login', renderLogin);
registerRoute('/dashboard', renderDashboard);
registerRoute('/calendar', renderCalendar);
registerRoute('/history', renderHistory);
registerRoute('/injuries', renderInjuries);
registerRoute('/progression', renderProgression);
registerRoute('/progression/:id', renderProgressionDetail);
registerRoute('/session/:id', renderSessionDetail);
registerRoute('/session/new', renderSessionForm);
registerRoute('/session/:id/edit', renderSessionForm);
registerRoute('/suggestions', renderSuggestions);

renderNav(document.getElementById('fp-nav'));
initRouter('app');
