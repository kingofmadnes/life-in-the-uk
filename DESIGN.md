---
name: Life in the UK — Test Prep
description: A study app built as post between two languages; every question is an airmail letter with a fold rule between the English and your own tongue.
colors:
  manila: "#E7DCC2"
  laid-paper: "#FAF6EC"
  gummed-label: "#EDE4D0"
  pencil-rule: "#CFC0A0"
  pencil-rule-soft: "#DED2B8"
  stamp-ink: "#1C1A17"
  stamp-ink-2: "#57503F"
  stamp-ink-3: "#6A6050"
  postal-red: "#C8102E"
  postal-red-fill: "#C8102E"
  postal-red-soft: "#F6E0DF"
  postal-red-pressed: "#A50D26"
  airmail-blue: "#14387F"
  airmail-blue-fill: "#14387F"
  airmail-blue-soft: "#DEE4F2"
  airmail-blue-deep: "#0D2657"
  franking-green: "#1F6F4A"
  franking-green-soft: "#DDEBE0"
  ochre: "#B07908"
  ochre-soft: "#F5E9CE"
  night-ground: "#14161C"
  night-paper: "#1E212A"
  night-label: "#272B36"
  night-rule: "#3A4052"
  night-rule-soft: "#2F3442"
  night-ink: "#F0E9D8"
  night-ink-2: "#A79F8C"
  night-ink-3: "#948E7E"
  night-red: "#F0526A"
  night-red-fill: "#A81530"
  night-red-soft: "#3A1B22"
  night-blue: "#7FA0EC"
  night-blue-fill: "#1D4392"
  night-blue-soft: "#1D2740"
  night-green: "#4FC08A"
  night-green-soft: "#16301F"
  night-ochre: "#E0A93C"
  night-ochre-soft: "#332811"
  sky-top: "#1A4593"
  sky-mid: "#14387F"
  sky-base: "#0F2A62"
  rail-night: "#0C1B3D"
typography:
  display:
    fontFamily: "Archivo, Plus Jakarta Sans, sans-serif"
    fontSize: "27px"
    fontWeight: 800
    lineHeight: 1.12
    letterSpacing: "-0.03em"
    fontFeature: "tnum"
  headline:
    fontFamily: "Archivo, Plus Jakarta Sans, sans-serif"
    fontSize: "19px"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "15px"
    fontWeight: 800
    lineHeight: 1.3
    letterSpacing: "-0.012em"
  body:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.42
    letterSpacing: "normal"
  body-translated:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "15.5px"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "10.5px"
    fontWeight: 800
    lineHeight: 1.3
    letterSpacing: "0.13em"
  numeral:
    fontFamily: "Archivo, Plus Jakarta Sans, sans-serif"
    fontSize: "23px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontFeature: "tnum"
rounded:
  none: "0"
  stamp: "2px"
  control: "3px"
  card: "4px"
spacing:
  hair: "2px"
  tight: "7px"
  snug: "9px"
  base: "11px"
  gap: "13px"
  pad: "15px"
  col: "18px"
  card: "22px"
  section: "26px"
