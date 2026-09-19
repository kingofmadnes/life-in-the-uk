/* ============================================================
   QUESTION VARIANTS — Chapter 3a (History: Early Britain through
   Alfred the Great, base i:21-33). Chapter 3 is split across several
   files (3a-3h) purely because of its size — 106 base questions is
   too many for one comfortable file. See chapter1.js for format
   notes and conventions.
   ============================================================ */

export default [
  // ---- base i:21 — first people: hunter-gatherers ----
  { i: 1112, base: 21, variant: "rephrase", c: 3, q: "What best describes the first people to live in Britain?", o: ["Hunter-gatherers", "Farmers", "Traders", "Soldiers"], a: [0], e: "Britain's first inhabitants were hunter-gatherers who came and went depending on the climate." },

  // ---- base i:22 — land bridge flooded ~10,000 years ago ----
  { i: 1116, base: 22, variant: "rephrase", c: 3, q: "Roughly how long ago did the land bridge connecting Britain to the European continent flood?", o: ["About 10,000 years ago", "About 1,000 years ago", "About 100,000 years ago", "About 500 years ago"], a: [0], e: "About 10,000 years ago the land bridge to the continent flooded, making Britain permanently an island." },

  // ---- base i:23 — Skara Brae, Orkney ----
  { i: 1122, base: 23, variant: "scenario", c: 3, q: "A friend interested in archaeology asks which Orkney site shows what Stone Age life was like. What do you tell them?", o: ["Skara Brae", "Stonehenge", "Maiden Castle", "Hadrian's Wall"], a: [0], e: "Skara Brae on Orkney gives archaeologists a detailed picture of Stone Age life." },

  // ---- base i:24 — Maiden Castle: Iron Age hill fort ----
  { i: 1124, base: 24, variant: "rephrase", c: 3, q: "Maiden Castle in Dorset is an example of what kind of site?", o: ["An Iron Age hill fort", "A Roman villa", "A Norman castle", "A Viking settlement"], a: [0], e: "Maiden Castle is a large Iron Age hill fort. Bronze Age people also built round houses and burial mounds." },

  // ---- base i:25 — 55 BC: Julius Caesar's unsuccessful invasion ----
  { i: 1128, base: 25, variant: "rephrase", c: 3, q: "In which year did Julius Caesar attempt an invasion of Britain that failed?", o: ["55 BC", "AD 43", "AD 122", "AD 410"], a: [0], e: "Caesar's raid of 55 BC failed. The successful Roman invasion came in AD 43 under Emperor Claudius." },

  // ---- base i:26 — Boudicca ----
  { i: 1135, base: 26, variant: "exception", c: 3, q: "Which of these did NOT lead a rebellion or unification of kingdoms in early British history?", o: ["Julius Caesar", "Boudicca", "Alfred the Great", "Kenneth MacAlpin"], a: [0], e: "Boudicca led a revolt against Rome, Alfred defeated the Vikings, and Kenneth MacAlpin united Scotland. Julius Caesar was a Roman invader, not a British leader." },

  // ---- base i:27 — Hadrian's Wall ----
  { i: 1136, base: 27, variant: "rephrase", c: 3, q: "What was the main purpose of Hadrian's Wall?", o: ["To keep out tribes such as the Picts from the north", "To mark the border with Wales", "To defend against Viking raids", "To protect London"], a: [0], e: "Emperor Hadrian ordered the wall built in AD 122 to protect the northern frontier of Roman Britain." },

  // ---- base i:28 — AD 410: the Romans leave ----
  { i: 1143, base: 28, variant: "exception", c: 3, q: "Which of these is NOT a reason connected to why the Romans withdrew from Britain in AD 410?", o: ["They were defeated by the Vikings", "They needed to defend other parts of their empire", "Pressure was growing elsewhere in the Roman Empire", "Roman rule in Britain formally ended"], a: [0], e: "The Romans withdrew in AD 410 to defend other parts of their empire — the Vikings did not raid Britain until AD 789, long after Rome had left." },

  // ---- base i:29 — Jutes, Angles and Saxons invade after the Romans ----
  { i: 1144, base: 29, variant: "rephrase", c: 3, q: "Which peoples invaded and settled in Britain after the Romans left?", o: ["The Jutes, Angles and Saxons", "The Normans and Franks", "The Picts and Scots only", "The Spanish and Portuguese"], a: [0], e: "The Anglo-Saxons — Jutes, Angles and Saxons — came from northern Europe and settled in Britain." },

  // ---- base i:30 — Sutton Hoo: Anglo-Saxon king's ship burial ----
  { i: 1148, base: 30, variant: "rephrase", c: 3, q: "Sutton Hoo in East Anglia is the burial place of whom?", o: ["An Anglo-Saxon king", "A Roman general", "A Viking chief", "A Norman knight"], a: [0], e: "The ship burial at Sutton Hoo is believed to be that of an Anglo-Saxon king or great warrior." },

  // ---- base i:31 — St Augustine: first Archbishop of Canterbury ----
  { i: 1154, base: 31, variant: "scenario", c: 3, q: "A friend asks who was sent from Rome in 597 to convert the Anglo-Saxons to Christianity. Who was it?", o: ["St Augustine", "St Columba", "St Patrick", "St Andrew"], a: [0], e: "St Augustine arrived in 597 and became the first Archbishop of Canterbury." },

  // ---- base i:32 — AD 789: first Viking raids ----
  { i: 1159, base: 32, variant: "exception", c: 3, q: "Which of these dates is NOT connected to the Vikings in Britain?", o: ["AD 1215", "AD 789", "The Danelaw period in the east and north", "King Alfred's later victories over them"], a: [0], e: "The Vikings first raided in AD 789 and later controlled the Danelaw until Alfred the Great defeated them. AD 1215 is the year of Magna Carta, unconnected to the Vikings." },

  // ---- base i:33 — Alfred the Great defeats the Vikings ----
  { i: 1162, base: 33, variant: "scenario", c: 3, q: "A friend asks which Anglo-Saxon king is remembered for defeating the Vikings. Who was it?", o: ["Alfred the Great", "Harold", "Cnut", "William of Normandy"], a: [0], e: "King Alfred the Great defeated the Vikings, though they remained in control of the Danelaw in the east and north." },
];
