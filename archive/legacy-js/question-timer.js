function startTimer(max, onExpire) {
  stopTimer(); // Ensure any previous timer is cleared
  timerMax = max;
  // Initialize timerV to max, then immediately update the UI.
  timerV   = max;
  const CIRC = 82;
  const cont   = document.getElementById('c-timer-cont');
  const circle = document.getElementById('c-tcircle');
  const numEl  = document.getElementById('c-tnum');
  const barEl  = document.getElementById('c-tbar');

  function upd() {
    const f = timerV / timerMax;
    circle.style.strokeDashoffset = CIRC * (1 - f);
    barEl.style.width = (f * 100) + '%';
    numEl.textContent = timerV;
    cont.classList.remove('warn', 'danger');
    if (timerV <= 4) {
      cont.classList.add('danger');
      circle.style.stroke = 'var(--red)';
      numEl.style.color   = 'var(--red)';
      barEl.style.background = 'var(--red)';
    } else if (timerV <= 8) {
      cont.classList.add('warn');
      circle.style.stroke = 'var(--gold)';
      numEl.style.color   = 'var(--gold)';
      barEl.style.background = 'var(--gold)';
    } else {
      circle.style.stroke = 'var(--cyan)';
      numEl.style.color   = 'var(--cyan)';
      barEl.style.background = 'linear-gradient(90deg,var(--cyan2),var(--cyan))';
    }
  }

  upd(); // Display initial timer value (e.g., 30)

  // Set up the interval to decrement timerV and update the UI every second.
  timerIv = setInterval(() => {
    timerV--;
    upd(); // Update UI with new timerV (e.g., 29, 28...)
    // If timer reaches 0, stop the timer and execute the expiration callback.
    if (timerV <= 0) { stopTimer(); onExpire(); }
  }, 1000);
}

function stopTimer() {
  if (timerIv) { clearInterval(timerIv); timerIv = null; }
}

function onTimeout() {
  if (!gameActive || answered) return; // Prevent actions after leaving the run or answering
  answered = true;
  stopTimer();

  // Lock UI immediately
  document.getElementById('c-choices').style.pointerEvents = 'none';
  const btns = document.getElementById('c-choices').querySelectorAll('.choice');
  btns.forEach(b => b.disabled = true);

  if (curQ) {
    // Visually reveal the correct answer but treat as a fail
    btns[curQ.q.a].classList.add('reveal');
    scores[curQ.subject].w++;
    runScores[curQ.subject].w++;
    recordMissedQuestion(curQ.subject, curQ.q);
    saveLearningScores();
  }

  flash('⏱ TIME UP!', '#ff8c00');

  // Reset streak and difficulty
  if (runDiff === 'hard') runDiff = 'medium';
  else if (runDiff === 'medium') runDiff = 'easy';
  streak  = 0;
  rageMode = false;
  document.getElementById('c-rage').style.display = 'none';

  // Apply the selected action's mana cost.
  const cost = MANA_COST[selSkill] || 0;
  player.mana = Math.max(0, player.mana - cost);

  updateHUD();

  // Proceed to next phase: Defeat enemy or Enemy turn
  if (curEnemy && curEnemy.hp <= 0) {
    setTimeout(() => checkLU(() => defeatEnemy()), 900);
  } else {
    setTimeout(() => { // Delay before enemy turn to allow flash message to be seen
      if (!gameActive) return;
      document.getElementById('c-expl').style.display = 'none';
      enemyTurn();
    }, 1600);
  }
}