components:
  button-primary:
    backgroundColor: "{colors.postal-red-fill}"
    textColor: "#FFFFFF"
    typography: "{typography.title}"
    rounded: "{rounded.control}"
    padding: "15px 18px"
  button-primary-hover:
    backgroundColor: "{colors.postal-red-pressed}"
    textColor: "#FFFFFF"
  button-dark:
    backgroundColor: "{colors.stamp-ink}"
    textColor: "{colors.laid-paper}"
    rounded: "{rounded.control}"
    padding: "15px 18px"
  button-ghost:
    backgroundColor: "{colors.laid-paper}"
    textColor: "{colors.stamp-ink}"
    rounded: "{rounded.control}"
    padding: "15px 18px"
  chip:
    backgroundColor: "{colors.laid-paper}"
    textColor: "{colors.stamp-ink-2}"
    rounded: "{rounded.control}"
    padding: "8px 13px"
  chip-on:
    backgroundColor: "{colors.stamp-ink}"
    textColor: "{colors.laid-paper}"
    rounded: "{rounded.control}"
    padding: "8px 13px"
  card-letter:
    backgroundColor: "{colors.laid-paper}"
    textColor: "{colors.stamp-ink}"
    rounded: "{rounded.card}"
    padding: "22px 20px 20px 28px"
  option:
    backgroundColor: "{colors.laid-paper}"
    textColor: "{colors.stamp-ink}"
    rounded: "{rounded.control}"
    padding: "13px 14px"
  option-selected:
    backgroundColor: "{colors.airmail-blue-soft}"
    textColor: "{colors.stamp-ink}"
    rounded: "{rounded.control}"
    padding: "12px 13px"
  option-right:
    backgroundColor: "{colors.franking-green-soft}"
    textColor: "{colors.stamp-ink}"
    rounded: "{rounded.control}"
    padding: "12px 13px"
  option-wrong:
    backgroundColor: "{colors.postal-red-soft}"
    textColor: "{colors.stamp-ink}"
    rounded: "{rounded.control}"
    padding: "12px 13px"
  input-field:
    backgroundColor: "{colors.laid-paper}"
    textColor: "{colors.stamp-ink}"
    rounded: "{rounded.control}"
    padding: "13px 14px"
    height: "48px"
  nav-item:
    backgroundColor: "transparent"
    textColor: "{colors.stamp-ink-3}"
    rounded: "{rounded.control}"
    padding: "7px 0 6px"
  nav-item-active:
    backgroundColor: "transparent"
    textColor: "{colors.postal-red}"
  rail-item-active:
    backgroundColor: "{colors.postal-red-fill}"
    textColor: "#FFFFFF"
    rounded: "{rounded.control}"
    padding: "11px 13px"
  stamp-state:
    backgroundColor: "transparent"
    textColor: "{colors.franking-green}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "5px 9px"
  path-node:
    backgroundColor: "#26468F"
    textColor: "#A8BCE4"
    rounded: "{rounded.stamp}"
    size: "66px"
  path-node-here:
    backgroundColor: "{colors.postal-red}"
    textColor: "#FFFFFF"
    rounded: "{rounded.stamp}"
    size: "66px"
  path-node-done:
    backgroundColor: "{colors.manila}"
    textColor: "{colors.airmail-blue}"
    rounded: "{rounded.stamp}"
    size: "66px"
---

# Design System: Life in the UK — Test Prep

## Overview

**Creative North Star: "The Airmail Counter"**

This is a post-office counter, not an app screen. Manila envelope ground, laid writing paper laid on top of it, three postal inks, and a chevron-striped airmail edge down anything that is a letter. Every question is a piece of post: the English address on top, the reader's own language below a fold rule, and a postmark struck on the envelope when a level is cleared. The world was chosen because the airmail chevron is the one object all fourteen of these language communities already recognise — it needs no translation, which is exactly the problem this product exists to solve.

Density is calm and printed. Surfaces are flat paper with hairline pencil rules (1.5px `#CFC0A0`) and real, blurred paper lift — never a plastic block shadow. Corners are nearly square (2–4px) because a stamp and an envelope have corners. Rank is carried by weight, rule and reversal rather than by size, because half the scripts in play have no capitals to rank with and inflating type is what breaks a fourteen-language layout fastest. Colour never carries meaning alone: every state also says its own name in struck uppercase, so the whole system survives greyscale, colour blindness, and a bad screen in a test-centre car park.

The two rejections are explicit and shipped: the pastel card deck this category always ships (rounded tiles, soft tints, a gold accent), and its predictable opposite, government grey. Dark mode is not a filter but a second place — the night sorting office, ink-blue with one desk lamp overhead. The Path screen commits to a single airmail-blue sky in both modes, because it is a different room.

**Key Characteristics:**
- Manila and laid paper, never white; a 1px repeating gradient gives both a tooth.
- The airmail chevron as a structural material: an 11px edge on a letter, a 4–7px band on a chrome boundary.
- A dashed fold rule wherever two language layers meet — the product made visible.
- Three type tiers, ranked by weight and rule; two Latin faces, `system-ui` never named.
- Every state is a struck word, legible in greyscale; squared corners throughout (2–4px).
- Full logical-property mirroring for Urdu, Arabic and Farsi.

## Colors

The palette is one envelope and three postal inks: manila and laid paper carry everything, and red, blue and green appear only as marks.

