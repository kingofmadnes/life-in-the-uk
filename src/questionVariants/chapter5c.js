/* ============================================================
   QUESTION VARIANTS — Chapter 5c (Government and law: the County
   Court through local council funding, base i:165-178 — the last of
   BASE_Q's chapter 5 questions). See chapter1.js for format notes.
   ============================================================ */

export default [
  // ---- base i:165 — the County Court: minor civil disputes ----
  { i: 1878, base: 165, variant: "scenario", c: 5, q: "A friend has a small claims dispute over an unpaid debt. Which court in England or Wales should handle it?", o: ["The County Court", "The Crown Court", "The Magistrates' Court", "The High Court"], a: [0], e: "County Courts deal with civil matters such as debt, personal injury and breach of contract." },

  // ---- base i:166 — Citizens Advice: free, independent advice ----
  { i: 1883, base: 166, variant: "exception", c: 5, q: "Which of these is NOT true about Citizens Advice?", o: ["It is a government department", "It is a network of charities", "It offers free advice", "It is confidential"], a: [0], e: "Citizens Advice is a network of charities, not a government department." },

  // ---- base i:167 — two illegal practices: forced marriage and FGM (choose two) ----
  { i: 1886, base: 167, variant: "scenario", c: 5, q: "A friend confuses forced marriage with arranged marriage. Which TWO of these are actually illegal in the UK? (Choose two answers)", o: ["Forced marriage", "Female genital mutilation", "Arranged marriage with full consent", "Wearing religious dress"], a: [0, 1], e: "Forced marriage and FGM are serious criminal offences. Arranged marriage, where both people consent, is lawful." },

  // ---- base i:168 — National Insurance: funds benefits and the state pension ----
  { i: 1891, base: 168, variant: "exception", c: 5, q: "Which of these is NOT what National Insurance funds?", o: ["Car accident insurance claims", "State benefits", "The state pension", "Programmes almost every worker contributes to"], a: [0], e: "National Insurance funds state benefits and the state pension — car accident cover is a separate, private matter of motor insurance." },

  // ---- base i:169 — PAYE: your employer deducts income tax ----
  { i: 1894, base: 169, variant: "scenario", c: 5, q: "A friend starting an employed job asks who takes care of deducting their income tax under the PAYE system. Who does it?", o: ["Their employer", "They must do it themselves through self-assessment", "Their local council", "Their bank"], a: [0], e: "Under PAYE (Pay As You Earn), the employer deducts income tax from wages; self-employed people usually pay through self-assessment instead." },

  // ---- base i:170 — online self-assessment deadline: 31 January ----
  { i: 1899, base: 170, variant: "exception", c: 5, q: "Which of these is NOT true about self-assessment tax return deadlines?", o: ["The paper deadline is later than the online deadline", "The online deadline is 31 January", "The paper deadline is 31 October", "Paper returns must be filed earlier than online ones"], a: [0], e: "The paper deadline (31 October) comes earlier than the online deadline (31 January), not later." },

  // ---- base i:171 — the driving age: 17 ----
  { i: 1902, base: 171, variant: "scenario", c: 5, q: "A friend turning 17 asks if they can now legally drive a car. What do you tell them?", o: ["Yes — 17 is the legal age to drive a car", "No — the legal age is 18", "No — the legal age is 21", "Yes, but only with a full licence already held"], a: [0], e: "You can drive a car or motorcycle at 17 in the UK, and ride a moped at 16." },

  // ---- base i:172 — the first MOT test: when a car is three years old ----
  { i: 1907, base: 172, variant: "exception", c: 5, q: "Which of these is NOT true about the MOT test?", o: ["Brand new cars need one on the day of purchase", "Cars need their first one at three years old", "MOT tests are required annually after that", "The test checks that a vehicle is roadworthy"], a: [0], e: "A brand new car does not need an MOT immediately — the first test is due only once the car reaches three years old." },

  // ---- base i:173 — two ways of taking part in the community (choose two) ----
  { i: 1910, base: 173, variant: "scenario", c: 5, q: "A friend wants to get more involved locally. Which TWO of these would genuinely count as community participation? (Choose two answers)", o: ["Becoming a school governor", "Volunteering for a charity", "Refusing jury service when called", "Skipping local elections"], a: [0, 1], e: "You can also join a neighbourhood watch, become a magistrate or special constable, or help at a local hospital." },

  // ---- base i:174 — jury service: from the electoral register, 18-70 ----
  { i: 1915, base: 174, variant: "exception", c: 5, q: "Which of these is NOT true about eligibility for jury service?", o: ["Only trained lawyers can serve on a jury", "People are chosen at random from the electoral register", "The eligible age range is roughly 18 to 70", "Jury service is a civic duty"], a: [0], e: "Jurors are ordinary members of the public chosen at random from the electoral register — lawyers are not a special or required category." },

  // ---- base i:175 — drivers must have motor insurance ----
  { i: 1918, base: 175, variant: "scenario", c: 5, q: "A friend asks what they legally need before driving a car on UK roads, besides a licence and road tax. What else is required?", o: ["Motor insurance", "A university degree", "A resident permit", "A parking permit"], a: [0], e: "All drivers must have motor insurance; driving without it is a criminal offence, alongside needing a valid licence and road tax." },

  // ---- base i:176 — complaining about the police ----
  { i: 1923, base: 176, variant: "exception", c: 5, q: "Which of these is NOT a legitimate response if you feel unfairly treated by the police?", o: ["Refusing to obey lawful police instructions from then on", "Making a formal complaint to the police force", "Making a complaint to an independent body", "Using the formal complaints procedure"], a: [0], e: "Refusing to obey lawful instructions is not a legitimate response — the proper route is a formal complaint to the police force or an independent body." },

  // ---- base i:177 — the Police and Crime Commissioner ----
  { i: 1926, base: 177, variant: "scenario", c: 5, q: "A friend asks who is elected by the public to hold local police forces to account in England and Wales. What is that role called?", o: ["A Police and Crime Commissioner", "A senior police officer", "A Home Office civil servant", "A magistrate"], a: [0], e: "Police and Crime Commissioners (PCCs) are elected by the public in England and Wales to hold local police forces to account." },

  // ---- base i:178 — local councils: funded by government and council tax ----
  { i: 1928, base: 178, variant: "rephrase", c: 5, q: "Which of these statements about local council funding is correct?", o: ["Local councils are funded by central government and local council tax", "Local councils are funded only by donations", "Local councils receive no government money", "Local councils are funded by the monarch"], a: [0], e: "Councils provide services such as rubbish collection, libraries and schools." },
];
