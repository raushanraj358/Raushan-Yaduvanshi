# Raushan Raj — Portfolio

Personal portfolio of Raushan Raj (Yaduvanshi Raushan), Senior Software Engineer at UKG.

- Plain HTML, CSS and vanilla JS: no build step, no frameworks
- Responsive from small phones to wide desktops, with an app-style bottom tab bar on mobile
- Light / dark theme (follows the system, with a manual toggle)
- Installable as an app (web manifest + offline-capable service worker)

## Structure

```
index.html            page markup
css/style.css         all styles
js/main.js            theme toggle, typing effect, scroll reveal, active-section nav
manifest.webmanifest  app install metadata
sw.js                 service worker (network-first, offline fallback)
images/               profile photo and app icons
resume.pdf            downloadable CV
```

## Run locally

```
python3 -m http.server 8000
```

Then open http://localhost:8000. The service worker only runs over http(s), not `file://`.

When you change assets, bump `VERSION` in `sw.js` so returning visitors drop the old cache.
