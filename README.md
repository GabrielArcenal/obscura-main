# CodeQuest

CodeQuest is a local-first educational game prototype for practicing HTML, CSS, JavaScript, and C# concepts. It is designed as a small capstone foundation: the question bank, adaptive rule, attempt history, game flow, and local data controls are separated enough to explain and evaluate.

## Run the prototype

Open `index.html` in a modern browser, or serve the project folder with VS Code Live Server. The game does not require a server, database, account, or network connection.

## Project layout

```text
.
├── index.html                 Application entry point
├── assets/
│   ├── css/game.css           Interface styles
│   ├── js/                    Active app and question bank
│   └── images/enemies/        Enemy artwork
├── archive/legacy-js/         Previous game scripts, kept for reference
├── docs/                      Project notes and screenshots
├── tools/                     Optional image-processing utility
└── README.md
```

The current prototype loads only `assets/js/question_bank.js` and `assets/js/app.js`. The archived scripts are not part of the current app; see [the archive index](./archive/legacy-js/README.md) for what each older script contains.

## Learning and game flow

- **Adapative Learning** selects the learning topic with the highest priority, chooses a question difficulty from recent performance, and uses a 25-second timer and health mechanic.
- **Relaxed practice** uses adaptive topic selection without a timer or health loss.
- **Topic practice** lets a learner focus on one learning objective, with each question in that topic asked once per session.
- **Mistake review** offers questions whose latest recorded attempt was incorrect, with each question appearing at most once per review session. A correct review answer removes that question from the review queue; missed questions remain available for a later session.
- Students can choose **Adaptive**, **Easy**, **Medium**, **Hard**, or **Impossible** from the Current difficulty card. The setting is saved in browser storage. Adaptive retains the existing recommendation rule; a fixed level serves only questions at that level.
- A normal game session lasts up to 10 answered questions. Topic practice uses available questions at the selected level once each. Each answer is saved immediately in browser storage.
- Questions do not repeat within a session. Adaptive sessions prefer the learner's recommended difficulty; fixed-level sessions stay at the selected difficulty and finish if no matching unused questions remain. Mistake review still shows the original missed questions regardless of this preference.
- Answer choices are shuffled each time a question appears, while saved attempt history continues to record the choice's original question-bank index.
- Each question accepts one answer only. After feedback, Continue stays disabled for three seconds; repeated clicks or answer events cannot record another response or skip the cooldown.
- Correct and incorrect answers play distinct short tones. Sounds can be turned off in **Data & settings**; they are generated locally by the browser and no audio files are downloaded.
- The dashboard has persistent Overview, Topics, and Review navigation, plus subject filters for the topic list.
- The question session uses a compact viewport layout: answer choices form a two-column grid on wide and most mobile screens, with session details collapsed on small screens. Very short viewports retain scrolling so answers and controls remain reachable.

The topic priority is deterministic except for ties:

```text
estimate = (correct answers + 1) / (attempts + 2)
priority = 0.65 * (1 - estimate)
         + 0.35 / sqrt(attempts + 1)
         + 0.08 when the topic has not been reviewed for at least 24 hours
```

This smoothed estimate avoids treating a single answer as certain mastery. Unseen topics receive an exploration bonus. Adaptive difficulty uses the topic's four latest attempts: fewer than two attempts starts at easy; recent accuracy at or below 50% stays easy; at least three attempts with accuracy of at least 80% moves to hard; other cases use medium. Impossible is available as a student-selected challenge and is not automatically assigned. The sidebar explains the selection reason.

## Question bank

Questions live in `assets/js/question_bank.js`. The bank has 12 topics with 10 questions each (120 total): three each at easy, medium, and hard, plus one Impossible challenge per topic. Impossible questions require applying multiple concepts or reasoning through code and edge cases; the label describes this prototype's highest challenge tier, not a claim of universal difficulty. Each topic has an `id`, subject, title, description, and questions for all four levels. Each question has a stable `id`, `difficulty`, `prompt`, four `choices`, zero-based `answer`, and explanatory `explanation`. Keep IDs stable after collecting attempt data: saved attempts refer to question and topic IDs.

The optional GIF background utility is in `tools/remove_gif_bg.py`. It requires Pillow (`python -m pip install Pillow`) and reads from `assets/images/enemies/`. Its input and output folders are resolved from the project root, so you can invoke the script from any working directory by passing its full path.

## Local data and privacy

The app stores one profile, session records, and answer attempts in the browser's `localStorage` under `codequest.capstone.v1`. It does not encrypt browser storage, sync data, or identify a real student. It retains up to 10,000 attempts and 500 sessions, removing the oldest records at those limits. A user can export/import a JSON backup or reset this app's data from **Data & settings**. Browser storage can be cleared by the user or browser, so export backups regularly.

The app has no remote database, account system, or leaderboard. Learning data stays in this browser unless the user exports a backup.

## Project documentation

See [docs/PROJECT-STRUCTURE.md](./docs/PROJECT-STRUCTURE.md) for a folder-by-folder guide and the purpose of archived scripts.

## Capstone evaluation notes

The selection logic is explainable and suitable for a baseline prototype, but it is not a validated mastery model. Before drawing conclusions, review questions with a subject-matter expert and pilot them with learners. A study can compare adaptive practice against a fixed practice sequence using a pre-test/post-test, completion rates, and usability feedback. Report the question bank and selection rules so the method can be reproduced.
