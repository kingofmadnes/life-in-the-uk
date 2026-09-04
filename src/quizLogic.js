/* ============================================================
   QUIZ LOGIC
   The difficulty model, the eight-level path, and deck building.
   Pure functions with no React and no browser APIs, so the whole
   thing is testable with `node --test src/`.
   ============================================================ */

/* The chapter mix the real test uses, and the one a full mock has to match. */
export const EXAM_MIX = { 1: 2, 2: 2, 3: 8, 4: 6, 5: 6 };

/* ------------------------------------------------------------
   DIFFICULTY

   Every question carries a tier: 1 foundations, 2 standard, 3 hard.
   The tier belongs to the question, not to the student, so a level
   means the same thing on day one as it does on day thirty — which
   is the whole point of a ladder.

   Chapter number is deliberately NOT used as a proxy for difficulty.
   Chapter 5 has "How many MPs are there?" and chapter 1 has a
   choose-two; the numbering says nothing about how hard a question is.
   ------------------------------------------------------------ */

/* Four options that are all dates or numbers ask for precise recall
   rather than understanding, and that is where marks actually go. */
function looksNumeric(s) {
  const digits = (s.match(/\d/g) || []).length;
  const letters = (s.match(/[A-Za-z]/g) || []).length;
  return digits >= 2 && letters <= 12;
}

/* A correct option noticeably longer than its distractors is the oldest
   tell in multiple choice: the real answer needs the qualifying clause,
   the filler does not. You can often pick it without knowing the fact. */
function giveawayLength(q) {
  if (q.a.length !== 1 || q.o.length < 3) return false;
  const correct = q.o[q.a[0]].length;
  const others = q.o.filter((_, i) => i !== q.a[0]).map((s) => s.length);
  const mean = others.reduce((x, y) => x + y, 0) / others.length;
  return correct >= mean * 1.35;
}

/* The opposite shape: four terse options of near-identical length, which
   is what "Bannockburn / Culloden / Agincourt / Naseby" looks like. There
   is nothing to reason from, so you either know it or you guess. */
function tightSet(q) {
  if (q.o.length < 4) return false;
  const lengths = q.o.map((s) => s.length);
  const max = Math.max(...lengths);
  const min = Math.min(...lengths);
  return max <= 30 && max <= min * 1.7;
}

/* Questions the heuristic reads wrong, corrected by hand. The heuristic
   scores structure — it cannot see that "One third" is a number or that
   four saints' days are four dates written as words. */
const HARDER = new Set([
  42,   // proportion who died in the Black Death — four fractions in words
  73,   // 1928 vs 1918: the two dates everyone mixes up
  104, 105, // saints' days — four dates written as words
  110,  // which two are bank holidays
  118,  // how many times London hosted the Olympics
  137, 155, 171, 254, // the age questions: 16, 17, 18 and 21 all look plausible
  157, 158, 163, 164, // Commonwealth 54, Security Council 5, jury 12/15, age of responsibility 10/12
  161, 162, 165, 262, // which court, and how Scotland differs from England
  170,  // 31 January vs 31 October
  215,  // which century the Black Death arrived
  265, 266, // 999 / 112 / 101 / 111
]);

const EASIER = new Set([
  13,   // how many countries make up the UK
  17, 18, 205, // capital cities
  48,   // how many wives Henry VIII had
  111, 112, 242, 244, // the sports everybody already knows
  132, 134, 239, // Ben Nevis, the pound, Christmas Day
  256,  // who is head of state
]);

/**
 * Tier a question from 1 (foundations) to 3 (hard).
 * @param {{i:number,c:number,q:string,o:string[],a:number[]}} q
 * @returns {1|2|3}
 */
export function difficultyOf(q) {
  let score = 0;
  if (q.a.length > 1) score += 2;            // "choose two" — two chances to slip
  if (q.o.length === 2) score -= 2;          // true or false — a coin flip at worst
  if (q.o.every(looksNumeric)) score += 2;   // four dates to tell apart
  if (/\bNOT\b/.test(q.q)) score += 1;       // negatives trip people up
  if (q.q.length > 95) score += 1;           // a long stem is more to hold in mind
  if (q.c === 3) score += 1;                 // history carries the most detail
  if (q.c === 1 || q.c === 2) score -= 1;    // the two short, plain chapters
  if (giveawayLength(q)) score -= 1;
  if (tightSet(q)) score += 1;
  if (HARDER.has(q.i)) score += 2;
  if (EASIER.has(q.i)) score -= 2;
  return score < 0 ? 1 : score < 2 ? 2 : 3;
}

/* ------------------------------------------------------------
   THE PATH

   Eight levels. Difficulty climbs on four axes at once, so the
   ladder still gets steeper even where the pass bar dips:

     tier      1 → 2 → 3        which questions you are shown
     length    8 → 24           how long you have to hold it together
     clock     none → 45 min    whether time is against you
     feedback  instant → end    whether you get told as you go

   Level 7 is a real mock at the real pass mark. Level 8 is the same
   length, drawn from the harder tiers and weighted to whatever this
   particular student keeps getting wrong, at 21 out of 24 — deliberately
   above the real 18, so that clearing it means something.
   ------------------------------------------------------------ */

