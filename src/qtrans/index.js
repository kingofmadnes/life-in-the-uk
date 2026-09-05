/* ============================================================
   QUESTION TRANSLATION BUNDLES

   One file per language. Each default-exports a map keyed by
   question id:

     { 42: ["question text", "opt|opt|opt|opt", "explanation"], … }

   Options are pipe-separated and MUST stay in the same order as
   the English `o` array — the app matches them up by index, so a
   reordered or short list would put the wrong translation under
   the wrong answer. normaliseTranslation() in quizLogic.js checks
   the count on the way in and drops the entry if it disagrees.

   House rules for a bundle, so a translation still matches the
   English sitting above it:
     · UK proper nouns stay in English — Magna Carta, House of
       Commons, Hadrian's Wall, the Ashes, Hansard, PAYE. Gloss
       them in the target language on first use where it helps.
     · Dates, years and numbers stay as digits.
     · Options stay short. They sit under a one-line English
       option and have to read as a label, not a sentence.
     · Translate the meaning, not the words.

   The imports below are static strings on purpose: Vite can only
   split a chunk per language if it can see the specifier at build
   time. A template literal here would bundle every language into
   the main chunk and hand a Tamil speaker the Polish file too.
   A language is listed here only once its bank is complete. One that
   is not listed falls back to English questions, which is the honest
   outcome — a half-translated bank looks broken in a way that plain
   English does not.
   ============================================================ */

const LOADERS = {
  hi: () => import("./hi.js"),
  ur: () => import("./ur.js"),
  pa: () => import("./pa.js"),
  bn: () => import("./bn.js"),
};

/** Does a translated question bank ship for this language? */
export function hasBundle(lang) {
  return Object.prototype.hasOwnProperty.call(LOADERS, lang);
}

export function bundledLanguages() {
  return Object.keys(LOADERS);
}

/**
 * Fetch one language's question bank. Resolves to null rather than
 * throwing if the chunk cannot be loaded — a student offline on a
 * cold cache should get English questions, not a blank screen.
 */
export async function loadBundle(lang) {
  const loader = LOADERS[lang];
  if (!loader) return null;
  try {
    const mod = await loader();
    return mod.default || null;
  } catch (e) {
    return null;
  }
}
