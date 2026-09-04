# The level path and proper translations

What was asked: upgrade the app with (1) a quiz that gets harder level by
level, tracks the student, and tells them when they're ready to book —
ending in a "now you can book your test" message — and (2) translations
that are actually correct per question. Everything else in the app stays
as it was.

This file records what that turned into: what was already in the repo,
what was wrong with it, what was built instead, and what is still open.

## Starting point

Before this work, a prior session had already committed a first pass at
both features (`git log`: `4824f02 feat: add adaptive quiz and translation
support`, on top of the original `1bf0998` app). It didn't hold up:

- **"Levels" were chapter filters, not difficulty.** `getAdaptiveQuizBlueprint`
  picked level 1 from chapters 1–2, level 2 from chapters 1–3, and so on.
  Chapter number has nothing to do with how hard a question is — chapter 5
  has "How many MPs are there?" (easy) and chapter 1 has a choose-two
  (harder), so the levels didn't actually climb in difficulty.
- **No unlocking, no tracking.** Every "level" was really just a 4-question
  slice shown once inside the existing untimed quick quiz. There was no
  persisted progress, nothing to stop a student jumping straight to the
  hardest slice, and nothing that remembered a level had been cleared.
- **The "book your test" message showed on the very first quiz.** The
  final-level message (`'You are now ready to book your test...'`) was
  attached to `blueprint.at(-1)`, and that blueprint was rendered as a note
  at the top of *every* quick quiz — including a brand-new student's first
  ten questions. That's the opposite of what "ready to book" is supposed to
  mean.
- **Translations went through a public machine-translation API per
  question.** `SUB_ENDPOINT` defaulted to `api.mymemory.translated.net`,
  translating the English question, each option, and the explanation as
  separate strings with no shared context. That's how you get "Magna
  Carta" or "First past the post" turned into nonsense — MyMemory has no
  idea it's translating a UK citizenship exam and treats each string in
  isolation.

Both features were replaced rather than patched.

## 1. The level path — eight levels, each harder than the last

### Difficulty is a property of the question, not the chapter

`difficultyOf(q)` in `src/quizLogic.js` scores every question from
structural signals and tags it tier **1** (foundations), **2** (standard),
or **3** (hard):

| signal | effect | why |
|---|---|---|
| "choose two" | harder | two chances to slip instead of one |
| true/false (2 options) | easier | a coin flip at worst |
| all four options look numeric | harder | four dates/numbers to tell apart |
| "...NOT..." in the stem | harder | negatives trip people up |
| long question stem (>95 chars) | harder | more to hold in mind |
| correct option much longer than the distractors | easier | the oldest MCQ tell — the real answer needs the qualifying clause |
| four options, all short and near-equal length | harder | nothing to reason from, pure recall |
| chapter 3 (History) | +1 | the densest chapter, most raw detail |
| chapters 1–2 (Values, The UK) | −1 | the two short, plain chapters |
| hand-checked exceptions | ± | see below |

A small hand-checked exception list (`HARDER` / `EASIER` sets, by question
id) corrects the handful of cases the heuristic reads wrong — e.g. "One
third" is a number even though it's spelled out, and the four saints'-days
questions are four dates written as words, not digits.

Result, against the real 253-question bank: **68 tier 1 · 101 tier 2 · 84
tier 3** — a workable spread across all three tiers, verified by test.

### The eight levels

| # | name | questions | pass mark | tiers drawn from | clock | feedback |
|---|---|---:|---:|---|---|---|
| 1 | Warm-up | 8 | 6 | 1 | none | after each question |
| 2 | Foundations | 10 | 8 | 1, 2 | none | after each question |
| 3 | Building up | 12 | 9 | 2 | none | after each question |
| 4 | Against the clock | 15 | 12 | 2 | 12 min | at the end |
| 5 | Mixed ground | 18 | 14 | 2, 3 | 18 min | at the end |
| 6 | The hard set | 20 | 16 | 3 | 22 min | at the end |
| 7 | Full mock | 24 | 18 | 1, 2, 3 (real exam chapter mix) | 45 min | at the end |
| 8 | Exam standard | 24 | **21** | 2, 3 (real exam chapter mix), weighted to weak spots | 45 min | at the end |