### Primary
- **Postal Red** (`#C8102E`; night `#F0526A`): the counter's stamp. The logo tile, the primary action, the current level on the Path, the active rail item on a desk, the caret, the wrong-answer mark. Used as a mark, not a wash.
- **Airmail Blue** (`#14387F`; night `#7FA0EC`): the route and the journey. Progress bars, selected options, answered ticks, the focus ring, and the whole Path sky (`#1A4593` → `#14387F` → `#0F2A62`).

### Secondary
- **Franking Green** (`#1F6F4A`; night `#4FC08A`): pass, correct, cleared, the "on" switch. The postmark itself is struck in this green.
- **Ochre** (`#B07908`; night `#E0A93C`): flags, highlights in notes, callouts and the text-selection ground. The one warm ink; never an accent for its own sake.

### Neutral
- **Manila** (`#E7DCC2`; night `#14161C`): the ground the counter is made of. Also the body/overscroll background in `index.html` so no dark screen flashes cream.
- **Laid Writing Paper** (`#FAF6EC`; night `#1E212A`): every card, row, tile, field and the tab bar. The layer that is *on* the counter.
- **Gummed Label** (`#EDE4D0`; night `#272B36`): inset surfaces — icon plinths, the clock, meter troughs, explanation blocks.
- **Pencil Rule** (`#CFC0A0`; night `#3A4052`) and its softer sibling (`#DED2B8`; night `#2F3442`): every border and divider, always 1.5px.
- **Stamp Ink** (`#1C1A17`; night `#F0E9D8`) with two lighter grades (`#57503F` / `#6A6050`) for secondary and tertiary text.

### Named Rules
**The Two-Red Rule.** `--red`/`--blue` are *ink* values for type, strokes and marks. `--red-fill`/`--blue-fill` are *field* values for anything carrying white type. In light they are identical (`#C8102E`, `#14387F`); in dark they deliberately diverge — the ink brightens to `#F0526A`/`#7FA0EC` for legibility on a dark ground, while the fill darkens to `#A81530`/`#1D4392` so white type on it still clears 4.5:1. Never put white type on an ink token.

**The Greyscale Rule.** No state may be communicated by colour alone. Every colour-coded state is accompanied by a struck uppercase word, a border-weight change (1.5px → 2.5px), a numeral, or an icon. Test: desaturate the screen; if any state becomes ambiguous, it is broken.

**The Ink-Not-Wash Rule.** Chapters, categories and taxonomies rank in ink (`CH_COLOR` is `var(--ink)` for all five chapters), identified by numeral and title. No tinted category chips, no per-chapter hue, no gold.

## Typography

**Display Font:** Archivo (with Plus Jakarta Sans, then sans-serif)
**Body Font:** Plus Jakarta Sans (with sans-serif)
**Label/Mono Font:** Archivo, with `font-variant-numeric: tabular-nums` and `font-feature-settings: "tnum"`

**Character:** Archivo is the postal voice — grotesque, squared, at 800 weight with tight negative tracking, the way a franking machine and a position board speak. Plus Jakarta Sans carries the reading: humanist, quiet, and legible at 13–15px in a second language. Both are bundled Latin (and Latin-Ext for Jakarta) with no `unicode-range`; every non-Latin script falls through per-glyph to the platform sans by design.

### Hierarchy
- **Display** (Archivo 800, 27px, 1.12, −0.03em; 23px under 400px): screen titles and the day's greeting (`.hero h1`, `.h2`). At 25px on the `.ready` and auth cards.
- **Headline** (Archivo 800, 19px, −0.025em, with a 1.5px rule under it): section heads and Path unit titles (`.sechead`, `.pw-unit h2`). The rule is the hierarchy; nothing sits above it.
- **Title** (800, 15px, −0.012em): row and accordion titles. 19px/700 at 1.38 for the question itself (`.qtext`).
- **Body** (400–600, 15px / 14.5px, 1.42–1.58): options, explanations, ledes. Ledes cap at `max-width: 60ch`.
- **Body (translated)** (600, 15.5px option-level 13.5px, `--ink2`, under a dashed rule): the reader's own language. Always a grade quieter and a grade lighter than the English above it, never smaller than 13.5px.
- **Label** (800, 10.5–12px, uppercase, 0.11–0.16em): stamped states, field labels, stat captions, source tags.
- **Numeral** (Archivo 800, tabular): scores, clock, level numbers, question counts. Digits never reflow.

