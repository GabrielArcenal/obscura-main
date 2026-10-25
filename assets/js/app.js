(() => {
  'use strict';

  const STORAGE_KEY = 'codequest.capstone.v1';
  const MAX_ATTEMPTS = 10000;
  const MAX_SESSIONS = 500;
  const SESSION_LENGTH = 10;
  const QUESTION_TIME = 25;
  const DIFFICULTY_PREFERENCES = ['adaptive', 'easy', 'medium', 'hard', 'impossible'];
  const ENEMIES = [
    { name: 'Syntax Sprite', icon: '👾', flavor: 'A small bug is blocking the path.' },
    { name: 'Null Phantom', icon: '👻', flavor: 'It appears wherever a value is missing.' },
    { name: 'Loop Warden', icon: '🦾', flavor: 'Break its cycle with a clear solution.' },
    { name: 'Compiler Wraith', icon: '🐉', flavor: 'A final challenge for your growing skills.' }
  ];

  const topics = new Map(QUESTION_BANK.map(topic => [topic.id, topic]));
  const questions = new Map();
  QUESTION_BANK.forEach(topic => topic.questions.forEach(question => {
    questions.set(question.id, { ...question, topicId: topic.id, subject: topic.subjectId });
  }));

  const app = document.getElementById('app');
  const notice = document.getElementById('notice');
  const importFile = document.getElementById('import-file');
  const sessionExitDialog = document.getElementById('session-exit-dialog');
  let storageRecovery = null;
  let storageWarning = '';
  let timerId = null;
  let continueCountdownId = null;
  let audioContext = null;
  let activeRun = null;
  let lastRun = null;
  let view = 'login';
  let noticeMessage = '';
  let noticeTimeoutId = null;
  let noticeHideTimeoutId = null;
  let pendingSessionExit = null;
  let topicFilter = 'all';
  let activeDashboardTab = 'overview';

  function emptyData(name = '') {
    return {
      schemaVersion: 1,
      profile: { name },
      settings: { mode: 'adaptive', difficultyPreference: 'adaptive', soundEnabled: true },
      attempts: [],
      sessions: []
    };
  }

  function stopContinueCountdown() {
    if (continueCountdownId !== null) {
      window.clearInterval(continueCountdownId);
      continueCountdownId = null;
    }
  }

  function closeDifficultyMenu(returnFocus = false) {
    const trigger = document.querySelector('[data-action="toggle-difficulty"]');
    const options = document.getElementById('difficulty-options');
    if (!trigger || !options) return;
    options.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    trigger.closest('.difficulty-select-wrap')?.classList.remove('is-open');
    if (returnFocus) trigger.focus();
  }

  function openDifficultyMenu(focusSelected = false) {
    const trigger = document.querySelector('[data-action="toggle-difficulty"]');
    const options = document.getElementById('difficulty-options');
    if (!trigger || !options) return;
    options.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    trigger.closest('.difficulty-select-wrap')?.classList.add('is-open');
    if (focusSelected) {
      const selected = options.querySelector('[aria-selected="true"]');
      if (selected) selected.focus();
    }
  }

  function closeTopicFilterMenu(returnFocus = false) {
    const menu = document.querySelector('.topic-filter-menu');
    if (!menu) return;
    const trigger = menu.querySelector('[data-action="toggle-topic-filter"]');
    const options = menu.querySelector('.topic-filter-options');
    if (!trigger || !options) return;
    options.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
    if (returnFocus) trigger.focus();
  }

  function toggleTopicFilterMenu() {
    const menu = document.querySelector('.topic-filter-menu');
    if (!menu) return;
    const trigger = menu.querySelector('[data-action="toggle-topic-filter"]');
    const options = menu.querySelector('.topic-filter-options');
    if (!trigger || !options) return;
    const isOpen = trigger.getAttribute('aria-expanded') === 'true';
    closeTopicFilterMenu();
    if (!isOpen) {
      options.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      menu.classList.add('is-open');
    }
  }

  function setDifficultyPreference(preference) {
    if (!DIFFICULTY_PREFERENCES.includes(preference)) {
      throw new Error(`Unsupported difficulty preference: ${preference}`);
    }
    const previousPreference = data.settings.difficultyPreference;
    data.settings.difficultyPreference = preference;
    if (!saveData()) {
      data.settings.difficultyPreference = previousPreference;
      render();
      const trigger = document.querySelector('[data-action="toggle-difficulty"]');
      if (trigger) trigger.focus();
      return;
    }
    render();
    const trigger = document.querySelector('[data-action="toggle-difficulty"]');
    if (trigger) trigger.focus();
    notify(`${preference === 'adaptive' ? 'Adaptive difficulty' : `${preference[0].toUpperCase()}${preference.slice(1)} difficulty`} selected.`, 1400);
  }

  function startContinueCountdown() {
    stopContinueCountdown();
    if (!activeRun || !activeRun.answered) return;
    const update = () => {
      if (!activeRun || !activeRun.answered) {
        stopContinueCountdown();
        return;
      }
      const remaining = Math.max(0, activeRun.continueAt - Date.now());
      const button = document.querySelector('[data-action="next-question"]');
      if (button) {
        button.disabled = remaining > 0;
        button.textContent = remaining > 0
          ? `Continue in ${Math.ceil(remaining / 1000)}s`
          : 'Continue →';
      }
      if (!remaining) stopContinueCountdown();
    };
    update();
    continueCountdownId = window.setInterval(update, 100);
  }

  function playAnswerSound(correct) {
    if (!data.settings.soundEnabled) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      notify('Sound is not supported by this browser. You can turn it off in Data & settings.');
      return;
    }
    try {
      audioContext = audioContext || new AudioContextClass();
      const context = audioContext;
      const play = () => {
        const now = context.currentTime;
        const notes = correct ? [660, 880] : [330, 220];
        notes.forEach((frequency, index) => {
          const oscillator = context.createOscillator();
          const gain = context.createGain();
          const startAt = now + index * 0.12;
          oscillator.type = correct ? 'sine' : 'triangle';
          oscillator.frequency.setValueAtTime(frequency, startAt);
          gain.gain.setValueAtTime(0.0001, startAt);
          gain.gain.exponentialRampToValueAtTime(0.12, startAt + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.18);
          oscillator.connect(gain);
          gain.connect(context.destination);
          oscillator.start(startAt);
          oscillator.stop(startAt + 0.2);
        });
      };
      if (context.state === 'suspended') {
        context.resume().then(play).catch(() => {
          notify('The browser could not start answer sounds. Check your audio settings or turn sounds off.');
        });
      } else {
        play();
      }
    } catch (error) {
      notify(`Answer sound could not be played: ${error.message}`);
    }
  }

  function isPlainObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  function validDate(value) {
    return typeof value === 'string' && Number.isFinite(Date.parse(value));
  }

  function validId(value) {
    return typeof value === 'string' && value.length > 0 && value.length <= 120;
  }

  function validateData(value) {
    if (!isPlainObject(value) || value.schemaVersion !== 1) {
      throw new Error('Unsupported or invalid CodeQuest data format.');
    }
    if (!isPlainObject(value.profile) || typeof value.profile.name !== 'string') {
      throw new Error('The saved profile is missing a valid display name.');
    }
    if (!isPlainObject(value.settings) || !['adaptive', 'practice'].includes(value.settings.mode)) {
      throw new Error('The saved learning mode is invalid.');
    }
    const difficultyPreference = value.settings.difficultyPreference === undefined
      ? 'adaptive'
      : value.settings.difficultyPreference;
    if (!DIFFICULTY_PREFERENCES.includes(difficultyPreference)) {
      throw new Error('The saved difficulty preference is invalid.');
    }
    if (!Array.isArray(value.attempts) || value.attempts.length > MAX_ATTEMPTS ||
        !Array.isArray(value.sessions) || value.sessions.length > MAX_SESSIONS) {
      throw new Error('The saved history is invalid or exceeds the supported size.');
    }

    const cleanAttempts = value.attempts.map(attempt => {
      if (!isPlainObject(attempt) || !validId(attempt.id) || !validId(attempt.sessionId) ||
          !validDate(attempt.answeredAt) || typeof attempt.correct !== 'boolean' ||
          typeof attempt.hintUsed !== 'boolean' ||
          !Number.isInteger(attempt.selectedIndex) || attempt.selectedIndex < -1 || attempt.selectedIndex > 3 ||
          !Number.isFinite(attempt.durationMs) || attempt.durationMs < 0 || attempt.durationMs > 3600000 ||
          !Number.isInteger(attempt.xpEarned) || attempt.xpEarned < 0 || attempt.xpEarned > 100 ||
          !questions.has(attempt.questionId) || !topics.has(attempt.topicId)) {
        throw new Error('An answer record in this file is invalid.');
      }
      const question = questions.get(attempt.questionId);
      if (question.topicId !== attempt.topicId || question.subject !== attempt.subject ||
          (attempt.correct && attempt.selectedIndex !== question.answer) ||
          (!attempt.correct && attempt.selectedIndex === question.answer)) {
        throw new Error('An answer record does not match this version of the question bank.');
      }
      return {
        id: attempt.id,
        sessionId: attempt.sessionId,
        questionId: attempt.questionId,
        topicId: attempt.topicId,
        subject: question.subject,
        difficulty: question.difficulty,
        correct: attempt.correct,
        selectedIndex: attempt.selectedIndex,
        durationMs: Math.floor(attempt.durationMs),
        hintUsed: attempt.hintUsed,
        xpEarned: attempt.xpEarned,
        answeredAt: attempt.answeredAt
      };
    });

    const cleanSessions = value.sessions.map(session => {
      if (!isPlainObject(session) || !validId(session.id) ||
          !['adaptive', 'practice', 'review'].includes(session.mode) ||
          !(session.topicId === null || topics.has(session.topicId)) ||
          !validDate(session.startedAt) ||
          !(session.endedAt === null || validDate(session.endedAt)) ||
          !['in_progress', 'completed', 'defeated', 'interrupted', 'abandoned'].includes(session.status) ||
          !Number.isInteger(session.questionCount) || session.questionCount < 0 || session.questionCount > SESSION_LENGTH ||
          !Number.isInteger(session.correct) || session.correct < 0 || session.correct > session.questionCount ||
          !Number.isInteger(session.wrong) || session.wrong < 0 || session.wrong > session.questionCount ||
          !Number.isInteger(session.xpEarned) || session.xpEarned < 0 || session.xpEarned > 100000 ||
          !Number.isInteger(session.kills) || session.kills < 0 || session.kills > SESSION_LENGTH) {
        throw new Error('A session record in this file is invalid.');
      }
      return {
        id: session.id,
        mode: session.mode,
        topicId: session.topicId,
        startedAt: session.startedAt,
        endedAt: session.endedAt,
        status: session.status,
        questionCount: session.questionCount,
        correct: session.correct,
        wrong: session.wrong,
        xpEarned: session.xpEarned,
        kills: session.kills
      };
    });

    const cleanName = cleanDisplayName(value.profile.name);
    return {
      schemaVersion: 1,
      profile: { name: cleanName },
      settings: {
        mode: value.settings.mode,
        difficultyPreference,
        soundEnabled: value.settings.soundEnabled !== false
      },
      attempts: cleanAttempts,
      sessions: cleanSessions
    };
  }

  function cleanDisplayName(value) {
    return String(value || '').replace(/[\u0000-\u001f\u007f]/g, '').replace(/\s+/g, ' ').trim().slice(0, 24);
  }

  function loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === null) return emptyData();
      try {
        return validateData(JSON.parse(raw));
      } catch (error) {
        storageRecovery = raw;
        storageWarning = `Saved learning data could not be read (${error.message}). The original data is being preserved until you export or replace it.`;
        return emptyData();
      }
    } catch (error) {
      storageWarning = 'This browser is blocking local storage. Progress can be used for this visit, but may not survive closing the page.';
      return emptyData();
    }
  }

  let data = loadData();

  function notify(message, duration = 0) {
    if (noticeTimeoutId !== null) {
      window.clearTimeout(noticeTimeoutId);
      noticeTimeoutId = null;
    }
    noticeMessage = message;
    renderNotice();
    if (duration > 0) {
      noticeTimeoutId = window.setTimeout(() => {
        noticeMessage = '';
        noticeTimeoutId = null;
        renderNotice();
      }, duration);
    }
  }

  function renderNotice() {
    const message = noticeMessage || storageWarning;
    if (noticeHideTimeoutId !== null) {
      window.clearTimeout(noticeHideTimeoutId);
      noticeHideTimeoutId = null;
    }
    notice.textContent = message;
    if (message) {
      notice.hidden = false;
      notice.classList.remove('is-hiding');
      return;
    }
    if (!notice.hidden) {
      notice.classList.add('is-hiding');
      noticeHideTimeoutId = window.setTimeout(() => {
        notice.hidden = true;
        notice.classList.remove('is-hiding');
        noticeHideTimeoutId = null;
      }, 220);
    }
  }

  function saveData() {
    try {
      if (storageRecovery !== null) {
        localStorage.setItem(`${STORAGE_KEY}.recovery`, storageRecovery);
        storageRecovery = null;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      storageWarning = '';
      return true;
    } catch (error) {
      storageWarning = 'Progress could not be saved to this browser. Use Export data before closing this page.';
      notify(storageWarning);
      return false;
    }
  }

  function getRecoveryCopy() {
    if (storageRecovery !== null) return storageRecovery;
    try {
      return localStorage.getItem(`${STORAGE_KEY}.recovery`);
    } catch (error) {
      notify(`The recovery copy could not be read from browser storage: ${error.message}`);
      return null;
    }

  }

  function updateModeButtons(mode) {
    document.querySelectorAll('[data-action="set-mode"]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.mode === mode));
    });
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
  }

  function makeId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID();
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
  }

  function shufflePick(items) {
    if (!items.length) return null;
    return items[Math.floor(Math.random() * items.length)];
  }

  function attemptsForTopic(topicId) {
    return data.attempts.filter(attempt => attempt.topicId === topicId);
  }

  function topicMetrics(topicId) {
    const attempts = attemptsForTopic(topicId);
    const correct = attempts.filter(attempt => attempt.correct).length;
    const observed = attempts.length ? Math.round(correct / attempts.length * 100) : 0;
    const estimate = (correct + 1) / (attempts.length + 2);
    const lastAttempt = attempts.reduce((latest, attempt) =>
      !latest || Date.parse(attempt.answeredAt) > Date.parse(latest) ? attempt.answeredAt : latest, null);
    const elapsed = lastAttempt ? Date.now() - Date.parse(lastAttempt) : Infinity;
    const dueBonus = elapsed >= 24 * 60 * 60 * 1000 ? 0.08 : 0;
    const priority = 0.65 * (1 - estimate) + 0.35 / Math.sqrt(attempts.length + 1) + dueBonus;
    return { attempts, correct, observed, estimate, lastAttempt, priority };
  }

  function recommendedTopic(filterSubject = null) {
    const difficulty = data.settings.difficultyPreference;
    const candidates = QUESTION_BANK.filter(topic =>
      (!filterSubject || topic.subjectId === filterSubject) &&
      (!activeRun || topic.questions.some(question =>
        !activeRun.usedQuestionIds.has(question.id) &&
        (difficulty === 'adaptive' || question.difficulty === difficulty)
      ))
    );
    if (!candidates.length) return null;
    const ranked = candidates.map(topic => ({ topic, metrics: topicMetrics(topic.id) }));
    const best = Math.max(...ranked.map(item => item.metrics.priority));
    return shufflePick(ranked.filter(item => item.metrics.priority >= best - 0.0001));
  }

  function recommendationReason(topicId) {
    const topic = topics.get(topicId);
    const metrics = topicMetrics(topicId);
    if (!metrics.attempts.length) {
      return `${topic.title} has no recorded attempts yet. Start with an introductory question to build a baseline.`;
    }
    return `${topic.title} is currently a focus area. Observed accuracy is ${metrics.observed}% across ${metrics.attempts.length} ${metrics.attempts.length === 1 ? 'attempt' : 'attempts'}; topics with weaker or less certain evidence are prioritized.`;
  }

  function chooseDifficulty(topicId) {
    const recent = attemptsForTopic(topicId).slice(-4);
    if (recent.length < 2) return 'easy';
    const accuracy = recent.filter(attempt => attempt.correct).length / recent.length;
    if (accuracy <= 0.5) return 'easy';
    if (accuracy >= 0.8 && recent.length >= 3) return 'hard';
    return 'medium';
  }

  function preferredDifficulty(topicId) {
    return data.settings.difficultyPreference === 'adaptive'
      ? chooseDifficulty(topicId)
      : data.settings.difficultyPreference;
  }

  function getReviewQueue() {
    const latest = new Map();
    data.attempts.forEach(attempt => latest.set(attempt.questionId, attempt));
    return Array.from(latest.values())
      .filter(attempt => !attempt.correct)
      .sort((a, b) => Date.parse(a.answeredAt) - Date.parse(b.answeredAt))
      .map(attempt => questions.get(attempt.questionId));
  }

  function chooseQuestion(topicId, difficulty) {
    const topic = topics.get(topicId);
    if (!topic) throw new Error(`Learning topic not found: ${topicId}`);
    const available = topic.questions.filter(question =>
      !activeRun.usedQuestionIds.has(question.id) &&
      (data.settings.difficultyPreference === 'adaptive' || question.difficulty === difficulty)
    );
    if (!available.length) return null;
    const recentIds = new Set(attemptsForTopic(topicId).slice(-6).map(attempt => attempt.questionId));
    const notRecentlySeen = available.filter(question => !recentIds.has(question.id));
    const preferred = notRecentlySeen.length ? notRecentlySeen : available;
    const preferredDifficulty = preferred.filter(question => question.difficulty === difficulty);
    const selected = shufflePick(preferredDifficulty.length ? preferredDifficulty : preferred);
    return questions.get(selected.id);
  }

  function updateSessionFromRun() {
    if (!activeRun) return null;
    const session = data.sessions.find(item => item.id === activeRun.id);
    return session || null;
  }

  function startSession(mode, topicId = null) {
    stopTimer();
    const sessionId = makeId();
    const reviewQuestionIds = mode === 'review'
      ? getReviewQueue().slice(0, SESSION_LENGTH).map(question => question.id)
      : [];
    const questionLimit = mode === 'review'
      ? reviewQuestionIds.length
      : topicId
        ? Math.min(SESSION_LENGTH, topics.get(topicId)?.questions.filter(question =>
          data.settings.difficultyPreference === 'adaptive' || question.difficulty === data.settings.difficultyPreference
        ).length || 0)
        : SESSION_LENGTH;
    const session = {
      id: sessionId,
      mode,
      topicId,
      questionLimit,
      startedAt: new Date().toISOString(),
      endedAt: null,
      status: 'in_progress',
      questionCount: 0,
      correct: 0,
      wrong: 0,
      xpEarned: 0,
      kills: 0
    };
    data.sessions.push(session);
    if (data.sessions.length > MAX_SESSIONS) data.sessions.splice(0, data.sessions.length - MAX_SESSIONS);
    activeRun = {
      id: sessionId,
      mode,
      topicId,
      questionNumber: 0,
      questionLimit,
      usedQuestionIds: new Set(),
      reviewQuestionIds,
      reviewIndex: 0,
      health: 100,
      enemyHealth: 100,
      answered: false,
      question: null,
      currentTopic: null,
      currentReason: '',
      selectedIndex: -1,
      correct: false,
      timedOut: false,
      startTime: 0,
      timeLeft: QUESTION_TIME
    };
    saveData();
    loadNextQuestion();
  }

  function loadNextQuestion() {
    if (!activeRun) return;
    stopTimer();
    if (activeRun.mode === 'review' && activeRun.reviewIndex >= activeRun.reviewQuestionIds.length) {
      finishSession('completed');
      return;
    }
    if (activeRun.questionNumber >= activeRun.questionLimit) {
      finishSession('completed');
      return;
    }

    let topicId = activeRun.topicId;
    let question;
    let reason;
    if (activeRun.mode === 'review') {
      question = questions.get(activeRun.reviewQuestionIds[activeRun.reviewIndex]);
      if (!question) {
        finishSession('completed');
        return;
      }
      activeRun.reviewIndex += 1;
      topicId = question.topicId;
      reason = 'This question was missed before. You will see it at most once in this review session.';
    } else {
      if (!topicId) {
        const recommended = recommendedTopic();
        if (!recommended) {
          finishSession('completed');
          return;
        }
        topicId = recommended.topic.id;
        reason = recommendationReason(topicId);
      } else {
        reason = data.settings.difficultyPreference === 'adaptive'
          ? `Focused practice for ${topics.get(topicId).title}. Difficulty adjusts as you answer.`
          : `Focused practice for ${topics.get(topicId).title} at ${data.settings.difficultyPreference} difficulty.`;
      }
      question = chooseQuestion(topicId, preferredDifficulty(topicId));
    }

    if (!question) {
      finishSession('completed');
      return;
    }
    if (!topics.has(topicId)) throw new Error(`Learning topic not found: ${topicId}`);
    activeRun.usedQuestionIds.add(question.id);
    activeRun.questionNumber += 1;
    activeRun.question = question;
    activeRun.displayChoices = shuffleChoices(question.choices);
    activeRun.currentTopic = topicId;
    activeRun.currentReason = reason;
    activeRun.answered = false;
    activeRun.answerSubmitted = false;
    activeRun.continueAt = 0;
    activeRun.selectedIndex = -1;
    activeRun.correct = false;
    activeRun.timedOut = false;
    activeRun.startTime = Date.now();
    activeRun.timeLeft = QUESTION_TIME;
    view = 'game';
    render();
  }

  function stopTimer() {
    if (timerId !== null) {
      window.clearInterval(timerId);
      timerId = null;
    }
  }

  function startTimer() {
    stopTimer();
    if (!activeRun || activeRun.mode !== 'adaptive' || activeRun.answered) return;
    const deadline = Date.now() + QUESTION_TIME * 1000;
    timerId = window.setInterval(() => {
      if (!activeRun || activeRun.answered) return stopTimer();
      const seconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      activeRun.timeLeft = seconds;
      const number = document.getElementById('timer-value');
      const fill = document.getElementById('timer-fill');
      if (number) number.textContent = String(seconds);
      if (fill) fill.style.width = `${(seconds / QUESTION_TIME) * 100}%`;
      if (seconds <= 0) answerQuestion(-1, true);
    }, 200);
  }

  function answerQuestion(selectedIndex, timedOut = false) {
    if (!activeRun || activeRun.answered || activeRun.answerSubmitted) return;
    const question = activeRun.question;
    if (!timedOut && (!Number.isInteger(selectedIndex) || selectedIndex < 0 || selectedIndex >= question.choices.length)) return;
    stopTimer();
    activeRun.answerSubmitted = true;
    activeRun.answered = true;
    activeRun.continueAt = Date.now() + 3000;
    activeRun.selectedIndex = selectedIndex;
    activeRun.timedOut = timedOut;
    const selectedChoice = activeRun.displayChoices[selectedIndex];
    const savedSelectedIndex = selectedChoice ? selectedChoice.originalIndex : -1;
    activeRun.correct = savedSelectedIndex === question.answer;
    const durationMs = Math.max(0, Date.now() - activeRun.startTime);
    const attempt = {
      id: makeId(),
      sessionId: activeRun.id,
      questionId: question.id,
      topicId: question.topicId,
      subject: question.subject,
      difficulty: question.difficulty,
      correct: activeRun.correct,
      selectedIndex: savedSelectedIndex,
      durationMs,
      hintUsed: false,
      xpEarned: 0,
      answeredAt: new Date().toISOString()
    };
    data.attempts.push(attempt);
    if (data.attempts.length > MAX_ATTEMPTS) data.attempts.splice(0, data.attempts.length - MAX_ATTEMPTS);
    const session = updateSessionFromRun();
    if (session) {
      session.questionCount += 1;
      if (activeRun.correct) session.correct += 1;
      else session.wrong += 1;
    }

    if (activeRun.correct) {
      activeRun.enemyHealth = Math.max(0, activeRun.enemyHealth - 34);
      if (activeRun.enemyHealth === 0) {
        if (session) session.kills += 1;
        activeRun.enemyHealth = 100;
      }
    } else if (activeRun.mode === 'adaptive') {
      activeRun.health = Math.max(0, activeRun.health - (timedOut ? 25 : 20));
    }
    playAnswerSound(activeRun.correct);
    saveData();
    render();
  }

  function finishSession(status, nextView = 'result') {
    stopTimer();
    stopContinueCountdown();
    const session = updateSessionFromRun();
    if (session) {
      session.status = status;
      session.endedAt = new Date().toISOString();
    }
    lastRun = activeRun;
    activeRun = null;
    view = nextView;
    saveData();
    render();
  }

  function requestSessionExit(destination) {
    if (!activeRun) return false;
    pendingSessionExit = destination;
    sessionExitDialog.showModal();
    return true;
  }

  function confirmSessionExit() {
    if (!pendingSessionExit || !activeRun) {
      pendingSessionExit = null;
      sessionExitDialog.close();
      return;
    }
    const destination = pendingSessionExit;
    pendingSessionExit = null;
    sessionExitDialog.close();
    const nextView = destination === 'leave-game' ? 'result' : destination === 'settings' ? 'settings' : 'dashboard';
    finishSession('abandoned', nextView);
  }

  function accuracyFor(attempts) {
    if (!attempts.length) return 0;
    return Math.round(attempts.filter(attempt => attempt.correct).length / attempts.length * 100);
  }

  function renderLogin() {
    app.innerHTML = `
      <section class="login-layout">
        <div class="hero-copy">
          <p class="eyebrow">A local-first learning adventure</p>
          <h1>Learn concepts.<br><span>Defeat the bugs.</span></h1>
          <p>Practice HTML, CSS, JavaScript, and C# with short challenges that respond to what you know and what you are ready to learn next.</p>
          <ul class="hero-points">
            <li>Questions adapt by topic and recent performance</li>
            <li>Helpful explanations after every answer</li>
            <li>Your attempts stay in this browser</li>
          </ul>
        </div>
        <form class="panel login-card" id="login-form">
          <p class="eyebrow">Player profile</p>
          <h2>Welcome, learner.</h2>
          <p class="small muted">Choose a display name to begin. This is a local profile, not an online account.</p>
          <label for="player-name">Display name</label>
          <input class="text-input" id="player-name" name="name" maxlength="24" autocomplete="nickname" placeholder="e.g. Code Explorer" required>
          <button class="button button-primary full-width" type="submit">Start learning <span aria-hidden="true">→</span></button>
          <p class="privacy-note">No sign-in, server, or network connection is used. Do not use a name that identifies another person.</p>
        </form>
      </section>`;
    const field = document.getElementById('player-name');
    if (field) field.focus();
  }

  function renderStatsCard(label, value, foot, valueClass = '') {
    return `<article class="stat-card"><div class="stat-label">${escapeHtml(label)}</div><div class="stat-value ${escapeHtml(valueClass)}">${escapeHtml(value)}</div><div class="stat-foot">${escapeHtml(foot)}</div></article>`;
  }

  function renderTopicCard(topic) {
    const metrics = topicMetrics(topic.id);
    const progress = metrics.attempts.length ? metrics.observed : 0;
    const accuracyLabel = metrics.attempts.length ? `${metrics.observed}% observed accuracy` : 'No attempts yet';
    const practiceQuestionCount = data.settings.difficultyPreference === 'adaptive'
      ? topic.questions.length
      : topic.questions.filter(question => question.difficulty === data.settings.difficultyPreference).length;
    return `
      <article class="panel topic-card">
        <div class="topic-top">
          <span class="subject-tag">${escapeHtml(topic.subject)}</span>
          <span class="small muted">${metrics.attempts.length} ${metrics.attempts.length === 1 ? 'attempt' : 'attempts'}</span>
        </div>
        <div class="topic-summary">
          <h3>${escapeHtml(topic.title)}</h3>
          <p>${escapeHtml(topic.description)}</p>
        </div>
        <div class="topic-mastery">
          <div class="mastery-line"><span>${escapeHtml(accuracyLabel)}</span><span>${metrics.attempts.length ? `${progress}%` : '—'}</span></div>
          <div class="progress-track" aria-label="${escapeHtml(accuracyLabel)}"><div class="progress-fill" style="width:${progress}%"></div></div>
        </div>
        <button class="button button-small button-secondary" type="button" data-action="start-topic" data-topic="${escapeHtml(topic.id)}">Practice ${practiceQuestionCount} <span aria-hidden="true">→</span></button>
      </article>`;
  }

  function renderDashboard() {
    const attempts = data.attempts;
    const completedSessions = data.sessions.filter(session => session.status === 'completed').length;
    const mastered = QUESTION_BANK.filter(topic => {
      const metrics = topicMetrics(topic.id);
      return metrics.attempts.length >= 3 && metrics.observed >= 80;
    }).length;
    const focus = recommendedTopic();
    const currentDifficulty = preferredDifficulty(focus.topic.id);
    const difficultyLabel = currentDifficulty[0].toUpperCase() + currentDifficulty.slice(1);
    const adaptiveLevel = chooseDifficulty(focus.topic.id);
    const difficultyOptions = [
      { value: 'adaptive', label: `Adaptive · ${adaptiveLevel[0].toUpperCase()}${adaptiveLevel.slice(1)}`, description: 'Adjusts to recent answers' },
      { value: 'easy', label: 'Easy', description: 'Start with the foundations' },
      { value: 'medium', label: 'Medium', description: 'Build confidence and fluency' },
      { value: 'hard', label: 'Hard', description: 'Stretch your understanding' },
      { value: 'impossible', label: 'Impossible', description: 'Take on the toughest challenge' }
    ];
    const selectedDifficulty = difficultyOptions.find(option => option.value === data.settings.difficultyPreference);
    const selectedMode = data.settings.mode;
    const focusReason = recommendationReason(focus.topic.id);
    const visibleTopics = topicFilter === 'all'
      ? QUESTION_BANK
      : QUESTION_BANK.filter(topic => topic.subjectId === topicFilter);
    const topicFilters = [
      ['all', 'All topics'],
      ['html', 'HTML'],
      ['css', 'CSS'],
      ['javascript', 'JavaScript'],
      ['csharp', 'C#']
    ];
    const reviewQueue = getReviewQueue();
    const reviewItems = reviewQueue.slice(0, 6).map(attempt => {
      const question = questions.get(attempt.questionId);
      const topic = topics.get(attempt.topicId);
      if (!question || !topic) return '';
      return `<article class="review-item">
        <div>
          <span class="subject-tag">${escapeHtml(topic.subject)}</span>
          <h3>${escapeHtml(question.prompt)}</h3>
          <p>${escapeHtml(topic.title)} · ${escapeHtml(attempt.difficulty)} difficulty</p>
        </div>
        <span class="review-item-status">Needs review</span>
      </article>`;
    }).join('');
    app.innerHTML = `
      <section>
        <div class="welcome-row">
          <div>
            <p class="eyebrow">Your learning hub</p>
            <h1>Welcome back, ${escapeHtml(data.profile.name)}.</h1>
            <p class="muted small">Small steps make strong foundations. Your recommended difficulty adapts to your recent answers.</p>
          </div>
        </div>
        <div class="overview-content">
        <section class="panel progress-panel" aria-labelledby="progress-heading">
          <div class="progress-heading">
            <div>
              <p class="eyebrow">Your progress</p>
              <h2 id="progress-heading">Learning snapshot</h2>
            </div>
          </div>
          <div class="stats-grid">
          <article class="stat-card difficulty-card">
            <span class="stat-label" id="difficulty-label">Current difficulty</span>
            <div class="stat-value difficulty-${currentDifficulty}">${escapeHtml(difficultyLabel)}</div>
            <div class="difficulty-select-wrap">
              <button class="difficulty-select-trigger" type="button" data-action="toggle-difficulty" aria-haspopup="listbox" aria-expanded="false" aria-controls="difficulty-options" aria-labelledby="difficulty-label difficulty-selected">
                <span id="difficulty-selected">${escapeHtml(selectedDifficulty.label)}</span>
                <svg class="difficulty-chevron" viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg>
              </button>
              <div class="difficulty-options" id="difficulty-options" role="listbox" aria-labelledby="difficulty-label" hidden>
                ${difficultyOptions.map(option => `<div class="difficulty-option difficulty-option-${option.value}" id="difficulty-option-${option.value}" role="option" tabindex="-1" aria-selected="${data.settings.difficultyPreference === option.value}" data-action="choose-difficulty" data-difficulty="${option.value}">
                  <span class="difficulty-option-dot" aria-hidden="true"></span>
                  <span class="difficulty-option-copy"><span class="difficulty-option-title">${escapeHtml(option.label)}</span><span class="difficulty-option-description">${escapeHtml(option.description)}</span></span>
                  <svg class="difficulty-option-check" viewBox="0 0 16 16" aria-hidden="true"><path d="m3 8 3.2 3.2L13 4.5" /></svg>
                </div>`).join('')}
              </div>
            </div>
            <div class="stat-foot">${data.settings.difficultyPreference === 'adaptive'
              ? `Recommended for ${escapeHtml(focus.topic.title)} · adjusts from recent answers`
              : 'Fixed for learning sessions · review keeps original questions'}
            </div>
          </article>
          ${renderStatsCard('Questions answered', String(attempts.length), `${accuracyFor(attempts)}% overall accuracy`)}
          ${renderStatsCard('Topics mastered', String(mastered), '3+ attempts · 80% accuracy')}
          </div>
          <span class="progress-badge">Private on this device</span>
        </section>
        <section class="panel start-panel" aria-labelledby="start-heading">
          <div class="start-main">
            <p class="eyebrow">Recommended next</p>
            <h2 id="start-heading">${escapeHtml(focus.topic.title)}</h2>
            <p class="small muted">${data.settings.difficultyPreference === 'adaptive'
              ? 'Adaptive practice selects a topic and adjusts question difficulty from your recent answers.'
              : `Practice at ${escapeHtml(difficultyLabel)} difficulty. Change the level above whenever you want.`}</p>
            <div class="mode-toggle" role="group" aria-label="Choose learning mode">
              <button class="mode-button" type="button" data-action="set-mode" data-mode="adaptive" aria-pressed="${selectedMode === 'adaptive'}">Adapative Learning</button>
              <button class="mode-button" type="button" data-action="set-mode" data-mode="practice" aria-pressed="${selectedMode === 'practice'}">Relaxed practice</button>
            </div>
          </div>
          <div>
            <div class="reason-card"><strong>Why this topic?</strong>${escapeHtml(focusReason)}</div>
            <button class="button button-primary full-width" style="margin-top:11px" type="button" data-action="start-learning">Start learning <span aria-hidden="true">→</span></button>
          </div>
        </section>
        </div>
        <section class="topics-section" id="learning-topics">
          <div class="section-heading">
            <div><p class="eyebrow">Choose a learning path</p><h2>Practice by topic</h2></div>
            <p class="small muted">Pick a topic, or let adaptive mode choose.</p>
          </div>
          <div class="topic-filter-select">
            <span>Browse subject</span>
            <div class="topic-filter-menu">
              <button class="topic-filter-trigger" type="button" data-action="toggle-topic-filter" aria-haspopup="listbox" aria-expanded="false" aria-controls="topic-filter-options">
                <span>${topicFilters.find(([id]) => id === topicFilter)?.[1] || 'All topics'}</span>
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg>
              </button>
              <div class="topic-filter-options" id="topic-filter-options" role="listbox" aria-label="Filter topics by subject" hidden>
                ${topicFilters.map(([id, label]) => `<button class="topic-filter-option" type="button" role="option" aria-selected="${topicFilter === id}" data-action="filter-topics" data-filter="${id}">
                  <span>${label}</span>
                  <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3 8 3.2 3.2L13 4.5" /></svg>
                </button>`).join('')}
              </div>
            </div>
          </div>
          <div class="topic-grid">${visibleTopics.map(renderTopicCard).join('')}</div>
        </section>
        <section class="review-section">
          <div class="review-hero panel">
            <div>
              <p class="eyebrow">Turn mistakes into momentum</p>
              <h2>${reviewQueue.length ? `${reviewQueue.length} question${reviewQueue.length === 1 ? '' : 's'} ready to revisit` : 'You are all caught up'}</h2>
              <p class="small muted">${reviewQueue.length ? 'Review questions you missed recently and strengthen the ideas behind each answer.' : 'Keep practicing and missed questions will appear here automatically.'}</p>
            </div>
            <button class="button button-primary" type="button" data-action="start-review" ${reviewQueue.length ? '' : 'disabled'}>${reviewQueue.length ? 'Start review' : 'No questions yet'} <span aria-hidden="true">→</span></button>
          </div>
          ${reviewQueue.length ? `<div class="review-list">${reviewItems}</div>` : '<div class="empty-state review-empty">No missed questions in your review queue yet.</div>'}
        </section>
        <div class="dashboard-footer">
          <span class="small muted">Your progress stays private on this device.</span>
          <span class="small muted">${completedSessions} completed ${completedSessions === 1 ? 'session' : 'sessions'} on this device</span>
        </div>
      </section>`;
    app.dataset.dashboardTab = activeDashboardTab;
  }

  function enemyForQuestion(questionNumber) {
    if (questionNumber >= 8) return ENEMIES[3];
    return ENEMIES[Math.floor((questionNumber - 1) / 3) % 3];
  }

  function shuffleChoices(choices) {
    const shuffled = choices.map((text, originalIndex) => ({ text, originalIndex }));
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }
    return shuffled;
  }

  function renderAnswerFeedback() {
    if (!activeRun.answered) return '';
    const question = activeRun.question;
    const title = activeRun.correct
      ? 'Correct — nice work!'
      : (activeRun.timedOut ? 'Time is up — answer recorded.' : 'Answer recorded — review this explanation.');
    const correctAnswer = question.choices[question.answer];
    const detail = activeRun.correct
      ? question.explanation
      : `The correct answer is “${escapeHtml(correctAnswer)}”. ${escapeHtml(question.explanation)}`;
    return `<div class="feedback-box ${activeRun.correct ? 'good' : 'try-again'}" role="status" aria-live="polite">
      <div class="feedback-title">${escapeHtml(title)}</div>
      <div>${detail}</div>
    </div>`;
  }

  function renderGame() {
    const run = activeRun;
    if (!run || !run.question) {
      view = 'dashboard';
      renderDashboard();
      return;
    }
    const topic = topics.get(run.currentTopic);
    const enemy = enemyForQuestion(run.questionNumber);
    const adaptive = run.mode === 'adaptive';
    const healthWidth = adaptive ? run.health : 100;
    const enemyHealth = run.enemyHealth;
    const question = run.question;
    const correctChoiceIndex = run.displayChoices.findIndex(choice => choice.originalIndex === question.answer);
    const session = updateSessionFromRun();
    const answers = run.displayChoices.map((choice, index) => {
      const correctClass = run.answered && index === correctChoiceIndex ? ' correct' : '';
      const wrongClass = run.answered && index === run.selectedIndex && !run.correct ? ' incorrect' : '';
      return `<button class="answer-option${correctClass}${wrongClass}" type="button" data-answer="${index}" ${run.answered ? 'disabled' : ''}>
        <span class="answer-key">${String.fromCharCode(65 + index)}</span><span>${escapeHtml(choice.text)}</span>
      </button>`;
    }).join('');

    app.innerHTML = `
      <section class="game-layout">
        <div class="panel game-main">
          <div class="game-header">
            <div><p class="eyebrow">${adaptive ? 'Adapative Learning' : run.mode === 'review' ? 'Mistake review' : 'Relaxed practice'}</p><p class="game-progress">Question ${run.questionNumber} of ${run.questionLimit}</p></div>
            <button class="button button-secondary button-small" type="button" data-action="leave-game">Exit session</button>
          </div>
          <div class="enemy-card">
            <div class="enemy-details"><div><div class="enemy-name">${escapeHtml(enemy.name)}</div><p class="enemy-flavor">${escapeHtml(enemy.flavor)}</p></div><span class="enemy-art" aria-hidden="true">${enemy.icon}</span></div>
            <div class="enemy-health">
              <div class="mastery-line"><span>Challenge energy</span><span>${enemyHealth} / 100</span></div>
              <div class="progress-track" role="progressbar" aria-label="Challenge energy" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${enemyHealth}"><div class="progress-fill" style="width:${enemyHealth}%"></div></div>
            </div>
          </div>
          <div class="player-status" aria-label="Your session status">
            <div class="player-status-item player-health-status">
              <span class="player-status-icon" aria-hidden="true">♥</span>
              <span><small>Your HP</small><strong>${adaptive ? `${run.health} / 100` : 'Practice'}</strong></span>
            </div>
            <div class="player-status-item">
              <span class="player-status-icon wrong" aria-hidden="true">×</span>
              <span><small>Wrong answers</small><strong>${session?.wrong || 0}</strong></span>
            </div>
            <div class="player-status-item">
              <span class="player-status-icon correct" aria-hidden="true">✓</span>
              <span><small>Correct</small><strong>${session?.correct || 0}</strong></span>
            </div>
          </div>
          <article class="panel question-card">
            <div class="question-meta">
              <span class="subject-tag">${escapeHtml(topic.subject)}</span>
              <span class="subject-tag">${escapeHtml(topic.title)}</span>
              <span class="difficulty-tag ${escapeHtml(question.difficulty)}">${escapeHtml(question.difficulty)}</span>
            </div>
            <h2 class="question-prompt">${escapeHtml(question.prompt)}</h2>
            <div class="answer-list" role="group" aria-label="Answer choices">${answers}</div>
            ${renderAnswerFeedback()}
            <details class="mobile-question-reason">
              <summary>Why this question?</summary>
              <p>${escapeHtml(run.currentReason)}</p>
            </details>
          </article>
          ${run.answered ? `<div class="answer-action-panel">
            <div class="answer-action-copy">
              <span class="answer-action-kicker">${activeRun.correct ? 'Challenge weakened' : 'Keep going'}</span>
              <span class="small muted">${activeRun.correct ? 'Nice work. You are ready for the next question.' : adaptive ? 'Use the explanation above and try the next question.' : 'Review the explanation before continuing.'}</span>
            </div>
            <button class="button button-primary" type="button" data-action="next-question" disabled>Continue in 3s <span aria-hidden="true">→</span></button>
          </div>` : ''}
        </div>
        <aside class="game-sidebar" aria-label="Session information">
          <section class="panel side-card">
            <h3>Session status</h3>
            <div class="side-stat"><span>Health</span><strong>${adaptive ? `${run.health} / 100` : 'No health loss'}</strong></div>
            ${adaptive ? `<div class="progress-track" role="progressbar" aria-label="Player health" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${healthWidth}"><div class="progress-fill" style="width:${healthWidth}%;background:${healthWidth <= 35 ? 'var(--red)' : 'var(--green)'}"></div></div>` : ''}
            <div class="side-stat"><span>Correct</span><strong>${session?.correct || 0}</strong></div>
            <div class="side-stat"><span>Wrong answers</span><strong>${session?.wrong || 0}</strong></div>
            <div class="side-stat"><span>Questions</span><strong>${session?.questionCount || 0} / ${run.questionLimit}</strong></div>
            <div class="clock" ${adaptive && !run.answered ? '' : 'hidden'}><span class="small muted">Time left</span><strong class="clock-value"><span id="timer-value">${run.timeLeft}</span>s</strong></div>
            <div class="progress-track" id="timer-track" ${adaptive && !run.answered ? '' : 'hidden'} style="margin-top:9px"><div id="timer-fill" class="progress-fill" style="width:${(run.timeLeft / QUESTION_TIME) * 100}%;background:var(--gold)"></div></div>
          </section>
          <section class="panel side-card">
            <h3>Why this question?</h3>
            <p class="adapt-reason">${escapeHtml(run.currentReason)}</p>
            <p class="small muted" style="margin:14px 0 0">The selection rule balances observed mastery, amount of evidence, and review timing. Your answer is saved locally after each question.</p>
          </section>
        </aside>
      </section>`;
    if (adaptive && !run.answered) startTimer();
    if (run.answered) startContinueCountdown();
  }

  function renderResult() {
    const session = lastRun && data.sessions.find(item => item.id === lastRun.id);
    if (!session) {
      view = 'dashboard';
      renderDashboard();
      return;
    }
    const attempts = data.attempts.filter(attempt => attempt.sessionId === session.id);
    const accuracy = accuracyFor(attempts);
    const cleanFinish = session.status === 'completed';
    const title = cleanFinish ? 'Quest complete' : session.status === 'defeated' ? 'The bugs fought back' : 'Session ended';
    const topicIds = Array.from(new Set(attempts.map(attempt => attempt.topicId)));
    const topicRows = topicIds.length
      ? topicIds.map(topicId => {
        const topic = topics.get(topicId);
        const topicAttempts = attempts.filter(attempt => attempt.topicId === topicId);
        const topicAccuracy = accuracyFor(topicAttempts);
        return `<div class="result-topic"><span>${escapeHtml(topic.title)}</span><div class="progress-track"><div class="progress-fill" style="width:${topicAccuracy}%"></div></div><strong>${topicAccuracy}%</strong></div>`;
      }).join('')
      : '<div class="empty-state">No questions were answered this session. Try a topic when you are ready.</div>';
    const label = session.mode === 'adaptive' ? 'Adapative Learning' : session.mode === 'review' ? 'Mistake review' : 'Relaxed practice';
    app.innerHTML = `
      <section class="result-layout">
        ${cleanFinish ? '<div class="result-mark is-complete" aria-hidden="true">✓</div>' : ''}
        <p class="eyebrow result-kicker">${escapeHtml(label)}</p>
        <h1>${escapeHtml(title)}</h1>
        <p class="result-intro muted">${cleanFinish ? 'Every attempt is useful evidence. Review your results and decide what to practice next.' : 'Your progress so far has been saved. You can continue from the dashboard whenever you are ready.'}</p>
        <div class="panel result-panel">
          <div class="result-stats">
            <div class="result-stat result-stat-primary"><div class="stat-label">Answered</div><strong>${session.questionCount}</strong><span>questions attempted</span></div>
            <div class="result-stat"><div class="stat-label">Accuracy</div><strong>${accuracy}%</strong><span>overall performance</span></div>
            <div class="result-stat"><div class="stat-label">Challenges cleared</div><strong>${session.kills}</strong><span>bugs defeated</span></div>
          </div>
          <div class="result-section-heading"><p class="eyebrow">What you practiced</p><h2>Topic results</h2><span class="result-section-line"></span></div>
          <div class="result-topic-list">${topicRows}</div>
        </div>
        <div class="button-row result-actions">
          <button class="button button-primary" type="button" data-action="start-learning">Play another session</button>
          <button class="button button-secondary" type="button" data-action="home">Back to dashboard</button>
        </div>
      </section>`;
  }

  function renderSettings() {
    const active = data.sessions.filter(session => session.status === 'in_progress').length;
    const hasRecoveryCopy = getRecoveryCopy() !== null;
    app.innerHTML = `
      <section class="settings-layout">
        <button class="button button-secondary button-small" type="button" data-action="home">← Dashboard</button>
        <div style="margin-top:24px"><p class="eyebrow">Local data</p><h1>Data & settings</h1><p class="muted small">This prototype stores progress in this browser only. It does not sync between devices.</p></div>
        ${hasRecoveryCopy ? `<div class="data-warning" style="margin-top:16px">A previous save could not be read. It is preserved separately and will not be imported automatically. Download this recovery copy before resetting if you may need it. <button class="button button-small button-secondary" style="margin-top:10px" type="button" data-action="export-recovery">Download recovery copy</button></div>` : ''}
        <section class="panel settings-card">
          <h2>Profile</h2>
          <p>Current display name: <strong>${escapeHtml(data.profile.name || 'Not set')}</strong>. Progress is not associated with a verified identity.</p>
          <form id="rename-form">
            <label class="small" for="rename-name">Change display name</label>
            <input class="text-input" id="rename-name" name="name" maxlength="24" value="${escapeHtml(data.profile.name)}" required>
            <button class="button button-secondary button-small" style="margin-top:10px" type="submit">Save name</button>
          </form>
        </section>
        <section class="panel settings-card">
          <h2>Progress backup</h2>
          <p>Export a JSON backup before changing browsers or clearing browser data. Import replaces the current local profile and its history.</p>
          <div class="settings-actions">
            <button class="button button-primary button-small" type="button" data-action="export">Export JSON backup</button>
            <label class="button button-secondary button-small file-label" for="import-file">Choose backup to import</label>
          </div>
          <p class="small" style="margin:14px 0 0">This browser currently has ${data.attempts.length} answer records, ${data.sessions.length} sessions, and ${active} unfinished session${active === 1 ? '' : 's'}.</p>
        </section>
        <section class="panel settings-card">
          <h2>About this prototype</h2>
          <p>The adaptive selector is rule-based and explainable. It prioritizes topics with lower estimated mastery, limited evidence, and older review dates. Difficulty responds to the topic’s recent answers. This is a learning aid, not a validated assessment or diagnostic tool.</p>
          <div class="side-stat"><span>Answer sounds</span><strong>${data.settings.soundEnabled ? 'On' : 'Off'}</strong></div>
          <button class="button button-secondary button-small" style="margin-top:10px" type="button" data-action="toggle-sounds">${data.settings.soundEnabled ? 'Turn sounds off' : 'Turn sounds on'}</button>
        </section>
        <section class="panel settings-card">
          <h2>Reset local progress</h2>
          <p>This removes this app’s saved profile, questions, and sessions from this browser. It does not clear other site data.</p>
          <button class="button button-danger button-small" type="button" data-action="reset">Reset CodeQuest data</button>
        </section>
      </section>`;
  }

  function render() {
    renderNotice();
    renderNavigation();
    document.body.classList.toggle('game-view', view === 'game');
    document.body.classList.toggle('result-view', view === 'result');
    if (view === 'login') renderLogin();
    else if (view === 'dashboard') renderDashboard();
    else if (view === 'game') renderGame();
    else if (view === 'result') renderResult();
    else if (view === 'settings') renderSettings();
    else {
      view = data.profile.name ? 'dashboard' : 'login';
      render();
      return;
    }
    const focusTarget = view === 'game'
      ? app.querySelector(activeRun && activeRun.answered ? '.feedback-box' : '.question-prompt')
      : app.querySelector('h1');
    if (focusTarget) {
      focusTarget.tabIndex = -1;
      focusTarget.focus({ preventScroll: true });
    }
  }

  function renderNavigation() {
    const nav = document.querySelector('.main-nav');
    if (!nav) return;
    nav.hidden = !['dashboard', 'settings'].includes(view);
    const dashboardButton = nav.querySelector('[data-action="nav-dashboard"]');
    const topicsButton = nav.querySelector('[data-action="nav-topics"]');
    const reviewButton = nav.querySelector('[data-action="review"]');
    if (!dashboardButton || !topicsButton || !reviewButton) return;
    dashboardButton.setAttribute('aria-current', view === 'dashboard' && activeDashboardTab === 'overview' ? 'page' : 'false');
    topicsButton.setAttribute('aria-current', view === 'dashboard' && activeDashboardTab === 'topics' ? 'page' : 'false');
    reviewButton.setAttribute('aria-current', view === 'dashboard' && activeDashboardTab === 'review' ? 'page' : 'false');
    reviewButton.querySelector('[data-review-count]').textContent = String(getReviewQueue().length);
    reviewButton.setAttribute('aria-label', `Review missed questions, ${getReviewQueue().length} available`);
  }

  function launchChosenMode() {
    startSession(data.settings.mode);
  }

  function exportData() {
    try {
      const payload = {
        app: 'CodeQuest',
        schemaVersion: 1,
        exportedAt: new Date().toISOString(),
        data
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `codequest-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.append(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      notify('Your CodeQuest backup was exported.');
    } catch (error) {
      notify(`Export failed: ${error.message}`);
    }
  }

  function exportRecoveryCopy() {
    const recovery = getRecoveryCopy();
    if (recovery === null) {
      notify('No recovery copy is available in this browser.');
      return;
    }
    try {
      const blob = new Blob([recovery], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'codequest-recovery-copy.txt';
      document.body.append(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      notify('The preserved raw save was downloaded as a recovery copy.');
    } catch (error) {
      notify(`Recovery export failed: ${error.message}`);
    }
  }

  async function importData(file) {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const candidate = isPlainObject(parsed) && parsed.data ? parsed.data : parsed;
      const imported = validateData(candidate);
      if (!imported.profile.name) throw new Error('The backup does not contain a display name.');
      if (!window.confirm(`Replace the current local profile with “${imported.profile.name}” and ${imported.attempts.length} answer records? Export your current data first if you want to keep it.`)) return;
      data = imported;
      activeRun = null;
      lastRun = null;
      view = 'dashboard';
      saveData();
      notify('Backup imported. This profile is now saved in this browser.');
      render();
    } catch (error) {
      notify(`Import failed. Current progress was not changed. ${error.message}`);
    } finally {
      importFile.value = '';
    }
  }

  function resetData() {
    if (!window.confirm('Permanently remove this app’s saved profile and learning history from this browser? Export a backup first if needed.')) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(`${STORAGE_KEY}.recovery`);
      data = emptyData();
      activeRun = null;
      lastRun = null;
      view = 'login';
      storageRecovery = null;
      storageWarning = '';
      noticeMessage = '';
      render();
    } catch (error) {
      notify(`Reset failed: ${error.message}`);
    }
  }

  document.addEventListener('submit', event => {
    if (event.target.id === 'login-form') {
      event.preventDefault();
      const field = document.getElementById('player-name');
      const name = cleanDisplayName(field.value);
      if (!name) {
        field.setCustomValidity('Enter a display name to continue.');
        field.reportValidity();
        return;
      }
      field.setCustomValidity('');
      data.profile.name = name;
      saveData();
      view = 'dashboard';
      render();
    } else if (event.target.id === 'rename-form') {
      event.preventDefault();
      const field = document.getElementById('rename-name');
      const name = cleanDisplayName(field.value);
      if (!name) {
        field.setCustomValidity('Enter a display name.');
        field.reportValidity();
        return;
      }
      field.setCustomValidity('');
      data.profile.name = name;
      field.value = name;
      const saved = saveData();
      renderSettings();
      renderNavigation();
      if (saved) notify('Display name updated.', 1200);
    }
  });

  document.addEventListener('click', event => {
    if (!event.target.closest('.difficulty-select-wrap')) closeDifficultyMenu();
    if (!event.target.closest('.topic-filter-menu')) closeTopicFilterMenu();
    const answer = event.target.closest('[data-answer]');
    if (answer) {
      answerQuestion(Number(answer.dataset.answer));
      return;
    }
    const control = event.target.closest('[data-action]');
    if (!control) return;
    if (control.tagName === 'A') event.preventDefault();
    const action = control.dataset.action;
    if (action === 'toggle-difficulty') {
      const isOpen = control.getAttribute('aria-expanded') === 'true';
      if (isOpen) closeDifficultyMenu();
      else openDifficultyMenu();
    } else if (action === 'toggle-topic-filter') {
      toggleTopicFilterMenu();
    } else if (action === 'choose-difficulty') {
      setDifficultyPreference(control.dataset.difficulty);
    } else if (action === 'confirm-session-exit') {
      confirmSessionExit();
    } else if (action === 'home') {
      if (requestSessionExit('home')) return;
      activeRun = null;
      activeDashboardTab = 'overview';
      view = data.profile.name ? 'dashboard' : 'login';
      render();
    } else if (action === 'nav-dashboard') {
      activeDashboardTab = 'overview';
      view = 'dashboard';
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (action === 'nav-topics') {
      activeDashboardTab = 'topics';
      view = 'dashboard';
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (action === 'filter-topics') {
      const filter = control.dataset.filter;
      if (!['all', 'html', 'css', 'javascript', 'csharp'].includes(filter)) return;
      topicFilter = filter;
      renderDashboard();
      renderNavigation();
    } else if (action === 'open-data') {
      if (requestSessionExit('settings')) return;
      activeRun = null;
      view = 'settings';
      render();
    } else if (action === 'set-mode') {
      const mode = control.dataset.mode;
      if (!['adaptive', 'practice'].includes(mode)) return;
      const previousMode = data.settings.mode;
      data.settings.mode = mode;
      if (saveData()) updateModeButtons(mode);
      else data.settings.mode = previousMode;
    } else if (action === 'start-learning') {
      launchChosenMode();
    } else if (action === 'start-topic') {
      if (topics.has(control.dataset.topic)) startSession('practice', control.dataset.topic);
    } else if (action === 'review') {
      activeDashboardTab = 'review';
      view = 'dashboard';
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (action === 'start-review') {
      if (getReviewQueue().length) startSession('review');
      else notify('There are no missed questions to review yet. Keep practicing and missed questions will appear here.', 1000);
    } else if (action === 'next-question') {
      if (!activeRun || !activeRun.answered || Date.now() < activeRun.continueAt) return;
      stopContinueCountdown();
      if (activeRun.health <= 0 && activeRun.mode === 'adaptive') finishSession('defeated');
      else if (activeRun.questionNumber >= activeRun.questionLimit) finishSession('completed');
      else loadNextQuestion();
    } else if (action === 'leave-game') {
      requestSessionExit('leave-game');
    } else if (action === 'export') {
      exportData();
    } else if (action === 'export-recovery') {
      exportRecoveryCopy();
    } else if (action === 'toggle-sounds') {
      data.settings.soundEnabled = !data.settings.soundEnabled;
      saveData();
      render();
    } else if (action === 'reset') {
      resetData();
    }
  });

  document.addEventListener('keydown', event => {
    const trigger = event.target.closest('[data-action="toggle-difficulty"]');
    const topicTrigger = event.target.closest('[data-action="toggle-topic-filter"]');
    const topicOption = event.target.closest('.topic-filter-option');
    const option = event.target.closest('[role="option"][data-difficulty]');
    if (trigger) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        openDifficultyMenu(true);
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (trigger.getAttribute('aria-expanded') === 'true') closeDifficultyMenu();
        else openDifficultyMenu(true);
      } else if (event.key === 'Escape' && trigger.getAttribute('aria-expanded') === 'true') {
        event.preventDefault();
        closeDifficultyMenu();
      }
      return;
    }
    if (topicTrigger) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        toggleTopicFilterMenu();
        const options = topicTrigger.closest('.topic-filter-menu')?.querySelectorAll('.topic-filter-option');
        const selected = topicTrigger.closest('.topic-filter-menu')?.querySelector('.topic-filter-option[aria-selected="true"]');
        if (options && selected) selected.focus();
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleTopicFilterMenu();
      } else if (event.key === 'Escape' && topicTrigger.getAttribute('aria-expanded') === 'true') {
        event.preventDefault();
        closeTopicFilterMenu(true);
      }
      return;
    }
    if (topicOption) {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeTopicFilterMenu(true);
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const options = Array.from(topicOption.closest('.topic-filter-menu').querySelectorAll('.topic-filter-option'));
        const index = options.indexOf(topicOption);
        const nextIndex = (index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
        options[nextIndex].focus();
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        topicOption.click();
      }
      return;
    }
    if (!option) return;
    const options = Array.from(document.querySelectorAll('#difficulty-options [role="option"]'));
    const index = options.indexOf(option);
    let nextIndex = index;
    if (event.key === 'ArrowDown') nextIndex = (index + 1) % options.length;
    else if (event.key === 'ArrowUp') nextIndex = (index - 1 + options.length) % options.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = options.length - 1;
    else if (event.key === 'Escape') {
      event.preventDefault();
      closeDifficultyMenu(true);
      return;
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setDifficultyPreference(option.dataset.difficulty);
      return;
    } else {
      return;
    }
    event.preventDefault();
    options[nextIndex].focus();
  });

  document.addEventListener('focusout', event => {
    const wrapper = event.target.closest('.difficulty-select-wrap');
    if (wrapper && !wrapper.contains(event.relatedTarget)) closeDifficultyMenu();
  });

  importFile.addEventListener('change', () => importData(importFile.files && importFile.files[0]));
  sessionExitDialog.addEventListener('close', () => {
    pendingSessionExit = null;
  });

  const interrupted = data.sessions.filter(session => session.status === 'in_progress');
  if (interrupted.length) {
    interrupted.forEach(session => {
      session.status = 'interrupted';
      session.endedAt = new Date().toISOString();
    });
    saveData();
  }

  view = data.profile.name ? 'dashboard' : 'login';
  render();
})();
