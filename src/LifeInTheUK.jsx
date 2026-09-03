import React, { useState, useEffect, useRef, useMemo } from "react";
import { getAdaptiveQuizBlueprint, getSmartQuizQuestions, normaliseTranslation } from './quizLogic.js';

/* ============================================================
   LIFE IN THE UK — STUDY & MOCK TEST
   Question bank: c = chapter (1-5), a = array of correct indices
   ============================================================ */

const CHAPTERS = [
  { n: 1, name: "Values and principles of the UK", short: "Values" },
  { n: 2, name: "What is the UK?", short: "The UK" },
  { n: 3, name: "A long and illustrious history", short: "History" },
  { n: 4, name: "A modern, thriving society", short: "Society" },
  { n: 5, name: "The UK government, the law and your role", short: "Government" },
];

const BASE_Q = [
  /* ---------- CHAPTER 1 ---------- */
  { i: 1, c: 1, q: "Which of these is a fundamental principle of British life?", o: ["The rule of law", "Compulsory military service", "A single national religion for all", "State control of the press"], a: [0], e: "The fundamental principles include democracy, the rule of law, individual liberty, tolerance of different faiths and beliefs, and taking part in community life." },
  { i: 2, c: 1, q: "Which TWO are things people in the UK are expected to do? (Choose two answers)", o: ["Look after yourself and your family", "Treat others with fairness", "Attend a place of worship weekly", "Join a political party"], a: [0, 1], e: "Responsibilities include obeying the law, respecting the rights of others, treating people fairly, looking after yourself and your family, and looking after the area you live in." },
  { i: 3, c: 1, q: "In which languages can the Life in the UK test be taken?", o: ["English, Welsh or Scottish Gaelic", "English only", "Any official EU language", "English or French"], a: [0], e: "The test may be taken in English, Welsh or Scottish Gaelic." },
  { i: 4, c: 1, q: "At a citizenship ceremony, new citizens take an oath (or affirmation) of allegiance and also make what?", o: ["A pledge to respect the rights, freedoms and laws of the UK", "A promise to serve in the armed forces", "A donation to charity", "A statement renouncing all other nationalities"], a: [0], e: "New citizens swear or affirm allegiance to the monarch and pledge to respect the UK's rights, freedoms and laws." },
  { i: 5, c: 1, q: "Is this statement TRUE or FALSE? The UK offers freedom of belief and religion.", o: ["True", "False"], a: [0], e: "Freedom of belief and religion is one of the rights and freedoms shared by everyone in the UK." },
  { i: 6, c: 1, q: "Which of these is NOT a right or freedom shared by everyone in the UK?", o: ["The right to avoid paying tax", "A right to a fair trial", "Freedom from unfair discrimination", "Freedom of speech"], a: [0], e: "Paying tax is a responsibility, not a freedom. Rights include free speech, freedom of belief, a fair trial and freedom from unfair discrimination." },
  { i: 7, c: 1, q: "Where do citizenship ceremonies usually take place?", o: ["Arranged by the local authority", "At the Houses of Parliament", "At a royal palace", "At the applicant's home"], a: [0], e: "Local authorities arrange citizenship ceremonies, normally within three months of the application being approved." },
  { i: 8, c: 1, q: "Which TWO must applicants for permanent residence or citizenship normally show? (Choose two answers)", o: ["They can speak and read English", "They have a good understanding of life in the UK", "They own property in the UK", "They have lived in London"], a: [0, 1], e: "Applicants must show they can speak and read English and that they have a good understanding of life in the UK." },
  { i: 9, c: 1, q: "Taking part in community life is best described as what?", o: ["A fundamental principle of British life", "A legal requirement for all residents", "Something only citizens may do", "A condition of employment"], a: [0], e: "Participation in community life is listed among the fundamental principles of British life." },
  { i: 10, c: 1, q: "Is this statement TRUE or FALSE? Everyone in the UK has a duty to respect and obey the law.", o: ["True", "False"], a: [0], e: "Respecting and obeying the law is a core responsibility of everyone living in the UK." },
  { i: 11, c: 1, q: "The UK is a democracy. What does this mean?", o: ["Power is held by the people or their elected representatives", "Power is held by the monarch alone", "Power is held by the courts", "Power is held by the army"], a: [0], e: "In a democracy, the people hold power, either directly or through elected representatives." },
  { i: 12, c: 1, q: "Which of these is a responsibility rather than a right?", o: ["Looking after the environment where you live", "Joining in the election of a government", "Freedom from unfair discrimination", "A fair trial"], a: [0], e: "Caring for the area you live in and the environment is one of the responsibilities of living in the UK." },

  /* ---------- CHAPTER 2 ---------- */
  { i: 13, c: 2, q: "How many countries make up the United Kingdom?", o: ["Four", "Two", "Three", "Five"], a: [0], e: "The UK is made up of England, Scotland, Wales and Northern Ireland." },
  { i: 14, c: 2, q: "Which countries form Great Britain?", o: ["England, Scotland and Wales", "England, Scotland and Northern Ireland", "England and Wales only", "All four UK countries"], a: [0], e: "Great Britain refers to England, Scotland and Wales only. The UK also includes Northern Ireland." },
  { i: 15, c: 2, q: "Which TWO are Crown dependencies and NOT part of the UK? (Choose two answers)", o: ["The Channel Islands", "The Isle of Man", "The Isle of Wight", "Anglesey"], a: [0, 1], e: "The Channel Islands and the Isle of Man are Crown dependencies with their own governments; they are not part of the UK." },
  { i: 16, c: 2, q: "Which of these is a British overseas territory?", o: ["The Falkland Islands", "The Isle of Man", "Jersey", "Guernsey"], a: [0], e: "Overseas territories such as the Falkland Islands and St Helena are linked to the UK but are not part of it." },
  { i: 17, c: 2, q: "What is the capital city of Wales?", o: ["Cardiff", "Swansea", "Newport", "Bangor"], a: [0], e: "Cardiff is the capital of Wales; the Senedd (Welsh Parliament) sits in Cardiff Bay." },
  { i: 18, c: 2, q: "What is the capital city of Northern Ireland?", o: ["Belfast", "Londonderry", "Dublin", "Armagh"], a: [0], e: "Belfast is the capital of Northern Ireland. The Northern Ireland Assembly sits at Stormont in Belfast." },
  { i: 19, c: 2, q: "Is this statement TRUE or FALSE? Northern Ireland is part of Great Britain.", o: ["False", "True"], a: [0], e: "Northern Ireland is part of the UK, but Great Britain means only England, Scotland and Wales." },
  { i: 20, c: 2, q: "Which three parts of the UK have devolved administrations?", o: ["Scotland, Wales and Northern Ireland", "England, Scotland and Wales", "Scotland, England and Northern Ireland", "Wales, England and Northern Ireland"], a: [0], e: "Scotland, Wales and Northern Ireland each have a devolved government with certain powers transferred from Westminster." },

  /* ---------- CHAPTER 3: HISTORY ---------- */
  { i: 21, c: 3, q: "What were the first people to live in Britain?", o: ["Hunter-gatherers", "Farmers", "Traders", "Soldiers"], a: [0], e: "Britain's first inhabitants were hunter-gatherers who came and went depending on the climate." },
  { i: 22, c: 3, q: "Britain stopped being connected to the continent by a land bridge roughly how long ago?", o: ["10,000 years ago", "1,000 years ago", "100,000 years ago", "500 years ago"], a: [0], e: "About 10,000 years ago the land bridge to the continent flooded, making Britain permanently an island." },
  { i: 23, c: 3, q: "Which prehistoric site in Orkney is one of the best preserved Stone Age villages in northern Europe?", o: ["Skara Brae", "Stonehenge", "Maiden Castle", "Sutton Hoo"], a: [0], e: "Skara Brae on Orkney gives archaeologists a detailed picture of Stone Age life." },
  { i: 24, c: 3, q: "Maiden Castle in Dorset is an example of what?", o: ["An Iron Age hill fort", "A Roman villa", "A Norman castle", "A Viking settlement"], a: [0], e: "Maiden Castle is a large Iron Age hill fort. Bronze Age people also built round houses and burial mounds." },
  { i: 25, c: 3, q: "In which year did Julius Caesar lead an unsuccessful invasion of Britain?", o: ["55 BC", "AD 43", "AD 122", "AD 410"], a: [0], e: "Caesar's raid of 55 BC failed. The successful Roman invasion came in AD 43 under Emperor Claudius." },
  { i: 26, c: 3, q: "Which tribal leader led a rebellion against the Romans and has a statue on Westminster Bridge?", o: ["Boudicca", "Caratacus", "Kenneth MacAlpin", "Alfred the Great"], a: [0], e: "Boudicca, queen of the Iceni in eastern England, led a famous revolt against Roman rule." },
  { i: 27, c: 3, q: "Why was Hadrian's Wall built?", o: ["To keep out tribes such as the Picts from the north", "To mark the border with Wales", "To defend against Viking raids", "To protect London"], a: [0], e: "Emperor Hadrian ordered the wall built in AD 122 to protect the northern frontier of Roman Britain." },
  { i: 28, c: 3, q: "In which year did the Roman army leave Britain?", o: ["AD 410", "AD 43", "AD 789", "AD 1066"], a: [0], e: "The Romans withdrew in AD 410 to defend other parts of their empire." },
  { i: 29, c: 3, q: "Which peoples invaded Britain after the Romans left?", o: ["The Jutes, Angles and Saxons", "The Normans and Franks", "The Picts and Scots only", "The Spanish and Portuguese"], a: [0], e: "The Anglo-Saxons — Jutes, Angles and Saxons — came from northern Europe and settled in Britain." },
  { i: 30, c: 3, q: "Sutton Hoo in East Anglia is the burial place of what?", o: ["An Anglo-Saxon king", "A Roman general", "A Viking chief", "A Norman knight"], a: [0], e: "The ship burial at Sutton Hoo is believed to be that of an Anglo-Saxon king or great warrior." },
  { i: 31, c: 3, q: "Who led a mission from Rome that converted the Anglo-Saxons and became the first Archbishop of Canterbury?", o: ["St Augustine", "St Columba", "St Patrick", "St David"], a: [0], e: "St Augustine arrived in 597 and became the first Archbishop of Canterbury. St Columba founded a monastery on Iona." },
  { i: 32, c: 3, q: "In which year did the Vikings first raid Britain?", o: ["AD 789", "AD 410", "AD 1066", "AD 1215"], a: [0], e: "The Vikings first came to raid coastal towns in AD 789 and later settled in parts of Britain." },
  { i: 33, c: 3, q: "Which Anglo-Saxon king defeated the Vikings and united the Anglo-Saxon kingdoms?", o: ["Alfred the Great", "Harold", "Cnut", "Ethelred"], a: [0], e: "King Alfred the Great defeated the Vikings, though they remained in control of the Danelaw in the east and north." },
  { i: 34, c: 3, q: "Who united the Scottish kingdoms and became the first king of Scotland?", o: ["Kenneth MacAlpin", "Robert the Bruce", "William Wallace", "Macbeth"], a: [0], e: "Kenneth MacAlpin united the Picts and Scots into a single kingdom." },
  { i: 35, c: 3, q: "Which battle took place in 1066?", o: ["The Battle of Hastings", "The Battle of Bosworth Field", "The Battle of Bannockburn", "The Battle of Agincourt"], a: [0], e: "At Hastings in 1066 William, Duke of Normandy, defeated King Harold — the last successful foreign invasion of England." },
  { i: 36, c: 3, q: "What is the Bayeux Tapestry?", o: ["An embroidery showing the Norman conquest of England", "A record of land ownership", "A royal charter of rights", "A map of medieval Britain"], a: [0], e: "The Bayeux Tapestry, still on display in France, commemorates the Battle of Hastings and the Norman conquest." },
  { i: 37, c: 3, q: "What was the Domesday Book?", o: ["A survey of the towns, villages and landholdings of England", "A book of religious law", "A list of English kings", "A collection of poetry"], a: [0], e: "William ordered the Domesday Book in 1086 to record who owned land and livestock across England." },
  { i: 38, c: 3, q: "Which English king conquered Wales, building castles such as Conwy and Caernarfon?", o: ["Edward I", "Henry V", "William I", "Richard III"], a: [0], e: "By 1284 Edward I had annexed Wales under the Statute of Rhuddlan and built a ring of great castles." },
  { i: 39, c: 3, q: "At which 1314 battle did Robert the Bruce defeat the English?", o: ["Bannockburn", "Culloden", "Agincourt", "Naseby"], a: [0], e: "The Scots under Robert the Bruce won at Bannockburn in 1314, keeping Scotland independent for centuries." },
  { i: 40, c: 3, q: "Which English king won the Battle of Agincourt in 1415?", o: ["Henry V", "Henry VIII", "Edward III", "Richard II"], a: [0], e: "Henry V's victory at Agincourt came during the Hundred Years War against France." },
  { i: 41, c: 3, q: "The Hundred Years War with France ended in 1453 with England keeping which town?", o: ["Calais", "Paris", "Rouen", "Bordeaux"], a: [0], e: "England lost all its French territories except the port of Calais, itself lost in 1558." },
  { i: 42, c: 3, q: "Roughly what proportion of the population of England died in the Black Death of 1348?", o: ["One third", "One tenth", "One half", "Three quarters"], a: [0], e: "The Black Death killed around a third of England's population and also devastated Scotland and Wales." },
  { i: 43, c: 3, q: "What was Magna Carta?", o: ["A charter limiting the king's power, agreed in 1215", "The first English Bible", "A treaty with France", "A record of landholdings"], a: [0], e: "King John was forced to agree Magna Carta ('the Great Charter') in 1215, establishing that the king was subject to law." },
  { i: 44, c: 3, q: "The Wars of the Roses were fought between which two houses?", o: ["Lancaster and York", "Tudor and Stuart", "Normandy and Anjou", "Wessex and Mercia"], a: [0], e: "The House of Lancaster (red rose) fought the House of York (white rose) for the throne from 1455 to 1485." },
  { i: 45, c: 3, q: "Which battle in 1485 ended the Wars of the Roses?", o: ["The Battle of Bosworth Field", "The Battle of Hastings", "The Battle of the Boyne", "The Battle of Marston Moor"], a: [0], e: "Richard III was killed at Bosworth Field and Henry Tudor became Henry VII, founding the Tudor dynasty." },
  { i: 46, c: 3, q: "Who set up the first printing press in England, in 1476?", o: ["William Caxton", "Geoffrey Chaucer", "Thomas Cromwell", "Robert Burns"], a: [0], e: "William Caxton brought printing to England, making books far more widely available." },
  { i: 47, c: 3, q: "Who wrote The Canterbury Tales?", o: ["Geoffrey Chaucer", "William Shakespeare", "John Milton", "Robert Burns"], a: [0], e: "Chaucer's Canterbury Tales is a collection of poems about a group of pilgrims travelling to Canterbury." },
  { i: 48, c: 3, q: "How many wives did Henry VIII have?", o: ["Six", "Four", "Two", "Eight"], a: [0], e: "Catherine of Aragon, Anne Boleyn, Jane Seymour, Anne of Cleves, Catherine Howard and Catherine Parr — divorced, beheaded, died, divorced, beheaded, survived." },
  { i: 49, c: 3, q: "Why did Henry VIII break away from the Church of Rome?", o: ["The Pope refused to annul his marriage to Catherine of Aragon", "He wanted to invade France", "He wished to raise taxes", "He converted to Judaism"], a: [0], e: "Henry set up the Church of England with himself as its head so he could remarry, beginning the English Reformation." },
  { i: 50, c: 3, q: "Which queen was known as 'Bloody Mary' for persecuting Protestants?", o: ["Mary I", "Mary Queen of Scots", "Elizabeth I", "Queen Anne"], a: [0], e: "Mary I, Henry VIII's daughter, was a devout Catholic who had many Protestants executed." },
  { i: 51, c: 3, q: "In which year was the Spanish Armada defeated?", o: ["1588", "1485", "1666", "1215"], a: [0], e: "The English fleet defeated the Spanish Armada sent by Philip II to invade England in 1588." },
  { i: 52, c: 3, q: "Where was William Shakespeare born?", o: ["Stratford-upon-Avon", "London", "Canterbury", "Edinburgh"], a: [0], e: "Shakespeare was born in Stratford-upon-Avon and later worked at the Globe theatre in London." },
  { i: 53, c: 3, q: "Who became King of England, Wales and Ireland in 1603 while also King of Scotland?", o: ["James VI of Scotland (James I of England)", "Charles I", "Henry VII", "William III"], a: [0], e: "The Union of the Crowns in 1603 brought England and Scotland under one monarch, though they stayed separate countries." },
  { i: 54, c: 3, q: "During the English Civil War, supporters of the king were known as what?", o: ["Cavaliers", "Roundheads", "Jacobites", "Whigs"], a: [0], e: "Royalist Cavaliers fought the Parliamentarian Roundheads from 1642." },
  { i: 55, c: 3, q: "In which year was Charles I executed?", o: ["1649", "1660", "1666", "1688"], a: [0], e: "Charles I was executed in 1649 and England became a republic known as the Commonwealth." },
  { i: 56, c: 3, q: "What title did Oliver Cromwell take?", o: ["Lord Protector", "King of England", "Lord Chancellor", "Prime Minister"], a: [0], e: "Cromwell ruled as Lord Protector until his death in 1658; his son Richard proved unable to govern." },
  { i: 57, c: 3, q: "In which year did the monarchy return under Charles II?", o: ["1660", "1649", "1688", "1707"], a: [0], e: "Parliament invited Charles II to return in 1660, an event known as the Restoration." },
  { i: 58, c: 3, q: "Which TWO disasters struck London in the 1660s? (Choose two answers)", o: ["The Great Plague", "The Great Fire", "The Black Death", "The Spanish Armada"], a: [0, 1], e: "The Great Plague came in 1665 and the Great Fire of London in 1666." },
  { i: 59, c: 3, q: "The Glorious Revolution of 1688 brought which ruler to the throne?", o: ["William of Orange", "Charles II", "George I", "Oliver Cromwell"], a: [0], e: "William of Orange and his wife Mary, James II's daughter, took the throne with no fighting in England." },
  { i: 60, c: 3, q: "What did the Bill of Rights of 1689 establish?", o: ["Limits on the monarch's power and the need for regular Parliaments", "The right to vote for all adults", "Freedom from taxation", "The Church of England"], a: [0], e: "The Bill of Rights confirmed that the monarch must have Parliament's agreement, and required regular Parliaments." },
  { i: 61, c: 3, q: "The Act of Union of 1707 created which kingdom?", o: ["The Kingdom of Great Britain", "The United Kingdom of Great Britain and Ireland", "The Commonwealth", "The Kingdom of England and Wales"], a: [0], e: "Scotland and England joined under one Parliament to form the Kingdom of Great Britain." },
  { i: 62, c: 3, q: "Who is generally regarded as the first Prime Minister of Great Britain?", o: ["Sir Robert Walpole", "William Pitt", "Winston Churchill", "The Duke of Wellington"], a: [0], e: "Sir Robert Walpole served from 1721 to 1742 and is seen as the first Prime Minister." },
  { i: 63, c: 3, q: "At which 1746 battle were the Jacobites defeated?", o: ["Culloden", "Bannockburn", "Naseby", "Bosworth Field"], a: [0], e: "Bonnie Prince Charlie's forces were crushed at Culloden; he fled to Europe." },
  { i: 64, c: 3, q: "Adam Smith and David Hume were leading figures of what?", o: ["The Scottish Enlightenment", "The Industrial Revolution", "The Reformation", "The Restoration"], a: [0], e: "The Enlightenment produced new ideas in politics, philosophy and science, many from Scottish thinkers." },
  { i: 65, c: 3, q: "Who developed the steam engine that helped power the Industrial Revolution?", o: ["James Watt", "Richard Arkwright", "Isaac Newton", "George Stephenson"], a: [0], e: "James Watt, a Scot, improved the steam engine so it could drive machinery in factories and mines." },
  { i: 66, c: 3, q: "In which year did Parliament abolish the slave trade in British ships?", o: ["1807", "1833", "1776", "1215"], a: [0], e: "The trade was abolished in 1807; the Emancipation Act of 1833 abolished slavery throughout the British Empire." },
  { i: 67, c: 3, q: "Which MP campaigned successfully against the slave trade?", o: ["William Wilberforce", "Robert Walpole", "William Gladstone", "Isambard Kingdom Brunel"], a: [0], e: "William Wilberforce, an evangelical Christian, led the parliamentary campaign against slavery." },
  { i: 68, c: 3, q: "Admiral Nelson died at which 1805 sea battle?", o: ["Trafalgar", "Jutland", "The Nile", "Dunkirk"], a: [0], e: "Nelson was killed at Trafalgar; his flagship HMS Victory is preserved in Portsmouth and his column stands in Trafalgar Square." },
  { i: 69, c: 3, q: "Who commanded the British forces that defeated Napoleon at Waterloo in 1815?", o: ["The Duke of Wellington", "Admiral Nelson", "Sir Robert Walpole", "Oliver Cromwell"], a: [0], e: "The Duke of Wellington, later Prime Minister, was known as the Iron Duke." },
  { i: 70, c: 3, q: "How long did Queen Victoria reign?", o: ["From 1837 to 1901", "From 1801 to 1837", "From 1901 to 1936", "From 1760 to 1820"], a: [0], e: "Victoria came to the throne aged 18 in 1837 and reigned for 64 years, a period of huge industrial and imperial expansion." },
  { i: 71, c: 3, q: "Florence Nightingale is famous for her work in which war?", o: ["The Crimean War", "The First World War", "The Boer War", "The Hundred Years War"], a: [0], e: "She nursed at Scutari during the Crimean War and later founded a nursing school at St Thomas' Hospital in London." },
  { i: 72, c: 3, q: "Who founded the Women's Franchise League in 1889 and later led the suffragettes?", o: ["Emmeline Pankhurst", "Florence Nightingale", "Mary Seacole", "Elizabeth Fry"], a: [0], e: "Emmeline Pankhurst campaigned for votes for women; the movement used increasingly militant tactics." },
  { i: 73, c: 3, q: "In which year did women gain the right to vote at the same age as men?", o: ["1928", "1918", "1945", "1969"], a: [0], e: "Women over 30 with property got the vote in 1918; in 1928 women could vote at 21, the same as men." },
  { i: 74, c: 3, q: "Which event triggered the First World War?", o: ["The assassination of Archduke Franz Ferdinand", "The invasion of Poland", "The sinking of the Lusitania", "The Russian Revolution"], a: [0], e: "The Archduke of Austria-Hungary was assassinated in Sarajevo in 1914." },
  { i: 75, c: 3, q: "On the first day of the Battle of the Somme in 1916, British casualties numbered about how many?", o: ["60,000", "6,000", "600", "600,000"], a: [0], e: "The Somme was one of the bloodiest battles of the First World War." },
  { i: 76, c: 3, q: "The First World War ended at 11am on which date?", o: ["11 November 1918", "8 May 1945", "1 September 1939", "6 June 1944"], a: [0], e: "The Armistice took effect on the eleventh hour of the eleventh day of the eleventh month." },
  { i: 77, c: 3, q: "In 1922 Ireland was divided. What was formed in the south?", o: ["The Irish Free State", "The Republic of Ulster", "The Kingdom of Ireland", "The Irish Commonwealth"], a: [0], e: "Six counties in the north stayed in the UK, and the country became the United Kingdom of Great Britain and Northern Ireland." },
  { i: 78, c: 3, q: "Who became Prime Minister in 1940 and led Britain through most of the Second World War?", o: ["Winston Churchill", "Neville Chamberlain", "Clement Attlee", "David Lloyd George"], a: [0], e: "Churchill became Prime Minister in 1940 and was famous for his wartime speeches." },
  { i: 79, c: 3, q: "What happened at Dunkirk in 1940?", o: ["Over 300,000 troops were evacuated from France, many by small boats", "A major naval battle was won", "British forces landed in Normandy", "The RAF defeated the Luftwaffe"], a: [0], e: "Hundreds of civilian boats helped rescue British and French troops from the beaches at Dunkirk." },
  { i: 80, c: 3, q: "The Battle of Britain in 1940 was fought mainly by which force?", o: ["The Royal Air Force", "The Royal Navy", "The Army", "The Home Guard"], a: [0], e: "RAF Spitfires and Hurricanes defeated the German air force, preventing an invasion." },
  { i: 81, c: 3, q: "On what date did Allied forces land in Normandy on D-Day?", o: ["6 June 1944", "8 May 1945", "3 September 1939", "11 November 1918"], a: [0], e: "The D-Day landings began the liberation of western Europe from Nazi occupation." },
  { i: 82, c: 3, q: "VE Day, marking victory in Europe, is celebrated on which date?", o: ["8 May 1945", "6 June 1944", "11 November 1918", "1 January 1945"], a: [0], e: "The war in Europe ended on 8 May 1945; Japan surrendered in August 1945." },
  { i: 83, c: 3, q: "Who discovered penicillin in 1928?", o: ["Sir Alexander Fleming", "Sir Frank Whittle", "Alan Turing", "Sir Isaac Newton"], a: [0], e: "The Scottish scientist Alexander Fleming discovered penicillin, later developed as an antibiotic." },
  { i: 84, c: 3, q: "The report that led to the modern welfare state was written by whom?", o: ["William Beveridge", "Clement Attlee", "Aneurin Bevan", "Winston Churchill"], a: [0], e: "The Beveridge Report of 1942 set out the plan for social security 'from the cradle to the grave'." },
  { i: 85, c: 3, q: "Who led the establishment of the National Health Service in 1948?", o: ["Aneurin Bevan", "William Beveridge", "Winston Churchill", "Margaret Thatcher"], a: [0], e: "Health Minister Aneurin Bevan launched the NHS, providing free healthcare for all at the point of use." },
  { i: 86, c: 3, q: "The ship Empire Windrush, which arrived in 1948, carried workers from where?", o: ["The West Indies", "India", "Ireland", "Poland"], a: [0], e: "Post-war labour shortages led Britain to invite workers from the West Indies and later from India and Pakistan." },
  { i: 87, c: 3, q: "In which year did India, Pakistan and Ceylon (Sri Lanka) become independent?", o: ["1947", "1922", "1966", "1973"], a: [0], e: "Independence for these countries began the rapid decolonisation of the British Empire." },
  { i: 88, c: 3, q: "In which year did the UK join the European Economic Community?", o: ["1973", "1957", "1969", "1992"], a: [0], e: "The UK joined the EEC in 1973 and left the European Union on 31 January 2020." },
  { i: 89, c: 3, q: "Who was the first woman Prime Minister of the UK?", o: ["Margaret Thatcher", "Theresa May", "Emmeline Pankhurst", "Barbara Castle"], a: [0], e: "Margaret Thatcher was Prime Minister from 1979 to 1990, the longest-serving PM of the 20th century." },
  { i: 90, c: 3, q: "What was signed in Northern Ireland in 1998?", o: ["The Belfast (Good Friday) Agreement", "The Act of Union", "The Treaty of Rome", "The Bill of Rights"], a: [0], e: "The agreement led to a power-sharing Northern Ireland Assembly at Stormont." },
  { i: 91, c: 3, q: "In which year did the Scottish Parliament and the Welsh Assembly first meet?", o: ["1999", "1979", "1989", "2007"], a: [0], e: "Referendums in 1997 led to devolved bodies that first met in 1999." },
  { i: 92, c: 3, q: "Alan Turing is best known for what?", o: ["Helping to break German codes and pioneering computer science", "Inventing the jet engine", "Discovering penicillin", "Developing radar"], a: [0], e: "Turing's work at Bletchley Park helped shorten the Second World War, and he is a founder of modern computing." },
  { i: 93, c: 3, q: "Who invented the jet engine?", o: ["Sir Frank Whittle", "Sir Christopher Cockerell", "John Logie Baird", "Sir Bernard Lovell"], a: [0], e: "Sir Frank Whittle, an RAF engineer, patented the turbo jet engine in the 1930s." },
  { i: 94, c: 3, q: "Which battle in 1690 saw William III defeat James II in Ireland?", o: ["The Battle of the Boyne", "The Battle of Culloden", "The Battle of Naseby", "The Battle of Bannockburn"], a: [0], e: "The Battle of the Boyne is still commemorated by some in Northern Ireland today." },
  { i: 95, c: 3, q: "The Habeas Corpus Act of 1679 guaranteed what?", o: ["That no one could be held unlawfully without trial", "The right to vote", "Freedom of the press", "Free schooling"], a: [0], e: "Habeas corpus is a key protection against unlawful imprisonment." },
  { i: 96, c: 3, q: "What were the Highland Clearances?", o: ["Landowners evicting tenants to make way for sheep farming", "The draining of Scottish marshland", "A programme of forest planting", "The removal of Roman ruins"], a: [0], e: "Many Scots were evicted from their homes in the Highlands and emigrated to America and elsewhere." },
  { i: 97, c: 3, q: "In which year did the United Kingdom leave the European Union?", o: ["2020", "2016", "2019", "2021"], a: [0], e: "A referendum was held in 2016 and the UK formally left the EU on 31 January 2020." },
  { i: 98, c: 3, q: "In which year did Queen Elizabeth II come to the throne?", o: ["1952", "1936", "1945", "1960"], a: [0], e: "Elizabeth II reigned from 1952 until 2022 and was the longest-reigning British monarch." },

  /* ---------- CHAPTER 4: SOCIETY ---------- */
  { i: 99, c: 4, q: "Which country of the UK has by far the largest population?", o: ["England", "Scotland", "Wales", "Northern Ireland"], a: [0], e: "England has around 84% of the UK's population." },
  { i: 100, c: 4, q: "How often is a census carried out in the UK?", o: ["Every 10 years", "Every 5 years", "Every year", "Every 20 years"], a: [0], e: "A census of the whole population is taken every ten years." },
  { i: 101, c: 4, q: "Which flag is the cross of St George?", o: ["A red cross on a white background", "A white diagonal cross on a blue background", "A red diagonal cross on a white background", "A yellow cross on a black background"], a: [0], e: "St George is the patron saint of England; his flag is a red cross on white." },
  { i: 102, c: 4, q: "What does the flag of St Andrew look like?", o: ["A white diagonal cross on a blue background", "A red cross on white", "A red dragon on green and white", "A yellow cross on black"], a: [0], e: "St Andrew is the patron saint of Scotland; the saltire is white on blue." },
  { i: 103, c: 4, q: "Which patron saint's flag does NOT appear in the Union Flag?", o: ["St David", "St George", "St Andrew", "St Patrick"], a: [0], e: "The Union Flag combines the crosses of St George, St Andrew and St Patrick. Wales is not represented." },
  { i: 104, c: 4, q: "When is St David's Day?", o: ["1 March", "17 March", "23 April", "30 November"], a: [0], e: "St David (Wales) 1 March, St Patrick (NI) 17 March, St George (England) 23 April, St Andrew (Scotland) 30 November." },
  { i: 105, c: 4, q: "When is St Andrew's Day?", o: ["30 November", "23 April", "17 March", "1 March"], a: [0], e: "St Andrew's Day, 30 November, is a national day in Scotland." },
  { i: 106, c: 4, q: "Bonfire Night on 5 November commemorates what?", o: ["The failed plot to blow up Parliament in 1605", "The end of the First World War", "The Great Fire of London", "The defeat of the Spanish Armada"], a: [0], e: "Guy Fawkes and other conspirators tried to kill the Protestant king by blowing up Parliament." },
  { i: 107, c: 4, q: "What do people wear on Remembrance Day, 11 November?", o: ["A poppy", "A rose", "A thistle", "A daffodil"], a: [0], e: "Poppies commemorate those who died in the two world wars and later conflicts." },
  { i: 108, c: 4, q: "Hogmanay is the celebration of what?", o: ["New Year's Eve in Scotland", "Midsummer in Wales", "Harvest in Northern Ireland", "May Day in England"], a: [0], e: "Hogmanay is a major Scottish celebration; 2 January is also a bank holiday in Scotland." },
  { i: 109, c: 4, q: "Whose life is celebrated on Burns Night, 25 January?", o: ["Robert Burns", "Robert the Bruce", "Rabbie MacAlpin", "Robert Louis Stevenson"], a: [0], e: "Burns Night suppers celebrate the Scottish poet Robert Burns, who wrote Auld Lang Syne." },
  { i: 110, c: 4, q: "Which TWO are bank holidays across the UK? (Choose two answers)", o: ["Christmas Day", "Good Friday", "Halloween", "Valentine's Day"], a: [0, 1], e: "Christmas Day, Boxing Day, New Year's Day, Good Friday, Easter Monday and other public holidays are bank holidays." },
  { i: 111, c: 4, q: "The Ashes is a cricket competition between England and which country?", o: ["Australia", "India", "South Africa", "New Zealand"], a: [0], e: "The Ashes series between England and Australia has been played since 1882." },
  { i: 112, c: 4, q: "Where is the Wimbledon tennis championship held?", o: ["London", "Manchester", "Edinburgh", "Birmingham"], a: [0], e: "The All England Lawn Tennis Championships at Wimbledon is the oldest tennis tournament in the world." },
  { i: 113, c: 4, q: "The Grand National horse race is held at which course?", o: ["Aintree", "Epsom", "Ascot", "Ayr"], a: [0], e: "The Grand National is run at Aintree near Liverpool; the Derby is at Epsom." },
  { i: 114, c: 4, q: "Which Scottish town is known as the home of golf?", o: ["St Andrews", "Aberdeen", "Stirling", "Perth"], a: [0], e: "The modern game developed in Scotland, and St Andrews is its historic home." },
  { i: 115, c: 4, q: "Sir Roger Bannister was the first man to do what?", o: ["Run a mile in under four minutes", "Win five Olympic gold medals", "Sail solo around the world", "Win the Tour de France"], a: [0], e: "Bannister broke the four-minute mile in 1954." },
  { i: 116, c: 4, q: "Sir Steve Redgrave won five gold medals in which sport?", o: ["Rowing", "Cycling", "Athletics", "Sailing"], a: [0], e: "Redgrave won gold at five consecutive Olympic Games." },
  { i: 117, c: 4, q: "Who captained the England football team that won the 1966 World Cup?", o: ["Bobby Moore", "Bobby Charlton", "Ian Botham", "Jackie Stewart"], a: [0], e: "Bobby Moore lifted the World Cup after England beat West Germany at Wembley." },
  { i: 118, c: 4, q: "How many times has London hosted the Olympic Games?", o: ["Three times", "Once", "Twice", "Four times"], a: [0], e: "London hosted the Games in 1908, 1948 and 2012." },
  { i: 119, c: 4, q: "Who composed The Planets?", o: ["Gustav Holst", "Edward Elgar", "Benjamin Britten", "Henry Purcell"], a: [0], e: "Gustav Holst's suite The Planets was first performed in 1918." },
  { i: 120, c: 4, q: "Where are the BBC Proms concerts held?", o: ["The Royal Albert Hall", "The Globe Theatre", "The National Gallery", "Wembley Stadium"], a: [0], e: "The Proms is an eight-week summer season of classical music, ending with the Last Night of the Proms." },
  { i: 121, c: 4, q: "Which artist painted The Hay Wain?", o: ["John Constable", "J M W Turner", "David Hockney", "Thomas Gainsborough"], a: [0], e: "Constable was famous for his landscapes of the English countryside." },
  { i: 122, c: 4, q: "Which prize is awarded for contemporary art at Tate Britain?", o: ["The Turner Prize", "The Booker Prize", "The Mercury Prize", "The Laurence Olivier Award"], a: [0], e: "The Turner Prize, named after J M W Turner, celebrates contemporary British art." },
  { i: 123, c: 4, q: "Who designed St Paul's Cathedral?", o: ["Sir Christopher Wren", "Inigo Jones", "Robert Adam", "Sir Norman Foster"], a: [0], e: "Wren rebuilt St Paul's after the Great Fire of London in 1666." },
  { i: 124, c: 4, q: "'Capability' Brown is famous for designing what?", o: ["Landscape gardens and parks", "Cathedrals", "Steam engines", "Furniture"], a: [0], e: "Lancelot 'Capability' Brown designed sweeping natural-looking gardens around country houses." },
  { i: 125, c: 4, q: "Which prize is awarded each year for the best novel by a writer from the Commonwealth or Ireland?", o: ["The Booker Prize", "The Turner Prize", "The Mercury Prize", "The BAFTA"], a: [0], e: "The Man Booker Prize for Fiction has been awarded since 1968." },
  { i: 126, c: 4, q: "Who wrote Pride and Prejudice?", o: ["Jane Austen", "Charlotte Bronte", "George Eliot", "Mary Shelley"], a: [0], e: "Jane Austen's novels explore marriage and social class in early 19th-century England." },
  { i: 127, c: 4, q: "Where is Poets' Corner?", o: ["Westminster Abbey", "St Paul's Cathedral", "The Tower of London", "Canterbury Cathedral"], a: [0], e: "Many famous poets are buried or commemorated in Poets' Corner in Westminster Abbey." },
  { i: 128, c: 4, q: "Who invented the World Wide Web?", o: ["Sir Tim Berners-Lee", "Alan Turing", "John Logie Baird", "Sir Clive Sinclair"], a: [0], e: "Berners-Lee, a British scientist, invented the World Wide Web in 1989-1990." },
  { i: 129, c: 4, q: "John Logie Baird is known for pioneering what?", o: ["Television", "The telephone", "Radar", "The hovercraft"], a: [0], e: "Baird made the first television transmission in 1926 and the first transatlantic TV transmission in 1928." },
  { i: 130, c: 4, q: "Dolly the sheep, cloned in 1996, was the first mammal cloned from what?", o: ["An adult cell", "An embryo", "A plant cell", "A frozen egg"], a: [0], e: "Sir Ian Wilmut and Keith Campbell cloned Dolly at the Roslin Institute in Edinburgh." },
  { i: 131, c: 4, q: "Which structure in Northern Ireland is linked to the legend of the giant Finn McCool?", o: ["The Giant's Causeway", "The Eden Project", "Snowdonia", "Loch Lomond"], a: [0], e: "The Giant's Causeway is a natural rock formation on the north-east coast of Northern Ireland." },
  { i: 132, c: 4, q: "What is the highest mountain in the UK?", o: ["Ben Nevis", "Snowdon", "Scafell Pike", "Slieve Donard"], a: [0], e: "Ben Nevis in Scotland is the UK's highest mountain; Snowdon is the highest in Wales." },
  { i: 133, c: 4, q: "Where are the Crown Jewels kept?", o: ["The Tower of London", "Buckingham Palace", "Windsor Castle", "Edinburgh Castle"], a: [0], e: "The Tower of London is guarded by Yeoman Warders, known as Beefeaters." },
  { i: 134, c: 4, q: "What is the currency of the UK?", o: ["The pound sterling", "The euro", "The dollar", "The guinea"], a: [0], e: "The pound sterling (£) is divided into 100 pence." },
  { i: 135, c: 4, q: "Which is the established Church in England?", o: ["The Church of England", "The Church of Scotland", "The Roman Catholic Church", "The Methodist Church"], a: [0], e: "The Church of England is Anglican; the monarch is its head and the Archbishop of Canterbury its spiritual leader." },
  { i: 136, c: 4, q: "What is the national church of Scotland?", o: ["The Church of Scotland, a Presbyterian church", "The Church of England", "The Roman Catholic Church", "There is no national church"], a: [0], e: "The Church of Scotland is governed by its General Assembly, chaired by the Moderator." },
  { i: 137, c: 4, q: "At what age can you legally buy alcohol in a pub in the UK?", o: ["18", "16", "21", "17"], a: [0], e: "You must be 18 to buy alcohol. Under-18s may enter a pub with an adult in some circumstances but generally cannot drink alcohol." },
  { i: 138, c: 4, q: "Which TWO are languages spoken in parts of the UK besides English? (Choose two answers)", o: ["Welsh", "Gaelic", "Latin", "Cornish Norse"], a: [0, 1], e: "Welsh is widely spoken in Wales; Gaelic is spoken in parts of Scotland and Northern Ireland." },

  /* ---------- CHAPTER 5: GOVERNMENT AND LAW ---------- */
  { i: 139, c: 5, q: "What kind of system of government does the UK have?", o: ["A constitutional monarchy with a parliamentary democracy", "An absolute monarchy", "A federal republic", "A one-party state"], a: [0], e: "The monarch is head of state but the elected government runs the country." },
  { i: 140, c: 5, q: "How many members of Parliament (MPs) are there in the House of Commons?", o: ["650", "600", "129", "450"], a: [0], e: "Each MP represents a constituency, and there are 650 of them." },
  { i: 141, c: 5, q: "Who chairs debates in the House of Commons?", o: ["The Speaker", "The Prime Minister", "The Lord Chancellor", "The monarch"], a: [0], e: "The Speaker is an MP elected by other MPs in a secret ballot and must be politically neutral." },
  { i: 142, c: 5, q: "Members of the House of Lords are usually known as what?", o: ["Peers", "MPs", "Councillors", "Ministers"], a: [0], e: "Most peers today are life peers, appointed for their lifetime; the Lords also includes bishops and some hereditary peers." },
  { i: 143, c: 5, q: "How often must a general election be held, at a minimum?", o: ["At least every five years", "At least every three years", "At least every seven years", "Every two years"], a: [0], e: "A general election must be held at least every five years." },
  { i: 144, c: 5, q: "What is the electoral system used for UK general elections called?", o: ["First past the post", "Proportional representation", "The single transferable vote", "The alternative vote"], a: [0], e: "The candidate with the most votes in each constituency becomes the MP." },
  { i: 145, c: 5, q: "What is the official home of the Prime Minister?", o: ["10 Downing Street", "11 Downing Street", "Buckingham Palace", "Chequers"], a: [0], e: "The PM lives at 10 Downing Street and also has a country house called Chequers." },
  { i: 146, c: 5, q: "Which minister is responsible for the economy?", o: ["The Chancellor of the Exchequer", "The Home Secretary", "The Foreign Secretary", "The Lord Chancellor"], a: [0], e: "The Chancellor of the Exchequer lives at 11 Downing Street." },
  { i: 147, c: 5, q: "Which minister is responsible for crime, policing and immigration?", o: ["The Home Secretary", "The Foreign Secretary", "The Chancellor of the Exchequer", "The Defence Secretary"], a: [0], e: "The Home Secretary runs the Home Office." },
  { i: 148, c: 5, q: "What is the 'opposition'?", o: ["The second largest party in the House of Commons", "A group of civil servants", "The House of Lords", "Independent MPs only"], a: [0], e: "The Leader of the Opposition leads their party and appoints a shadow cabinet to challenge the government." },
  { i: 149, c: 5, q: "What is the civil service required to be?", o: ["Politically neutral and appointed on merit", "Elected by the public", "Appointed by the monarch", "Members of the governing party"], a: [0], e: "Civil servants support the government of the day whatever their own political views." },
  { i: 150, c: 5, q: "How many members does the Scottish Parliament have?", o: ["129", "650", "90", "60"], a: [0], e: "There are 129 Members of the Scottish Parliament (MSPs), based at Holyrood in Edinburgh." },
  { i: 151, c: 5, q: "Where does the Northern Ireland Assembly meet?", o: ["Stormont, Belfast", "Holyrood, Edinburgh", "Cardiff Bay", "Westminster"], a: [0], e: "The Northern Ireland Assembly has 90 members (MLAs) and works on a power-sharing basis." },
  { i: 152, c: 5, q: "What is the record of debates in Parliament called?", o: ["Hansard", "The Domesday Book", "The Gazette", "The Register"], a: [0], e: "Hansard is published daily and is available in large libraries and online." },
  { i: 153, c: 5, q: "Which of these statements is correct?", o: ["The monarch is politically neutral and does not take sides in politics", "The monarch chooses which laws Parliament passes", "The monarch appoints all MPs", "The monarch leads the largest political party"], a: [0], e: "The monarch is head of state but remains above party politics, meeting the Prime Minister regularly to advise and warn." },
  { i: 154, c: 5, q: "What happens at the State Opening of Parliament each year?", o: ["The monarch reads a speech setting out the government's policies", "MPs elect a new Speaker", "The Budget is announced", "New peers are created"], a: [0], e: "The monarch's speech is written by the government and outlines its plans for the coming year." },
  { i: 155, c: 5, q: "At what age can you vote in a UK general election?", o: ["18", "16", "21", "17"], a: [0], e: "You must be 18 or over and on the electoral register to vote in a general election." },
  { i: 156, c: 5, q: "On election day, polling stations are open from when to when?", o: ["7am to 10pm", "9am to 5pm", "8am to 8pm", "6am to midnight"], a: [0], e: "Polling stations open at 7am and close at 10pm." },
  { i: 157, c: 5, q: "How many member states does the Commonwealth have?", o: ["54", "27", "15", "100"], a: [0], e: "The Commonwealth is a voluntary association of 54 countries; the monarch is its head, and it has no power over members." },
  { i: 158, c: 5, q: "The UK is one of how many permanent members of the UN Security Council?", o: ["Five", "Three", "Ten", "Fifteen"], a: [0], e: "The UK is one of five permanent members and can veto proposals." },
  { i: 159, c: 5, q: "What is the main purpose of NATO?", o: ["To provide collective defence for member countries", "To set trade rules", "To manage the euro", "To protect human rights in Europe"], a: [0], e: "NATO members agree to help each other if they come under attack." },
  { i: 160, c: 5, q: "What does the Council of Europe do?", o: ["Protects human rights in member countries", "Sets the EU budget", "Commands European armed forces", "Issues passports"], a: [0], e: "The Council of Europe is responsible for the European Convention on Human Rights and has no law-making power." },
  { i: 161, c: 5, q: "Which court deals with minor criminal offences in England and Wales?", o: ["The Magistrates' Court", "The Crown Court", "The County Court", "The High Court"], a: [0], e: "Magistrates, also called Justices of the Peace, are unpaid volunteers who hear minor cases without a jury." },
  { i: 162, c: 5, q: "In Scotland, minor criminal offences are usually heard in which court?", o: ["The Justice of the Peace Court", "The Magistrates' Court", "The County Court", "The Crown Court"], a: [0], e: "Scotland has its own legal system, with Justice of the Peace Courts and Sheriff Courts." },
  { i: 163, c: 5, q: "How many people sit on a jury in a Crown Court in England, Wales and Northern Ireland?", o: ["12", "15", "10", "8"], a: [0], e: "Juries have 12 members in England, Wales and Northern Ireland, and 15 in Scotland." },
  { i: 164, c: 5, q: "What is the age of criminal responsibility in England, Wales and Northern Ireland?", o: ["10", "12", "16", "18"], a: [0], e: "It is 10 in England, Wales and Northern Ireland, and 12 in Scotland." },
  { i: 165, c: 5, q: "Which court handles minor civil disputes such as small claims in England and Wales?", o: ["The County Court", "The Crown Court", "The Magistrates' Court", "The Youth Court"], a: [0], e: "County Courts deal with civil matters such as debt, personal injury and breach of contract." },
  { i: 166, c: 5, q: "Which organisation gives free, independent advice on legal and money problems?", o: ["Citizens Advice", "The Home Office", "The Law Society only", "The Crown Prosecution Service"], a: [0], e: "Citizens Advice is a national network of charities offering free confidential advice." },
  { i: 167, c: 5, q: "Which TWO are illegal in the UK? (Choose two answers)", o: ["Forced marriage", "Female genital mutilation", "Arranged marriage between consenting adults", "Wearing religious dress"], a: [0, 1], e: "Forced marriage and FGM are serious criminal offences. Arranged marriage, where both people consent, is lawful." },
  { i: 168, c: 5, q: "What is National Insurance used for?", o: ["Funding state benefits and the state pension", "Insuring your home", "Paying council tax", "Covering car accidents"], a: [0], e: "Almost everybody who works pays National Insurance contributions and needs a National Insurance number." },
  { i: 169, c: 5, q: "Under the PAYE system, who deducts income tax from your wages?", o: ["Your employer", "You, through self-assessment", "Your local council", "Your bank"], a: [0], e: "PAYE stands for Pay As You Earn; self-employed people usually pay tax through self-assessment." },
  { i: 170, c: 5, q: "By what date must an online self-assessment tax return be filed?", o: ["31 January", "31 October", "5 April", "1 January"], a: [0], e: "Paper returns are due by 31 October and online returns by 31 January." },
  { i: 171, c: 5, q: "At what age can you drive a car in the UK?", o: ["17", "16", "18", "21"], a: [0], e: "You can drive a car or motorcycle at 17, and ride a moped at 16." },
  { i: 172, c: 5, q: "When does a car need its first MOT test?", o: ["When it is three years old", "When it is one year old", "When it is five years old", "Immediately when bought"], a: [0], e: "Vehicles over three years old must pass an annual MOT test to be roadworthy." },
  { i: 173, c: 5, q: "Which TWO are ways of taking part in your community? (Choose two answers)", o: ["Serving as a school governor", "Volunteering for a charity", "Refusing jury service", "Avoiding local elections"], a: [0, 1], e: "You can also join a neighbourhood watch, become a magistrate or special constable, or help at a local hospital." },
  { i: 174, c: 5, q: "Who can be called for jury service?", o: ["Anyone on the electoral register aged 18 to 70", "Only lawyers", "Only people over 25", "Only British-born citizens"], a: [0], e: "Jury service is a duty, and people are chosen at random from the electoral register." },
  { i: 175, c: 5, q: "What must all drivers in the UK have?", o: ["Motor insurance", "A university degree", "A resident permit", "A parking permit"], a: [0], e: "Driving without insurance is a criminal offence; you also need a valid licence and road tax." },
  { i: 176, c: 5, q: "If you are stopped by the police and feel you have been treated unfairly, what can you do?", o: ["Make a complaint to the police force or an independent body", "Nothing can be done", "Only complain to your MP", "Refuse to obey any future instructions"], a: [0], e: "The police must obey the law, and there are formal complaints procedures if they do not." },
  { i: 177, c: 5, q: "What is a Police and Crime Commissioner?", o: ["An elected official who oversees local policing priorities", "A senior police officer", "A civil servant in the Home Office", "A judge in a criminal court"], a: [0], e: "PCCs are elected by the public in England and Wales to hold local police forces to account." },
  { i: 178, c: 5, q: "Which of these statements is correct?", o: ["Local councils are funded by central government and local council tax", "Local councils are funded only by donations", "Local councils receive no government money", "Local councils are funded by the monarch"], a: [0], e: "Councils provide services such as rubbish collection, libraries and schools." },
];

