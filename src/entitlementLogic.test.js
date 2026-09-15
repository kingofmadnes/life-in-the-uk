import test from 'node:test';
import assert from 'node:assert/strict';

import {
  PATH_TRIAL_MS,
  pathTrialActive,
  pathOpenFor,
  adsOnFor,
  pathTrialHoursLeft,
  startedOrNow,
} from './entitlementLogic.js';

const NOW = Date.UTC(2026, 8, 13, 12, 0, 0);
const hours = (n) => n * 60 * 60 * 1000;

test('the path trial lasts a full 24 hours', () => {
  assert.equal(PATH_TRIAL_MS, hours(24));
});

test('a brand new account has an active path trial', () => {
  assert.equal(pathTrialActive(NOW, NOW), true);
});

test('an account keeps path trial active until the last minute', () => {
  assert.equal(pathTrialActive(NOW - hours(23) - 60000, NOW), true);
});

test('the path trial ends exactly on the 24 hour mark, not before', () => {
  // One millisecond short is still active; the mark itself is not.
  assert.equal(pathTrialActive(NOW - PATH_TRIAL_MS + 1, NOW), true);
  assert.equal(pathTrialActive(NOW - PATH_TRIAL_MS, NOW), false);
});

test('a long-expired path trial is inactive, not something else', () => {
  assert.equal(pathTrialActive(NOW - hours(24 * 90), NOW), false);
});

test('an unreadable clock fails open rather than locking the path', () => {
  // Offline on a first launch, or Firestore not enabled yet. Locking
  // someone out because of a dropped connection is the worse mistake.
  assert.equal(pathTrialActive(null, NOW), true);
  assert.equal(pathTrialActive(0, NOW), true);
  assert.equal(pathTrialActive(undefined, NOW), true);
});

test('a clock in the future does not expire the path trial instantly', () => {
  // A wrong device clock, or a server timestamp read on a device that
  // is running slow. Treat it as just started.
  assert.equal(pathTrialActive(NOW + hours(5), NOW), true);
});

test('paid users always have path open, free users depend on trial status', () => {
  // Paid users: path always open
  assert.equal(pathOpenFor('paid', true), true);
  assert.equal(pathOpenFor('paid', false), true);

  // Free users: path open only if trial active
  assert.equal(pathOpenFor('free', true), true);
  assert.equal(pathOpenFor('free', false), false);

  // Other states: path always open (loading, web)
  ['web', 'loading'].forEach((s) => {
    assert.equal(pathOpenFor(s, true), true, `${s} with trial should be open`);
    assert.equal(pathOpenFor(s, false), true, `${s} without trial should be open`);
  });
});

test('only the free tier sees ads', () => {
  assert.equal(adsOnFor('free'), true);
  ['web', 'paid', 'loading'].forEach((s) => {
    assert.equal(adsOnFor(s), false, `${s} should not see ads`);
  });
});

test('loading state has no ads', () => {
  assert.equal(adsOnFor('loading'), false);
});

test('a first-sight clock starts now and never moves afterwards', () => {
  // Nothing stored yet: the trial starts at this moment.
  assert.equal(startedOrNow(null, NOW), NOW);
  assert.equal(startedOrNow(undefined, NOW), NOW);
  assert.equal(startedOrNow(0, NOW), NOW);
  assert.equal(startedOrNow(NaN, NOW), NOW);

  // Something already stored: keep it, however old. This is the half
  // that stops a guest restarting their own trial by reopening the app.
  const earlier = NOW - hours(30);
  assert.equal(startedOrNow(earlier, NOW), earlier);
  assert.equal(pathTrialActive(startedOrNow(earlier, NOW), NOW), false);
});

test('path trial hours left counts down and floors at zero', () => {
  assert.equal(pathTrialHoursLeft(NOW, NOW), 24);
  assert.equal(pathTrialHoursLeft(NOW - hours(23.5), NOW), 1);
  assert.equal(pathTrialHoursLeft(NOW - hours(24), NOW), 0);
  assert.equal(pathTrialHoursLeft(NOW - hours(100), NOW), 0);
  assert.equal(pathTrialHoursLeft(null, NOW), null);
});
