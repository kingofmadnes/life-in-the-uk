import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getAdaptiveQuizBlueprint,
  normaliseTranslation,
  getSmartQuizQuestions,
} from './quizLogic.js';

const sampleQuestions = [
  { i: 1, c: 1, q: 'Easy question', o: ['A', 'B', 'C', 'D'], a: [0], e: 'Easy explain' },
  { i: 2, c: 1, q: 'Another easy question', o: ['A', 'B', 'C', 'D'], a: [1], e: 'Easy explain 2' },
  { i: 3, c: 2, q: 'Medium question', o: ['A', 'B', 'C', 'D'], a: [2], e: 'Medium explain' },
  { i: 4, c: 2, q: 'Hard question', o: ['A', 'B', 'C', 'D'], a: [3], e: 'Hard explain' },
  { i: 5, c: 3, q: 'Final question', o: ['A', 'B', 'C', 'D'], a: [0], e: 'Final explain' },
  { i: 6, c: 3, q: 'Final question 2', o: ['A', 'B', 'C', 'D'], a: [0], e: 'Final explain 2' },
  { i: 7, c: 3, q: 'Final question 3', o: ['A', 'B', 'C', 'D'], a: [0], e: 'Final explain 3' },
];

test('adaptive quiz blueprint increases difficulty across levels', () => {
  const blueprint = getAdaptiveQuizBlueprint(sampleQuestions, {});
  assert.ok(blueprint.length >= 4);
  assert.equal(blueprint[0].level, 1);
  assert.equal(blueprint[0].difficulty, 'easy');
  assert.equal(blueprint[blueprint.length - 1].difficulty, 'final');
  assert.ok(blueprint[blueprint.length - 1].message.includes('book'));
});

test('smart quiz questions are selected in order from easiest to hardest', () => {
  const deck = getSmartQuizQuestions(sampleQuestions, {});
  assert.ok(deck.length >= 6);
  assert.ok(deck[0].i <= deck[deck.length - 1].i);
});

test('translation normalizer validates and repairs a structured translation payload', () => {
  const result = normaliseTranslation({
    q: 'Pregunta',
    o: ['Opción 1', 'Opción 2', 'Opción 3', 'Opción 4'],
    e: 'Explicación',
  }, sampleQuestions[0], 'Spanish');

  assert.equal(result.q, 'Pregunta');
  assert.equal(result.o.length, 4);
  assert.equal(result.e, 'Explicación');
});

test('translation normalizer rejects malformed payloads', () => {
  const result = normaliseTranslation({ q: 'bad', o: ['only one'], e: 'missing' }, sampleQuestions[0], 'Spanish');
  assert.equal(result, null);
});
