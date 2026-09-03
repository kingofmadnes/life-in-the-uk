# Life in the UK — Study & Mock Test

A standalone React app for the UK citizenship test: a question bank across the five handbook
chapters, chapter notes, flashcards, timed 24-question mock tests, and progress tracking.

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
npm run preview  # serve the built dist/
```

Everything the app remembers — profile, stats, mock history, bookmarks, read chapters, dark mode —
lives in `localStorage` on the device. There is no backend and no account.

## Question translations (off by default)

Questions are shown in English, since the real test is in English. The app can show a translation
underneath each one, but that needs a model call, and **a browser cannot call the Anthropic API
directly** — there is no key to send and CORS blocks the request. So the app posts to an endpoint of
your own that attaches `x-api-key` and `anthropic-version` server-side and forwards the body on to
`https://api.anthropic.com/v1/messages`.

Point it at that proxy to switch the feature on:

```sh
# .env.local
VITE_UK_TRANSLATE_URL=https://your-proxy.example.com/translate
```

Unset — the default — the feature is entirely off: no request is made and the toggle is hidden in
Settings. Translations that do come back are cached in `localStorage` per question and language, so
each one is fetched at most once per device.

## Deploying

`npm run build` produces a fully static `dist/` — any static host serves it as-is. Nothing here is
shared with the MOdelivr driver app; this project has its own dependencies, build, and output.
