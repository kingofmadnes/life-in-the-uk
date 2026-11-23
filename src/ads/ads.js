/* ============================================================
   ADS

   Native app only — the web build has no ads at all. Consent and the
   tracking prompt run for everyone on launch (see native.js and
   requestTracking below); the SDK itself, and every ad, are only
   reached in the free tier. See entitlement.js.

   Order of operations on iOS matters and is not optional:

     1. UMP consent form  (UK GDPR — our audience is UK residents)
     2. App Tracking Transparency prompt
     3. initialize(), and only then request an ad

   Asking for an ad before consent resolves is what gets an AdMob
   account limited, so every entry point below waits on ready().
   ============================================================ */

import { Capacitor } from "@capacitor/core";

const isNative = Capacitor.isNativePlatform();

/* ─────────────  AD UNIT IDS  ─────────────
   Release builds serve the real units below; Debug builds serve
   Google's official test units, which pay nothing and cannot get the
   account flagged. Capacitor.DEBUG comes from CAPACITOR_DEBUG, which
   ios/debug.xcconfig sets for the Debug configuration only, so an
   Archive (Release) is always live and an Xcode run is always test.

   The app id that goes with the real units is in
   ios/App/App/Info.plist under GADApplicationIdentifier; keep the
   three in step. Never tap a live ad on your own device. */
const LIVE = !Capacitor.DEBUG;

const TEST = {
  banner: "ca-app-pub-3940256099942544/2934735716",
  interstitial: "ca-app-pub-3940256099942544/4411468910",
};

const REAL = {
  banner: "ca-app-pub-3527173535512943/7972536850",
  interstitial: "ca-app-pub-3527173535512943/5269070634",
};

const UNITS = LIVE && REAL.banner ? REAL : TEST;
const isTesting = !LIVE;
/* ───────────────────────────────────────── */

// At most one interstitial this often. Untuned interstitials are the
// quickest route to a one-star review, and a study app is used in
// short bursts where an unskippable full-screen ad is worst.
const INTERSTITIAL_GAP_MS = 3 * 60 * 1000;

let plugin = null;
let consentPromise = null;
let readyPromise = null;
let lastInterstitial = Date.now(); // start the clock now, not at zero —
                                   // nobody should meet an ad on tap one
let interstitialLoaded = false;

// Whether the person let us use the advertising identifier. Set once
// ready() has the App Tracking Transparency answer; false until then,
// so anything that runs early gets non-personalised ads, never the
// identifier by accident.
let personalised = false;

async function load() {
  if (plugin) return plugin;
  const mod = await import("@capacitor-community/admob");
  plugin = mod;
  return plugin;
}

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

/* iOS drops a tracking request made while the app is not active — still
   launching, or while a consent form is being dismissed — and leaves the
   status "notDetermined" without showing anything. That is how a
   reviewer ends up never seeing the prompt. So wait until UIKit reports
   the app active, give it a moment to settle, and if the status is still
   undecided after asking, ask once more. */
async function whenActive() {
  const { App } = await import("@capacitor/app");
  const { isActive } = await App.getState();
  if (isActive) return;
  await new Promise((res) => {
    const handle = App.addListener("appStateChange", ({ isActive: now }) => {
      if (!now) return;
      handle.then((h) => h.remove());
      res();
    });
  });
}

/**
 * Ask App Tracking Transparency, if the system has not already been
 * answered. The prompt can only be shown once per install — after
 * that iOS returns the stored answer, so asking again is a no-op.
 * Resolves true only for "authorized".
 */
async function trackingAllowed(AdMob) {
  let { status } = await AdMob.trackingAuthorizationStatus();
  for (let attempt = 0; status === "notDetermined" && attempt < 2; attempt++) {
    await whenActive();
    await wait(attempt === 0 ? 500 : 1000);
    await AdMob.requestTrackingAuthorization(); // the system prompt
    ({ status } = await AdMob.trackingAuthorizationStatus());
  }
  return status === "authorized";
}

/**
 * Consent and the tracking prompt, done once — and never the SDK.
 * Run on launch from native.js, ahead of the login screen, so the
 * prompt is the first thing a new install sees, on iPhone and iPad
 * alike, whatever the account or tier turns out to be.
 */
