# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

Ships as a static web app and, via Capacitor, as a native iOS app from the same
source. The wrapper does not make the design language native — one responsive
web design serves both, and both are held to the same standard (confirmed: web
and iOS matter equally).

## Users

**Primary: adults preparing for the UK citizenship test with a date booked.**
They have paid the £50 fee and have a day in the calendar. They are anxious and
motivated, and they study in short bursts on a phone — a commute, a break,
before bed. Many are not confident readers of English; that is the point of the
test and the reason the app exists.

Secondary: people exploring before they book. Supported, but every tradeoff
resolves in favour of the person with a date (confirmed).

Failing the test costs money and time and has to be rebooked. The emotional
stakes are real, and the app should reduce anxiety rather than manufacture it.

## Product Purpose

Get someone to a confident pass on *Life in the United Kingdom: A Guide for New
Residents* (3rd edition) — the official Home Office handbook.

Success is the person walking into the test centre knowing they will pass, and
being right. The in-app proxy for that is clearing all eight levels of the path,
which ends above the real pass mark.

## Positioning

**Questions are always shown in English, with a reviewed translation underneath
every question, every option and every explanation.**

This is the mechanism a competitor cannot truthfully copy without doing the same
work: 506 questions hand-translated into 14 languages, 7,084 entries, verified
rather than machine-generated. The real test is in English, so recognising the
English wording is half the skill — but the fact has to land in the language the
person actually thinks in. Translating the questions outright would train the
wrong thing; showing only English abandons the reader.

Everything ships in the bundle. It works offline, on a plane, on a bad
connection, in a test-centre car park.

## Operating Context

- Studied on a phone, one-handed, in five-to-fifteen-minute sessions.
- Often in a second or third language, and often under time pressure before a
  booked date.
- Offline-capable by design: no network call is needed to study.
- Three of the fourteen languages are right-to-left (Urdu, Arabic, Farsi) and
  the layout mirrors fully.
- Scripts in play: Latin, Devanagari, Arabic, Gurmukhi, Bengali, Gujarati,
  Tamil, Han, Cyrillic-free. Type has to survive all of them.

## Capabilities and Constraints

- **506 questions** — 253 written from the handbook, each with one double.
- **14 languages**, complete: Hindi, Urdu, Punjabi, Bengali, Arabic, Romanian,
  Polish, Portuguese, Gujarati, Italian, Tamil, Farsi, Chinese (Simplified),
  Tagalog.
- **Mock test** in the real format: 24 questions, 45 minutes, 18 to pass, drawn
  in the real chapter mix (2/2/8/6/6).
- **Eight-level path**, each locked until the previous is passed; the last asks
  21 of 24, above the real mark.
- Study notes for all five handbook chapters in all 14 languages; 73 flashcards.
- **No backend.** Progress lives in `localStorage` on the device. Firebase is
  auth only; there is no database.
- Monetisation: the path locks behind a £3.99 annual subscription with a 3-day
  card-gated trial. Everything else is free with ads. Web is free and ad-free.
- **Font constraint, non-negotiable:** `system-ui` must never enter the font
  stack. In the iOS WKWebView it claims every character then draws `.notdef`
  for anything outside Latin, turning all fourteen non-English languages into
  tofu boxes while the web looks fine.
- Question content is factual and fixed against the handbook. It is not
  rewritable for design reasons.

## Brand Commitments

**None binding.** The user was asked what was locked — name, the blue "UK" tile
mark, blue as the primary colour — and delegated the decision ("just use the
skill to a design that makes sense"). Product truth and content are preserved;
the visual identity is open to replacement.

The product name in the App Store listing is *Life in the UK: Test Prep*.

## Evidence on Hand

- The 506 questions, written from and checked against the official handbook.
- 7,084 translated entries, verified for numeric fidelity, option-slot
  alignment and True/False ordering.
- `PROJECT.md` in the repo documents the whole system.
- No testimonials, user numbers, reviews, ratings or download figures exist.
  Nothing of that kind may be invented.
- The app is not affiliated with the Home Office and must not imply that it is.

## Product Principles

1. **English is the answer; the mother tongue is the explanation.** Never invert
   this — it is the product.
2. **Reduce anxiety, don't manufacture it.** The user has money and a date on
   the line. Progress should feel earned and legible, never punitive.
3. **Every script is a first-class citizen.** A design that only looks right in
   Latin is broken, not "mostly done".
4. **It works with no signal.** Nothing essential may depend on a network.
5. **Honest about what it is.** A study aid, not the Home Office, and never
   dressed as official.

## Accessibility & Inclusion

- Readers with low English confidence are the core audience, not an edge case.
- Full RTL mirroring for Urdu, Arabic and Farsi.
- Studied one-handed on a phone: touch targets and thumb reach matter.
- `prefers-reduced-motion` is respected throughout.
- Light and dark both shipped and both first-class.