/* ============================================================
   STUDY NOTES
   ============================================================ */

const NOTES = [
  {
    c: 1,
    intro: "What Britain expects of you, and what you can expect in return. Short chapter, but a couple of questions usually come from it.",
    sections: [
      { h: "The fundamental principles of British life", p: ["Democracy", "The rule of law", "Individual liberty", "Tolerance of those with different faiths and beliefs", "Participation in community life"] },
      { h: "Your rights", p: ["Freedom of belief and religion", "Freedom of speech", "Freedom from unfair discrimination", "A right to a fair trial", "A right to join in the election of a government"] },
      { h: "Your responsibilities", p: ["Respect and obey the law", "Respect the rights of others, including their right to their own opinions", "Treat others with fairness", "Look after yourself and your family", "Look after the area you live in and the environment"] },
      { h: "Applying to stay", p: ["You must show you can speak and read English", "You must show a good understanding of life in the UK", "The test may be taken in English, Welsh or Scottish Gaelic", "Citizenship ceremonies are arranged by your local authority, usually within three months of approval", "At the ceremony you swear or affirm allegiance to the King and pledge to respect the UK's rights, freedoms and laws"] },
    ],
  },
  {
    c: 2,
    intro: "Easy marks. Learn the difference between 'the UK', 'Great Britain' and 'the British Isles' and you will not lose a point here.",
    sections: [
      { h: "The names", p: ["The UK = England, Scotland, Wales and Northern Ireland", "Great Britain = England, Scotland and Wales only (no Northern Ireland)", "The Channel Islands and the Isle of Man are Crown dependencies — not part of the UK", "Overseas territories such as the Falkland Islands and St Helena are linked to the UK but not part of it"] },
      { h: "Capitals", p: ["England — London", "Scotland — Edinburgh", "Wales — Cardiff", "Northern Ireland — Belfast"] },
      { h: "How it is governed", p: ["The UK Parliament sits at Westminster in London", "Scotland, Wales and Northern Ireland have devolved administrations with some powers of their own", "England has no separate devolved parliament"] },
    ],
  },
  {
    c: 3,
    intro: "The biggest chapter and the source of most test questions. Dates matter. Learn the list below cold and you will recognise most of what comes up.",
    sections: [
      { h: "Early Britain", p: ["Stone Age: first people were hunter-gatherers; the land bridge to Europe flooded about 10,000 years ago", "Skara Brae, Orkney — best preserved prehistoric village in northern Europe", "Bronze Age: round houses, burial mounds, tools and weapons of bronze", "Iron Age: hill forts such as Maiden Castle in Dorset; Celtic languages; first coins"] },
      { h: "The Romans (55 BC – AD 410)", p: ["55 BC — Julius Caesar invades unsuccessfully", "AD 43 — Emperor Claudius leads the successful invasion", "Boudicca, queen of the Iceni, leads a revolt; her statue stands on Westminster Bridge", "AD 122 — Hadrian's Wall built to keep out the Picts", "AD 410 — the Roman army leaves; Scotland and Ireland were never conquered"] },
      { h: "Anglo-Saxons and Vikings", p: ["Jutes, Angles and Saxons settle from northern Europe", "Sutton Hoo — ship burial of an Anglo-Saxon king", "597 — St Augustine arrives and becomes the first Archbishop of Canterbury; St Columba founds a monastery on Iona", "789 — first Viking raids; Danelaw in the east and north", "King Alfred the Great defeats the Vikings", "Kenneth MacAlpin unites the Scottish kingdoms"] },
      { h: "The Norman Conquest and Middle Ages", p: ["1066 — Battle of Hastings: William of Normandy defeats Harold; the last successful foreign invasion", "The Bayeux Tapestry commemorates the conquest", "1086 — the Domesday Book records land and livestock", "1215 — Magna Carta limits the king's power", "1284 — Edward I annexes Wales (Statute of Rhuddlan); castles at Conwy and Caernarfon", "1314 — Robert the Bruce wins the Battle of Bannockburn", "1337–1453 — Hundred Years War; Henry V wins Agincourt in 1415; only Calais is kept", "1348 — the Black Death kills about a third of the population"] },
      { h: "The Tudors and the Reformation", p: ["1455–1485 — Wars of the Roses: Lancaster (red rose) v York (white rose)", "1485 — Battle of Bosworth Field; Henry Tudor becomes Henry VII", "1476 — William Caxton sets up the first printing press in England", "Henry VIII's six wives: divorced, beheaded, died, divorced, beheaded, survived", "Henry VIII breaks with Rome and creates the Church of England", "Mary I ('Bloody Mary') persecutes Protestants; Elizabeth I finds a compromise", "1588 — the Spanish Armada is defeated", "Mary, Queen of Scots is executed after years of imprisonment"] },
      { h: "Stuarts, Civil War and Restoration", p: ["1603 — James VI of Scotland becomes James I of England: the Union of the Crowns", "1642 — Civil War begins: Cavaliers (Royalists) v Roundheads (Parliamentarians)", "1649 — Charles I is executed; England becomes a republic under Oliver Cromwell, Lord Protector", "1660 — the Restoration: Charles II returns", "1665 Great Plague, 1666 Great Fire of London", "1679 — Habeas Corpus Act: no unlawful imprisonment", "1688 — the Glorious Revolution: William of Orange and Mary take the throne", "1689 — Bill of Rights: regular Parliaments, no monarch without Parliament's agreement", "1690 — Battle of the Boyne"] },
      { h: "Union, empire and industry", p: ["1707 — Act of Union creates the Kingdom of Great Britain", "1721 — Sir Robert Walpole becomes the first Prime Minister", "1746 — Jacobites defeated at Culloden; Highland Clearances follow", "The Enlightenment: Adam Smith, David Hume", "Industrial Revolution: James Watt's steam engine, Richard Arkwright's factories, canals and railways", "1801 — Act of Union with Ireland", "1807 — slave trade abolished; 1833 — slavery abolished across the Empire (William Wilberforce)", "1805 — Nelson dies at Trafalgar; 1815 — Wellington defeats Napoleon at Waterloo"] },
      { h: "The Victorian age", p: ["1837–1901 — reign of Queen Victoria; the Empire covers a quarter of the world", "Crimean War 1853–56: Florence Nightingale nurses at Scutari and founds a nursing school in 1860", "Reform Acts of 1832 and 1867 widen the vote", "1889 — Emmeline Pankhurst founds the Women's Franchise League"] },
      { h: "The 20th century", p: ["1914–18 — First World War; the Somme (1916); Armistice 11 November 1918", "1918 — women over 30 with property get the vote; 1928 — equal voting age of 21", "1922 — Ireland is divided; the Irish Free State is formed", "1939–45 — Second World War: Churchill PM in 1940, Dunkirk, the Battle of Britain, the Blitz", "6 June 1944 — D-Day landings; 8 May 1945 — VE Day", "1928 — Alexander Fleming discovers penicillin; Alan Turing breaks codes and pioneers computing; Frank Whittle invents the jet engine", "1942 Beveridge Report; 1948 — NHS founded by Aneurin Bevan", "1948 — Empire Windrush brings workers from the West Indies", "1947 — India, Pakistan and Ceylon become independent", "1973 — UK joins the EEC", "1979 — Margaret Thatcher becomes the first woman Prime Minister", "1998 — Belfast (Good Friday) Agreement", "1999 — Scottish Parliament and Welsh Assembly first meet"] },
      { h: "Recent years", p: ["1952–2022 — reign of Queen Elizabeth II, the longest in British history", "2016 — referendum on EU membership", "31 January 2020 — the UK leaves the European Union"] },
    ],
  },
  {
    c: 4,
    intro: "Culture, sport, customs and famous names. Lots of small facts. Focus on saints' days, sports events, inventors and landmarks.",
    sections: [
      { h: "People and places", p: ["England has about 84% of the UK population", "A census is taken every ten years", "Ben Nevis (Scotland) is the highest mountain in the UK; Snowdon is the highest in Wales", "The Severn is the longest river", "The pound sterling (£) is the currency, divided into 100 pence"] },
      { h: "Patron saints and flags", p: ["St David — Wales — 1 March", "St Patrick — Northern Ireland — 17 March", "St George — England — 23 April", "St Andrew — Scotland — 30 November", "The Union Flag combines the crosses of St George (red on white), St Andrew (white diagonal on blue) and St Patrick (red diagonal on white)", "Wales is not represented in the Union Flag"] },
      { h: "Festivals and customs", p: ["Christmas Day 25 December; Boxing Day 26 December", "New Year's Day 1 January (2 January is also a holiday in Scotland)", "Hogmanay — Scottish New Year's Eve", "Burns Night 25 January — the poet Robert Burns", "Bonfire Night 5 November — the 1605 plot to blow up Parliament (Guy Fawkes)", "Remembrance Day 11 November — poppies are worn", "Also widely celebrated: Diwali, Eid, Vaisakhi, Hanukkah, Easter, Halloween"] },
      { h: "Sport", p: ["Cricket: the Ashes, played against Australia", "Tennis: Wimbledon, the All England Lawn Tennis Championships", "Golf developed in Scotland; St Andrews is its home", "Horse racing: the Grand National at Aintree, the Derby at Epsom, Royal Ascot", "London hosted the Olympics in 1908, 1948 and 2012", "Roger Bannister — first four-minute mile (1954); Bobby Moore — 1966 World Cup captain; Steve Redgrave — five rowing golds; Tanni Grey-Thompson — 11 Paralympic golds"] },
      { h: "Arts and culture", p: ["Music: the Proms at the Royal Albert Hall; Holst (The Planets), Elgar, Britten, Purcell, Handel", "Art: Constable (The Hay Wain), Turner, Gainsborough, Henry Moore, Hockney; the Turner Prize at Tate Britain", "Architecture: Sir Christopher Wren (St Paul's), Inigo Jones, Norman Foster, Zaha Hadid", "Gardens: 'Capability' Brown; the Chelsea Flower Show", "Literature: the Booker Prize; Jane Austen, Charles Dickens, Conan Doyle; Poets' Corner is in Westminster Abbey", "Film: Alfred Hitchcock, David Lean, Ealing comedies, Nick Park; awards are the BAFTAs"] },
      { h: "British inventions", p: ["Television — John Logie Baird", "The World Wide Web — Sir Tim Berners-Lee (1989–90)", "Penicillin — Sir Alexander Fleming", "The jet engine — Sir Frank Whittle", "The hovercraft — Sir Christopher Cockerell", "The structure of DNA — Crick, Watson and Wilkins (1953)", "Cloning: Dolly the sheep, 1996, Roslin Institute", "The cash machine and PIN — James Goodfellow"] },
      { h: "Religion", p: ["The Church of England is the established church; the monarch is its head and the Archbishop of Canterbury its spiritual leader", "The Church of Scotland is Presbyterian and is the national church of Scotland, led by a Moderator", "There is no established church in Wales or Northern Ireland", "The UK is historically Christian but people of all faiths and none live freely"] },
      { h: "Everyday rules", p: ["You must be 18 to buy alcohol or to bet in a betting shop", "You must be 16 to buy a National Lottery ticket", "Under-16s may only enter a pub with an adult, and rules on drinking with a meal vary"] },
    ],
  },
  {
    c: 5,
    intro: "How the country is run and what the law asks of you. Second only to history for the number of questions.",
    sections: [
      { h: "The system", p: ["The UK is a constitutional monarchy and a parliamentary democracy", "The monarch is head of state, is politically neutral, and meets the Prime Minister regularly", "Each year the monarch opens Parliament and reads a speech written by the government", "The national anthem is 'God Save the King'"] },
      { h: "Parliament", p: ["The House of Commons has 650 elected MPs, each representing a constituency", "The House of Lords is made up of peers — mostly life peers, plus bishops and some hereditary peers", "The Speaker chairs Commons debates, is elected by secret ballot by MPs, and must be neutral", "Hansard is the official record of parliamentary debates", "A general election must be held at least every five years, using first past the post"] },
      { h: "Government", p: ["The Prime Minister lives at 10 Downing Street and has a country house at Chequers", "The Chancellor of the Exchequer (11 Downing Street) is responsible for the economy", "The Home Secretary is responsible for crime, policing and immigration", "The Foreign Secretary manages relations with other countries", "The opposition is the second largest party; its leader appoints a shadow cabinet", "Civil servants are politically neutral and appointed on merit"] },
      { h: "Devolved government", p: ["Scottish Parliament — 129 MSPs — Holyrood, Edinburgh", "Senedd (Welsh Parliament) — Cardiff Bay", "Northern Ireland Assembly — 90 MLAs — Stormont, Belfast, on a power-sharing basis", "Elections to the devolved bodies use forms of proportional representation"] },
      { h: "Voting and taking part", p: ["You must be 18 and on the electoral register to vote in a general election", "Polling stations are open from 7am to 10pm on election day", "Ways to take part: volunteering, jury service, school governor, magistrate, special constable, standing for election"] },
      { h: "The UK and the world", p: ["The Commonwealth has 54 member states; the monarch is its head and it has no power over members", "The UK is one of five permanent members of the UN Security Council", "The Council of Europe protects human rights and has no law-making power", "NATO provides collective defence", "The UK left the European Union on 31 January 2020"] },
      { h: "The law", p: ["Criminal law covers offences against society; civil law covers disputes between people or organisations", "Magistrates' Courts (England, Wales, NI) hear minor criminal cases; magistrates are unpaid volunteers", "Scotland uses Justice of the Peace Courts and Sheriff Courts", "Crown Court juries have 12 members; in Scotland juries have 15", "County Courts deal with civil disputes such as debt and breach of contract", "The age of criminal responsibility is 10 in England, Wales and NI, and 12 in Scotland", "Forced marriage, female genital mutilation and domestic violence are crimes"] },
      { h: "Money, work and driving", p: ["Income tax is usually collected through PAYE by your employer", "Self-assessment returns: 31 October on paper, 31 January online", "You need a National Insurance number to work; NI pays for benefits and the state pension", "You can drive a car at 17 and ride a moped at 16", "Motor insurance is compulsory; cars over three years old need an annual MOT"] },
    ],
  },
];

