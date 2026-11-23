# Handover — Life in the UK: Test Prep (iOS)

Updated 2026-11-23. Bundle ID `com.kingofmadnes.lifeintheuk`. Capacitor 8 app,
Xcode project at `ios/App/App.xcodeproj` (SPM, no workspace).

---

## 1. App Store status and rejection reasons

- [x] **Rejected: version 1.0 (build 1) under Guideline 2.1(b)**, covering the
      in-app purchase and App Tracking Transparency. Per the owner, Apple also
      flagged **"references to subscriptions"** and could not find the ATT prompt
      on iPad. App Store Connect side is done (owner, 2026-11-23).
- [x] **History:** around 2026-10-16 the app was moved from a yearly
      auto-renewable subscription with a 3-day free trial
      (`com.kingofmadnes.lifeintheuk.path.annual`) to a single non-consumable,
      following App Store feedback. The leftover subscription wording dates from
      that model. Apple's exact text from that round was not saved either.
- [ ] **Paste Apple's full wording here** from App Store Connect → the app →
      **App Review**, so the reply can answer it point by point.

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
- [x] **Real AdMob IDs in Release builds only.** `LIVE` follows the build: an
      Xcode run (Debug) serves Google's test units, an Archive (Release) serves the
      real ones. Verified from the built Info.plists (`CAPACITOR_DEBUG` is `true`
      in Debug, empty in Release). App ID
      `ca-app-pub-3527173535512943~9103327684` in `Info.plist`; banner
      `…/7972536850` and interstitial `…/5269070634` in `src/ads/ads.js`.
- [x] **`SESSION-NOTES.md` refreshed** to the one-time unlock.

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
- [ ] **Review notes:** a one-time non-consumable; the ATT prompt appears on
      first launch over the login screen on iPhone and iPad; Restore
      is in Settings → Restore purchase; unofficial, not affiliated with the Home
      Office; guest mode works without an account. Reply to the rejection in
      App Review saying the subscription references were removed.
- [ ] **Support URL and privacy policy URL** point at the published pages
      (redeploy the web build so the reworded support page is live).
- [ ] **Archive** build 2 in Xcode → upload → select it on the version → submit.

### AdMob / ATT
- [x] **App registered in AdMob** with a Banner and an Interstitial unit.
- [x] **ATT moved to launch (Apple could not find it on iPad).** It used to wait
      until after sign-in and the free-tier check. Now `native.js` runs consent
      and the ATT prompt straight after the splash, before the login screen; the
      request waits until UIKit reports the app active (`@capacitor/app`) and
      retries once if iOS drops it. The Google Mobile Ads SDK only starts afterwards, in `ready()`.
- [x] **Verified on a fresh install, iOS 26.3 simulators:** with the app
      uninstalled and permissions reset, the ATT prompt appears by itself over
      the login screen on iPhone 17 Pro, iPhone 17 Pro Max and iPad Air 11", with no ad or SDK
      requests made before it (only the UMP consent check).
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
- [ ] **Store listing, screenshots and privacy labels:** checked for subscription
      wording and complete? Not visible from the repo.
