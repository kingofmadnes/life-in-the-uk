/* Checks every shipped notes bundle for completeness against the English
   study notes.

   Unlike the question bundles, there is no positional coupling to check —
   a note is read, not matched to an answer by array index — so this only
   guards against the failure that actually matters here: a chapter
   missing entirely, or present but empty, which would show a student a
   blank or partial page in their own language with no sign anything was
   wrong.

   Run with:  node --test src/
*/

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { bundledNoteLanguages, loadNotesBundle } from './index.js';

const here = dirname(fileURLToPath(import.meta.url));

/* NOTES lives inside the component file as one array literal. Reading it
   out beats duplicating five chapters of civic and historical detail into
   a fixture that would drift from the real thing within a week. */
function loadEnglishNotes() {
  const src = readFileSync(join(here, '..', 'LifeInTheUK.jsx'), 'utf8');
  const start = src.indexOf('const NOTES = [');
  assert.ok(start > -1, 'NOTES not found in LifeInTheUK.jsx');
  const open = src.indexOf('[', start);
  let depth = 0;
  let i = open;
  for (; i < src.length; i++) {
    if (src[i] === '[') depth++;
    else if (src[i] === ']') { depth--; if (depth === 0) break; }
  }
  // eslint-disable-next-line no-new-func -- trusted local source, not user input
  return new Function(`return ${src.slice(open, i + 1)};`)();
}

const ENGLISH_NOTES = loadEnglishNotes();
const CHAPTER_COUNT = ENGLISH_NOTES.length;

test('the English study notes parse and cover every chapter', () => {
  assert.ok(CHAPTER_COUNT >= 5, `only found ${CHAPTER_COUNT} chapters`);
  const chapterNumbers = ENGLISH_NOTES.map((n) => n.c);
  assert.equal(new Set(chapterNumbers).size, chapterNumbers.length, 'duplicate chapter numbers');
});

function assertWellFormed(lang, notes) {
  assert.ok(Array.isArray(notes) && notes.length > 0, `${lang}: notes bundle is empty`);

  const chapterNumbers = notes.map((n) => n.c);
  assert.equal(new Set(chapterNumbers).size, chapterNumbers.length, `${lang}: duplicate chapter numbers`);

  const englishChapters = new Set(ENGLISH_NOTES.map((n) => n.c));
  for (const c of englishChapters) {
    assert.ok(chapterNumbers.includes(c), `${lang}: missing chapter ${c}`);
  }

  for (const chapter of notes) {
    const label = `${lang}/chapter ${chapter.c}`;
    assert.ok(typeof chapter.intro === 'string' && chapter.intro.trim(), `${label}: empty intro`);
    assert.ok(Array.isArray(chapter.sections) && chapter.sections.length > 0, `${label}: no sections`);

    for (const [si, section] of chapter.sections.entries()) {
      const slabel = `${label}, section ${si + 1}`;
      assert.ok(typeof section.h === 'string' && section.h.trim(), `${slabel}: empty heading`);
      assert.ok(Array.isArray(section.p) && section.p.length > 0, `${slabel}: no bullet points`);
      section.p.forEach((line, li) => {
        assert.ok(typeof line === 'string' && line.trim(), `${slabel}, bullet ${li + 1}: empty`);
      });
    }
  }
}

test('the English study notes are themselves well-formed', () => {
  assertWellFormed('en', ENGLISH_NOTES);
});

for (const lang of bundledNoteLanguages()) {
  test(`notes bundle "${lang}" is complete and well-formed`, async () => {
    const notes = await loadNotesBundle(lang);
    assert.ok(notes, `notes bundle ${lang} failed to load`);
    assertWellFormed(lang, notes);
  });
}
