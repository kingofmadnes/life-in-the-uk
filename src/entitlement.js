/* ============================================================
   ENTITLEMENT — one source of truth for "what may this person use?"

   Resolves to exactly one state:

     loading  still working it out — show the app, gate nothing
     web      not the native app: everything, no ads, forever
     paid     owns the £3.99 unlock: path open, no ads
     free     the steady state: path locked (unless trial active),
              everything else open, with ads

   Two derived booleans are what callers should actually branch on:

     pathOpen  may open the path (paid, or free with active trial)
     adsOn     should be shown ads (free tier only)

   The path trial clock lives in Firestore, not on the device, because a
   device clock resets when you delete the app. See the rules: `allow
   update: if false` is what stops an account restarting its own trial.

   This file does the talking — Firestore, StoreKit, React. The
   decisions themselves live in entitlementLogic.js, which has no
   imports and is covered by entitlementLogic.test.js.
   ============================================================ */

import { useEffect, useState, useCallback, useRef } from "react";
import { Capacitor } from "@capacitor/core";
import { onAuthStateChanged } from "firebase/auth";
import { auth, getDb } from "./firebase.js";
import { isOwned } from "./storekit.js";
import {
  PATH_TRIAL_MS, pathTrialActive, pathOpenFor, adsOnFor, pathTrialHoursLeft,
} from "./entitlementLogic.js";

const isNative = Capacitor.isNativePlatform();

export { PATH_TRIAL_MS, pathTrialActive, pathOpenFor, adsOnFor, pathTrialHoursLeft };

/* The last path trial start we successfully read from Firestore, per account.
   This is a cache, never the authority: it exists so that a student
   revising on a train keeps the state they already had instead of being
   bounced to a paywall by a dropped connection. It can only ever make
   the trial end sooner, never later. */
const cacheKey = (uid) => "uk2:pathTrial::" + uid;

function readCache(uid) {
  try {
    const v = Number(localStorage.getItem(cacheKey(uid)));
    return Number.isFinite(v) && v > 0 ? v : null;
  } catch {
    return null;
  }
}

function writeCache(uid, ms) {
  try {
    localStorage.setItem(cacheKey(uid), String(ms));
  } catch {
    /* ignore — a full or private store just costs us the cache */
  }
}

/**
 * When did this account's path trial start? Milliseconds, or null if we
 * genuinely could not find out.
 *
 * Writes the clock on first sight and never again — the document is
 * create-only in the security rules, so a second write would be
 * rejected by the server even if a bug here tried.
 */
async function pathTrialStart(uid) {
  const db = await getDb();
  if (!db) return readCache(uid);

  const { doc, getDoc, getDocFromServer, setDoc, serverTimestamp } =
    await import("firebase/firestore");

  const ref = doc(db, "users", uid);
  try {
    let snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, { pathTrialStartedAt: serverTimestamp() });
      // The local snapshot right after a write still has a null
      // timestamp — the server is the one that stamps it.
      snap = await getDocFromServer(ref);
    }
    const stamp = snap.data() && snap.data().pathTrialStartedAt;
    const ms = stamp && typeof stamp.toMillis === "function" ? stamp.toMillis() : null;
    if (ms) {
      writeCache(uid, ms);
      return ms;
    }
    return readCache(uid);
  } catch {
    // Offline, rules not deployed yet, quota — fall back to whatever
    // we last knew. See resolve() for what happens when that is nothing.
    return readCache(uid);
  }
}

/**
 * Remove this account's path trial record. Called on the way out of "Delete
 * account", before the auth user goes — once it is gone the client has
 * no credentials left to delete anything with.
 *
 * Losing the record does not hand anyone a free path trial: a new account
 * gets a new uid and its own fresh clock either way. Deleting it is
 * simply what the privacy policy promises.
 */
export async function forgetPathTrial(uid) {
  if (!isNative || !uid) return;
  try {
    const db = await getDb();
    if (!db) return;
    const { doc, deleteDoc } = await import("firebase/firestore");
    await deleteDoc(doc(db, "users", uid));
  } catch {
    /* Best effort. Account deletion must not fail because of this. */
  }
  try {
    localStorage.removeItem(cacheKey(uid));
  } catch {
    /* ignore */
  }
}

/**
 * Work out the current state. Order matters: a purchase outranks
 * everything, and it is checked first so that a paying customer is
 * never shown an ad while the network decides what it thinks.
 */
export async function resolve() {
  if (!isNative) return "web";

  if (await isOwned()) return "paid";

  const user = auth && auth.currentUser;
  // Guests have no account to hang a path trial on. They still get the
  // whole app except the path, same as free users after 24 hours.
  if (!user) return "free";

  // For free users, just return "free" — the path trial is checked
  // separately in useEntitlement using pathTrialActive().
  return "free";
}

/**
 * React binding. Re-resolves when the signed-in account changes, and
 * exposes refresh() for the moments that can change the answer
 * out-of-band: finishing a purchase, restoring one, coming back from
 * the background after a path trial has run out.
 */
export function useEntitlement() {
  const [state, setState] = useState("loading");
  const [pathTrialStart, setPathTrialStart] = useState(null);
  /* Resolving hits the network, so two of them can be in flight at once —
     a sign-in and a return-from-background, say. Without a token the
     slower one wins by finishing last, which could put someone who has
     just paid back onto the free tier. Only the newest answer is kept. */
  const seq = useRef(0);

  const settle = useCallback((token, next, pts) => {
    if (token === seq.current) {
      setState(next);
      setPathTrialStart(pts);
    }
  }, []);

  const refresh = useCallback(async () => {
    const token = ++seq.current;
    const next = await resolve();
    const user = auth && auth.currentUser;
    const pts = next === "free" && user ? await pathTrialStart(user.uid) : null;
    settle(token, next, pts);
    return next;
  }, [settle]);

  useEffect(() => {
    let live = true;
    const run = async () => {
      const token = ++seq.current;
      const s = await resolve();
      const user = auth && auth.currentUser;
      const pts = s === "free" && user ? await pathTrialStart(user.uid) : null;
      if (live) settle(token, s, pts);
    };

    /* Deliberately no resolve() before this point. Firebase restores the
       session asynchronously, so calling resolve() on mount would read
       currentUser as null and report a signed-in student as a guest —
       ads on, path locked — until the listener corrected it a moment
       later. onAuthStateChanged always fires once on subscribe, with
       null or a user, which is exactly the signal we want to start from.
       Until then the state stays "loading": nothing gated, no ads. */
    const stop = auth ? onAuthStateChanged(auth, run) : null;
    if (!auth) run();

    // A path trial can expire while the app sits in the background.
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

  const pathOpen = pathOpenFor(state, pathTrialActive(pathTrialStart, Date.now()));

  return {
    state,
    pathOpen,
    adsOn: adsOnFor(state),
    loading: state === "loading",
    refresh,
  };
}