const EXTRA_Q = [
  { i: 201, c: 1, q: "Which of these is NOT one of the fundamental principles of British life?", o: ["Loyalty to a political party", "Individual liberty", "Tolerance of those with different faiths and beliefs", "Democracy"], a: [0], e: "The principles are democracy, the rule of law, individual liberty, tolerance of different faiths and beliefs, and participation in community life." },
  { i: 202, c: 1, q: "What must you do before you can apply for permanent residence or citizenship?", o: ["Pass the Life in the UK test and meet the English language requirement", "Own a home in the UK", "Serve in the armed forces", "Join a registered political party"], a: [0], e: "Both requirements must normally be met, unless you are exempt." },
  { i: 203, c: 1, q: "Is this statement TRUE or FALSE? The UK is a diverse society with a long history of welcoming new arrivals.", o: ["True", "False"], a: [0], e: "Migration has shaped British society for centuries, from the Anglo-Saxons and Vikings to more recent arrivals." },
  { i: 204, c: 1, q: "Which TWO can you do to protect the environment where you live? (Choose two answers)", o: ["Recycle your household waste", "Walk or cycle for short journeys", "Leave rubbish in public parks", "Burn waste in your garden"], a: [0, 1], e: "Looking after the area you live in is one of the responsibilities of living in the UK." },
  { i: 205, c: 2, q: "What is the capital city of Scotland?", o: ["Edinburgh", "Glasgow", "Aberdeen", "Dundee"], a: [0], e: "Edinburgh is the capital; the Scottish Parliament sits at Holyrood there." },
  { i: 206, c: 2, q: "Is this statement TRUE or FALSE? The Isle of Man is part of the United Kingdom.", o: ["False", "True"], a: [0], e: "The Isle of Man is a Crown dependency with its own government, not part of the UK." },
  { i: 207, c: 2, q: "What is the longest river in the UK?", o: ["The Severn", "The Thames", "The Tyne", "The Clyde"], a: [0], e: "The Severn runs for about 220 miles; the Thames is the longest river in England after it." },
  { i: 208, c: 2, q: "Which of these is a large city in Northern Ireland?", o: ["Londonderry", "Swansea", "Leeds", "Dundee"], a: [0], e: "Belfast and Londonderry are the main cities of Northern Ireland." },
  { i: 209, c: 3, q: "Which people built Stonehenge?", o: ["Stone Age and Bronze Age people", "The Romans", "The Vikings", "The Normans"], a: [0], e: "Stonehenge in Wiltshire was probably a place of ceremony, built during the Stone and Bronze Ages." },
  { i: 210, c: 3, q: "What language did the Celts speak?", o: ["Celtic languages, ancestors of Welsh and Gaelic", "Latin", "Old English", "Norse"], a: [0], e: "Celtic languages survive today as Welsh, Gaelic and Cornish." },
  { i: 211, c: 3, q: "Which parts of Britain were never conquered by the Romans?", o: ["Scotland and Ireland", "Wales and Cornwall", "Kent and Sussex", "East Anglia"], a: [0], e: "Roman rule covered England and Wales; Scotland and Ireland remained outside the empire." },
  { i: 212, c: 3, q: "Who founded a monastery on the island of Iona?", o: ["St Columba", "St Augustine", "St Patrick", "St Andrew"], a: [0], e: "St Columba's mission spread Christianity through Scotland from Iona." },
  { i: 213, c: 3, q: "Which king led the English at the Battle of Hastings?", o: ["Harold", "Alfred", "Cnut", "Edward"], a: [0], e: "King Harold was killed at Hastings in 1066, and William of Normandy took the throne." },
  { i: 214, c: 3, q: "Which document did King John seal at Runnymede?", o: ["Magna Carta", "The Bill of Rights", "The Domesday Book", "The Act of Union"], a: [0], e: "The barons forced King John to agree Magna Carta in 1215." },
  { i: 215, c: 3, q: "The Black Death arrived in Britain in which century?", o: ["The 14th century", "The 12th century", "The 16th century", "The 17th century"], a: [0], e: "The plague reached England in 1348 and killed about a third of the population." },
  { i: 216, c: 3, q: "Which TWO were consequences of the Black Death? (Choose two answers)", o: ["A shortage of labour", "The growth of a wealthier middle class", "The Norman conquest", "The invention of printing"], a: [0, 1], e: "Fewer workers meant those who survived could demand better pay, weakening the old feudal system." },
  { i: 217, c: 3, q: "Who was the last Catholic monarch to rule England?", o: ["James II", "Charles II", "Henry VIII", "Elizabeth I"], a: [0], e: "James II fled in 1688 during the Glorious Revolution." },
  { i: 218, c: 3, q: "What was the Reformation?", o: ["A movement against the authority of the Pope", "A rebellion against taxation", "A change to the legal system", "The founding of Parliament"], a: [0], e: "Protestant ideas spread across Europe; Henry VIII's break with Rome brought them to England." },
  { i: 219, c: 3, q: "Which queen ruled Scotland and was executed in 1587?", o: ["Mary, Queen of Scots", "Mary I", "Elizabeth I", "Anne"], a: [0], e: "Mary fled to England, was imprisoned for 20 years and was eventually executed on suspicion of plotting against Elizabeth I." },
  { i: 220, c: 3, q: "What was the Gunpowder Plot?", o: ["A Catholic plan to blow up the Houses of Parliament in 1605", "A plan to burn London", "A plot to assassinate Cromwell", "A Scottish rebellion"], a: [0], e: "Guy Fawkes was caught guarding explosives beneath Parliament; the failure is marked on 5 November." },
  { i: 221, c: 3, q: "Which war was fought between Parliament and King Charles I?", o: ["The English Civil War", "The Wars of the Roses", "The Hundred Years War", "The Crimean War"], a: [0], e: "The Civil War began in 1642 and led to the king's execution in 1649." },
  { i: 222, c: 3, q: "Who was the architect who rebuilt St Paul's Cathedral after the Great Fire?", o: ["Sir Christopher Wren", "Inigo Jones", "Robert Adam", "John Nash"], a: [0], e: "The Great Fire of 1666 destroyed much of London, including the old cathedral." },
  { i: 223, c: 3, q: "In which year did the Act of Union with Ireland create the United Kingdom of Great Britain and Ireland?", o: ["1801", "1707", "1922", "1689"], a: [0], e: "Ireland joined the union in 1801; most of it left in 1922." },
  { i: 224, c: 3, q: "Which invention by Richard Arkwright was important to the Industrial Revolution?", o: ["Efficient and profitable spinning machinery for cloth", "The steam locomotive", "The telephone", "The electric light"], a: [0], e: "Arkwright's factories transformed the production of textiles." },
  { i: 225, c: 3, q: "Isambard Kingdom Brunel is famous for what?", o: ["Building bridges, railways and ships", "Discovering penicillin", "Founding the NHS", "Writing novels"], a: [0], e: "Brunel built the Great Western Railway and ships including the SS Great Britain." },
  { i: 226, c: 3, q: "What was the Great Exhibition of 1851 held to celebrate?", o: ["Industry and culture from Britain and around the world", "The end of the Napoleonic Wars", "Queen Victoria's coronation", "The founding of the Empire"], a: [0], e: "It was held in the Crystal Palace in Hyde Park." },
  { i: 227, c: 3, q: "Who was Mary Seacole?", o: ["A nurse from Jamaica who treated wounded soldiers in the Crimea", "The first woman doctor in Britain", "A suffragette leader", "A wartime prime minister"], a: [0], e: "She set up a hotel for sick and wounded soldiers and is now honoured with a statue in London." },
  { i: 228, c: 3, q: "Emmeline Pankhurst's campaigners were commonly known as what?", o: ["Suffragettes", "Chartists", "Levellers", "Jacobites"], a: [0], e: "The suffragettes campaigned for votes for women, using increasingly militant methods before the First World War." },
  { i: 229, c: 3, q: "Which countries were Britain's main allies in the First World War?", o: ["France, Russia and later the United States", "Germany and Austria", "Italy and Japan only", "Spain and Portugal"], a: [0], e: "Britain fought alongside France, Russia, and later Italy, Japan and the United States." },
  { i: 230, c: 3, q: "What was the Blitz?", o: ["Heavy bombing of British cities by German aircraft", "The evacuation of Dunkirk", "The invasion of Normandy", "The defence of Malta"], a: [0], e: "London, Coventry and other cities were bombed heavily from 1940." },
  { i: 231, c: 3, q: "Which German leader did Britain fight in the Second World War?", o: ["Adolf Hitler", "Kaiser Wilhelm", "Otto von Bismarck", "Erich Ludendorff"], a: [0], e: "Britain declared war in 1939 after Germany invaded Poland." },
  { i: 232, c: 3, q: "Which TWO were established shortly after the Second World War? (Choose two answers)", o: ["The National Health Service", "The welfare state benefit system", "The European Union", "The Bank of England"], a: [0, 1], e: "The NHS began in 1948, and the Beveridge Report shaped the modern welfare state." },
  { i: 233, c: 3, q: "Which British scientists helped discover the structure of DNA?", o: ["Francis Crick and Maurice Wilkins", "Alexander Fleming and Howard Florey", "Charles Darwin and Alfred Wallace", "Isaac Newton and Robert Hooke"], a: [0], e: "The discovery was made in 1953 at Cambridge, working with James Watson." },
  { i: 234, c: 3, q: "Who invented the hovercraft?", o: ["Sir Christopher Cockerell", "Sir Frank Whittle", "John Logie Baird", "Sir Tim Berners-Lee"], a: [0], e: "Cockerell, a British inventor, developed the hovercraft in the 1950s." },
  { i: 235, c: 3, q: "Which of these was a famous British Prime Minister during the Second World War?", o: ["Winston Churchill", "Harold Wilson", "Stanley Baldwin", "Anthony Eden"], a: [0], e: "Churchill led the wartime coalition government from 1940 and returned as PM in 1951." },
  { i: 236, c: 3, q: "What was the Commonwealth originally formed from?", o: ["Countries that were once part of the British Empire", "Members of the European Union", "Founding members of the United Nations", "NATO member states"], a: [0], e: "Most Commonwealth members are former British colonies, though membership is voluntary." },
  { i: 237, c: 4, q: "Which TWO are traditional foods associated with Wales and Scotland? (Choose two answers)", o: ["Welsh cakes", "Haggis", "Ulster fry", "Cornish pasty"], a: [0, 1], e: "Welsh cakes come from Wales and haggis from Scotland; the Ulster fry is from Northern Ireland." },
  { i: 238, c: 4, q: "What is the flag of the United Kingdom commonly called?", o: ["The Union Flag or Union Jack", "The Royal Standard", "The Red Ensign", "The Saltire"], a: [0], e: "It combines the crosses of St George, St Andrew and St Patrick." },
  { i: 239, c: 4, q: "On which date is Christmas Day celebrated?", o: ["25 December", "24 December", "26 December", "1 January"], a: [0], e: "Boxing Day, 26 December, is also a public holiday." },
  { i: 240, c: 4, q: "Which festival of light is celebrated by Hindus and Sikhs in the UK?", o: ["Diwali", "Eid al-Fitr", "Hanukkah", "Vaisakhi"], a: [0], e: "Diwali normally falls in October or November and lasts for five days." },
  { i: 241, c: 4, q: "What is Eid al-Fitr?", o: ["A Muslim festival marking the end of Ramadan", "A Hindu new year festival", "A Sikh harvest festival", "A Jewish festival of light"], a: [0], e: "Muslims thank God for giving them the strength to complete the month of fasting." },
  { i: 242, c: 4, q: "Which sport is played at Lord's cricket ground?", o: ["Cricket", "Rugby", "Tennis", "Football"], a: [0], e: "Lord's in London is one of the most famous cricket grounds in the world." },
  { i: 243, c: 4, q: "Which UK-wide competition do the national rugby union teams take part in?", o: ["The Six Nations Championship", "The Ashes", "The Ryder Cup", "The Grand National"], a: [0], e: "England, Scotland, Wales and Ireland play France and Italy each year." },
  { i: 244, c: 4, q: "Sir Ian Botham was famous in which sport?", o: ["Cricket", "Football", "Rowing", "Motor racing"], a: [0], e: "Botham held the England record for the number of wickets taken in test cricket." },
  { i: 245, c: 4, q: "Which motor racing driver won the Formula 1 world championship three times in the 1960s and 70s?", o: ["Sir Jackie Stewart", "Damon Hill", "Lewis Hamilton", "Stirling Moss"], a: [0], e: "The Scottish driver Jackie Stewart won three world championships." },
  { i: 246, c: 4, q: "What is a 'bank holiday'?", o: ["A public holiday when most businesses close", "A day when banks charge no fees", "A day when only banks close", "A religious festival"], a: [0], e: "Bank holidays include Christmas Day, Boxing Day, New Year's Day and Easter Monday." },
  { i: 247, c: 4, q: "Which of these is a famous British film director?", o: ["Sir Alfred Hitchcock", "Steven Spielberg", "Martin Scorsese", "Ang Lee"], a: [0], e: "Hitchcock directed Psycho and The Birds; British film awards are the BAFTAs." },
  { i: 248, c: 4, q: "Which annual flower show is held in London?", o: ["The Chelsea Flower Show", "The Edinburgh Festival", "The Notting Hill Carnival", "The Eisteddfod"], a: [0], e: "The Chelsea Flower Show showcases garden design from around the world." },
  { i: 249, c: 4, q: "What is the Eisteddfod?", o: ["A Welsh festival of literature, music and performance", "A Scottish highland games", "An Irish dance competition", "An English village fair"], a: [0], e: "There is an annual National Eisteddfod in Wales, held mainly in Welsh." },
  { i: 250, c: 4, q: "Which of these UK landmarks is a prehistoric monument in Wiltshire?", o: ["Stonehenge", "The Eden Project", "The Tower of London", "Snowdonia"], a: [0], e: "Stonehenge is a World Heritage Site and one of the most famous prehistoric monuments in the world." },
  { i: 251, c: 4, q: "Where is the Eden Project?", o: ["Cornwall", "Kent", "Fife", "Antrim"], a: [0], e: "The Eden Project's biomes in Cornwall house plants from around the world." },
  { i: 252, c: 4, q: "Which is the largest national park in the UK?", o: ["The Cairngorms", "Snowdonia", "The Lake District", "The Peak District"], a: [0], e: "The Cairngorms National Park in Scotland is the largest in the UK." },
  { i: 253, c: 4, q: "What must you do before you can watch or record live television in the UK?", o: ["Buy a TV licence", "Register with your local council", "Join the BBC", "Apply to Ofcom"], a: [0], e: "A TV licence is needed for each household watching live television or using BBC iPlayer." },
  { i: 254, c: 4, q: "At what age can you buy a National Lottery ticket?", o: ["18", "16", "21", "14"], a: [0], e: "The minimum age for National Lottery products is 18." },
  { i: 255, c: 4, q: "Which TWO of these are ways people take part in charity in the UK? (Choose two answers)", o: ["Volunteering for a charity shop", "Giving to a fundraising appeal", "Refusing to pay tax", "Ignoring local elections"], a: [0, 1], e: "Charities such as the National Trust and Comic Relief rely heavily on volunteers and donations." },
  { i: 256, c: 5, q: "Who is the head of state of the UK?", o: ["The monarch", "The Prime Minister", "The Speaker", "The Lord Chancellor"], a: [0], e: "The monarch is head of state; the Prime Minister is head of government." },
  { i: 257, c: 5, q: "What is a constituency?", o: ["The area an MP represents", "A political party", "A government department", "A type of court"], a: [0], e: "There are 650 constituencies, each electing one MP." },
  { i: 258, c: 5, q: "What is a by-election?", o: ["An election held when an MP's seat becomes vacant between general elections", "A second round of a general election", "An election for local councillors", "A referendum"], a: [0], e: "By-elections happen when an MP resigns or dies." },
  { i: 259, c: 5, q: "What is the role of a pressure group?", o: ["To influence government policy on a particular issue", "To run elections", "To collect taxes", "To appoint judges"], a: [0], e: "Pressure groups represent the views of British citizens on particular causes." },
  { i: 260, c: 5, q: "What are the two main sources of UK law?", o: ["Acts of Parliament and case law", "Royal decrees and church law", "European treaties only", "Local council rules"], a: [0], e: "Judges also interpret the law, and their decisions build up as common law." },
  { i: 261, c: 5, q: "Who represents you if you are charged with a serious criminal offence and cannot afford a lawyer?", o: ["A solicitor or barrister paid for through legal aid", "A police officer", "A magistrate", "A civil servant"], a: [0], e: "Legal aid may be available depending on your circumstances and the case." },
  { i: 262, c: 5, q: "In Scotland, which court hears serious criminal cases?", o: ["The High Court of Justiciary or Sheriff Court", "The Crown Court", "The Magistrates' Court", "The County Court"], a: [0], e: "Scotland has its own legal system, separate from England, Wales and Northern Ireland." },
  { i: 263, c: 5, q: "What can you do if you have a problem with a product or service you have paid for?", o: ["Take the case to a County Court or use a small claims procedure", "Report it to the police", "Appeal to Parliament", "Contact the Crown Court"], a: [0], e: "Small claims are handled in County Courts in England, Wales and Northern Ireland and Sheriff Courts in Scotland." },
  { i: 264, c: 5, q: "Which TWO are unlawful forms of discrimination at work? (Choose two answers)", o: ["Discrimination because of race", "Discrimination because of disability", "Refusing to hire someone without the right qualifications", "Paying more for more experience"], a: [0, 1], e: "The Equality Act protects against discrimination on grounds such as age, disability, race, religion, sex and sexual orientation." },
  { i: 265, c: 5, q: "What is the emergency telephone number in the UK for police, fire and ambulance?", o: ["999 or 112", "911", "101", "111"], a: [0], e: "Use 999 or 112 in an emergency; 101 is for non-emergency police matters and 111 for non-emergency medical advice." },
  { i: 266, c: 5, q: "Which number should you call for non-emergency medical advice in England?", o: ["111", "999", "101", "112"], a: [0], e: "NHS 111 gives medical advice when the situation is not life-threatening." },
  { i: 267, c: 5, q: "How can you register with a doctor?", o: ["Sign up with a local GP surgery", "Apply to the Home Office", "Ask your employer", "Register at a hospital only"], a: [0], e: "GPs are usually the first point of contact for health problems that are not emergencies." },
  { i: 268, c: 5, q: "Who can stand for election as an MP?", o: ["Most people aged 18 or over who are UK, Irish or eligible Commonwealth citizens", "Only people over 25", "Only members of the two largest parties", "Only people born in the UK"], a: [0], e: "Some people, such as members of the armed forces, civil servants and prisoners, are disqualified." },
  { i: 269, c: 5, q: "What is a school governor?", o: ["A volunteer who helps run a school", "A paid head teacher", "A local council employee", "A government inspector"], a: [0], e: "Becoming a school governor is one way of taking part in your community." },
  { i: 270, c: 5, q: "Which of these must you do if you are called for jury service?", o: ["Attend unless you have a valid reason to be excused", "Pay a fee to take part", "Choose a case to hear", "Serve for a full year"], a: [0], e: "Jury service is a public duty and people are selected at random from the electoral register." },
  { i: 271, c: 5, q: "What is the purpose of the Speaker's constituency work?", o: ["The Speaker still represents their constituents as an MP", "The Speaker has no constituency", "The Speaker represents the government", "The Speaker only chairs debates"], a: [0], e: "The Speaker remains a constituency MP but must be politically neutral in the Commons." },
  { i: 272, c: 5, q: "Which body checks and can suggest amendments to laws passed by the House of Commons?", o: ["The House of Lords", "The Supreme Court", "The civil service", "The monarch's household"], a: [0], e: "The Lords scrutinises legislation, though the Commons can ultimately overrule it." },
  { i: 273, c: 5, q: "What happens if you do not pay your council tax?", o: ["You can be taken to court and face further costs", "Nothing, it is voluntary", "Your passport is withdrawn", "You are deported"], a: [0], e: "Council tax pays for local services such as rubbish collection, libraries and policing." },
  { i: 274, c: 5, q: "What does the term 'devolved power' mean?", o: ["Powers transferred from central government to a national or regional body", "Powers given to the monarch", "Powers given to the courts", "Powers given to local charities"], a: [0], e: "Scotland, Wales and Northern Ireland have devolved administrations with powers over areas such as health and education." },
  { i: 275, c: 5, q: "Which of these is a responsibility of every UK resident who works?", o: ["Paying income tax and National Insurance", "Joining a trade union", "Voting in every election", "Serving as a magistrate"], a: [0], e: "Tax pays for public services such as roads, schools, the armed forces and the NHS." },
];

const QUESTIONS = [...BASE_Q, ...EXTRA_Q];

const FLASHCARDS = [
  { c: 3, f: "55 BC", b: "Julius Caesar's failed invasion of Britain" },
  { c: 3, f: "AD 43", b: "Emperor Claudius leads the successful Roman invasion" },
  { c: 3, f: "AD 122", b: "Hadrian's Wall is built" },
  { c: 3, f: "AD 410", b: "The Roman army leaves Britain" },
  { c: 3, f: "AD 597", b: "St Augustine arrives; first Archbishop of Canterbury" },
  { c: 3, f: "AD 789", b: "The first Viking raids on Britain" },
  { c: 3, f: "1066", b: "Battle of Hastings — William of Normandy defeats Harold" },
  { c: 3, f: "1086", b: "The Domesday Book records land and livestock" },
  { c: 3, f: "1215", b: "Magna Carta limits the power of King John" },
  { c: 3, f: "1284", b: "Statute of Rhuddlan — Edward I annexes Wales" },
  { c: 3, f: "1314", b: "Battle of Bannockburn — Robert the Bruce defeats the English" },
  { c: 3, f: "1348", b: "The Black Death kills about a third of the population" },
  { c: 3, f: "1415", b: "Henry V wins the Battle of Agincourt" },
  { c: 3, f: "1455–1485", b: "The Wars of the Roses: Lancaster v York" },
  { c: 3, f: "1476", b: "William Caxton sets up the first English printing press" },
  { c: 3, f: "1485", b: "Battle of Bosworth Field — the Tudors take the throne" },
  { c: 3, f: "1588", b: "The Spanish Armada is defeated" },
  { c: 3, f: "1603", b: "Union of the Crowns — James VI of Scotland becomes James I" },
  { c: 3, f: "1605", b: "The Gunpowder Plot fails" },
  { c: 3, f: "1642", b: "The English Civil War begins" },
  { c: 3, f: "1649", b: "Charles I is executed; Cromwell rules as Lord Protector" },
  { c: 3, f: "1660", b: "The Restoration — Charles II returns to the throne" },
  { c: 3, f: "1665 and 1666", b: "The Great Plague, then the Great Fire of London" },
  { c: 3, f: "1679", b: "Habeas Corpus Act — no unlawful imprisonment" },
  { c: 3, f: "1688", b: "The Glorious Revolution — William of Orange takes the throne" },
  { c: 3, f: "1689", b: "The Bill of Rights limits the monarch's power" },
  { c: 3, f: "1690", b: "Battle of the Boyne" },
  { c: 3, f: "1707", b: "Act of Union creates the Kingdom of Great Britain" },
  { c: 3, f: "1721", b: "Sir Robert Walpole becomes the first Prime Minister" },
  { c: 3, f: "1746", b: "Battle of Culloden — the Jacobites are defeated" },
  { c: 3, f: "1801", b: "Act of Union with Ireland" },
  { c: 3, f: "1805", b: "Nelson dies at the Battle of Trafalgar" },
  { c: 3, f: "1807 and 1833", b: "Slave trade abolished, then slavery abolished across the Empire" },
  { c: 3, f: "1815", b: "Wellington defeats Napoleon at Waterloo" },
  { c: 3, f: "1837–1901", b: "The reign of Queen Victoria" },
  { c: 3, f: "1914–1918", b: "The First World War" },
  { c: 3, f: "1918 and 1928", b: "Votes for women over 30, then equal voting age of 21" },
  { c: 3, f: "1922", b: "Ireland is divided; the Irish Free State is formed" },
  { c: 3, f: "1928", b: "Alexander Fleming discovers penicillin" },
  { c: 3, f: "1939–1945", b: "The Second World War" },
  { c: 3, f: "6 June 1944", b: "D-Day — Allied landings in Normandy" },
  { c: 3, f: "8 May 1945", b: "VE Day — victory in Europe" },
  { c: 3, f: "1947", b: "India, Pakistan and Ceylon become independent" },
  { c: 3, f: "1948", b: "The NHS is founded; the Empire Windrush arrives" },
  { c: 3, f: "1952", b: "Queen Elizabeth II comes to the throne" },
  { c: 3, f: "1973", b: "The UK joins the European Economic Community" },
  { c: 3, f: "1979", b: "Margaret Thatcher becomes the first woman Prime Minister" },
  { c: 3, f: "1998", b: "The Belfast (Good Friday) Agreement" },
  { c: 3, f: "1999", b: "Scottish Parliament and Welsh Assembly first meet" },
  { c: 3, f: "31 January 2020", b: "The UK leaves the European Union" },
  { c: 4, f: "St David", b: "Wales — 1 March" },
  { c: 4, f: "St Patrick", b: "Northern Ireland — 17 March" },
  { c: 4, f: "St George", b: "England — 23 April" },
  { c: 4, f: "St Andrew", b: "Scotland — 30 November" },
  { c: 4, f: "Highest mountain in the UK", b: "Ben Nevis, in Scotland" },
  { c: 4, f: "Longest river in the UK", b: "The Severn" },
  { c: 4, f: "The Ashes", b: "Cricket, played between England and Australia" },
  { c: 4, f: "London Olympics", b: "1908, 1948 and 2012" },
  { c: 4, f: "Invented television", b: "John Logie Baird" },
  { c: 4, f: "Invented the World Wide Web", b: "Sir Tim Berners-Lee" },
  { c: 4, f: "Invented the jet engine", b: "Sir Frank Whittle" },
  { c: 5, f: "MPs in the House of Commons", b: "650" },
  { c: 5, f: "MSPs in the Scottish Parliament", b: "129" },
  { c: 5, f: "MLAs in the Northern Ireland Assembly", b: "90" },
  { c: 5, f: "Jury size", b: "12 in England, Wales and NI; 15 in Scotland" },
  { c: 5, f: "Age of criminal responsibility", b: "10 in England, Wales and NI; 12 in Scotland" },
  { c: 5, f: "Polling station hours", b: "7am to 10pm" },
  { c: 5, f: "Commonwealth member states", b: "54" },
  { c: 5, f: "Self-assessment tax deadlines", b: "31 October on paper, 31 January online" },
  { c: 5, f: "Emergency numbers", b: "999 or 112; 101 non-emergency police; 111 medical advice" },
  { c: 2, f: "Great Britain", b: "England, Scotland and Wales — not Northern Ireland" },
  { c: 2, f: "Crown dependencies", b: "The Channel Islands and the Isle of Man" },
  { c: 1, f: "Test languages", b: "English, Welsh or Scottish Gaelic" },
];

