# Life in the UK: Test Prep — Monetisation Setup

What is built, and the console work still left to you. Rewritten 20 September 2026
to match the code that actually ships — the earlier version of this file described
a design that was replaced and would have walked you into creating the wrong
product type.

The web app is untouched by all of this: free, ad-free, no paywall, no trial.
Everything below is native iOS only.

---

## Read this first: the product type

You described what you want as **a one-time purchase that expires after a year,
with a 3-day free trial that takes card details up front.**

Apple does not allow those two things on the same product. This is worth
understanding before you open App Store Connect, because the console will not
explain it to you — it will just quietly not offer you the option.

| What you want | Apple's product type | Can it take a card before a free trial? |
|---|---|---|
| One payment, access expires after 1 year, never auto-charges again | **Non-Renewing Subscription** | **No.** Introductory offers do not exist on this type. |
| One payment, access forever | **Non-Consumable** | **No.** Same reason. |
| Charged yearly until cancelled, 3-day free trial first | **Auto-Renewable Subscription** | **Yes.** This is the only type with introductory offers. |

A free trial in Apple's world *is* an "introductory offer", and introductory
offers only exist on auto-renewable subscriptions. The card requirement comes
free with that: Apple takes the payment method when the trial starts, precisely
because something is scheduled to be charged when it ends.

So a card-gated 3-day trial and a non-renewing purchase are mutually exclusive.
You can have either one, not both.

**What the app currently ships** is the auto-renewable route — it was the only
way to get the card-gated trial you asked for:

| Thing | Value |
|---|---|
| Product ID | `com.kingofmadnes.lifeintheuk.path.annual` |
| Type | Auto-renewable subscription, 1 year |
| Price | £3.99 |
| Introductory offer | 3-day free trial |

In practice this behaves very close to what you described. The person pays £3.99,
gets a year, and can cancel at any point in that year — cancelling still leaves
them the full year they paid for. The single difference from a non-renewing
purchase is that if they do nothing, year two is charged automatically.

**If you would rather have the non-renewing version**, that is a legitimate choice
and the trade is simple: you lose the card-gated trial. You would either drop the
trial entirely, or run the 3 days on your own clock inside the app with no card
taken (which people can reset by reinstalling — an earlier version of this app did
exactly that, and it is why the design was changed). Say the word and I will make
the change; it touches `StoreKitPlugin.swift`, `storekit.js`, `entitlementLogic.js`
and the paywall copy. **Nothing below assumes you will.**

---

## How it works

**User journey**
1. Install → path locked, everything else free, ads on
2. Start the trial → card taken by Apple, **3 days** of path access, ads still on
3. Don't cancel → charged £3.99, path stays open, **ads off**
4. Cancel inside 3 days → nothing charged, path locks again

**What locks:** the eight path levels, and nothing else.

**What stays free, always:** mock test, quick quiz, chapter practice, mistakes
list, saved questions, study notes, flashcards, progress, booking and test-day
guidance. All of it with ads in the free tier.

Note that ads stay on *during* the trial. Only a converted, paid subscription
turns them off — that is deliberate, it gives the trial somewhere to improve to.

---

## Architecture

### The trial is Apple's, not ours

There is no trial clock in this codebase. No Firestore document, no device
timestamp, no `localStorage` key. StoreKit reports whether the current entitlement
is the introductory period or a real charge, and that is the whole source of
truth.

This matters because it is not farmable. Reinstalling, signing out of the app,
deleting the account, clearing storage, changing the device date — none of it
gives anyone a second trial, because none of it is where the trial lives. Apple
ties the introductory offer to the Apple ID.

### Entitlement states

Five, resolved in `src/entitlement.js`:

| State | Meaning | Path | Ads |
|---|---|---|---|
| `loading` | still resolving | open | off |
| `web` | not the native app | open | off |
| `free` | no subscription | **locked** | **on** |
| `trialing` | inside the 3-day trial | open | **on** |
| `paid` | trial converted to a charge | open | off |

The decisions themselves are in `src/entitlementLogic.js` — no imports, fully
unit-tested:

