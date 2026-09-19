# Life in the UK — Session Notes

A record of what was built, why, and what's left. Written 19 September 2026.

---

## 1. Monetisation — rebuilt three times to land on something Apple allows

**What you wanted:** a 3-day free trial that requires a payment method upfront. If the
user doesn't cancel, they get charged and receive full access with no ads. During the
trial, only the path unlocks — ads still show.

**The constraint I hit:** Apple only permits card-gated trials on *auto-renewable
subscriptions*. A one-time purchase cannot have a trial that auto-charges. So this
shipped as:

| Thing | Value |
|---|---|
| Product ID | `com.kingofmadnes.lifeintheuk.path.annual` |
| Type | Auto-renewable subscription, 1 year |
| Price | £3.99 |
| Intro offer | 3-day free trial |

### Files

- **`src/entitlement.js`** — single source of truth. Resolves to
  `loading | web | free | trialing | paid`.
- **`src/entitlementLogic.js`** — pure logic, no imports, fully unit-tested:
  ```js
  export function stateFor(owned, trialing) {
    if (!owned) return "free";
    return trialing ? "trialing" : "paid";
  }
  export function pathOpenFor(state) { return state !== "free"; }
  export function adsOnFor(state)    { return state === "free" || state === "trialing"; }
  ```
- **`src/storekit.js`** — `status()` returns `{owned, trialing}`, `manage()` opens
  Apple's subscription sheet.
- **`ios/App/App/StoreKitPlugin.swift`** — local Capacitor plugin, StoreKit 2. No
  third-party SDK, no receipt server — Apple does the cryptographic verification.

### Owner account

`cccvhmd2001@gmail.com` is hard-coded as the owner and always resolves to `paid`:

```js
const OWNER_EMAIL = "cccvhmd2001@gmail.com";
```

`onAuthStateChanged` is wired up, so signing into that account unlocks immediately.
Your study progress on that account is preserved across all future changes.

**A caveat I raised and you accepted:** an email allowlist can be shared. Anyone with
those credentials gets free access. It's fine for a single owner account; it would not
be fine as a general access-control mechanism.

### Where the paywall appears

Free path map + free Level 1. The trial paywall appears when reaching for **Level 2** —
after the user has actually used the path and passed a level. This was your call and
it's the right one: people pay more readily once they've felt the product work.

```js
const FREE_LEVEL = 1;
const startLevel = (n) => {
  if (!isUnlocked(n, levelProgress)) return;
  if (n > FREE_LEVEL && !ent.pathOpen) { setPending({ level: n }); return; }
  openLevel(n);
};
```

### Two bugs worth remembering

**1. Variable shadowing froze the entire entitlement layer.**
`const [pathTrialStart, setPathTrialStart] = useState(null)` shadowed a module-level
`async function pathTrialStart(uid)`. So `await pathTrialStart(user.uid)` called
`null(...)`, the resolver rejected, `settle()` never ran, and state stayed `"loading"`
forever — which shows no ads, gates nothing, and hides the buy button. It looked
*exactly* like the feature had never been built. Fixed by renaming the state to
`trialStartMs`, with a comment explaining why the name matters.

**2. A StoreKit call could hang forever.**
`try/catch` catches errors but not a promise that never settles. Fixed with a 4-second
race that reads silence as "not owned":

```js
function withTimeout(promise, ms, fallback) {
  let timer;
  const clock = new Promise((res) => { timer = setTimeout(() => res(fallback), ms); });
  return Promise.race([promise, clock]).finally(() => clearTimeout(timer));
}
```

---

## 2. Study notes — all 14 languages

Every chapter of the study notes (Values, UK Geography, History, Culture, Government)
translated into: Hindi, Urdu, Punjabi, Bengali, Arabic, Romanian, Polish, Italian,
Portuguese, Gujarati, Tamil, Farsi, Chinese, Tagalog.

Lives in `src/notes/`, one file per language, lazy-loaded with Vite code-splitting.

---

## 3. Question doubles — 253, cut back from 1,012

**Built first, then cut.** The original plan gave every base question four variants —
a rephrase, a true/false, a scenario framing and a "which is NOT" framing. That
landed as 253 × 4 = 1,012 variants and a 1,265-question pool, and it was too much:
slow to work through, repetitive to sit, and heavy in the bundle.

So each question now keeps **exactly one** double — a second question on the same
fact, worded differently. **253 + 253 = 506.**

```js
const QUESTIONS = [...BASE_Q, ...EXTRA_Q, ...VARIANT_Q];  // 506 total
```

### Which double each question kept

Not decided by variant type, and this matters. **216 of the 253 "rephrase" variants
repeated their base question word for word** — same text, same options. Keeping the
rephrase everywhere would have shipped 216 literal duplicates and quietly wasted
almost half the bank.

So the rule was quality, per question:

| Framing kept | Count | Why |
|---|---|---|
| `rephrase` | 37 | the ones that genuinely reworded |
| `exception` | 109 | "which of these is NOT…" |
| `scenario` | 107 | the fact applied, not recalled |
| `truefalse` | 0 | dropped — two options is a 50/50 guess, and the core bank already carries true/false questions of its own |