const TESTDAY = [
  { h: "The format", p: ["24 multiple-choice questions in 45 minutes", "You need 18 correct to pass — that is 75%", "Every question comes from the official handbook, Life in the United Kingdom: A Guide for New Residents (3rd edition)", "Most well-prepared candidates finish in 15 to 20 minutes", "The test is taken on a computer at an approved test centre"] },
  { h: "Booking", p: ["Book online at gov.uk/life-in-the-uk-test — never through a third-party site", "The fee is £50 per attempt, paid by card when you book", "You must book at least 3 days (72 hours) in advance", "You can book up to 6 months ahead, at any approved centre in the UK", "The name on your booking must match your ID exactly"] },
  { h: "What to bring", p: ["Your booking confirmation, printed or on your phone", "The same photo ID you used to book — passport or biometric residence permit", "A driving licence is not accepted as ID", "Proof of your postcode may be required", "You cannot take phones, notes or bags into the exam room"] },
  { h: "If things change", p: ["Cancel more than 3 days (72 hours) ahead for a full refund", "Cancel or miss the test within 72 hours and you lose the £50", "If you fail, you must wait at least 7 days before booking again", "There is no limit on the number of attempts, but each costs £50"] },
  { h: "Who does not need to take it", p: ["Anyone under 18 or aged 65 and over", "People with a qualifying long-term physical or mental condition", "Check the current rules on gov.uk, as exemptions can change"] },
];


/* ============================================================
   LANGUAGES
   Ordered by the nationalities that apply for UK settlement
   and citizenship in the largest numbers.
   ============================================================ */

