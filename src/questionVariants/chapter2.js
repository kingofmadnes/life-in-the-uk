/* ============================================================
   QUESTION VARIANTS — Chapter 2 (What is the UK?)
   One double per base question (i:13-20, 205-208). See chapter1.js
   for the format notes and conventions this file follows.

   Where a "capital city" question kept its exception double, that
   double deliberately draws its false
   option from a DIFFERENT UK country's non-capital city (or a
   non-UK river, for the river question), rather than recycling the
   base question's own wrong options — asking "which of these Welsh
   towns is NOT the Welsh capital" leaves three towns that are all
   correctly "not the capital", which is not a valid single-answer
   question. Crossing countries keeps exactly one wrong answer.
   ============================================================ */

export default [
  // ---- base i:13 — the UK is four countries ----
  { i: 1064, base: 13, variant: "rephrase", c: 2, q: "The United Kingdom is made up of how many countries?", o: ["Four", "Two", "Three", "Five"], a: [0], e: "The UK is made up of England, Scotland, Wales and Northern Ireland." },

  // ---- base i:14 — Great Britain: England, Scotland, Wales ----
  { i: 1068, base: 14, variant: "rephrase", c: 2, q: "Which three countries together make up Great Britain?", o: ["England, Scotland and Wales", "England, Scotland and Northern Ireland", "England and Wales only", "All four UK countries"], a: [0], e: "Great Britain refers to England, Scotland and Wales only. The UK also includes Northern Ireland." },

  // ---- base i:15 — Crown dependencies: Channel Islands + Isle of Man ----
  { i: 1072, base: 15, variant: "rephrase", c: 2, q: "Which TWO of these are Crown dependencies and not part of the UK? (Choose two answers)", o: ["The Channel Islands", "The Isle of Man", "The Isle of Wight", "Anglesey"], a: [0, 1], e: "The Channel Islands and the Isle of Man are Crown dependencies with their own governments; they are not part of the UK." },

  // ---- base i:16 — British overseas territory: Falkland Islands ----
  { i: 1076, base: 16, variant: "rephrase", c: 2, q: "Which of these is a British overseas territory rather than part of the UK?", o: ["The Falkland Islands", "The Isle of Man", "Jersey", "Guernsey"], a: [0], e: "Overseas territories such as the Falkland Islands and St Helena are linked to the UK but are not part of it." },

  // ---- base i:17 — capital of Wales: Cardiff ----
  { i: 1080, base: 17, variant: "rephrase", c: 2, q: "Cardiff is the capital city of which UK country?", o: ["Wales", "Scotland", "Northern Ireland", "England"], a: [0], e: "Cardiff is the capital of Wales; the Senedd (Welsh Parliament) sits in Cardiff Bay." },

  // ---- base i:18 — capital of Northern Ireland: Belfast ----
  { i: 1084, base: 18, variant: "rephrase", c: 2, q: "Belfast is the capital city of which UK country?", o: ["Northern Ireland", "Scotland", "Wales", "England"], a: [0], e: "Belfast is the capital of Northern Ireland. The Northern Ireland Assembly sits at Stormont in Belfast." },

  // ---- base i:19 — TRUE/FALSE: Northern Ireland is NOT part of Great Britain ----
  { i: 1088, base: 19, variant: "rephrase", c: 2, q: "Which of these best describes Northern Ireland's status?", o: ["Part of the UK, but not part of Great Britain", "Part of Great Britain", "Not part of the UK at all", "A Crown dependency"], a: [0], e: "Northern Ireland is part of the UK, but Great Britain means only England, Scotland and Wales." },

  // ---- base i:20 — devolved administrations: Scotland, Wales, NI ----
  { i: 1092, base: 20, variant: "rephrase", c: 2, q: "Which three parts of the UK each have their own devolved administration?", o: ["Scotland, Wales and Northern Ireland", "England, Scotland and Wales", "Scotland, England and Northern Ireland", "Wales, England and Northern Ireland"], a: [0], e: "Scotland, Wales and Northern Ireland each have a devolved government with certain powers transferred from Westminster." },

  // ---- base i:205 — capital of Scotland: Edinburgh ----
  { i: 1096, base: 205, variant: "rephrase", c: 2, q: "Edinburgh is the capital city of which UK country?", o: ["Scotland", "England", "Wales", "Northern Ireland"], a: [0], e: "Edinburgh is the capital; the Scottish Parliament sits at Holyrood there." },

  // ---- base i:206 — TRUE/FALSE: Isle of Man is NOT part of the UK ----
  { i: 1100, base: 206, variant: "rephrase", c: 2, q: "What is the status of the Isle of Man?", o: ["A Crown dependency, not part of the UK", "Part of the UK", "Part of Scotland", "A British overseas territory"], a: [0], e: "The Isle of Man is a Crown dependency with its own government, not part of the UK." },

  // ---- base i:207 — longest river: the Severn ----
  { i: 1104, base: 207, variant: "rephrase", c: 2, q: "Which is the longest river in the UK?", o: ["The Severn", "The Thames", "The Tyne", "The Clyde"], a: [0], e: "The Severn runs for about 220 miles; the Thames is the longest river in England after it." },

  // ---- base i:208 — a large city in Northern Ireland: Londonderry ----
  { i: 1111, base: 208, variant: "exception", c: 2, q: "Which of these is NOT a city in Northern Ireland?", o: ["Leeds", "Belfast", "Londonderry", "Armagh"], a: [0], e: "Belfast, Londonderry and Armagh are all cities in Northern Ireland. Leeds is a city in England." },
];
