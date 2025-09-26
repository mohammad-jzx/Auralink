import { Lesson } from './daily-lessons';

// Mock data for daily lessons
const mockLessons: Record<string, Lesson[]> = {
  'ASL': [
    {
      id: 'asl_basics_interactive',
      title: 'ASL Basics',
      titleAr: 'أساسيات لغة الإشارة الأمريكية',
      description: 'سلسلة فيديوهات تفاعلية لتعلم أساسيات لغة الإشارة الأمريكية',
      lang: 'ASL',
      level: 'Beginner',
      levelAr: 'مبتدئ',
      playlist_id: 'PL1v-PVQ5VRYu1G9Xvn2pMgIy5CzJoCgSv',
      thumbnail: '/images/asl_basics.jpg',
      category: 'أساسيات'
    },
    {
      id: 'asl_numbers_interactive',
      title: 'ASL Numbers',
      titleAr: 'الأرقام من 1 إلى 10',
      description: 'تعلم الأرقام الأساسية بلغة الإشارة الأمريكية بطريقة تفاعلية',
      lang: 'ASL',
      level: 'Beginner',
      levelAr: 'مبتدئ',
      playlist_id: 'PL1v-PVQ5VRYtDgYxAqhXn_o5XF7Fdd4r5',
      thumbnail: '/images/asl_numbers.jpg',
      category: 'الأرقام'
    }
  ],
  'JSL': [
    {
      id: 'jsl_greetings_interactive',
      title: 'JSL Greetings',
      titleAr: 'التحيات بلغة الإشارة الأردنية',
      description: 'تعلم التحيات الأساسية في لغة الإشارة الأردنية خطوة بخطوة',
      lang: 'JSL',
      level: 'Beginner',
      levelAr: 'مبتدئ',
      playlist_id: 'PL1v-PVQ5VRYvXnGXUdEyfLU8JZ2QEf6NV',
      thumbnail: '/images/jsl_greetings.jpg',
      category: 'التحيات'
    }
  ]
};

/**
 * Mock implementation of getDailyLessons
 */
export async function getDailyLessonsMock(date: Date = new Date(), lang: 'ASL' | 'JSL' = 'ASL'): Promise<Lesson[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return mock data based on language
  return mockLessons[lang] || [];
}

/**
 * Mock implementation of getAvailableDailyLanguages
 */
export async function getAvailableDailyLanguagesMock(): Promise<('ASL' | 'JSL')[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Return both languages as available
  return ['ASL', 'JSL'];
}
