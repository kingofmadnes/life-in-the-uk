/* Checks every shipped translation bundle against the English question bank.

   The failure this guards against is silent and nasty: an entry whose option
   list is short, reordered, or out of step with the English puts the wrong
   translation under the wrong answer, and a student revising in Hindi or
   Arabic has no way to see that it happened. So the shape is asserted here
   rather than trusted.

   Run with:  node --test src/
*/

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { bundledLanguages, loadBundle } from './index.js';
import { normaliseTranslation } from '../quizLogic.js';
import { VARIANT_Q } from '../questionVariants/index.js';

const here = dirname(fileURLToPath(import.meta.url));

/* The question bank lives inside the component file as two array literals.
   Reading them out beats duplicating 253 questions into a fixture that would
   drift from the real thing within a week. */
function loadQuestions() {
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
        .replace(/\/\*[\s\S]*?\*\//g, '')          // strip the chapter banners
        .replace(/([{,]\s*)(\w+):/g, '$1"$2":')    // quote the bare keys
        .replace(/,(\s*[}\]])/g, '$1'),            // drop trailing commas
    );
  };
  return [...grab('BASE_Q'), ...grab('EXTRA_Q')];
}

const QUESTIONS = loadQuestions();

/* A bundle can carry entries for the 253 core questions, the 253
   doubles (ids >= 1000), or both — a language is only required to
   have finished the 253 core ones to be "supported" at all (see the
   coverage test below); double coverage is additional and built up
   incrementally, language by language. Either kind of id needs to
   resolve to its real source question here so a double's translation
   gets checked against the double's own options, not rejected as
   unknown — and an id that resolves to nothing is a translation left
   behind by a question that no longer exists, which the "matches the
   English bank" test below rejects outright. */
const ALL_KNOWN = [...QUESTIONS, ...VARIANT_Q];
const byId = new Map(ALL_KNOWN.map((q) => [q.i, q]));

test('the question bank parses and is non-trivial', () => {
  assert.ok(QUESTIONS.length > 200, `only found ${QUESTIONS.length} questions`);
  assert.equal(byId.size, ALL_KNOWN.length, 'duplicate id across the core bank and the variants');
});

for (const lang of bundledLanguages()) {
  test(`bundle "${lang}" matches the English bank`, async () => {
    const bundle = await loadBundle(lang);
    assert.ok(bundle, `bundle ${lang} failed to load`);

    const ids = Object.keys(bundle).map(Number);
    assert.ok(ids.length > 0, `bundle ${lang} is empty`);

    for (const id of ids) {
      const base = byId.get(id);
      assert.ok(base, `${lang}: id ${id} is not a question in the bank`);

      const entry = bundle[id];
      assert.ok(Array.isArray(entry) && entry.length === 3,
        `${lang}/${id}: expected [question, options, explanation]`);

      const [qText, optText, expl] = entry;
      assert.ok(typeof qText === 'string' && qText.trim(), `${lang}/${id}: empty question`);
      assert.ok(typeof expl === 'string' && expl.trim(), `${lang}/${id}: empty explanation`);

      const options = String(optText).split('|');
      assert.equal(options.length, base.o.length,
        `${lang}/${id}: ${options.length} options but the English has ${base.o.length}`);
      options.forEach((o, k) => {
        assert.ok(o.trim(), `${lang}/${id}: option ${k + 1} is empty`);
      });
      assert.equal(new Set(options.map((o) => o.trim())).size, options.length,
        `${lang}/${id}: two options translate to the same string, so they cannot be told apart`);

      // The same guard the app applies at render time.
      assert.ok(
        normaliseTranslation({ q: qText, o: options, e: expl }, base, lang),
        `${lang}/${id}: rejected by normaliseTranslation`,
      );
    }
  });

  /* True/False options carry no meaning of their own — the student picks a
     position, and the app scores that position. So the translated pair has to
     be in the SAME order as the English pair. Reversed, the subtitle tells a
     Polish or Arabic speaker to tap the option that scores wrong, and nothing
     else in the app would ever notice. */
  test(`bundle "${lang}" keeps True/False options in the English order`, async () => {
    const bundle = await loadBundle(lang);
    const tf = QUESTIONS.filter(
      (q) => q.o.length === 2 && q.o.every((o) => /^(true|false)$/i.test(o.trim())),
    );
    assert.ok(tf.length > 0, 'expected some True/False questions in the bank');

    for (const q of tf) {
      const entry = bundle[q.i];
      if (!entry) continue;
      const options = String(entry[1]).split('|');
      assert.equal(options.length, 2, `${lang}/${q.i}: expected exactly 2 options`);
      /* Both translations must be distinct, and whichever of them means "true"
         has to sit where "True" sits in the English. We cannot read the target
         language, but we can check the pair is consistent across every
         True/False question in the bundle: the same translated word must always
         line up with the same English word. */
      assert.notEqual(options[0].trim(), options[1].trim(),
        `${lang}/${q.i}: both options translate to the same word`);
    }

    /* The consistency check: build the English-word -> translated-word mapping
       from every True/False question and assert it never contradicts itself. */
    const seen = new Map();
    for (const q of tf) {
      const entry = bundle[q.i];
      if (!entry) continue;
      const options = String(entry[1]).split('|');
      q.o.forEach((english, k) => {
        const key = english.trim().toLowerCase();
        const got = options[k].trim();
        if (seen.has(key)) {
          assert.equal(got, seen.get(key),
            `${lang}/${q.i}: "${english}" is translated as "${got}" here but "${seen.get(key)}" elsewhere — one of the two questions has its options reversed`);
        } else {
          seen.set(key, got);
        }
      });
    }
  });

  test(`bundle "${lang}" covers every question`, async () => {
    const bundle = await loadBundle(lang);
    const missing = QUESTIONS.filter((q) => !bundle[q.i]).map((q) => q.i);
    assert.equal(missing.length, 0,
      `${lang} is missing ${missing.length} of ${QUESTIONS.length} questions: ${missing.slice(0, 12).join(', ')}${missing.length > 12 ? '…' : ''}`);
  });
}
