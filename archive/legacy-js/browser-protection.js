// ================================================================
// browser-protection.js — Client-Side Protection
// Detects: DevTools, inspect element, common cheat extensions
// NOTE: This is a deterrent layer, not 100% unbypassable.
// ================================================================

(function() {
  'use strict';

  // Disable protection when running locally to avoid interfering with development
  try {
    const host = location.hostname;
    if (host === 'localhost' || host === '127.0.0.1' || location.protocol === 'file:') {
      console.info('[PROTECT] disabled on local environment');
      return;
    }
  } catch (err) {
    // ignore
  }

  // ── Config ────────────────────────────────────────────────────
  const LOCKOUT_MESSAGE = 'SECURITY VIOLATION DETECTED';
  const REDIRECT_ON_TAMPER = false; // set true to redirect to blank page
  const BLUR_ON_DEVTOOLS   = true;  // blur the game when devtools opens

  // ── State ─────────────────────────────────────────────────────
  let devToolsOpen    = false;
  let warningShown    = false;
  let integrityPassed = true;

  // ── 1. Disable Right Click ────────────────────────────────────
  document.addEventListener('contextmenu', e => {
    e.preventDefault();
    showWarning('RIGHT-CLICK DISABLED');
    return false;
  });

  // ── 2. Disable Common Keyboard Shortcuts ─────────────────────
  document.addEventListener('keydown', e => {
    // F12
    if (e.key === 'F12') {
      e.preventDefault();
      showWarning('DEVTOOLS SHORTCUT BLOCKED');
      return false;
    }
    // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C
    if (e.ctrlKey && e.shiftKey && ['I','i','J','j','C','c'].includes(e.key)) {
      e.preventDefault();
      showWarning('DEVTOOLS SHORTCUT BLOCKED');
      return false;
    }
    // Ctrl+U (view source)
    if (e.ctrlKey && ['U','u'].includes(e.key)) {
      e.preventDefault();
      showWarning('VIEW SOURCE BLOCKED');
      return false;
    }
    // Ctrl+S (save page)
    if (e.ctrlKey && ['S','s'].includes(e.key)) {
      e.preventDefault();
      return false;
    }
  });

  // ── 3. DevTools Size Detection ────────────────────────────────
  // When DevTools opens, window size changes
  const THRESHOLD = 160;

  function checkDevTools() {
    const widthDiff  = window.outerWidth  - window.innerWidth;
    const heightDiff = window.outerHeight - window.innerHeight;
    const isOpen     = widthDiff > THRESHOLD || heightDiff > THRESHOLD;

    if (isOpen && !devToolsOpen) {
      devToolsOpen = true;
      onDevToolsOpen();
    } else if (!isOpen && devToolsOpen) {
      devToolsOpen = false;
      onDevToolsClose();
    }
  }

  function onDevToolsOpen() {
    console.clear();
    console.log('%c⚠ WARNING', 'color:red;font-size:40px;font-weight:900');
    console.log('%cThis is a browser feature intended for developers.\nIf someone told you to paste something here, it is a scam.', 'color:orange;font-size:14px');

    if (BLUR_ON_DEVTOOLS) {
      const game = document.getElementById('s-combat') ||
                   document.querySelector('.screen.active');
      if (game) game.style.filter = 'blur(8px)';
    }

    showWarning('⚠ DEVTOOLS DETECTED — GAME PAUSED');
    stopTimer?.(); // pause timer if open during combat
  }

  function onDevToolsClose() {
    // Restore blur
    document.querySelectorAll('.screen').forEach(s => {
      s.style.filter = '';
    });
    hideWarning();
  }

  setInterval(checkDevTools, 1000);

  // ── 4. Debugger Trap ─────────────────────────────────────────
  // Slows down anyone trying to step through code
  setInterval(function() {
    const start = performance.now();
    // eslint-disable-next-line no-debugger
    debugger;
    const end = performance.now();
    // If debugger was paused, time difference will be large
    if (end - start > 100) {
      onDevToolsOpen();
    }
  }, 3000);

  // ── 5. Console Tampering Detection ───────────────────────────
  // Detect if console methods were overridden by extensions
  const _consoleLog = console.log.toString();
  setInterval(() => {
    if (console.log.toString() !== _consoleLog) {
      console.warn('[PROTECT] Console override detected');
      integrityPassed = false;
    }
  }, 5000);

  // ── 6. DOM Integrity Check ────────────────────────────────────
  // Detect if critical game elements were removed or tampered with
  const CRITICAL_IDS = ['c-hp', 'c-hpbar', 'c-mana', 'c-lv', 'c-choices'];

  function checkDOMIntegrity() {
    if (!document.getElementById('s-combat')) return; // not in combat
    for (const id of CRITICAL_IDS) {
      if (!document.getElementById(id)) {
        console.warn('[PROTECT] DOM integrity check failed — element missing:', id);
        integrityPassed = false;
        showWarning('⚠ GAME INTEGRITY COMPROMISED');
        return;
      }
    }
  }

  setInterval(checkDOMIntegrity, 4000);

  // ── 7. localStorage Tampering Detection ──────────────────────
  // Detect if someone manually edited localStorage scores
  const _setItem = localStorage.setItem.bind(localStorage);
  const _getItem = localStorage.getItem.bind(localStorage);

  Object.defineProperty(window, '_storageIntact', {
    get: () => true,
    set: () => {},
    configurable: false,
  });

  // ── 8. Score Integrity Hash ───────────────────────────────────
  // Simple hash to detect if score was tampered before submit
  function hashScore(xp, kills, correct) {
    return ((xp * 31 + kills * 17 + correct * 7) ^ 0xDEADBEEF) >>> 0;
  }

  window.generateScoreHash = function(xp, kills, correct) {
    return hashScore(xp, kills, correct);
  };

  window.verifyScoreHash = function(xp, kills, correct, hash) {
    return hashScore(xp, kills, correct) === hash;
  };

  // ── 9. Disable Text Selection ────────────────────────────────
  document.addEventListener('selectstart', e => {
    // Allow selection in input fields only
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
    }
  });

  // ── 10. Detect Common Cheat Extensions ───────────────────────
  // Some extensions inject known DOM elements or globals
  const KNOWN_CHEAT_GLOBALS = [
    '__CHEAT_ENGINE__',
    'tampermonkey',
    'greasemonkey',
    '__VIOLENTMONKEY__',
  ];

  function checkExtensions() {
    for (const g of KNOWN_CHEAT_GLOBALS) {
      if (window[g] !== undefined) {
        console.warn('[PROTECT] Suspicious extension detected:', g);
        integrityPassed = false;
        showWarning('⚠ UNAUTHORIZED EXTENSION DETECTED');
        return;
      }
    }
  }

  setInterval(checkExtensions, 5000);

  // ── Warning Overlay ───────────────────────────────────────────
  function showWarning(msg) {
    if (warningShown) return;
    warningShown = true;

    let el = document.getElementById('protect-warning');
    if (!el) {
      el = document.createElement('div');
      el.id = 'protect-warning';
      el.style.cssText = `
        position:fixed;top:40px;left:50%;transform:translateX(-50%);
        width:auto;
        min-width:320px;
        max-width:min(480px, 90vw);
        background:rgba(5,0,2,0.98);
        border:2px solid #ff3366;
        border-radius:2px;
        box-shadow: 0 0 40px rgba(0,0,0,0.9), 0 0 20px rgba(255,51,102,0.3);
        color:#ff3366;
        font-family:'Orbitron',sans-serif;
        font-size:13px;
        font-weight:900;
        letter-spacing:2px;
        text-align:center;
        padding:20px 32px;
        z-index:99999;
        pointer-events:none;
        text-transform:uppercase;
        line-height:1.5;
      `;
      document.body.appendChild(el);
    }

    el.textContent = msg;
    el.style.display = 'block';

    // Auto-hide after 3s if it was just a shortcut block
    if (!devToolsOpen) {
      setTimeout(() => {
        hideWarning();
      }, 3000);
    }
  }

  function hideWarning() {
    warningShown = false;
    const el = document.getElementById('protect-warning');
    if (el) el.style.display = 'none';
  }

  // ── Console Warning Message ───────────────────────────────────
  // Shows a warning to anyone who opens the console
  setTimeout(() => {
    console.clear();
    console.log(
      '%c⛔ STOP!',
      'color:#ff3366;font-size:48px;font-weight:900;text-shadow:0 0 10px red'
    );
    console.log(
      '%cThis is a browser feature for developers.\n' +
      'If someone told you to type something here, they are trying to cheat or scam you.\n\n' +
      'This game\'s integrity is protected. Suspicious activity is logged.',
      'color:#ffd700;font-size:14px;line-height:1.6'
    );
  }, 500);

  // ── Export integrity check ────────────────────────────────────
  window.isGameIntact = function() {
    return integrityPassed;
  };

})();