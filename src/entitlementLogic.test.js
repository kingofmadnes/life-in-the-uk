import test from 'node:test';
import assert from 'node:assert/strict';

import {
  TRIAL_MS,
  trialState,
  unlockedFor,
  adsOnFor,
  trialHoursLeft,
} from './entitlementLogic.js';

const NOW = Date.UTC(2026, 8, 13, 12, 0, 0);
const hours = (n) => n * 60 * 60 * 1000;

test('the trial lasts a full 24 hours', () => {
  assert.equal(TRIAL_MS, hours(24));
});

test('a brand new account is in its trial', () => {
  assert.equal(trialState(NOW, NOW), 'trial');
});

test('an account stays in its trial until the last minute', () => {
  assert.equal(trialState(NOW - hours(23) - 60000, NOW), 'trial');
});

test('the trial ends exactly on the 24 hour mark, not before', () => {
  // One millisecond short is still the trial; the mark itself is not.
  assert.equal(trialState(NOW - TRIAL_MS + 1, NOW), 'trial');
  assert.equal(trialState(NOW - TRIAL_MS, NOW), 'free');
});

test('a long-expired trial is free, not something else', () => {
  assert.equal(trialState(NOW - hours(24 * 90), NOW), 'free');
});

test('an unreadable clock fails open rather than paywalling', () => {
  // Offline on a first launch, or Firestore not enabled yet. Locking
  // someone out because of a dropped connection is the worse mistake.
  assert.equal(trialState(null, NOW), 'trial');
  assert.equal(trialState(0, NOW), 'trial');
  assert.equal(trialState(undefined, NOW), 'trial');
});

test('a clock in the future does not expire the trial instantly', () => {
  // A wrong device clock, or a server timestamp read on a device that
  // is running slow. Treat it as just started.
  assert.equal(trialState(NOW + hours(5), NOW), 'trial');
});

test('only the free tier is locked out of the quiz', () => {
  assert.equal(unlockedFor('free'), false);
  ['web', 'paid', 'trial', 'loading'].forEach((s) => {
    assert.equal(unlockedFor(s), true, `${s} should be unlocked`);
  });
});

test('only the free tier sees ads', () => {
  assert.equal(adsOnFor('free'), true);
  ['web', 'paid', 'trial', 'loading'].forEach((s) => {
    assert.equal(adsOnFor(s), false, `${s} should not see ads`);
  });
});

test('nobody is gated or advertised at while the state is still loading', () => {
  // The app renders before Firebase has restored the session. Showing a
  // paywall or an ad in that window would hit people who have paid.
  assert.equal(unlockedFor('loading'), true);
  assert.equal(adsOnFor('loading'), false);
});

test('hours left counts down and floors at zero', () => {
  assert.equal(trialHoursLeft(NOW, NOW), 24);
  assert.equal(trialHoursLeft(NOW - hours(23.5), NOW), 1);
  assert.equal(trialHoursLeft(NOW - hours(24), NOW), 0);
  assert.equal(trialHoursLeft(NOW - hours(100), NOW), 0);
  assert.equal(trialHoursLeft(null, NOW), null);
});
