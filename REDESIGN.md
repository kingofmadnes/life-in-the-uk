# The Airmail Counter — redesign record

What the app's new look is, why it is that and not something else, and what a
formal design review found when it was pointed at the result.

Built 21 September 2026 with the Impeccable design skill. Seed key `9823ea0f`.

---

## 1. The brief

> "make this app unique on how it looks — be brave and make it humanly
> acceptable"

The app already worked. It had 506 questions in 14 languages, an eight-level
path, a working paywall. What it looked like was competent and completely
anonymous: rounded cards, a blue accent, soft shadows, Unicode glyphs standing
in for icons. You could have swapped the content for a driving-theory app and
nobody would have noticed.

Three things were confirmed before any pixel moved:

| | |
|---|---|
| **Who** | Adults with a citizenship test **already booked and paid for** (£50). Anxious, motivated, studying in 5–15 minute bursts on a phone, often reading a second or third language. Casual browsers are supported, but the booked-test user wins every tradeoff. |
| **What's locked** | **Nothing.** Name, mark and palette were all explicitly released. |
| **Which surface** | Web and iOS matter **equally**. |

Recorded in `PRODUCT.md`.

---

## 2. Choosing the world

### The two ruts

Every study app ships one of two looks, and both were ruled out up front:

- **the pastel card deck** — rounded tiles, a soft accent, confetti, a streak
  counter. The category default.
- **government grey** — its predictable opposite, sober and institutional.

The brief also paints its own picture, and *that* is a third rut: "Life in the
UK" reads as Union Jack, red-white-blue, a lion. At most one candidate was
allowed to spend itself on the literal reading.

### Seven candidates from the reader's own world

Derived from what this specific reader knows by heart, deliberately spanning
seven different material families rather than seven versions of one idea:

| | System | Why it could carry the product |
|---|---|---|
| 1 | HM Passport security engraving | The literal prize at the end of the journey; two-layer printing mirrors the two-layer question |
| 2 | British Rail / TfL wayfinding | Read daily by every migrant; a path *is* wayfinding |
| 3 | Pelican paperback grid | Britain's self-education publishing — night-class knowledge, this exact reader |
| 4 | Ordnance Survey cartography | "Learning the country", made literal; contour as difficulty |
| 5 | **Post Office counter & airmail** | The civic counter everyone has queued at; the stamp as a mark of passing |
| 6 | Exam-board OMR answer sheets | The test itself |
| 7 | Transferware / enamelware | Weakest — British stereotype rather than daily life |

The roll landed on **5**. Deliberately not my own top pick — the point of the
mechanism is that the strongest-ranked candidate is the one *every* run would
ship, so the ranking gets overruled on purpose.

### Why it turned out to be the right answer anyway

An airmail envelope is the single object every one of these fourteen language
communities recognises on sight. And it carries the product's mechanism
*literally*: the destination address in the destination's language, the sender's
in their own.

Which is exactly what this app does with every question — English on top,
your language underneath.

Six rival directions were fused and judged on two axes, audience identification
and product clarity. Three were declined, and the winning direction was raised
by each of them before it was built:

| Donor | What it gave |
|---|---|
| a 1971 airline timetable | **Collapse the type scale to three sizes.** Rank by weight and rule — half these scripts have no capitals to rank with. |
| a starship crew terminal | **Every state gets a stamped word, not a colour wash** — readable in greyscale. |
| industrial streetwear | **Every region carries its plain name.** An icon-only affordance is a guess in fourteen languages. |

---

## 3. What shipped

### Materials

| | |
|---|---|
| **chevron** | the red-and-blue airmail stripe down the left edge of anything that is a letter — the day's card, a question, a flashcard — and as a band under the header and over the tab bar |
| **fold rule** | a dashed rule between the English and the translation, so the eye always knows which layer it is reading. This is the product, made visible |
| **perforation** | four radial-gradients biting the ground out of all four edges of a stamp |
| **postmark** | a drawn SVG struck on the day's card and on every cleared level |
| **laid paper** | a 1px repeating gradient giving manila a tooth, so it reads as paper rather than beige |

### Palette

Light is the counter in daylight — manila `#E7DCC2`, laid writing paper
`#FAF6EC`, stamp ink `#1C1A17`, postal red `#C8102E`, airmail blue `#14387F`.

Dark is the sorting office at night — ink `#14161C`, paper `#1E212A`.

Fills use **separate deeper tokens** (`--red-fill`, `--blue-fill`). A bright red
that reads beautifully as ink fails contrast the moment white type sits on it.

