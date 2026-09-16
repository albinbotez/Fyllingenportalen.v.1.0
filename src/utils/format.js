export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('nb-NO', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatTime(seconds) {
  if (seconds == null) return '';
  const m = Math.floor(seconds / 60);
  const s = (seconds % 60).toFixed(2);
  return m > 0 ? `${m}:${s.padStart(5, '0')}` : `${s}s`;
}

export function weekNumber(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

export function classNames(...args) {
  return args.filter(Boolean).join(' ');
}
