const LEARNING_PATHS = {
  html: {
    label: 'HTML',
    description: 'Build accessible, well-structured web pages with semantic HTML.',
    levels: [
      { difficulty: 'easy', title: 'Page Foundations', objectives: ['Recognize common HTML elements and document structure.', 'Use headings, paragraphs, links, and lists.', 'Understand basic image and link attributes.'] },
      { difficulty: 'medium', title: 'Structured Content', objectives: ['Choose semantic elements for page sections.', 'Work with forms, tables, and element attributes.', 'Connect page content to metadata and resources.'] },
      { difficulty: 'hard', title: 'Accessible & Interactive Markup', objectives: ['Choose appropriate semantic markup for complex interfaces.', 'Understand embedded media and interactive elements.', 'Apply accessibility and performance-minded markup concepts.'] }
    ]
  },
  css: {
    label: 'CSS',
    description: 'Style interfaces, control layout, and create responsive designs.',
    levels: [
      { difficulty: 'easy', title: 'Styling Essentials', objectives: ['Connect styles to elements with selectors.', 'Set colors, text styles, borders, and dimensions.', 'Understand the purpose of a CSS rule.'] },
      { difficulty: 'medium', title: 'Layout & Spacing', objectives: ['Use margin, padding, and positioning intentionally.', 'Build layouts with Flexbox and control stacking.', 'Use descendant selectors and reusable style rules.'] },
      { difficulty: 'hard', title: 'Responsive & Advanced CSS', objectives: ['Reason about specificity and pseudo-classes.', 'Use media queries and flexible layout behavior.', 'Apply box sizing, transitions, and custom properties.'] }
    ]
  },
  javascript: {
    label: 'JavaScript',
    description: 'Learn programming fundamentals and the logic behind interactive web apps.',
    levels: [
      { difficulty: 'easy', title: 'Programming Basics', objectives: ['Declare variables and recognize common values.', 'Use operators, comments, and browser output.', 'Understand basic events and control flow.'] },
      { difficulty: 'medium', title: 'Functions & Data', objectives: ['Work with functions, arrays, and objects.', 'Use conditions and loops to solve problems.', 'Respond to browser events and update page content.'] },
      { difficulty: 'hard', title: 'Modern JavaScript Concepts', objectives: ['Reason about scope, callbacks, and asynchronous code.', 'Use modern syntax and built-in data methods.', 'Understand modules and browser APIs.'] }
    ]
  },
  csharp: {
    label: 'C#',
    description: 'Strengthen object-oriented programming and core C# problem-solving skills.',
    levels: [
      { difficulty: 'easy', title: 'C# Foundations', objectives: ['Recognize C# syntax, variables, and common data types.', 'Use output, operators, and basic conditions.', 'Understand the structure of a simple C# program.'] },
      { difficulty: 'medium', title: 'Methods & Collections', objectives: ['Use loops and methods to organize logic.', 'Work with arrays and common collection concepts.', 'Understand parameters, return values, and type behavior.'] },
      { difficulty: 'hard', title: 'Object-Oriented C#', objectives: ['Apply classes, objects, and encapsulation concepts.', 'Reason about inheritance and interfaces.', 'Recognize exceptions and more advanced language features.'] }
    ]
  }
};

let activeLearningPath = null;
let selectedLearningSubject = 'html';

function openLearningPaths(subject = 'html') {
  selectedLearningSubject = LEARNING_PATHS[subject] ? subject : 'html';
  renderLearningPaths();
  show('paths');
}