### Type

Three sizes. Hierarchy carried by weight, rule and reversal instead of size,
because inflating size is what breaks a 14-language layout fastest.

**Archivo** is the postal voice — headings, postmarks, numerals, the clock. It
is bundled Latin-only and named only on display strings and digits.
**Plus Jakarta Sans** carries body text. Non-Latin scripts fall through to the
system face by design.

`system-ui` is **never** in the stack. In the iOS WKWebView it claims every
character and then draws `.notdef` for anything outside Latin — which once
turned all fourteen languages into tofu boxes while the web looked fine.

### Icons

Drawn SVG on one 20px grid, 1.7 stroke, round caps.

They used to be bare Unicode glyphs (`⌂ ◆ ☰ ◔ ⚙ ▶ ✓ ☾ ☀ ★ ☆ ›`), which forced a
symbol `@font-face` scoped to exactly twelve codepoints to stop iOS drawing them
as tofu. **That hack is now deleted**, and with it the hazard: any stack carrying
a symbol family is one bad fallback from eating Devanagari or Arabic.

---

## 4. Bugs found while building

Five real defects surfaced during the work, none of them cosmetic:

1. **`.pw-mark` was defined twice** — once for the Path's tick and padlock SVGs,
   once for the unlock sheet's icon. The later rule won, so the Path's glyphs
   were rendering as 44px tinted boxes inside 66px nodes. Both scoped.
2. **A perforation mask punched holes through the middle of every stamp.**
   `-webkit-mask-composite: source-in` and `mask-composite: intersect` do not
   mean the same thing and mixing them is undefined. Rebuilt with gradients.
3. **Dark-mode fills failed contrast** with white type on them. Split into
   separate fill tokens.
4. **`--ink3` failed contrast in both modes** — 3.07:1 on manila, 3.55:1 on the
   dark card. Both re-derived against the 4.5:1 floor.
5. **The Path's progress meter read as FULL at 0%** — a dark track on a dark
   ground with the fill scaled to zero. Worse than invisible: actively wrong.

And one in my own tooling: the screenshot harness produced an invalid RTL
capture, because pages in one browser share `localStorage` per origin and the
previous run's language and dark mode bled through. Each capture now gets an
isolated browser context.

---

## 5. The review

The build was handed to a fresh reviewer with no history of the work — the
direction contract, the screenshots, the detector output, and nothing else.

It returned **fix**, and it was right about the worst of it:

> "`function Postmark` is defined and instantiated **zero times**. The world's
> signature device was drawn and never used."

It also caught `.stamped` — the greyscale-readable state word promised by one of
the three raises — styled and never rendered. And the study-notes list shipping
**five pastel tinted chips**, which is precisely the card deck the thesis names
and refuses, in five hues that appear nowhere in the palette. And `#F2C300`
gold, which is specifically the accent of the category app I claimed to refuse.

Eight fixes were applied in one batch and rescored:

| | Fix | Verdict |
|---|---|---|
| 1 | Postmark and stamped state instantiated | partial → **done** |
| 2 | Pastel chapter chips deleted | partial → **done** |
| 3 | Path re-derived: real perforation, no gold, no glow | **resolved** |
| 4 | Display voice promoted to headings | **resolved** |
| 5 | Contrast re-derived in both modes | **resolved** |
| 6 | Misleading progress meter | **resolved** |
| 7 | Account button restyled and RTL-mirrored | **resolved** |
| 8 | Date input, dark toggle, scroll floor | partial → **done** |

The rescore also caught **three regressions I introduced**, which is exactly
what a second pass is for:

- I replaced the banned pastel chips with a **2.5px coloured `border-inline-start`**
  — which is another pattern the quality floor bans by name. Now weight and size
  only, no rule.
- Chapters 4 and 5 kept green and ochre, which are not in the declared world, and
  as full-saturation ink they were *louder* than the tints they replaced. All
  five chapters now rank in ink; the numeral and title identify them.
- I promoted a class named `.eyebrow` into the display voice. The element had
  already been converted into a real ruled heading, but the banned name invites
  the kicker back. Renamed `.sechead`.

---

## 6. The desk

The ceiling item above came due. `desktop.png` was the phone column centred in
1440px with dead manila either side, and the honest reading of it was that the
app had no desktop — it had a phone, displayed on a desk.

### The tab bar was the tell

Five icons spread across 1440px is not a navigation bar, it is five icons
marooned in a field. A bottom tab bar is a *thumb* affordance; there is no thumb
on a desk. So from **1024px** the counter grows its position board — the sign
standing beside a post office window that names what that counter does.