const LANGS = [
  { id: "en", name: "English", native: "English", rtl: false },
  { id: "hi", name: "Hindi", native: "हिन्दी", rtl: false },
  { id: "ur", name: "Urdu", native: "اردو", rtl: true },
  { id: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ", rtl: false },
  { id: "bn", name: "Bengali", native: "বাংলা", rtl: false },
  { id: "ar", name: "Arabic", native: "العربية", rtl: true },
  { id: "ro", name: "Romanian", native: "Română", rtl: false },
  { id: "pl", name: "Polish", native: "Polski", rtl: false },
  { id: "it", name: "Italian", native: "Italiano", rtl: false },
  { id: "pt", name: "Portuguese", native: "Português", rtl: false },
  { id: "gu", name: "Gujarati", native: "ગુજરાતી", rtl: false },
  { id: "ta", name: "Tamil", native: "தமிழ்", rtl: false },
  { id: "fa", name: "Persian", native: "فارسی", rtl: true },
  { id: "zh", name: "Chinese", native: "简体中文", rtl: false },
  { id: "tl", name: "Filipino", native: "Filipino", rtl: false },
];

const T = {};

T.en = {
  morning: "Good morning", afternoon: "Good afternoon", evening: "Good evening",
  daysLeft: "{n} days until your test", dayLeft: "1 day until your test", testToday: "Your test is today. Good luck.",
  format: "24 questions, 45 minutes, 18 to pass",
  mocks: "Mocks taken", passedN: "Passed", streak: "Day streak", readiness: "Readiness",
  practise: "Practise", learn: "Learn",
  startMock: "Start a mock test", startMockSub: "24 questions · 45 minutes · timed",
  quickQuiz: "Quick quiz, untimed", flashcards: "Flashcards for dates",
  fixMistakes: "Fix your mistakes", fixSub: "{n} to clear · needs two correct answers each",
  chapterPractice: "Practise by chapter", chapterSub: "Untimed, with the answer explained",
  studyNotes: "Study notes", studySub: "All five chapters, condensed and searchable",
  testDay: "Booking and test day", testDaySub: "Fee, ID, what to bring, what if you fail",
  lastMock: "Last mock", pass: "Pass", fail: "Below the pass mark", seeProgress: "see your full progress",
  questionN: "Question {a} of {b}", back: "Back", next: "Next", finish: "Finish",
  flag: "Flag for review", flagged: "Flagged for review", leave: "Leave the test",
  handInTitle: "Hand in your test?", handIn: "Hand it in", keepGoing: "Keep going",
  allAnswered: "All 24 answered.", unanswered: "{n} unanswered. Blanks count as wrong.",
  chooseN: "Choose {n} answers", why: "Why", save: "Save", savedWord: "Saved",
  passTitle: "Pass", failTitle: "Not this time",
  passBody: "That is at or above the 18 out of 24 you need.", failBody: "You need 18 out of 24 to pass.",
  score: "Score", correctPct: "Correct", time: "Time used", byChapter: "By chapter",
  reviewWrong: "Review mistakes", again: "Test again", home: "Home",
  wrongOnly: "Wrong only", allQs: "All 24", backToScore: "Back to score", newMock: "New mock",
  whatWrong: "What you got wrong", everyQ: "Every question",
  checkAnswer: "Check answer", seeResult: "See how you did", stop: "Stop", goAgain: "Go again", done: "Done",
  ofWord: "of", outOf: "{a} out of {b}",
  searchPh: "Search the notes…", results: "{n} results", noMatch: "Nothing matches that.",
  markRead: "Mark as read", isRead: "Marked as read", testChapter: "Test this chapter", allChapters: "All chapters",
  tapReveal: "Tap to reveal", tapBack: "Tap to go back", previous: "Previous", shuffle: "Shuffle", all: "All",
  progress: "Progress", seen: "{a} of {b} questions seen", mockScores: "Mock scores",
  best: "Best score", average: "Average", history: "History", reset: "Reset all progress",
  noMocks: "No mock tests yet. Take one and your scores will appear here.",
  settings: "Settings", darkMode: "Dark mode", darkSub: "Easier on the eyes at night",
  language: "Language", yourName: "Your name", testDateLabel: "Test date", optional: "Optional",
  localOnly: "Your progress is saved on this device only.",
  welcomeTitle: "Pass the Life in the UK test", getStarted: "Get started",
  skip: "Skip", startStudying: "Start studying", chooseLang: "Choose your language",
  langNote: "The test itself is in English, so questions stay in English. Everything around them is in your language.",
  detailsTitle: "A couple of details", detailsSub: "Both are optional. The date turns on a countdown.",
  loading: "Loading…", nothingHere: "Nothing here yet.", questions: "questions", saved: "saved",
  ch1: "Values", ch2: "The UK", ch3: "History", ch4: "Society", ch5: "Government",
  vNone: "Take a few mock tests and this will start to mean something.",
  vEarly: "Early days. Read the notes before doing more mocks.",
  vMid: "Getting there. Focus on your weakest chapters.",
  vClose: "Close. Clear your mistakes list and you should be there.",
  vReady: "You are scoring well above the pass mark. You look ready to book.",
};

T.hi = {
  morning: "सुप्रभात", afternoon: "नमस्कार", evening: "शुभ संध्या",
  daysLeft: "आपकी परीक्षा में {n} दिन बाकी", dayLeft: "परीक्षा में 1 दिन बाकी", testToday: "आपकी परीक्षा आज है। शुभकामनाएँ।",
  format: "24 प्रश्न, 45 मिनट, पास होने के लिए 18",
  mocks: "मॉक टेस्ट", passedN: "पास", streak: "दिन की लय", readiness: "तैयारी",
  practise: "अभ्यास", learn: "अध्ययन",
  startMock: "मॉक टेस्ट शुरू करें", startMockSub: "24 प्रश्न · 45 मिनट · समयबद्ध",
  quickQuiz: "त्वरित क्विज़, बिना समय", flashcards: "तिथियों के फ़्लैशकार्ड",
  fixMistakes: "अपनी गलतियाँ सुधारें", fixSub: "{n} बाकी · हर एक के दो सही उत्तर चाहिए",
  chapterPractice: "अध्याय के अनुसार अभ्यास", chapterSub: "बिना समय, उत्तर की व्याख्या के साथ",
  studyNotes: "अध्ययन नोट्स", studySub: "पाँचों अध्याय, संक्षिप्त और खोजने योग्य",
  testDay: "बुकिंग और परीक्षा का दिन", testDaySub: "शुल्क, पहचान पत्र, क्या ले जाएँ",
  lastMock: "पिछला मॉक", pass: "पास", fail: "पास अंक से कम", seeProgress: "पूरी प्रगति देखें",
  questionN: "प्रश्न {a} / {b}", back: "पीछे", next: "आगे", finish: "समाप्त",
  flag: "समीक्षा के लिए चिह्नित करें", flagged: "चिह्नित", leave: "परीक्षा छोड़ें",
  handInTitle: "परीक्षा जमा करें?", handIn: "जमा करें", keepGoing: "जारी रखें",
  allAnswered: "सभी 24 उत्तर दिए गए।", unanswered: "{n} अनुत्तरित। खाली उत्तर गलत माने जाते हैं।",
  chooseN: "{n} उत्तर चुनें", why: "क्यों", save: "सहेजें", savedWord: "सहेजा गया",
  passTitle: "पास", failTitle: "इस बार नहीं",
  passBody: "यह 24 में से आवश्यक 18 के बराबर या अधिक है।", failBody: "पास होने के लिए 24 में से 18 चाहिए।",
  score: "अंक", correctPct: "सही", time: "लिया गया समय", byChapter: "अध्याय अनुसार",
  reviewWrong: "गलतियाँ देखें", again: "फिर से परीक्षा", home: "होम",
  wrongOnly: "केवल गलत", allQs: "सभी 24", backToScore: "अंक पर वापस", newMock: "नया मॉक",
  whatWrong: "आपने क्या गलत किया", everyQ: "सभी प्रश्न",
  checkAnswer: "उत्तर जाँचें", seeResult: "परिणाम देखें", stop: "रोकें", goAgain: "फिर से करें", done: "पूर्ण",
  ofWord: "/", outOf: "{b} में से {a}",
  searchPh: "नोट्स में खोजें…", results: "{n} परिणाम", noMatch: "कुछ नहीं मिला।",
  markRead: "पढ़ा हुआ चिह्नित करें", isRead: "पढ़ा गया", testChapter: "इस अध्याय की परीक्षा", allChapters: "सभी अध्याय",
  tapReveal: "देखने के लिए टैप करें", tapBack: "वापस जाने के लिए टैप करें", previous: "पिछला", shuffle: "फेंटें", all: "सभी",
  progress: "प्रगति", seen: "{b} में से {a} प्रश्न देखे", mockScores: "मॉक अंक",
  best: "सर्वोत्तम", average: "औसत", history: "इतिहास", reset: "सारी प्रगति मिटाएँ",
  noMocks: "अभी कोई मॉक टेस्ट नहीं। एक दें और अंक यहाँ दिखेंगे।",
  settings: "सेटिंग्स", darkMode: "डार्क मोड", darkSub: "रात में आँखों के लिए बेहतर",
  language: "भाषा", yourName: "आपका नाम", testDateLabel: "परीक्षा की तिथि", optional: "वैकल्पिक",
  localOnly: "आपकी प्रगति केवल इसी डिवाइस पर सहेजी जाती है।",
  welcomeTitle: "Life in the UK परीक्षा पास करें", getStarted: "शुरू करें",
  skip: "छोड़ें", startStudying: "पढ़ाई शुरू करें", chooseLang: "अपनी भाषा चुनें",
  langNote: "परीक्षा अंग्रेज़ी में होती है, इसलिए प्रश्न अंग्रेज़ी में रहते हैं। बाकी सब आपकी भाषा में है।",
  detailsTitle: "कुछ जानकारी", detailsSub: "दोनों वैकल्पिक हैं। तिथि से उलटी गिनती शुरू होती है।",
  loading: "लोड हो रहा है…", nothingHere: "यहाँ अभी कुछ नहीं।", questions: "प्रश्न", saved: "सहेजे गए",
  ch1: "मूल्य", ch2: "यूके", ch3: "इतिहास", ch4: "समाज", ch5: "सरकार",
  vNone: "कुछ मॉक टेस्ट दें, तब यह अर्थपूर्ण होगा।",
  vEarly: "शुरुआत है। और मॉक से पहले नोट्स पढ़ें।",
  vMid: "प्रगति हो रही है। कमज़ोर अध्यायों पर ध्यान दें।",
  vClose: "करीब हैं। गलतियों की सूची साफ़ करें।",
  vReady: "आप पास अंक से काफ़ी ऊपर हैं। बुकिंग के लिए तैयार लगते हैं।",
};

T.ur = {
  morning: "صبح بخیر", afternoon: "السلام علیکم", evening: "شام بخیر",
  daysLeft: "آپ کے ٹیسٹ میں {n} دن باقی", dayLeft: "ٹیسٹ میں 1 دن باقی", testToday: "آپ کا ٹیسٹ آج ہے۔ نیک تمنائیں۔",
  format: "24 سوالات، 45 منٹ، پاس ہونے کے لیے 18",
  mocks: "ماک ٹیسٹ", passedN: "پاس", streak: "دن کا تسلسل", readiness: "تیاری",
  practise: "مشق", learn: "سیکھیں",
  startMock: "ماک ٹیسٹ شروع کریں", startMockSub: "24 سوالات · 45 منٹ · وقت کے ساتھ",
  quickQuiz: "فوری کوئز، بغیر وقت", flashcards: "تاریخوں کے فلیش کارڈ",
  fixMistakes: "اپنی غلطیاں درست کریں", fixSub: "{n} باقی · ہر ایک کے دو درست جواب چاہئیں",
  chapterPractice: "باب کے مطابق مشق", chapterSub: "بغیر وقت، جواب کی وضاحت کے ساتھ",
  studyNotes: "مطالعہ نوٹس", studySub: "پانچوں ابواب، مختصر اور قابلِ تلاش",
  testDay: "بکنگ اور ٹیسٹ کا دن", testDaySub: "فیس، شناخت، کیا ساتھ لے جائیں",
  lastMock: "پچھلا ماک", pass: "پاس", fail: "پاس نمبر سے کم", seeProgress: "مکمل پیش رفت دیکھیں",
  questionN: "سوال {a} / {b}", back: "واپس", next: "اگلا", finish: "ختم",
  flag: "نظرثانی کے لیے نشان زد کریں", flagged: "نشان زد", leave: "ٹیسٹ چھوڑیں",
  handInTitle: "ٹیسٹ جمع کرائیں؟", handIn: "جمع کرائیں", keepGoing: "جاری رکھیں",
  allAnswered: "تمام 24 کے جواب دیے گئے۔", unanswered: "{n} بغیر جواب۔ خالی جواب غلط شمار ہوتے ہیں۔",
  chooseN: "{n} جواب منتخب کریں", why: "کیوں", save: "محفوظ کریں", savedWord: "محفوظ",
  passTitle: "پاس", failTitle: "اس بار نہیں",
  passBody: "یہ 24 میں سے مطلوبہ 18 کے برابر یا زیادہ ہے۔", failBody: "پاس ہونے کے لیے 24 میں سے 18 چاہئیں۔",
  score: "نمبر", correctPct: "درست", time: "استعمال شدہ وقت", byChapter: "باب کے مطابق",
  reviewWrong: "غلطیاں دیکھیں", again: "دوبارہ ٹیسٹ", home: "ہوم",
  wrongOnly: "صرف غلط", allQs: "تمام 24", backToScore: "نمبر پر واپس", newMock: "نیا ماک",
  whatWrong: "آپ نے کیا غلط کیا", everyQ: "تمام سوالات",
  checkAnswer: "جواب جانچیں", seeResult: "نتیجہ دیکھیں", stop: "روکیں", goAgain: "دوبارہ کریں", done: "مکمل",
  ofWord: "/", outOf: "{b} میں سے {a}",
  searchPh: "نوٹس میں تلاش کریں…", results: "{n} نتائج", noMatch: "کچھ نہیں ملا۔",
  markRead: "پڑھا ہوا نشان زد کریں", isRead: "پڑھ لیا", testChapter: "اس باب کا ٹیسٹ", allChapters: "تمام ابواب",
  tapReveal: "دیکھنے کے لیے ٹیپ کریں", tapBack: "واپس جانے کے لیے ٹیپ کریں", previous: "پچھلا", shuffle: "ترتیب بدلیں", all: "تمام",
  progress: "پیش رفت", seen: "{b} میں سے {a} سوالات دیکھے", mockScores: "ماک نمبر",
  best: "بہترین", average: "اوسط", history: "تاریخ", reset: "تمام پیش رفت مٹائیں",
  noMocks: "ابھی کوئی ماک ٹیسٹ نہیں۔ ایک دیں اور نمبر یہاں نظر آئیں گے۔",
  settings: "ترتیبات", darkMode: "ڈارک موڈ", darkSub: "رات میں آنکھوں کے لیے بہتر",
  language: "زبان", yourName: "آپ کا نام", testDateLabel: "ٹیسٹ کی تاریخ", optional: "اختیاری",
  localOnly: "آپ کی پیش رفت صرف اسی ڈیوائس پر محفوظ ہوتی ہے۔",
  welcomeTitle: "Life in the UK ٹیسٹ پاس کریں", getStarted: "شروع کریں",
  skip: "چھوڑیں", startStudying: "پڑھائی شروع کریں", chooseLang: "اپنی زبان منتخب کریں",
  langNote: "ٹیسٹ انگریزی میں ہوتا ہے، اس لیے سوالات انگریزی میں رہتے ہیں۔ باقی سب آپ کی زبان میں ہے۔",
  detailsTitle: "چند تفصیلات", detailsSub: "دونوں اختیاری ہیں۔ تاریخ سے الٹی گنتی شروع ہوتی ہے۔",
  loading: "لوڈ ہو رہا ہے…", nothingHere: "یہاں ابھی کچھ نہیں۔", questions: "سوالات", saved: "محفوظ",
  ch1: "اقدار", ch2: "برطانیہ", ch3: "تاریخ", ch4: "معاشرہ", ch5: "حکومت",
  vNone: "چند ماک ٹیسٹ دیں، پھر یہ بامعنی ہوگا۔",
  vEarly: "ابتدا ہے۔ مزید ماک سے پہلے نوٹس پڑھیں۔",
  vMid: "بہتری آ رہی ہے۔ کمزور ابواب پر توجہ دیں۔",
  vClose: "قریب ہیں۔ غلطیوں کی فہرست صاف کریں۔",
  vReady: "آپ پاس نمبر سے کافی اوپر ہیں۔ بکنگ کے لیے تیار لگتے ہیں۔",
};

T.pa = {
  morning: "ਸ਼ੁਭ ਸਵੇਰ", afternoon: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ", evening: "ਸ਼ੁਭ ਸ਼ਾਮ",
  daysLeft: "ਤੁਹਾਡੇ ਟੈਸਟ ਵਿੱਚ {n} ਦਿਨ ਬਾਕੀ", dayLeft: "ਟੈਸਟ ਵਿੱਚ 1 ਦਿਨ ਬਾਕੀ", testToday: "ਤੁਹਾਡਾ ਟੈਸਟ ਅੱਜ ਹੈ। ਸ਼ੁਭ ਕਾਮਨਾਵਾਂ।",
  format: "24 ਸਵਾਲ, 45 ਮਿੰਟ, ਪਾਸ ਲਈ 18",
  mocks: "ਮੌਕ ਟੈਸਟ", passedN: "ਪਾਸ", streak: "ਦਿਨਾਂ ਦੀ ਲੜੀ", readiness: "ਤਿਆਰੀ",
  practise: "ਅਭਿਆਸ", learn: "ਸਿੱਖੋ",
  startMock: "ਮੌਕ ਟੈਸਟ ਸ਼ੁਰੂ ਕਰੋ", startMockSub: "24 ਸਵਾਲ · 45 ਮਿੰਟ · ਸਮਾਂਬੱਧ",
  quickQuiz: "ਤੇਜ਼ ਕੁਇਜ਼, ਬਿਨਾਂ ਸਮਾਂ", flashcards: "ਤਾਰੀਖਾਂ ਲਈ ਫਲੈਸ਼ਕਾਰਡ",
  fixMistakes: "ਆਪਣੀਆਂ ਗਲਤੀਆਂ ਠੀਕ ਕਰੋ", fixSub: "{n} ਬਾਕੀ · ਹਰੇਕ ਲਈ ਦੋ ਸਹੀ ਜਵਾਬ ਚਾਹੀਦੇ",
  chapterPractice: "ਅਧਿਆਇ ਅਨੁਸਾਰ ਅਭਿਆਸ", chapterSub: "ਬਿਨਾਂ ਸਮਾਂ, ਜਵਾਬ ਦੀ ਵਿਆਖਿਆ ਨਾਲ",
  studyNotes: "ਪੜ੍ਹਾਈ ਦੇ ਨੋਟਸ", studySub: "ਪੰਜੇ ਅਧਿਆਇ, ਸੰਖੇਪ ਅਤੇ ਖੋਜਣਯੋਗ",
  testDay: "ਬੁਕਿੰਗ ਅਤੇ ਟੈਸਟ ਵਾਲਾ ਦਿਨ", testDaySub: "ਫੀਸ, ਪਛਾਣ ਪੱਤਰ, ਕੀ ਲੈ ਕੇ ਜਾਣਾ",
  lastMock: "ਪਿਛਲਾ ਮੌਕ", pass: "ਪਾਸ", fail: "ਪਾਸ ਅੰਕ ਤੋਂ ਘੱਟ", seeProgress: "ਪੂਰੀ ਤਰੱਕੀ ਵੇਖੋ",
  questionN: "ਸਵਾਲ {a} / {b}", back: "ਪਿੱਛੇ", next: "ਅੱਗੇ", finish: "ਸਮਾਪਤ",
  flag: "ਸਮੀਖਿਆ ਲਈ ਨਿਸ਼ਾਨ ਲਗਾਓ", flagged: "ਨਿਸ਼ਾਨਬੱਧ", leave: "ਟੈਸਟ ਛੱਡੋ",
  handInTitle: "ਟੈਸਟ ਜਮ੍ਹਾਂ ਕਰਨਾ ਹੈ?", handIn: "ਜਮ੍ਹਾਂ ਕਰੋ", keepGoing: "ਜਾਰੀ ਰੱਖੋ",
  allAnswered: "ਸਾਰੇ 24 ਜਵਾਬ ਦਿੱਤੇ।", unanswered: "{n} ਬਿਨਾਂ ਜਵਾਬ। ਖਾਲੀ ਗਲਤ ਗਿਣੇ ਜਾਂਦੇ ਹਨ।",
  chooseN: "{n} ਜਵਾਬ ਚੁਣੋ", why: "ਕਿਉਂ", save: "ਸੰਭਾਲੋ", savedWord: "ਸੰਭਾਲਿਆ",
  passTitle: "ਪਾਸ", failTitle: "ਇਸ ਵਾਰ ਨਹੀਂ",
  passBody: "ਇਹ 24 ਵਿੱਚੋਂ ਲੋੜੀਂਦੇ 18 ਦੇ ਬਰਾਬਰ ਜਾਂ ਵੱਧ ਹੈ।", failBody: "ਪਾਸ ਲਈ 24 ਵਿੱਚੋਂ 18 ਚਾਹੀਦੇ ਹਨ।",
  score: "ਅੰਕ", correctPct: "ਸਹੀ", time: "ਲੱਗਿਆ ਸਮਾਂ", byChapter: "ਅਧਿਆਇ ਅਨੁਸਾਰ",
  reviewWrong: "ਗਲਤੀਆਂ ਵੇਖੋ", again: "ਦੁਬਾਰਾ ਟੈਸਟ", home: "ਹੋਮ",
  wrongOnly: "ਸਿਰਫ਼ ਗਲਤ", allQs: "ਸਾਰੇ 24", backToScore: "ਅੰਕਾਂ ਤੇ ਵਾਪਸ", newMock: "ਨਵਾਂ ਮੌਕ",
  whatWrong: "ਤੁਸੀਂ ਕੀ ਗਲਤ ਕੀਤਾ", everyQ: "ਸਾਰੇ ਸਵਾਲ",
  checkAnswer: "ਜਵਾਬ ਜਾਂਚੋ", seeResult: "ਨਤੀਜਾ ਵੇਖੋ", stop: "ਰੋਕੋ", goAgain: "ਦੁਬਾਰਾ ਕਰੋ", done: "ਹੋ ਗਿਆ",
  ofWord: "/", outOf: "{b} ਵਿੱਚੋਂ {a}",
  searchPh: "ਨੋਟਸ ਵਿੱਚ ਖੋਜੋ…", results: "{n} ਨਤੀਜੇ", noMatch: "ਕੁਝ ਨਹੀਂ ਮਿਲਿਆ।",
  markRead: "ਪੜ੍ਹਿਆ ਨਿਸ਼ਾਨ ਲਗਾਓ", isRead: "ਪੜ੍ਹ ਲਿਆ", testChapter: "ਇਸ ਅਧਿਆਇ ਦਾ ਟੈਸਟ", allChapters: "ਸਾਰੇ ਅਧਿਆਇ",
  tapReveal: "ਵੇਖਣ ਲਈ ਟੈਪ ਕਰੋ", tapBack: "ਵਾਪਸ ਜਾਣ ਲਈ ਟੈਪ ਕਰੋ", previous: "ਪਿਛਲਾ", shuffle: "ਬਦਲੋ", all: "ਸਾਰੇ",
  progress: "ਤਰੱਕੀ", seen: "{b} ਵਿੱਚੋਂ {a} ਸਵਾਲ ਵੇਖੇ", mockScores: "ਮੌਕ ਅੰਕ",
  best: "ਸਭ ਤੋਂ ਵਧੀਆ", average: "ਔਸਤ", history: "ਇਤਿਹਾਸ", reset: "ਸਾਰੀ ਤਰੱਕੀ ਮਿਟਾਓ",
  noMocks: "ਹਾਲੇ ਕੋਈ ਮੌਕ ਟੈਸਟ ਨਹੀਂ। ਇੱਕ ਦਿਓ ਅਤੇ ਅੰਕ ਇੱਥੇ ਦਿਖਣਗੇ।",
  settings: "ਸੈਟਿੰਗਾਂ", darkMode: "ਡਾਰਕ ਮੋਡ", darkSub: "ਰਾਤ ਨੂੰ ਅੱਖਾਂ ਲਈ ਸੌਖਾ",
  language: "ਭਾਸ਼ਾ", yourName: "ਤੁਹਾਡਾ ਨਾਮ", testDateLabel: "ਟੈਸਟ ਦੀ ਤਾਰੀਖ", optional: "ਵਿਕਲਪਿਕ",
  localOnly: "ਤੁਹਾਡੀ ਤਰੱਕੀ ਸਿਰਫ਼ ਇਸੇ ਡਿਵਾਈਸ ਤੇ ਸੰਭਾਲੀ ਜਾਂਦੀ ਹੈ।",
  welcomeTitle: "Life in the UK ਟੈਸਟ ਪਾਸ ਕਰੋ", getStarted: "ਸ਼ੁਰੂ ਕਰੋ",
  skip: "ਛੱਡੋ", startStudying: "ਪੜ੍ਹਾਈ ਸ਼ੁਰੂ ਕਰੋ", chooseLang: "ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ",
  langNote: "ਟੈਸਟ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਹੁੰਦਾ ਹੈ, ਇਸ ਲਈ ਸਵਾਲ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਰਹਿੰਦੇ ਹਨ। ਬਾਕੀ ਸਭ ਤੁਹਾਡੀ ਭਾਸ਼ਾ ਵਿੱਚ ਹੈ।",
  detailsTitle: "ਕੁਝ ਵੇਰਵੇ", detailsSub: "ਦੋਵੇਂ ਵਿਕਲਪਿਕ ਹਨ। ਤਾਰੀਖ ਨਾਲ ਉਲਟੀ ਗਿਣਤੀ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ।",
  loading: "ਲੋਡ ਹੋ ਰਿਹਾ…", nothingHere: "ਇੱਥੇ ਹਾਲੇ ਕੁਝ ਨਹੀਂ।", questions: "ਸਵਾਲ", saved: "ਸੰਭਾਲੇ",
  ch1: "ਕਦਰਾਂ", ch2: "ਯੂਕੇ", ch3: "ਇਤਿਹਾਸ", ch4: "ਸਮਾਜ", ch5: "ਸਰਕਾਰ",
  vNone: "ਕੁਝ ਮੌਕ ਟੈਸਟ ਦਿਓ, ਫਿਰ ਇਹ ਅਰਥ ਰੱਖੇਗਾ।",
  vEarly: "ਸ਼ੁਰੂਆਤ ਹੈ। ਹੋਰ ਮੌਕ ਤੋਂ ਪਹਿਲਾਂ ਨੋਟਸ ਪੜ੍ਹੋ।",
  vMid: "ਤਰੱਕੀ ਹੋ ਰਹੀ ਹੈ। ਕਮਜ਼ੋਰ ਅਧਿਆਇਆਂ ਤੇ ਧਿਆਨ ਦਿਓ।",
  vClose: "ਨੇੜੇ ਹੋ। ਗਲਤੀਆਂ ਦੀ ਸੂਚੀ ਸਾਫ਼ ਕਰੋ।",
  vReady: "ਤੁਸੀਂ ਪਾਸ ਅੰਕ ਤੋਂ ਕਾਫ਼ੀ ਉੱਪਰ ਹੋ। ਬੁਕਿੰਗ ਲਈ ਤਿਆਰ ਲੱਗਦੇ ਹੋ।",
};

T.bn = {
  morning: "সুপ্রভাত", afternoon: "শুভ অপরাহ্ন", evening: "শুভ সন্ধ্যা",
  daysLeft: "আপনার পরীক্ষার {n} দিন বাকি", dayLeft: "পরীক্ষার 1 দিন বাকি", testToday: "আপনার পরীক্ষা আজ। শুভকামনা।",
  format: "24টি প্রশ্ন, 45 মিনিট, পাসের জন্য 18",
  mocks: "মক টেস্ট", passedN: "পাস", streak: "দিনের ধারা", readiness: "প্রস্তুতি",
  practise: "অনুশীলন", learn: "শিখুন",
  startMock: "মক টেস্ট শুরু করুন", startMockSub: "24টি প্রশ্ন · 45 মিনিট · সময়সীমা সহ",
  quickQuiz: "দ্রুত কুইজ, সময় ছাড়া", flashcards: "তারিখের ফ্ল্যাশকার্ড",
  fixMistakes: "আপনার ভুলগুলো ঠিক করুন", fixSub: "{n} বাকি · প্রতিটির দুটি সঠিক উত্তর দরকার",
  chapterPractice: "অধ্যায় অনুযায়ী অনুশীলন", chapterSub: "সময় ছাড়া, উত্তরের ব্যাখ্যা সহ",
  studyNotes: "পড়ার নোট", studySub: "পাঁচটি অধ্যায়, সংক্ষিপ্ত ও অনুসন্ধানযোগ্য",
  testDay: "বুকিং ও পরীক্ষার দিন", testDaySub: "ফি, পরিচয়পত্র, কী নিতে হবে",
  lastMock: "শেষ মক", pass: "পাস", fail: "পাস নম্বরের নিচে", seeProgress: "সম্পূর্ণ অগ্রগতি দেখুন",
  questionN: "প্রশ্ন {a} / {b}", back: "পেছনে", next: "পরবর্তী", finish: "শেষ",
  flag: "পর্যালোচনার জন্য চিহ্নিত করুন", flagged: "চিহ্নিত", leave: "পরীক্ষা ছাড়ুন",
  handInTitle: "পরীক্ষা জমা দেবেন?", handIn: "জমা দিন", keepGoing: "চালিয়ে যান",
  allAnswered: "সব 24টির উত্তর দেওয়া হয়েছে।", unanswered: "{n}টি উত্তরহীন। ফাঁকা ভুল হিসেবে গণ্য।",
  chooseN: "{n}টি উত্তর বেছে নিন", why: "কেন", save: "সংরক্ষণ", savedWord: "সংরক্ষিত",
  passTitle: "পাস", failTitle: "এবার নয়",
  passBody: "এটি 24-এর মধ্যে প্রয়োজনীয় 18 বা তার বেশি।", failBody: "পাসের জন্য 24-এ 18 দরকার।",
  score: "নম্বর", correctPct: "সঠিক", time: "ব্যবহৃত সময়", byChapter: "অধ্যায় অনুযায়ী",
  reviewWrong: "ভুলগুলো দেখুন", again: "আবার পরীক্ষা", home: "হোম",
  wrongOnly: "শুধু ভুল", allQs: "সব 24", backToScore: "নম্বরে ফিরুন", newMock: "নতুন মক",
  whatWrong: "আপনি কী ভুল করেছেন", everyQ: "সব প্রশ্ন",
  checkAnswer: "উত্তর যাচাই করুন", seeResult: "ফলাফল দেখুন", stop: "থামুন", goAgain: "আবার করুন", done: "সম্পন্ন",
  ofWord: "/", outOf: "{b}-এর মধ্যে {a}",
  searchPh: "নোটে খুঁজুন…", results: "{n}টি ফলাফল", noMatch: "কিছু মেলেনি।",
  markRead: "পড়া হয়েছে চিহ্নিত করুন", isRead: "পড়া হয়েছে", testChapter: "এই অধ্যায়ের পরীক্ষা", allChapters: "সব অধ্যায়",
  tapReveal: "দেখতে ট্যাপ করুন", tapBack: "ফিরে যেতে ট্যাপ করুন", previous: "পূর্ববর্তী", shuffle: "এলোমেলো", all: "সব",
  progress: "অগ্রগতি", seen: "{b}-এর মধ্যে {a}টি প্রশ্ন দেখা", mockScores: "মক নম্বর",
  best: "সেরা", average: "গড়", history: "ইতিহাস", reset: "সব অগ্রগতি মুছুন",
  noMocks: "এখনও কোনও মক টেস্ট নেই। একটি দিন, নম্বর এখানে দেখাবে।",
  settings: "সেটিংস", darkMode: "ডার্ক মোড", darkSub: "রাতে চোখের জন্য আরামদায়ক",
  language: "ভাষা", yourName: "আপনার নাম", testDateLabel: "পরীক্ষার তারিখ", optional: "ঐচ্ছিক",
  localOnly: "আপনার অগ্রগতি শুধু এই ডিভাইসে সংরক্ষিত।",
  welcomeTitle: "Life in the UK পরীক্ষায় পাস করুন", getStarted: "শুরু করুন",
  skip: "এড়িয়ে যান", startStudying: "পড়া শুরু করুন", chooseLang: "আপনার ভাষা বেছে নিন",
  langNote: "পরীক্ষা ইংরেজিতে হয়, তাই প্রশ্ন ইংরেজিতেই থাকে। বাকি সব আপনার ভাষায়।",
  detailsTitle: "কিছু তথ্য", detailsSub: "দুটোই ঐচ্ছিক। তারিখ দিলে কাউন্টডাউন চালু হয়।",
  loading: "লোড হচ্ছে…", nothingHere: "এখানে এখনও কিছু নেই।", questions: "প্রশ্ন", saved: "সংরক্ষিত",
  ch1: "মূল্যবোধ", ch2: "যুক্তরাজ্য", ch3: "ইতিহাস", ch4: "সমাজ", ch5: "সরকার",
  vNone: "কয়েকটি মক টেস্ট দিন, তখন এটি অর্থবহ হবে।",
  vEarly: "শুরুর দিক। আরও মকের আগে নোট পড়ুন।",
  vMid: "এগোচ্ছেন। দুর্বল অধ্যায়ে মনোযোগ দিন।",
  vClose: "কাছাকাছি। ভুলের তালিকা পরিষ্কার করুন।",
  vReady: "আপনি পাস নম্বরের অনেক উপরে। বুকিংয়ের জন্য প্রস্তুত মনে হচ্ছে।",
};

T.ar = {
  morning: "صباح الخير", afternoon: "طاب يومك", evening: "مساء الخير",
  daysLeft: "بقي {n} يوماً على اختبارك", dayLeft: "بقي يوم واحد على اختبارك", testToday: "اختبارك اليوم. بالتوفيق.",
  format: "24 سؤالاً، 45 دقيقة، 18 للنجاح",
  mocks: "اختبارات تجريبية", passedN: "ناجحة", streak: "أيام متتالية", readiness: "الجاهزية",
  practise: "التدريب", learn: "التعلّم",
  startMock: "ابدأ اختباراً تجريبياً", startMockSub: "24 سؤالاً · 45 دقيقة · بتوقيت",
  quickQuiz: "اختبار سريع بلا وقت", flashcards: "بطاقات التواريخ",
  fixMistakes: "صحّح أخطاءك", fixSub: "{n} متبقية · يلزم إجابتان صحيحتان لكل سؤال",
  chapterPractice: "التدريب حسب الفصل", chapterSub: "بلا وقت، مع شرح الإجابة",
  studyNotes: "ملاحظات الدراسة", studySub: "الفصول الخمسة، مختصرة وقابلة للبحث",
  testDay: "الحجز ويوم الاختبار", testDaySub: "الرسوم والهوية وما يجب إحضاره",
  lastMock: "آخر اختبار", pass: "ناجح", fail: "دون درجة النجاح", seeProgress: "اطّلع على تقدمك الكامل",
  questionN: "السؤال {a} من {b}", back: "رجوع", next: "التالي", finish: "إنهاء",
  flag: "علّم للمراجعة", flagged: "معلَّم للمراجعة", leave: "مغادرة الاختبار",
  handInTitle: "هل تريد تسليم الاختبار؟", handIn: "سلّم الاختبار", keepGoing: "متابعة",
  allAnswered: "تمت الإجابة عن الأسئلة الـ24 كلها.", unanswered: "{n} بلا إجابة. الفراغ يُحتسب خطأً.",
  chooseN: "اختر {n} من الإجابات", why: "السبب", save: "حفظ", savedWord: "محفوظ",
  passTitle: "ناجح", failTitle: "ليس هذه المرة",
  passBody: "هذا يساوي أو يتجاوز 18 من 24 المطلوبة.", failBody: "تحتاج إلى 18 من 24 للنجاح.",
  score: "الدرجة", correctPct: "صحيحة", time: "الوقت المستغرق", byChapter: "حسب الفصل",
  reviewWrong: "مراجعة الأخطاء", again: "اختبار جديد", home: "الرئيسية",
  wrongOnly: "الخطأ فقط", allQs: "الـ24 كلها", backToScore: "العودة للدرجة", newMock: "اختبار جديد",
  whatWrong: "ما أخطأت فيه", everyQ: "كل الأسئلة",
  checkAnswer: "تحقق من الإجابة", seeResult: "اعرض النتيجة", stop: "إيقاف", goAgain: "أعد الكرّة", done: "تم",
  ofWord: "من", outOf: "{a} من {b}",
  searchPh: "ابحث في الملاحظات…", results: "{n} نتيجة", noMatch: "لا يوجد ما يطابق ذلك.",
  markRead: "علّم كمقروء", isRead: "مقروء", testChapter: "اختبر هذا الفصل", allChapters: "كل الفصول",
  tapReveal: "اضغط للكشف", tapBack: "اضغط للعودة", previous: "السابق", shuffle: "خلط", all: "الكل",
  progress: "التقدم", seen: "شاهدت {a} من {b} سؤالاً", mockScores: "درجات الاختبارات",
  best: "أفضل درجة", average: "المتوسط", history: "السجل", reset: "مسح كل التقدم",
  noMocks: "لا توجد اختبارات بعد. جرّب واحداً وستظهر درجاتك هنا.",
  settings: "الإعدادات", darkMode: "الوضع الداكن", darkSub: "أرفق بالعين ليلاً",
  language: "اللغة", yourName: "اسمك", testDateLabel: "تاريخ الاختبار", optional: "اختياري",
  localOnly: "يُحفظ تقدمك على هذا الجهاز فقط.",
  welcomeTitle: "انجح في اختبار Life in the UK", getStarted: "ابدأ",
  skip: "تخطٍّ", startStudying: "ابدأ الدراسة", chooseLang: "اختر لغتك",
  langNote: "الاختبار نفسه بالإنجليزية، لذا تبقى الأسئلة بالإنجليزية. أما بقية التطبيق فبلغتك.",
  detailsTitle: "بعض التفاصيل", detailsSub: "كلاهما اختياري. التاريخ يفعّل العد التنازلي.",
  loading: "جارٍ التحميل…", nothingHere: "لا شيء هنا بعد.", questions: "سؤالاً", saved: "محفوظة",
  ch1: "القيم", ch2: "المملكة المتحدة", ch3: "التاريخ", ch4: "المجتمع", ch5: "الحكومة",
  vNone: "جرّب بضعة اختبارات وسيصبح لهذا معنى.",
  vEarly: "البداية. اقرأ الملاحظات قبل مزيد من الاختبارات.",
  vMid: "تتقدم. ركّز على أضعف الفصول لديك.",
  vClose: "اقتربت. صفِّ قائمة أخطائك.",
  vReady: "درجاتك أعلى بكثير من حد النجاح. تبدو جاهزاً للحجز.",
};

T.ro = {
  morning: "Bună dimineața", afternoon: "Bună ziua", evening: "Bună seara",
  daysLeft: "{n} zile până la test", dayLeft: "O zi până la test", testToday: "Testul tău este azi. Mult succes.",
  format: "24 de întrebări, 45 de minute, 18 pentru promovare",
  mocks: "Teste date", passedN: "Promovate", streak: "Zile la rând", readiness: "Pregătire",
  practise: "Exersează", learn: "Învață",
  startMock: "Începe un test simulat", startMockSub: "24 de întrebări · 45 de minute · cronometrat",
  quickQuiz: "Test rapid, fără timp", flashcards: "Fișe cu date istorice",
  fixMistakes: "Corectează-ți greșelile", fixSub: "{n} rămase · două răspunsuri corecte fiecare",
  chapterPractice: "Exersează pe capitole", chapterSub: "Fără cronometru, cu explicații",
  studyNotes: "Notițe de studiu", studySub: "Toate cele cinci capitole, pe scurt",
  testDay: "Programare și ziua testului", testDaySub: "Taxa, actele, ce să iei cu tine",
  lastMock: "Ultimul test", pass: "Promovat", fail: "Sub pragul de promovare", seeProgress: "vezi progresul complet",
  questionN: "Întrebarea {a} din {b}", back: "Înapoi", next: "Următoarea", finish: "Termină",
  flag: "Marchează pentru revizuire", flagged: "Marcată", leave: "Părăsește testul",
  handInTitle: "Predai testul?", handIn: "Predă testul", keepGoing: "Continuă",
  allAnswered: "Toate cele 24 au răspuns.", unanswered: "{n} fără răspuns. Cele goale sunt greșite.",
  chooseN: "Alege {n} răspunsuri", why: "De ce", save: "Salvează", savedWord: "Salvată",
  passTitle: "Promovat", failTitle: "Nu de data asta",
  passBody: "Este cel puțin 18 din 24, cât este necesar.", failBody: "Ai nevoie de 18 din 24.",
  score: "Scor", correctPct: "Corecte", time: "Timp folosit", byChapter: "Pe capitole",
  reviewWrong: "Revezi greșelile", again: "Din nou", home: "Acasă",
  wrongOnly: "Doar greșite", allQs: "Toate 24", backToScore: "Înapoi la scor", newMock: "Test nou",
  whatWrong: "Ce ai greșit", everyQ: "Toate întrebările",
  checkAnswer: "Verifică răspunsul", seeResult: "Vezi rezultatul", stop: "Oprește", goAgain: "Încă o dată", done: "Gata",
  ofWord: "din", outOf: "{a} din {b}",
  searchPh: "Caută în notițe…", results: "{n} rezultate", noMatch: "Nu se potrivește nimic.",
  markRead: "Marchează ca citit", isRead: "Citit", testChapter: "Testează acest capitol", allChapters: "Toate capitolele",
  tapReveal: "Atinge pentru răspuns", tapBack: "Atinge pentru a reveni", previous: "Anterioară", shuffle: "Amestecă", all: "Toate",
  progress: "Progres", seen: "{a} din {b} întrebări văzute", mockScores: "Scoruri la teste",
  best: "Cel mai bun", average: "Media", history: "Istoric", reset: "Șterge tot progresul",
  noMocks: "Niciun test încă. Dă unul și scorurile apar aici.",
  settings: "Setări", darkMode: "Mod întunecat", darkSub: "Mai odihnitor seara",
  language: "Limbă", yourName: "Numele tău", testDateLabel: "Data testului", optional: "Opțional",
  localOnly: "Progresul este salvat doar pe acest dispozitiv.",
  welcomeTitle: "Promovează testul Life in the UK", getStarted: "Începe",
  skip: "Sari peste", startStudying: "Începe să studiezi", chooseLang: "Alege limba",
  langNote: "Testul este în engleză, deci întrebările rămân în engleză. Restul aplicației este în limba ta.",
  detailsTitle: "Câteva detalii", detailsSub: "Ambele sunt opționale. Data pornește numărătoarea inversă.",
  loading: "Se încarcă…", nothingHere: "Nimic aici încă.", questions: "întrebări", saved: "salvate",
  ch1: "Valori", ch2: "Regatul Unit", ch3: "Istorie", ch4: "Societate", ch5: "Guvern",
  vNone: "Dă câteva teste și asta va începe să însemne ceva.",
  vEarly: "La început. Citește notițele înainte de alte teste.",
  vMid: "Progresezi. Concentrează-te pe capitolele slabe.",
  vClose: "Aproape. Golește lista de greșeli.",
  vReady: "Ești mult peste pragul de promovare. Pari gata de programare.",
};

T.pl = {
  morning: "Dzień dobry", afternoon: "Dzień dobry", evening: "Dobry wieczór",
  daysLeft: "{n} dni do egzaminu", dayLeft: "1 dzień do egzaminu", testToday: "Twój egzamin jest dziś. Powodzenia.",
  format: "24 pytania, 45 minut, 18 do zdania",
  mocks: "Testy próbne", passedN: "Zdane", streak: "Dni z rzędu", readiness: "Gotowość",
  practise: "Ćwicz", learn: "Ucz się",
  startMock: "Rozpocznij test próbny", startMockSub: "24 pytania · 45 minut · na czas",
  quickQuiz: "Szybki quiz, bez czasu", flashcards: "Fiszki z datami",
  fixMistakes: "Popraw swoje błędy", fixSub: "{n} do wyczyszczenia · po dwie poprawne odpowiedzi",
  chapterPractice: "Ćwicz według rozdziałów", chapterSub: "Bez czasu, z wyjaśnieniem",
  studyNotes: "Notatki do nauki", studySub: "Pięć rozdziałów, skrótowo i z wyszukiwarką",
  testDay: "Rezerwacja i dzień egzaminu", testDaySub: "Opłata, dokumenty, co zabrać",
  lastMock: "Ostatni test", pass: "Zdane", fail: "Poniżej progu", seeProgress: "zobacz pełne postępy",
  questionN: "Pytanie {a} z {b}", back: "Wstecz", next: "Dalej", finish: "Zakończ",
  flag: "Oznacz do przeglądu", flagged: "Oznaczone", leave: "Opuść test",
  handInTitle: "Oddać test?", handIn: "Oddaj test", keepGoing: "Kontynuuj",
  allAnswered: "Wszystkie 24 mają odpowiedzi.", unanswered: "{n} bez odpowiedzi. Puste liczą się jako błędne.",
  chooseN: "Wybierz {n} odpowiedzi", why: "Dlaczego", save: "Zapisz", savedWord: "Zapisane",
  passTitle: "Zdane", failTitle: "Nie tym razem",
  passBody: "To co najmniej 18 z 24, czyli tyle, ile trzeba.", failBody: "Potrzebujesz 18 z 24.",
  score: "Wynik", correctPct: "Poprawne", time: "Zużyty czas", byChapter: "Według rozdziałów",
  reviewWrong: "Przejrzyj błędy", again: "Jeszcze raz", home: "Start",
  wrongOnly: "Tylko błędne", allQs: "Wszystkie 24", backToScore: "Wróć do wyniku", newMock: "Nowy test",
  whatWrong: "Co poszło źle", everyQ: "Wszystkie pytania",
  checkAnswer: "Sprawdź odpowiedź", seeResult: "Zobacz wynik", stop: "Zatrzymaj", goAgain: "Jeszcze raz", done: "Gotowe",
  ofWord: "z", outOf: "{a} z {b}",
  searchPh: "Szukaj w notatkach…", results: "{n} wyników", noMatch: "Nic nie pasuje.",
  markRead: "Oznacz jako przeczytane", isRead: "Przeczytane", testChapter: "Przetestuj ten rozdział", allChapters: "Wszystkie rozdziały",
  tapReveal: "Dotknij, aby odsłonić", tapBack: "Dotknij, aby wrócić", previous: "Poprzednia", shuffle: "Przetasuj", all: "Wszystkie",
  progress: "Postępy", seen: "{a} z {b} pytań zobaczonych", mockScores: "Wyniki testów",
  best: "Najlepszy", average: "Średnia", history: "Historia", reset: "Wyczyść postępy",
  noMocks: "Brak testów. Zrób jeden, a wyniki pojawią się tutaj.",
  settings: "Ustawienia", darkMode: "Tryb ciemny", darkSub: "Łagodniejszy dla oczu wieczorem",
  language: "Język", yourName: "Twoje imię", testDateLabel: "Data egzaminu", optional: "Opcjonalne",
  localOnly: "Postępy zapisywane są tylko na tym urządzeniu.",
  welcomeTitle: "Zdaj egzamin Life in the UK", getStarted: "Zaczynajmy",
  skip: "Pomiń", startStudying: "Zacznij naukę", chooseLang: "Wybierz język",
  langNote: "Egzamin jest po angielsku, więc pytania pozostają po angielsku. Reszta aplikacji jest w Twoim języku.",
  detailsTitle: "Kilka szczegółów", detailsSub: "Oba są opcjonalne. Data włącza odliczanie.",
  loading: "Ładowanie…", nothingHere: "Jeszcze nic tu nie ma.", questions: "pytań", saved: "zapisane",
  ch1: "Wartości", ch2: "Wielka Brytania", ch3: "Historia", ch4: "Społeczeństwo", ch5: "Rząd",
  vNone: "Zrób kilka testów, a to zacznie coś znaczyć.",
  vEarly: "Początki. Przeczytaj notatki przed kolejnymi testami.",
  vMid: "Idzie do przodu. Skup się na najsłabszych rozdziałach.",
  vClose: "Blisko. Wyczyść listę błędów.",
  vReady: "Jesteś znacznie powyżej progu. Wyglądasz na gotowego do rezerwacji.",
};

T.it = {
  morning: "Buongiorno", afternoon: "Buon pomeriggio", evening: "Buonasera",
  daysLeft: "{n} giorni al tuo test", dayLeft: "1 giorno al tuo test", testToday: "Il test è oggi. In bocca al lupo.",
  format: "24 domande, 45 minuti, 18 per passare",
  mocks: "Simulazioni", passedN: "Superate", streak: "Giorni di fila", readiness: "Preparazione",
  practise: "Esercitati", learn: "Studia",
  startMock: "Inizia una simulazione", startMockSub: "24 domande · 45 minuti · a tempo",
  quickQuiz: "Quiz veloce, senza tempo", flashcards: "Flashcard sulle date",
  fixMistakes: "Correggi i tuoi errori", fixSub: "{n} da sistemare · due risposte corrette ciascuna",
  chapterPractice: "Esercizi per capitolo", chapterSub: "Senza tempo, con spiegazione",
  studyNotes: "Appunti di studio", studySub: "Tutti e cinque i capitoli, in sintesi",
  testDay: "Prenotazione e giorno del test", testDaySub: "Costo, documenti, cosa portare",
  lastMock: "Ultima simulazione", pass: "Superato", fail: "Sotto la soglia", seeProgress: "vedi tutti i progressi",
  questionN: "Domanda {a} di {b}", back: "Indietro", next: "Avanti", finish: "Termina",
  flag: "Segna per la revisione", flagged: "Segnata", leave: "Esci dal test",
  handInTitle: "Consegnare il test?", handIn: "Consegna", keepGoing: "Continua",
  allAnswered: "Tutte e 24 hanno una risposta.", unanswered: "{n} senza risposta. Le vuote valgono come errate.",
  chooseN: "Scegli {n} risposte", why: "Perché", save: "Salva", savedWord: "Salvata",
  passTitle: "Superato", failTitle: "Non questa volta",
  passBody: "È pari o superiore alle 18 su 24 richieste.", failBody: "Servono 18 risposte corrette su 24.",
  score: "Punteggio", correctPct: "Corrette", time: "Tempo usato", byChapter: "Per capitolo",
  reviewWrong: "Rivedi gli errori", again: "Riprova", home: "Home",
  wrongOnly: "Solo errate", allQs: "Tutte e 24", backToScore: "Torna al punteggio", newMock: "Nuova simulazione",
  whatWrong: "Cosa hai sbagliato", everyQ: "Tutte le domande",
  checkAnswer: "Verifica la risposta", seeResult: "Vedi il risultato", stop: "Ferma", goAgain: "Ancora", done: "Fatto",
  ofWord: "di", outOf: "{a} su {b}",
  searchPh: "Cerca negli appunti…", results: "{n} risultati", noMatch: "Nessun risultato.",
  markRead: "Segna come letto", isRead: "Letto", testChapter: "Verifica questo capitolo", allChapters: "Tutti i capitoli",
  tapReveal: "Tocca per scoprire", tapBack: "Tocca per tornare", previous: "Precedente", shuffle: "Mescola", all: "Tutte",
  progress: "Progressi", seen: "{a} di {b} domande viste", mockScores: "Punteggi",
  best: "Migliore", average: "Media", history: "Cronologia", reset: "Azzera i progressi",
  noMocks: "Ancora nessuna simulazione. Falla e i punteggi appariranno qui.",
  settings: "Impostazioni", darkMode: "Modalità scura", darkSub: "Più riposante di sera",
  language: "Lingua", yourName: "Il tuo nome", testDateLabel: "Data del test", optional: "Facoltativo",
  localOnly: "I progressi sono salvati solo su questo dispositivo.",
  welcomeTitle: "Supera il test Life in the UK", getStarted: "Iniziamo",
  skip: "Salta", startStudying: "Inizia a studiare", chooseLang: "Scegli la lingua",
  langNote: "Il test è in inglese, quindi le domande restano in inglese. Tutto il resto è nella tua lingua.",
  detailsTitle: "Qualche dettaglio", detailsSub: "Entrambi facoltativi. La data attiva il conto alla rovescia.",
  loading: "Caricamento…", nothingHere: "Ancora niente qui.", questions: "domande", saved: "salvate",
  ch1: "Valori", ch2: "Il Regno Unito", ch3: "Storia", ch4: "Società", ch5: "Governo",
  vNone: "Fai qualche simulazione e questo inizierà ad avere senso.",
  vEarly: "Sei all'inizio. Leggi gli appunti prima di altre simulazioni.",
  vMid: "Stai migliorando. Concentrati sui capitoli più deboli.",
  vClose: "Ci sei quasi. Svuota la lista degli errori.",
  vReady: "Sei ben sopra la soglia. Sembri pronto a prenotare.",
};

T.pt = {
  morning: "Bom dia", afternoon: "Boa tarde", evening: "Boa noite",
  daysLeft: "{n} dias até o seu teste", dayLeft: "1 dia até o seu teste", testToday: "O seu teste é hoje. Boa sorte.",
  format: "24 perguntas, 45 minutos, 18 para passar",
  mocks: "Simulados feitos", passedN: "Aprovados", streak: "Dias seguidos", readiness: "Preparação",
  practise: "Praticar", learn: "Estudar",
  startMock: "Começar um simulado", startMockSub: "24 perguntas · 45 minutos · cronometrado",
  quickQuiz: "Quiz rápido, sem tempo", flashcards: "Cartões com datas",
  fixMistakes: "Corrija os seus erros", fixSub: "{n} por resolver · duas respostas certas cada",
  chapterPractice: "Praticar por capítulo", chapterSub: "Sem tempo, com explicação",
  studyNotes: "Notas de estudo", studySub: "Os cinco capítulos, resumidos e pesquisáveis",
  testDay: "Marcação e dia do teste", testDaySub: "Taxa, documentos, o que levar",
  lastMock: "Último simulado", pass: "Aprovado", fail: "Abaixo da nota", seeProgress: "veja todo o progresso",
  questionN: "Pergunta {a} de {b}", back: "Voltar", next: "Seguinte", finish: "Terminar",
  flag: "Marcar para rever", flagged: "Marcada", leave: "Sair do teste",
  handInTitle: "Entregar o teste?", handIn: "Entregar", keepGoing: "Continuar",
  allAnswered: "Todas as 24 respondidas.", unanswered: "{n} sem resposta. Em branco conta como errado.",
  chooseN: "Escolha {n} respostas", why: "Porquê", save: "Guardar", savedWord: "Guardada",
  passTitle: "Aprovado", failTitle: "Desta vez não",
  passBody: "Isso é igual ou acima das 18 em 24 necessárias.", failBody: "Precisa de 18 em 24 para passar.",
  score: "Pontuação", correctPct: "Certas", time: "Tempo usado", byChapter: "Por capítulo",
  reviewWrong: "Rever os erros", again: "Testar de novo", home: "Início",
  wrongOnly: "Só as erradas", allQs: "Todas as 24", backToScore: "Voltar à pontuação", newMock: "Novo simulado",
  whatWrong: "O que errou", everyQ: "Todas as perguntas",
  checkAnswer: "Verificar resposta", seeResult: "Ver o resultado", stop: "Parar", goAgain: "Outra vez", done: "Concluído",
  ofWord: "de", outOf: "{a} em {b}",
  searchPh: "Pesquisar nas notas…", results: "{n} resultados", noMatch: "Nada corresponde.",
  markRead: "Marcar como lido", isRead: "Lido", testChapter: "Testar este capítulo", allChapters: "Todos os capítulos",
  tapReveal: "Toque para revelar", tapBack: "Toque para voltar", previous: "Anterior", shuffle: "Baralhar", all: "Todos",
  progress: "Progresso", seen: "{a} de {b} perguntas vistas", mockScores: "Pontuações",
  best: "Melhor", average: "Média", history: "Histórico", reset: "Apagar todo o progresso",
  noMocks: "Ainda sem simulados. Faça um e as pontuações aparecem aqui.",
  settings: "Definições", darkMode: "Modo escuro", darkSub: "Mais confortável à noite",
  language: "Idioma", yourName: "O seu nome", testDateLabel: "Data do teste", optional: "Opcional",
  localOnly: "O progresso é guardado apenas neste dispositivo.",
  welcomeTitle: "Passe no teste Life in the UK", getStarted: "Começar",
  skip: "Ignorar", startStudying: "Começar a estudar", chooseLang: "Escolha o seu idioma",
  langNote: "O teste é em inglês, por isso as perguntas ficam em inglês. O resto está no seu idioma.",
  detailsTitle: "Alguns detalhes", detailsSub: "Ambos opcionais. A data ativa a contagem decrescente.",
  loading: "A carregar…", nothingHere: "Ainda nada aqui.", questions: "perguntas", saved: "guardadas",
  ch1: "Valores", ch2: "O Reino Unido", ch3: "História", ch4: "Sociedade", ch5: "Governo",
  vNone: "Faça alguns simulados e isto começará a significar algo.",
  vEarly: "Ainda no início. Leia as notas antes de mais simulados.",
  vMid: "A melhorar. Foque-se nos capítulos mais fracos.",
  vClose: "Quase lá. Limpe a lista de erros.",
  vReady: "Está bem acima da nota mínima. Parece pronto para marcar.",
};

T.gu = {
  morning: "સુપ્રભાત", afternoon: "નમસ્તે", evening: "શુભ સાંજ",
  daysLeft: "તમારી પરીક્ષામાં {n} દિવસ બાકી", dayLeft: "પરીક્ષામાં 1 દિવસ બાકી", testToday: "તમારી પરીક્ષા આજે છે. શુભેચ્છા.",
  format: "24 પ્રશ્નો, 45 મિનિટ, પાસ માટે 18",
  mocks: "મોક ટેસ્ટ", passedN: "પાસ", streak: "દિવસની શ્રેણી", readiness: "તૈયારી",
  practise: "અભ્યાસ", learn: "શીખો",
  startMock: "મોક ટેસ્ટ શરૂ કરો", startMockSub: "24 પ્રશ્નો · 45 મિનિટ · સમયબદ્ધ",
  quickQuiz: "ઝડપી ક્વિઝ, સમય વગર", flashcards: "તારીખો માટે ફ્લેશકાર્ડ",
  fixMistakes: "તમારી ભૂલો સુધારો", fixSub: "{n} બાકી · દરેક માટે બે સાચા જવાબ જોઈએ",
  chapterPractice: "પ્રકરણ પ્રમાણે અભ્યાસ", chapterSub: "સમય વગર, જવાબની સમજૂતી સાથે",
  studyNotes: "અભ્યાસ નોંધ", studySub: "પાંચેય પ્રકરણ, ટૂંકમાં અને શોધી શકાય તેવા",
  testDay: "બુકિંગ અને પરીક્ષાનો દિવસ", testDaySub: "ફી, ઓળખપત્ર, શું લઈ જવું",
  lastMock: "છેલ્લો મોક", pass: "પાસ", fail: "પાસ ગુણથી ઓછું", seeProgress: "સંપૂર્ણ પ્રગતિ જુઓ",
  questionN: "પ્રશ્ન {a} / {b}", back: "પાછળ", next: "આગળ", finish: "સમાપ્ત",
  flag: "સમીક્ષા માટે નિશાની કરો", flagged: "નિશાનીવાળું", leave: "પરીક્ષા છોડો",
  handInTitle: "પરીક્ષા જમા કરવી?", handIn: "જમા કરો", keepGoing: "ચાલુ રાખો",
  allAnswered: "બધા 24 જવાબ અપાયા.", unanswered: "{n} જવાબ વગર. ખાલી ખોટા ગણાય છે.",
  chooseN: "{n} જવાબ પસંદ કરો", why: "શા માટે", save: "સાચવો", savedWord: "સાચવેલું",
  passTitle: "પાસ", failTitle: "આ વખતે નહીં",
  passBody: "આ 24 માંથી જરૂરી 18 જેટલું કે વધુ છે.", failBody: "પાસ થવા 24 માંથી 18 જોઈએ.",
  score: "ગુણ", correctPct: "સાચા", time: "વપરાયેલો સમય", byChapter: "પ્રકરણ પ્રમાણે",
  reviewWrong: "ભૂલો જુઓ", again: "ફરી પરીક્ષા", home: "હોમ",
  wrongOnly: "ફક્ત ખોટા", allQs: "બધા 24", backToScore: "ગુણ પર પાછા", newMock: "નવો મોક",
  whatWrong: "તમે શું ખોટું કર્યું", everyQ: "બધા પ્રશ્નો",
  checkAnswer: "જવાબ ચકાસો", seeResult: "પરિણામ જુઓ", stop: "રોકો", goAgain: "ફરી કરો", done: "થઈ ગયું",
  ofWord: "/", outOf: "{b} માંથી {a}",
  searchPh: "નોંધમાં શોધો…", results: "{n} પરિણામ", noMatch: "કંઈ મળ્યું નહીં.",
  markRead: "વાંચેલું નિશાની કરો", isRead: "વાંચેલું", testChapter: "આ પ્રકરણની પરીક્ષા", allChapters: "બધા પ્રકરણ",
  tapReveal: "જોવા માટે ટેપ કરો", tapBack: "પાછા જવા ટેપ કરો", previous: "પાછલું", shuffle: "ફેરવો", all: "બધા",
  progress: "પ્રગતિ", seen: "{b} માંથી {a} પ્રશ્નો જોયા", mockScores: "મોક ગુણ",
  best: "શ્રેષ્ઠ", average: "સરેરાશ", history: "ઇતિહાસ", reset: "બધી પ્રગતિ ભૂંસો",
  noMocks: "હજુ કોઈ મોક ટેસ્ટ નથી. એક આપો અને ગુણ અહીં દેખાશે.",
  settings: "સેટિંગ્સ", darkMode: "ડાર્ક મોડ", darkSub: "રાત્રે આંખો માટે સરળ",
  language: "ભાષા", yourName: "તમારું નામ", testDateLabel: "પરીક્ષાની તારીખ", optional: "વૈકલ્પિક",
  localOnly: "તમારી પ્રગતિ ફક્ત આ ડિવાઇસ પર સચવાય છે.",
  welcomeTitle: "Life in the UK પરીક્ષા પાસ કરો", getStarted: "શરૂ કરો",
  skip: "છોડો", startStudying: "અભ્યાસ શરૂ કરો", chooseLang: "તમારી ભાષા પસંદ કરો",
  langNote: "પરીક્ષા અંગ્રેજીમાં હોય છે, તેથી પ્રશ્નો અંગ્રેજીમાં રહે છે. બાકીનું બધું તમારી ભાષામાં છે.",
  detailsTitle: "થોડી વિગતો", detailsSub: "બંને વૈકલ્પિક છે. તારીખથી ગણતરી શરૂ થાય છે.",
  loading: "લોડ થાય છે…", nothingHere: "અહીં હજુ કંઈ નથી.", questions: "પ્રશ્નો", saved: "સાચવેલા",
  ch1: "મૂલ્યો", ch2: "યુકે", ch3: "ઇતિહાસ", ch4: "સમાજ", ch5: "સરકાર",
  vNone: "થોડા મોક ટેસ્ટ આપો, પછી આનો અર્થ થશે.",
  vEarly: "શરૂઆત છે. વધુ મોક પહેલાં નોંધ વાંચો.",
  vMid: "પ્રગતિ થાય છે. નબળા પ્રકરણો પર ધ્યાન આપો.",
  vClose: "નજીક છો. ભૂલોની યાદી સાફ કરો.",
  vReady: "તમે પાસ ગુણથી ઘણા ઉપર છો. બુકિંગ માટે તૈયાર લાગો છો.",
};

T.ta = {
  morning: "காலை வணக்கம்", afternoon: "மதிய வணக்கம்", evening: "மாலை வணக்கம்",
  daysLeft: "உங்கள் தேர்வுக்கு {n} நாட்கள்", dayLeft: "தேர்வுக்கு 1 நாள்", testToday: "உங்கள் தேர்வு இன்று. வாழ்த்துகள்.",
  format: "24 கேள்விகள், 45 நிமிடங்கள், தேர்ச்சிக்கு 18",
  mocks: "மாதிரித் தேர்வுகள்", passedN: "தேர்ச்சி", streak: "தொடர் நாட்கள்", readiness: "தயார்நிலை",
  practise: "பயிற்சி", learn: "கற்க",
  startMock: "மாதிரித் தேர்வைத் தொடங்கு", startMockSub: "24 கேள்விகள் · 45 நிமிடங்கள் · நேரத்துடன்",
  quickQuiz: "விரைவு வினாடி வினா", flashcards: "தேதிகளுக்கான அட்டைகள்",
  fixMistakes: "உங்கள் தவறுகளைச் சரிசெய்", fixSub: "{n} மீதம் · ஒவ்வொன்றுக்கும் இரு சரியான பதில்கள்",
  chapterPractice: "அத்தியாயம் வாரியாகப் பயிற்சி", chapterSub: "நேரமின்றி, விளக்கத்துடன்",
  studyNotes: "படிப்புக் குறிப்புகள்", studySub: "ஐந்து அத்தியாயங்களும், சுருக்கமாக",
  testDay: "பதிவு மற்றும் தேர்வு நாள்", testDaySub: "கட்டணம், அடையாள அட்டை, என்ன கொண்டு வர வேண்டும்",
  lastMock: "கடைசி தேர்வு", pass: "தேர்ச்சி", fail: "தேர்ச்சி மதிப்பெண்ணுக்குக் கீழே", seeProgress: "முழு முன்னேற்றத்தைப் பார்",
  questionN: "கேள்வி {a} / {b}", back: "பின்", next: "அடுத்து", finish: "முடி",
  flag: "மறுபார்வைக்குக் குறி", flagged: "குறிக்கப்பட்டது", leave: "தேர்வை விடு",
  handInTitle: "தேர்வைச் சமர்ப்பிக்கவா?", handIn: "சமர்ப்பி", keepGoing: "தொடர்",
  allAnswered: "24 கேள்விகளுக்கும் பதில் அளிக்கப்பட்டது.", unanswered: "{n} பதிலளிக்கப்படவில்லை. வெறுமை தவறாகக் கணக்கிடப்படும்.",
  chooseN: "{n} பதில்களைத் தேர்ந்தெடு", why: "ஏன்", save: "சேமி", savedWord: "சேமிக்கப்பட்டது",
  passTitle: "தேர்ச்சி", failTitle: "இந்த முறை இல்லை",
  passBody: "இது 24-இல் தேவையான 18 அல்லது அதற்கு மேல்.", failBody: "தேர்ச்சிக்கு 24-இல் 18 தேவை.",
  score: "மதிப்பெண்", correctPct: "சரி", time: "எடுத்த நேரம்", byChapter: "அத்தியாயம் வாரியாக",
  reviewWrong: "தவறுகளைப் பார்", again: "மீண்டும் தேர்வு", home: "முகப்பு",
  wrongOnly: "தவறானவை மட்டும்", allQs: "அனைத்து 24", backToScore: "மதிப்பெண்ணுக்குத் திரும்பு", newMock: "புதிய தேர்வு",
  whatWrong: "நீங்கள் தவறியவை", everyQ: "அனைத்துக் கேள்விகளும்",
  checkAnswer: "பதிலைச் சரிபார்", seeResult: "முடிவைப் பார்", stop: "நிறுத்து", goAgain: "மீண்டும்", done: "முடிந்தது",
  ofWord: "/", outOf: "{b}-இல் {a}",
  searchPh: "குறிப்புகளில் தேடு…", results: "{n} முடிவுகள்", noMatch: "எதுவும் பொருந்தவில்லை.",
  markRead: "படித்ததாகக் குறி", isRead: "படித்தாயிற்று", testChapter: "இந்த அத்தியாயத்தைச் சோதி", allChapters: "அனைத்து அத்தியாயங்கள்",
  tapReveal: "பார்க்கத் தட்டு", tapBack: "திரும்பத் தட்டு", previous: "முந்தையது", shuffle: "கலை", all: "அனைத்தும்",
  progress: "முன்னேற்றம்", seen: "{b}-இல் {a} கேள்விகள் பார்க்கப்பட்டன", mockScores: "தேர்வு மதிப்பெண்கள்",
  best: "சிறந்தது", average: "சராசரி", history: "வரலாறு", reset: "அனைத்து முன்னேற்றத்தையும் அழி",
  noMocks: "இன்னும் தேர்வுகள் இல்லை. ஒன்று எழுதுங்கள், மதிப்பெண்கள் இங்கே தோன்றும்.",
  settings: "அமைப்புகள்", darkMode: "இருள் பயன்முறை", darkSub: "இரவில் கண்களுக்கு எளிது",
  language: "மொழி", yourName: "உங்கள் பெயர்", testDateLabel: "தேர்வு தேதி", optional: "விருப்பத்தேர்வு",
  localOnly: "உங்கள் முன்னேற்றம் இந்தச் சாதனத்தில் மட்டுமே சேமிக்கப்படும்.",
  welcomeTitle: "Life in the UK தேர்வில் தேர்ச்சி பெறுங்கள்", getStarted: "தொடங்கு",
  skip: "தவிர்", startStudying: "படிக்கத் தொடங்கு", chooseLang: "உங்கள் மொழியைத் தேர்ந்தெடுங்கள்",
  langNote: "தேர்வு ஆங்கிலத்தில் நடக்கிறது, எனவே கேள்விகள் ஆங்கிலத்திலேயே இருக்கும். மற்ற அனைத்தும் உங்கள் மொழியில்.",
  detailsTitle: "சில விவரங்கள்", detailsSub: "இரண்டும் விருப்பத்தேர்வு. தேதி கவுண்ட்டவுனைத் தொடங்கும்.",
  loading: "ஏற்றுகிறது…", nothingHere: "இங்கே இன்னும் ஒன்றும் இல்லை.", questions: "கேள்விகள்", saved: "சேமிக்கப்பட்டவை",
  ch1: "மதிப்புகள்", ch2: "ஐக்கிய இராச்சியம்", ch3: "வரலாறு", ch4: "சமூகம்", ch5: "அரசு",
  vNone: "சில தேர்வுகள் எழுதுங்கள், பிறகு இதற்குப் பொருள் வரும்.",
  vEarly: "தொடக்கம். மேலும் தேர்வுகளுக்கு முன் குறிப்புகளைப் படியுங்கள்.",
  vMid: "முன்னேறுகிறீர்கள். பலவீனமான அத்தியாயங்களில் கவனம் செலுத்துங்கள்.",
  vClose: "நெருங்கிவிட்டீர்கள். தவறுகள் பட்டியலை அழியுங்கள்.",
  vReady: "தேர்ச்சி மதிப்பெண்ணை விட மிக மேலே இருக்கிறீர்கள். பதிவு செய்யத் தயார்.",
};

T.fa = {
  morning: "صبح بخیر", afternoon: "ظهر بخیر", evening: "عصر بخیر",
  daysLeft: "{n} روز تا آزمون شما", dayLeft: "۱ روز تا آزمون شما", testToday: "آزمون شما امروز است. موفق باشید.",
  format: "۲۴ سؤال، ۴۵ دقیقه، ۱۸ برای قبولی",
  mocks: "آزمون‌های آزمایشی", passedN: "قبول", streak: "روزهای پیاپی", readiness: "آمادگی",
  practise: "تمرین", learn: "یادگیری",
  startMock: "شروع آزمون آزمایشی", startMockSub: "۲۴ سؤال · ۴۵ دقیقه · زمان‌دار",
  quickQuiz: "آزمون سریع، بدون زمان", flashcards: "فلش‌کارت تاریخ‌ها",
  fixMistakes: "اشتباهات خود را اصلاح کنید", fixSub: "{n} باقی‌مانده · هرکدام دو پاسخ درست لازم دارد",
  chapterPractice: "تمرین بر اساس فصل", chapterSub: "بدون زمان، همراه با توضیح",
  studyNotes: "یادداشت‌های مطالعه", studySub: "هر پنج فصل، خلاصه و قابل جست‌وجو",
  testDay: "رزرو و روز آزمون", testDaySub: "هزینه، مدارک، چه چیزی همراه ببرید",
  lastMock: "آخرین آزمون", pass: "قبول", fail: "زیر نمرهٔ قبولی", seeProgress: "پیشرفت کامل را ببینید",
  questionN: "سؤال {a} از {b}", back: "بازگشت", next: "بعدی", finish: "پایان",
  flag: "علامت برای مرور", flagged: "علامت‌گذاری شد", leave: "خروج از آزمون",
  handInTitle: "آزمون را تحویل می‌دهید؟", handIn: "تحویل بده", keepGoing: "ادامه بده",
  allAnswered: "به هر ۲۴ سؤال پاسخ داده شد.", unanswered: "{n} بی‌پاسخ. سؤال خالی غلط حساب می‌شود.",
  chooseN: "{n} پاسخ انتخاب کنید", why: "چرا", save: "ذخیره", savedWord: "ذخیره شد",
  passTitle: "قبول", failTitle: "این بار نه",
  passBody: "این برابر یا بالاتر از ۱۸ از ۲۴ لازم است.", failBody: "برای قبولی ۱۸ از ۲۴ لازم است.",
  score: "نمره", correctPct: "درست", time: "زمان مصرف‌شده", byChapter: "بر اساس فصل",
  reviewWrong: "مرور اشتباهات", again: "آزمون دوباره", home: "خانه",
  wrongOnly: "فقط اشتباه‌ها", allQs: "هر ۲۴", backToScore: "بازگشت به نمره", newMock: "آزمون جدید",
  whatWrong: "چه چیزی را اشتباه زدید", everyQ: "همهٔ سؤال‌ها",
  checkAnswer: "بررسی پاسخ", seeResult: "دیدن نتیجه", stop: "توقف", goAgain: "دوباره", done: "انجام شد",
  ofWord: "از", outOf: "{a} از {b}",
  searchPh: "در یادداشت‌ها جست‌وجو کنید…", results: "{n} نتیجه", noMatch: "چیزی مطابقت ندارد.",
  markRead: "علامت خوانده‌شده", isRead: "خوانده شد", testChapter: "آزمون این فصل", allChapters: "همهٔ فصل‌ها",
  tapReveal: "برای دیدن ضربه بزنید", tapBack: "برای بازگشت ضربه بزنید", previous: "قبلی", shuffle: "بُر بزن", all: "همه",
  progress: "پیشرفت", seen: "{a} از {b} سؤال دیده شده", mockScores: "نمرات آزمون",
  best: "بهترین", average: "میانگین", history: "تاریخچه", reset: "پاک کردن همهٔ پیشرفت",
  noMocks: "هنوز آزمونی نداده‌اید. یکی بدهید تا نمرات اینجا نمایش داده شود.",
  settings: "تنظیمات", darkMode: "حالت تاریک", darkSub: "شب‌ها برای چشم راحت‌تر",
  language: "زبان", yourName: "نام شما", testDateLabel: "تاریخ آزمون", optional: "اختیاری",
  localOnly: "پیشرفت شما فقط روی همین دستگاه ذخیره می‌شود.",
  welcomeTitle: "در آزمون Life in the UK قبول شوید", getStarted: "شروع کنید",
  skip: "رد کردن", startStudying: "شروع مطالعه", chooseLang: "زبان خود را انتخاب کنید",
  langNote: "خود آزمون به انگلیسی است، بنابراین سؤال‌ها انگلیسی می‌مانند. بقیهٔ برنامه به زبان شماست.",
  detailsTitle: "چند جزئیات", detailsSub: "هر دو اختیاری‌اند. تاریخ، شمارش معکوس را فعال می‌کند.",
  loading: "در حال بارگذاری…", nothingHere: "هنوز چیزی اینجا نیست.", questions: "سؤال", saved: "ذخیره‌شده",
  ch1: "ارزش‌ها", ch2: "بریتانیا", ch3: "تاریخ", ch4: "جامعه", ch5: "دولت",
  vNone: "چند آزمون بدهید تا این عدد معنا پیدا کند.",
  vEarly: "در ابتدای راه. پیش از آزمون‌های بیشتر، یادداشت‌ها را بخوانید.",
  vMid: "در حال پیشرفت. روی فصل‌های ضعیف‌تر تمرکز کنید.",
  vClose: "نزدیک شده‌اید. فهرست اشتباهات را خالی کنید.",
  vReady: "نمرهٔ شما بسیار بالاتر از حد قبولی است. آمادهٔ رزرو به نظر می‌رسید.",
};

T.zh = {
  morning: "早上好", afternoon: "下午好", evening: "晚上好",
  daysLeft: "距离考试还有 {n} 天", dayLeft: "距离考试还有 1 天", testToday: "今天就是考试日，祝你顺利。",
  format: "24 题，45 分钟，答对 18 题及格",
  mocks: "模拟考次数", passedN: "通过", streak: "连续天数", readiness: "准备度",
  practise: "练习", learn: "学习",
  startMock: "开始模拟考试", startMockSub: "24 题 · 45 分钟 · 计时",
  quickQuiz: "快速测验，不计时", flashcards: "年份记忆卡",
  fixMistakes: "订正你的错题", fixSub: "还剩 {n} 题 · 每题需连答对两次",
  chapterPractice: "按章节练习", chapterSub: "不计时，附答案解析",
  studyNotes: "学习笔记", studySub: "五个章节，精简且可搜索",
  testDay: "预约与考试当天", testDaySub: "费用、证件、需要携带的物品",
  lastMock: "上次模拟考", pass: "通过", fail: "低于及格线", seeProgress: "查看完整进度",
  questionN: "第 {a} 题，共 {b} 题", back: "上一题", next: "下一题", finish: "结束",
  flag: "标记以便复查", flagged: "已标记", leave: "退出考试",
  handInTitle: "要交卷吗？", handIn: "交卷", keepGoing: "继续答题",
  allAnswered: "24 题全部作答。", unanswered: "还有 {n} 题未作答，空题算错。",
  chooseN: "请选择 {n} 个答案", why: "解析", save: "收藏", savedWord: "已收藏",
  passTitle: "通过", failTitle: "这次没过",
  passBody: "已达到或超过 24 题中答对 18 题的要求。", failBody: "及格需要 24 题中答对 18 题。",
  score: "得分", correctPct: "正确率", time: "用时", byChapter: "各章节表现",
  reviewWrong: "复查错题", again: "再考一次", home: "首页",
  wrongOnly: "仅错题", allQs: "全部 24 题", backToScore: "返回成绩", newMock: "新的模拟考",
  whatWrong: "你答错的题", everyQ: "所有题目",
  checkAnswer: "检查答案", seeResult: "查看结果", stop: "停止", goAgain: "再来一次", done: "完成",
  ofWord: "/", outOf: "{b} 题中答对 {a} 题",
  searchPh: "在笔记中搜索…", results: "{n} 条结果", noMatch: "没有匹配的内容。",
  markRead: "标记为已读", isRead: "已读", testChapter: "测试本章", allChapters: "所有章节",
  tapReveal: "点击查看答案", tapBack: "点击返回", previous: "上一张", shuffle: "打乱顺序", all: "全部",
  progress: "进度", seen: "已练习 {b} 题中的 {a} 题", mockScores: "模拟考成绩",
  best: "最高分", average: "平均分", history: "历史记录", reset: "清除所有进度",
  noMocks: "还没有模拟考记录。考一次，成绩就会显示在这里。",
  settings: "设置", darkMode: "深色模式", darkSub: "夜间阅读更护眼",
  language: "语言", yourName: "你的名字", testDateLabel: "考试日期", optional: "可选",
  localOnly: "你的进度仅保存在本设备上。",
  welcomeTitle: "顺利通过 Life in the UK 考试", getStarted: "开始",
  skip: "跳过", startStudying: "开始学习", chooseLang: "选择你的语言",
  langNote: "考试本身用英语进行，因此题目保持英文。其余界面为你的语言。",
  detailsTitle: "几项信息", detailsSub: "两项都可不填。填了日期就会开始倒数。",
  loading: "加载中…", nothingHere: "这里还没有内容。", questions: "题", saved: "已收藏",
  ch1: "价值观", ch2: "英国概况", ch3: "历史", ch4: "社会", ch5: "政府",
  vNone: "先做几次模拟考，这个数字才有意义。",
  vEarly: "刚起步。再考之前先读笔记。",
  vMid: "有进步。集中攻克最弱的章节。",
  vClose: "快到了。把错题清单清空。",
  vReady: "你的分数远高于及格线，看起来可以预约考试了。",
};

T.tl = {
  morning: "Magandang umaga", afternoon: "Magandang hapon", evening: "Magandang gabi",
  daysLeft: "{n} araw na lang bago ang test", dayLeft: "1 araw na lang bago ang test", testToday: "Ngayon ang test mo. Good luck.",
  format: "24 na tanong, 45 minuto, 18 para pumasa",
  mocks: "Mock test", passedN: "Pasado", streak: "Sunod-sunod na araw", readiness: "Kahandaan",
  practise: "Mag-ensayo", learn: "Mag-aral",
  startMock: "Simulan ang mock test", startMockSub: "24 na tanong · 45 minuto · may oras",
  quickQuiz: "Mabilis na pagsusulit", flashcards: "Flashcard ng mga petsa",
  fixMistakes: "Ayusin ang iyong mga mali", fixSub: "{n} pa · kailangan ng dalawang tamang sagot bawat isa",
  chapterPractice: "Mag-ensayo kada kabanata", chapterSub: "Walang oras, may paliwanag",
  studyNotes: "Mga tala sa pag-aaral", studySub: "Lahat ng limang kabanata, pinaikli",
  testDay: "Booking at araw ng test", testDaySub: "Bayad, ID, ano ang dalhin",
  lastMock: "Huling mock", pass: "Pasado", fail: "Kulang sa passing mark", seeProgress: "tingnan ang buong progreso",
  questionN: "Tanong {a} sa {b}", back: "Bumalik", next: "Susunod", finish: "Tapusin",
  flag: "Markahan para balikan", flagged: "Nakamarka", leave: "Umalis sa test",
  handInTitle: "Ipasa na ang test?", handIn: "Ipasa", keepGoing: "Magpatuloy",
  allAnswered: "Nasagot lahat ng 24.", unanswered: "{n} ang walang sagot. Ang blangko ay mali.",
  chooseN: "Pumili ng {n} sagot", why: "Bakit", save: "I-save", savedWord: "Naka-save",
  passTitle: "Pasado", failTitle: "Hindi ngayon",
  passBody: "Umabot ka sa kailangang 18 sa 24.", failBody: "Kailangan ng 18 sa 24 para pumasa.",
  score: "Iskor", correctPct: "Tama", time: "Oras na ginamit", byChapter: "Kada kabanata",
  reviewWrong: "Balikan ang mali", again: "Ulitin", home: "Home",
  wrongOnly: "Mali lang", allQs: "Lahat ng 24", backToScore: "Balik sa iskor", newMock: "Bagong mock",
  whatWrong: "Ang mga namali mo", everyQ: "Lahat ng tanong",
  checkAnswer: "Suriin ang sagot", seeResult: "Tingnan ang resulta", stop: "Itigil", goAgain: "Ulitin", done: "Tapos",
  ofWord: "sa", outOf: "{a} sa {b}",
  searchPh: "Maghanap sa mga tala…", results: "{n} resulta", noMatch: "Walang tugma.",
  markRead: "Markahan bilang nabasa", isRead: "Nabasa na", testChapter: "Subukan ang kabanatang ito", allChapters: "Lahat ng kabanata",
  tapReveal: "Pindutin para makita", tapBack: "Pindutin para bumalik", previous: "Nakaraan", shuffle: "Haluin", all: "Lahat",
  progress: "Progreso", seen: "{a} sa {b} tanong ang nakita", mockScores: "Mga iskor",
  best: "Pinakamataas", average: "Karaniwan", history: "Kasaysayan", reset: "Burahin lahat ng progreso",
  noMocks: "Wala pang mock test. Sumubok at lilitaw dito ang iskor mo.",
  settings: "Mga setting", darkMode: "Dark mode", darkSub: "Mas madali sa mata sa gabi",
  language: "Wika", yourName: "Pangalan mo", testDateLabel: "Petsa ng test", optional: "Opsyonal",
  localOnly: "Ang progreso mo ay nasa device na ito lamang.",
  welcomeTitle: "Pumasa sa Life in the UK test", getStarted: "Magsimula",
  skip: "Laktawan", startStudying: "Simulan ang pag-aaral", chooseLang: "Piliin ang iyong wika",
  langNote: "Ang test mismo ay nasa Ingles, kaya nananatiling Ingles ang mga tanong. Ang iba ay nasa wika mo.",
  detailsTitle: "Ilang detalye", detailsSub: "Pareho itong opsyonal. Sisimulan ng petsa ang countdown.",
  loading: "Naglo-load…", nothingHere: "Wala pa rito.", questions: "tanong", saved: "naka-save",
  ch1: "Mga pagpapahalaga", ch2: "Ang UK", ch3: "Kasaysayan", ch4: "Lipunan", ch5: "Pamahalaan",
  vNone: "Sumubok ng ilang mock test at magkakaroon ito ng saysay.",
  vEarly: "Simula pa lang. Basahin ang mga tala bago magdagdag ng mock.",
  vMid: "May progreso. Tutukan ang pinakamahinang kabanata.",
  vClose: "Malapit na. Linisin ang listahan ng mali.",
  vReady: "Mataas ka na sa passing mark. Mukhang handa ka nang mag-book.",
};

let LANG = "en";
const t = (k, v) => tr(LANG, k, v);

function tr(lang, key, vars) {
  let s = (T[lang] && T[lang][key]) || T.en[key] || key;
  if (vars) Object.keys(vars).forEach((k) => { s = s.split("{" + k + "}").join(vars[k]); });
  return s;
}


/* ------------------------------------------------------------
   QUESTION SUBTITLES
   Questions stay in English (the real test is in English) with a
   translation shown underneath. Translations are fetched once,
   then cached on the device forever.
   ------------------------------------------------------------ */

// The body below is the Anthropic Messages API shape, but the browser cannot post it to
// api.anthropic.com: there is no key to send and CORS blocks the request. So the URL is a proxy of
// your own that attaches `x-api-key` and `anthropic-version` server-side and forwards the body.
// Unset — the default — turns the whole feature off: no request, no toggle, questions stay English.
const CUSTOM_SUB_ENDPOINT = import.meta.env.VITE_UK_TRANSLATE_URL || "";
const SUB_ENDPOINT = CUSTOM_SUB_ENDPOINT || "https://api.mymemory.translated.net/get";
const SUBS_AVAILABLE = true;

let SUBS = SUBS_AVAILABLE;
const subCache = {};
const subPending = {};

function subKey(lang, id) { return "uk2:s:" + lang + ":" + id; }

function normaliseTargetLang(lang) {
  const map = { tl: "fil", zh: "zh-CN" };
  return map[lang] || lang;
}

async function fetchPublicTranslation(text, lang) {
  if (!text || !String(text).trim()) return "";
  const target = normaliseTargetLang(lang);
  const url = `${SUB_ENDPOINT}?q=${encodeURIComponent(text)}&langpair=en|${target}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`translation request failed: ${res.status}`);
  const data = await res.json();
  return data?.responseData?.translatedText || data?.matches?.[0]?.translation || text;
}

async function getSub(q, lang) {
  if (lang === "en") return null;
  const key = subKey(lang, q.i);
  if (subCache[key] !== undefined) return subCache[key];
  if (subPending[key]) return subPending[key];

  subPending[key] = (async () => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        const valid = normaliseTranslation(parsed, q, LANGS.find((l) => l.id === lang)?.name || "target language");
        if (valid) {
          subCache[key] = valid;
          return valid;
        }
      }
    } catch (e) {}

    const base = QUESTIONS.find((x) => x.i === q.i);
    const meta = LANGS.find((l) => l.id === lang) || { name: "English" };
    try {
      let parsed = null;
      if (CUSTOM_SUB_ENDPOINT) {
        const res = await fetch(CUSTOM_SUB_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-opus-5",
            max_tokens: 2000,
            thinking: { type: "disabled" },
            output_config: { effort: "low" },
            messages: [{
              role: "user",
              content:
                "Translate this UK citizenship test question and its answer options into " + meta.name + ".\n" +
                "Rules: keep UK proper nouns, place names, institutions and official terms in English (for example Magna Carta, House of Commons, Hadrian's Wall). Keep dates and numbers as digits. Translate naturally, not word for word. Keep each option short.\n" +
                "Reply with JSON only, no markdown fences, with no extra commentary, in this exact shape: {\"q\":\"...\",\"o\":[\"...\"],\"e\":\"...\"}\n\n" +
                "Question: " + base.q + "\n" +
                "Options: " + JSON.stringify(base.o) + "\n" +
                "Explanation: " + base.e,
            }],
          }),
        });

        const data = await res.json();
        const content = data?.content || data?.message?.content || data?.text || data?.output || "";
        let text = "";
        if (Array.isArray(content)) {
          text = content.map((c) => typeof c === "string" ? c : c?.text || "").join("");
        } else if (typeof content === "string") {
          text = content;
        } else if (content && typeof content === "object") {
          text = typeof content.text === "string" ? content.text : JSON.stringify(content);
        }

        const trimmed = text.replace(/```(?:json)?/gi, "").trim();
        try { parsed = JSON.parse(trimmed); }
        catch (e) {
          const matched = trimmed.match(/\{[\s\S]*\}/);
          if (matched) parsed = JSON.parse(matched[0]);
        }
      } else {
        const [qText, eText, ...optionTexts] = await Promise.all([
          fetchPublicTranslation(base.q, lang),
          fetchPublicTranslation(base.e, lang),
          ...base.o.map((opt) => fetchPublicTranslation(opt, lang)),
        ]);
        parsed = { q: qText, e: eText, o: optionTexts.slice(0, base.o.length) };
      }

      const valid = normaliseTranslation(parsed, base, meta.name);
      if (!valid) throw new Error("bad shape");

      subCache[key] = valid;
      save(key, valid);
      return valid;
    } catch (e) {
      subCache[key] = null;
      return null;
    } finally {
      delete subPending[key];
    }
  })();

  return subPending[key];
}

