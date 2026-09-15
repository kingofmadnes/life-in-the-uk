# Life in the UK: Test Prep — Monetisation Setup

**Status:** Built and running on your iPhone. Three console setups remain to turn on revenue.

**Commit:** `[refactored]` (feat: simplify to path-trial + free-with-ads, £3.99 unlock)

---

## How It Works

**User journey:**
1. Sign in → **24 hours of free path access** (trial), ads on everything
2. After 24 hours → **path locked, everything else free with ads**
3. Pay £3.99 → **path unlocked, ads off forever**

**What locks:** path levels only
**What stays free:** mock test, quick quiz, chapter practice, mistakes, saved questions, study notes, flashcards, progress, booking & test-day guidance (all with ads in free tier)

**Web:** Completely untouched — free, ad-free, no paywall, no trial. All of this is native-only.

---

## Architecture

### Trial Clock (Firestore)
- One document per account: `users/{uid}` with field `trialStartedAt`
- Written once on first sign-in, never updated (security rules forbid it)
- Cached locally in `localStorage` for offline resilience
- Deleting your account removes the document (fixed in `b399160`)

### Entitlements
- Four states: `loading | web | paid | free`
- Path trial tracked separately: 24h window per account in Firestore
- Pure logic in `src/entitlementLogic.js` (tested, 46 tests pass)
- React hook in `src/entitlement.js` with race-condition handling

### Purchases (StoreKit 2)
- Local Swift plugin: `ios/App/App/StoreKitPlugin.swift`
- Non-consumable: `com.kingofmadnes.lifeintheuk.unlock` at £3.99
- `ios/App/LifeInTheUK.storekit` config file for sandbox testing
- Direct StoreKit 2 — no third-party SDK, no receipt server

### Ads (Google AdMob)
- Banners on: home, study, progress, path, testday
- Interstitials on navigation (throttled: one every 3 minutes)
- Never on a screen with a question
- UMP consent form required first (UK GDPR), then ATT prompt
- Test units now (`ca-app-pub-3940256099942544/…`), swap for real ones later
- `src/ads/ads.js` declares `LIVE = false` and empty `REAL` object

---

## Three Setup Steps

### Step 1: Enable Firestore (5–10 minutes)
- **Console:** firebase.google.com
- Create database in `europe-west2` (London)
- Paste security rules (see below)
- Path trial clock will start recording immediately

**Security Rules:**
```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read: if request.auth != null && request.auth.uid == uid;
      allow create: if request.auth != null
                    && request.auth.uid == uid
                    && request.resource.data.keys().hasOnly(['pathTrialStartedAt'])
                    && request.resource.data.pathTrialStartedAt == request.time;
      allow update: if false;
      allow delete: if request.auth != null && request.auth.uid == uid;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**Test it:** Sign into the app on your phone, go to Firestore Data tab. Within seconds you should see `users/{your-account-id}` with `pathTrialStartedAt` timestamp.

---

### Step 2: Create the £3.99 IAP (10–15 minutes)
- **Console:** appstoreconnect.apple.com
- **Business section first** (see below — Paid Apps agreement, bank, tax)
- **Apps → Life in the UK: Test Prep → Monetization → In-App Purchases**
- Type: **Non-Consumable**
- Reference Name: `Unlock the path`
- Product ID: `com.kingofmadnes.lifeintheuk.unlock` (exact match, one "s" in "madnes")
- Price: £3.99 (UK)
- Display Name: `Unlock the path`
- Description: `Unlocks all eight path levels and removes ads from the entire app. One payment, not a subscription.`
- Review screenshot: any iPhone screenshot of the paywall screen
- Review notes: `New accounts get a 24-hour free trial of the path. After 24 hours the path locks. To see the locked state and this purchase, either use the sandbox tester account in App Review Information, or set the device date forward 24 hours. Restore purchase is in Settings and on the unlock screen.`

**Test with sandbox tester:** Create one in **Users and Access → Sandbox → Test Accounts**, then sign in at **Settings → Developer → Sandbox Apple Account** on the phone.

---

### Step 3: Make the Ads Pay (10–15 minutes)
- **Console:** admob.google.com
- Sign up, complete payments profile (this takes weeks for PIN verification — start now)
- **Apps → Add app → iOS → No, not listed → Name: `Life in the UK: Test Prep`**
- Copy the App ID (has a tilde: `ca-app-pub-…~…`)
- **Ad units → Banner:** `LITUK iOS banner` — copy the ID (has a slash)
- **Ad units → Interstitial:** `LITUK iOS interstitial` — copy the ID

**Then edit the code:**

In `ios/App/App/Info.plist`, find `GADApplicationIdentifier` and replace the value below it with your App ID.

In `src/ads/ads.js` (lines 31 and 38–41):
```javascript
const LIVE = true;  // line 31

