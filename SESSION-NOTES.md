# Life in the UK — Session Notes

A record of what was built, why, and what's left. Written 19 September 2026;
monetisation, App Review and build state refreshed 23 November 2026. For the
resubmission checklist see `HANDOVER.md`; for the console walkthrough see
`MONETISATION.md`.

---

## 1. Monetisation — a one-time unlock

**Where it started:** a 3-day free trial with a card up front, which on Apple only
exists on an auto-renewable subscription. That shipped first as a yearly
subscription (`com.kingofmadnes.lifeintheuk.path.annual`).

**Where it landed:** App Store feedback moved it to a single non-consumable
around 16 October 2026, with no trial. A later rejection flagged leftover
"references to subscriptions", so every mention of subscriptions, trials and
renewal is now gone from the app, its 15 languages and the public pages.

| Thing | Value |
|---|---|
| Product ID | `com.kingofmadnes.lifeintheuk.unlock` (exists in App Store Connect, permanent) |
| Type | Non-Consumable — bought once, kept for good |
| Price | £3.99 |
| Unlocks | All eight path levels, and removes ads |

### Files

- **`src/entitlement.js`** — single source of truth. Resolves to
  `loading | web | free | paid`, re-checked on launch and whenever the app
  returns to the foreground, so the unlock survives relaunches and reinstalls.
- **`src/entitlementLogic.js`** — pure logic, unit-tested: owned means `paid`;
  only `free` has the path locked and ads on.
- **`src/storekit.js`** — `status()`, `product()`, `purchase()`, `restore()`. Every
  call resolves rather than throws, and store calls are capped at 4 seconds.
- **`ios/App/App/StoreKitPlugin.swift`** — local Capacitor plugin, StoreKit 2. No
  third-party SDK, no receipt server — Apple does the cryptographic verification.
- **`src/paywall/Paywall.jsx`** — shows the App Store's localised price once the
  product loads, or "Price unavailable, please try again later." with a retry.

### Two native gotchas, both fixed

- **Capacitor does not find local Swift plugins by itself.** `StoreKitViewController`
  (bottom of `StoreKitPlugin.swift`) registers the plugin, and `SceneDelegate.swift`
  must create that controller, because it builds the root view controller in code
  and ignores the storyboard. Symptom if broken: "StoreKit plugin is not
  implemented on ios" and no price on the paywall.
- **Local purchase testing** uses `ios/App/LifeInTheUK.storekit`, referenced from
  the scheme as `../../LifeInTheUK.storekit`, and only when the app is run from
  Xcode.

### Owner account

`cccvhmd2001@gmail.com` is hard-coded as the owner and always resolves to `paid`,
checked before StoreKit runs. An email allowlist can be shared; fine for one owner
account, not as general access control.

### Where the paywall appears

Free path map + free Level 1. The paywall appears when reaching for **Level 2**,
after the user has passed a level, and from Settings → Unlock the path.

### Ads and tracking

AdMob is live (`LIVE = true`, real app ID and banner/interstitial units). On
launch, straight after the splash and before the login screen, the app runs the
UMP consent check and then the App Tracking Transparency prompt; the Google
Mobile Ads SDK only starts afterwards, and only for the free tier. The prompt
waits for the app to be in the foreground and retries once if iOS drops it —
App Review could not find it on iPad when it sat behind sign-in.

### Two older bugs worth remembering

- **Variable shadowing froze the entitlement layer:** a `useState` name shadowed a
  module-level function, so the resolver rejected and state stayed `"loading"`
  forever — which looked exactly like the feature had never been built.
- **A StoreKit call could hang forever:** `try/catch` does not catch a promise that
  never settles, hence the 4-second race that reads silence as "not owned".

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

### Progress — finished

| Language | Core | Doubles | Total | Status |
|---|---|---|---|---|
| Hindi | 253 | 253 | 506 | ✅ **Complete** |
| Urdu | 253 | 253 | 506 | ✅ **Complete** |
| Punjabi | 253 | 253 | 506 | ✅ **Complete** |
| Bengali | 253 | 253 | 506 | ✅ **Complete** |
| Arabic | 253 | 253 | 506 | ✅ **Complete** |
| Romanian | 253 | 253 | 506 | ✅ **Complete** |
| Polish | 253 | 253 | 506 | ✅ **Complete** |
| Portuguese | 253 | 253 | 506 | ✅ **Complete** |
| Gujarati | 253 | 253 | 506 | ✅ **Complete** |
| Italian | 253 | 253 | 506 | ✅ **Complete** |
| Tamil | 253 | 253 | 506 | ✅ **Complete** |
| Farsi | 253 | 253 | 506 | ✅ **Complete** |
| Chinese | 253 | 253 | 506 | ✅ **Complete** |
| Tagalog | 253 | 253 | 506 | ✅ **Complete** |

**All 14 languages are at 506/506** and all 14 are registered in `LOADERS`. Every
language the app offers a UI for now also ships a translated question bank, so no
language falls back to English questions any more.

**The cut paid for itself here.** Every surviving question kept the translation it
already had; only entries orphaned by a deleted question were removed. Against the
smaller bank the same work went much further — Hindi and Urdu went from 1,265/1,265
to **100% of 506** at a stroke, Punjabi from 66% to **79%**, and the six core-only
languages from 20% to **50%**, before a single new translation was written. The
remaining gap was then closed language by language.

Verification per language: the production guard on every entry (below), `npm test`
green, and the built `.app` bundle counted — not just the source — before each commit.

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

See `HANDOVER.md` for the full checklist. In short: paste Apple's exact rejection
text into it, check the App Store listing and IAP text for subscription wording,
confirm privacy labels and screenshots, attach the IAP to the version, archive
build 2 and resubmit with review notes. iOS 27 testing needs Xcode 27 or an iOS 27
device; this Mac only has Xcode 26.3.

---

## 6. Build state

- Version **1.0**, build **2**.
- Question pool: **506** (253 core + 253 doubles); all 14 languages at 506/506.
- iOS Xcode project committed (`ios/`), SPM not CocoaPods.
- `npm test` — 109/109 passing. `npm run build` clean; `npx cap sync ios` run.
- Verified in the iOS 26.3 simulators: the paywall shows "Path Unlock, £3.99"
  from the local StoreKit file when run from Xcode; on a fresh install the ATT
  prompt appears over the login screen on both iPhone 17 Pro and iPad Air, with
  no ad or SDK requests made before it.

A note for whoever reads this next: `optSub()` in `LifeInTheUK.jsx` deliberately
returns null when a translated option is identical to the English, so proper nouns
("Cornwall", "Sir Christopher Wren") do not print twice. An option with no subtitle
under it is working as designed, not a missing translation.
