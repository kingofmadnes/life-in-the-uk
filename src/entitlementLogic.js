/* ============================================================
   ENTITLEMENT LOGIC

   The decisions behind the paywall, with no imports, so they can be
   tested the way quizLogic.js is. entitlement.js does the talking to
   Firestore, StoreKit and React; everything that decides what a
   person may use lives here.

   States:
     loading         still working it out — show the app, gate nothing
     web             not the native app: everything, no ads, forever
     paid            owns the £3.99 unlock: path open, no ads
     free            the steady state: path locked (unless trial active),
                     everything else open, with ads

   The path has a 24-hour trial: new signed-in users get 24h to try it,
   then must pay to keep using it. Free users always see ads. Guests get
   the same experience as free (path locked, ads on) but without a trial
   clock.
   ============================================================ */

export const PATH_TRIAL_MS = 24 * 60 * 60 * 1000;

/**
 * Is the path trial active? Given when it started and the current time.
 *
 * A null start means we never managed to read the clock: never been
 * online, or Firestore is not enabled yet. That fails OPEN — a student
 * who signed up thirty seconds ago should have path access while the
 * server works. Nothing is written in that case, so the real 24 hours
 * still start from the first connected launch.
 */
export function pathTrialActive(startedMs, nowMs) {
  if (!startedMs) return true;
  const elapsed = nowMs - startedMs;
  if (elapsed < 0) return true;  // clock went backward; give them the trial
  return elapsed < PATH_TRIAL_MS;
}

/** May this person open the path? Paid users always; free users if trial active; others always. */
export function pathOpenFor(state, pathTrialActive) {
  if (state === "free") return pathTrialActive;
  return true;  // paid, web, loading, etc. all have path open
}

/** Should this person be shown ads? Only the free tier. */
export function adsOnFor(state) {
  return state === "free";
}

/** Whole hours of path trial left, for the countdown in Settings. */
export function pathTrialHoursLeft(startedMs, nowMs) {
  if (!startedMs) return null;
  const left = PATH_TRIAL_MS - (nowMs - startedMs);
  if (left <= 0) return 0;
  return Math.ceil(left / (60 * 60 * 1000));
}
