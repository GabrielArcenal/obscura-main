# CodeQuest project structure

```text
.
├── index.html
├── README.md
├── .vscode/
├── assets/
│   ├── css/
│   │   └── game.css
│   ├── images/
│   │   └── enemies/        Enemy GIF artwork
│   └── js/
│       ├── app.js          Active application and game logic
│       └── question_bank.js
├── archive/
│   └── legacy-js/          Older scripts, indexed in its README
├── docs/
│   └── screenshots/
├── tools/
│   └── remove_gif_bg.py    Optional GIF background utility
└── .gitignore
```

`index.html` references the active stylesheet and scripts from `assets/`. Only `assets/js/question_bank.js` and `assets/js/app.js` are loaded by the prototype.

The previous game scripts are kept under `archive/legacy-js/` so they do not get mixed with active code. Their filenames describe their responsibilities; see the [legacy script index](../archive/legacy-js/README.md). They are not used by the current app. Enemy GIFs are preserved under `assets/images/enemies/`; the current prototype uses emoji for its in-game enemy art.

`tools/remove_gif_bg.py` is an optional utility for producing transparent-background GIFs. Its paths are based on the project folder, so it can be run from any working directory. See the root [README](../README.md) for setup and run instructions.

The old empty `bugs.txt` was removed because it contained no notes to retain. The UI reference image is saved as [ui-reference.png](./screenshots/ui-reference.png).
