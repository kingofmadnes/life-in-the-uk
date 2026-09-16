/* ============================================================
   STUDY NOTES TRANSLATION BUNDLES

   One file per language. Each default-exports the same shape as the
   English `NOTES` array in LifeInTheUK.jsx:

     [{ c: 1, intro: "…", sections: [{ h: "…", p: ["…", "…"] }] }, …]

   Unlike the question bundles in ../qtrans, there is no positional
   coupling to preserve — a note is read, not matched against a set
   of answer options by index — so a translation is free to combine,
   split or reorder bullets for what reads naturally in that language.
   The only structural requirement is that all five chapters (c: 1–5)
   are present, each with a non-empty intro and at least one section.

   House rules for a bundle, so it still matches the English sitting
   in the app above it:
     · UK proper nouns stay in English on first use, then may be
       glossed in the target language — Magna Carta, the House of
       Commons, Hadrian's Wall, Hansard, PAYE, MOT.
     · Dates, years and numbers stay as digits.
     · Translate the meaning and the facts, not a literal word order —
       this exists specifically so nobody has to run the English
       through Google Translate themselves.

   The imports below are static strings on purpose: Vite can only
   split a chunk per language if it can see the specifier at build
   time. A language is listed here only once its notes are complete —
   one that is not listed falls back to the English notes, which is
   the honest outcome; a half-translated set of chapters would look
   broken in a way that plain English does not.
   ============================================================ */

const LOADERS = {
  hi: () => import("./hi.js"),
  ur: () => import("./ur.js"),
  pa: () => import("./pa.js"),
  bn: () => import("./bn.js"),
  ar: () => import("./ar.js"),
  ro: () => import("./ro.js"),
  pl: () => import("./pl.js"),
  it: () => import("./it.js"),
};

/** Do translated study notes ship for this language? */
export function hasNotesBundle(lang) {
  return Object.prototype.hasOwnProperty.call(LOADERS, lang);
}

export function bundledNoteLanguages() {
  return Object.keys(LOADERS);
}

/**
 * Fetch one language's study notes. Resolves to null rather than
 * throwing if the chunk cannot be loaded — a student offline on a
 * cold cache should get the English notes, not a blank screen.
 */
export async function loadNotesBundle(lang) {
  const loader = LOADERS[lang];
  if (!loader) return null;
  try {
    const mod = await loader();
    return mod.default || null;
  } catch (e) {
    return null;
  }
}
