export interface DailyChallenge {
  date: string
  level: 'beginner' | 'intermediate' | 'advanced'
  questions: ChallengeQuestion[]
}

export interface ChallengeQuestion {
  id: string
  type: 'mcq'
  prompt: string
  media: {
    type: 'gif' | 'image' | 'video' | 'youtube'
    url: string
  }
  options: string[]
  answerIndex: number
  explain: string
}

export interface UserDailyResult {
  date: string
  correct: number
  total: number
  durationSec: number
  streak: number
  answers: UserAnswer[]
  updatedAt: any // Firestore timestamp
}

export interface UserAnswer {
  questionId: string
  selectedIndex: number
  isCorrect: boolean
  timeSpent: number
}

export interface ChallengeState {
  currentQuestionIndex: number
  answers: UserAnswer[]
  startTime: number
  isCompleted: boolean
  showResult: boolean
}

