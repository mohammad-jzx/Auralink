export interface InteractiveLesson {
  id: string
  title: string
  lang: "ASL" | "JSL"
  level: "beginner" | "intermediate" | "advanced"
  type: "interactive"
  playlist_url: string
  playlist_id: string
  captions: boolean
  description?: string
  thumbnail?: string
  duration?: string
  videoCount?: number
}

export interface UserProgress {
  lessonId: string
  status: "not_started" | "started" | "in_progress" | "completed"
  progress: number // 0-100
  lastWatchedAt?: Date
  updatedAt: Date
  startedAt?: Date
  completedAt?: Date
}

export interface LessonViewerState {
  lesson: InteractiveLesson
  userProgress: UserProgress | null
  isLoading: boolean
  error: string | null
}

