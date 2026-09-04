import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import {
  LEVELS,
  LAST_LEVEL,
  EXAM_MIX,
  difficultyOf,
  isUnlocked,
  currentLevel,
  clearedCount,
  allCleared,
  buildLevelDeck,
  getSmartQuizQuestions,
  normaliseTranslation,
} from './quizLogic.js';

const here = dirname(fileURLToPath(import.meta.url));

/* The real bank, read out of the component, so these tests fail if the
   question set drifts away from what the levels assume about it. */
function loadQuestions() {
  const src = readFileSync(join(here, 'LifeInTheUK.jsx'), 'utf8');
  const grab = (name) => {
    const start = src.indexOf(`const ${name} = [`);
    const open = src.indexOf('[', start);
    let depth = 0;
    let i = open;
    for (; i < src.length; i++) {
      if (src[i] === '[') depth++;
      else if (src[i] === ']') { depth--; if (depth === 0) break; }
    }
    return JSON.parse(
      src.slice(open, i + 1)
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/([{,]\s*)(\w+):/g, '$1"$2":')
        .replace(/,(\s*[}\]])/g, '$1'),
    );
  };
  return [...grab('BASE_Q'), ...grab('EXTRA_Q')];
}

const QUESTIONS = loadQuestions();

/* A deterministic stand-in for Math.random, so a deck assertion that passes
   today cannot fail tomorrow on a bad roll. */
function seeded(seed = 1) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/* ---------- difficulty ---------- */

test('difficulty returns one of three tiers for every question', () => {
  for (const q of QUESTIONS) {
    const d = difficultyOf(q);
    assert.ok(d === 1 || d === 2 || d === 3, `question ${q.i} scored ${d}`);
  }
});

test('every tier has enough questions to be usable', () => {
  const counts = [1, 2, 3].map((t) => QUESTIONS.filter((q) => difficultyOf(q) === t).length);
  counts.forEach((n, k) => assert.ok(n >= 40, `tier ${k + 1} has only ${n} questions`));
});

test('difficulty reads structure, not chapter number', () => {
  // A true/false pair is the easiest shape there is; four bare years is the hardest.
  const trueFalse = { i: 9001, c: 3, q: 'Is this statement TRUE or FALSE? Something.', o: ['True', 'False'], a: [0] };
  const fourYears = { i: 9002, c: 4, q: 'In which year did it happen?', o: ['1588', '1485', '1666', '1215'], a: [0] };
  const chooseTwo = { i: 9003, c: 1, q: 'Which TWO apply? (Choose two answers)', o: ['A one', 'B two', 'C three', 'D four'], a: [0, 1] };
  assert.equal(difficultyOf(trueFalse), 1);
  assert.equal(difficultyOf(fourYears), 3);
  assert.equal(difficultyOf(chooseTwo), 3);
});

/* ---------- the ladder ---------- */

test('levels climb in length and tighten the pass bar at the end', () => {
  assert.equal(LEVELS.length, 8);
  assert.equal(LAST_LEVEL, 8);
  for (let i = 1; i < LEVELS.length; i++) {
    assert.ok(LEVELS[i].len >= LEVELS[i - 1].len,
      `level ${LEVELS[i].n} is shorter than level ${LEVELS[i - 1].n}`);
  }
  // Early levels are untimed and marked as you go; later ones are neither.
  assert.ok(LEVELS.slice(0, 3).every((l) => l.instant && l.secs === 0));
  assert.ok(LEVELS.slice(3).every((l) => !l.instant && l.secs > 0));
  // The final level asks for more than the real test's 18 out of 24.
  const last = LEVELS[LEVELS.length - 1];
  assert.equal(last.len, 24);
  assert.ok(last.need > 18, 'the last level should be harder than a real pass');
  assert.ok(last.weak, 'the last level should target the student\'s weak spots');
});

test('a level is locked until the one before it is passed', () => {
  assert.ok(isUnlocked(1, {}), 'level 1 is always open');
  assert.ok(!isUnlocked(2, {}));
  assert.ok(!isUnlocked(2, { 1: { passed: false, best: 5 } }));
  assert.ok(isUnlocked(2, { 1: { passed: true, best: 8 } }));
  assert.ok(!isUnlocked(8, { 1: { passed: true } }), 'passing level 1 does not open level 8');
});

test('currentLevel points at the first level not yet passed', () => {
  assert.equal(currentLevel({}), 1);
  assert.equal(currentLevel({ 1: { passed: true } }), 2);
  assert.equal(currentLevel({ 1: { passed: true }, 2: { passed: true }, 3: { passed: true } }), 4);
});

test('the ready message only appears once every level is cleared', () => {
  const all = {};
  for (const l of LEVELS) {
    assert.ok(!allCleared(all), `cleared too early, at level ${l.n}`);
    all[l.n] = { passed: true, best: l.need };
  }
  assert.ok(allCleared(all));
  assert.equal(clearedCount(all), 8);

  // Passing seven of eight is not enough — the last one is the gate.
  const almost = { ...all };
  delete almost[LAST_LEVEL];
  assert.ok(!allCleared(almost));
  assert.equal(clearedCount(almost), 7);
});

