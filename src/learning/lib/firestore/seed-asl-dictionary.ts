import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "./config";

const VIDEO_ID = "0FcwzMq4iWg";

const aslItems = [
  // FIRST 25 SIGNS
  { term:"Hello",           category:"Greetings",  startSec:79,  endSec:84,  tags:["greeting"] },
  { term:"See you later",   category:"Greetings",  startSec:85,  endSec:96,  tags:["farewell"] },
  { term:"I / Me",          category:"Pronouns",   startSec:97,  endSec:105 },
  { term:"Father",          category:"Family",     startSec:106, endSec:115 },
  { term:"Mother",          category:"Family",     startSec:116, endSec:122 },
  { term:"Yes",             category:"Basics",     startSec:123, endSec:130 },
  { term:"No",              category:"Basics",     startSec:131, endSec:139 },
  { term:"Help",            category:"Actions",    startSec:140, endSec:153 },
  { term:"Please",          category:"Politeness", startSec:154, endSec:161 },
  { term:"Thank You",       category:"Politeness", startSec:162, endSec:168 },
  { term:"Want",            category:"Actions",    startSec:169, endSec:177 },
  { term:"What?",           category:"Questions",  startSec:178, endSec:187 },
  { term:"Dog",             category:"Animals",    startSec:188, endSec:194 },
  { term:"Cat",             category:"Animals",    startSec:195, endSec:201 },
  { term:"Again / Repeat",  category:"Actions",    startSec:202, endSec:209 },
  { term:"Eat / Food",      category:"Food",       startSec:210, endSec:223 },
  { term:"Milk",            category:"Food",       startSec:224, endSec:230 },
  { term:"More",            category:"Quantifiers",startSec:231, endSec:238 },
  { term:"Go To",           category:"Actions",    startSec:239, endSec:248 },
  { term:"Bathroom",        category:"Places",     startSec:249, endSec:258 },
  { term:"Fine",            category:"Feelings",   startSec:259, endSec:266 },
  { term:"Like",            category:"Feelings",   startSec:267, endSec:276 },
  { term:"Learn",           category:"Actions",    startSec:277, endSec:284 },
  { term:"Sign",            category:"Actions",    startSec:285, endSec:293 },
  { term:"Finish / Done",   category:"Actions",    startSec:294, endSec:304 },

  // SENTENCES
  { term:"Hello! My name is Meredith.", category:"Sentences", startSec:305, endSec:334 },
  { term:"I'm fine.",                   category:"Sentences", startSec:335, endSec:344 },
  { term:"How are you?",                category:"Sentences", startSec:345, endSec:354 },
  { term:"Nice to meet you.",           category:"Sentences", startSec:355, endSec:365 },
  { term:"All done!",                   category:"Sentences", startSec:366 } // last one no end
].map(i => ({
  term: i.term,
  lang: "ASL",
  category: i.category,
  description: `ASL sign for "${i.term}"`,
  video: { provider: "youtube", videoId: VIDEO_ID, startSec: i.startSec, ...(i.endSec ? { endSec: i.endSec } : {}) },
  tags: i.tags || [],
  createdAt: serverTimestamp()
}));

export async function seedAslDictionary() {
  const col = collection(db, "dictionary");
  
  console.log(`Seeding ${aslItems.length} ASL dictionary items...`);
  
  for (const item of aslItems) {
    const idSafe = `asl_${item.term.toLowerCase().replace(/[^a-z0-9]+/g,'_')}`;
    await setDoc(doc(col, idSafe), item, { merge: true });
    console.log(`Added: ${item.term}`);
  }
  
  console.log("ASL dictionary seeding completed!");
  return { success: true, count: aslItems.length };
}