Prefer the rephrase where it was actually different; otherwise alternate scenario and
exception so neither framing dominates. Result: **no double repeats its base, no
double has fewer than three options, 505 of 506 question texts unique** — the one
repeat is a pre-existing pair in the original bank (i:153 and i:178 both open "Which
of these statements is correct?" with different options).

`variants.test.js` now asserts all of that: exactly one double per base question, and
a hard failure if any double ever repeats the question it doubles. That trap had been
sitting in the bank unnoticed; it cannot come back silently.

Lives in `src/questionVariants/`, still 20 files (chapter1, chapter2, chapter3a–3h,
chapter4a–4e, chapter5a–5e) plus an aggregator — the split is kept because the chapter
files line up with the qtrans bundles and the study notes.

**`quizLogic.js` needed zero changes**, before or after the cut. Difficulty tiers came
out at 96 / 234 / 176 and the longest level deals only 24, so level building needed no
rebalancing either.

Three construction errors were caught before shipping by verifying each chapter against
a structural test *before* registering it: placeholder text in i:1187 (Bannockburn), a
malformed 4th option in i:1555 (Union Flag), and an over-strict validator regex
rejecting "Which of these WAS under Roman rule".

## 4. Subtitle translations — the current work

**The discovery that saved a lot of work:** the subtitle rendering already existed. In
`Q()` (~line 2492 of `LifeInTheUK.jsx`):

```jsx
<p className="qtext">{q.q}</p>
{subQ && <p className="qsub">{subQ}</p>}
```

With `.osub` on options, `.wsub` on explanations, and RTL handling in CSS. `useSub(q)`
does a plain `bundle[q.i]` lookup — so **variants work with zero code changes**. The
job was purely translation data.

### Progress

| Language | Core | Doubles | Total | Status |
|---|---|---|---|---|
| Hindi | 253 | 253 | 506 | ✅ **Complete** |
| Urdu | 253 | 253 | 506 | ✅ **Complete** |
| Punjabi | 253 | 147 | 400 | 🔄 79% |
| Bengali | 253 | 0 | 253 | 50% |
| Arabic | 253 | 0 | 253 | 50% |
| Romanian | 253 | 0 | 253 | 50% |
| Polish | 253 | 0 | 253 | 50% |
| Portuguese | 253 | 0 | 253 | 50% |
| Gujarati | 253 | 0 | 253 | 50% |
| Italian, Tamil, Farsi, Chinese, Tagalog | 0 | 0 | 0 | Notes only |

**The cut paid for itself here.** Every surviving question kept the translation it
already had; only entries orphaned by a deleted question were removed. Against the
smaller bank the same work goes much further — Hindi and Urdu went from 1,265/1,265
to **100% of 506**, Punjabi from 66% to **79%**, and the six core-only languages from
20% to **50%** — without a single new translation written.

### How each batch is verified

Every batch runs the **exact production guard** before being committed — not a
lookalike:

```js
if (!normaliseTranslation({ q: entry[0], o: options, e: entry[2] }, base, lang)) {
  // rejected
}
```

Plus: option count matches the English, no two options collapse to the same string,
nothing empty. Then `npm test` and a clean build. Then commit.

**Why this matters:** a translation whose option list is short or reordered puts the
wrong translation under the wrong answer. A student revising in Punjabi has no way to
notice. So the shape is asserted, never trusted.

### The "never ship partial" rule

A language is only registered in `LOADERS` once its bank is complete. An incomplete
language falls back to English rather than showing a half-translated quiz.

---

## 5. Still on your plate (I can't do these)

1. **App Store Connect** — create the auto-renewable subscription:
   `com.kingofmadnes.lifeintheuk.path.annual`, 1 year, £3.99, 3-day free-trial
   introductory offer, new subscription group.
2. **AdMob** — create the account, an app, a banner unit and an interstitial unit.
   The code currently uses Google's official test IDs with `LIVE = false`; real IDs
   swap in at the end.
3. **App Review surface** — this submission carries IAP, ads, ATT, consent and a
   privacy-label change all at once. A first submission carrying all of it is more
   likely to bounce than a clean build would be. Worth expecting a round-trip.

---

## 6. Build state

- Question pool: **506** (253 core + 253 doubles).
- iOS Xcode project committed (`ios/`), SPM not CocoaPods, builds and runs on device.
- `npm test` — 86/86 passing.
- `npm run build` — clean. `npx cap sync ios` run, so `ios/App/App/public` carries the
  506-question bundle.
- Verified in a real browser, not just in tests: guest mode past the Firebase gate,
  into the path, through a complete 15-question level in Hindi — 15/15 distinct
  questions, 15/15 with Hindi subtitles, every option 4-way, zero console errors.
- All work committed to `main`.

A note for whoever reads this next: `optSub()` in `LifeInTheUK.jsx` deliberately
returns null when a translated option is identical to the English, so proper nouns
("Cornwall", "Sir Christopher Wren") do not print twice. An option with no subtitle
under it is working as designed, not a missing translation.
