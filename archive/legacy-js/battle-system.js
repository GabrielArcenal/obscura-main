// Scale enemy stats per full 10-round cycle completed.
// Each cycle adds 20% to HP and 15% to ATK, capped at 3x.
let gameActive = false;

function scaleEnemy(tmpl) {
  const hpMult  = Math.min(3, 1 + cycleCount * 0.20);
  const atkMult = Math.min(3, 1 + cycleCount * 0.15);
  return {
    ...tmpl,
    maxHp: Math.round(tmpl.maxHp * hpMult),
    atk:   Math.round(tmpl.atk   * atkMult),
    hp:    Math.round(tmpl.maxHp * hpMult),
  };
}

// Build one 5-encounter segment: 4 random normals + the boss for this segment.
// segIdx 0 → boss1, segIdx 1 → boss2
function buildSegment(segIdx = segmentRound) {
  const normals = [...NORMAL_ENEMIES].sort(() => Math.random() - .5).slice(0, 4);
  const boss    = BOSS_ENEMIES[segIdx % BOSS_ENEMIES.length];
  return [...normals, boss].map(scaleEnemy);
}

function buildCycle() {
  const first  = buildSegment(0);
  const second = buildSegment(1);
  cycleEnemies = [...first, ...second];
  runEnemies   = first;
}

// Entry point for starting the game (from menu or after tutorial)
function startGame() {
  // Check if tutorial needs to be shown
  if (localStorage.getItem('tutorialCompleted') !== 'true') {
    showTutorial(); // Defined in onboarding-tutorial.js
    return; // Stop startGame from proceeding directly
  }
  _initGame(); // Proceed to actual game initialization
}

function _initGame() { // Actual game initialization logic
  gameActive = true;
  player.hp   = player.maxHp;
  player.mana = player.maxMana;

  runScores = emptyScores();
  usedQs    = {html:[], css:[], javascript:[], csharp:[]};

  runDiff      = 'easy';
  qCount       = 0;
  correctCount = 0;
  killCount    = 0;
  runXP        = 0;
  streak       = 0;
  rageMode     = false;
  pRegen       = 0;
  shieldUp     = false;
  hintDone     = false;
  eStatuses    = {};
  pStatuses    = {};
  curQ         = null;
  selSkill     = null;
  answered     = false;

  // Reset loop counters
  cycleCount   = 0;
  segmentRound = 0;
  totalRound   = 1;

  buildCycle();
  encIdx = 0;
  renderActiveUpgrades();
  checkLU(() => startEnc(0));
}

function returnToMenu() {
  gameActive = false;
  answered = true;
  stopTimer();
  document.querySelector('.hud-upgrades').open = false;
  reviewMode = false;
  goMenu();
}

function startEnc(idx) {
  encIdx    = idx;
  const tmpl = runEnemies[idx];
  curEnemy  = {...tmpl, hp: tmpl.maxHp};
  eStatuses = {};
  hintDone   = false;
  shieldUp   = false;
  rageMode   = false;
  streak     = 0;
  renderEnemy();
  showSkillPhase();
}

function renderEnemy() {
  const e = curEnemy;
  document.getElementById('c-ename').textContent = e.name;
  const spr = document.getElementById('c-esprite');
  const spriteValue = String(e.sprite || '');
  const isImage = /\.(png|jpe?g|svg|gif)(\?.*)?$/i.test(spriteValue) || spriteValue.startsWith('http');
  if (isImage) {
    spr.innerHTML = `<img src="${spriteValue}" class="enemy-img" alt="${e.name}">`;
  } else {
    spr.textContent = spriteValue;
  }
  spr.className = 'enemy-sprite';
  document.getElementById('c-ehp').textContent = e.hp + '/' + e.maxHp;
  const enemyHpBar = document.getElementById('c-ehpbar');
  enemyHpBar.style.width = (e.hp / e.maxHp * 100) + '%';
  enemyHpBar.setAttribute('aria-valuemax', e.maxHp);
  enemyHpBar.setAttribute('aria-valuenow', e.hp);
  const wt = document.getElementById('c-eweak');
  if (e.weak) { wt.style.display='inline'; wt.textContent = e.weak.toUpperCase() + ' WEAK'; }
  else wt.style.display = 'none';
  document.getElementById('c-eintent').textContent = 'Preparing: ' + e.atkMsg;
  document.getElementById('c-rage').style.display = 'none';
  renderEStatuses();
}

function setPhase(phase) {
  document.getElementById('c-skill-phase').style.display = phase === 'skill' ? 'block' : 'none';
  document.getElementById('c-q-phase').style.display     = phase === 'q'     ? 'block' : 'none';
  document.getElementById('c-atk-phase').style.display   = phase === 'atk'   ? 'block' : 'none';
}

function showSkillPhase() {
  if (!gameActive) return;
  answered = false;
  selSkill = null;

  document.querySelectorAll('.skill-btn').forEach(b => {
    const sk = b.id.split('-')[1];
    b.classList.remove('sel');
    b.disabled = !isPracticeMode() && (player.mana < MANA_COST[sk]);
  });

  if (pStatuses.burn) { pStatuses.burn--; if (pStatuses.burn <= 0) delete pStatuses.burn; }

  setPhase('skill');
  document.getElementById('c-timer-cont').style.display = isPracticeMode() ? 'none' : '';
  const practiceBanner = document.getElementById('c-practice-banner');
  practiceBanner.style.display = isPracticeMode() ? 'block' : 'none';
  practiceBanner.textContent = reviewMode
    ? 'Reviewing missed questions · no timer or health loss'
    : 'Relaxed practice · no timer or health loss';
  updateHUD();
  renderPStatuses();
  renderActiveUpgrades();
  show('combat');
  stopTimer();
}

