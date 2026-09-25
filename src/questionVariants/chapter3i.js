/* ============================================================
   QUESTION VARIANTS — Chapter 3i (History: the Elizabeth II to
   Charles III transition, base i:276-278). The monarchy's structure
   and powers are covered in chapter 5; this file covers only the
   2022-23 succession itself. See chapter1.js for format notes.
   ============================================================ */

export default [
  // ---- base i:276 — 2022: Elizabeth II dies, Charles III becomes monarch ----
  { i: 2011, base: 276, variant: "scenario", c: 3, q: "A friend asks what happened on 8 September 2022 in the UK. What is the correct answer?", o: ["Queen Elizabeth II died and King Charles III became monarch", "The UK voted to leave the EU", "The Scottish Parliament first met", "King Charles III was crowned"], a: [0], e: "Queen Elizabeth II died on 8 September 2022, and her son became King Charles III that same day. His coronation followed in May 2023." },

  // ---- base i:277 — May 2023: Charles III is crowned ----
  { i: 2012, base: 277, variant: "exception", c: 3, q: "Which of these is NOT true about the coronation of King Charles III?", o: ["It made him king for the first time", "It took place at Westminster Abbey", "It took place in May 2023", "It came months after he had become king"], a: [0], e: "Charles III became king the moment Queen Elizabeth II died in September 2022. The coronation in May 2023 was a ceremony confirming a reign that had already begun." },

  // ---- base i:278 — the longest reign in British history ----
  { i: 2013, base: 278, variant: "scenario", c: 3, q: "A friend asks which monarch had the longest reign in British history. Who was it?", o: ["Queen Elizabeth II", "Queen Victoria", "King George III", "King Henry VIII"], a: [0], e: "Queen Elizabeth II reigned for 70 years, from 1952 to 2022, surpassing Queen Victoria's 64 years." },
];
