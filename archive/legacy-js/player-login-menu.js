// Player name — persists across sessions
let playerName = '';
let playerId   = '';

// Generate a UUID v4 for unique player identification
function generateUUID() {
  if (crypto && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

function submitLogin() {
  const input = document.getElementById('login-name');
  const name  = input.value.trim();
  const errEl = document.getElementById('login-error');

  if (!name) {
    errEl.style.display = 'block';
    input.style.borderColor = 'var(--red)';
    input.setAttribute('aria-invalid', 'true');
    input.focus();
    return;
  }

  errEl.style.display = 'none';
  input.style.borderColor = '';
  input.setAttribute('aria-invalid', 'false');

  playerName = name;
  localStorage.setItem('playerName', name);

  // Assign a persistent UUID if not already set for this browser
  // Each browser/device gets its own unique ID, even if names match
  if (!localStorage.getItem('playerId')) {
    localStorage.setItem('playerId', generateUUID());
  }
  playerId = localStorage.getItem('playerId');

  showMenu();
}

function showMenu() {
  document.getElementById('menu-lv').textContent = player.level;
  document.getElementById('menu-xp').textContent = player.xp;

  const nameEl = document.getElementById('menu-name');
  if (nameEl) nameEl.textContent = playerName.toUpperCase();

  const subjEl = document.getElementById('menu-subj');
  if (subjEl) renderSubj('menu-subj', scores);

  updateLearningControls();
  updateFeedbackButtonState();
  show('menu');
}

function goMenu() {
  reviewMode = false;
  activeLearningPath = null;
  showMenu();
}

function replayTutorial() {
  showTutorial();
}

// Auto-fill name from previous session
window.addEventListener('DOMContentLoaded', () => {
  const savedName = localStorage.getItem('playerName');
  const savedId   = localStorage.getItem('playerId');

  if (savedName) {
    playerName = savedName;
    const input = document.getElementById('login-name');
    if (input) input.value = savedName;
  }
  if (savedId) {
    playerId = savedId;
  }

  const input = document.getElementById('login-name');
  if (input) input.focus();
});

// Feedback Modal Functions
function updateFeedbackButtonState() {
  const btn = document.getElementById('menu-feedback-btn');
  if (!btn) return;
  
  // Visual indicator only. We do NOT set btn.disabled = true because 
  // the button must remain clickable to trigger the access restriction modal.
  if (typeof feedbackUnlocked !== 'undefined' && feedbackUnlocked) {
    btn.classList.remove('menu-feedback-locked');
    btn.title = "Share your feedback with the devs";
  } else {
    btn.classList.add('menu-feedback-locked');
    btn.title = "Feedback unlocks after your first game session";
  }
}

function handleMainMenuFeedback() {
  const isUnlocked = typeof feedbackUnlocked !== 'undefined' && feedbackUnlocked;
  if (isUnlocked) {
    // Open the actual feedback form
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSdJI63tL1yxJV57GiQuvk9U6CqgFytCflohWTMXfWufoCBsgw/viewform?usp=sharing&ouid=117410015244264144419', '_blank');
  } else {
    // Show the locked modal
    showFeedbackModal();
  }
}

function showFeedbackModal() {
  const overlay = document.getElementById('feedback-modal-overlay');
  const modal = document.getElementById('feedback-modal');
  
  if (overlay && modal) {
    overlay.classList.add('show');
    modal.classList.add('show');
  }
}

function closeFeedbackModal() {
  const overlay = document.getElementById('feedback-modal-overlay');
  const modal = document.getElementById('feedback-modal');
  
  if (overlay && modal) {
    overlay.classList.remove('show');
    modal.classList.remove('show');
  }
}

// Close modal when clicking on overlay
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('feedback-modal-overlay');
  if (overlay) {
    overlay.addEventListener('click', closeFeedbackModal);
  }
});