function selectSkill(sk) {
  if (!gameActive || (!isPracticeMode() && player.mana < MANA_COST[sk])) return;
  stopTimer();
  selSkill = sk;
  document.querySelectorAll('.skill-btn').forEach(b => b.classList.remove('sel'));
  document.getElementById('sk-' + sk).classList.add('sel');
  setTimeout(() => loadQ(), 280);
}

function dealToEnemy(dmg) {
  if (eStatuses.burn) {
    eStatuses.burn--;
    if (eStatuses.burn <= 0) delete eStatuses.burn;
  }
  curEnemy.hp = Math.max(0, curEnemy.hp - dmg);
  const spr = document.getElementById('c-esprite');
  spr.classList.remove('hit');
  void spr.offsetWidth;
  spr.classList.add('hit');
  setTimeout(() => spr.classList.remove('hit'), 500);
  document.getElementById('c-ehp').textContent = curEnemy.hp + '/' + curEnemy.maxHp;
  const enemyHpBar = document.getElementById('c-ehpbar');
  enemyHpBar.style.width = (curEnemy.hp / curEnemy.maxHp * 100) + '%';
  enemyHpBar.setAttribute('aria-valuenow', curEnemy.hp);
  renderEStatuses();
}

function enemyTurn() {
  if (!gameActive) return;
  let skipped = false;
  if (eStatuses.freeze) {
    eStatuses.freeze--;
    if (eStatuses.freeze <= 0) delete eStatuses.freeze;
    skipped = true;
    flash('ENEMY FROZEN — skip turn ❄', '#7dd3fc');
  } else if (eStatuses.stun) {
    eStatuses.stun--;
    if (eStatuses.stun <= 0) delete eStatuses.stun;
    skipped = true;
    flash('ENEMY STUNNED ⚡', 'var(--gold)');
  }
  if (skipped) {
    renderEStatuses();
    setTimeout(() => showSkillPhase(), 900);
    return;
  }

  setPhase('atk');
  document.getElementById('c-atk-msg').textContent = curEnemy.name + ' ATTACKS!';
  document.getElementById('c-atk-sub').textContent = curEnemy.atkMsg;
  document.getElementById('c-atk-msg').focus();

  if (shieldUp) {
    shieldUp = false;
    document.getElementById('c-atk-sub').textContent = 'BLOCKED by your shield! 🛡';
    flash('SHIELD BLOCKED THE ATTACK! 🛡', '#00f5ff');
    setTimeout(() => showSkillPhase(), 1000);
    return;
  }

  let dmg  = curEnemy.atk;
  let hits = 1;
  if (rageMode) dmg = Math.floor(dmg * 1.25);
  switch (curEnemy.atkPat) {
    case 'double': hits = 2; break;
    case 'heavy':  dmg  = Math.floor(dmg * 1.4); break;
    case 'boss':   dmg  = Math.floor(dmg * 1.2); break;
  }
  if (player.defense) dmg = Math.max(0, dmg - player.defense);

  let total = dmg * hits;
  if (selSkill === 'def') {
    total = Math.floor(total / 2);
    document.getElementById('c-atk-msg').textContent = 'DEFENSE REDUCED IMPACT!';
  }

  if (pStatuses.burn) { pStatuses.burn--; if (pStatuses.burn <= 0) delete pStatuses.burn; }

  player.hp = Math.max(0, player.hp - total);

  const pa = document.getElementById('player-area');
  pa.classList.remove('phit');
  void pa.offsetWidth;
  pa.classList.add('phit');
  setTimeout(() => pa.classList.remove('phit'), 500);

  if (total >= 15) {
    const sc = document.getElementById('s-combat');
    sc.classList.remove('shake');
    void sc.offsetWidth;
    sc.classList.add('shake');
    setTimeout(() => sc.classList.remove('shake'), 400);
  }

  document.getElementById('c-atk-sub').textContent = (hits > 1 ? 'Double hit! ' : '') + '−' + total + ' HP!';
  updateHUD();
  renderPStatuses();
  flash('−' + total + ' HP!', '#ff3366');

  if (player.hp <= 0) { setTimeout(() => endRun('loss'), 900); return; }
  setTimeout(() => showSkillPhase(), 1200);
}

function defeatEnemy() {
  if (!gameActive) return;
  killCount++;
  const xp = curEnemy.isBoss ? 80 + cycleCount * 20 : 30 + cycleCount * 10;
  gainXP(xp);
  const spr = document.getElementById('c-esprite');
  spr.classList.add('dead');
  flash(curEnemy.name + ' DEFEATED! +' + xp + ' XP', '#00ff88');

  setTimeout(() => {
    if (!gameActive) return;
    spr.classList.remove('dead');
    const next = encIdx + 1;

    if (next < runEnemies.length) {
      // More encounters in this segment
      totalRound++;
      checkLU(() => startEnc(next));
      return;
    }

    // Finished a 5-encounter segment (boss just killed)
    segmentRound++;
    totalRound++;

    if (segmentRound >= 2) {
      // Completed both segments = full 10-round cycle done
      segmentRound = 0;
      cycleCount++;
      flash('⚠ CYCLE ' + (cycleCount + 1) + ' — ENEMIES GROW STRONGER!', '#a855f7');
      buildCycle();
    }

    runEnemies = cycleEnemies.slice(segmentRound * 5, segmentRound * 5 + 5);
    encIdx = 0;
    checkLU(() => startEnc(0));
  }, 1000);
}

function gainXP(amt) {
  runXP += amt;
  player.xp += amt;
  while (player.xp >= xpNext(player.level)) {
    player.level++;
    levelUpQueue.push(player.level);
  }
  savePlayerProgress();
  updateHUD();
}
