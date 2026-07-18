# LEVEL 18 — Birthday Experience for Yuvraj Singh Kushwah

A cinematic, single-page interactive birthday site. Pure HTML/CSS/JS — no build step, no dependencies to install. Loads Google Fonts and GSAP from a CDN; everything else (starfield, particles, fireworks, ambient music) is generated in-browser.

## Files
- `index.html` — structure/content
- `style.css` — design system (colors, type, layout, animation)
- `script.js` — loader, scroll reveals, stat bars, typewriter, fireworks, procedural music, easter eggs

## Deploy on GitHub Pages (2 minutes)

1. Create a new repository on GitHub (e.g. `level18`).
2. Upload these three files (`index.html`, `style.css`, `script.js`) to the repo root — drag-and-drop works fine on github.com, or:
   ```bash
   git init
   git add index.html style.css script.js README.md
   git commit -m "Level 18 birthday site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
3. In the repo, go to **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`. Save.
5. Wait ~1 minute, then your site is live at:
   `https://<your-username>.github.io/<repo-name>/`

No other setup needed — it's a static site, so it'll run smoothly for anyone who opens the link.

## Notes on a couple of engineering choices
- **Stars/particles use Canvas 2D instead of Three.js.** Same visual effect (subtle moving stars + ambient particles), but without a ~600KB dependency — keeps first load fast and avoids any risk of a slow or failed CDN fetch affecting the experience.
- **Music is generated in the browser** (Web Audio API, soft layered sine-wave pad) rather than an audio file, so there's zero copyright concern and nothing to host — it starts only when the "Enable Music" button is clicked, never automatically.

## Easter eggs
- Type **"legend"** anywhere on the page → "LEGEND MODE ACTIVATED" flash.
- Double-click the big name in the hero section → blue glow pulse.

## Customizing later
- Stat values: edit the `data-value` attributes on `.stat-row` elements in `index.html`.
- Achievements/timeline/quotes text: edit directly in `index.html`, each section is clearly labeled with an HTML comment.
- Colors/fonts: all defined as CSS custom properties at the top of `style.css` (`:root`) — change once, applies everywhere.
