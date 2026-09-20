# Life in the UK — the whole thing

Everything this app is, how it is built, and what is left to do.
Written 20 September 2026, against the code on `main`.

- [1. What it is](#1-what-it-is)
- [2. Running it](#2-running-it)
- [3. The question bank](#3-the-question-bank)
- [4. Translations](#4-translations)
- [5. The path](#5-the-path)
- [6. The look](#6-the-look)
- [7. How it is put together](#7-how-it-is-put-together)
- [8. Accounts](#8-accounts)
- [9. Money](#9-money)
- [10. Tests](#10-tests)
- [11. Shipping it](#11-shipping-it)
- [12. Still yours to do](#12-still-yours-to-do)
- [13. Things that will bite you](#13-things-that-will-bite-you)

---

## 1. What it is

A study app for the UK citizenship test — *Life in the United Kingdom: A Guide
for New Residents*, 3rd edition. It runs as a website and as a native iOS app
from the same source.

| | |
|---|---|
| Questions | **506** — 253 written from the handbook, each with one double |
| Languages | **14**, every question translated in every one |
| Study notes | All five chapters, in all 14 languages |
| Flashcards | 73, for the dates and numbers |
| Mock test | 24 questions, 45 minutes, 18 to pass — the real format |
| Practice path | 8 levels, locked until the one before is passed |
| Backend | None. Everything lives in `localStorage` on the device |

The test itself is in English, so **questions are always shown in English**.
Recognising the English wording is half the skill. Underneath each question,
each option and each explanation, the app shows a reviewed translation in the
reader's language. That is the whole idea: you learn the fact in your language
and meet it in English.

---

## 2. Running it

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
npm run preview  # serve the built dist/
npm test         # 110 tests
```

For iOS:

```sh
npm run build && npx cap sync ios
open ios/App/App.xcodeproj    # then ⌘R
```

`npx cap sync ios` copies `dist/` into `ios/App/App/public/`. That copy is
generated, not source, and is not in git — but the Xcode project **is**
committed, so a clone plus `npm install && npm run build && npx cap sync ios`
gets you a runnable app.

---

## 3. The question bank

### 253 + 253

```js
const QUESTIONS = [...BASE_Q, ...EXTRA_Q, ...VARIANT_Q];   // 506
```

`BASE_Q` and `EXTRA_Q` are the 253 core questions, written from the handbook
and living as array literals inside `src/LifeInTheUK.jsx`. `VARIANT_Q` is 253
**doubles** — one per core question — in `src/questionVariants/`.

By chapter:

| Chapter | | Core questions |
|---|---|---|
| 1 | Values and principles | 16 |
| 2 | What is the UK | 12 |
| 3 | A long and illustrious history | 106 |
| 4 | A modern, thriving society | 59 |
| 5 | The UK government, the law and your role | 60 |

The mock test draws 2 / 2 / 8 / 6 / 6 from those five — `EXAM_MIX` in
`src/quizLogic.js` — which is the real paper's mix.

### Why one double and not four

The bank once carried **four** variants per question: a rephrase, a true/false,
a scenario and an exception. 1,012 variants, a 1,265-question pool, and it made
the app unusable — a 24-question paper could hand you the same fact four times
in four costumes.

Cut back to one double each. The rule for which one survived was not "keep the
rephrase":

- **216 of the 253 rephrases were word-for-word identical to their base
  question.** A double that repeats its base is not a second question, it is
  the same question twice.
- So: keep the rephrase only where it actually differs (37 of them), otherwise
  take the alternate scenario (107) or the exception (109). True/false variants
  were dropped entirely — a two-option question is a coin flip.

`variants.test.js` now enforces both halves of that: every base question has
exactly one double, and no double repeats the question it doubles. It also
checks that no two questions anywhere in the 506 read the same, with one
deliberate exception — `i:153` and `i:178` both open "Which of these statements
is correct?", which is a real handbook format, and they carry different options.

### The shape of a question

```js
{ i: 27, c: 3,
  q: "Why was Hadrian's Wall built?",
  o: ["To keep out tribes such as the Picts from the north",
      "To mark the border with Wales", …],
  a: [0],
  e: "Emperor Hadrian ordered the wall built in AD 122 …" }
```

`i` id, `c` chapter, `q` question, `o` options, `a` indices of correct answers,
`e` the explanation shown after answering. Doubles add `base` (the id they
double) and `variant` (which kind).

### The correct answer is always first — and that is fine

In all 506 source questions the right answer sits at index 0. That is a writing
convention, not a leak: `randomise()` in `LifeInTheUK.jsx` permutes the options
and remaps the answer indices, and it is applied at **every** place a deck is
built — the mock, all eight path levels, the quick quiz, mistakes, saved
questions and chapter practice. Nothing reaches the screen unshuffled.

If you ever add a new deck-building path, it must end in `.map(randomise)`.

### Accuracy

Every one of the 506 was checked against the handbook. Two were wrong and are
fixed:

- **q7** — "Where do citizenship ceremonies usually take place?" had *Arranged
  by the local authority* as the answer: a "who" among three "At …" options. It
  read wrong, and being the only option in a different grammatical shape it was
  guessable without knowing the fact.
- **q138** — offered **"Cornish Norse"** as a distractor. No such language. It
  looks like Cornish and Norse got merged, and since Cornish *is* spoken in the
  UK — this bank says so itself at q210 — the distractor was both nonsense and
  arguably correct. Now "Norse". The nonsense had been faithfully translated
  into every language ("Norvegiana cornică", "Kornijski nordycki", "O nórdico da
  Cornualha"); all 14 were corrected too.

One thing that looks wrong and is not: **the Commonwealth has 54 members**
(q157). It is 56 in reality since 2022, but the handbook says 54, and the test
is marked against the handbook.

---

## 4. Translations

### What ships

All fourteen, all complete, all registered:

| | | | |
|---|---|---|---|
| Hindi | Urdu *(RTL)* | Punjabi | Bengali |
| Arabic *(RTL)* | Romanian | Polish | Portuguese |
| Gujarati | Italian | Tamil | Farsi *(RTL)* |
| Chinese (Simplified) | Tagalog | | |

**14 × 506 = 7,084 translated entries.** Nothing falls back to English.

### The house rules

- UK proper nouns, institutions and official terms stay in English — *Magna
  Carta*, *House of Commons*, *the Ashes*, *MOT*, *PAYE*. They are what you
  will meet on the test paper.
- Dates and numbers stay as digits, in whatever numeral system the language
  actually uses. Bengali writes 300,000 as `৩,০০,০০০` — the Indian lakh
  grouping — and that is correct, not a bug.
- Options stay short. They sit under a one-line English option and have to read
  as a label, not a sentence.
- Translate the meaning, not the words.

### How a bundle is stored

```js
// src/qtrans/it.js
export default {
  27: ["Perché fu costruito il Vallo di Adriano?",
       "Per tenere fuori tribù come i Pitti dal nord|Per segnare il confine…",
       "L'imperatore Adriano ordinò…"],
};
```

Keyed by question id. Options are pipe-separated and **stay in the English
source order** — that ordering is load-bearing, see below.

`LOADERS` in `src/qtrans/index.js` maps each language to a static
`import()`. The specifiers are literal strings on purpose: Vite can only split
a chunk per language if it can see the path at build time. A template literal
there would bundle all fourteen into the main chunk and hand a Tamil speaker
the Polish file too. As it is, each language is its own lazy chunk.

**A language is only added to `LOADERS` once its bundle is finished.** An
unlisted language falls back to English questions, which is the honest outcome —
a half-translated bank looks broken in a way plain English does not.

### The two guards

**`normaliseTranslation()`** in `src/quizLogic.js` is the production guard. It
rejects any entry whose option count does not match the English question, and a
rejected entry leaves the question in plain English. Without it, a short option
list would silently put the wrong translation under the wrong answer — and a
student revising in Hindi has no way to see that happened.

**Option order.** `optSub()` in `LifeInTheUK.jsx` finds an option's position in
the *unshuffled* source question and reads the translation at that same index.
So translations follow options through the shuffle correctly — but it only
works because every bundle keeps the English order.

### What was actually verified

Not assumed — measured, across all 7,084 entries:

| Check | Result |
|---|---|
| Numeric fidelity — years, counts, ages, money survive translation | **0 errors** |
| Option-slot alignment — no option translated into the wrong slot | **0 errors** |
| Questions left untranslated | **0** |
| True/False option order matches English | **70/70** |

The True/False one is the nastiest failure available: a reversed pair scores the
student wrong with no visible symptom anywhere. There is now a test for it, and
it was confirmed to fail on a deliberately reversed pair rather than passing
vacuously.

Roughly 40% of options come back byte-identical to the English. That is by
design — they are proper nouns — and `optSub()` suppresses the subtitle rather
than printing "Cardiff" under "Cardiff".

---

## 5. The path

Eight levels, each locked until the one before it is passed. Difficulty climbs
on four axes at once, so the ladder keeps getting steeper even where the pass
bar dips.

| Level | Questions | To pass | Tiers | Clock | Feedback |
|---|---|---|---|---|---|
| 1 | 8 | 6 | 1 | — | instant |
| 2 | 10 | 8 | 1–2 | — | instant |
| 3 | 12 | 9 | 2 | — | instant |
| 4 | 15 | 12 | 2 | 12 min | at the end |
| 5 | 18 | 14 | 2–3 | 18 min | at the end |
| 6 | 20 | 16 | 3 | 22 min | at the end |
| 7 | 24 | 18 | all | 45 min | at the end |
| 8 | 24 | **21** | 2–3 | 45 min | at the end |

Level 7 is a real mock at the real pass mark. Level 8 is the same length and
clock, drawn from the harder tiers and weighted toward whatever *this* student
keeps getting wrong, at 21 of 24 — deliberately above the real 18, so clearing
it means something. Two students reaching level 8 get two different papers.

Clearing all eight unlocks a "now you can book your test" card linking to
`gov.uk/life-in-the-uk-test`.

### Difficulty is a property of the question

`difficultyOf()` scores structure, not the student, so a level means the same
thing on day thirty as on day one. It reads: choose-two (+2), true/false (−2),
four numeric options (+2), a `NOT` in the stem (+1), a long stem (+1), chapter 3
(+1), chapters 1–2 (−1), plus two shape heuristics —

- **giveaway length**: a correct option much longer than its distractors is the
  oldest tell in multiple choice, and you can often pick it without knowing the
  fact (−1)
- **tight set**: four terse options of near-identical length — *Bannockburn /
  Culloden / Agincourt / Naseby* — where there is nothing to reason from (+1)

Chapter number is deliberately **not** used as a proxy for difficulty. Chapter 5
has "how many MPs are there" and chapter 1 has a choose-two.

Two hand-maintained sets correct what the heuristic cannot see — that "One
third" is a number, that four saints' days are four dates written as words.

Current spread across the 506: **96 / 234 / 176**. Every level can fill its deck
several times over.

---

## 6. The look

The Path screen was always the best-looking screen in the app. It earned that
from three things, and the rest of the app now uses the same three:

- **lip** — a solid offset shadow under a surface, so a card reads as an object
  sitting on the page rather than a rectangle drawn on it
- **press** — that lip collapsing as the surface travels down, so a tap is felt
  and not just registered
- **sheen** — a one-pixel inset highlight along the top edge, which is what
  stops a flat fill looking like paper

Applied to rows, tiles, options, chips, buttons, the language picker, toggles,
flashcards and the unlock sheet. Hero, primary buttons and progress fills are
gradients. The tab bar lifts off the bottom edge into a rounded, blurred bar
with the current tab in a filled pill.

Both palettes were retuned rather than reused: light is a touch warmer so white
cards separate from the ground, dark is deeper so the same lip reads as depth
instead of mud. Tokens live on `.uk` and `.uk[data-dark="1"]`, and the whole
stylesheet is one template literal in `LifeInTheUK.jsx`.

The Path keeps its own colour world — a violet night sky — whatever the app's
light/dark setting is. `.uk:has(.pathwrap)` re-tints the shared header and tab
bar for as long as that screen is up.

### The font stack is not an accident

```css
font-family:'Plus Jakarta Sans','UKGlyphs',sans-serif;
```

**Do not add `system-ui`.** In the iOS WKWebView, `system-ui` claims every
character and then draws `.notdef` for anything outside Latin, and WebKit stops
at the first family that claims a character rather than walking the rest of the
stack. Naming it turned all fourteen non-English languages into tofu boxes in
the app while the web was fine.

The `UKGlyphs` `@font-face` exists for the opposite problem: the UI icons are
bare Unicode glyphs (`⌂ ◆ ☰ ◔ ⚙ ▶ ✓ ☾ ☀ ★ ☆ ›`) that Plus Jakarta Sans does not
carry. It maps to Apple Symbols with a `unicode-range` of exactly those twelve
codepoints, so every script still falls through to `sans-serif` as before.

### RTL

Urdu, Arabic and Farsi. Anything anchored to one side, or pointing one way, is
mirrored by hand under `.uk[dir="rtl"]` — chevrons, the `›` on rows, the toggle
knob, text alignment, and `direction: rtl` on the subtitles.

---

## 7. How it is put together

Vite + React, no router, no state library. Screens are components picked by a
`tab` state value.

```
src/
  LifeInTheUK.jsx      the app: question bank, all 14 UI dictionaries,
                       every screen, and the stylesheet     (~4,200 lines)
  quizLogic.js         difficulty, the eight levels, deck building,
                       normaliseTranslation()               — no React, no DOM
  entitlementLogic.js  what a person may use                — no imports at all
  entitlement.js       that logic wired to StoreKit + React
  storekit.js          bridge to the native plugin
  native.js            iOS-only shims (safe-area insets, status bar)
  firebase.js          auth only — no database
  qtrans/              14 question-bank bundles + index.js + bundles.test.js
  notes/               14 study-note bundles + index.js + bundles.test.js
  questionVariants/    20 chapter files of doubles + index.js + variants.test.js
  auth/                AuthGate, AuthScreen, auth.css
  ads/                 ads.js, AdBanner.jsx
  paywall/             Paywall.jsx
ios/App/
  App/StoreKitPlugin.swift   StoreKit 2, local Capacitor plugin
  LifeInTheUK.storekit       local sandbox product definition
```

`quizLogic.js` and `entitlementLogic.js` are deliberately free of React and
browser APIs so the decisions can be tested with plain `node --test`.

### Two things worth knowing about rendering

The deck hands each card a **shuffled copy** of its question, so anything
needing the original order has to look the source up by id. That happens on
every render of every option, so there is a `QUESTION_BY_ID` map rather than a
506-long scan. Chapter counts are precomputed for the same reason.

`--ad-h` is the measured AdMob banner height, published by `AdBanner.jsx` and
`0px` when no banner is on screen. The page padding, the tab bar and the account
button all read it, so the paid and trial tiers — and the whole web build — lay
out exactly as they did before ads existed.

---

## 8. Accounts

Firebase Auth, email/password and Google, wrapping the app via `main.jsx`.
Project `life-in-the-uk-de626`. There is **no database** — auth only.

There is a guest mode ("Continue without an account") and in-app account
deletion.

Progress — profile, stats, mock history, bookmarks, read chapters, dark mode,
level progress — lives in `localStorage` under the `uk2:` prefix. It is per
device. Signing in does not sync it.

---

## 9. Money

Full console walkthrough is in **`MONETISATION.md`**. The short version:

| | |
|---|---|
| Product | `com.kingofmadnes.lifeintheuk.path.annual` |
| Type | Auto-renewable subscription, 1 year |
| Price | £3.99 |
| Trial | 3 days free, card taken up front |

**Why a subscription and not a one-time purchase:** a free trial in Apple's
world *is* an "introductory offer", and introductory offers only exist on
auto-renewable subscriptions. A one-time purchase that expires after a year is a
*non-renewing subscription*, and that type has no trial option at all. A
card-gated trial and a one-time purchase are mutually exclusive. This was
rebuilt three times before landing there.

**The trial is Apple's, not ours.** There is no trial clock in this codebase —
no Firestore document, no device timestamp, no storage key. StoreKit reports
whether the current entitlement is the introductory period or a real charge.
That is why it is not farmable: reinstalling, signing out, deleting the account
or changing the device date gives nobody a second trial, because none of those
is where the trial lives.

Five states, resolved in `entitlement.js`:

| State | Path | Ads |
|---|---|---|
| `loading` | open | off |
| `web` | open | off |
| `free` | **locked** | **on** |
| `trialing` | open | **on** |
| `paid` | open | off |

Only the path locks. Mock tests, quick quiz, chapter practice, mistakes, saved
questions, notes, flashcards and progress are free forever, with ads in the free
tier. Ads stay on during the trial deliberately — it gives the trial somewhere
to improve to.

`cccvhmd2001@gmail.com` is hard-coded as the owner and always resolves to
`paid`, checked before StoreKit runs. Confirmed as the owner's own address.

Ads are on Google's test units with `LIVE = false`. Banners on home, study,
progress, path and test-day; interstitials on navigation throttled to one per
three minutes; **never on a screen with a question on it**. UMP consent form
first (UK GDPR), then ATT, then `initialize()` — asking for an ad before consent
resolves is what gets an AdMob account limited.

---

## 10. Tests

```sh
npm test      # 110 passing
```

| File | What it actually guards |
|---|---|
| `quizLogic.test.js` | levels lock in order, every level deals a full deck, mocks keep the real chapter mix, level 8 is weighted to the student's mistakes, decks vary between attempts |
| `variants.test.js` | every base question has exactly one double, no double repeats its base, no two questions in the 506 read the same, ids unique and never colliding with core ids, answer indices in range |
| `qtrans/bundles.test.js` | every bundled entry matches the English bank — option counts, no two options translating to the same string, and the **same guard the app applies at render time**; plus True/False order matching English |
| `notes/bundles.test.js` | study notes present and well-formed in all 14 |
| `entitlementLogic.test.js` | who may use what, in every state |

The bank is read out of `LifeInTheUK.jsx` at test time rather than duplicated
into a fixture — a fixture of 253 questions would drift from the real thing
within a week.

---

## 11. Shipping it

### Web

`npm run build` produces a fully static `dist/`. Any static host serves it
as-is. Pushing to `main` deploys it.

### iOS

```sh
npm run build && npx cap sync ios
cd ios/App
xcodebuild -scheme App -configuration Debug \
  -destination 'id=<device-id>' -derivedDataPath /tmp/dd build
xcrun devicectl device install app --device <udid> \
  /tmp/dd/Build/Products/Debug-iphoneos/App.app
xcrun devicectl device process launch --device <udid> com.kingofmadnes.lifeintheuk
```

**The two device ids are different.** `xcodebuild -destination` wants
`00008110-001A5D2E012B801E`; `devicectl` wants
`A1967DF0-CF0B-566E-8A61-A0C58255C22C`. They are different ID spaces and mixing
them gives "Unable to find a device matching the provided destination
specifier".

Capacitor uses **SPM, not CocoaPods**. There is no `Podfile` and there should
not be one.

---

## 12. Still yours to do

Console work I cannot do:

1. **Paid Applications Agreement** — App Store Connect → Business. Sign it, add
   UK banking, complete the W-8BEN. Must read **Active**. Nothing else works
   until it does, and in-app purchases will not load even in sandbox.
2. **Create the subscription** — the product above, then add the 3-day free
   trial as a *separate* step under Subscription Prices → Introductory Offers.
   It is easy to miss and the subscription looks finished without it. Check the
   product ID character by character: `kingofmadnes`, one `s`. It can never be
   changed or reused once created.
3. **AdMob** — account, payments profile (the address PIN arrives by physical
   postcard and takes 2–4 weeks — start it now), app, banner unit, interstitial
   unit. Then the App ID into `Info.plist` and the two unit IDs into
   `src/ads/ads.js` with `LIVE = true`.

All three are stepped out properly in `MONETISATION.md`.

---

## 13. Things that will bite you

**`system-ui` in the font stack** turns all fourteen non-English languages into
tofu boxes in the iOS app while the web looks fine. See §6.

**A new deck path without `.map(randomise)`** ships every question with the
correct answer as option A.

**Reordering options in a bundle** silently puts the wrong translation under the
wrong answer. Bundles keep the English source order; `optSub()` depends on it.

**Registering a language in `LOADERS` before its bundle is finished** shows a
half-translated quiz. Leave it unlisted and it falls back to English, which
looks deliberate.

**The minifier writes `1000` as `1e3`.** Any regex counting question ids in a
built bundle must handle it, or it will read 506 as 505.

**`plutil -lint` rejects `.storekit` files** — it guesses plist from the
extension. They are JSON; validate them as JSON.

**Xcode's StoreKit configuration file only applies when you run from Xcode.**
An app installed by `devicectl` ignores it and talks to the real store.

**`codesign` fails with `errSecInternalComponent`** when it cannot reach the
keychain — which is what happens in a sandboxed shell. It is not a certificate
problem.

**Developer Mode switches itself off** on the iPhone after some reboots.
Settings → Privacy & Security → Developer Mode.

---

## The other files here

| | |
|---|---|
| `README.md` | short intro, for someone landing on the repo cold |
| `MONETISATION.md` | the App Store Connect and AdMob walkthrough, step by step |
| `PATH_AND_TRANSLATIONS.md` | the original design write-up for the path and the translation system |
| `SESSION-NOTES.md` | a build log — what was done, in what order, and why |

This file is the one to read first. The others go deeper on one thing each.
