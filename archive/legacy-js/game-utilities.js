const esc = t => String(t).replace(/[&<>"']/g, m =>
  ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m]));

const xpNext = lv => lv * 50;

const rand = arr => arr[Math.floor(Math.random() * arr.length)];

function flash(msg, color) {
  const el = document.getElementById('fb');
  el.textContent = msg;
  el.style.color = color || '#00ff88';
  el.classList.remove('show');
  void el.offsetWidth;
  el.classList.add('show');
}

function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const screen = document.getElementById('s-' + id);
  screen.scrollTop = 0;
  screen.classList.add('active');
  document.body.classList.toggle('combat-active', id === 'combat');
  document.body.classList.toggle('practice-mode', isPracticeMode());
  const title = screen.querySelector('[data-screen-title]');
  if (title) title.focus();
}

function isPracticeMode() {
  return practiceMode || reviewMode;
}

function recordMissedQuestion(subject, question) {
  if (reviewQueue.some(item => item.subject === subject && item.question === question.q)) return;
  reviewQueue.push({subject, question:question.q});
  if (reviewQueue.length > 200) reviewQueue.shift();
  saveReviewQueue();
}

function resolveMissedQuestion(subject, question) {
  const index = reviewQueue.findIndex(item => item.subject === subject && item.question === question.q);
  if (index < 0) return;
  reviewQueue.splice(index, 1);
  saveReviewQueue();
}

function emptyScores() {
  return {html:{c:0,w:0}, css:{c:0,w:0}, javascript:{c:0,w:0}, csharp:{c:0,w:0}};
}