```js
export function stateFor(owned, trialing) {
  if (!owned) return "free";
  return trialing ? "trialing" : "paid";
}
export function pathOpenFor(state) { return state !== "free"; }
export function adsOnFor(state)    { return state === "free" || state === "trialing"; }
```

`loading` deliberately leaves the path open. Resolving hits the store, and gating
the app behind a spinner to save three seconds of path access is the worse trade.

### Purchases — StoreKit 2, no third-party SDK

`ios/App/App/StoreKitPlugin.swift` is a local Capacitor plugin. StoreKit 2 hands
back a `VerificationResult` that Apple has already checked cryptographically, so
there is no receipt to validate and therefore no receipt server to get wrong or
to pay for.

It listens to `Transaction.updates`, which is how the trial converting to a charge,
a renewal, an Ask to Buy approval, a purchase on another device, or a refund all
reach the app without the app asking.

Every method resolves. A store that cannot be reached reports "not owned" and the
app carries on in its free tier — it never strands anyone on a spinner.

### The owner account

`cccvhmd2001@gmail.com` is hard-coded in `src/entitlement.js` and always resolves
to `paid`, checked before StoreKit runs at all.

**If that is not an address you control, change it.** It is a permanent free
account that no purchase check can ever see.

### Ads — Google AdMob

- Banners on: home, study, progress, path, test-day
- Interstitials on navigation, throttled to one per 3 minutes
- **Never on a screen with a question on it**
- UMP consent form first (UK GDPR), then the ATT prompt, then `initialize()`

Currently on Google's official test units with `LIVE = false` in `src/ads/ads.js`.
Test units serve real-looking ads that pay nothing and cannot get an account
flagged.

---

## Step 1 — Paid Applications Agreement (do this first)

Nothing can be sold until this is signed, and it gates the other steps.

1. **appstoreconnect.apple.com → Business**
2. Sign the **Paid Applications Agreement**
3. Add **banking details** (a UK account for GBP payouts)
4. Complete **tax forms** — UK residents need the US W-8BEN, which is in the
   same flow

Status must read **Active**, not "Pending". Until it does, in-app purchases will
not load even in sandbox, and the paywall will show the product as unavailable.

This can take a few days if the bank details need verifying. Start it before
anything else.

---

## Step 2 — Create the subscription

**appstoreconnect.apple.com → Apps → Life in the UK: Test Prep → Monetization →
Subscriptions**

### 2a. Create the subscription group

Groups exist so people can move between tiers. You have one tier, but the group
is still required.

- **Reference Name:** `Path Access`

### 2b. Create the subscription

Inside that group, **＋**:

| Field | Value |
|---|---|
| Reference Name | `Path Annual` |
| Product ID | `com.kingofmadnes.lifeintheuk.path.annual` |

**Check the Product ID character by character.** It is `kingofmadnes` — one `s`,
not two. It must match `StoreKitPlugin.swift` exactly, it is case-sensitive, and
**it can never be changed or reused once created.** A typo here means creating a
second product and abandoning the first forever.

Then:

- **Subscription Duration:** 1 Year
- **Price:** £3.99 (GB) — set the UK price and let Apple generate the rest
- **Localization (English UK):**
  - Display Name: `Path Access`
  - Description: `Unlocks all eight path levels and removes ads. 3 days free, then £3.99 a year.`
- **Review Information:** a screenshot of the paywall screen

### 2c. Add the 3-day free trial

This is the part that matters, and it is a *separate* step from creating the
subscription. It is easy to miss and the subscription looks finished without it.

Still inside the subscription → **Subscription Prices → Introductory Offers → ＋**

| Field | Value |
|---|---|
| Countries | All (or at least United Kingdom) |
| Start Date | today |
| End Date | leave empty (runs indefinitely) |
| Type | **Free** |
| Duration | **3 Days** |

Save. The subscription should now show a "Free trial, 3 days" row under its price.

**If the Type dropdown offers you no "Free" option**, the Paid Applications
Agreement is not Active yet. Go back to Step 1.

### 2d. Review notes

Reviewers need to be able to reach the locked state, or they will reject for
"cannot locate the in-app purchase":

