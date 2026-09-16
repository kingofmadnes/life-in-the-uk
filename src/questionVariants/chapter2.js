/* ============================================================
   QUESTION VARIANTS — Chapter 2 (What is the UK?)
   Four variants per base question (i:13-20, 205-208). See chapter1.js
   for the format notes and conventions this file follows.

   "Capital city" exception variants deliberately draw their false
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
  { i: 1065, base: 13, variant: "truefalse", c: 2, q: "Is this statement TRUE or FALSE? The United Kingdom is made up of four countries.", o: ["True", "False"], a: [0], e: "The UK is made up of England, Scotland, Wales and Northern Ireland." },
  { i: 1066, base: 13, variant: "scenario", c: 2, q: "A friend asks how many separate countries make up the United Kingdom. What do you tell them?", o: ["Four", "Two", "Three", "Five"], a: [0], e: "The UK is made up of England, Scotland, Wales and Northern Ireland." },
  { i: 1067, base: 13, variant: "exception", c: 2, q: "Which of these is NOT one of the four countries that make up the United Kingdom?", o: ["The Republic of Ireland", "England", "Scotland", "Wales"], a: [0], e: "The UK is made up of England, Scotland, Wales and Northern Ireland. The Republic of Ireland is a separate, independent country." },

  // ---- base i:14 — Great Britain: England, Scotland, Wales ----
  { i: 1068, base: 14, variant: "rephrase", c: 2, q: "Which three countries together make up Great Britain?", o: ["England, Scotland and Wales", "England, Scotland and Northern Ireland", "England and Wales only", "All four UK countries"], a: [0], e: "Great Britain refers to England, Scotland and Wales only. The UK also includes Northern Ireland." },
  { i: 1069, base: 14, variant: "truefalse", c: 2, q: "Is this statement TRUE or FALSE? Great Britain is made up of England, Scotland and Wales.", o: ["True", "False"], a: [0], e: "Great Britain refers to England, Scotland and Wales only. The UK also includes Northern Ireland." },
  { i: 1070, base: 14, variant: "scenario", c: 2, q: "Someone mixes up 'the UK' and 'Great Britain' and asks you to explain Great Britain. What is the correct answer?", o: ["England, Scotland and Wales", "England, Scotland, Wales and Northern Ireland", "England and Wales only", "Scotland and Northern Ireland only"], a: [0], e: "Great Britain refers to England, Scotland and Wales only. The UK also includes Northern Ireland." },
  { i: 1071, base: 14, variant: "exception", c: 2, q: "Which of these is NOT part of Great Britain?", o: ["Northern Ireland", "England", "Scotland", "Wales"], a: [0], e: "Great Britain refers to England, Scotland and Wales only. Northern Ireland is part of the UK but not of Great Britain." },

  // ---- base i:15 — Crown dependencies: Channel Islands + Isle of Man ----
  { i: 1072, base: 15, variant: "rephrase", c: 2, q: "Which TWO of these are Crown dependencies and not part of the UK? (Choose two answers)", o: ["The Channel Islands", "The Isle of Man", "The Isle of Wight", "Anglesey"], a: [0, 1], e: "The Channel Islands and the Isle of Man are Crown dependencies with their own governments; they are not part of the UK." },
  { i: 1073, base: 15, variant: "truefalse", c: 2, q: "Is this statement TRUE or FALSE? The Isle of Man is a Crown dependency and not part of the UK.", o: ["True", "False"], a: [0], e: "The Channel Islands and the Isle of Man are Crown dependencies with their own governments; they are not part of the UK." },
  { i: 1074, base: 15, variant: "scenario", c: 2, q: "A friend assumes the Channel Islands and the Isle of Man are part of the UK. Which TWO are actually Crown dependencies outside it? (Choose two answers)", o: ["The Channel Islands", "The Isle of Man", "The Isle of Wight", "Anglesey"], a: [0, 1], e: "The Channel Islands and the Isle of Man are Crown dependencies with their own governments; they are not part of the UK." },
  { i: 1075, base: 15, variant: "exception", c: 2, q: "Which of these IS part of the United Kingdom, unlike the Crown dependencies?", o: ["The Isle of Wight", "The Channel Islands", "The Isle of Man", "Jersey"], a: [0], e: "The Channel Islands and the Isle of Man are Crown dependencies, not part of the UK. The Isle of Wight, by contrast, is part of England." },

  // ---- base i:16 — British overseas territory: Falkland Islands ----
  { i: 1076, base: 16, variant: "rephrase", c: 2, q: "Which of these is a British overseas territory rather than part of the UK?", o: ["The Falkland Islands", "The Isle of Man", "Jersey", "Guernsey"], a: [0], e: "Overseas territories such as the Falkland Islands and St Helena are linked to the UK but are not part of it." },
  { i: 1077, base: 16, variant: "truefalse", c: 2, q: "Is this statement TRUE or FALSE? The Falkland Islands are a British overseas territory.", o: ["True", "False"], a: [0], e: "Overseas territories such as the Falkland Islands and St Helena are linked to the UK but are not part of it." },
  { i: 1078, base: 16, variant: "scenario", c: 2, q: "Someone asks for an example of a British overseas territory that is linked to the UK but not part of it. Which is correct?", o: ["The Falkland Islands", "The Isle of Man", "Jersey", "Guernsey"], a: [0], e: "Overseas territories such as the Falkland Islands and St Helena are linked to the UK but are not part of it." },
  { i: 1079, base: 16, variant: "exception", c: 2, q: "Which of these is a Crown dependency rather than a British overseas territory?", o: ["The Isle of Man", "The Falkland Islands", "St Helena", "Bermuda"], a: [0], e: "The Falkland Islands, St Helena and Bermuda are British overseas territories. The Isle of Man is a Crown dependency instead." },

  // ---- base i:17 — capital of Wales: Cardiff ----
  { i: 1080, base: 17, variant: "rephrase", c: 2, q: "Cardiff is the capital city of which UK country?", o: ["Wales", "Scotland", "Northern Ireland", "England"], a: [0], e: "Cardiff is the capital of Wales; the Senedd (Welsh Parliament) sits in Cardiff Bay." },
  { i: 1081, base: 17, variant: "truefalse", c: 2, q: "Is this statement TRUE or FALSE? Cardiff is the capital city of Wales.", o: ["True", "False"], a: [0], e: "Cardiff is the capital of Wales; the Senedd (Welsh Parliament) sits in Cardiff Bay." },
  { i: 1082, base: 17, variant: "scenario", c: 2, q: "A friend visiting Wales asks which city is the capital. What do you tell them?", o: ["Cardiff", "Swansea", "Newport", "Bangor"], a: [0], e: "Cardiff is the capital of Wales; the Senedd (Welsh Parliament) sits in Cardiff Bay." },
  { i: 1083, base: 17, variant: "exception", c: 2, q: "Which of these is NOT the capital city of a UK country?", o: ["Swansea", "Cardiff", "Edinburgh", "Belfast"], a: [0], e: "Cardiff (Wales), Edinburgh (Scotland) and Belfast (Northern Ireland) are all capital cities. Swansea is a city in Wales but not its capital." },

  // ---- base i:18 — capital of Northern Ireland: Belfast ----
  { i: 1084, base: 18, variant: "rephrase", c: 2, q: "Belfast is the capital city of which UK country?", o: ["Northern Ireland", "Scotland", "Wales", "England"], a: [0], e: "Belfast is the capital of Northern Ireland. The Northern Ireland Assembly sits at Stormont in Belfast." },
  { i: 1085, base: 18, variant: "truefalse", c: 2, q: "Is this statement TRUE or FALSE? Belfast is the capital city of Northern Ireland.", o: ["True", "False"], a: [0], e: "Belfast is the capital of Northern Ireland. The Northern Ireland Assembly sits at Stormont in Belfast." },
  { i: 1086, base: 18, variant: "scenario", c: 2, q: "A colleague asks which city the Northern Ireland Assembly is based in. What do you tell them?", o: ["Belfast", "Londonderry", "Dublin", "Armagh"], a: [0], e: "Belfast is the capital of Northern Ireland. The Northern Ireland Assembly sits at Stormont in Belfast." },
  { i: 1087, base: 18, variant: "exception", c: 2, q: "Which of these is NOT the capital city of a UK country?", o: ["Londonderry", "Belfast", "Cardiff", "Edinburgh"], a: [0], e: "Belfast (Northern Ireland), Cardiff (Wales) and Edinburgh (Scotland) are all capital cities. Londonderry is a large city in Northern Ireland but not its capital." },

  // ---- base i:19 — TRUE/FALSE: Northern Ireland is NOT part of Great Britain ----
  { i: 1088, base: 19, variant: "rephrase", c: 2, q: "Which of these best describes Northern Ireland's status?", o: ["Part of the UK, but not part of Great Britain", "Part of Great Britain", "Not part of the UK at all", "A Crown dependency"], a: [0], e: "Northern Ireland is part of the UK, but Great Britain means only England, Scotland and Wales." },
  { i: 1089, base: 19, variant: "truefalse", c: 2, q: "Is this statement TRUE or FALSE? Great Britain includes Northern Ireland.", o: ["False", "True"], a: [0], e: "Northern Ireland is part of the UK, but Great Britain means only England, Scotland and Wales." },
  { i: 1090, base: 19, variant: "scenario", c: 2, q: "Someone says Northern Ireland is part of Great Britain. How would you correct them?", o: ["Northern Ireland is part of the UK, but Great Britain means only England, Scotland and Wales", "They are correct — Northern Ireland is part of Great Britain", "Northern Ireland is not part of the UK at all", "Great Britain and the UK are exactly the same thing"], a: [0], e: "Northern Ireland is part of the UK, but Great Britain means only England, Scotland and Wales." },
  { i: 1091, base: 19, variant: "exception", c: 2, q: "Which of these is NOT correct about Northern Ireland?", o: ["It is part of Great Britain", "It is part of the United Kingdom", "It has its own devolved assembly", "Its capital is Belfast"], a: [0], e: "Northern Ireland is part of the UK, has a devolved assembly at Stormont, and its capital is Belfast — but Great Britain refers only to England, Scotland and Wales." },

  // ---- base i:20 — devolved administrations: Scotland, Wales, NI ----
  { i: 1092, base: 20, variant: "rephrase", c: 2, q: "Which three parts of the UK each have their own devolved administration?", o: ["Scotland, Wales and Northern Ireland", "England, Scotland and Wales", "Scotland, England and Northern Ireland", "Wales, England and Northern Ireland"], a: [0], e: "Scotland, Wales and Northern Ireland each have a devolved government with certain powers transferred from Westminster." },
  { i: 1093, base: 20, variant: "truefalse", c: 2, q: "Is this statement TRUE or FALSE? Scotland, Wales and Northern Ireland each have a devolved government.", o: ["True", "False"], a: [0], e: "Scotland, Wales and Northern Ireland each have a devolved government with certain powers transferred from Westminster." },
  { i: 1094, base: 20, variant: "scenario", c: 2, q: "A study partner is unsure which parts of the UK have their own devolved government. Which of these is correct?", o: ["Scotland, Wales and Northern Ireland", "England, Scotland and Wales", "Scotland, England and Northern Ireland", "Wales, England and Northern Ireland"], a: [0], e: "Scotland, Wales and Northern Ireland each have a devolved government with certain powers transferred from Westminster." },
  { i: 1095, base: 20, variant: "exception", c: 2, q: "Which part of the UK does NOT have its own devolved administration?", o: ["England", "Scotland", "Wales", "Northern Ireland"], a: [0], e: "Scotland, Wales and Northern Ireland each have a devolved government. England has no separate devolved parliament." },

  // ---- base i:205 — capital of Scotland: Edinburgh ----
  { i: 1096, base: 205, variant: "rephrase", c: 2, q: "Edinburgh is the capital city of which UK country?", o: ["Scotland", "England", "Wales", "Northern Ireland"], a: [0], e: "Edinburgh is the capital; the Scottish Parliament sits at Holyrood there." },
  { i: 1097, base: 205, variant: "truefalse", c: 2, q: "Is this statement TRUE or FALSE? Edinburgh is the capital city of Scotland.", o: ["True", "False"], a: [0], e: "Edinburgh is the capital; the Scottish Parliament sits at Holyrood there." },
  { i: 1098, base: 205, variant: "scenario", c: 2, q: "A friend asks where the Scottish Parliament is based. What do you tell them?", o: ["Edinburgh", "Glasgow", "Aberdeen", "Dundee"], a: [0], e: "Edinburgh is the capital; the Scottish Parliament sits at Holyrood there." },
  { i: 1099, base: 205, variant: "exception", c: 2, q: "Which of these is NOT the capital city of a UK country?", o: ["Glasgow", "Edinburgh", "Cardiff", "Belfast"], a: [0], e: "Edinburgh (Scotland), Cardiff (Wales) and Belfast (Northern Ireland) are all capital cities. Glasgow is Scotland's largest city but not its capital." },

  // ---- base i:206 — TRUE/FALSE: Isle of Man is NOT part of the UK ----
  { i: 1100, base: 206, variant: "rephrase", c: 2, q: "What is the status of the Isle of Man?", o: ["A Crown dependency, not part of the UK", "Part of the UK", "Part of Scotland", "A British overseas territory"], a: [0], e: "The Isle of Man is a Crown dependency with its own government, not part of the UK." },
  { i: 1101, base: 206, variant: "truefalse", c: 2, q: "Is this statement TRUE or FALSE? The Isle of Man has its own government and is not part of the UK.", o: ["True", "False"], a: [0], e: "The Isle of Man is a Crown dependency with its own government, not part of the UK." },
  { i: 1102, base: 206, variant: "scenario", c: 2, q: "Someone assumes the Isle of Man is governed directly from Westminster as part of the UK. Are they correct?", o: ["No — it is a Crown dependency with its own government", "Yes — it is fully part of the UK", "No — it is a British overseas territory", "Yes, but only for tax purposes"], a: [0], e: "The Isle of Man is a Crown dependency with its own government, not part of the UK." },
  { i: 1103, base: 206, variant: "exception", c: 2, q: "Which of these IS part of the United Kingdom, unlike the Isle of Man?", o: ["Wales", "Jersey", "Guernsey", "The Channel Islands"], a: [0], e: "The Isle of Man, Jersey, Guernsey and the Channel Islands generally are Crown dependencies, not part of the UK. Wales, by contrast, is one of the UK's four countries." },

  // ---- base i:207 — longest river: the Severn ----
  { i: 1104, base: 207, variant: "rephrase", c: 2, q: "Which is the longest river in the UK?", o: ["The Severn", "The Thames", "The Tyne", "The Clyde"], a: [0], e: "The Severn runs for about 220 miles; the Thames is the longest river in England after it." },
  { i: 1105, base: 207, variant: "truefalse", c: 2, q: "Is this statement TRUE or FALSE? The Severn is the longest river in the UK.", o: ["True", "False"], a: [0], e: "The Severn runs for about 220 miles; the Thames is the longest river in England after it." },
  { i: 1106, base: 207, variant: "scenario", c: 2, q: "A pub quiz question asks for the UK's longest river. What is the correct answer?", o: ["The Severn", "The Thames", "The Tyne", "The Clyde"], a: [0], e: "The Severn runs for about 220 miles; the Thames is the longest river in England after it." },
  { i: 1107, base: 207, variant: "exception", c: 2, q: "Which of these is NOT a river in the UK?", o: ["The Seine", "The Severn", "The Thames", "The Clyde"], a: [0], e: "The Severn, Thames and Clyde are all rivers in the UK — the Severn is the longest. The Seine is a river in France." },

  // ---- base i:208 — a large city in Northern Ireland: Londonderry ----
  { i: 1108, base: 208, variant: "rephrase", c: 2, q: "Which of these is a large city in Northern Ireland?", o: ["Londonderry", "Swansea", "Leeds", "Dundee"], a: [0], e: "Belfast and Londonderry are the main cities of Northern Ireland." },
  { i: 1109, base: 208, variant: "truefalse", c: 2, q: "Is this statement TRUE or FALSE? Londonderry is a large city in Northern Ireland.", o: ["True", "False"], a: [0], e: "Belfast and Londonderry are the main cities of Northern Ireland." },
  { i: 1110, base: 208, variant: "scenario", c: 2, q: "A friend is planning a trip around Northern Ireland's main cities. Which of these should be on their list?", o: ["Londonderry", "Swansea", "Leeds", "Dundee"], a: [0], e: "Belfast and Londonderry are the main cities of Northern Ireland." },
  { i: 1111, base: 208, variant: "exception", c: 2, q: "Which of these is NOT a city in Northern Ireland?", o: ["Leeds", "Belfast", "Londonderry", "Armagh"], a: [0], e: "Belfast, Londonderry and Armagh are all cities in Northern Ireland. Leeds is a city in England." },
];
