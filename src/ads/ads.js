/* ============================================================
   ADS

   Only ever reached in the free tier of the native app — the web
   build has no ads at all, and neither does the trial or a paid
   unlock. See entitlement.js; this file assumes that decision has
   already been made by the time it is called.

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
   Google's official test units. They serve real-looking ads that
   pay nothing and cannot get the account flagged, which is what we
   want until the AdMob account exists.

   TO GO LIVE: replace these three with the real ids from the AdMob
   console, and set LIVE to true. The app id also has to be set in
   ios/App/App/Info.plist under GADApplicationIdentifier. */
const LIVE = false;

const TEST = {
  banner: "ca-app-pub-3940256099942544/2934735716",
  interstitial: "ca-app-pub-3940256099942544/4411468910",
};

const REAL = {
  banner: "",        // ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
  interstitial: "",  // ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
};

const UNITS = LIVE && REAL.banner ? REAL : TEST;
const isTesting = !LIVE;
/* ───────────────────────────────────────── */

// At most one interstitial this often. Untuned interstitials are the
// quickest route to a one-star review, and a study app is used in
// short bursts where an unskippable full-screen ad is worst.
const INTERSTITIAL_GAP_MS = 3 * 60 * 1000;

let plugin = null;
let readyPromise = null;
let lastInterstitial = Date.now(); // start the clock now, not at zero —
                                   // nobody should meet an ad on tap one
let interstitialLoaded = false;

async function load() {
  if (plugin) return plugin;
  const mod = await import("@capacitor-community/admob");
  plugin = mod;
  return plugin;
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

      // 2. ATT. initialize() raises the system prompt for us; asking
      //    twice is what causes the prompt to never appear.
      await AdMob.initialize({
        requestTrackingAuthorization: true,
        initializeForTesting: isTesting,
      });

      return true;
    } catch {
      readyPromise = null; // let a later screen try again
      return false;
    }
  })();

  return readyPromise;
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
    await AdMob.prepareInterstitial({ adId: UNITS.interstitial, isTesting });
    interstitialLoaded = true;
  } catch {
    interstitialLoaded = false;
  }
}