Difficulty climbs on four axes at once, not just question difficulty:
length (8 → 24 questions), the clock (untimed → 45 minutes), and feedback
style (told immediately → held back like the real test). Level 7 is a
genuine mock at the real pass mark (18/24). **Level 8 asks for 21 out of
24 — three marks above what the actual test requires** — built specifically
from tiers 2–3 and weighted toward whatever that particular student keeps
getting wrong. Clearing it is deliberately harder than passing the real
thing.

A level is locked until the one before it is passed
(`isUnlocked`/`currentLevel` in `quizLogic.js`) — no skipping ahead. Progress
persists per level (`passed`, `best` score, `attempts`, last-played date) in
the same `localStorage` blob the rest of the app already uses.

### Deck selection is weighted, not uniform

`buildLevelDeck()` doesn't pick randomly from a level's tier pool. Each
question gets a weight from `weightFor()`:

- unseen questions are worth showing (weighted up, especially on normal
  levels — a level is also a way to cover new ground);
- a question answered wrong and **not yet answered right twice since**
  (`s < 2`, the same "unresolved mistake" definition the existing
  mistakes-list feature already used) is weighted up further;
- on level 8 specifically, unresolved mistakes are weighted far above
  everything else, which is what makes the final level personal — two
  students reaching it sit two different papers, both drawn from what each
  of them individually struggles with.

Levels 7 and 8 additionally preserve the real test's chapter mix
(2/2/8/6/6 across the five chapters) rather than drawing freely from the
whole tier — a "mock" has to look like the real paper.

### The "ready to book" message

Only appears once, in exactly two places, and only once **every** level —
level 8 included — has been passed (`allCleared()`):

- on the Path screen, replacing the level list with a green "Now you can
  book your test" card and a direct link to `gov.uk/life-in-the-uk-test`;
- on the Home screen, as the headline card, once the whole path is done.

It does not appear after level 7 (a real-standard pass) alone, and it
never appears on a quiz that isn't the actual final level — the bug in the
previous implementation is specifically what this guards against.

### New screens / files

- `src/quizLogic.js` — pure logic: `difficultyOf`, `LEVELS`, `isUnlocked`,
  `currentLevel`, `clearedCount`, `allCleared`, `buildLevelDeck`,
  `getSmartQuizQuestions` (the existing untimed quick quiz, now weighted
  the same way instead of picking 10 fully at random),
  `normaliseTranslation` (shared with the translation feature, see below).
- `Path` component — the level ladder screen, reachable from a new nav tab
  and from a new "Your path to the test" card on Home.
- `LevelQuiz` component — plays one level; branches on `level.instant`
  between the early mark-as-you-go style and the later hold-answers-to-the-
  end style, and (for timed levels) runs the same countdown/auto-submit
  pattern the existing `Exam` component already used.
- `LevelResult` component — pass/fail per level, review wrong answers, and
  the "ready to book" card when applicable.
- New bottom-nav tab (`◆ Path`) between Home and Study.
- `src/quizLogic.test.js` — rewritten; 19 tests covering difficulty tiers,
  the ladder's shape, unlock/current-level logic, `allCleared`, deck
  feasibility for every level (each one can actually fill its deck from
  its declared tier pool — checked against the real 253-question bank, not
  a fixture), the exam-mix constraint on levels 7/8, and that level 8
  actually favours a student's marked weak spots over random selection.

## 2. Translations — bundled per-language, not machine-translated live

Questions still display in English first — the real test is in English —
with a translation underneath, exactly as before. What changed is where
that translation comes from.

- **Before:** a live call per question to a public MT API (or, if
  configured, a custom endpoint), translating the question, each option,
  and the explanation as disconnected strings.
- **Now:** each language ships as a reviewed, static bundle in
  `src/qtrans/<lang>.js` — one JS module per language, `{questionId: [q,
  "opt|opt|opt|opt", explanation]}`, loaded with a dynamic `import()` the
  first time that language is selected. Vite code-splits each language
  into its own chunk (confirmed in the build output, e.g.
  `dist/assets/hi-*.js` separate from the main bundle), so a Hindi speaker
  never downloads the Urdu file and vice versa.

Rules every bundle follows (documented at the top of
`src/qtrans/index.js`):
- UK proper nouns, institutions and official terms stay in English —
  *Magna Carta*, *House of Commons*, *Hadrian's Wall*, *the Ashes*,
  *Hansard*, *PAYE* — the same terms the student needs to recognise on the
  actual English-language test;
