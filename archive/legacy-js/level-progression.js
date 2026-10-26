function checkLU(cb) {
  if (!gameActive) return;
  if (!levelUpQueue.length) {
    cb();
    return;
  }
  showLU(cb);
}

function showLU(cb) {
  luCb = cb;
  luLevel = levelUpQueue[0];
  luSel = null;
  const tier = getRewardTier(luLevel);
  luList = getStatChoices(tier);
  document.getElementById('lu-lv').textContent = luLevel;
  document.getElementById('lu-tier').textContent = `${tier.label} REWARD`;
  document.getElementById('lu-tier').className = `lu-tier lu-tier-${tier.id}`;
  document.getElementById('lu-reward-copy').textContent = tier.description;

  const cards = document.getElementById('lu-cards');
  cards.replaceChildren();
  luList.forEach((stat, index) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = `lu-card lu-card-${tier.id}`;
    card.setAttribute('aria-pressed', 'false');
    card.addEventListener('click', () => pickLU(index));

    const icon = document.createElement('span');
    icon.className = 'lu-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = stat.icon;
    const name = document.createElement('span');
    name.className = 'lu-name';
    name.textContent = stat.name;
    const value = document.createElement('span');
    value.className = 'lu-stat-value';
    value.textContent = `+${tier.amount}`;
    const description = document.createElement('span');
    description.className = 'lu-desc';
    description.textContent = stat.description;
    card.append(icon, name, value, description);
    cards.append(card);
  });
  renderActiveUpgrades();
  const btn = document.getElementById('lu-confirm');
  btn.disabled = true;
  show('levelup');
}

function getRewardTier(level) {
  if (level === 10) return {id:'legend', label:'LEGEND', amount:5, description:'Choose one stat to increase by 5.'};
  if (level % 5 === 0) return {id:'epic', label:'EPIC', amount:3, description:'Choose one stat to increase by 3.'};
  return {id:'basic', label:'BASIC', amount:1, description:'Choose one stat to increase by 1.'};
}

function getStatChoices(tier) {
  const choices = [
    {id:'vitality', icon:'♥', name:'VITALITY', description:`HP +${tier.amount} · heal now`},
    {id:'energy', icon:'✦', name:'ENERGY', description:`Mana +${tier.amount} · refill now`},
    {id:'power', icon:'⚔', name:'POWER', description:`Attack damage +${tier.amount}`},
    {id:'defense', icon:'⬡', name:'DEFENSE', description:`Damage reduction +${tier.amount}`}
  ];

  for (let index = choices.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [choices[index], choices[randomIndex]] = [choices[randomIndex], choices[index]];
  }
  return choices.slice(0, 3);
}

function pickLU(i) {
  if (i < 0 || i >= luList.length) return;
  luSel = i;
  document.querySelectorAll('#lu-cards .lu-card').forEach((card, j) => {
    const selected = j === i;
    card.classList.toggle('sel', selected);
    card.setAttribute('aria-pressed', String(selected));
  });
  document.getElementById('lu-confirm').disabled = false;
}

function confirmLU() {
  if (luSel === null || !luList || !luList[luSel] || !levelUpQueue.length) return;
  const stat = luList[luSel];
  const tier = getRewardTier(luLevel);
  applyStatUpgrade(stat.id, tier.amount);
  levelUpQueue.shift();
  savePlayerProgress();
  updateHUD();
  renderActiveUpgrades();
  flash(`${stat.name} +${tier.amount} ACQUIRED!`, '#ffd700');

  const resume = luCb;
  luCb = null;
  luList = null;
  luSel = null;
  if (levelUpQueue.length) {
    setTimeout(() => showLU(resume), 400);
  } else {
    setTimeout(() => {
      document.getElementById('lu-cards').replaceChildren();
      if (gameActive && resume) resume();
    }, 400);
  }
}

function applyStatUpgrade(id, amount) {
  switch (id) {
    case 'vitality':
      player.maxHp += amount;
      player.hp = Math.min(player.maxHp, player.hp + amount);
      break;
    case 'energy':
      player.maxMana += amount;
      player.mana = Math.min(player.maxMana, player.mana + amount);
      break;
    case 'power':
      player.attack += amount;
      break;
    case 'defense':
      player.defense += amount;
      break;
  }
}

function renderActiveUpgrades() {
  document.querySelectorAll('.active-upgrade-list').forEach(container => {
    const stats = [
      ['♥', 'HP', player.maxHp - 100],
      ['✦', 'MANA', player.maxMana - 5],
      ['⚔', 'POWER', player.attack],
      ['⬡', 'DEFENSE', player.defense]
    ];
    container.replaceChildren(...stats.map(([icon, name, value]) => {
      const tag = document.createElement('span');
      tag.className = 'lu-active-tag';
      tag.textContent = `${icon} ${name} +${value}`;
      return tag;
    }));
  });
}

function endRun(outcome) {
  if (!gameActive) return;
  gameActive = false;
  stopTimer();
  const win = outcome === 'win';
  document.getElementById('r-icon').textContent = reviewMode ? '📘' : win ? '🏆' : '💀';
  const t = document.getElementById('r-title');
  t.textContent  = reviewMode ? 'REVIEW COMPLETE' : win ? 'VICTORY!' : 'DEFEATED';
  t.style.color  = reviewMode ? 'var(--cyan)' : win ? 'var(--gold)' : 'var(--red)';
  document.getElementById('r-sub').textContent = reviewMode
    ? 'You worked through your missed questions. Keep practicing to strengthen your recall.'
    : win
    ? 'The dungeon has been conquered! All enemies defeated.'
    : 'You were overwhelmed by the darkness.';
  document.querySelector('#s-result .panel>div:first-child>div:first-child .hud-label').textContent =
    reviewMode ? 'REVIEWED' : 'ENEMIES';
  document.getElementById('r-kills').textContent   = reviewMode ? qCount : killCount;
  document.getElementById('r-correct').textContent = correctCount;
  document.getElementById('r-xp').textContent      = '+' + runXP;
  renderSubj('r-subj', runScores);
  
  // Unlock feedback after completing a game session
  feedbackUnlocked = true;
  console.log("[DEBUG] Session complete. Feedback feature now UNLOCKED.");
  
  show('result');
  // Auto-save score using login name
  if (!reviewMode && typeof triggerEndRunSave === 'function') triggerEndRunSave();
}