### Named Rules
**The Three-Tier Rule.** Rank is weight, rule and reversal — not size. There are three legible tiers (display ≈27/25/23, reading ≈15/14.5, label ≈10.5–12.5) and the ramp must not be widened to signal importance. A heading earns its rank at 800 weight with a rule under it.

**The No-system-ui Rule.** `system-ui` must never appear in any font stack, anywhere, including `index.html` and `auth.css`. In the iOS WKWebView it claims every codepoint and then draws `.notdef` for anything outside Latin, turning all fourteen non-English languages into tofu boxes while the web build looks fine. Any stack must end in a concrete generic (`sans-serif`).

**The Postal Voice Rule.** Archivo leads the stack only on the display/postal tier — the selector list is `.mono, .stamped, .wordmark, .pmark text, .count, .clock, .tile b, .hs b, .ring-val, .pw-node-n, .flash-f, .lvl-n, .hero h1, .h2, .pw-unit h2, .pw-title, .sechead, .ic.num`. Body text, options, explanations and every translated subtitle are Jakarta only. Archivo is *never* used alone: `'Plus Jakarta Sans', sans-serif` must follow it so a non-Latin glyph falls through instead of tofuing.

**The Fold Rule.** English above, the reader's language below, separated by a dashed rule (`1.5px dashed var(--line)`, or `1px dashed var(--line-soft)` inside an option). This is the product made visible and it is never inverted, never dropped, never replaced with a solid rule. A translation identical to its English is not printed twice.

## Layout

A single reading column, centred: `max-width: 560px` with 18px gutters on a phone, 620px from 720px, 720px with 40px gutters from 1024px, and 1040px for the two-column home (`.page.wide`) from 1180px. Vertical rhythm runs 7 / 9 / 11 / 13 / 15 / 18 / 22 / 26px; card padding is 15–22px and grid gaps are 9–12px.

**Phone.** A sticky franked header (`.top`, 13/18/12px, a 1.5px rule and a 4px chevron band 5px below it) and a fixed bottom tab bar (`.nav`) anchored at `bottom: var(--ad-h, 0px)` with a 4px chevron band above it and a 28px fade above that. The page reserves `calc(150px + var(--ad-h,0px))` at the foot so the last card clears the bar. `--ad-h` is the measured AdMob banner height, published by `AdBanner.jsx` and `0px` everywhere there is no banner, so the paid tier and the whole web build lay out exactly as they always did.

**Tablet (720–1023.98px).** Still a tab bar, but its items stop spreading: `.nav{justify-content:center}` and `.navi{flex:0 1 128px}`. Five icons marooned across 1000px is a phone affordance wearing a desktop.

**The desk (≥1024px).** The tab bar becomes the counter's position board: a fixed 252px left rail (`--rail`). `.top` becomes the rail head (fixed, 74px tall, `inset-inline-start: 0`, no chevron band, settings button hidden); `.nav` becomes a vertical board beneath it (`top:74px; bottom:0; width:var(--rail)`, `border-inline-end: 1.5px solid var(--line)`); `.navi` becomes an icon-and-label row (`grid-template-columns: auto minmax(0,1fr)`, 13.5px label). The chevron leaves the header and runs down the board's inner edge at **7px**, not 4 — at 4px a −45° stripe on a vertical edge reads as dots. Content is offset by `.uk:has(.nav){padding-inline-start:var(--rail)}`; the `:has()` guard is load-bearing, because a timed run removes the nav and a question must stay centred rather than shunted sideways. The 150px tab-bar reserve drops to 56px. The account control moves to the foot of the rail (`left: 19px`).

**Home two-column (≥1180px).** `.home-top` splits `minmax(0,1.5fr) minmax(0,1fr)` — where you stand beside what to do next — and `.stack` opens to two equal columns, with `.span2` (`grid-column: 1 / -1`) reserved for the entries that outrank the rest: the Path, its meter, and the full mock.

