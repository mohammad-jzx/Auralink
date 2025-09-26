import { InteractiveLesson, UserProgress } from '@/types/lessons'

// Mock data for testing
const mockLessons: InteractiveLesson[] = [
  // ASL Lessons
  {
    id: "asl_profession_series_interactive",
    title: "ASL Profession Series",
    lang: "ASL",
    level: "intermediate",
    type: "interactive",
    playlist_url: "https://www.youtube.com/playlist?list=PLMN7QCuj6dfZZIfLeSwBWJEv8mL4TgBKh",
    playlist_id: "PLMN7QCuj6dfZZIfLeSwBWJEv8mL4TgBKh",
    captions: true,
    description: "سلسلة شاملة لتعلم إشارات المهن والوظائف بلغة الإشارة الأمريكية",
    thumbnail: "https://img.youtube.com/vi/example/maxresdefault.jpg",
    duration: "45 دقيقة",
    videoCount: 8
  },
  {
    id: "asl_basics_interactive",
    title: "ASL Basics",
    lang: "ASL",
    level: "beginner",
    type: "interactive",
    playlist_url: "https://www.youtube.com/playlist?list=PLMN7QCuj6dfYD8DfG1rN6rEo1b1RyvgKF",
    playlist_id: "PLMN7QCuj6dfYD8DfG1rN6rEo1b1RyvgKF",
    captions: true,
    description: "أساسيات لغة الإشارة الأمريكية للمبتدئين",
    thumbnail: "https://img.youtube.com/vi/example/maxresdefault.jpg",
    duration: "30 دقيقة",
    videoCount: 6
  },
  {
    id: "asl_numbers_interactive",
    title: "ASL Numbers 1–10",
    lang: "ASL",
    level: "beginner",
    type: "interactive",
    playlist_url: "https://www.youtube.com/playlist?list=PLMN7QCuj6dfaO7v-Oqkg3Bjq0XOT3c07X",
    playlist_id: "PLMN7QCuj6dfaO7v-Oqkg3Bjq0XOT3c07X",
    captions: true,
    description: "تعلم الأرقام من 1 إلى 10 بلغة الإشارة الأمريكية",
    thumbnail: "https://img.youtube.com/vi/example/maxresdefault.jpg",
    duration: "15 دقيقة",
    videoCount: 3
  },
  
  // JSL Lessons
  {
    id: "jsl_basics_interactive",
    title: "JSL أساسيات",
    lang: "JSL",
    level: "beginner",
    type: "interactive",
    playlist_url: "https://www.youtube.com/playlist?list=PLnfudGWrboXyULqw4sO4W8Y0l9sUfnDmx",
    playlist_id: "PLnfudGWrboXyULqw4sO4W8Y0l9sUfnDmx",
    captions: true,
    description: "سلسلة تعليمية لأساسيات لغة الإشارة الأردنية",
    thumbnail: "https://img.youtube.com/vi/wZwZ--J_eQQ/maxresdefault.jpg",
    duration: "60 دقيقة",
    videoCount: 12
  }
]

// Mock storage for user progress
const mockProgressStorage = new Map<string, UserProgress>()

export class MockLessonsService {
  // Get all interactive lessons
  static async getInteractiveLessons(): Promise<InteractiveLesson[]> {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockLessons
  }

  // Get user progress for a specific lesson
  static async getUserProgress(uid: string, lessonId: string): Promise<UserProgress | null> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockProgressStorage.get(`${uid}-${lessonId}`) || null
  }

  // Create or update user progress
  static async updateUserProgress(
    uid: string, 
    lessonId: string, 
    status: UserProgress['status'],
    progress: number = 0
  ): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const now = new Date()
    const progressData: UserProgress = {
      lessonId,
      status,
      progress,
      updatedAt: now
    }

    if (status === 'started' || status === 'in_progress') {
      progressData.startedAt = now
      progressData.lastWatchedAt = now
    }

    if (status === 'completed') {
      progressData.completedAt = now
      progressData.progress = 100
    }

    mockProgressStorage.set(`${uid}-${lessonId}`, progressData)
    console.log('Mock: Updated progress:', progressData)
  }

  // Get all user progress for lessons
  static async getAllUserProgress(uid: string): Promise<Record<string, UserProgress>> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const progressMap: Record<string, UserProgress> = {}
    mockProgressStorage.forEach((progress, key) => {
      if (key.startsWith(`${uid}-`)) {
        const lessonId = key.replace(`${uid}-`, '')
        progressMap[lessonId] = progress
      }
    })
    
    return progressMap
  }
}

// Utility functions for YouTube playlists
export const getPlaylistId = (urlOrId: string): string => {
  if (urlOrId.includes('list=')) {
    const match = urlOrId.match(/list=([^&]+)/)
    return match ? match[1] : urlOrId
  }
  return urlOrId
}

export const getPlaylistEmbedUrl = (urlOrId: string): string => {
  const playlistId = getPlaylistId(urlOrId)
  return `https://www.youtube.com/embed/videoseries?list=${playlistId}`
}

