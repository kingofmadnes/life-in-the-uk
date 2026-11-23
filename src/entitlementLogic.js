/* ============================================================
   ENTITLEMENT LOGIC

   The decisions behind the paywall, with no imports, so they can be
   tested the way quizLogic.js is. entitlement.js does the talking to
   StoreKit and React; everything that decides what a person may use
   lives here.

   States:
     loading   still working it out — show the app, gate nothing
     web       not the native app: everything, no ads, forever
     free      not bought: path locked, ads on
     paid      bought once, kept for good: path open, ads off

   There is nothing to track over time. The unlock is a single
   non-consumable purchase, so StoreKit's record of it is the whole
   answer. stateFor() below is the entire translation from that record
   into what this app shows. Nothing here is farmable by reinstalling,
   because nothing here lives on the device.
   ============================================================ */

/** Turn StoreKit's read into one of our states. */
export function stateFor(owned) {
  return owned ? "paid" : "free";
}

/** May this person open the path? Everything but a bare "free". */
export function pathOpenFor(state) {
  return state !== "free";
}

/** Should this person be shown ads? Only the free tier sees them. */
export function adsOnFor(state) {
  return state === "free";
}
