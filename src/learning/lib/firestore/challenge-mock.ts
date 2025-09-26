import { DailyChallenge, UserAnswer, UserDailyResult } from '../../types/challenge'

// Mock data for testing with real sign language videos
const mockDailyChallenge: DailyChallenge = {
  date: "2025-08-24",
  level: "beginner",
  questions: [
    {
      id: "q1",
      type: "mcq",
      prompt: "ما معنى هذه الإشارة؟",
      media: {
        type: "video",
        url: "/video/شكرا.mp4"
      },
      options: ["مرحبًا", "من فضلك", "شكرًا", "إلى اللقاء"],
      answerIndex: 2,
      explain: "هذه إشارة 'شكرًا' في لغة الإشارة الأردنية. لاحظ حركة اليد نحو الفم."
    },
    {
      id: "q2",
      type: "mcq",
      prompt: "أي من هذه الإشارات تعني 'أنا'؟",
      media: {
        type: "video",
        url: "/video/انا.mp4"
      },
      options: ["أنا", "أنت", "هو", "هي"],
      answerIndex: 0,
      explain: "الإشارة تعني 'أنا' - ضمير المتكلم المفرد. لاحظ الإشارة نحو الصدر."
    },
    {
      id: "q3",
      type: "mcq",
      prompt: "ما هي الإشارة الصحيحة لـ 'بيت'؟",
      media: {
        type: "video",
        url: "/video/بيت.mp4"
      },
      options: ["مدرسة", "بيت", "مستشفى", "جامع"],
      answerIndex: 1,
      explain: "الإشارة تعني 'بيت' - المنزل أو المسكن. لاحظ حركة اليدين لتشكيل شكل البيت."
    },
    {
      id: "q4",
      type: "mcq",
      prompt: "أي إشارة تعني 'أكل'؟",
      media: {
        type: "video",
        url: "/video/اكل.mp4"
      },
      options: ["شرب", "أكل", "نام", "مشى"],
      answerIndex: 1,
      explain: "الإشارة تعني 'أكل' - تناول الطعام. لاحظ حركة اليد نحو الفم."
    },
    {
      id: "q5",
      type: "mcq",
      prompt: "ما معنى هذه الإشارة؟",
      media: {
        type: "video",
        url: "/video/صديق.mp4"
      },
      options: ["صديق", "عائلة", "أخ", "أخت"],
      answerIndex: 0,
      explain: "هذه الإشارة تعني 'صديق' - الشخص المقرب. لاحظ حركة اليدين المتشابكة."
    }
  ]
}

// Mock storage
const mockStorage = new Map<string, UserDailyResult>()

export class MockChallengeService {
  // Get today's challenge
  static async getTodayChallenge(): Promise<DailyChallenge | null> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockDailyChallenge
  }

  // Get user's daily result
  static async getUserDailyResult(uid: string, date: string): Promise<UserDailyResult | null> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockStorage.get(`${uid}-${date}`) || null
  }

  // Save user's daily result
  static async saveUserDailyResult(
    uid: string, 
    date: string, 
    correct: number, 
    total: number, 
    durationSec: number, 
    answers: UserAnswer[]
  ): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const result: UserDailyResult = {
      date,
      correct,
      total,
      durationSec,
      streak: correct === total ? 1 : 0, // Simple streak calculation
      answers,
      updatedAt: new Date()
    }
    
    mockStorage.set(`${uid}-${date}`, result)
    console.log('Mock: Saved result:', result)
  }

  // Get user's streak
  static async getUserStreak(uid: string): Promise<number> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return 3 // Mock streak
  }

  // Get user's challenge history
  static async getUserChallengeHistory(uid: string, limit: number = 10): Promise<UserDailyResult[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return Array.from(mockStorage.values()).slice(0, limit)
  }
}