**Right-to-left.** Urdu, Arabic and Farsi mirror fully, via logical properties plus an explicit `.uk[dir="rtl"]` block: the letter's chevron moves to the inline end, chevrons and go-arrows flip with `scaleX(-1)`, meters re-origin to the right, and list markers re-indent. One structural gotcha: the account control (`.acct-fab` / `.acct-pop`) is a **sibling** of the app root, never a descendant, so it never sees `dir` — it is mirrored from `body:has(.uk[dir="rtl"])` instead of from its own direction.

**Motion.** One easing curve, `--ease: cubic-bezier(.2,.8,.3,1)`; 0.12s for press, 0.15s for colour and border, 0.2s for switches and rotation, 0.35–0.5s for meters and rings. `prefers-reduced-motion: reduce` kills every transition and animation and every press-translate.

### Named Rules
**The Measured-Track Rule.** The Path's track width is measured with a `ResizeObserver` and the SVG `viewBox` is *that measured pixel width* (`0 0 ${W} ${H}`), so the dashed route is drawn in real pixels and never stretches between a 320px phone and a 780px desk. Caption width is allocated first (`CAP = clamp(76, W × 0.29, 172)`) and the route's swing amplitude takes whatever lateral room is left (`A = clamp(12, W/2 − 33 − 18 − CAP, 66)`). Never give an SVG route a fixed viewBox and let it scale.

**The Beside-Not-Under Rule.** A level's name sits *beside* its stamp (`.cap-e` / `.cap-w` at `calc(100% + 13px)`), never under it — under it is where the route runs, and a dashed line through the middle of a word is the one thing a route map may never do. The sides are **physical**, not logical, because the swing itself is already mirrored (`sign = rtl ? -1 : 1`): a positive swing is the right-hand side in every direction.

## Elevation & Depth

Printed matter, lifted off a counter. Three blurred, warm-tinted shadow tokens carry every surface; there is no glassmorphism outside the one modal scrim, and no glow anywhere.

### Shadow Vocabulary
- **Paper lift** (`--e1: 0 1px 2px rgba(60,44,18,.10)`; night `0 1px 2px rgba(0,0,0,.5)`): rows, tiles, chips, fields, icon buttons. A sheet resting on the counter.
- **Letter lift** (`--e2: 0 3px 10px -2px rgba(60,44,18,.16)`; night `0 3px 12px -2px rgba(0,0,0,.55)`): the day's card, the question card, flashcards, primary buttons.
- **Held aloft** (`--e3: 0 14px 34px -8px rgba(60,44,18,.30)`; night `0 16px 38px -8px rgba(0,0,0,.7)`): the auth card and the account popover. The unlock sheet uses a bespoke `0 22px 56px rgba(0,0,0,.4)`; the Path callout `0 14px 30px rgba(0,0,0,.5)`.

### Named Rules
**The Real-Shadow Rule.** Every shadow has a real offset *and* a real blur, and is tinted with the paper's own warmth (`rgba(60,44,18,…)`) in light and pure black in dark. A zero-blur hard-offset block shadow is a costume; this world is printed matter, not plastic. Hard offset shadows are banned outright.

**The Press Rule.** Depth answers touch. Pressing a row, tile, option, button, flashcard or Path node translates it 1–2px down and *removes* its shadow (`box-shadow: none`) — the sheet gets pressed onto the counter. It never grows a shadow on hover; hover only darkens the border (`--line` → `--ink2`).

**The Chrome-Fade Rule.** The tab bar fades the page out beneath it with a 28px `linear-gradient(to top, var(--bg), transparent)` rather than a shadow. Chrome boundaries are marked with the chevron band and a 1.5px rule, never with elevation.

## Shapes

Squared, because stamps and envelopes have corners. Four radii only: `0` (meters, ticks, progress troughs), `2px` (stamps, badges, dots, small keys, switch travel), `3px` (buttons, chips, options, fields, icon plinths), `4px` (cards, sheets, containers). Nothing is ever pill-shaped except the scrollbar thumb; there are no circles except the postmark, the readiness ring and the Path ring — all of which are drawn, not styled.

Borders are the primary form language: **1.5px** everywhere at rest, thickening to **2.5px** for a selected/correct/incorrect state (with padding reduced by 1px so nothing shifts). The focus ring is `2.5px solid var(--blue)` at `outline-offset: 3px`, recoloured to `#E7DCC2` inside the Path.

