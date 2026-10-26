function checkRateLimit(action, limitPerMinute = 3) {
  const key = 'rl_' + action;
  const now = Date.now();
  const window = 60 * 1000; // 1 minute

  const data = JSON.parse(localStorage.getItem(key) || '{"count":0,"start":0}');

  // Reset window if expired
  if (now - data.start > window) {
    data.count = 0;
    data.start = now;
  }

  data.count++;
  localStorage.setItem(key, JSON.stringify(data));

  if (data.count > limitPerMinute) {
    flash('TOO MANY REQUESTS — please wait', 'var(--red)');
    return false;
  }
  return true;
}