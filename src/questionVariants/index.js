/* ============================================================
   QUESTION VARIANTS — aggregator

   One file per chapter (each chapter's base questions are numerous
   enough, and four variants apiece, that a single flat file would be
   unwieldy). This file just concatenates them into one array for
   LifeInTheUK.jsx to fold into the main question pool alongside
   BASE_Q and EXTRA_Q.

   A chapter appears here only once every base question in it has all
   four variant types — variants.test.js enforces that, the same
   "never ship partial" rule the qtrans and notes bundles follow.
   ============================================================ */

import CH1 from "./chapter1.js";
import CH2 from "./chapter2.js";
import CH3A from "./chapter3a.js";
import CH3B from "./chapter3b.js";
import CH3C from "./chapter3c.js";

export const VARIANT_Q = [
  ...CH1,
  ...CH2,
  ...CH3A,
  ...CH3B,
  ...CH3C,
];