### Named Rules
**The Chevron Rule.** The airmail chevron (`--chev`, a −45° repeating gradient of red 0–7px, transparent, blue 14–21px, transparent, on a 28px cycle) has exactly two jobs. As an **11px** left edge (10px on the question card, 9px on a Path unit, 8px across the top of a flashcard) it says *this is a letter*: the day's card, the question, the flashcard, the unlock sheet, the auth card, the Path unit header. As a **4px** band it marks a chrome boundary — under the phone header, over the tab bar — and **7px** down the rail's inner edge on a desk. It is never decoration, never a background, and never applied to something that is not either a letter or a chrome edge. A letter that has been won or lost swaps the two-ink chevron for a single-ink one (green or red, 7px on a 14px cycle).

**The Perforation Rule.** A stamp's perforation is built from **four radial-gradients** painting the ground colour back into the stamp's edges (`.pw-node::after`, `inset: -4px`, `circle 4px at 4px 50%` repeated on an 8×11px / 11×8px tile). It is never a `mask` or `mask-composite`: those differ between WebKit and the spec and punched holes straight through the stamps. This means the perforation must know its ground — `--pw-ground: #14387F`.

**The Keyline Rule.** The logo stamp's inner white keyline is `box-shadow: inset 0 0 0 1.5px rgba(255,255,255,.55)`, not a mask, for the same reason.

## Components

### Buttons
- **Shape:** near-square (3px), 1.5px border, 15px/18px padding, 800 weight, `letter-spacing: .01em`.
- **Primary (franked block):** postal-red fill with white type and letter lift (`--e2`). Hover deepens to `#A50D26`; active translates 1.5px down and drops the shadow; disabled is `opacity: .4` with no shadow.
- **Dark:** stamp-ink fill with laid-paper type — the neutral heavy action.
- **Ghost:** laid paper with a pencil rule; hover darkens the border to `--ink2` only.
- **Icon button** (`.iconbtn`): 36×36, 3px, 1.5px rule, paper lift, `--ink2` icon; hover darkens border and ink together.
- **Link button** (`.linkbtn`): no border, no background, 13px/800, `--ink2`; goes ochre when on.

### Chips
- **Style:** laid paper, 1.5px pencil rule, 3px corner, 8/13px, 13px/700, in a horizontally scrolling row with the scrollbar hidden.
- **State:** selected is a **reversal** — stamp-ink ground with laid-paper type and a matching border. Never a tint.

### Cards / Containers
- **Corner style:** 4px.
- **Background:** laid paper on the manila ground; inset blocks use the gummed label tone.
- **Shadow:** paper lift for rows and tiles, letter lift for cards that are letters.
- **Border:** 1.5px pencil rule, always.
- **Internal padding:** 14–15px for rows and tiles, 22px for the day's card, `22px 20px 20px 28px` for the question card — the extra inline-start inset is the chevron's room.

### Inputs / Fields
- **Style:** laid paper, 1.5px pencil rule, 3px corner, 13/14px, 16px type (never below 16px — iOS zooms), paper lift. Labels above in uppercase 12px/800 at `.11em`, in `--ink2`.
- **Focus:** the border goes airmail blue and the native outline is removed; global `:focus-visible` still supplies the 2.5px blue ring elsewhere.
- **Date inputs** carry tabular numerals; the picker indicator is inverted in dark mode.
- **Switch** (`.sw`): a 46×26 squared track (2px) with an 18px squared travel; on is franking green with a white travel, mirrored in RTL.

### Navigation
- **Phone:** a fixed five-item tab bar on laid paper with a 1.5px top rule and a 4px chevron band above it. Items are icon-over-label (10px/800); the active item is postal red; pressing tints the gummed label behind it.
- **Desk (≥1024px):** the position board. Items become icon-beside-label rows at 13.5px; hover tints the gummed label; the **active item is a reversal** — `--red-fill` ground with white type — not a tint, because a reversal still reads in greyscale, which is what every other state in this world already does.
- **In the Path:** the whole chrome follows the app into the sorting office — rail and bar go `#0C1B3D`, inactive items `#8FA3CC`, active manila `#E7DCC2` on a phone and `#C8102E` reversed on a desk. The desk block is deliberately the **last** rule set in the stylesheet, because it must override the Path's own night palette.

