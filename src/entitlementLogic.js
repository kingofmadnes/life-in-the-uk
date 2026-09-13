/* ============================================================
   ENTITLEMENT LOGIC

   The decisions behind the paywall, with no imports, so they can be
   tested the way quizLogic.js is. entitlement.js does the talking to
   Firestore, StoreKit and React; everything that decides what a
   person may use lives here.

   States:
     loading  still working it out — show the app, gate nothing
     web      not the native app: everything, no ads, forever
     paid     owns the one-off unlock: everything, no ads
     trial    signed in less than 24h ago: everything, no ads
     free     the steady state: whole app minus the quiz, with ads
   ============================================================ */

export const TRIAL_MS = 24 * 60 * 60 * 1000;

/**
 * Trial or free, given when the clock started.
 *
 * A null start means we never managed to read the clock: never been
 * online, or Firestore is not enabled yet. That fails OPEN — a student
 * who signed up thirty seconds ago should not meet a paywall because
 * their train went into a tunnel. Nothing is written in that case, so
 * the real 24 hours still start from the first connected launch.
 */
export function trialState(startedMs, nowMs) {
  if (!startedMs) return "trial";
  const elapsed = nowMs - startedMs;
  // A start in the future means a wrong device clock or a bad write.
  // Treat it as just-started rather than instantly expired.
  if (elapsed < 0) return "trial";
  return elapsed < TRIAL_MS ? "trial" : "free";
}

/** May this person open a quiz screen? Everything but the free tier. */
export function unlockedFor(state) {
  return state !== "free";
}

/** Should this person be shown ads? Only the free tier. */
export function adsOnFor(state) {
  return state === "free";
}

/** Whole hours of trial left, for the countdown in Settings. */
export function trialHoursLeft(startedMs, nowMs) {
  if (!startedMs) return null;
  const left = TRIAL_MS - (nowMs - startedMs);
  if (left <= 0) return 0;
  return Math.ceil(left / (60 * 60 * 1000));
}