```
The eight-level Path is the only locked feature. Everything else in the app
is free.

To see the paywall: open the app, tap Path in the bottom navigation, and tap
any level. The subscription sheet appears with the 3-day free trial.

Restore Purchase is on that same screen and in Settings.

All other features (mock test, quick quiz, chapter practice, study notes,
flashcards, progress) are free and need no purchase.
```

---

## Step 3 — Check the trial is legitimate

You asked for this to be verified rather than assumed. Two different things are
worth confirming, and they are confirmed in different places.

### 3a. That a card is genuinely required

This is Apple's behaviour, not the app's, and it is not configurable — but you
should see it once with your own eyes.

1. **Users and Access → Sandbox → Test Accounts → ＋** — create a tester with an
   email address you control that has **never** been used as an Apple ID
2. On the iPhone: **Settings → Developer → Sandbox Apple Account** → sign in as
   that tester
3. Open the app, tap Path, tap a level
4. The sheet should read **"3 days free, then £3.99/year"**

In sandbox no real card is charged, so what you are checking is the *wording and
the flow*: Apple presents it as a subscription with a trial that converts, and
confirming requires an authenticated Apple ID. In production that Apple ID must
have a valid payment method on file or the purchase fails — which is exactly the
gate you wanted.

Sandbox runs on an accelerated clock: a 1-year subscription renews every hour,
and the 3-day trial passes in minutes. That is how you watch `trialing` become
`paid` without waiting three days.

### 3b. That the app enforces it

This is our code, and it is the part that could actually be wrong.

| Check | Expected |
|---|---|
| Fresh install, no purchase | Path locked, ads showing |
| Start trial | Path opens, **ads still showing** |
| Let the sandbox trial convert | Path open, **ads stop** |
| Cancel during trial | Path locks again |
| Delete app, reinstall, do not repurchase | Path still open if subscription live — the entitlement is on the Apple ID, not the device |
| Sign out of the Firebase account entirely | No change to path or ads — the subscription is not tied to it |
| Aeroplane mode, cold start | Free tier, no spinner, no crash |

That last row is the one people forget. The store being unreachable must degrade
to the free tier, not to a hang.

### 3c. The known problem you will hit first

`ios/App/LifeInTheUK.storekit` — the local sandbox config — **is stale.** It still
describes the old design: a £2.99 non-consumable called
`com.kingofmadnes.lifeintheuk.unlock`, with an empty subscription group.

The Swift code looks for `com.kingofmadnes.lifeintheuk.path.annual` as a
subscription, so **testing against that file will fail to find the product** and
the paywall will report it unavailable.

It needs replacing with a subscription group containing the annual product and its
3-day introductory offer. I have left it alone because you asked me not to change
anything else — say the word and it is a two-minute fix.

Note this only affects local Xcode testing with the StoreKit configuration file
selected in the scheme. Testing against a real sandbox tester account (3a above)
does not use this file and is unaffected.

---

## Step 4 — AdMob

Budget real time for this. The account setup is quick; **getting paid is not** —
address verification is a physical postcard, and that alone is 2–4 weeks. Start
it now even if the app is months from launch.

### 4a. Create the account

1. **admob.google.com** → sign in with a Google account
2. Country: **United Kingdom**, currency **GBP**, accept terms
3. Use an account you will keep. AdMob is tied to it permanently and cannot be
   transferred.

### 4b. Payments profile — start it immediately

**Payments → Settings**

- **Name and address must match your bank exactly.** Mismatches are the single
  most common reason payouts fail months later.
- **Tax info:** UK individuals complete a **W-8BEN**. You will need your
  National Insurance number or UTR. Getting this wrong means 30% US withholding
  on your earnings.
- **Address verification:** once earnings pass a threshold (about £7), Google
  posts a **PIN on a physical postcard** to that address. It takes 2–4 weeks to
  arrive, and you have to enter it before any payout. Three failed attempts and
  the process needs support intervention.
- **Payment threshold:** £60 (or local equivalent). Nothing is paid out below it;
  it just rolls over month to month.

### 4c. Register the app

**Apps → Add app**

- Platform: **iOS**
- "Is the app listed on a store?" — **No** for now; you can link it after release
- App name: `Life in the UK: Test Prep`

