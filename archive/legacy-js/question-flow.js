function getQ(subject, diff) {
  if (activeLearningPath && subject === activeLearningPath.subject) {
    const pathPool = QS[subject].filter(q => q.d === activeLearningPath.difficulty);
    let available = pathPool.filter(q => !usedQs[subject].includes(q.q));
    if (!available.length) {
      usedQs[subject] = [];
      available = pathPool;
    }
    return rand(available);
  }
  let pool = QS[subject].filter(q => q.d === diff && !usedQs[subject].includes(q.q));
  if (!pool.length) pool = QS[subject].filter(q => !usedQs[subject].includes(q.q));
  if (!pool.length) { usedQs[subject] = []; pool = QS[subject]; }
  return rand(pool);
}

function loadQ() {
  if (!gameActive) return;
  if (reviewMode && !reviewQueue.length) {
    checkLU(() => endRun('win'));
    return;
  }
  answered = false;
  qCount++;
  setPhase('q');
  document.getElementById('c-choices').style.pointerEvents = 'all';
  document.getElementById('c-expl').style.display = 'none';

  const reviewItem = reviewMode ? rand(reviewQueue) : null;
  const subject = reviewItem
    ? reviewItem.subject
    : activeLearningPath
      ? activeLearningPath.subject
      : (curEnemy.weak && Math.random() < .35) ? curEnemy.weak : getAdaptiveSubject();
  if (activeLearningPath) runDiff = activeLearningPath.difficulty;
  const q = reviewItem
    ? QS[subject].find(question => question.q === reviewItem.question)
    : getQ(subject, runDiff);
  if (!q) throw new Error(`No question is available for ${subject}.`);
  if (reviewItem) runDiff = q.d;
  usedQs[subject].push(q.q);
  curQ = {q, subject};

  const totalTime = Math.max(7, 30 + SKILL_TIMER_BONUS[selSkill]);
  document.getElementById('c-timer-cont').style.display = isPracticeMode() ? 'none' : '';

  document.getElementById('c-qsubj').textContent = subject.toUpperCase();
  const pathTag = document.getElementById('c-qpath');
  pathTag.style.display = activeLearningPath ? '' : 'none';
  if (activeLearningPath) {
    pathTag.textContent = `${LEARNING_PATHS[subject].label} PATH`;
  }
  const qdiff = document.getElementById('c-qdiff');
  qdiff.className = 'tag tag-' + runDiff;
  qdiff.textContent = runDiff.toUpperCase();
  document.getElementById('c-qnum').textContent = 'Q' + qCount;
  document.getElementById('c-qtxt').textContent = q.q;
  const si = SKILL_INFO[selSkill];
  const sktag = document.getElementById('c-qskill');
  sktag.style.borderColor = si.color;
  sktag.style.color = si.color;
  sktag.textContent = si.label;
  document.getElementById('c-hint-wrap').style.display = (player.mana >= 1 && !hintDone) ? 'block' : 'none';

  buildChoices(q);
  document.getElementById('c-qtxt').focus();
  if (!isPracticeMode()) startTimer(totalTime, () => onTimeout());
}

function buildChoices(q) {
  const con = document.getElementById('c-choices');
  con.innerHTML = q.c.map((c, i) =>
    `<button class="choice" onclick="answerQ(${i})"><div class="choice-key">${['A','B','C','D'][i]}</div>${esc(c)}</button>`
  ).join('');
}

function useHint() {
  if (!gameActive || answered || !curQ || (!isPracticeMode() && player.mana < 1) || hintDone) return;
  if (!isPracticeMode()) player.mana = Math.max(0, player.mana - 1);
  hintDone = true;
  updateHUD();
  const q = curQ.q;
  const explanation = q.e || 'Think about the concept described in the question.';
  const el = document.getElementById('c-expl');
  el.innerHTML = `<div class="explanation">💡 <strong>LEARNING HINT</strong><br>${esc(explanation)}</div>`;
  el.style.display = 'block';
  document.getElementById('c-hint-wrap').style.display = 'none';
  flash('LEARNING HINT 💡', '#00f5ff');
}