export const LEVELS = [
  { n: 1, len: 8,  need: 6,  tiers: [1],       secs: 0,       instant: true },
  { n: 2, len: 10, need: 8,  tiers: [1, 2],    secs: 0,       instant: true },
  { n: 3, len: 12, need: 9,  tiers: [2],       secs: 0,       instant: true },
  { n: 4, len: 15, need: 12, tiers: [2],       secs: 12 * 60, instant: false },
  { n: 5, len: 18, need: 14, tiers: [2, 3],    secs: 18 * 60, instant: false },
  { n: 6, len: 20, need: 16, tiers: [3],       secs: 22 * 60, instant: false },
  { n: 7, len: 24, need: 18, tiers: [1, 2, 3], secs: 45 * 60, instant: false, examMix: true },
  { n: 8, len: 24, need: 21, tiers: [2, 3],    secs: 45 * 60, instant: false, examMix: true, weak: true },
];

export const LAST_LEVEL = LEVELS[LEVELS.length - 1].n;

export function levelByNumber(n) {
  return LEVELS.find((l) => l.n === n) || null;
}

/* progress: { [levelNumber]: { passed, best, attempts, last } } */

export function isUnlocked(n, progress = {}) {
  if (n === 1) return true;
  const prev = progress[n - 1];
  return !!(prev && prev.passed);
}

/** The level the student should play next: the first one not yet passed. */
export function currentLevel(progress = {}) {
  for (const l of LEVELS) {
    if (!(progress[l.n] && progress[l.n].passed)) return l.n;
  }
  return LAST_LEVEL;
}

export function clearedCount(progress = {}) {
  return LEVELS.filter((l) => progress[l.n] && progress[l.n].passed).length;
}

/** True only once every level, including the final one, has been passed. */
export function allCleared(progress = {}) {
  return LEVELS.every((l) => progress[l.n] && progress[l.n].passed);
}

/* ------------------------------------------------------------
   DECK BUILDING

   Selection is weighted, not uniform. A question you have never seen
   is worth showing; a question you got wrong and have not since got
   right twice is worth showing more. On the final level that second
   weight dominates, which is what makes level 8 personal — two
   students reaching it get two different papers.
   ------------------------------------------------------------ */

function weightFor(q, stats, weak) {
  const s = stats[q.i];
  if (!s) return weak ? 1 : 1.6;                 // unseen: worth covering on a normal level
  const attempts = s.r + s.w;
  const accuracy = attempts ? s.r / attempts : 0;
  const unresolved = s.w > 0 && s.s < 2;         // got it wrong, not yet twice right since
  if (weak) return unresolved ? 4 : 1 + (1 - accuracy) * 2;
  return unresolved ? 2.2 : 0.6 + (1 - accuracy);
}

/* Weighted pick without replacement. Jittering each weight and taking the
   top n keeps heavy questions likely without making the same deck twice. */
function sample(pool, n, weight, rand) {
  return pool
    .map((q) => ({ q, k: weight(q) * (0.5 + rand()) }))
    .sort((a, b) => b.k - a.k)
    .slice(0, n)
    .map((x) => x.q);
}

function shuffleWith(arr, rand) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Build the deck for one level.
 * @param {object[]} questions the full bank
 * @param {object} level one of LEVELS
 * @param {object} stats { [qid]: { r, w, s } }
 * @param {() => number} rand injectable for tests
 */
export function buildLevelDeck(questions, level, stats = {}, rand = Math.random) {
  const weak = !!level.weak;
  const inTier = questions.filter((q) => level.tiers.includes(difficultyOf(q)));

  if (level.examMix) {
    // A mock has to keep the real chapter mix. If a chapter cannot fill its
    // share from the level's tiers, fall back to the whole chapter rather
    // than short-changing the paper.
    let out = [];
    for (const ch of [1, 2, 3, 4, 5]) {
      const want = EXAM_MIX[ch];
      let pool = inTier.filter((q) => q.c === ch);
      if (pool.length < want) pool = questions.filter((q) => q.c === ch);
      out = out.concat(sample(pool, want, (q) => weightFor(q, stats, weak), rand));
    }
    return shuffleWith(out, rand);
  }

  const pool = inTier.length >= level.len ? inTier : questions;
  return shuffleWith(sample(pool, level.len, (q) => weightFor(q, stats, weak), rand), rand);
}

/** The untimed quick quiz, weighted the same way a normal level is. */
export function getSmartQuizQuestions(questions, stats = {}, n = 10, rand = Math.random) {
  return shuffleWith(sample(questions, n, (q) => weightFor(q, stats, false), rand), rand);
}

/* ------------------------------------------------------------
   TRANSLATION SHAPE

   Guards the boundary between the app and any translation source:
   a bundled file, a cached entry from an older version, or a model
   reply. A translation with the wrong number of options would put
   the wrong text under the wrong answer, so a bad payload has to
   fail closed and leave the question in English.
   ------------------------------------------------------------ */

export function normaliseTranslation(payload, question, langName) {
  if (!payload || typeof payload !== 'object') return null;
  const qText = typeof payload.q === 'string' ? payload.q.trim() : '';
  const expl = typeof payload.e === 'string' ? payload.e.trim() : '';
  const options = Array.isArray(payload.o) ? payload.o : [];

  if (!qText || !expl || options.length !== (question?.o?.length || 4)) return null;

  const cleaned = options
    .map((opt) => (typeof opt === 'string' ? opt.trim() : ''))
    .filter((opt) => opt.length > 0);

  if (cleaned.length !== options.length) return null;

  return {
    q: qText,
    o: cleaned,
    e: expl,
    lang: langName || 'target language',
  };
}
