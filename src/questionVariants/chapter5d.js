/* ============================================================
   QUESTION VARIANTS — Chapter 5d (Government and law: head of state
   through unlawful discrimination at work, base i:256-265 — the
   first part of EXTRA_Q's chapter 5 questions). See chapter1.js for
   format notes.
   ============================================================ */

export default [
  // ---- base i:256 — the head of state: the monarch ----
  { i: 1935, base: 256, variant: "exception", c: 5, q: "Which of these is NOT true about the UK's head of state and head of government?", o: ["The Prime Minister is head of state", "The monarch is head of state", "The Prime Minister is head of government", "These are two separate roles"], a: [0], e: "The monarch is head of state, not the Prime Minister — the Prime Minister is head of government instead." },

  // ---- base i:257 — a constituency: the area an MP represents ----
  { i: 1938, base: 257, variant: "scenario", c: 5, q: "A friend asks what term describes the geographical area a single MP represents. What is the term?", o: ["A constituency", "A political party", "A government department", "A council ward"], a: [0], e: "A constituency is the area an MP represents; there are 650 constituencies, each electing one MP." },

  // ---- base i:258 — a by-election: held when a seat becomes vacant ----
  { i: 1943, base: 258, variant: "exception", c: 5, q: "Which of these is NOT true about a by-election?", o: ["It is scheduled at fixed five-year intervals like a general election", "It is held when a seat becomes vacant", "It can follow an MP's resignation", "It can follow an MP's death"], a: [0], e: "A by-election is not scheduled at fixed intervals — it happens whenever a seat unexpectedly becomes vacant, unlike the regular five-year cycle of general elections." },

  // ---- base i:259 — a pressure group: influences government policy ----
  { i: 1946, base: 259, variant: "scenario", c: 5, q: "A friend asks what a group campaigning on a single issue, such as the environment, is generally called, and what it does. What is the answer?", o: ["A pressure group, which aims to influence government policy", "An election commission, which runs elections", "A tax authority, which collects taxes", "A judicial panel, which appoints judges"], a: [0], e: "A pressure group aims to influence government policy on a particular issue, representing the views of British citizens on that cause." },

  // ---- base i:260 — two sources of UK law: Acts of Parliament and case law ----
  { i: 1951, base: 260, variant: "exception", c: 5, q: "Which of these is NOT one of the two main sources of UK law?", o: ["Royal decrees issued personally by the monarch", "Acts of Parliament", "Case law", "Judges' interpretations building up as common law"], a: [0], e: "UK law comes from Acts of Parliament and case law — the monarch does not personally issue binding royal decrees that create law today." },

  // ---- base i:261 — legal aid: a solicitor or barrister for serious criminal charges ----
  { i: 1954, base: 261, variant: "scenario", c: 5, q: "A friend facing a serious criminal charge cannot afford a lawyer. What support might be available to them?", o: ["Legal aid, paying for a solicitor or barrister", "A police officer will represent them", "A magistrate will represent them", "No support is available"], a: [0], e: "Legal aid may pay for a solicitor or barrister, depending on your circumstances and the case." },

  // ---- base i:262 — Scotland: serious crime heard in the High Court of Justiciary or Sheriff Court ----
  { i: 1959, base: 262, variant: "exception", c: 5, q: "Which of these is NOT true about serious criminal cases in Scotland?", o: ["They are heard in the Crown Court, as in England", "They are heard in the High Court of Justiciary or Sheriff Court", "Scotland has its own separate legal system", "Scotland's courts differ from those in England and Wales"], a: [0], e: "Scotland does not use the Crown Court — that is the system used in England, Wales and Northern Ireland. Scotland has its own separate courts instead." },

  // ---- base i:263 — problems with a paid-for product or service: the County Court ----
  { i: 1962, base: 263, variant: "scenario", c: 5, q: "A friend has a dispute with a company over a faulty product they paid for. What is the correct route to pursue it?", o: ["The County Court or a small claims procedure", "Reporting it to the police", "Appealing directly to Parliament", "The Crown Court"], a: [0], e: "Small claims over paid-for products or services are handled in County Courts in England, Wales and Northern Ireland, and Sheriff Courts in Scotland." },

  // ---- base i:264 — two unlawful forms of discrimination at work (choose two) ----
  { i: 1967, base: 264, variant: "exception", c: 5, q: "Which of these is NOT unlawful discrimination under the Equality Act?", o: ["Paying more experienced staff a higher wage", "Discrimination because of race", "Discrimination because of disability", "Discrimination because of religion"], a: [0], e: "Paying more for greater experience is a legitimate pay decision, not discrimination — the Equality Act protects against discrimination on grounds like race, disability and religion instead." },

  // ---- base i:265 — the emergency number: 999 or 112 ----
  { i: 1970, base: 265, variant: "scenario", c: 5, q: "A friend new to the UK asks which number to call in a genuine emergency needing police, fire or ambulance. Which number is it?", o: ["999 or 112", "911", "101", "111"], a: [0], e: "999 or 112 are the emergency numbers in the UK; 101 and 111 are for non-emergency matters instead." },
];
