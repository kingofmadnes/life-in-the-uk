/* Structural checks for generated question variants.

   The failure this guards against is different from the translation
   bundles' checks: a bad variant here is not a missing chapter, it is
   a broken or ambiguous quiz item — an answer index out of range, a
   True/False question with three options, two options that read the
   same so the right one cannot be told apart, or an id collision that
   would make two unrelated questions share one set of stats. All of
   those are silent at a glance and only show up when someone actually
   sits the quiz.

   Run with:  node --test src/
*/

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import CH1 from './chapter1.js';
import CH2 from './chapter2.js';
import CH3A from './chapter3a.js';
import CH3B from './chapter3b.js';
import CH3C from './chapter3c.js';

const here = dirname(fileURLToPath(import.meta.url));

/* The core bank lives inside the component file as two array literals.
   Reading it out beats duplicating 253 questions into a fixture. */
function loadCoreQuestions() {
  const src = readFileSync(join(here, '..', 'LifeInTheUK.jsx'), 'utf8');
  const grab = (name) => {
    const start = src.indexOf(`const ${name} = [`);
    assert.ok(start > -1, `${name} not found in LifeInTheUK.jsx`);
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

const CORE = loadCoreQuestions();
const CORE_IDS = new Set(CORE.map((q) => q.i));
const CORE_BY_ID = new Map(CORE.map((q) => [q.i, q]));

/* Every chapter file gets added here as it's written. Import it above
   and list it here — that is the whole registration step. */
/* FILES: every source file, checked individually for well-formedness
   and id uniqueness the moment it's written — this does not require a
   chapter to be complete, so a chapter split across several files
   (chapter 3, too big for one) is still checked file by file as each
   lands. CHAPTERS: only chapters whose base questions are FULLY
   covered across all their files go here — this is what the "did we
   forget a base question" coverage check runs against, so a
   chapter appears in it exactly once, after its last sub-file. */
const FILES = { chapter1: CH1, chapter2: CH2, chapter3a: CH3A, chapter3b: CH3B, chapter3c: CH3C };
const CHAPTERS = { 1: CH1, 2: CH2 };

function assertWellFormedVariant(v) {
  const label = `variant ${v.i} (base ${v.base}, ${v.variant})`;

  assert.ok(Number.isInteger(v.i) && v.i >= 1000, `${label}: id should be >= 1000`);
  assert.ok(CORE_BY_ID.has(v.base), `${label}: base id ${v.base} is not a real question`);
  assert.equal(v.c, CORE_BY_ID.get(v.base).c, `${label}: chapter does not match its base question`);
  assert.ok(['rephrase', 'truefalse', 'scenario', 'exception'].includes(v.variant),
    `${label}: unknown variant type "${v.variant}"`);

  assert.ok(typeof v.q === 'string' && v.q.trim().length > 10, `${label}: question text missing or too short`);
  assert.ok(typeof v.e === 'string' && v.e.trim().length > 10, `${label}: explanation missing or too short`);

  assert.ok(Array.isArray(v.o) && v.o.length >= 2, `${label}: needs at least 2 options`);
  v.o.forEach((opt, k) => assert.ok(typeof opt === 'string' && opt.trim(), `${label}: option ${k + 1} is empty`));
  assert.equal(new Set(v.o.map((s) => s.trim().toLowerCase())).size, v.o.length,
    `${label}: two options read the same, so the right one cannot be told apart`);

  if (v.variant === 'truefalse') {
    assert.equal(v.o.length, 2, `${label}: a true/false variant must have exactly 2 options`);
    assert.deepEqual(new Set(v.o.map((s) => s.trim())), new Set(['True', 'False']),
      `${label}: a true/false variant's options must be exactly "True" and "False"`);
  }

  assert.ok(Array.isArray(v.a) && v.a.length >= 1, `${label}: needs at least one correct answer`);
  assert.equal(new Set(v.a).size, v.a.length, `${label}: duplicate index in the answer array`);
  v.a.forEach((idx) => {
    assert.ok(Number.isInteger(idx) && idx >= 0 && idx < v.o.length,
      `${label}: answer index ${idx} is out of range for ${v.o.length} options`);
  });

  if (v.variant === 'exception') {
    assert.ok(/\bNOT\b/.test(v.q) || v.q.trim().toLowerCase().startsWith('which of these is'),
      `${label}: an exception variant should read as a "which is NOT" or "which IS" question`);
  }
}

test('the core question bank parses and every variant chapter references real ids', () => {
  assert.ok(CORE.length > 200, `only found ${CORE.length} core questions`);
});

for (const [fileName, variants] of Object.entries(FILES)) {
  test(`${fileName} variants are individually well-formed`, () => {
    assert.ok(variants.length > 0, `${fileName} has no variants`);
    variants.forEach(assertWellFormedVariant);
  });
}

for (const [chapterNum, variants] of Object.entries(CHAPTERS)) {
  test(`chapter ${chapterNum} variants cover all four types for every base question in the chapter`, () => {
    const baseIdsInChapter = CORE.filter((q) => q.c === Number(chapterNum)).map((q) => q.i);
    const byBase = new Map();
    variants.forEach((v) => {
      if (!byBase.has(v.base)) byBase.set(v.base, new Set());
      byBase.get(v.base).add(v.variant);
    });
    for (const baseId of baseIdsInChapter) {
      const types = byBase.get(baseId);
      assert.ok(types, `base question ${baseId} (chapter ${chapterNum}) has no variants at all`);
      for (const type of ['rephrase', 'truefalse', 'scenario', 'exception']) {
        assert.ok(types.has(type), `base question ${baseId} is missing its ${type} variant`);
      }
    }
  });
}

test('variant ids are unique across every file and do not collide with core ids', () => {
  const allVariants = Object.values(FILES).flat();
  const ids = allVariants.map((v) => v.i);
  assert.equal(new Set(ids).size, ids.length, 'duplicate id across variant files');
  const collisions = ids.filter((id) => CORE_IDS.has(id));
  assert.equal(collisions.length, 0, `variant ids collide with core ids: ${collisions.join(', ')}`);
});
