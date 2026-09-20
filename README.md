# Life in the UK — Study & Mock Test

A standalone React app for the UK citizenship test: a question bank across the five handbook
chapters, chapter notes, flashcards, timed 24-question mock tests, an eight-level practice path,
and progress tracking.

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
npm run preview  # serve the built dist/
npm test         # node --test — quiz logic + translation bundle checks
```

Everything the app remembers — profile, stats, mock history, bookmarks, read chapters, dark mode,
and level progress — lives in `localStorage` on the device. There is no backend and no account.

## The path

`Path` is an eight-level ladder that climbs from short untimed sets to full 45-minute mocks. Each
level is locked until the one before it is passed; the last level asks for 21 out of 24 (three
marks above the real test) and is weighted toward the questions that particular student keeps
getting wrong. Clearing all eight unlocks a "Now you can book your test" card linking to
`gov.uk/life-in-the-uk-test`. Difficulty tiers and the ladder live in `src/quizLogic.js`.

## Question translations

Questions are always shown in English, since the real test is in English and recognising the
English wording is half the skill. Underneath each question the app can show a reviewed
translation in the chosen language.

Those translations ship *with the app* — one file per language in `src/qtrans/<lang>.js`, loaded
with a dynamic `import()` the first time that language is selected, so a student downloads only
their own language. They work offline and cost nothing to show. UK proper nouns and official
terms (Magna Carta, House of Commons, the Ashes) stay in English on purpose; dates and numbers
stay as digits. `normaliseTranslation()` in `src/quizLogic.js` rejects any entry whose option
count doesn't match the English question, so a bad bundle falls back to plain English rather than
putting the wrong text under the wrong answer.

**All fourteen languages are complete — 506 of 506 questions each** (the 253 core questions and
their 253 doubles): Hindi, Urdu, Punjabi, Bengali, Arabic, Romanian, Polish, Portuguese,
Gujarati, Italian, Tamil, Farsi, Chinese and Tagalog. Every one is registered in the `LOADERS`
map in `src/qtrans/index.js`, so no language falls back to English questions.

To add another: write `src/qtrans/<code>.js` in the same shape as `hi.js`, add one line to
`LOADERS`, and run `npm test` — the bundle test fails loudly and names every missing or
malformed entry until the file is complete. A language is only added to `LOADERS` once its
bundle is finished, because a half-translated bank looks broken in a way plain English does not.

The interface itself (menus, buttons, the path, results) is fully translated into all fourteen
languages in `src/LifeInTheUK.jsx`.

## Deploying

`npm run build` produces a fully static `dist/` — any static host serves it as-is.