The board is writing paper against the manila ground, 252px wide. The wordmark
and the dark toggle sit at its head; the five destinations run down it as rows
with their plain names; the account control sits at its foot instead of hovering
over the reading column. The Settings shortcut in the phone header stands down,
because the board already lists Settings and naming the same place twice is
clutter.

The chevron leaves the header and runs down the board's **inner** edge, where it
goes on doing the only job it has ever had: marking the boundary between the
counter's furniture and the letters lying on it. At 4px a −45° chevron reads as
dots, so on a vertical edge it is 7px.

The active row is **struck, not tinted** — postal red with white type. That is
the same rule the rest of the world already keeps: a reversal survives greyscale
and a bad screen, a colour wash does not.

Three things follow from it:

| | |
|---|---|
| `:has()` guards the offset | `.uk:has(.nav){padding-inline-start:var(--rail)}`. A timed run hides the nav, and a question must stay centred rather than shunted sideways by a rail that is not there. |
| the desk block goes **last** | It overrides everything the phone established, the Path's own night palette included. Written in source order before the Path section, it silently lost every cascade tie — which is exactly what happened on the first pass, and the screenshots caught it. |
| sticky is not fixed | `.top` was `position:sticky`, so it stayed *in flow* — and the flow now starts a rail's width to the side. The header rendered 252px from where it belonged. |

### 1180px: the home screen stops queueing

Home is the one screen with two things to say at once — where you stand, and
what to do next. On a desk they sit side by side: the day's letter and the
docket pinned next to it. Below, each section's list opens into two columns,
with `.span2` on the entries that outrank the rest — the path, its meter, the
full mock. With no mistakes to fix, "Practise by chapter" takes the whole width
rather than leaving a half-empty shelf.

Every other screen stays a single reading column. That is not laziness: Home is
the counter's desk, and everything else is a document you read.

### 720–1023px

Still a tab bar — a 252px rail plus a 620px column does not fit — but the items
are held to the width of the column they belong to instead of spreading.

### The Path: the route stopped running through the words

Two defects, one fix.

The connector line ran straight through the middle of every level's name.
Structurally so: the caption sat directly under the stamp, and directly under
the stamp is where the route leaves. A dashed line through the middle of a word
is the one thing a route map may never do.

And the track was a hard-coded 260px, so on a desk the route was a narrow snake
in an enormous blue field.

Both go away if the drawing is **derived from a measured width**. The track is
measured with a `ResizeObserver` and its SVG coordinate system *is* its own pixel
width, so the route never stretches. Then the order of derivation is the trick:
the caption's width is claimed **first**, and the route's lateral swing gets
whatever room is left over. The names move to the stamp's outer edge, alternating
sides, and the route runs clear down the middle.

Physical sides, not logical ones — the swing is already mirrored for Urdu,
Arabic and Farsi, so a positive swing is the right-hand side in every direction.
Centred caption text, so no script is left ragged against its stamp.

And once a desk has room, each stop can say what it actually asks of you —
`10 questions · Untimed · 8 of 10 to pass` — so the route reads as a timetable
rather than eight anonymous stops. A phone does not have the room, and doesn't.

---

## 7. The screen nobody had looked at

The sign-in screen is the **first viewport of the app**, and it had never been
redesigned. It was still the old world in full: `#2F6BFF` blue, `#f7f4ef` grey
paper, 10–14px radii, a segmented pill switcher, generic greys. A person's first
impression of this product was a different product.

Worse, `src/auth/auth.css` named **`system-ui`** in two font stacks — the one
thing PRODUCT.md calls non-negotiable, and the exact hazard that once turned all
fourteen languages into tofu boxes.

The auth layer lives outside the `.uk` root, so it carries its own copy of the
tokens. Those are now the same tokens: manila, laid paper, stamp ink, postal red,
airmail blue, and the night sorting office in dark. The card became a letter with
the chevron down its edge. The pill switcher became two chips whose chosen one is
struck. The fields became ruled and labelled. The "or" divider became a fold rule.
Messages became ink on a tinted ground with a ruled edge, so the message never
depends on a colour the reader may not see.

And the screen now says what the app is: *a study aid for the official handbook,
not affiliated with the Home Office.* `.auth-foot` had been styled and never
rendered — the same defect the reviewer found twice before.

