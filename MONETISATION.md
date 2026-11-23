# Life in the UK: Test Prep — Monetisation Setup

What is built, and the console work still left to you. Rewritten 16 October 2026
to match the code that ships: one non-consumable unlock, no subscription, no trial.
The earlier version sold a yearly subscription with a 3-day trial; that was replaced
and the trial went with it.

The web app is untouched by all of this: free, ad-free, no paywall.
Everything below is native iOS only.

---

## What is sold

| | |
|---|---|
| Product ID | `com.kingofmadnes.lifeintheuk.unlock` |
| Reference name | `Path Unlock` |
| Type | Non-Consumable — bought once, kept for good |
| Price | £3.99 (GB). Other territories: let Apple generate them |
| Unlocks | All eight path levels, and removes ads |

**Check the Product ID character by character.** It is `kingofmadnes`, one `s`.
It can never be changed or reused once created.

**Do not create `com.kingofmadnes.lifeintheuk.path.annual`.** That was the old
subscription. Nothing in the code refers to it any more.

Why a non-consumable and not a subscription: a free trial that takes a card up front
only exists as an introductory offer on an auto-renewable subscription. The unlock
has no trial, so the paywall offers none.

---

## How it works

**Free:** the path is locked, ads are on. Everything else (mock tests, quick quiz,
chapter practice, mistakes, saved questions, notes, flashcards, progress) is free
forever, with ads.

**Paid:** the path is open, ads are off. Permanent, tied to the Apple ID.

### Persistence and restore

`Transaction.currentEntitlements` is read on every launch and every return to the
app. Nothing about the unlock is stored by the app or in Firebase, so reinstalling,
signing out, or deleting the account does not lose it. A purchase made on another
device appears the next time the app comes to the front.

Settings → Restore purchase calls `AppStore.sync()`, which asks for the Apple ID
password. It is for a new device or a wiped one; ordinary launches do not need it.

### Entitlement states

| State | Path | Ads |
|---|---|---|
| `loading` | open | off |
| `web` | open | off |
| `free` | **locked** | **on** |
| `paid` | open | off |

Resolved in `entitlement.js`; the decision itself is `stateFor()` in
`entitlementLogic.js`, tested by `entitlementLogic.test.js`.

`cccvhmd2001@gmail.com` is hard-coded as the owner and always resolves to `paid`,
checked before StoreKit runs. Confirmed as the owner's own address.

### Purchases — StoreKit 2, no third-party SDK

`ios/App/App/StoreKitPlugin.swift` is a local Capacitor plugin. `StoreKit 2` is used
because `Transaction` arrives already verified by Apple, so there is no receipt to
validate. It listens to `Transaction.updates` so a purchase made elsewhere, an Ask to
Buy approval, or a refund is picked up without a restart.

### Ads — Google AdMob

Order of operations, and it is not optional: UMP consent form (UK GDPR) → App Tracking
Transparency → `initialize()` → ads. ATT is asked in `src/ads/ads.js` by
`trackingAllowed()`, through the AdMob plugin's `trackingAuthorizationStatus()` and
`requestTrackingAuthorization()`. Only an answer of `authorized` allows personalised
ads: every banner and interstitial request otherwise carries `npa: true`. Nothing
requests an ad before the ATT answer is in.

---

## Step 1 — Paid Applications Agreement (do this first)

App Store Connect → Business. Sign it, add UK banking, complete the W-8BEN. It must
read **Active**. In-app purchases will not load, even in sandbox, until it does.

---

## Step 2 — Create the unlock

1. My Apps → Life in the UK → **In-App Purchases** → **+** → **Non-Consumable**.
2. Reference Name `Path Unlock`. Product ID `com.kingofmadnes.lifeintheuk.unlock`.
3. Price £3.99 (GB). Let Apple generate the other territories.
4. Localisation, English (U.K.):
   - Display Name: `Path Unlock`
   - Description: `Unlocks all eight path levels and removes ads. One payment, yours to keep.`
5. Review screenshot: the paywall.
6. Review notes: "One-time non-consumable unlock. Restore is in Settings → Restore purchase."

The product stays in *Waiting for Review* until a build containing it is submitted.

---

## Step 3 — Check it locally

`ios/App/LifeInTheUK.storekit` holds the product for local testing: one non-consumable,
`com.kingofmadnes.lifeintheuk.unlock`, £3.99, storefront GBR.

It only applies when the app is run from Xcode. An app installed with `devicectl`
talks to the real store and ignores it.

Run from Xcode with the `LifeInTheUK.storekit` configuration selected, then use
**Debug → StoreKit → Manage Transactions** to approve, decline, or refund. Check:

| Action | Expect |
|---|---|
| Buy | Path opens, ads stop |
| Quit and relaunch | Path still open |
| Refund the purchase in Manage Transactions | Path locks again |
| Settings → Restore purchase, after clearing transactions | Path opens if the Apple ID owns it |
| Delete the app, reinstall | Path still open if the Apple ID owns it |
| Sign out of the Firebase account | No change — the unlock is not tied to it |

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
| Non-Consumable unlock, £3.99 | **Yours.** Step 2. |
| `LifeInTheUK.storekit` | **Done.** Matches the code — see Step 3. |
| AdMob account, units, IDs | **Done.** Real IDs in Release builds, test units in Debug. |
| `OWNER_EMAIL` | **Confirmed yours.** Leave as is. |

For the wider picture of what was built and why, see `SESSION-NOTES.md`.
