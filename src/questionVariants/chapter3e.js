/* ============================================================
   QUESTION VARIANTS — Chapter 3e (History: equal voting age through
   the founding of the NHS, base i:73-85). See chapter1.js for
   format notes.
   ============================================================ */

export default [
  // ---- base i:73 — 1928: women get the vote at the same age as men ----
  { i: 1322, base: 73, variant: "scenario", c: 3, q: "A friend asks when women finally got the vote on exactly the same terms as men. What year is that?", o: ["1928", "1918", "1945", "1969"], a: [0], e: "Women over 30 with property got the vote in 1918; full equal voting age came in 1928." },

  // ---- base i:74 — WWI trigger: assassination of Franz Ferdinand ----
  { i: 1327, base: 74, variant: "exception", c: 3, q: "Which of these events is NOT connected to the start of the First World War?", o: ["The invasion of Poland in 1939", "The assassination of Archduke Franz Ferdinand", "Events in Sarajevo in 1914", "A chain of alliances drawing European powers into war"], a: [0], e: "The First World War began in 1914 after the assassination of Franz Ferdinand. The invasion of Poland in 1939 triggered the Second World War instead." },

  // ---- base i:75 — the Somme, 1916: about 60,000 casualties on the first day ----
  { i: 1330, base: 75, variant: "scenario", c: 3, q: "A friend asks roughly how many British casualties there were on the first day of the Somme in 1916. What is the closest figure?", o: ["About 60,000", "About 6,000", "About 600", "About 600,000"], a: [0], e: "The Somme was one of the bloodiest battles of the First World War, with about 60,000 British casualties on its first day alone." },

  // ---- base i:76 — the First World War ends, 11 November 1918 ----
  { i: 1335, base: 76, variant: "exception", c: 3, q: "Which of these dates is NOT connected to the First World War?", o: ["8 May 1945", "11 November 1918", "1914, when the war began", "The 'eleventh hour of the eleventh day of the eleventh month'"], a: [0], e: "The First World War ended on 11 November 1918. 8 May 1945 is VE Day, marking the end of the Second World War in Europe." },

  // ---- base i:77 — 1922: Ireland divided, the Irish Free State formed ----
  { i: 1338, base: 77, variant: "scenario", c: 3, q: "A friend asks what was created in southern Ireland when the country was divided in 1922. What was it called?", o: ["The Irish Free State", "The Republic of Ulster", "The Kingdom of Ireland", "The Irish Commonwealth"], a: [0], e: "The Irish Free State was formed in the south in 1922; six counties in the north stayed in the UK." },

  // ---- base i:78 — Churchill becomes PM in 1940 ----
  { i: 1343, base: 78, variant: "exception", c: 3, q: "Which of these is NOT true about Winston Churchill?", o: ["He founded the National Health Service", "He became Prime Minister in 1940", "He is remembered for his wartime speeches", "He led Britain through most of the Second World War"], a: [0], e: "Churchill led Britain through the Second World War as Prime Minister. The NHS was founded in 1948 by Health Minister Aneurin Bevan, under a different government." },

  // ---- base i:79 — Dunkirk, 1940: over 300,000 evacuated ----
  { i: 1346, base: 79, variant: "scenario", c: 3, q: "A friend asks what happened at Dunkirk in 1940 that involved hundreds of small civilian boats. What was it?", o: ["An evacuation of over 300,000 troops from the beaches", "A successful invasion of France", "A naval victory over the German fleet", "The signing of a peace treaty"], a: [0], e: "Hundreds of civilian boats helped rescue British and French troops from the beaches at Dunkirk in 1940." },

  // ---- base i:80 — the Battle of Britain: the RAF ----
  { i: 1351, base: 80, variant: "exception", c: 3, q: "Which of these aircraft did NOT play a leading role for the RAF in the Battle of Britain?", o: ["The Lancaster bomber", "The Spitfire", "The Hurricane", "Fighter aircraft defending British skies"], a: [0], e: "RAF Spitfires and Hurricanes were the fighters that won the Battle of Britain. The Lancaster was a heavy bomber used later in the war." },

  // ---- base i:81 — D-Day, 6 June 1944 ----
  { i: 1354, base: 81, variant: "scenario", c: 3, q: "A friend asks on what date Allied forces landed in Normandy to begin liberating western Europe. Which date is it?", o: ["6 June 1944", "8 May 1945", "3 September 1939", "11 November 1918"], a: [0], e: "The D-Day landings on 6 June 1944 began the liberation of western Europe from Nazi occupation." },

  // ---- base i:82 — VE Day, 8 May 1945 ----
  { i: 1359, base: 82, variant: "exception", c: 3, q: "Which of these is NOT true about VE Day?", o: ["It marked Japan's surrender", "It fell on 8 May 1945", "It marked victory in Europe", "The war against Japan continued after it"], a: [0], e: "VE Day marked victory in Europe on 8 May 1945 — Japan did not surrender until later, in August 1945." },

  // ---- base i:83 — 1928: Fleming discovers penicillin ----
  { i: 1362, base: 83, variant: "scenario", c: 3, q: "A friend asks which Scottish scientist discovered penicillin. Who was it?", o: ["Sir Alexander Fleming", "Sir Frank Whittle", "Alan Turing", "James Watt"], a: [0], e: "The Scottish scientist Alexander Fleming discovered penicillin in 1928, later developed as an antibiotic." },

  // ---- base i:84 — the Beveridge Report ----
  { i: 1367, base: 84, variant: "exception", c: 3, q: "Which of these is NOT true about the Beveridge Report?", o: ["It was written by Aneurin Bevan", "It was published in 1942", "It was written by William Beveridge", "It proposed the modern welfare state"], a: [0], e: "William Beveridge wrote the report; Aneurin Bevan is a different figure, who later led the creation of the NHS in 1948." },

  // ---- base i:85 — 1948: Aneurin Bevan and the NHS ----
  { i: 1370, base: 85, variant: "scenario", c: 3, q: "A friend asks which government minister is credited with launching the NHS in 1948. Who was it?", o: ["Aneurin Bevan", "William Beveridge", "Winston Churchill", "Clement Attlee, though Bevan led it directly"], a: [0], e: "Health Minister Aneurin Bevan launched the NHS in 1948, providing free healthcare for all at the point of use." },
];
