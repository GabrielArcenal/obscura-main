function updateHUD() {
  const pct = Math.max(0, player.hp / player.maxHp * 100);
  const bc  = pct > 50 ? 'var(--green)' : pct > 25 ? 'var(--gold)' : 'var(--red)';
  document.getElementById('c-hp').textContent = player.hp;
  const hpBar = document.getElementById('c-hpbar');
  hpBar.style.cssText = `width:${pct}%;background:${bc}`;
  hpBar.setAttribute('aria-valuemax', player.maxHp);
  hpBar.setAttribute('aria-valuenow', player.hp);
  document.getElementById('c-mana').textContent = player.mana;
  const manaBar = document.getElementById('c-manabar');
  manaBar.style.width = Math.max(0, player.mana / player.maxMana * 100) + '%';
  manaBar.setAttribute('aria-valuemax', player.maxMana);
  manaBar.setAttribute('aria-valuenow', player.mana);
  document.getElementById('c-lv').textContent = player.level;
  const xpBase = xpNext(player.level - 1);
  const xpTop  = xpNext(player.level);
  const xpPct  = Math.min(100, Math.max(0, (player.xp - xpBase) / (xpTop - xpBase) * 100));
  const xpBar = document.getElementById('c-xpbar');
  xpBar.style.width = xpPct + '%';
  xpBar.setAttribute('aria-valuemax', xpTop - xpBase);
  xpBar.setAttribute('aria-valuenow', player.xp - xpBase);
  document.getElementById('c-xplbl').textContent =
    `${player.xp - xpBase} / ${xpTop - xpBase} XP`;
  document.getElementById('c-mana-warn').textContent =
    player.mana < 1 ? '⚠ LOW MANA — use CHARGE to restore mana.' : '';
}

function renderSubj(cid, data) {
  document.getElementById(cid).innerHTML = SUBJS.map(s => {
    const d   = data[s];
    const tot = d.c + d.w;
    const r   = tot > 0 ? Math.round(d.c / tot * 100) : 0;
    const col = r >= 70 ? 'var(--green)' : r >= 40 ? 'var(--gold)' : 'var(--red)';
    return `<div class="subj-item">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span class="font-mono" style="font-size:9px;color:var(--textdim);letter-spacing:1px">${s.toUpperCase()}</span>
        <span class="font-orb" style="font-size:12px;color:${col}">${d.c}/${tot}</span>
      </div>
      <div class="subj-bar"><div class="subj-fill" style="width:${r}%;background:${col}"></div></div>
    </div>`;
  }).join('');
}

function renderEStatuses() {
  const STATUS_CLASS = {burn:'burn-b', freeze:'freeze-b', stun:'stun-b'};
  const STATUS_ICON  = {burn:'🔥', freeze:'❄', stun:'⚡'};
  document.getElementById('c-estatuses').innerHTML = Object.entries(eStatuses).map(([s, t]) =>
    `<span class="sbadge ${STATUS_CLASS[s]}">${STATUS_ICON[s]}${s.toUpperCase()} ${t}</span>`
  ).join('');
}

function renderPStatuses() {
  const STATUS_CLASS = {burn:'burn-b', freeze:'freeze-b', stun:'stun-b'};
  const entries = Object.entries(pStatuses).map(([s, t]) =>
    `<span class="sbadge ${STATUS_CLASS[s]}">${s.toUpperCase()} ${t}</span>`
  );
  if (pRegen > 0) entries.unshift(`<span class="sbadge regen-b">REGEN ${pRegen}</span>`);
  document.getElementById('c-pstatuses').innerHTML = entries.join('');
}
