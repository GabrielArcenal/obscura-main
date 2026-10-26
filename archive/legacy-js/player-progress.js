function loadPlayerProgress() {
  const defaults = {hp:100, maxHp:100, mana:5, maxMana:5, xp:0, level:1, attack:0, defense:0, pendingLevels:[]};
  const saved = localStorage.getItem('playerProgress');
  if (!saved) return defaults;

  let progress;
  try {
    progress = JSON.parse(saved);
  } catch (error) {
    console.warn('Saved player progress could not be read; starting with default stats.', error);
    return defaults;
  }

  const number = (key, fallback, minimum, maximum = 1000000) => {
    const value = progress && Number(progress[key]);
    return Number.isFinite(value) ? Math.min(maximum, Math.max(minimum, Math.floor(value))) : fallback;
  };
  const maxHp = number('maxHp', defaults.maxHp, defaults.maxHp);
  const maxMana = number('maxMana', defaults.maxMana, defaults.maxMana);
  const level = number('level', defaults.level, 1, 9999);
  return {
    maxHp,
    hp: Math.min(maxHp, number('hp', maxHp, 0)),
    maxMana,
    mana: Math.min(maxMana, number('mana', maxMana, 0)),
    xp: number('xp', defaults.xp, 0),
    level,
    attack: number('attack', defaults.attack, 0),
    defense: number('defense', defaults.defense, 0),
    pendingLevels: progress && Array.isArray(progress.pendingLevels)
      ? progress.pendingLevels.map(Number).filter(value => Number.isInteger(value) && value >= 2 && value <= level).slice(0, 10000)
      : []
  };
}

const player = loadPlayerProgress();
function savePlayerProgress() {
  localStorage.setItem('playerProgress', JSON.stringify(player));
}
const tutorialCompleted = localStorage.getItem('tutorialCompleted') === 'true'; // Track if tutorial has been seen
let feedbackUnlocked = false; // Runtime only: Strictly resets to false on every app launch/refresh
console.log("[DEBUG] Feedback state initialized: LOCKED. No persistence loaded.");

function loadLearningScores() {
  const defaults = {html:{c:0,w:0}, css:{c:0,w:0}, javascript:{c:0,w:0}, csharp:{c:0,w:0}};
  const saved = localStorage.getItem('learningScores');
  if (!saved) return defaults;
  try {
    const parsed = JSON.parse(saved);
    for (const subject of SUBJS) {
      for (const result of ['c', 'w']) {
        const value = Number(parsed && parsed[subject] && parsed[subject][result]);
        defaults[subject][result] = Number.isSafeInteger(value) && value >= 0 ? value : 0;
      }
    }
  } catch (error) {
    console.warn('Saved learning scores could not be read; starting with empty scores.', error);
  }
  return defaults;
}

const scores = loadLearningScores();
function saveLearningScores() {
  localStorage.setItem('learningScores', JSON.stringify(scores));
}

function loadReviewQueue() {
  const saved = localStorage.getItem('missedQuestions');
  if (!saved) return [];
  try {
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(item =>
      item &&
      SUBJS.includes(item.subject) &&
      typeof item.question === 'string' &&
      QS[item.subject].some(question => question.q === item.question)
    ).slice(-200);
  } catch (error) {
    console.warn('Saved missed questions could not be read; starting with an empty review list.', error);
    return [];
  }
}

const reviewQueue = loadReviewQueue();
function saveReviewQueue() {
  localStorage.setItem('missedQuestions', JSON.stringify(reviewQueue));
}

let practiceMode = localStorage.getItem('learningMode') === 'practice';
let reviewMode = false;

// Per-run state (reset in startGame)
let runScores, usedQs;
let runDiff, encIdx, runEnemies, cycleEnemies;
let qCount, correctCount, killCount, runXP, streak;
let rageMode, pRegen, shieldUp, hintDone;
let curEnemy, eStatuses, pStatuses;
let curQ, selSkill, answered;
let timerIv = null, timerV = 0, timerMax = 0;
let luSel, luList, luCb, luLevel;
const levelUpQueue = player.pendingLevels;

// Infinite loop progression
// cycleCount: how many full 10-round loops completed
// segmentRound: which 5-round segment we're in within the current cycle (0 or 1)
// totalRound: absolute round number across all cycles (for display)
let cycleCount, segmentRound, totalRound;
