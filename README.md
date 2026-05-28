# Single-File HTML Production Build Kit

Turns a single-file HTML React app that relies on CDNs (Tailwind CDN, unpkg
React, in-browser Babel) into ONE fully self-contained `.html` for production:

- Tailwind compiled ahead of time and inlined (only the classes you use)
- JSX precompiled to plain JS (no in-browser Babel)
- React / ReactDOM inlined (no unpkg)

Result: faster load, works offline, and NO console warnings.

## Files

- `rebuild.sh`        - the build command you run
- `serve.sh`          - starts a local web server for testing
- `inline_tw.py`      - helper (Tailwind inlining); don't run directly
- `precompile_jsx.py` - helper (JSX + React inlining); don't run directly
- `README.md`         - this file

## One-time setup

1. Put `rebuild.sh`, `serve.sh`, `inline_tw.py`, `precompile_jsx.py` in the
   SAME folder as your HTML file.
2. Open Git Bash in that folder.
3. Make the scripts runnable once:

       chmod +x rebuild.sh serve.sh

Requirements: Node.js (you have it) and Python 3. The first `rebuild.sh` run
downloads the build tools into a local `node_modules/` folder (one time); after
that everything works offline.

## ====> THE ONE IMPORTANT RULE <====

The FIRST time you run `rebuild.sh`, it pulls the JSX out of your HTML's
`<script type="text/babel">` block and saves it to a sibling file:

       index.app.jsx      (for index.html)

From that point on, the HTML no longer contains JSX - it contains compiled JS.
So **edit your app code in `index.app.jsx`, NOT inside the HTML.**
Every rebuild reads from the `.jsx`, recompiles, and refreshes the HTML.

(If you need to change the HTML shell itself - the <head>, fonts, the custom
<style> block, the <div id="root"> - edit the HTML directly. Just keep your
React/app logic in the .jsx.)

## Everyday workflow

1. Edit `index.app.jsx` (your app code).
2. Build:

       ./rebuild.sh index.html       # or just ./rebuild.sh if named index.html

3. Test locally over http (NOT by double-clicking the file):

       ./serve.sh                    # then open http://localhost:8000/index.html

4. Ship `index.html` to GitHub Pages as usual.

`rebuild.sh` is safe to run any number of times - it replaces its own previous
output between marker comments, never duplicating anything.

## Why serve.sh instead of double-clicking?

Opening a file as `file:///C:/...` makes the browser treat it as a unique,
isolated origin. That blocks service workers, the Anthropic API fetch, and
other features - you'll see warnings like:

    'file:' URLs are treated as unique security origins.

Serving over `http://localhost` gives the page a real origin, so everything
works. On GitHub Pages it's already `https://`, so this only matters for local
testing.

## Marker comments (don't hand-edit between them)

The build writes generated content between these markers in the HTML:

    <!-- TW:START --> ... <!-- TW:END -->   (compiled Tailwind CSS)
    <!-- RC:START --> ... <!-- RC:END -->   (React + ReactDOM runtime)
    <!-- PC:START --> ... <!-- PC:END -->   (your compiled app script)

Anything between them is overwritten on every rebuild.

## Troubleshooting

- "HTML has no Babel block AND no .app.jsx exists": you ran rebuild on an
  already-built HTML but deleted the .jsx. Recover the .jsx from a backup /
  git, or start again from your original CDN-based HTML.

- "Python not found": install from https://www.python.org/ and tick
  "Add Python to PATH" during setup.

- "caniuse-lite is outdated" / "Browserslist": harmless build chatter, ignore.

## Build artifacts you can git-ignore

    node_modules/
    package.json
    package-lock.json
    tailwind.config.js
    input.css

Only your `.html` (and the `.app.jsx` you edit) matter as source/deliverable.
