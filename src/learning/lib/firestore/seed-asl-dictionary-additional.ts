import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "./config";

const VIDEO_ID = "4Ll3OtqAzyw";

const additionalAslItems = [
  // Common Signs
  { term: "Teaching - Common Signs", category: "Teaching", startSec: 75, endSec: 85, tags: ["teaching", "introduction"] },
  
  // Descriptive Signs
  { term: "Don't Want", category: "Common Signs", startSec: 86, endSec: 95, tags: ["negative", "desire"] },
  { term: "Finish or Done", category: "Common Signs", startSec: 95, endSec: 103, tags: ["completion"] },
  { term: "Forget", category: "Common Signs", startSec: 103, endSec: 110, tags: ["memory"] },
  { term: "Go", category: "Common Signs", startSec: 110, endSec: 119, tags: ["movement", "action"] },
  { term: "Hello", category: "Common Signs", startSec: 119, endSec: 128, tags: ["greeting"] },
  { term: "Help", category: "Common Signs", startSec: 128, endSec: 141, tags: ["assistance"] },
  { term: "How are you?", category: "Common Signs", startSec: 141, endSec: 156, tags: ["question", "greeting"] },
  { term: "Like", category: "Common Signs", startSec: 156, endSec: 166, tags: ["preference"] },
  { term: "More", category: "Common Signs", startSec: 166, endSec: 174, tags: ["quantity"] },
  { term: "Need", category: "Common Signs", startSec: 174, endSec: 181, tags: ["requirement"] },
  { term: "Nice to meet you", category: "Common Signs", startSec: 181, endSec: 195, tags: ["greeting", "introduction"] },
  { term: "No", category: "Common Signs", startSec: 195, endSec: 204, tags: ["negative"] },
  { term: "Not, Don't or Doesn't", category: "Common Signs", startSec: 204, endSec: 215, tags: ["negative"] },
  { term: "Please", category: "Common Signs", startSec: 215, endSec: 223, tags: ["politeness"] },
  { term: "Right or Correct", category: "Common Signs", startSec: 223, endSec: 230, tags: ["affirmation"] },
  { term: "Thank you", category: "Common Signs", startSec: 230, endSec: 237, tags: ["gratitude"] },
  { term: "Want", category: "Common Signs", startSec: 237, endSec: 247, tags: ["desire"] },
  { term: "Wrong", category: "Common Signs", startSec: 247, endSec: 255, tags: ["error", "incorrect"] },
  { term: "Yes", category: "Common Signs", startSec: 255, endSec: 269, tags: ["affirmation"] },
  
  // Descriptive Signs
  { term: "Teaching - Descriptions", category: "Teaching", startSec: 269, endSec: 290, tags: ["teaching", "descriptions"] },
  { term: "Scared", category: "Descriptive Signs", startSec: 290, endSec: 305, tags: ["emotion", "fear"] },
  { term: "Terrified", category: "Descriptive Signs", startSec: 305, endSec: 314, tags: ["emotion", "fear", "intense"] },
  { term: "Bad", category: "Descriptive Signs", startSec: 314, endSec: 323, tags: ["negative", "quality"] },
  { term: "Busy", category: "Descriptive Signs", startSec: 323, endSec: 335, tags: ["state", "activity"] },
  { term: "Fine", category: "Descriptive Signs", startSec: 335, endSec: 343, tags: ["state", "okay"] },
  { term: "Good or Well", category: "Descriptive Signs", startSec: 343, endSec: 353, tags: ["positive", "quality"] },
  { term: "Happy", category: "Descriptive Signs", startSec: 353, endSec: 362, tags: ["emotion", "positive"] },
  { term: "Sad", category: "Descriptive Signs", startSec: 362, endSec: 372, tags: ["emotion", "negative"] },
  { term: "Same", category: "Descriptive Signs", startSec: 372, endSec: 383, tags: ["comparison"] },
  { term: "So-So", category: "Descriptive Signs", startSec: 383, endSec: 391, tags: ["state", "neutral"] },
  
  // Basic ASL Phrases
  { term: "Teaching - Basic Phrases", category: "Teaching", startSec: 391, endSec: 398, tags: ["teaching", "phrases"] },
  { term: "ASL Structure vs. English", category: "Teaching", startSec: 398, endSec: 413, tags: ["grammar", "structure"] },
  { term: "How are you? (Phrase)", category: "Phrases", startSec: 413, endSec: 425, tags: ["question", "greeting"] },
  { term: "I'm happy", category: "Phrases", startSec: 425, endSec: 443, tags: ["statement", "emotion"] },
  { term: "Hello, nice to meet you", category: "Phrases", startSec: 443, endSec: 458, tags: ["greeting", "introduction"] },
  { term: "I need help", category: "Phrases", startSec: 458, endSec: 474, tags: ["request", "assistance"] },
  { term: "Yes, same here!", category: "Phrases", startSec: 474, endSec: 488, tags: ["agreement", "response"] },
  { term: "You finished", category: "Phrases", startSec: 488, endSec: 500, tags: ["statement", "completion"] }
].map(i => ({
  term: i.term,
  lang: "ASL",
  category: i.category,
  description: `ASL sign for "${i.term}"`,
  video: { provider: "youtube", videoId: VIDEO_ID, startSec: i.startSec, ...(i.endSec ? { endSec: i.endSec } : {}) },
  tags: i.tags || [],
  createdAt: serverTimestamp()
}));

export async function seedAdditionalAslDictionary() {
  const col = collection(db, "dictionary");
  
  console.log(`Seeding ${additionalAslItems.length} additional ASL dictionary items...`);
  
  for (const item of additionalAslItems) {
    const idSafe = `asl_additional_${item.term.toLowerCase().replace(/[^a-z0-9]+/g,'_')}`;
    await setDoc(doc(col, idSafe), item, { merge: true });
    console.log(`Added: ${item.term}`);
  }
  
  console.log("Additional ASL dictionary seeding completed!");
  return { success: true, count: additionalAslItems.length };
}