- dates and numbers stay as digits;
- options stay short, translated as a label, not a sentence;
- meaning is translated, not words — the whole question, its four
  options, and its explanation are translated together as one unit with
  full context, not as four separate strings.

`normaliseTranslation()` (in `quizLogic.js`, shared with the level logic)
is the safety check at the boundary: if a bundle entry doesn't have
exactly as many options as the English question, or any field is empty,
the entry is rejected and the question simply falls back to English rather
than showing mismatched text under the wrong answer. This runs both at
render time and in a dedicated test suite.

### Status: Hindi is complete, thirteen languages are not yet translated

`src/qtrans/hi.js` — **all 253 questions**, hand-translated with the rules
above, verified against the English bank. The other thirteen languages the
app offers (Urdu, Punjabi, Bengali, Arabic, Romanian, Polish, Italian,
Portuguese, Gujarati, Tamil, Persian, Chinese, Filipino) are **not yet
bundled**. `src/qtrans/index.js` only lists a loader for `hi` on purpose —
a language not listed there falls back to plain English questions (no
subtitle shown, toggle hidden in Settings), which was judged the honest
behaviour: a half-translated bank looks broken in a way that plain English
doesn't. Adding a language is: write `src/qtrans/<code>.js` in the same
shape as `hi.js`, add one line to the `LOADERS` map in `index.js`, and run
the test suite — it will fail loudly and specifically (which ids are
missing, which entries have the wrong option count) until the bundle is
complete.

### New files

- `src/qtrans/index.js` — the bundle registry (`hasBundle`,
  `bundledLanguages`, `loadBundle`).
- `src/qtrans/hi.js` — the complete Hindi question bank.
- `src/qtrans/bundles.test.js` — reads the real question bank straight out
  of `LifeInTheUK.jsx` (so it can't drift from a stale fixture) and checks,
  for every listed language: the bundle loads, every id is a real
  question, every entry has exactly as many options as the English
  version, no two options in one entry are identical, and — for a
  "coverage" test — that literally every question in the bank has an
  entry. Only languages registered in `index.js` are checked, so the
  suite is green with just Hindi bundled; the moment a new language is
  added to `LOADERS` its coverage test fails and names every missing id
  until the bundle is complete.

## What did *not* change

Per the brief ("keep the app how it is"): the existing exam-style mock
test, the untimed quick-quiz entry point, chapter practice, the mistakes
list, flashcards, study notes, progress screen, settings, and dark mode
are all still in place and unmodified in behaviour. The level path and the
translation bundles are additive — a new nav tab and a new Home card for
the first, a swapped-out data source behind the same `useSub()` hook for
the second.

The one deliberate extension to existing behaviour: the ~40 new interface
strings the path introduces (level names, the results screens, the "ready
to book" card, the `◆ Path` nav label) are translated into **all
fourteen** UI languages, matching the existing `T.<lang>` dictionaries, so
the new screen is not an English island for a non-English user. And a
translated question/option/explanation that comes back byte-identical to
the English — a proper noun the house rules keep in English — is no longer
printed a second time underneath the English line.

## Verifying it

```sh
npm test    # node --test "src/**/*.test.js" — 19 quizLogic tests + bundle tests
npm run build
```

`npm test` passes fully (19 quizLogic tests + the Hindi bundle checks);
`npm run build` produces a separate `hi-*.js` chunk alongside the main
bundle, confirming the per-language code-splitting works as intended.

The path was also driven end to end in a headless browser: all eight
levels, locking, `localStorage` persistence across a reload, the timed
levels' countdown and hand-in dialog, and — checked explicitly — that the
"ready to book" card appears after level 8 and **not** after level 7. The
Path screen was rendered in every one of the fourteen UI languages with no
untranslated key and no unfilled `{n}` placeholder.

## Open work

1. Translate the remaining 13 **question** bundles (Urdu, Punjabi,
   Bengali, Arabic, Romanian, Polish, Italian, Portuguese, Gujarati,
   Tamil, Persian, Chinese, Filipino) into `src/qtrans/<code>.js` and
   register each in `src/qtrans/index.js`. Until then those languages show
   English questions with a translated interface around them. The 253
   per-question translations per language are a reviewed-content job, not
   a code one, and were left out rather than shipped machine-translated.