function useSub(q) {
  const [sub, setSub] = useState(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let alive = true;
    setSub(null);
    if (LANG === "en" || !SUBS) return;
    const key = subKey(LANG, q.i);
    if (subCache[key] !== undefined) { setSub(subCache[key]); return; }
    setBusy(true);
    getSub(q, LANG).then((r) => { if (alive) { setSub(r); setBusy(false); } });
    return () => { alive = false; };
  }, [q.i, LANG, SUBS]);
  return { sub, busy };
}

/* ============================================================
   CONSTANTS AND HELPERS
   ============================================================ */

const EXAM_LEN = 24;
const PASS_MARK = 18;
const EXAM_SECONDS = 45 * 60;
const MIX = { 1: 2, 2: 2, 3: 8, 4: 6, 5: 6 };
const CH_COLOR = { 1: "#7C5CFF", 2: "#0EA5A5", 3: "#F0733F", 4: "#E0518A", 5: "#2F6BFF" };

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randomise(q) {
  const idx = shuffle(q.o.map((_, i) => i));
  return { ...q, o: idx.map((i) => q.o[i]), a: q.a.map((c) => idx.indexOf(c)).sort((x, y) => x - y) };
}

function buildExam() {
  let picked = [];
  for (const ch of [1, 2, 3, 4, 5]) {
    picked = picked.concat(shuffle(QUESTIONS.filter((q) => q.c === ch)).slice(0, MIX[ch]));
  }
  return shuffle(picked).map(randomise);
}

