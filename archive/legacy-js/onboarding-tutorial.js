// onboarding-tutorial.js

let tutorialSlides = [];
let currentTutorialSlide = 0;

function initTutorialSlides() {
  tutorialSlides = [
    {
      title: "WELCOME TO CODEQUEST",
      content: "Practice IT concepts through short questions and turn-based challenges. This is a learning space: take your time, try things out, and use every answer to build confidence.",
    },
    {
      title: "HOW TO PLAY",
      content: "1. Choose an action.<br>2. Answer a question about HTML, CSS, JavaScript, or C#.<br>3. Review the explanation after an incorrect answer.<br>4. Earn experience to level up and choose a stat card.",
    },
    {
      title: "ACTION: ⚔ ATTACK",
      content: "<strong>Cost:</strong> 2 mana<br><strong>Correct:</strong> Damage the opponent.<br><strong>Incorrect or time runs out:</strong> The opponent gets a turn. Mana is spent either way.",
    },
    {
      title: "ACTION: 🛡 DEFEND",
      content: "<strong>Cost:</strong> 1 mana<br><strong>Correct:</strong> Block the next hit.<br><strong>Incorrect or time runs out:</strong> Take reduced damage. Mana is spent either way.",
    },
    {
      title: "ACTION: 💚 REPAIR",
      content: "<strong>Cost:</strong> 3 mana<br><strong>Correct:</strong> Restore up to 25 health.<br><strong>Incorrect or time runs out:</strong> The action does not heal, but its mana cost still applies.",
    },
    {
      title: "ACTION: ⚡ CHARGE",
      content: "<strong>Cost:</strong> 0 mana<br><strong>Correct:</strong> Restore 3 mana.<br><strong>Incorrect or time runs out:</strong> No mana is restored.",
    },
    {
      title: "READ YOUR STATUS",
      content: "Health shows how much damage you can take. Mana pays for actions. Your level and experience show learning progress. The opponent's health and next move are shown in the battle area.",
    },
    {
      title: "GROW YOUR SKILLS",
      content: "Correct answers and completed encounters earn experience. Each level lets you choose a stat to improve. Every fifth level offers an Epic reward, and level 10 offers a Legend reward.",
    },
    {
      title: "ABOUT THE TIMER",
      content: "Questions have a 30-second timer, with extra time for some actions. If time runs out, the answer is counted as incorrect. The timer is a challenge—not a measure of your ability.",
    },
    {
      title: "USE SUBJECT STRENGTHS",
      content: "Some opponents are vulnerable to a particular subject. Answering a question in that subject can make your attack more effective.",
    },
    {
      title: "ENCOUNTERS & BOSSES",
      content: "Each set has four regular encounters followed by a boss. After two bosses, a new cycle begins with stronger opponents. Your learning progress remains valuable—even if a run ends.",
    },
    {
      title: "YOU'RE READY",
      content: "Start with what you know, stay curious, and learn from each explanation. There is no shame in getting an answer wrong—that is part of learning. Good luck!",
    }
  ];
}

function showTutorial() {
  initTutorialSlides(); // Initialize slides each time tutorial is shown
  currentTutorialSlide = 0;
  renderTutorialSlide();
  show('tutorial'); // game-utilities.js prepends 's-', so this targets 's-tutorial'
}

function renderTutorialSlide() {
  const slide = tutorialSlides[currentTutorialSlide];
  document.getElementById('tut-title').textContent = slide.title;
  document.getElementById('tut-content').innerHTML = slide.content;
  document.getElementById('tut-progress').textContent =
    `STEP ${currentTutorialSlide + 1} OF ${tutorialSlides.length}`;

  const prevBtn = document.getElementById('tut-prev');
  const nextBtn = document.getElementById('tut-next');

  if (prevBtn) {
    prevBtn.style.display = currentTutorialSlide === 0 ? 'none' : 'inline-block';
  }
  if (nextBtn) {
    nextBtn.textContent = currentTutorialSlide === tutorialSlides.length - 1 ? 'START PRACTICING' : 'CONTINUE →';
  }
}

function nextTutorialSlide() {
  if (currentTutorialSlide < tutorialSlides.length - 1) {
    currentTutorialSlide++;
    renderTutorialSlide();
  } else {
    finishTutorial();
  }
}

function prevTutorialSlide() {
  if (currentTutorialSlide > 0) {
    currentTutorialSlide--;
    renderTutorialSlide();
  }
}

function skipTutorial() {
  finishTutorial();
}

function finishTutorial() {
  localStorage.setItem('tutorialCompleted', 'true');
  _initGame(); // Call the actual game initialization function from battle-system.js
  // The 'show' function (from game-utilities.js) will handle switching to the combat screen
}