function answerQ(idx) {
  if (!gameActive || answered) return;
  answered = true;
  stopTimer();
  document.getElementById('c-choices').style.pointerEvents = 'none';

  const {q, subject} = curQ;
  const btns = document.getElementById('c-choices').querySelectorAll('.choice');
  btns.forEach(b => b.disabled = true);

  const cost = MANA_COST[selSkill];
  if (!isPracticeMode()) player.mana = Math.max(0, player.mana - cost);

  const correct = idx === q.a;

  if (correct) {
    btns[idx].classList.add('correct');
    correctCount++;
    scores[subject].c++;
    runScores[subject].c++;
    streak++;
    if (streak >= 3 && !rageMode) {
      rageMode = true;
      document.getElementById('c-rage').style.display = 'block';
    }
    resolveMissedQuestion(subject, q);
    if (!activeLearningPath) {
      if (runDiff === 'easy') runDiff = 'medium';
      else if (runDiff === 'medium') runDiff = 'hard';
    }

    if (!isPracticeMode()) player.mana = Math.min(player.maxMana, player.mana + cost);
    saveLearningScores();
    gainXP(XP_PER_DIFFICULTY[q.d]);

    if (selSkill === 'atk') {
      const base     = 10 + player.attack;
      const weakMult = 1.5;
      const bonus    = (curEnemy.weak === subject) ? Math.floor(base * (weakMult - 1)) : 0;
      const dmg      = base + bonus;
      dealToEnemy(dmg);
      flash('+' + dmg + ' DMG' + (bonus > 0 ? ' 💥 WEAKNESS!' : ''), '#ff3366');
    } else if (selSkill === 'def') {
      shieldUp = true;
      flash('SHIELD ACTIVE! 🛡 Next hit blocked', '#00f5ff');
    } else if (selSkill === 'regen') {
      const heal = 25;
      const actualHeal = Math.min(player.maxHp - player.hp, heal);
      player.hp += actualHeal;
      flash(`INSTANT REPAIR! 💚 +${actualHeal} HP`, '#00ff88');
    } else if (selSkill === 'charge') {
      player.mana = Math.min(player.maxMana, player.mana + 3);
      flash('MANA CHARGED! ⚡ +3 Mana', 'var(--gold)');
    }

    updateHUD();
    if (isPracticeMode()) {
      showCorrectExpl(q);
      updateLearningControls();
      return;
    }
    if (curEnemy.hp <= 0) {
      setTimeout(() => checkLU(() => defeatEnemy()), 900);
      return;
    }
    setTimeout(() => checkLU(() => showSkillPhase()), 1100);

  } else {
    btns[idx].classList.add('wrong');
    btns[q.a].classList.add('reveal');
    scores[subject].w++;
    runScores[subject].w++;
    recordMissedQuestion(subject, q);
    saveLearningScores();

    if (!activeLearningPath) {
      if (runDiff === 'hard') runDiff = 'medium';
      else if (runDiff === 'medium') runDiff = 'easy';
    }

    streak = 0;
    rageMode = false;
    document.getElementById('c-rage').style.display = 'none';

    const failMsgs = {atk:'ATTACK FAILED!', def:'DEFENSE FAILED!', regen:'REGENERATION FAILED! 💔', charge:'CHARGE FAILED!'};
    flash(failMsgs[selSkill], 'var(--red)');

    showExpl(q, idx);
    updateHUD();
    if (isPracticeMode()) {
      updateLearningControls();
      return;
    }
    if (curEnemy.hp <= 0) { setTimeout(() => checkLU(() => defeatEnemy()), 900); return; }
    setTimeout(() => {
      if (!gameActive) return;
      document.getElementById('c-expl').style.display = 'none';
      enemyTurn();
    }, 2200);
  }
}

function showExpl(q, wrongIdx) {
  const el = document.getElementById('c-expl');
  el.innerHTML = `<div class="explanation">
    ❌ You chose: <strong style="color:var(--red)">${esc(q.c[wrongIdx])}</strong><br>
    ✅ Correct: <strong style="color:var(--green)">${esc(q.c[q.a])}</strong>
    ${q.e ? `<br><br><em>${esc(q.e)}</em>` : ''}
    ${isPracticeMode() ? '<br><button class="btn btn-gold practice-continue" type="button" onclick="continuePractice()">Continue</button>' : ''}
  </div>`;
  el.style.display = 'block';
}

function showCorrectExpl(q) {
  const el = document.getElementById('c-expl');
  el.innerHTML = `<div class="explanation">
    ✅ Correct! Nice work.
    ${q.e ? `<br><br><em>${esc(q.e)}</em>` : ''}
    <br><button class="btn btn-gold practice-continue" type="button" onclick="continuePractice()">Continue</button>
  </div>`;
  el.style.display = 'block';
}

function continuePractice() {
  if (!gameActive || !answered) return;
  document.getElementById('c-expl').style.display = 'none';
  if (reviewMode && !reviewQueue.length) {
    checkLU(() => endRun('win'));
  } else if (curEnemy.hp <= 0) {
    checkLU(() => defeatEnemy());
  } else {
    showSkillPhase();
  }
}