function sameSet(a, b) {
  if (!a || a.length !== b.length) return false;
  return [...a].sort().join(",") === [...b].sort().join(",");
}

function fmt(s) {
  s = Math.max(0, s);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + "T00:00:00");
  const now = new Date(today() + "T00:00:00");
  return Math.round((d - now) / 86400000);
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return t("morning");
  if (h < 18) return t("afternoon");
  return t("evening");
}

/* stats: { [qid]: { r, w, s } }  s = consecutive correct */
function mistakeIds(stats) {
  return Object.keys(stats)
    .filter((k) => stats[k].w > 0 && stats[k].s < 2)
    .map(Number);
}

function chapterStats(stats) {
  return CHAPTERS.map((ch) => {
    const pool = QUESTIONS.filter((q) => q.c === ch.n);
    let attempted = 0, right = 0, total = 0;
    pool.forEach((q) => {
      const s = stats[q.i];
      if (s) {
        attempted += 1;
        right += s.r;
        total += s.r + s.w;
      }
    });
    return {
      ch,
      pool: pool.length,
      attempted,
      accuracy: total ? right / total : 0,
      coverage: pool.length ? attempted / pool.length : 0,
    };
  });
}

function readiness(stats) {
  const cs = chapterStats(stats);
  const weights = { 1: 2, 2: 2, 3: 8, 4: 6, 5: 6 };
  let sum = 0, wsum = 0;
  cs.forEach((c) => {
    const w = weights[c.ch.n];
    const conf = Math.min(1, c.coverage / 0.6);
    sum += w * c.accuracy * conf;
    wsum += w;
  });
  return Math.round((sum / wsum) * 100);
}

// Everything the app remembers lives on the device. Both stay async: the callers await them, and
// keeping the signatures means a future server-backed store is a drop-in replacement.
async function load(key, fallback) {
  try {
    const r = localStorage.getItem(key);
    return r ? JSON.parse(r) : fallback;
  } catch (e) {
    return fallback;
  }
}

async function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
}

/* ============================================================
   STYLES
   ============================================================ */

const CSS = `
.uk{
  --bg:#F7F4EF; --card:#FFFFFF; --soft:#EFEBE3; --line:#E0DAD0;
  --ink:#141A24; --ink2:#5B6472; --ink3:#8A93A0;
  --brand:#2F6BFF; --brand-d:#1E4FD0; --brand-soft:#E8EFFF;
  --hot:#FF6A3D; --hot-soft:#FFEDE6;
  --go:#0E9F6E; --go-soft:#E4F6EF;
  --stop:#E02424; --stop-soft:#FDECEC;
  --amber:#F59E0B; --amber-soft:#FEF3DC;
  min-height:100vh;background:var(--bg);color:var(--ink);
  font-family:'Plus Jakarta Sans',system-ui,-apple-system,sans-serif;
  font-size:16px;line-height:1.5;-webkit-font-smoothing:antialiased;
  padding-bottom:env(safe-area-inset-bottom);
}
.uk[data-dark="1"]{
  --bg:#0C1017; --card:#151B24; --soft:#1D242F; --line:#28303C;
  --ink:#EDF1F6; --ink2:#9AA5B4; --ink3:#6C7684;
  --brand:#5B8CFF; --brand-d:#3D74F5; --brand-soft:#1A2438;
  --hot:#FF8256; --hot-soft:#2E1D18;
  --go:#2BC48D; --go-soft:#12291F;
  --stop:#FF5C5C; --stop-soft:#2C1618;
  --amber:#FFBB3D; --amber-soft:#2C2214;
}
.uk *{box-sizing:border-box}
.uk button{font-family:inherit;color:inherit}
.uk :focus-visible{outline:3px solid var(--brand);outline-offset:2px}
.mono{font-variant-numeric:tabular-nums;font-feature-settings:"tnum"}

.top{position:sticky;top:0;z-index:40;background:var(--bg);display:flex;align-items:center;gap:10px;padding:14px 18px 10px}
.logo{width:30px;height:30px;border-radius:9px;background:var(--brand);color:#fff;display:grid;place-items:center;font-size:14px;font-weight:800;flex:0 0 auto}
.wordmark{font-size:16px;font-weight:800;letter-spacing:-0.02em}
.iconbtn{margin-left:auto;width:34px;height:34px;border-radius:10px;border:1px solid var(--line);background:var(--card);display:grid;place-items:center;cursor:pointer;font-size:15px}
.iconbtn+.iconbtn{margin-left:0}
.page{max-width:560px;margin:0 auto;padding:4px 18px 110px}

.hero{background:var(--brand);border-radius:22px;padding:20px;color:#fff;position:relative;overflow:hidden}
.hero.win{background:var(--go)} .hero.lose{background:var(--stop)}
.hero h1{margin:0;font-size:26px;font-weight:800;letter-spacing:-0.03em;line-height:1.1}
.hero p{margin:8px 0 0;font-size:14px;color:rgba(255,255,255,.88)}
.hero-stats{display:flex;gap:20px;margin-top:18px;padding-top:16px;border-top:1px solid rgba(255,255,255,.25)}
.hs b{display:block;font-size:20px;font-weight:800;letter-spacing:-0.02em}
.hs span{font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:rgba(255,255,255,.75)}

.ring-wrap{display:flex;align-items:center;gap:18px;background:var(--card);border:1px solid var(--line);border-radius:20px;padding:18px;margin-top:12px}
.ring{flex:0 0 auto;position:relative;width:88px;height:88px}
.ring svg{transform:rotate(-90deg)}
.ring-val{position:absolute;inset:0;display:grid;place-items:center;font-size:22px;font-weight:800;letter-spacing:-0.03em}
.ring-txt b{display:block;font-size:15px;font-weight:700;margin-bottom:3px}
.ring-txt span{font-size:13px;color:var(--ink2);line-height:1.45;display:block}

.chips{display:flex;gap:8px;overflow-x:auto;margin-top:14px;padding-bottom:4px;scrollbar-width:none}
.chips::-webkit-scrollbar{display:none}
.chip{flex:0 0 auto;border:1px solid var(--line);background:var(--card);border-radius:999px;padding:8px 14px;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap}
.chip.on{background:var(--ink);color:var(--bg);border-color:var(--ink)}

.eyebrow{font-size:11px;text-transform:uppercase;letter-spacing:.14em;color:var(--ink3);font-weight:700;margin:26px 0 10px}
.h2{font-size:22px;font-weight:800;letter-spacing:-0.03em;margin:0 0 6px}
.lede{font-size:14px;color:var(--ink2);margin:0 0 18px;line-height:1.55}

.row{display:flex;align-items:center;gap:13px;width:100%;text-align:left;background:var(--card);
  border:1px solid var(--line);border-radius:16px;padding:14px;cursor:pointer;transition:transform .1s,border-color .1s}
.row:hover{border-color:var(--brand);transform:translateY(-1px)}
.row.big{padding:16px}
.row.fill{background:var(--brand);border-color:var(--brand);color:#fff}
.row.fill .row-s{color:rgba(255,255,255,.8)}
.ic{flex:0 0 auto;width:40px;height:40px;border-radius:12px;display:grid;place-items:center;font-size:17px;background:var(--soft)}
.row-t{font-weight:700;font-size:15px;display:block;letter-spacing:-0.01em}
.row-s{font-size:12.5px;color:var(--ink2);display:block;margin-top:2px}
.row-go{margin-left:auto;color:var(--ink3);font-size:19px;flex:0 0 auto}
.row.fill .row-go{color:rgba(255,255,255,.7)}
.grid2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}

.tile{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:14px;text-align:left;cursor:pointer}
.tile:hover{border-color:var(--brand)}
.tile b{display:block;font-size:22px;font-weight:800;letter-spacing:-0.03em}
.tile span{display:block;font-size:12px;color:var(--ink2);margin-top:2px}

.btn{border:none;border-radius:14px;padding:14px 18px;font-size:15px;font-weight:700;cursor:pointer;letter-spacing:-0.01em}
.btn-p{background:var(--brand);color:#fff}
.btn-d{background:var(--ink);color:var(--bg)}
.btn-g{background:transparent;border:1px solid var(--line);color:var(--ink)}
.btn-g:hover{border-color:var(--ink2)}
.btn:disabled{opacity:.42;cursor:not-allowed}
.btnrow{display:flex;gap:10px;margin-top:18px}
.btnrow .btn{flex:1}

.examhead{position:sticky;top:0;z-index:30;background:var(--bg);padding:12px 0 10px;border-bottom:1px solid var(--line);margin-bottom:18px}
.examtop{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.count{font-size:13px;font-weight:700}
.clock{margin-left:auto;font-size:14px;font-weight:700;padding:5px 11px;border-radius:9px;background:var(--soft)}
.clock.low{background:var(--stop);color:#fff}
.bar{height:6px;background:var(--soft);border-radius:4px;overflow:hidden}
.bar i{display:block;height:100%;background:var(--brand);transition:width .25s}
.strip{display:flex;gap:4px;overflow-x:auto;margin-top:10px;scrollbar-width:none}
.strip::-webkit-scrollbar{display:none}
.tick{flex:1 0 auto;min-width:24px;height:24px;border-radius:7px;border:1px solid var(--line);background:var(--card);
  color:var(--ink3);font-size:10px;font-weight:700;cursor:pointer;padding:0;display:grid;place-items:center}
.tick.done{background:var(--brand);border-color:var(--brand);color:#fff}
.tick.flag{border-color:var(--amber);border-width:2px}
.tick.at{outline:2px solid var(--ink);outline-offset:1px}

.qcard{background:var(--card);border:1px solid var(--line);border-radius:20px;padding:20px}
.qtag{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;
  padding:4px 10px;border-radius:999px;background:var(--soft);color:var(--ink2)}
.qtext{font-size:19px;font-weight:700;line-height:1.35;margin:12px 0 4px;letter-spacing:-0.02em}
.qhint{font-size:12.5px;color:var(--brand);font-weight:700;margin-bottom:12px}
.opt{display:flex;gap:12px;align-items:flex-start;width:100%;text-align:left;background:var(--card);
  border:1px solid var(--line);border-radius:14px;padding:13px 14px;margin-top:9px;cursor:pointer;
  font-size:15px;line-height:1.4;transition:border-color .1s}
.opt:hover{border-color:var(--brand)}
.opt.sel{border-color:var(--brand);border-width:2px;background:var(--brand-soft)}
.opt.right{border-color:var(--go);border-width:2px;background:var(--go-soft)}
.opt.wrong{border-color:var(--stop);border-width:2px;background:var(--stop-soft)}
.key{flex:0 0 auto;width:26px;height:26px;border-radius:8px;border:1px solid var(--line);display:grid;place-items:center;
  font-size:12px;font-weight:800;margin-top:-1px}
.opt.sel .key{background:var(--brand);border-color:var(--brand);color:#fff}
.opt.right .key{background:var(--go);border-color:var(--go);color:#fff}
.opt.wrong .key{background:var(--stop);border-color:var(--stop);color:#fff}
.why{margin-top:14px;padding:14px;border-radius:14px;background:var(--soft);font-size:14px;line-height:1.55}
.why b{display:block;font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:var(--ink3);margin-bottom:5px}
.linkbtn{background:none;border:none;color:var(--ink2);font-size:13px;font-weight:700;cursor:pointer;padding:9px 0;margin-top:4px}
.linkbtn.on{color:var(--amber)}

.brk{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--line)}
.dot{flex:0 0 auto;width:10px;height:10px;border-radius:3px}
.brk-n{font-size:14px;font-weight:600;flex:1}
.brk-b{flex:0 0 76px;height:7px;background:var(--soft);border-radius:4px;overflow:hidden}
.brk-b i{display:block;height:100%}
.brk-s{font-size:13px;flex:0 0 46px;text-align:right;color:var(--ink2);font-weight:600}

.sec{background:var(--card);border:1px solid var(--line);border-radius:16px;margin-bottom:9px;overflow:hidden}
.sech{width:100%;display:flex;align-items:center;gap:10px;background:none;border:none;padding:15px 16px;
  cursor:pointer;text-align:left;font-size:15px;font-weight:700;letter-spacing:-0.01em}
.chev{margin-left:auto;color:var(--ink3);font-size:14px;transition:transform .18s}
.chev.open{transform:rotate(90deg)}
.secb{padding:0 16px 16px}
.secb ul{margin:0;padding-left:19px}
.secb li{font-size:14.5px;line-height:1.6;margin-bottom:9px}
.secb li mark{background:var(--amber-soft);color:inherit;padding:1px 2px;border-radius:3px}

.search{width:100%;border:1px solid var(--line);background:var(--card);border-radius:14px;padding:13px 14px;
  font-size:15px;font-family:inherit;color:var(--ink);margin-bottom:14px}
.search::placeholder{color:var(--ink3)}

.flash{background:var(--card);border:1px solid var(--line);border-radius:22px;padding:32px 22px;min-height:210px;
  display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;cursor:pointer}
.flash-f{font-size:28px;font-weight:800;letter-spacing:-0.03em;line-height:1.2}
.flash-b{font-size:17px;line-height:1.45;color:var(--ink)}
.flash-hint{font-size:12px;color:var(--ink3);margin-top:16px}

.hist{display:flex;align-items:center;gap:12px;padding:13px 0;border-bottom:1px solid var(--line)}
.badge{font-size:11px;font-weight:800;padding:4px 10px;border-radius:999px;letter-spacing:.02em}
.badge.p{background:var(--go-soft);color:var(--go)}
.badge.f{background:var(--stop-soft);color:var(--stop)}
.spark{display:flex;align-items:flex-end;gap:3px;height:60px;margin:6px 0 2px}
.spark i{flex:1;background:var(--brand);border-radius:3px 3px 0 0;min-height:3px}
.spark i.f{background:var(--stop)}

.empty{text-align:center;color:var(--ink2);font-size:14px;padding:34px 12px;line-height:1.65}
.foot{margin-top:24px;font-size:12px;color:var(--ink3);line-height:1.65}
.note{background:var(--amber-soft);border-radius:14px;padding:13px 14px;font-size:13px;line-height:1.55;margin-top:14px}

.nav{position:fixed;left:0;right:0;bottom:0;z-index:50;background:var(--card);border-top:1px solid var(--line);
  display:flex;padding:8px 0 calc(8px + env(safe-area-inset-bottom))}
.navi{flex:1;background:none;border:none;cursor:pointer;display:grid;justify-items:center;gap:3px;color:var(--ink3);padding:4px 0}
.navi.on{color:var(--brand)}
.navi span{font-size:10.5px;font-weight:700}
.navi em{font-size:18px;font-style:normal;line-height:1}

.field{margin-bottom:16px}
.field label{display:block;font-size:13px;font-weight:700;margin-bottom:7px}
.field input{width:100%;border:1px solid var(--line);background:var(--card);border-radius:13px;padding:13px 14px;
  font-size:16px;font-family:inherit;color:var(--ink)}
.toggle{display:flex;align-items:center;gap:12px;background:var(--card);border:1px solid var(--line);
  border-radius:16px;padding:15px;width:100%;cursor:pointer;text-align:left}
.sw{margin-left:auto;width:46px;height:27px;border-radius:999px;background:var(--soft);position:relative;flex:0 0 auto;transition:background .15s}
.sw i{position:absolute;top:3px;left:3px;width:21px;height:21px;border-radius:50%;background:#fff;transition:left .15s;box-shadow:0 1px 3px rgba(0,0,0,.2)}
.sw.on{background:var(--go)} .sw.on i{left:22px}

@media (max-width:400px){ .hero h1{font-size:23px} .qtext{font-size:17.5px} }
@media (prefers-reduced-motion:reduce){ .uk *{transition:none!important} }

.uk[dir="rtl"] .row-go{transform:scaleX(-1)}
.uk[dir="rtl"] .chev{transform:rotate(180deg)}
.uk[dir="rtl"] .chev.open{transform:rotate(90deg)}
.uk[dir="rtl"] .clock,.uk[dir="rtl"] .row-go{margin-left:0;margin-right:auto}
.uk[dir="rtl"] .iconbtn{margin-left:0}
.uk[dir="rtl"] .top .iconbtn:first-of-type{margin-right:auto}
.uk[dir="rtl"] .secb ul{padding-left:0;padding-right:19px}
.uk[dir="rtl"] .linkbtn{text-align:right}
.uk[dir="rtl"] .brk-s{text-align:left}
.uk[dir="rtl"] .qtext,.uk[dir="rtl"] .lede,.uk[dir="rtl"] .why{text-align:right}
.uk[dir="rtl"] .opt,.uk[dir="rtl"] .row,.uk[dir="rtl"] .toggle{text-align:right}
.qsub{font-size:15.5px;line-height:1.45;color:var(--ink2);margin:6px 0 2px;font-weight:600}
.qsub.dim{color:var(--ink3);letter-spacing:.2em}
.osub{display:block;font-size:13.5px;line-height:1.4;color:var(--ink2);margin-top:3px}
.wsub{display:block;font-size:13.5px;line-height:1.5;color:var(--ink2);margin-top:8px;padding-top:8px;border-top:1px solid var(--line)}
.uk[dir="rtl"] .qsub,.uk[dir="rtl"] .osub,.uk[dir="rtl"] .wsub{text-align:right;direction:rtl}
.lang-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
.lang{border:1px solid var(--line);background:var(--card);border-radius:14px;padding:13px 12px;cursor:pointer;text-align:left}
.lang.on{border-color:var(--brand);border-width:2px;background:var(--brand-soft)}
.lang b{display:block;font-size:15px;font-weight:700}
.lang span{display:block;font-size:12px;color:var(--ink2);margin-top:2px}
`;

/* ============================================================
   SHARED PIECES
   ============================================================ */

function Ring({ value }) {
  const r = 38, c = 2 * Math.PI * r;
  const tone = value >= 80 ? "var(--go)" : value >= 60 ? "var(--brand)" : value >= 35 ? "var(--amber)" : "var(--stop)";
  return (
    <div className="ring">
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r={r} fill="none" stroke="var(--soft)" strokeWidth="9" />
        <circle cx="44" cy="44" r={r} fill="none" stroke={tone} strokeWidth="9" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c - (c * value) / 100} />
      </svg>
      <div className="ring-val mono" style={{ color: tone }}>{value}%</div>
    </div>
  );
}

function Q({ q, chosen, onChoose, revealed, bookmarked, onBookmark }) {
  const multi = q.a.length > 1;
  const keys = ["A", "B", "C", "D", "E"];
  const { sub, busy } = useSub(q);
  const base = QUESTIONS.find((x) => x.i === q.i);
  const optSub = (text) => {
    if (!sub || !sub.o) return null;
    const idx = base.o.indexOf(text);
    return idx > -1 ? sub.o[idx] : null;
  };
  const pick = (i) => {
    if (revealed) return;
    if (multi) {
      const has = chosen.includes(i);
      let next = has ? chosen.filter((x) => x !== i) : [...chosen, i];
      if (next.length > q.a.length) next = next.slice(1);
      onChoose(next);
    } else onChoose([i]);
  };
  return (
    <div className="qcard">
      <span className="qtag">
        <i style={{ width: 8, height: 8, borderRadius: 2, background: CH_COLOR[q.c], display: "inline-block" }} />
        {t("ch" + q.c)}
      </span>
      {onBookmark && (
        <button className={"linkbtn" + (bookmarked ? " on" : "")} onClick={onBookmark}
          style={{ float: "right", marginTop: 0, padding: "2px 0" }}>
          {bookmarked ? "★ " + t("savedWord") : "☆ " + t("save")}
        </button>
      )}
      <p className="qtext">{q.q}</p>
      {sub && <p className="qsub">{sub.q}</p>}
      {busy && <p className="qsub dim">···</p>}
      {multi && <div className="qhint">{t("chooseN", { n: q.a.length })}</div>}
      {q.o.map((text, i) => {
        let cls = "opt";
        if (revealed) {
          if (q.a.includes(i)) cls += " right";
          else if (chosen.includes(i)) cls += " wrong";
        } else if (chosen.includes(i)) cls += " sel";
        return (
          <button key={i} className={cls} onClick={() => pick(i)}>
            <span className="key">{keys[i]}</span>
            <span>
              {text}
              {optSub(text) && <span className="osub">{optSub(text)}</span>}
            </span>
          </button>
        );
      })}
      {revealed && (
        <div className="why">
          <b>{t("why")}</b>
          {q.e}
          {sub && sub.e && <span className="wsub">{sub.e}</span>}
        </div>
      )}
    </div>
  );
}


function LangPicker({ value, onPick }) {
  return (
    <div className="lang-grid">
      {LANGS.map((l) => (
        <button key={l.id} className={"lang" + (value === l.id ? " on" : "")} onClick={() => onPick(l.id)}>
          <b dir={l.rtl ? "rtl" : "ltr"}>{l.native}</b>
          <span>{l.name}</span>
        </button>
      ))}
    </div>
  );
}

/* ============================================================
   ONBOARDING
   ============================================================ */

