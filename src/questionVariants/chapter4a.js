/* ============================================================
   QUESTION VARIANTS — Chapter 4a (Society: population through Burns
   Night, base i:99-111). See chapter1.js for format notes.
   ============================================================ */

export default [
  // ---- base i:99 — England has the largest population ----
  { i: 1538, base: 99, variant: "scenario", c: 4, q: "A friend asks which UK country has the largest share of the population. Which one is it?", o: ["England", "Scotland", "Wales", "Northern Ireland"], a: [0], e: "England has around 84% of the UK's population." },

  // ---- base i:100 — a census every 10 years ----
  { i: 1543, base: 100, variant: "exception", c: 4, q: "Which of these is NOT true about the UK census?", o: ["It is carried out every year", "It counts the whole population", "It is carried out every 10 years", "It is a nationwide count"], a: [0], e: "The UK census is carried out every ten years, not every year." },

  // ---- base i:101 — the flag of St George: red cross on white ----
  { i: 1546, base: 101, variant: "scenario", c: 4, q: "A friend asks what England's patron saint's flag looks like. How would you describe it?", o: ["A red cross on a white background", "A white diagonal cross on a blue background", "A red diagonal cross on a white background", "A dragon on a green and white field"], a: [0], e: "St George is the patron saint of England; his flag is a red cross on white." },

  // ---- base i:102 — the flag of St Andrew: white diagonal cross on blue ----
  { i: 1551, base: 102, variant: "exception", c: 4, q: "Which of these is NOT true about the flag of St Andrew?", o: ["It is called the Union Jack", "It is called the saltire", "It represents Scotland", "It is white on a blue background"], a: [0], e: "St Andrew's flag is called the saltire, representing Scotland. The Union Jack is the combined flag of the whole UK." },

  // ---- base i:103 — which patron saint's flag is NOT in the Union Flag: St David ----
  { i: 1554, base: 103, variant: "scenario", c: 4, q: "A friend asks why Wales isn't represented in the Union Flag design. Whose cross is missing from it?", o: ["St David's", "St George's", "St Andrew's", "St Patrick's"], a: [0], e: "The Union Flag combines the crosses of St George, St Andrew and St Patrick. Wales, and St David's cross, are not represented." },

  // ---- base i:104 — St David's Day, 1 March ----
  { i: 1559, base: 104, variant: "exception", c: 4, q: "Which of these is NOT correctly matched with its patron saint's day?", o: ["St David's Day — 23 April", "St David's Day — 1 March", "St Patrick's Day — 17 March", "St George's Day — 23 April"], a: [0], e: "St David's Day falls on 1 March, not 23 April — 23 April is St George's Day for England." },

  // ---- base i:105 — St Andrew's Day, 30 November ----
  { i: 1562, base: 105, variant: "scenario", c: 4, q: "A friend in Scotland asks on which date their national day, St Andrew's Day, falls. Which date is it?", o: ["30 November", "23 April", "17 March", "1 March"], a: [0], e: "St Andrew's Day, 30 November, is a national day in Scotland." },

  // ---- base i:106 — Bonfire Night, 5 November: the 1605 plot ----
  { i: 1567, base: 106, variant: "exception", c: 4, q: "Which of these is NOT true about Bonfire Night?", o: ["It commemorates a plot that succeeded in destroying Parliament", "It falls on 5 November", "It commemorates a plot from 1605", "Guy Fawkes was involved in the plot it commemorates"], a: [0], e: "The Gunpowder Plot that Bonfire Night commemorates failed — Parliament was not destroyed, and Guy Fawkes was caught before it could be carried out." },

  // ---- base i:107 — Remembrance Day, 11 November: the poppy ----
  { i: 1570, base: 107, variant: "scenario", c: 4, q: "A friend asks what flower is worn every November to remember those who died in war. Which flower is it?", o: ["A poppy", "A rose", "A thistle", "A daffodil"], a: [0], e: "Poppies commemorate those who died in the two world wars and later conflicts, worn around Remembrance Day, 11 November." },

  // ---- base i:108 — Hogmanay: Scottish New Year's Eve ----
  { i: 1575, base: 108, variant: "exception", c: 4, q: "Which of these is NOT true about Hogmanay?", o: ["It is celebrated in Wales as a harvest festival", "It is a Scottish celebration", "It marks New Year's Eve", "2 January is also a bank holiday in Scotland because of it"], a: [0], e: "Hogmanay is Scotland's New Year's Eve celebration — it is not a Welsh harvest festival." },

  // ---- base i:109 — Burns Night: the poet Robert Burns ----
  { i: 1578, base: 109, variant: "scenario", c: 4, q: "A friend asks who is honoured at a Burns Night supper each 25 January. Who is it?", o: ["Robert Burns", "Robert the Bruce", "Robert Louis Stevenson", "Walter Scott"], a: [0], e: "Burns Night suppers celebrate the Scottish poet Robert Burns, who wrote Auld Lang Syne." },

  // ---- base i:110 — two UK-wide bank holidays (choose two) ----
  { i: 1583, base: 110, variant: "exception", c: 4, q: "Which of these is NOT a UK bank holiday?", o: ["Halloween", "Christmas Day", "Good Friday", "New Year's Day"], a: [0], e: "Christmas Day, Good Friday and New Year's Day are all bank holidays. Halloween is widely celebrated but is not an official bank holiday." },

  // ---- base i:111 — the Ashes: cricket against Australia ----
  { i: 1586, base: 111, variant: "scenario", c: 4, q: "A friend asks which country England plays cricket against in the historic Ashes series. Which country is it?", o: ["Australia", "India", "South Africa", "New Zealand"], a: [0], e: "The Ashes series between England and Australia has been played since 1882." },
];