function consentAndTracking() {
  if (!isNative) return Promise.resolve();
  if (consentPromise) return consentPromise;

  consentPromise = (async () => {
    const { AdMob, AdmobConsentStatus } = await load();

    // 1. UMP. The form is only shown when Google says one is
    //    required for this person's region.
    try {
      const info = await AdMob.requestConsentInfo();
      if (
        info.isConsentFormAvailable &&
        info.status === AdmobConsentStatus.REQUIRED
      ) {
        await AdMob.showConsentForm();
      }
    } catch {
      // No form, no network, or the person dismissed it. Carry on
      // with non-personalised ads rather than losing the tier.
    }

    // 2. ATT. A failure or an unanswered prompt leaves `personalised`
    //    false, so ads still load — just not targeted.
    try {
      personalised = await trackingAllowed(AdMob);
    } catch {
      personalised = false;
    }
  })();

  return consentPromise;
}

/**
 * Consent, tracking permission and SDK start-up, done once.
 * Resolves to false if any of it failed — callers then quietly do
 * nothing rather than showing a broken frame.
 */
function ready() {
  if (!isNative) return Promise.resolve(false);
  if (readyPromise) return readyPromise;

  readyPromise = (async () => {
    try {
      await consentAndTracking();

      // 3. Start the SDK, only once consent and ATT are answered.
      const { AdMob } = await load();
      await AdMob.initialize({ initializeForTesting: isTesting });

      return true;
    } catch {
      readyPromise = null; // let a later screen try again
      return false;
    }
  })();

  return readyPromise;
}

/**
 * Run consent and the App Tracking Transparency prompt now, without
 * starting the SDK. Called on launch so the prompt appears before any
 * ad, sign-in or tracking can happen.
 */
export function requestTracking() {
  return consentAndTracking();
}

/** Banner along the bottom. Resolves to the height in px, or 0. */
export async function showBanner() {
  if (!(await ready())) return 0;
  try {
    const { AdMob, BannerAdSize, BannerAdPosition } = await load();
    await AdMob.showBanner({
      adId: UNITS.banner,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting,
      npa: !personalised,
    });
    return 1; // real height arrives on the bannerAdSizeChanged event
  } catch {
    return 0;
  }
}

export async function hideBanner() {
  if (!isNative || !plugin) return;
  try {
    await plugin.AdMob.hideBanner();
  } catch {
    /* nothing to hide */
  }
}

/**
 * Subscribe to the banner's measured height so the app can keep its
 * bottom navigation clear of it. Returns an unsubscribe function.
 */
export async function onBannerSize(cb) {
  if (!isNative) return () => {};
  try {
    const { AdMob, BannerAdPluginEvents } = await load();
    const handle = await AdMob.addListener(
      BannerAdPluginEvents.SizeChanged,
      (size) => cb((size && size.height) || 0),
    );
    return () => { try { handle.remove(); } catch { /* already gone */ } };
  } catch {
    return () => {};
  }
}

/**
 * Show a full-screen ad, but only if one is loaded and enough time
 * has passed. Silent no-op otherwise — the caller navigates either
 * way and never waits on this.
 */
export async function maybeInterstitial() {
  if (!isNative) return;
  if (Date.now() - lastInterstitial < INTERSTITIAL_GAP_MS) {
    // Too soon. Use the quiet moment to load the next one instead.
    prepareInterstitial();
    return;
  }
  if (!interstitialLoaded) {
    prepareInterstitial();
    return;
  }

  try {
    const { AdMob } = await load();
    interstitialLoaded = false;
    lastInterstitial = Date.now();
    await AdMob.showInterstitial();
    prepareInterstitial(); // have the next one ready
  } catch {
    interstitialLoaded = false;
  }
}

/** Fetch an interstitial in the background so the next one is instant. */
export async function prepareInterstitial() {
  if (!isNative || interstitialLoaded) return;
  if (!(await ready())) return;
  try {
    const { AdMob } = await load();
    await AdMob.prepareInterstitial({
      adId: UNITS.interstitial,
      isTesting,
      npa: !personalised,
    });
    interstitialLoaded = true;
  } catch {
    interstitialLoaded = false;
  }
}
