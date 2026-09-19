/* ============================================================
   QUESTION VARIANTS — Chapter 5e (Government and law: non-emergency
   medical advice through the responsibilities of every working UK
   resident, base i:266-275 — the last of EXTRA_Q's chapter 5
   questions, and the last file of the whole project). See
   chapter1.js for format notes.
   ============================================================ */

export default [
  // ---- base i:266 — non-emergency medical advice: 111 ----
  { i: 1975, base: 266, variant: "exception", c: 5, q: "Which of these is NOT the correct number for non-emergency medical advice in England?", o: ["999", "111", "The NHS helpline number", "The number to call when a situation isn't life-threatening"], a: [0], e: "999 is for genuine emergencies — non-emergency medical advice is available through NHS 111 instead." },

  // ---- base i:267 — registering with a doctor: sign up with a local GP surgery ----
  { i: 1978, base: 267, variant: "scenario", c: 5, q: "A friend who has just moved to a new area asks how to register with a doctor there. What should they do?", o: ["Sign up with a local GP surgery", "Apply to the Home Office", "Ask their employer to register them", "Wait until they need hospital treatment"], a: [0], e: "You register with a doctor by signing up with a local GP surgery; GPs are usually the first point of contact for non-emergency health problems." },

  // ---- base i:268 — standing for MP: most people 18+, UK/Irish/eligible Commonwealth citizens ----
  { i: 1983, base: 268, variant: "exception", c: 5, q: "Which of these is NOT disqualified from standing as an MP?", o: ["An eligible Commonwealth citizen aged 18 or over", "A serving member of the armed forces", "A serving civil servant", "A serving prisoner"], a: [0], e: "An eligible Commonwealth citizen aged 18 or over may stand as an MP — members of the armed forces, civil servants and prisoners are the ones disqualified." },

  // ---- base i:269 — a school governor: a volunteer who helps run a school ----
  { i: 1986, base: 269, variant: "scenario", c: 5, q: "A friend wants to get involved with their local school as a form of community participation. What unpaid role could they take on?", o: ["School governor", "Head teacher", "Local council employee", "Government inspector"], a: [0], e: "Becoming a school governor is a voluntary way of helping run a school and taking part in your community." },

  // ---- base i:270 — jury service: attend unless excused for a valid reason ----
  { i: 1991, base: 270, variant: "exception", c: 5, q: "Which of these is NOT true about jury service?", o: ["You can simply pay a fee to avoid attending", "It is a public duty", "You can be excused for a valid reason", "Jurors are selected at random from the electoral register"], a: [0], e: "You cannot simply pay a fee to avoid jury service — it is a public duty, and only a valid reason can excuse you from attending." },

  // ---- base i:271 — the Speaker's constituency work ----
  { i: 1994, base: 271, variant: "scenario", c: 5, q: "A friend asks whether the Speaker of the House of Commons stops representing their constituency once elected Speaker. What is the answer?", o: ["No — the Speaker still represents their constituents as an MP", "Yes — the Speaker gives up their constituency entirely", "Yes — the Speaker instead represents the government", "No — but the Speaker only chairs debates and nothing more"], a: [0], e: "The Speaker remains a constituency MP, continuing to represent their constituents, but must be politically neutral within the Commons chamber." },

  // ---- base i:272 — the House of Lords checks and amends Commons legislation ----
  { i: 1999, base: 272, variant: "exception", c: 5, q: "Which of these is NOT true about the House of Lords' role in scrutinising legislation?", o: ["Its decisions can never be overruled by the Commons", "It can suggest amendments to bills", "It scrutinises legislation from the Commons", "The Commons can ultimately overrule it"], a: [0], e: "The Commons can ultimately overrule the House of Lords — the Lords' decisions on legislation are not final and unchallengeable." },

  // ---- base i:273 — not paying council tax: court action and further costs ----
  { i: 2002, base: 273, variant: "scenario", c: 5, q: "A friend is thinking of simply not paying their council tax bill. What could happen to them as a result?", o: ["They could be taken to court and face further costs", "Nothing — it is entirely voluntary", "Their passport could be withdrawn", "They could be deported"], a: [0], e: "Failing to pay council tax can lead to being taken to court and facing further costs — it is not a voluntary payment." },

  // ---- base i:274 — devolved power: powers transferred to a national or regional body ----
  { i: 2007, base: 274, variant: "exception", c: 5, q: "Which of these is NOT an example of a devolved power?", o: ["Powers held personally by the monarch", "Scotland's control over areas like health", "Wales's control over areas like education", "Northern Ireland's devolved administration powers"], a: [0], e: "Devolved powers are transferred from central government to bodies like the Scottish Parliament — they are not powers held personally by the monarch." },

  // ---- base i:275 — a responsibility of every working UK resident: paying income tax and National Insurance ----
  { i: 2010, base: 275, variant: "scenario", c: 5, q: "A friend starting their first job in the UK asks what financial responsibility they now have as a worker. What is it?", o: ["Paying income tax and National Insurance", "Joining a trade union", "Voting in every election", "Serving as a magistrate"], a: [0], e: "Every UK resident who works has a responsibility to pay income tax and National Insurance, which fund public services such as roads, schools and the NHS." },
];