function Onboarding({ onDone, lang, setLang }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");

  if (step === 0) {
    return (
      <div className="page" style={{ paddingTop: 30 }}>
        <div className="hero">
          <h1>{t("welcomeTitle")}</h1>
          <p>{QUESTIONS.length} {t("questions")} · {LANGS.length} {t("language").toLowerCase()}</p>
          <div className="hero-stats mono">
            <div className="hs"><b>24</b><span>{t("questions")}</span></div>
            <div className="hs"><b>45</b><span>{t("time")}</span></div>
            <div className="hs"><b>18</b><span>{t("pass")}</span></div>
          </div>
        </div>
        <div className="note" style={{ background: "var(--soft)" }}>
          Life in the United Kingdom: A Guide for New Residents (3rd edition)
        </div>
        <div className="btnrow"><button className="btn btn-p" onClick={() => setStep(1)}>{t("getStarted")}</button></div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="page" style={{ paddingTop: 30 }}>
        <div className="h2">{t("chooseLang")}</div>
        <p className="lede">{t("langNote")}</p>
        <LangPicker value={lang} onPick={setLang} />
        <div className="btnrow">
          <button className="btn btn-p" onClick={() => setStep(2)}>{t("next")}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page" style={{ paddingTop: 30 }}>
      <div className="h2">{t("detailsTitle")}</div>
      <p className="lede">{t("detailsSub")}</p>
      <div className="field">
        <label htmlFor="ob-name">{t("yourName")}</label>
        <input id="ob-name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t("optional")} />
      </div>
      <div className="field">
        <label htmlFor="ob-date">{t("testDateLabel")}</label>
        <input id="ob-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div className="btnrow">
        <button className="btn btn-g" onClick={() => onDone({ name: "", testDate: "" })}>{t("skip")}</button>
        <button className="btn btn-p" onClick={() => onDone({ name: name.trim(), testDate: date })}>{t("startStudying")}</button>
      </div>
    </div>
  );
}

/* ============================================================
   HOME
   ============================================================ */

function Home({ profile, stats, history, go, streak }) {
  const ready = readiness(stats);
  const mis = mistakeIds(stats);
  const days = daysUntil(profile.testDate);
  const seen = Object.keys(stats).length;
  const last = history[0];

  let verdict = t("vNone");
  if (seen > 20) {
    if (ready >= 85) verdict = t("vReady");
    else if (ready >= 70) verdict = t("vClose");
    else if (ready >= 45) verdict = t("vMid");
    else verdict = t("vEarly");
  }

  return (
    <div className="page">
      <div className="hero">
        <h1>{greeting()}{profile.name ? `, ${profile.name}` : ""}</h1>
        <p>{days !== null && days >= 0
          ? days === 0 ? t("testToday") : days === 1 ? t("dayLeft") : t("daysLeft", { n: days })
          : t("format")}</p>
        <div className="hero-stats mono">
          <div className="hs"><b>{history.length}</b><span>{t("mocks")}</span></div>
          <div className="hs"><b>{history.filter((h) => h.score >= PASS_MARK).length}</b><span>{t("passedN")}</span></div>
          <div className="hs"><b>{streak}</b><span>{t("streak")}</span></div>
        </div>
      </div>

      <div className="ring-wrap">
        <Ring value={ready} />
        <div className="ring-txt">
          <b>{t("readiness")}</b>
          <span>{verdict}</span>
        </div>
      </div>

      <div className="eyebrow">{t("practise")}</div>
      <div style={{ display: "grid", gap: 10 }}>
        <button className="row big fill" onClick={() => go("exam")}>
          <span className="ic" style={{ background: "rgba(255,255,255,.2)" }}>▶</span>
          <span>
            <span className="row-t">{t("startMock")}</span>
            <span className="row-s">{t("startMockSub")}</span>
          </span>
          <span className="row-go">›</span>
        </button>
        <div className="grid2">
          <button className="tile" onClick={() => go("quick")}>
            <b className="mono">10</b>
            <span>{t("quickQuiz")}</span>
          </button>
          <button className="tile" onClick={() => go("cards")}>
            <b className="mono">{FLASHCARDS.length}</b>
            <span>{t("flashcards")}</span>
          </button>
        </div>
        {mis.length > 0 && (
          <button className="row" onClick={() => go("mistakes")}>
            <span className="ic" style={{ background: "var(--amber-soft)", color: "var(--amber)" }}>!</span>
            <span>
              <span className="row-t">{t("fixMistakes")}</span>
              <span className="row-s">{t("fixSub", { n: mis.length })}</span>
            </span>
            <span className="row-go">›</span>
          </button>
        )}
        <button className="row" onClick={() => go("practice")}>
          <span className="ic">✓</span>
          <span>
            <span className="row-t">{t("chapterPractice")}</span>
            <span className="row-s">{t("chapterSub")}</span>
          </span>
          <span className="row-go">›</span>
        </button>
      </div>

      <div className="eyebrow">{t("learn")}</div>
      <div style={{ display: "grid", gap: 10 }}>
        <button className="row" onClick={() => go("study")}>
          <span className="ic" style={{ background: "var(--brand-soft)", color: "var(--brand)" }}>☰</span>
          <span>
            <span className="row-t">{t("studyNotes")}</span>
            <span className="row-s">{t("studySub")}</span>
          </span>
          <span className="row-go">›</span>
        </button>
        <button className="row" onClick={() => go("testday")}>
          <span className="ic" style={{ background: "var(--hot-soft)", color: "var(--hot)" }}>i</span>
          <span>
            <span className="row-t">{t("testDay")}</span>
            <span className="row-s">{t("testDaySub")}</span>
          </span>
          <span className="row-go">›</span>
        </button>
      </div>

      {last && (
        <>
          <div className="eyebrow">{t("lastMock")}</div>
          <button className="row" onClick={() => go("progress")}>
            <span className="ic mono" style={{ width: "auto", padding: "0 12px", fontSize: 15, fontWeight: 800 }}>
              {last.score}/24
            </span>
            <span>
              <span className="row-t">{last.score >= PASS_MARK ? t("pass") : t("fail")}</span>
              <span className="row-s">{last.date} · {t("seeProgress")}</span>
            </span>
            <span className="row-go">›</span>
          </button>
        </>
      )}
    </div>
  );
}

/* ============================================================
   EXAM
   ============================================================ */

function Exam({ onFinish, onQuit }) {
  const [qs] = useState(buildExam);
  const [ans, setAns] = useState({});
  const [flags, setFlags] = useState([]);
  const [at, setAt] = useState(0);
  const [left, setLeft] = useState(EXAM_SECONDS);
  const [confirm, setConfirm] = useState(false);
  const top = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setLeft((l) => l - 1), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => { if (left <= 0) onFinish(qs, ans, EXAM_SECONDS); }, [left]);

  const q = qs[at];
  const done = Object.keys(ans).length;
  const jump = (i) => { setAt(i); if (top.current) top.current.scrollIntoView({ block: "start" }); };

  if (confirm) {
    const missing = EXAM_LEN - done;
    return (
      <div className="page" style={{ paddingTop: 20 }}>
        <div className="h2">{t("handInTitle")}</div>
        <p className="lede">
          {missing === 0 ? t("allAnswered") : t("unanswered", { n: missing })}
        </p>
        
        <div className="btnrow">
          <button className="btn btn-g" onClick={() => setConfirm(false)}>{t("keepGoing")}</button>
          <button className="btn btn-d" onClick={() => onFinish(qs, ans, EXAM_SECONDS - left)}>{t("handIn")}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page" style={{ paddingTop: 0 }}>
      <div ref={top} />
      <div className="examhead">
        <div className="examtop">
          <span className="count mono">{t("questionN", { a: at + 1, b: EXAM_LEN })}</span>
          <span className={"clock mono" + (left < 300 ? " low" : "")}>{fmt(left)}</span>
        </div>
        <div className="bar"><i style={{ width: `${(done / EXAM_LEN) * 100}%` }} /></div>
        <div className="strip">
          {qs.map((item, i) => (
            <button key={item.i} onClick={() => jump(i)} aria-label={`Question ${i + 1}`}
              className={"tick mono" + (ans[item.i] ? " done" : "") + (flags.includes(item.i) ? " flag" : "") + (i === at ? " at" : "")}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <Q q={q} chosen={ans[q.i] || []} revealed={false} onChoose={(n) => setAns((a) => ({ ...a, [q.i]: n }))} />

      <button className={"linkbtn" + (flags.includes(q.i) ? " on" : "")}
        onClick={() => setFlags((f) => (f.includes(q.i) ? f.filter((x) => x !== q.i) : [...f, q.i]))}>
        {flags.includes(q.i) ? "★ " + t("flagged") : "☆ " + t("flag")}
      </button>

      <div className="btnrow">
        <button className="btn btn-g" disabled={at === 0} onClick={() => jump(at - 1)}>{t("back")}</button>
        {at < EXAM_LEN - 1
          ? <button className="btn btn-p" onClick={() => jump(at + 1)}>{t("next")}</button>
          : <button className="btn btn-d" onClick={() => setConfirm(true)}>{t("finish")}</button>}
      </div>
      <button className="linkbtn" onClick={onQuit} style={{ marginTop: 16 }}>{t("leave")}</button>
    </div>
  );
}

/* ============================================================
   RESULTS
   ============================================================ */

function Results({ result, onHome, onAgain, onStudy }) {
  const [mode, setMode] = useState("score");
  const { qs, ans, score, seconds } = result;
  const passed = score >= PASS_MARK;

  const rows = CHAPTERS.map((ch) => {
    const inCh = qs.filter((q) => q.c === ch.n);
    return { ch, total: inCh.length, right: inCh.filter((q) => sameSet(ans[q.i], q.a)).length };
  }).filter((r) => r.total > 0);

  const weakest = [...rows].sort((a, b) => a.right / a.total - b.right / b.total)[0];

  if (mode !== "score") {
    const list = mode === "wrong" ? qs.filter((q) => !sameSet(ans[q.i], q.a)) : qs;
    return (
      <div className="page">
        <div className="h2">{mode === "wrong" ? t("whatWrong") : t("everyQ")}</div>
        <div className="chips" style={{ marginBottom: 16 }}>
          <button className={"chip" + (mode === "wrong" ? " on" : "")} onClick={() => setMode("wrong")}>
            {t("wrongOnly")} ({24 - score})
          </button>
          <button className={"chip" + (mode === "all" ? " on" : "")} onClick={() => setMode("all")}>{t("allQs")}</button>
        </div>
        {list.length === 0
          ? <p className="empty">Nothing wrong. Full marks.</p>
          : list.map((q) => (
              <div key={q.i} style={{ marginBottom: 14 }}>
                <Q q={q} chosen={ans[q.i] || []} revealed onChoose={() => {}} />
              </div>
            ))}
        <div className="btnrow">
          <button className="btn btn-g" onClick={() => setMode("score")}>{t("backToScore")}</button>
          <button className="btn btn-p" onClick={onAgain}>{t("newMock")}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className={"hero " + (passed ? "win" : "lose")}>
        <h1>{passed ? t("passTitle") : t("failTitle")}</h1>
        <p>{passed ? t("passBody") : t("failBody")}</p>
        <div className="hero-stats mono">
          <div className="hs"><b>{score}/24</b><span>{t("score")}</span></div>
          <div className="hs"><b>{Math.round((score / 24) * 100)}%</b><span>{t("correctPct")}</span></div>
          <div className="hs"><b>{fmt(seconds)}</b><span>{t("time")}</span></div>
        </div>
      </div>

      <div className="eyebrow">{t("byChapter")}</div>
      {rows.map((r) => (
        <div className="brk" key={r.ch.n}>
          <span className="dot" style={{ background: CH_COLOR[r.ch.n] }} />
          <span className="brk-n">{t("ch" + r.ch.n)}</span>
          <span className="brk-b"><i style={{ width: `${(r.right / r.total) * 100}%`, background: CH_COLOR[r.ch.n] }} /></span>
          <span className="brk-s mono">{r.right}/{r.total}</span>
        </div>
      ))}

      <div className="btnrow">
        <button className="btn btn-p" onClick={() => setMode("wrong")}>{t("reviewWrong")}</button>
        <button className="btn btn-d" onClick={onAgain}>{t("again")}</button>
      </div>
      <div className="btnrow" style={{ marginTop: 10 }}>
        <button className="btn btn-g" onClick={() => onStudy(weakest.ch.n)}>{t("studyNotes")}</button>
        <button className="btn btn-g" onClick={onHome}>{t("home")}</button>
      </div>
    </div>
  );
}

/* ============================================================
   PRACTICE (chapter / quick / mistakes / bookmarks)
   ============================================================ */

function Practice({ mode, chapter, ids, back, record, bookmarks, toggleBookmark, stats = {} }) {
  const [ch, setCh] = useState(chapter || null);
  const [deck, setDeck] = useState(null);
  const [at, setAt] = useState(0);
  const [chosen, setChosen] = useState([]);
  const [shown, setShown] = useState(false);
  const [tally, setTally] = useState({ r: 0, n: 0 });

  const adaptiveNote = mode === "quick" ? getAdaptiveQuizBlueprint(QUESTIONS, stats).at(-1)?.message : null;

  useEffect(() => {
    if (mode === "quick") {
      const smartDeck = getSmartQuizQuestions(QUESTIONS, stats).slice(0, 10).map(randomise);
      setDeck(smartDeck);
    } else if (mode === "mistakes") setDeck(shuffle(QUESTIONS.filter((q) => ids.includes(q.i))).map(randomise));
    else if (mode === "saved") setDeck(shuffle(QUESTIONS.filter((q) => ids.includes(q.i))).map(randomise));
    else if (ch) setDeck(shuffle(QUESTIONS.filter((q) => q.c === ch)).map(randomise));
  }, [ch, mode, stats]);

  if (mode === "chapter" && !ch) {
    return (
      <div className="page">
        <div className="h2">{t("chapterPractice")}</div>
        <p className="lede">{t("chapterSub")}</p>
        <div style={{ display: "grid", gap: 10 }}>
          {CHAPTERS.map((c) => (
            <button key={c.n} className="row" onClick={() => setCh(c.n)}>
              <span className="ic" style={{ background: CH_COLOR[c.n] + "22", color: CH_COLOR[c.n], fontWeight: 800 }}>{c.n}</span>
              <span>
                <span className="row-t">{t("ch" + c.n)}</span>
                <span className="row-s">{QUESTIONS.filter((q) => q.c === c.n).length} {t("questions")}</span>
              </span>
              <span className="row-go">›</span>
            </button>
          ))}
        </div>
        <div className="btnrow"><button className="btn btn-g" onClick={back}>{t("back")}</button></div>
      </div>
    );
  }

  if (!deck) return <div className="page"><p className="empty">{t("loading")}</p></div>;
  if (deck.length === 0) return (
    <div className="page">
      <p className="empty">{t("nothingHere")}</p>
      <div className="btnrow"><button className="btn btn-g" onClick={back}>{t("back")}</button></div>
    </div>
  );

  if (at >= deck.length) {
    const pct = Math.round((tally.r / tally.n) * 100);
    return (
      <div className="page">
        <div className={"hero " + (pct >= 75 ? "win" : "")}>
          <h1>{t("outOf", { a: tally.r, b: tally.n })}</h1>
          <p>{pct >= 75 ? t("passBody") : t("vMid")}</p>
        </div>
        <div className="btnrow">
          <button className="btn btn-g" onClick={back}>{t("done")}</button>
          <button className="btn btn-p" onClick={() => { setAt(0); setTally({ r: 0, n: 0 }); setChosen([]); setShown(false); }}>
            {t("goAgain")}
          </button>
        </div>
      </div>
    );
  }

  const q = deck[at];
  const right = sameSet(chosen, q.a);

  return (
    <div className="page">
      {mode === "quick" && adaptiveNote && (
        <div className="note" style={{ marginTop: 6, marginBottom: 16 }}>{adaptiveNote}</div>
      )}
      <div className="examtop" style={{ marginBottom: 12 }}>
        <span className="count mono">{at + 1} {t("ofWord")} {deck.length}</span>
        <span className="clock mono">{tally.n ? `${tally.r}/${tally.n}` : "—"}</span>
      </div>
      <div className="bar" style={{ marginBottom: 16 }}><i style={{ width: `${(at / deck.length) * 100}%` }} /></div>

      <Q q={q} chosen={chosen} revealed={shown} onChoose={setChosen}
        bookmarked={bookmarks.includes(q.i)} onBookmark={() => toggleBookmark(q.i)} />

      <div className="btnrow">
        {!shown ? (
          <button className="btn btn-p" disabled={chosen.length !== q.a.length}
            onClick={() => { setShown(true); setTally((t) => ({ r: t.r + (right ? 1 : 0), n: t.n + 1 })); record(q.i, right); }}>
            {t("checkAnswer")}
          </button>
        ) : (
          <button className="btn btn-d" onClick={() => { setAt(at + 1); setChosen([]); setShown(false); }}>
            {at === deck.length - 1 ? t("seeResult") : t("next")}
          </button>
        )}
      </div>
      <button className="linkbtn" onClick={back} style={{ marginTop: 12 }}>{t("stop")}</button>
    </div>
  );
}

/* ============================================================
   STUDY
   ============================================================ */

function highlight(text, term) {
  if (!term) return text;
  const i = text.toLowerCase().indexOf(term.toLowerCase());
  if (i === -1) return text;
  return (<>{text.slice(0, i)}<mark>{text.slice(i, i + term.length)}</mark>{text.slice(i + term.length)}</>);
}

function Study({ openChapter, setOpenChapter, back, practise, read, markRead }) {
  const [term, setTerm] = useState("");

  if (term.trim().length > 1) {
    const t = term.trim().toLowerCase();
    const hits = [];
    NOTES.forEach((n) => n.sections.forEach((s) => s.p.forEach((line) => {
      if (line.toLowerCase().includes(t)) hits.push({ c: n.c, h: s.h, line });
    })));
    return (
      <div className="page">
        <div className="h2">{t("studyNotes")}</div>
        <input className="search" value={term} onChange={(e) => setTerm(e.target.value)} placeholder={t("searchPh")} />
        <p className="lede">{t("results", { n: hits.length })}</p>
        {hits.slice(0, 60).map((h, i) => (
          <div className="sec" key={i}>
            <div className="secb" style={{ padding: 14 }}>
              <span className="qtag" style={{ background: CH_COLOR[h.c] + "22", color: CH_COLOR[h.c] }}>{t("ch" + h.c)}</span>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, margin: "9px 0 0" }}>{highlight(h.line, term.trim())}</p>
            </div>
          </div>
        ))}
        {hits.length === 0 && <p className="empty">{t("noMatch")}</p>}
      </div>
    );
  }

  if (!openChapter) {
    return (
      <div className="page">
        <div className="h2">{t("studyNotes")}</div>
        <p className="lede">{t("studySub")}</p>
        <input className="search" value={term} onChange={(e) => setTerm(e.target.value)} placeholder={t("searchPh")} />
        <div style={{ display: "grid", gap: 10 }}>
          {CHAPTERS.map((c) => (
            <button key={c.n} className="row" onClick={() => setOpenChapter(c.n)}>
              <span className="ic" style={{ background: CH_COLOR[c.n] + "22", color: CH_COLOR[c.n], fontWeight: 800 }}>{c.n}</span>
              <span>
                <span className="row-t">{c.name}</span>
                <span className="row-s">{read.includes(c.n) ? t("isRead") + " · " : ""}{QUESTIONS.filter((q) => q.c === c.n).length} {t("questions")}</span>
              </span>
              <span className="row-go">{read.includes(c.n) ? "✓" : "›"}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const note = NOTES.find((n) => n.c === openChapter);
  return <Chapter note={note} back={() => setOpenChapter(null)} practise={() => practise(openChapter)}
    isRead={read.includes(openChapter)} markRead={() => markRead(openChapter)} />;
}

function Chapter({ note, back, practise, isRead, markRead }) {
  const [open, setOpen] = useState([0]);
  const ch = CHAPTERS[note.c - 1];
  const toggle = (i) => setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]));
  return (
    <div className="page">
      <button className="linkbtn" onClick={back} style={{ marginTop: 0 }}>‹ {t("allChapters")}</button>
      <div style={{ display: "flex", gap: 12, alignItems: "center", margin: "6px 0 8px" }}>
        <span className="ic" style={{ background: CH_COLOR[note.c] + "22", color: CH_COLOR[note.c], fontWeight: 800 }}>{note.c}</span>
        <span className="h2" style={{ margin: 0 }}>{ch.name}</span>
      </div>
      <p className="lede">{note.intro}</p>
      {note.sections.map((s, i) => (
        <div className="sec" key={i}>
          <button className="sech" onClick={() => toggle(i)}>
            {s.h}<span className={"chev" + (open.includes(i) ? " open" : "")}>›</span>
          </button>
          {open.includes(i) && <div className="secb"><ul>{s.p.map((l, j) => <li key={j}>{l}</li>)}</ul></div>}
        </div>
      ))}
      <div className="btnrow">
        <button className="btn btn-g" onClick={markRead}>{isRead ? "✓ " + t("isRead") : t("markRead")}</button>
        <button className="btn btn-p" onClick={practise}>{t("testChapter")}</button>
      </div>
    </div>
  );
}

/* ============================================================
   FLASHCARDS
   ============================================================ */

function Cards({ back }) {
  const [filter, setFilter] = useState(0);
  const [deck, setDeck] = useState(() => shuffle(FLASHCARDS));
  const [at, setAt] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const pool = filter ? deck.filter((c) => c.c === filter) : deck;
  const card = pool[at % Math.max(pool.length, 1)];

  const setF = (n) => { setFilter(n); setAt(0); setFlipped(false); };

  return (
    <div className="page">
      <div className="h2">{t("flashcards")}</div>
      <p className="lede">{t("tapReveal")}</p>
      <div className="chips">
        <button className={"chip" + (filter === 0 ? " on" : "")} onClick={() => setF(0)}>{t("all")}</button>
        {CHAPTERS.map((c) => (
          <button key={c.n} className={"chip" + (filter === c.n ? " on" : "")} onClick={() => setF(c.n)}>{t("ch" + c.n)}</button>
        ))}
      </div>
      {!card ? <p className="empty">{t("nothingHere")}</p> : (
        <>
          <div style={{ margin: "16px 0 10px", fontSize: 13, color: "var(--ink3)", fontWeight: 700 }} className="mono">
            {(at % pool.length) + 1} {t("ofWord")} {pool.length}
          </div>
          <div className="flash" onClick={() => setFlipped((f) => !f)}>
            {flipped
              ? <div className="flash-b">{card.b}</div>
              : <div className="flash-f">{card.f}</div>}
            <div className="flash-hint">{flipped ? t("tapBack") : t("tapReveal")}</div>
          </div>
          <div className="btnrow">
            <button className="btn btn-g" onClick={() => { setAt((a) => (a - 1 + pool.length) % pool.length); setFlipped(false); }}>{t("previous")}</button>
            <button className="btn btn-p" onClick={() => { setAt((a) => (a + 1) % pool.length); setFlipped(false); }}>{t("next")}</button>
          </div>
          <div className="btnrow" style={{ marginTop: 10 }}>
            <button className="btn btn-g" onClick={() => { setDeck(shuffle(FLASHCARDS)); setAt(0); setFlipped(false); }}>{t("shuffle")}</button>
          </div>
        </>
      )}
    </div>
  );
}

/* ============================================================
   PROGRESS
   ============================================================ */

function Progress({ history, stats, bookmarks, go, clear }) {
  const cs = chapterStats(stats);
  const ready = readiness(stats);
  const passes = history.filter((h) => h.score >= PASS_MARK).length;
  const best = history.reduce((m, h) => Math.max(m, h.score), 0);
  const avg = history.length ? (history.reduce((s, h) => s + h.score, 0) / history.length).toFixed(1) : "—";
  const mis = mistakeIds(stats);
  const recent = [...history].slice(0, 12).reverse();

  return (
    <div className="page">
      <div className="h2">{t("progress")}</div>
      <p className="lede">{t("readiness")}</p>

      <div className="ring-wrap" style={{ marginTop: 0 }}>
        <Ring value={ready} />
        <div className="ring-txt">
          <b>{t("seen", { a: Object.keys(stats).length, b: QUESTIONS.length })}</b>
          <span>{t("fixMistakes")}: {mis.length}{bookmarks.length ? ` · ${bookmarks.length} ${t("saved")}` : ""}</span>
        </div>
      </div>

      {history.length > 0 && (
        <>
          <div className="eyebrow">{t("mockScores")}</div>
          <div className="spark">
            {recent.map((h, i) => (
              <i key={i} className={h.score >= PASS_MARK ? "" : "f"} style={{ height: `${(h.score / 24) * 100}%` }} />
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <div className="tile" style={{ flex: 1, cursor: "default" }}><b className="mono">{best}</b><span>{t("best")}</span></div>
            <div className="tile" style={{ flex: 1, cursor: "default" }}><b className="mono">{avg}</b><span>{t("average")}</span></div>
            <div className="tile" style={{ flex: 1, cursor: "default" }}><b className="mono">{passes}/{history.length}</b><span>{t("passedN")}</span></div>
          </div>
        </>
      )}

      <div className="eyebrow">{t("byChapter")}</div>
      {cs.map((c) => (
        <div className="brk" key={c.ch.n}>
          <span className="dot" style={{ background: CH_COLOR[c.ch.n] }} />
          <span className="brk-n">{t("ch" + c.ch.n)}
            <span style={{ display: "block", fontSize: 12, color: "var(--ink3)", fontWeight: 500 }}>
              {c.attempted} {t("ofWord")} {c.pool}
            </span>
          </span>
          <span className="brk-b"><i style={{ width: `${c.accuracy * 100}%`, background: CH_COLOR[c.ch.n] }} /></span>
          <span className="brk-s mono">{c.attempted ? Math.round(c.accuracy * 100) + "%" : "—"}</span>
        </div>
      ))}

      {bookmarks.length > 0 && (
        <div className="btnrow">
          <button className="btn btn-g" onClick={() => go("saved")}>{bookmarks.length} {t("saved")}</button>
        </div>
      )}

      {history.length > 0 && (
        <>
          <div className="eyebrow">{t("history")}</div>
          {history.slice(0, 20).map((h, i) => (
            <div className="hist" key={i}>
              <span className="mono" style={{ fontWeight: 800, fontSize: 15, minWidth: 46 }}>{h.score}/24</span>
              <span style={{ flex: 1, fontSize: 13, color: "var(--ink2)" }}>{h.date} · {fmt(h.seconds || 0)}</span>
              <span className={"badge " + (h.score >= PASS_MARK ? "p" : "f")}>{h.score >= PASS_MARK ? t("pass") : t("fail")}</span>
            </div>
          ))}
        </>
      )}

      {history.length === 0 && <p className="empty">{t("noMocks")}</p>}

      <div className="btnrow"><button className="btn btn-g" onClick={clear}>{t("reset")}</button></div>
    </div>
  );
}

/* ============================================================
   TEST DAY
   ============================================================ */

function TestDay() {
  const [open, setOpen] = useState([0]);
  const toggle = (i) => setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]));
  return (
    <div className="page">
      <div className="h2">Booking and test day</div>
      <p className="lede">What the test costs, how to book it, and what to have with you on the day.</p>
      {TESTDAY.map((s, i) => (
        <div className="sec" key={i}>
          <button className="sech" onClick={() => toggle(i)}>
            {s.h}<span className={"chev" + (open.includes(i) ? " open" : "")}>›</span>
          </button>
          {open.includes(i) && <div className="secb"><ul>{s.p.map((l, j) => <li key={j}>{l}</li>)}</ul></div>}
        </div>
      ))}
      <div className="note">
        Rules and fees do change. Check <b style={{ fontWeight: 700 }}>gov.uk/life-in-the-uk-test</b> before you book — it is the only official booking site, and anything charging more than the standard fee is not it.
      </div>
    </div>
  );
}

/* ============================================================
   SETTINGS
   ============================================================ */

function Settings({ profile, setProfile, dark, setDark, lang, setLang, subs, setSubs }) {
  const [name, setName] = useState(profile.name || "");
  const [date, setDate] = useState(profile.testDate || "");
  const days = daysUntil(date);
  return (
    <div className="page">
      <div className="h2">{t("settings")}</div>
      <p className="lede">{t("localOnly")}</p>
      <div className="eyebrow">{t("language")}</div>
      <LangPicker value={lang} onPick={setLang} />
      <div className="eyebrow">{t("yourName")}</div>
      <div className="field">
        <label htmlFor="s-name">{t("yourName")}</label>
        <input id="s-name" value={name} onChange={(e) => setName(e.target.value)} onBlur={() => setProfile({ ...profile, name: name.trim() })} placeholder={t("optional")} />
      </div>
      <div className="field">
        <label htmlFor="s-date">{t("testDateLabel")}</label>
        <input id="s-date" type="date" value={date} onChange={(e) => { setDate(e.target.value); setProfile({ ...profile, testDate: e.target.value }); }} />
        {days !== null && days >= 0 && (
          <p style={{ fontSize: 13, color: "var(--ink2)", margin: "8px 0 0" }}>
            {days === 0 ? t("testToday") : days === 1 ? t("dayLeft") : t("daysLeft", { n: days })}
          </p>
        )}
      </div>
      {lang !== "en" && SUBS_AVAILABLE && (
        <button className="toggle" onClick={() => setSubs(!subs)} style={{ marginBottom: 10 }}>
          <span className="ic">文</span>
          <span>
            <span className="row-t">{t("language")}</span>
            <span className="row-s">{t("langNote")}</span>
          </span>
          <span className={"sw" + (subs ? " on" : "")}><i /></span>
        </button>
      )}
      <button className="toggle" onClick={() => setDark(!dark)}>
        <span className="ic">{dark ? "☾" : "☀"}</span>
        <span>
          <span className="row-t">{t("darkMode")}</span>
          <span className="row-s">{t("darkSub")}</span>
        </span>
        <span className={"sw" + (dark ? " on" : "")}><i /></span>
      </button>
      <p className="foot">
        Question bank: {QUESTIONS.length} questions and {FLASHCARDS.length} flashcards written from
        Life in the United Kingdom: A Guide for New Residents (3rd edition), the official Home Office handbook.
        This app is a study aid and is not affiliated with the Home Office.
      </p>
    </div>
  );
}

/* ============================================================
   APP
   ============================================================ */

export default function App() {
  const [ready, setReady] = useState(false);
  const [view, setView] = useState("home");
  const [tab, setTab] = useState("home");
  const [profile, setProfileState] = useState({ name: "", testDate: "" });
  const [onboarded, setOnboarded] = useState(true);
  const [dark, setDarkState] = useState(false);
  const [lang, setLangState] = useState("en");
  const [subs, setSubsState] = useState(true);
  const [stats, setStats] = useState({});
  const [history, setHistory] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [read, setRead] = useState([]);
  const [streak, setStreak] = useState(0);
  const [result, setResult] = useState(null);
  const [openChapter, setOpenChapter] = useState(null);
  const [practiceChapter, setPracticeChapter] = useState(null);

  useEffect(() => {
    (async () => {
      const saved = await load("uk2:all", null);
      if (saved) {
        setProfileState(saved.profile || { name: "", testDate: "" });
        setStats(saved.stats || {});
        setHistory(saved.history || []);
        setBookmarks(saved.bookmarks || []);
        setRead(saved.read || []);
        setDarkState(!!saved.dark);
        setLangState(saved.lang || "en");
        setSubsState(SUBS_AVAILABLE && saved.subs !== false);
        setOnboarded(!!saved.onboarded);
        const s = saved.streak || { last: null, n: 0 };
        const t = today();
        const yest = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        let n = s.n;
        if (s.last === t) n = s.n;
        else if (s.last === yest) n = s.n + 1;
        else n = 1;
        setStreak(n);
        persist({ ...saved, streak: { last: t, n } });
      } else {
        setOnboarded(false);
        setStreak(1);
      }
      setReady(true);
    })();
  }, []);

  const persist = (partial) => {
    const snapshot = {
      profile, stats, history, bookmarks, read, dark, lang, subs, onboarded,
      streak: { last: today(), n: streak },
      ...partial,
    };
    save("uk2:all", snapshot);
  };

  const setProfile = (p) => { setProfileState(p); persist({ profile: p }); };
  const setDark = (d) => { setDarkState(d); persist({ dark: d }); };
  const setLang = (l) => { setLangState(l); persist({ lang: l }); };
  const setSubs = (v) => { setSubsState(v); persist({ subs: v }); };

  const record = (qid, correct) => {
    setStats((prev) => {
      const cur = prev[qid] || { r: 0, w: 0, s: 0 };
      const next = {
        ...prev,
        [qid]: correct
          ? { r: cur.r + 1, w: cur.w, s: cur.s + 1 }
          : { r: cur.r, w: cur.w + 1, s: 0 },
      };
      persist({ stats: next });
      return next;
    });
  };

  const toggleBookmark = (qid) => {
    setBookmarks((prev) => {
      const next = prev.includes(qid) ? prev.filter((x) => x !== qid) : [...prev, qid];
      persist({ bookmarks: next });
      return next;
    });
  };

  const markRead = (n) => {
    setRead((prev) => {
      const next = prev.includes(n) ? prev : [...prev, n];
      persist({ read: next });
      return next;
    });
  };

  const go = (v) => {
    if (v === "practice") setPracticeChapter(null);
    if (v === "study") setOpenChapter(null);
    setView(v);
    if (["home", "study", "progress", "settings"].includes(v)) setTab(v);
    window.scrollTo(0, 0);
  };

  const finishExam = (qs, ans, seconds) => {
    const score = qs.filter((q) => sameSet(ans[q.i], q.a)).length;
    const nextStats = { ...stats };
    qs.forEach((q) => {
      const cur = nextStats[q.i] || { r: 0, w: 0, s: 0 };
      const ok = sameSet(ans[q.i], q.a);
      nextStats[q.i] = ok ? { r: cur.r + 1, w: cur.w, s: cur.s + 1 } : { r: cur.r, w: cur.w + 1, s: 0 };
    });
    const entry = {
      date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      score, seconds,
    };
    const nextHist = [entry, ...history].slice(0, 40);
    setStats(nextStats);
    setHistory(nextHist);
    persist({ stats: nextStats, history: nextHist });
    setResult({ qs, ans, score, seconds });
    setView("results");
    window.scrollTo(0, 0);
  };

  const clear = () => {
    setStats({}); setHistory([]); setBookmarks([]); setRead([]);
    persist({ stats: {}, history: [], bookmarks: [], read: [] });
    go("home");
  };

  LANG = lang;
  SUBS = subs;
  const rtl = (LANGS.find((l) => l.id === lang) || {}).rtl ? "rtl" : "ltr";

  if (!ready) return <div className="uk" dir={rtl} data-dark={dark ? "1" : "0"}><style>{CSS}</style><div className="page"><p className="empty">{t("loading")}</p></div></div>;

  if (!onboarded) {
    return (
      <div className="uk" dir={rtl} data-dark={dark ? "1" : "0"}>
        <style>{CSS}</style>
        <Onboarding lang={lang} setLang={setLangState} onDone={(p) => {
          setProfileState(p); setOnboarded(true);
          save("uk2:all", { profile: p, stats: {}, history: [], bookmarks: [], read: [], dark, lang, onboarded: true, streak: { last: today(), n: 1 } });
        }} />
      </div>
    );
  }

  const inExam = view === "exam";
  const mis = mistakeIds(stats);

  return (
    <div className="uk" dir={rtl} data-dark={dark ? "1" : "0"}>
      <style>{CSS}</style>

      {!inExam && (
        <div className="top">
          <span className="logo">UK</span>
          <span className="wordmark">Life in the UK</span>
          <button className="iconbtn" aria-label="Toggle dark mode" onClick={() => setDark(!dark)}>{dark ? "☀" : "☾"}</button>
          <button className="iconbtn" aria-label="Settings" onClick={() => go("settings")}>⚙</button>
        </div>
      )}

      {view === "home" && <Home profile={profile} stats={stats} history={history} go={go} streak={streak} />}

      {view === "exam" && <Exam onFinish={finishExam} onQuit={() => go("home")} />}

      {view === "results" && result && (
        <Results result={result} onHome={() => go("home")}
          onAgain={() => { setResult(null); go("exam"); }}
          onStudy={(n) => { setOpenChapter(n); setView("study"); setTab("study"); window.scrollTo(0, 0); }} />
      )}

      {view === "quick" && (
        <Practice key="quick" mode="quick" back={() => go("home")} record={record}
          bookmarks={bookmarks} toggleBookmark={toggleBookmark} stats={stats} />
      )}

      {view === "practice" && (
        <Practice key={"ch" + practiceChapter} mode="chapter" chapter={practiceChapter} back={() => go(practiceChapter ? "study" : "home")}
          record={record} bookmarks={bookmarks} toggleBookmark={toggleBookmark} stats={stats} />
      )}

      {view === "mistakes" && (
        <Practice key="mis" mode="mistakes" ids={mis} back={() => go("home")} record={record}
          bookmarks={bookmarks} toggleBookmark={toggleBookmark} stats={stats} />
      )}

      {view === "saved" && (
        <Practice key="saved" mode="saved" ids={bookmarks} back={() => go("progress")} record={record}
          bookmarks={bookmarks} toggleBookmark={toggleBookmark} stats={stats} />
      )}

      {view === "cards" && <Cards back={() => go("home")} />}

      {view === "study" && (
        <Study openChapter={openChapter} setOpenChapter={setOpenChapter} back={() => go("home")}
          read={read} markRead={markRead}
          practise={(n) => { setPracticeChapter(n); setView("practice"); window.scrollTo(0, 0); }} />
      )}

      {view === "testday" && <TestDay />}

      {view === "progress" && (
        <Progress history={history} stats={stats} bookmarks={bookmarks} go={go} clear={clear} />
      )}

      {view === "settings" && <Settings profile={profile} setProfile={setProfile} dark={dark} setDark={setDark} lang={lang} setLang={setLang} subs={subs} setSubs={setSubs} />}

      {!inExam && (
        <div className="nav">
          {[
            { k: "home", i: "⌂", l: t("home") },
            { k: "study", i: "☰", l: t("studyNotes") },
            { k: "progress", i: "◔", l: t("progress") },
            { k: "settings", i: "⚙", l: t("settings") },
          ].map((n) => (
            <button key={n.k} className={"navi" + (tab === n.k ? " on" : "")} onClick={() => go(n.k)}>
              <em>{n.i}</em><span>{n.l}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