Two leftovers went with it: the favicon was still the old blue tile (with
`system-ui` in it), and `index.html` still painted the **old cream** behind the
overscroll area, so a rubber-band pull on iOS flashed a colour the app no longer
uses.

---

## 8. What was verified, not assumed

- **110/110 tests** passing.
- Full 24-question mock driven end to end: 24 unique questions, 24/24 subtitled,
  **zero console errors**.
- **Twenty-one viewports** captured and inspected in two batched rounds: 1440,
  1180, 900, 390 and 320px; light and dark; full RTL in Arabic on home and on the
  Path; a question screen in Hindi; and the sign-in screen in both schemes and
  both modes. Zero console or page errors in every capture.
- Contrast re-derived numerically, not eyeballed — including against the
  *lightest* part of the Path's sky, which is where its locked captions were
  failing at **3.07:1**.
- Geometry checked by measuring the live DOM, not by reading the screenshots:
  track width, caption boxes, rail rects and computed `position`.
- Mechanical detector run each round. The two standing findings — body font, and
  the chevron read as a "side-tab accent border" — are argued in §9, not waved
  through.

---

## 9. The two findings that stand

**Body font (`Plus Jakarta Sans`).** Raised on the first run, examined by the
reviewer, and overruled for body text: the face has to be bundled, has to cover
latin + latin-ext, and must not claim codepoints it cannot draw. The display
voice is Archivo and carries the character.

**The chevron, flagged as a "side-tab accent border".** The detector is right
about the shape and wrong about this case. The chevron is not a coloured rule
standing in for hierarchy; it is the world's declared material — a diagonally
striped airmail edge that means *this is a letter* — named in the direction
contract and already reviewed and accepted on the day's card and on every
question. Removing it from the sign-in card alone would make that one screen the
only surface in the app that is not a letter.

Noted rather than silently kept: the detector does not flag the same device in
`src/LifeInTheUK.jsx`, because it reads CSS files and the app's stylesheet is a
template literal. The finding is real; the verdict is the same in both files.

---

## 10. Recording it, and what that turned up

`DESIGN.md` now exists, written from the built artifact by the documenter rather
than from any of the prose above, with `.impeccable/design.json` beside it. The
run is finally *recorded* and not merely described.

Reading the code back caught a claim that was not true.

Two comments — one in `src/main.jsx`, one in the stylesheet — asserted that
Archivo is named **"ONLY on digits and fixed English, never on translated
text."** It is not. The selector list includes `.hero h1`, `.h2`, `.sechead`,
`.pw-unit h2` and `.pw-title`, and every one of those holds a `t()` string:
`.hero h1` is the greeting, `.sechead` is "Practise".

Nothing is broken, and that is the interesting part. Neither bundled face ships
a `unicode-range`, so **both** claim every codepoint — but neither is ever named
alone. Every stack ends `'Plus Jakarta Sans', sans-serif`, and a face missing a
glyph falls through to the next one *per character*. Tamil and Urdu were captured
to prove it: காலை வணக்கம் and صبح بخیر both set correctly in the display tier.

So the safety was never "don't name Archivo on translated text" — it was "never
shorten the stack". `system-ui` is banned for a different reason entirely: in the
iOS WKWebView it does not fall through. It claims the character and draws
`.notdef`. Both comments now say the rule that is actually load-bearing, because
a comment that protects the wrong thing invites someone to break the right one.

Two smaller drifts were corrected with it: the direction contract in
`index.html` named a laid-paper value (`#F7F2E6`) the build never shipped, and
the account button's positioning comment still described a floating tab bar that
became full-bleed some time ago.

---

## 11. Still open

**The account button on a phone.** It floats above the tab bar and therefore
sits over whatever card happens to scroll under it — in Urdu it lands on the
flashcards tile's own text. The desk answers this properly by docking it into
the rail's foot; the phone has nowhere comparable to put it. The real fix is
that sign-out and delete-account are Settings concerns and the floating control
should not exist at all, which is a product change and not a design pass's call
to make.

---

## Files

| | |
|---|---|
| `PRODUCT.md` | product truth — who it is for, what must never change |
| `PROJECT.md` | the whole app: question bank, translations, path, money, tests |
| `MONETISATION.md` | App Store Connect and AdMob, step by step |
| `DESIGN.md` | the system, derived from the built artifact — tokens, rules, components |
| `src/LifeInTheUK.jsx` | the app, including the stylesheet as one template literal |
| `src/auth/auth.css` | the auth layer — outside the app root, so it restates the tokens |
| `index.html` | carries the direction contract, seed key `9823ea0f` |
