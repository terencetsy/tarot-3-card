# Three-Card Tarot

A three-card tarot reading web app — **Past · Present · Future** — using the
classic Rider-Waite deck (1909, public domain artwork).

Tap the deck to shuffle and draw three cards. Each card can land upright or
reversed, and tapping a drawn card opens its full meaning. A reading summary
is written underneath, with a button to copy it as text.

## How it works

- Pure static site — no framework, no backend, no tracking.
- `index.html` — the page. `styles.css` — the look. `app.js` — shuffle, draw,
  flip animation, reading text. `cards.js` — all 78 cards with upright and
  reversed keywords and meanings.
- `cards/` — the 79 images: the full 78-card deck plus the card back.

## Run locally

Any static server works, e.g. `python3 -m http.server` from this folder,
then open http://localhost:8000.

## Deploy

Static hosting only — the repo is deployed as-is on Vercel.
