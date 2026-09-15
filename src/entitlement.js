/* ============================================================
   ENTITLEMENT — one source of truth for "what may this person use?"

   Resolves to exactly one state:

     loading   still working it out — show the app, gate nothing
     web       not the native app: everything, no ads, forever
     free      no subscription: path locked, ads on
     trialing  inside the 3-day free trial: path open, ads still on
     paid      trial converted to a real charge: path open, ads off

   Two derived booleans are what callers should actually branch on:

     pathOpen  may open the path (anything but a bare "free")
     adsOn     should be shown ads (free and trialing; not paid)

   There is no trial clock to keep here — Firestore, a guest device
   clock, all of it. Apple only allows a free trial to require a card
   on an auto-renewable subscription, so the trial itself lives inside
   StoreKit: `entitlement()` on the native side reports both whether
   the Apple ID has a live subscription and whether it is currently the
   introductory (trial) period or a paid one. stateFor() in
   entitlementLogic.js is the entire translation from that pair into
   what this app shows — see there for why nothing here is farmable by
   reinstalling or signing out.

   One exception: a single hard-coded owner account always resolves to
   "paid", checked before StoreKit runs at all. See isOwner() below.

   This file does the talking — StoreKit and React. The decisions
   themselves live in entitlementLogic.js, which has no imports and is
   covered by entitlementLogic.test.js.
   ============================================================ */

import { useEffect, useState, useCallback, useRef } from "react";
import { Capacitor } from "@capacitor/core";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase.js";
import { status as storeStatus } from "./storekit.js";
import { stateFor, pathOpenFor, adsOnFor } from "./entitlementLogic.js";

const isNative = Capacitor.isNativePlatform();

export { stateFor, pathOpenFor, adsOnFor };

/* The one account that gets everything free, forever — no ads, path
   always open, regardless of what StoreKit reports. Kept to exactly
   one address on purpose: every entry here is a permanent free
   account that no purchase check can ever see, so this must never
   grow into a shared testers list. */
const OWNER_EMAIL = "cccvhmd2001@gmail.com";

function isOwner() {
  const user = auth && auth.currentUser;
  return Boolean(user && user.email === OWNER_EMAIL);
}

/**
 * Work out the current state. The owner account outranks the store
 * entirely — checked first so it never waits on a network call — and
 * everyone else is whatever StoreKit says. A subscription otherwise
 * belongs to the Apple ID, not to a Firebase account, so signing in
 * and out changes nothing for anyone but the owner.
 */
export async function resolve() {
  if (!isNative) return "web";
  if (isOwner()) return "paid";
  const { owned, trialing } = await storeStatus();
  return stateFor(owned, trialing);
}

/**
 * React binding. Re-resolves on a timer while the app is visible — a
 * trial can convert to a charge, or a subscription can lapse, without
 * any action inside this app to hang a listener off — and exposes
 * refresh() for the moments that can change the answer immediately:
 * finishing a purchase, restoring one.
 */
export function useEntitlement() {
  const [state, setState] = useState("loading");
  /* Resolving hits the store, so two of them can be in flight at once —
     a launch and a return-from-background, say. Without a token the
     slower one wins by finishing last, which could put someone who has
     just paid back onto the free tier. Only the newest answer is kept. */
  const seq = useRef(0);

  const settle = useCallback((token, next) => {
    if (token === seq.current) setState(next);
  }, []);

  const refresh = useCallback(async () => {
    const token = ++seq.current;
    const next = await resolve();
    settle(token, next);
    return next;
  }, [settle]);

  useEffect(() => {
    let live = true;
    const run = () => {
      const token = ++seq.current;
      resolve().then((s) => {
        if (live) settle(token, s);
      });
    };

    /* Deliberately no resolve() before this point. Firebase restores the
       session asynchronously, so calling resolve() on mount would read
       currentUser as null and miss the owner account for a moment.
       onAuthStateChanged always fires once on subscribe, with null or
       a user, which is exactly the signal to start from. */
    const stop = auth ? onAuthStateChanged(auth, run) : null;
    if (!auth) run();

    // A trial can convert, a subscription can lapse, or — for the one
    // owner account — who's signed in can change, while the app sits
    // in the background.
    const onShow = () => {
      if (document.visibilityState === "visible") run();
    };
    document.addEventListener("visibilitychange", onShow);

    return () => {
      live = false;
      if (stop) stop();
      document.removeEventListener("visibilitychange", onShow);
    };
  }, [settle]);

  return {
    state,
    pathOpen: pathOpenFor(state),
    adsOn: adsOnFor(state),
    loading: state === "loading",
    refresh,
  };
}