function renderLearningPaths() {
  const subjectNav = document.getElementById('path-subject-nav');
  subjectNav.replaceChildren();

  Object.entries(LEARNING_PATHS).forEach(([subject, path]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'path-subject-button';
    button.textContent = path.label;
    button.setAttribute('aria-pressed', String(subject === selectedLearningSubject));
    button.addEventListener('click', () => {
      selectedLearningSubject = subject;
      renderLearningPaths();
    });
    subjectNav.append(button);
  });

  const path = LEARNING_PATHS[selectedLearningSubject];
  const subjectScore = scores[selectedLearningSubject];
  const attempted = subjectScore ? subjectScore.c + subjectScore.w : 0;
  const correct = subjectScore ? subjectScore.c : 0;
  document.getElementById('path-subject-title').textContent = path.label;
  document.getElementById('path-subject-description').textContent = path.description;
  document.getElementById('path-subject-score').textContent = `${correct} / ${attempted}`;
  document.getElementById('path-subject-accuracy').textContent = attempted
    ? `${Math.round((correct / attempted) * 100)}% correct across practice`
    : 'No attempts yet';

  const levels = document.getElementById('path-level-list');
  levels.replaceChildren();
  path.levels.forEach((level, index) => {
    const card = document.createElement('article');
    card.className = 'path-level-card';

    const heading = document.createElement('div');
    heading.className = 'path-level-heading';
    const levelNumber = document.createElement('span');
    levelNumber.className = 'path-level-number font-mono';
    levelNumber.textContent = `0${index + 1}`;
    const titleGroup = document.createElement('div');
    const difficulty = document.createElement('span');
    difficulty.className = `path-difficulty path-difficulty-${level.difficulty}`;
    difficulty.textContent = level.difficulty;
    const title = document.createElement('h3');
    title.textContent = level.title;
    titleGroup.append(difficulty, title);
    heading.append(levelNumber, titleGroup);

    const objectives = document.createElement('ul');
    level.objectives.forEach((objective) => {
      const item = document.createElement('li');
      item.textContent = objective;
      objectives.append(item);
    });

    const practice = document.createElement('button');
    practice.type = 'button';
    practice.className = 'btn btn-gold path-practice-button';
    practice.textContent = `PRACTICE ${level.difficulty.toUpperCase()}`;
    practice.setAttribute('aria-label', `Practice ${path.label} ${level.difficulty}: ${level.title}`);
    practice.addEventListener('click', () => startLearningPath(selectedLearningSubject, level.difficulty));
    card.append(heading, objectives, practice);
    levels.append(card);
  });
}

function startLearningPath(subject, difficulty) {
  reviewMode = false;
  activeLearningPath = { subject, difficulty };
  startGame();
}

function startFreePlay() {
  reviewMode = false;
  activeLearningPath = null;
  startGame();
}

function startAnotherRun() {
  if (reviewMode) {
    reviewMode = false;
    activeLearningPath = null;
  }
  startGame();
}

function getAdaptiveSubject() {
  const mastery = subject => {
    const result = scores[subject];
    return (result.c + 1) / (result.c + result.w + 2);
  };
  const lowestMastery = Math.min(...SUBJS.map(mastery));
  const focusSubjects = SUBJS.filter(subject => Math.abs(mastery(subject) - lowestMastery) < 0.000001);
  return rand(focusSubjects);
}

function setLearningMode(mode) {
  if (mode !== 'adaptive' && mode !== 'practice') return;
  practiceMode = mode === 'practice';
  localStorage.setItem('learningMode', mode);
  updateLearningControls();
}

function updateLearningControls() {
  document.body.classList.toggle('practice-mode', isPracticeMode());
  const adaptiveButton = document.getElementById('mode-adaptive');
  const practiceButton = document.getElementById('mode-practice');
  const reviewButton = document.getElementById('review-mistakes-btn');
  const reviewCount = document.getElementById('review-mistakes-count');

  if (adaptiveButton) adaptiveButton.setAttribute('aria-pressed', String(!practiceMode));
  if (practiceButton) practiceButton.setAttribute('aria-pressed', String(practiceMode));
  if (reviewCount) reviewCount.textContent = reviewQueue.length;
  if (reviewButton) {
    reviewButton.disabled = reviewQueue.length === 0;
    reviewButton.setAttribute('aria-label', `Review missed questions, ${reviewQueue.length} available`);
  }
}

function startMistakeReview() {
  if (!reviewQueue.length) {
    flash('No missed questions to review yet.', 'var(--cyan)');
    updateLearningControls();
    return;
  }
  activeLearningPath = null;
  reviewMode = true;
  startGame();
}
