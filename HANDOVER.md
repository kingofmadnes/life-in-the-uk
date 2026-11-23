# Handover — Life in the UK: Test Prep (iOS)

Updated 2026-11-23. Bundle ID `com.kingofmadnes.lifeintheuk`. Capacitor 8 app,
Xcode project at `ios/App/App.xcodeproj` (SPM, no workspace).

---

## 1. App Store status and rejection reasons

- [x] **Rejected.** Per the owner, Apple flagged **"references to subscriptions"**
      in the app. The app sells a one-time non-consumable, so any subscription
      wording is wrong for it.
- [x] **History:** around 2026-10-16 the app was moved from a yearly
      auto-renewable subscription with a 3-day free trial
      (`com.kingofmadnes.lifeintheuk.path.annual`) to a single non-consumable,
      following App Store feedback. The leftover subscription wording dates from
      that model. Apple's exact text from that round was not saved either.
- [ ] **Paste Apple's exact message here** (guideline number and wording) from
      App Store Connect → the app → **App Review**. Only the owner's summary is
      recorded, so other points in that message may be missing below.

---

## 2. Already fixed

- [x] **Subscription wording removed.** The paywall's lead line and price line
      said "No subscription, nothing renews" in all 15 languages; each now keeps
      only its first, already-reviewed sentence ("Pay once to unlock the path and
      remove ads." / "One payment of {p}."). The support page FAQ ("Is there a
      subscription?", "Is there a free trial?") and the marketing page line were
      reworded too. No subscription, trial or renewal wording is left in the app
      or on the public pages.
- [x] **Product ID matches App Store Connect:** `com.kingofmadnes.lifeintheuk.unlock`
      (the IAP already exists there and is permanent), in the JS bridge, the
      Swift plugin, `LifeInTheUK.storekit`, `MONETISATION.md`, `PROJECT.md` and
      the README.
- [x] **StoreKit plugin was never registered.** Every purchase call failed with
      "StoreKit plugin is not implemented on ios", so the paywall never showed a
      price. `SceneDelegate.swift` now creates `StoreKitViewController`, which
      registers the plugin at launch.
- [x] **Local StoreKit test file was never loaded.** The scheme's path to
      `LifeInTheUK.storekit` was wrong. It is now correct, and the file is listed
      in the Xcode project (outside any target).
- [x] **Paywall no longer goes blank.** It shows the App Store's localised price
      once the product loads, or "Price unavailable, please try again later." with
      a **Try again** button. Both new strings are translated into all 15 languages.
- [x] **Purchase outcomes handled:** success unlocks, cancel says nothing,
      failure and pending (Ask to Buy) each show a message.
- [x] **Unlock survives relaunch:** StoreKit entitlements are read on every
      launch; Settings has its own Restore purchase button.
- [x] **Build number bumped to 2.**
- [x] **Verified in the simulator, run from Xcode:** the price loads and the
      StoreKit sheet shows "Path Unlock, £3.99, one-time charge". (Checked with
      the previous product ID; the ID change itself is a string swap.)
- [ ] **Not yet verified:** completing the test purchase, relaunching, and
      Restore, with the new product ID.

All 109 tests, the web build, the iOS build and `npx cap sync ios` pass.

---

## 3. Still left before resubmitting

### Code (can be done in a session)
- [ ] **Real AdMob IDs.** The app still uses Google's public *test* IDs (app ID
      in `ios/App/App/Info.plist`, both ad units in `src/ads/ads.js`,
      `LIVE = false`). Shipping test ads is not acceptable. Needs the three real
      IDs, or a decision to ship this release with ads off.
- [ ] **Refresh `SESSION-NOTES.md`**, which still describes the old yearly
      subscription. It is an internal note, not shipped, but it misleads.

### App Store Connect (owner only)
- [ ] **Check the store listing for subscription wording too:** description,
      promotional text, keywords, "What's New", and the IAP's own display name
      and description. The rejection may have come from metadata, not only the app.
- [ ] **Paid Applications Agreement** shows **Active**.
- [x] **In-app purchase exists:** `com.kingofmadnes.lifeintheuk.unlock`.
      Confirm it is a **Non-Consumable**, £3.99, with a paywall screenshot for review.
- [ ] **Attach the IAP to the app version** (In-App Purchases section). A first
      IAP must be submitted together with a build.
- [ ] **App Privacy labels** cover: email address (account), purchases, device
      identifier for advertising, and usage/advertising data from AdMob.
- [ ] **Screenshots:** none may show the old subscription paywall. Required for
      iPhone 6.9" and iPad 13".
- [ ] **Review notes:** a one-time non-consumable with no subscription; Restore
      is in Settings → Restore purchase; unofficial, not affiliated with the Home
      Office; guest mode works without an account. Reply to the rejection in
      App Review saying the subscription references were removed.
- [ ] **Support URL and privacy policy URL** point at the published pages
      (redeploy the web build so the reworded support page is live).
- [ ] **Archive** build 2 in Xcode → upload → select it on the version → submit.

### AdMob / ATT
- [ ] **Register the app in AdMob** (account exists; only "MOdelivr" was listed
      on 2026-10-28) and create a Banner and an Interstitial unit. Send the three
      IDs to wire in.
- [x] **ATT before AdMob, in code:** `ads.js` runs consent, then the ATT prompt,
      then `AdMob.initialize()`; the native plugin only starts the Google SDK
      inside `initialize()`. The prompt is triggered once the app knows the user
      is on the free tier (after login or "Continue without an account").
- [ ] **ATT on a fresh install, iOS 26.3 iPhone and iPad simulators:** fresh
      build 2 installed with permissions reset; the login screen shows no prompt
      and no AdMob start, as expected. Waiting on someone to tap "Continue
      without an account" so the log order can be confirmed.
- [ ] **ATT on iOS 27 (iPhone and iPad): not tested.** This Mac only has Xcode
      26.3 (iOS 26.2 SDK, iOS 26.3 simulators). Needs Xcode 27 or a real device
      on iOS 27.
- [ ] **app-ads.txt** and **linking the store listing in AdMob** after launch.

---

## 4. Version and build

- Version **1.0** (`MARKETING_VERSION`)
- Build **2** (`CURRENT_PROJECT_VERSION`)

---

## 5. Blockers and open questions

- [ ] **Apple's exact rejection text** — only "references to subscriptions" is known.
- [ ] **iOS 27 testing** needs Xcode 27 or an iOS 27 device.
- [ ] **AdMob:** real IDs, or ship this release with ads off?
- [ ] **Store listing, screenshots and privacy labels:** checked for subscription
      wording and complete? Not visible from the repo.