### The Stamped State (signature)
A struck rubber-stamp word: `display: inline-flex`, 11px/800, uppercase, `letter-spacing: .16em`, 5/9px padding, a **2px `currentColor` border**, 3px corner, and `transform: rotate(-1.6deg)`. Three variants only: `.ok` (green), `.no` (red), `.wait` (ochre). It carries no background — the colour is the ink, the word is the meaning, and the whole thing survives greyscale.

### The Postmark (signature)
`function Postmark` draws a 100×100 SVG: a 2.4px outer ring at r=46, a 1.1px inner ring at r=39, and fourteen 7px radial ticks. The label sits at 19px/800 with `.06em` tracking, the sub-line at 10px/700 with `.14em`. The element is 54×54, struck in franking green at `rotate(-13deg)`; on the day's card it enlarges to 62×62 in stamp ink at 20% opacity (26% in dark) as a watermark. Drawn rather than imaged so it tints with the ink and stays crisp at any density.

### The Letter (signature)
`.qcard` — laid paper, 4px, 1.5px pencil rule, letter lift, an 10px chevron down the inline-start edge, and inside it: a source tag ruled off at the top, the English question at 19px/700, and the translation under its dashed fold rule. Options are separate 3px paper blocks with a squared 26px `A/B/C/D` key; selecting thickens the border to 2.5px, tints the ground with the matching `-soft` token, and fills the key with the matching `-fill`.

### The Path Stamp (signature)
A 66×66 squared button (2px) with radial-gradient perforation on all four edges. Three states, all reversals rather than tints: **locked** `#26468F` on `#A8BCE4`, **here** `#C8102E` on white with a manila callout below it, **done** manila `#E7DCC2` on airmail blue carrying a drawn postmark. A partially attempted level wears an 82×82 progress ring in manila. The route between them is a 3px `6 8` dashed bezier in `#7C97D4` at 75% opacity.

## Do's and Don'ts

### Do:
- **Do** use the chevron for exactly two jobs: an 11px edge on a letter, or a 4px (7px vertical) band on a chrome boundary.
- **Do** put a dashed fold rule between the English and the translation, every time, in that order.
- **Do** name a state in words as well as colour — the greyscale test is the acceptance test.
- **Do** use `--red-fill` / `--blue-fill` under white type and `--red` / `--blue` for ink, strokes and marks.
- **Do** keep every font stack Latin-first with a concrete `sans-serif` at the end, and follow Archivo with `'Plus Jakarta Sans', sans-serif`.
- **Do** draw icons on the 20px grid with 1.7 stroke and round caps/joins (`function I`), adding new paths to the `ICON` map.
- **Do** rank with weight (800), a 1.5px rule, or a reversal — not with a bigger size.
- **Do** mirror with logical properties, and mirror anything outside the app root from `body:has(.uk[dir="rtl"])`.
- **Do** guard desk layout offsets with `:has()` so a chromeless screen stays centred.
- **Do** give every shadow a real offset and a real blur, warm-tinted in light.

### Don't:
- **Don't** ever name `system-ui` in a font stack — iOS WKWebView draws `.notdef` for every non-Latin script behind it.
- **Don't** use a `mask` or `mask-composite` for perforation or keylines; use radial-gradients and inset shadows.
- **Don't** ship a Unicode glyph, a dingbat, an emoji or a symbol `@font-face` as an icon — a symbol family in the stack is one bad fallback from eating Devanagari, Arabic, Bengali or Tamil.
- **Don't** use a hard offset shadow with zero blur; this world is printed matter, not plastic.
- **Don't** tint a category, chapter or taxonomy. They rank in ink, identified by numeral and title.
- **Don't** put a kicker or eyebrow above a heading — a small line that restates, teases or labels the heading below it. A heading stands alone at 800 with a rule under it. (A source tag carrying *different* information, like the chapter a question came from, is not a kicker.)
- **Don't** signal a selected state with a tint alone on the desk rail or on chips; use the reversal.
- **Don't** introduce a fifth radius, a fourth type tier, or a colour outside the four postal inks and the paper neutrals.
- **Don't** give an SVG route a fixed viewBox — measure the track and draw in real pixels.
- **Don't** put a caption under a Path stamp; the route runs there.
- **Don't** use gold (`#F2C300`), pastel tinted cards, confetti, or government grey. All three are the named anti-references.
