import test from 'node:test';
import assert from 'node:assert/strict';

import {
  stateFor,
  pathOpenFor,
  adsOnFor,
} from './entitlementLogic.js';

test('not owned is the free state', () => {
  assert.equal(stateFor(false), 'free');
});

test('owned is the paid state', () => {
  assert.equal(stateFor(true), 'paid');
});

test('only a bare free state locks the path', () => {
  assert.equal(pathOpenFor('free'), false);
  ['web', 'paid', 'loading'].forEach((s) => {
    assert.equal(pathOpenFor(s), true, `${s} should have the path open`);
  });
});

test('only the free tier sees ads', () => {
  assert.equal(adsOnFor('free'), true);
  assert.equal(adsOnFor('paid'), false);
});

test('web and loading never see ads', () => {
  assert.equal(adsOnFor('web'), false);
  assert.equal(adsOnFor('loading'), false);
});

test('nobody is gated or advertised at while the state is still loading', () => {
  // The app renders before Firebase/StoreKit has answered. Showing a
  // paywall or an ad in that window would hit people who have paid.
  assert.equal(pathOpenFor('loading'), true);
  assert.equal(adsOnFor('loading'), false);
});
