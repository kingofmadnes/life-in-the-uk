import test from 'node:test';
import assert from 'node:assert/strict';

import {
  stateFor,
  pathOpenFor,
  adsOnFor,
} from './entitlementLogic.js';

test('no entitlement at all is the free state', () => {
  assert.equal(stateFor(false, false), 'free');
  // trialing is meaningless without owned; still reads as free.
  assert.equal(stateFor(false, true), 'free');
});

test('an owned entitlement inside the introductory offer is trialing', () => {
  assert.equal(stateFor(true, true), 'trialing');
});

test('an owned entitlement outside the introductory offer is paid', () => {
  assert.equal(stateFor(true, false), 'paid');
});

test('only a bare free state locks the path', () => {
  assert.equal(pathOpenFor('free'), false);
  ['web', 'trialing', 'paid', 'loading'].forEach((s) => {
    assert.equal(pathOpenFor(s), true, `${s} should have the path open`);
  });
});

test('free and trialing both see ads; paid does not', () => {
  assert.equal(adsOnFor('free'), true);
  assert.equal(adsOnFor('trialing'), true);
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
