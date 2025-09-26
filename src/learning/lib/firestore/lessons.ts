import { InteractiveLesson, UserProgress } from '@/types/lessons'
import {
    collection,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    setDoc,
    where
} from 'firebase/firestore'
import { db } from './config'

export class LessonsService {
  // Get all interactive lessons
  static async getInteractiveLessons(): Promise<InteractiveLesson[]> {
    try {
      const lessonsRef = collection(db, 'lessons')
      const q = query(
        lessonsRef,
        where('type', '==', 'interactive'),
        orderBy('level', 'asc')
      )
      
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as InteractiveLesson[]
    } catch (error) {
      console.error('Error fetching lessons:', error)
      return []
    }
  }

  // Get user progress for a specific lesson
  static async getUserProgress(uid: string, lessonId: string): Promise<UserProgress | null> {
    try {
      const progressRef = doc(db, 'users', uid, 'progress', lessonId)
      const progressDoc = await getDoc(progressRef)
      
      if (progressDoc.exists()) {
        return progressDoc.data() as UserProgress
      }
      return null
    } catch (error) {
      console.error('Error fetching user progress:', error)
      return null
    }
  }

  // Create or update user progress
  static async updateUserProgress(
    uid: string, 
    lessonId: string, 
    status: UserProgress['status'],
    progress: number = 0
  ): Promise<void> {
    try {
      const progressRef = doc(db, 'users', uid, 'progress', lessonId)
      const now = new Date()
      
      const progressData: Partial<UserProgress> = {
        lessonId,
        status,
        progress,
        updatedAt: now
      }

      if (status === 'started' || status === 'in_progress') {
        progressData.startedAt = progressData.startedAt || now
        progressData.lastWatchedAt = now
      }

      if (status === 'completed') {
        progressData.completedAt = now
        progressData.progress = 100
      }

      await setDoc(progressRef, progressData, { merge: true })
    } catch (error) {
      console.error('Error updating user progress:', error)
      throw error
    }
  }

  // Get all user progress for lessons
  static async getAllUserProgress(uid: string): Promise<Record<string, UserProgress>> {
    try {
      const progressRef = collection(db, 'users', uid, 'progress')
      const snapshot = await getDocs(progressRef)
      
      const progressMap: Record<string, UserProgress> = {}
      snapshot.docs.forEach(doc => {
        const data = doc.data() as UserProgress
        progressMap[data.lessonId] = data
      })
      
      return progressMap
    } catch (error) {
      console.error('Error fetching all user progress:', error)
      return {}
    }
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

