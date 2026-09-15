/* ============================================================
   ENTITLEMENT LOGIC

   The decisions behind the paywall, with no imports, so they can be
   tested the way quizLogic.js is. entitlement.js does the talking to
   StoreKit and React; everything that decides what a person may use
   lives here.

   States:
     loading   still working it out — show the app, gate nothing
     web       not the native app: everything, no ads, forever
     free      no subscription: path locked, ads on
     trialing  inside the 3-day free trial: path open, ads still on
     paid      trial converted to a real charge: path open, ads off

   There is no device- or account-side trial clock any more. Apple only
   allows a free trial to require a payment method on an auto-renewable
   subscription — never on a one-time purchase — so the trial itself
   is Apple's to track: StoreKit reports whether the current entitlement
   is the introductory offer or a paid period, and stateFor() below is
   the entire translation from that into what this app shows. Nothing
   here is farmable by reinstalling, because nothing here lives on the
   device.
   ============================================================ */

/** Turn StoreKit's read into one of our states. */
export function stateFor(owned, trialing) {
  if (!owned) return "free";
  return trialing ? "trialing" : "paid";
}

/** May this person open the path? Everything but a bare "free". */
export function pathOpenFor(state) {
  return state !== "free";
}

/** Should this person be shown ads? Free and trialing both see ads —
    only a converted, paid period turns them off. */
export function adsOnFor(state) {
  return state === "free" || state === "trialing";
}