Copy the **App ID**. It looks like `ca-app-pub-1234567890123456~1234567890` and
**contains a tilde `~`**.

### 4d. Create the two ad units

**Apps → Life in the UK: Test Prep → Ad units → Add ad unit**

| Format | Name | Settings |
|---|---|---|
| **Banner** | `LITUK iOS banner` | defaults are fine |
| **Interstitial** | `LITUK iOS interstitial` | defaults are fine |

Copy both IDs. They look like `ca-app-pub-1234567890123456/9876543210` and
**contain a slash `/`**.

The tilde/slash distinction is the thing to get right: **App ID has a tilde, ad
unit IDs have a slash.** Putting an App ID where an ad unit ID belongs fails
silently with a blank space where the ad should be.

New ad units typically serve nothing for a few hours to a day. A blank banner
immediately after creating a unit is normal, not a bug.

### 4e. Put the IDs in the code

**`ios/App/App/Info.plist`** — find `GADApplicationIdentifier` and replace the
string under it with your **App ID** (the tilde one):

```xml
<key>GADApplicationIdentifier</key>
<string>ca-app-pub-1234567890123456~1234567890</string>
```

If this is missing or wrong, **the app crashes on launch.** Google's SDK asserts
on it deliberately.

**`src/ads/ads.js`** — two edits, around lines 31 and 38:

```javascript
const LIVE = true;                                       // was false

const REAL = {
  banner:       "ca-app-pub-1234567890123456/1111111111",
  interstitial: "ca-app-pub-1234567890123456/2222222222",
};
```

The file picks real units only when `LIVE` is true *and* `REAL.banner` is
non-empty, so a half-finished edit falls back to test units rather than breaking.

Then rebuild and re-sync:

```sh
npm run build && npx cap sync ios
```

### 4f. app-ads.txt

Once the app is on the App Store, create a file at the domain listed on your App
Store page — `https://yourdomain.com/app-ads.txt` — containing the line AdMob
gives you under **Apps → app-ads.txt**:

```
google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0
```

This is optional but costs nothing and meaningfully raises what advertisers will
pay, because it proves the inventory is genuinely yours.

### 4g. Register your own device as a test device

**Do this before you build with `LIVE = true`.**

Run the app once with live IDs and watch the Xcode console for:

```
<Google> To get test ads on this device, set: GADMobileAds.sharedInstance
         .requestConfiguration.testDeviceIdentifiers = @[ @"ABCDEF012345..." ]
```

Add that identifier in **AdMob → Settings → Test devices**.

### 4h. Never tap your own live ads

Not once, not "just to check it works". Google reads it as click fraud and the
penalty is permanent account suspension with all accrued earnings forfeited.
There is no appeal worth counting on.

This is what 4g is for: a registered test device serves ads that look real and are
safe to interact with.

---

## Gotchas

**Bundle ID.** `com.kingofmadnes.lifeintheuk` — one `s` in `madnes`. It has to
match across Xcode, App Store Connect and every product ID. It cannot be changed
after the first upload.

**In-app purchases need a build.** Products stay in "Waiting for Review" and will
not load in production until a build containing them has been submitted. Sandbox
works before that; production does not.

**The first submission carries a lot at once** — IAP, ads, ATT, UMP consent and a
privacy-label change all in one review. Expect a round trip, and answer the
privacy questionnaire carefully: you must declare identifier collection for
advertising, or it is rejected on a technicality.

**Ads before consent resolves** is what gets an AdMob account limited. Every entry
point in `ads.js` already waits on `ready()` — do not add one that does not.

---

## Where things stand

| | |
|---|---|
| Code | **Done.** Entitlement, StoreKit plugin, paywall, ads, consent, ATT. |
| Paid Applications Agreement | **Yours.** Step 1. |
| Subscription + 3-day trial | **Yours.** Step 2. |
| `LifeInTheUK.storekit` | **Stale** — see 3c. Ask and I'll fix it. |
| AdMob account, units, IDs | **Yours.** Step 4. |
| `OWNER_EMAIL` | **Check it** — see above. Not your address. |

For the wider picture of what was built and why, see `SESSION-NOTES.md`.
