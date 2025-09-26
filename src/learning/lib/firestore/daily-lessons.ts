import { format } from 'date-fns';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './config';

export interface DailyLesson {
  date: string;
  lang: 'ASL' | 'JSL';
  items: {
    lessonId: string;
  }[];
}

export interface Lesson {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  lang: 'ASL' | 'JSL';
  level: string;
  levelAr: string;
  playlist_id: string;
  thumbnail?: string;
  category?: string;
}

/**
 * Get daily lessons for a specific date and language
 */
export async function getDailyLessons(date: Date = new Date(), lang: 'ASL' | 'JSL' = 'ASL'): Promise<Lesson[]> {
  try {
    // Format date as YYYY-MM-DD
    const formattedDate = format(date, 'yyyy-MM-dd');
    const docId = `${formattedDate}_${lang}`;
    
    // Get the daily lessons document
    const dailyLessonsDoc = await getDoc(doc(db, 'dailyLessons', docId));
    
    if (!dailyLessonsDoc.exists()) {
      console.log(`No daily lessons found for ${docId}`);
      return [];
    }
    
    const dailyLessonsData = dailyLessonsDoc.data() as DailyLesson;
    const lessonIds = dailyLessonsData.items.map(item => item.lessonId);
    
    // Get the full lesson details for each lesson ID
    const lessons: Lesson[] = [];
    
    for (const lessonId of lessonIds) {
      const lessonDoc = await getDoc(doc(db, 'lessons', lessonId));
      
      if (lessonDoc.exists()) {
        lessons.push({ 
          id: lessonDoc.id, 
          ...lessonDoc.data() 
        } as Lesson);
      }
    }
    
    return lessons;
  } catch (error) {
    console.error('Error fetching daily lessons:', error);
    return [];
  }
}

/**
 * Get all available languages that have daily lessons for today
 */
export async function getAvailableDailyLanguages(date: Date = new Date()): Promise<('ASL' | 'JSL')[]> {
  try {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const languages: ('ASL' | 'JSL')[] = [];
    
    // Check if ASL lessons exist for today
    const aslDocId = `${formattedDate}_ASL`;
    const aslDoc = await getDoc(doc(db, 'dailyLessons', aslDocId));
    if (aslDoc.exists()) {
      languages.push('ASL');
    }
    
    // Check if JSL lessons exist for today
    const jslDocId = `${formattedDate}_JSL`;
    const jslDoc = await getDoc(doc(db, 'dailyLessons', jslDocId));
    if (jslDoc.exists()) {
      languages.push('JSL');
    }
    
    return languages;
  } catch (error) {
    console.error('Error checking available languages:', error);
    return ['ASL', 'JSL']; // Return both as fallback
  }
}
