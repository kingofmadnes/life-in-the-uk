/* ============================================================
   STOREKIT BRIDGE

   Thin JS side of the local Swift plugin in
   ios/App/App/StoreKitPlugin.swift. One non-consumable product
   unlocks the quiz and turns the ads off for good.

   Every method resolves rather than throws: a study app should
   never lose a screen because the store was unreachable. The
   caller decides what an unresolved purchase means — see
   entitlement.js, which treats "don't know" as "not paid" only
   once it has something better to go on.
   ============================================================ */

import { registerPlugin, Capacitor } from "@capacitor/core";

export const PRODUCT_ID = "com.kingofmadnes.lifeintheuk.unlock";

const isNative = Capacitor.isNativePlatform();

// Registering is cheap and side-effect free off-device; the guards
// below are what actually keep the web build away from StoreKit.
const StoreKit = registerPlugin("StoreKit");

/* StoreKit can leave a call unanswered rather than failing it: a build
   whose product does not exist in App Store Connect yet, no store
   connection, a device part-way through signing in.

   A try/catch is no help against a promise that never settles, and
   entitlement.js awaits isOwned() before it can resolve anything at
   all — so one unanswered call freezes the whole app on "loading",
   which shows no ads, gates nothing and hides the buy button. The
   failure looks exactly like the feature was never built.

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

/** Does StoreKit say this Apple ID owns the unlock? */
export async function isOwned() {
  if (!isNative) return false;
  try {
    const res = await withTimeout(StoreKit.entitlement(), STORE_TIMEOUT_MS, null);
    return Boolean(res && res.owned);
  } catch {
    return false;
  }
}

/**
 * The product as the App Store describes it right now — localised
 * title and a price string already in the viewer's currency, which
 * is why the paywall never hard-codes "£2.99".
 * Resolves to null if the store didn't answer.
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
 * Buy. Resolves to one of:
 *   "owned"     — purchased, or already owned
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

/** Restore. Apple requires this button on any non-consumable. */
export async function restore() {
  if (!isNative) return false;
  try {
    const { owned } = await StoreKit.restore();
    return Boolean(owned);
  } catch {
    return false;
  }
}
