/* ============================================================
   QUESTION VARIANTS — Chapter 1 (Values and principles of the UK)

   One double per base question in this chapter (i:1-12, 201-204): a second
   question on the same fact, worded differently. Its `variant`
   field says which framing it uses —
     rephrase   same fact, different wording
     scenario   the fact framed as something to apply, not just recall
     exception  "which of these is NOT..." — the same topic from
                the opposite direction
   — chosen per question as whichever reads least like the original.

   `base` names the original question id; `variant` names the type.
   Neither field is read by quizLogic.js — they exist so a variant's
   origin is traceable by eye, not by re-deriving it from the text.

   Same conventions as BASE_Q/EXTRA_Q: the correct option sits first
   in `o` with `a` pointing at it (randomise() shuffles at render
   time), UK proper nouns are kept exact, and every explanation
   stands on its own rather than assuming the base question was seen.
   ============================================================ */

export default [
  // ---- base i:1 — fundamental principle: the rule of law ----
  { i: 1000, base: 1, variant: "rephrase", c: 1, q: "Which of the following is considered a core principle of life in Britain?", o: ["The rule of law", "Mandatory military service for all adults", "A single official religion", "Government control of the press"], a: [0], e: "The fundamental principles include democracy, the rule of law, individual liberty, tolerance of different faiths and beliefs, and taking part in community life." },

  // ---- base i:2 — two responsibilities: look after family, treat fairly ----
  { i: 1004, base: 2, variant: "rephrase", c: 1, q: "Which TWO of these are expected of people living in the UK? (Choose two answers)", o: ["Treating other people fairly", "Taking care of yourself and your family", "Attending a place of worship every week", "Becoming a member of a political party"], a: [0, 1], e: "Responsibilities include obeying the law, respecting the rights of others, treating people fairly, looking after yourself and your family, and looking after the area you live in." },

  // ---- base i:3 — languages the test can be taken in ----
  { i: 1008, base: 3, variant: "rephrase", c: 1, q: "In which of these language options may a person sit the Life in the UK test?", o: ["English, Welsh or Scottish Gaelic", "English only", "Any official language of the EU", "English or French"], a: [0], e: "The test may be taken in English, Welsh or Scottish Gaelic." },

  // ---- base i:4 — the pledge made at a citizenship ceremony ----
  { i: 1012, base: 4, variant: "rephrase", c: 1, q: "At a citizenship ceremony, alongside the oath or affirmation of allegiance, new citizens also do what?", o: ["Pledge to respect the UK's rights, freedoms and laws", "Promise to join the armed forces", "Make a donation to charity", "Formally give up all other nationalities"], a: [0], e: "New citizens swear or affirm allegiance to the monarch and pledge to respect the UK's rights, freedoms and laws." },

  // ---- base i:5 — TRUE/FALSE: freedom of belief and religion ----
  { i: 1016, base: 5, variant: "rephrase", c: 1, q: "Which of these rights is shared by everyone in the UK?", o: ["Freedom of belief and religion", "The right to avoid paying tax", "The right to free housing", "The right to a state pension at any age"], a: [0], e: "Freedom of belief and religion is one of the rights and freedoms shared by everyone in the UK." },

  // ---- base i:6 — NOT a right or freedom: avoiding tax ----
  { i: 1020, base: 6, variant: "rephrase", c: 1, q: "Which of these is a responsibility rather than a right or freedom in the UK?", o: ["Paying tax", "A fair trial", "Freedom from unfair discrimination", "Freedom of speech"], a: [0], e: "Paying tax is a responsibility, not a freedom. Rights include free speech, freedom of belief, a fair trial and freedom from unfair discrimination." },

  // ---- base i:7 — where citizenship ceremonies take place ----
  { i: 1024, base: 7, variant: "rephrase", c: 1, q: "Who normally organises citizenship ceremonies?", o: ["The local authority", "The Houses of Parliament", "The royal household", "The Home Office directly, with no local involvement"], a: [0], e: "Local authorities arrange citizenship ceremonies, normally within three months of the application being approved." },

  // ---- base i:8 — two things applicants must show ----
  { i: 1028, base: 8, variant: "rephrase", c: 1, q: "Which TWO of these must most applicants for permanent residence or citizenship demonstrate? (Choose two answers)", o: ["That they can speak and read English", "That they understand life in the UK well", "That they own property in the UK", "That they have lived in London"], a: [0, 1], e: "Applicants must show they can speak and read English and that they have a good understanding of life in the UK." },

  // ---- base i:9 — community life as a fundamental principle ----
  { i: 1032, base: 9, variant: "rephrase", c: 1, q: "How is 'taking part in community life' best described?", o: ["A fundamental principle of British life", "A legal requirement for all residents", "Something only citizens may do", "A condition of employment"], a: [0], e: "Participation in community life is listed among the fundamental principles of British life." },

  // ---- base i:10 — TRUE/FALSE: duty to respect and obey the law ----
  { i: 1036, base: 10, variant: "rephrase", c: 1, q: "What is every person in the UK expected to do regarding the law?", o: ["Respect and obey it", "Only follow the laws they personally agree with", "Report any law they dislike to Parliament", "Obey it only once they become a citizen"], a: [0], e: "Respecting and obeying the law is a core responsibility of everyone living in the UK." },

  // ---- base i:11 — what democracy means ----
  { i: 1040, base: 11, variant: "rephrase", c: 1, q: "The UK is described as a democracy. What does that mean in practice?", o: ["Power is held by the people or their elected representatives", "Power is held by the monarch alone", "Power is held by the courts", "Power is held by the army"], a: [0], e: "In a democracy, the people hold power, either directly or through elected representatives." },

  // ---- base i:12 — a responsibility rather than a right: the environment ----
  { i: 1044, base: 12, variant: "rephrase", c: 1, q: "Looking after the environment where you live is an example of what?", o: ["A responsibility", "A right", "A legal privilege reserved for citizens", "An optional courtesy"], a: [0], e: "Caring for the area you live in and the environment is one of the responsibilities of living in the UK." },

  // ---- base i:201 — NOT a fundamental principle: loyalty to a political party ----
  { i: 1048, base: 201, variant: "rephrase", c: 1, q: "Which of these is not among the fundamental principles of British life?", o: ["Loyalty to a particular political party", "Individual liberty", "Democracy", "Tolerance of different faiths and beliefs"], a: [0], e: "The principles are democracy, the rule of law, individual liberty, tolerance of different faiths and beliefs, and participation in community life. Supporting a specific party is not among them." },

  // ---- base i:202 — requirements before applying for citizenship ----
  { i: 1052, base: 202, variant: "rephrase", c: 1, q: "Before applying for permanent residence or citizenship, what must most applicants have done?", o: ["Passed the Life in the UK test and met the English language requirement", "Bought a house in the UK", "Completed a period of military service", "Joined a registered political party"], a: [0], e: "Both requirements must normally be met, unless you are exempt." },

  // ---- base i:203 — TRUE/FALSE: UK is a diverse, welcoming society ----
  { i: 1056, base: 203, variant: "rephrase", c: 1, q: "How would the UK's history of migration best be described?", o: ["A long history of welcoming new arrivals into a diverse society", "A history of discouraging all migration", "A recent phenomenon with no historical precedent", "Limited entirely to the last twenty years"], a: [0], e: "Migration has shaped British society for centuries, from the Anglo-Saxons and Vikings to more recent arrivals." },

  // ---- base i:204 — two ways to protect the local environment ----
  { i: 1060, base: 204, variant: "rephrase", c: 1, q: "Which TWO of these actions help protect the environment where you live? (Choose two answers)", o: ["Recycling your household waste", "Walking or cycling for short journeys", "Leaving rubbish in public parks", "Burning waste in your garden"], a: [0, 1], e: "Looking after the area you live in is one of the responsibilities of living in the UK." },
];