/* ---------- deck building ---------- */

test('every level deals a full deck from the questions it claims', () => {
  for (const level of LEVELS) {
    const deck = buildLevelDeck(QUESTIONS, level, {}, seeded(level.n));
    assert.equal(deck.length, level.len, `level ${level.n} dealt ${deck.length} of ${level.len}`);
    assert.equal(new Set(deck.map((q) => q.i)).size, deck.length,
      `level ${level.n} dealt the same question twice`);
  }
});

test('the two full-length levels keep the real chapter mix', () => {
  for (const level of LEVELS.filter((l) => l.examMix)) {
    const deck = buildLevelDeck(QUESTIONS, level, {}, seeded(7));
    for (const ch of [1, 2, 3, 4, 5]) {
      assert.equal(deck.filter((q) => q.c === ch).length, EXAM_MIX[ch],
        `level ${level.n} has the wrong number of chapter ${ch} questions`);
    }
  }
});

test('levels draw from their own difficulty tiers', () => {
  // Level 1 is foundations only, level 6 is the hard set only.
  const warmup = buildLevelDeck(QUESTIONS, LEVELS[0], {}, seeded(3));
  assert.ok(warmup.every((q) => difficultyOf(q) === 1));
  const hard = buildLevelDeck(QUESTIONS, LEVELS[5], {}, seeded(3));
  assert.ok(hard.every((q) => difficultyOf(q) === 3));
});

test('the final level is built from what the student keeps getting wrong', () => {
  const final = LEVELS[LEVELS.length - 1];
  const eligible = QUESTIONS.filter((q) => final.tiers.includes(difficultyOf(q)));

  // Mark a slice of eligible questions as answered wrong and not yet recovered.
  const weak = eligible.slice(0, 30).map((q) => q.i);
  const stats = {};
  for (const q of eligible) {
    stats[q.i] = weak.includes(q.i)
      ? { r: 0, w: 3, s: 0 }     // keeps getting it wrong
      : { r: 5, w: 0, s: 5 };    // solid
  }

  const deck = buildLevelDeck(QUESTIONS, final, stats, seeded(11));
  const fromWeak = deck.filter((q) => weak.includes(q.i)).length;
  assert.ok(fromWeak >= 8,
    `only ${fromWeak} of ${deck.length} came from the weak set; the final level should lean on it`);
});

test('a fresh student still gets a full final-level paper', () => {
  // No stats at all must not starve the weighted pick.
  const deck = buildLevelDeck(QUESTIONS, LEVELS[LEVELS.length - 1], {}, seeded(5));
  assert.equal(deck.length, 24);
});

test('decks vary between attempts', () => {
  const a = buildLevelDeck(QUESTIONS, LEVELS[3], {}, seeded(1)).map((q) => q.i);
  const b = buildLevelDeck(QUESTIONS, LEVELS[3], {}, seeded(2)).map((q) => q.i);
  assert.notDeepEqual(a, b, 'two attempts at a level dealt an identical paper');
});

/* ---------- quick quiz ---------- */

test('the quick quiz favours unresolved mistakes', () => {
  const stats = {};
  QUESTIONS.forEach((q) => { stats[q.i] = { r: 4, w: 0, s: 4 }; });
  const wrong = QUESTIONS.slice(0, 12).map((q) => q.i);
  wrong.forEach((id) => { stats[id] = { r: 0, w: 2, s: 0 }; });

  const deck = getSmartQuizQuestions(QUESTIONS, stats, 10, seeded(4));
  assert.equal(deck.length, 10);
  assert.ok(deck.filter((q) => wrong.includes(q.i)).length >= 4,
    'the quick quiz ignored the questions the student keeps missing');
});

/* ---------- translation shape ---------- */

test('translation normalizer validates a well-formed payload', () => {
  const base = { i: 1, o: ['A', 'B', 'C', 'D'] };
  const result = normaliseTranslation(
    { q: 'Pregunta', o: ['Opción 1', 'Opción 2', 'Opción 3', 'Opción 4'], e: 'Explicación' },
    base,
    'Spanish',
  );
  assert.equal(result.q, 'Pregunta');
  assert.equal(result.o.length, 4);
  assert.equal(result.e, 'Explicación');
});

test('translation normalizer rejects a payload with the wrong option count', () => {
  const base = { i: 1, o: ['A', 'B', 'C', 'D'] };
  assert.equal(normaliseTranslation({ q: 'bad', o: ['only one'], e: 'missing' }, base, 'Spanish'), null);
  assert.equal(normaliseTranslation({ q: '', o: ['a', 'b', 'c', 'd'], e: 'e' }, base, 'Spanish'), null);
  assert.equal(normaliseTranslation(null, base, 'Spanish'), null);
});
