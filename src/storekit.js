/* ============================================================
   STOREKIT BRIDGE

   Thin JS side of the local Swift plugin in
   ios/App/App/StoreKitPlugin.swift. One auto-renewable subscription:
   a 3-day free trial that requires a payment method up front, and —
   unless cancelled inside those 3 days — converts to one charge of
   £3.99 for a year of the path with no ads.

   A card-gated free trial only exists on a subscription in Apple's
   system; there is no such thing on a one-time purchase. The yearly
   period is what keeps the recurring part of "auto-renewable" as
   distant as StoreKit allows — the disclosure text still has to say
   it renews, because it does, but the next charge is a year away
   rather than a month.

   Every method resolves rather than throws: a study app should never
   lose a screen because the store was unreachable. The caller decides
   what an unresolved read means — see entitlement.js, which treats
   "don't know" as "not owned" only once it has something better to
   go on.
   ============================================================ */

import { registerPlugin, Capacitor } from "@capacitor/core";

export const PRODUCT_ID = "com.kingofmadnes.lifeintheuk.path.annual";

const isNative = Capacitor.isNativePlatform();

// Registering is cheap and side-effect free off-device; the guards
// below are what actually keep the web build away from StoreKit.
const StoreKit = registerPlugin("StoreKit");

/* StoreKit can leave a call unanswered rather than failing it: a build
   whose product does not exist in App Store Connect yet, no store
   connection, a device part-way through signing in.

   A try/catch is no help against a promise that never settles, and
   entitlement.js awaits status() before it can resolve anything at
   all — so one unanswered call would freeze the whole app on
   "loading", which shows no ads, gates nothing and hides the buy
   button. The failure looks exactly like the feature was never built.

   Cap the wait and read silence as "not owned": the free tier is the
   safe way to be wrong, and refresh() re-asks after a purchase. */
function withTimeout(promise, ms, fallback) {
  let timer;
  const clock = new Promise((res) => {
    timer = setTimeout(() => res(fallback), ms);
  });
  return Promise.race([promise, clock]).finally(() => clearTimeout(timer));
}

const STORE_TIMEOUT_MS = 4000;

const NONE = { owned: false, trialing: false };

/**
 * Does this Apple ID have a live entitlement, and is it currently the
 * free trial or a converted, paid period?
 *   { owned: false, trialing: false }  no subscription at all
 *   { owned: true,  trialing: true  }  inside the 3-day free trial
 *   { owned: true,  trialing: false }  paid; ads off
 */
export async function status() {
  if (!isNative) return NONE;
  try {
    const res = await withTimeout(StoreKit.entitlement(), STORE_TIMEOUT_MS, null);
    if (!res) return NONE;
    return { owned: Boolean(res.owned), trialing: Boolean(res.trialing) };
  } catch {
    return NONE;
  }
}

/**
 * The product as the App Store describes it right now — localised
 * title and a renewal price string already in the viewer's currency,
 * plus whether this Apple ID still qualifies for the free trial and
 * how long it is. Resolves to null if the store didn't answer.
 */
export async function product() {
  if (!isNative) return null;
  try {
    const p = await withTimeout(StoreKit.product(), STORE_TIMEOUT_MS, null);
    return p && p.id ? p : null;
  } catch {
    return null;
  }
}

/**
 * Buy — starts the free trial if this Apple ID is still eligible for
 * one, otherwise charges the renewal price immediately. Resolves to
 * one of:
 *   "owned"     — trial started, or purchased outright, or already owned
 *   "cancelled" — the person backed out
 *   "pending"   — Ask to Buy / SCA, Apple will finish it later
 *   "failed"    — anything else
 */
export async function purchase() {
  if (!isNative) return "failed";
  try {
    const { result } = await StoreKit.purchase({ id: PRODUCT_ID });
    return result || "failed";
  } catch (e) {
    // A cancel arrives as a rejected call on some iOS versions.
    const msg = String((e && e.message) || "");
    return /cancel/i.test(msg) ? "cancelled" : "failed";
  }
}

/** Restore. Apple requires this path on any subscription. */
export async function restore() {
  if (!isNative) return NONE;
  try {
    const res = await StoreKit.restore();
    return { owned: Boolean(res && res.owned), trialing: Boolean(res && res.trialing) };
  } catch {
    return NONE;
  }
}

/**
 * Opens Apple's native "Manage Subscription" sheet — the built-in way
 * to cancel during the trial or afterwards. Apple requires this to be
 * reachable from inside the app on any auto-renewable subscription.
 */
export async function manage() {
  if (!isNative) return;
  try {
    await StoreKit.manage();
  } catch {
    /* Best effort — nothing sensible to show if the sheet won't open. */
  }
}
