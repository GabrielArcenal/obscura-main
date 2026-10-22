# Archived legacy scripts

These scripts are from the earlier game implementation. They are kept for reference and are **not loaded by the current CodeQuest app**. The active prototype uses `assets/js/app.js` and `assets/js/question_bank.js`.

| File | Contents |
| --- | --- |
| `action-rate-limit.js` | Local-storage rate limiting for actions. |
| `battle-system.js` | Battle setup, enemy turns, damage, encounters, and XP. |
| `browser-protection.js` | Client-side inspection and extension deterrent checks. |
| `game-data.js` | Legacy game constants, enemy definitions, skills, and question data. |
| `game-utilities.js` | Shared helpers, practice-mode checks, and missed-question tracking. |
| `learning-paths.js` | Subject learning paths, difficulty objectives, and learning-mode controls. |
| `level-progression.js` | Level-up prompts, reward selection, stat upgrades, and run endings. |
| `onboarding-tutorial.js` | Tutorial slides and first-run tutorial flow. |
| `player-hud.js` | Health, mana, level, enemy, and status display updates. |
| `player-login-menu.js` | Player setup, main-menu navigation, and feedback modal handling. |
| `player-progress.js` | Loading and saving player progress, learning scores, and review state. |
| `question-flow.js` | Selecting questions, rendering answers, hints, and answer feedback. |
| `question-timer.js` | Timed-question countdown and timeout handling. |

The filenames clarify the main responsibility of each script; some legacy files also contain related supporting functions. References between these files are historical and do not indicate that the current app depends on them.
