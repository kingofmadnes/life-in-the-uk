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
import CH3D from "./chapter3d.js";
import CH3E from "./chapter3e.js";
import CH3F from "./chapter3f.js";
import CH3G from "./chapter3g.js";
import CH3H from "./chapter3h.js";
import CH4A from "./chapter4a.js";
import CH4B from "./chapter4b.js";
import CH4C from "./chapter4c.js";
import CH4D from "./chapter4d.js";
import CH4E from "./chapter4e.js";
import CH5A from "./chapter5a.js";
import CH5B from "./chapter5b.js";
import CH5C from "./chapter5c.js";
import CH5D from "./chapter5d.js";

export const VARIANT_Q = [
  ...CH1,
  ...CH2,
  ...CH3A,
  ...CH3B,
  ...CH3C,
  ...CH3D,
  ...CH3E,
  ...CH3F,
  ...CH3G,
  ...CH3H,
  ...CH4A,
  ...CH4B,
  ...CH4C,
  ...CH4D,
  ...CH4E,
  ...CH5A,
  ...CH5B,
  ...CH5C,
  ...CH5D,
];