const REAL = {      // lines 38–41
  banner: "ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX",
  interstitial: "ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX",
};
```

**Never tap your own live ads.** Not once. Google reads it as click fraud and suspends permanently with earnings forfeited.

---

## What You Can Reuse (Your Existing App)

You already have:
- **Team:** `CA566K4T2P` (Mohamed fares Rebah) — same team, same certificate
- **Paid Apps agreement:** Active
- **Bank account:** Already on file
- **Tax forms:** Already filed

**New work only:**
1. Register the explicit bundle ID `com.kingofmadnes.lifeintheuk` in developer.apple.com (Certificates, IDs & Profiles → Identifiers → + → App IDs → Explicit → enable In-App Purchase)
2. Create the app record in App Store Connect
3. Create the £3.99 IAP

Everything else is reused.

---

## Code Files

### New Files
- `src/entitlementLogic.js` — pure free/paid + path trial decision logic
- `src/entitlementLogic.test.js` — 15 tests covering boundaries and fail-open
- `src/entitlement.js` — React hook, Firestore reads, StoreKit integration
- `src/storekit.js` — StoreKit 2 bridge to the Swift plugin
- `src/paywall/Paywall.jsx` — the £3.99 unlock screen
- `src/ads/ads.js` — AdMob init, banner, interstitial, consent/ATT
- `src/ads/AdBanner.jsx` — renders nothing, manages the native banner
- `ios/App/App/StoreKitPlugin.swift` — local Capacitor plugin, ~150 lines

### Modified Files
- `src/LifeInTheUK.jsx` — imports entitlement, gating at `go()` and `startLevel()`, paywall render, ad banner render, Settings Purchase section
- `src/firebase.js` — lazy Firestore import, `getDb()` function
- `src/auth/AuthGate.jsx` — calls `forgetPathTrial(uid)` on account deletion
- `src/auth/auth.css` — account button and paywall positioned above the banner
- `public/privacy.html` — rewritten to disclose Firestore, AdMob, ATT, UMP
- `ios/App/App/Info.plist` — `GADApplicationIdentifier`, `SKAdNetworkItems`, `NSUserTrackingUsageDescription`
- `ios/App/App.xcodeproj/project.pbxproj` — StoreKitPlugin.swift added to build
- `package.json` — `@capacitor-community/admob@8.1.0` added

---

## Testing Checklist

Before you submit:
- [ ] New account shows ads but path is open
- [ ] A `users` document appeared in Firestore with `pathTrialStartedAt`
- [ ] Reinstalling the app does NOT restart the path trial
- [ ] Device clock set 24h forward shows paywall and path locked
- [ ] Sandbox purchase unlocks path and kills ads
- [ ] Restore Purchase works on a fresh install
- [ ] No ad appears on any question screen
- [ ] Ads appear on home, study, progress, testday screens
- [ ] Website still has no ads, no paywall
- [ ] App Privacy answers: Identifiers + Usage Data, tracking **Yes**
- [ ] Paid Apps agreement shows **Active**
- [ ] Sandbox tester credentials in App Review Information

---

## Step-by-Step Interactive Guide

Full guide with click-to-copy values and a checklist:
**https://claude.ai/code/artifact/49fdef74-43de-4477-8e4e-30a7c48ac193**

---

## Key Gotchas

### Bundle ID Registration
- Product ID must be `com.kingofmadnes.lifeintheuk.unlock` — exactly one "s" in "madnes"
- It is **permanent** once saved
- The bundle ID must be registered as **Explicit** (not wildcard) to support IAP
- Only one team can own a bundle ID

### Firestore Rules
- `allow update: if false` is the whole point — without it anyone resets their trial
- Must be deployed to Firestore, not just drafted in the editor
- Test by signing in and checking the Data tab within 5 seconds

### Ads
- Google test units are safe to ship and pay nothing
- Swap them for real ones with `LIVE = true` and the real unit IDs
- **Never tap your own live ads** — click fraud suspension is permanent
- Start the AdMob payments profile now; PIN verification takes weeks

### App Store Review
- First submission with IAP, ads, ATT and consent all at once raises rejection odds
- Budget for a possible round-trip
- Provide a sandbox tester account or tell them to set the device clock forward 24h

---

## Commits in This Session

- `3bf3ddd` — feat: 24-hour trial, ads after it, £2.99 to unlock the quiz
- `b399160` — fix: actually delete the trial record when an account is deleted

---

## What Happens Now

1. You enable Firestore and deploy the rules → trial clock starts recording
2. You register the explicit App ID and create the app record → in-app purchases become possible
3. You create the £2.99 IAP → reviewers can see what you built
4. You create AdMob ad units and swap the IDs → ads start paying
5. You rebuild, re-sync iOS, and submit → the App Store reviews everything together

Each step gates the next, but they can all be done in a few hours once you have the three console accounts open.

---

## Questions?

- Guide URL: https://claude.ai/code/artifact/49fdef74-43de-4477-8e4e-30a7c48ac193
- All files in this repo; tests pass (`npm test`); builds succeed (`npm run build` + `npx cap sync ios`)
- Once you have your three AdMob IDs, I can rebuild and re-sync for you
