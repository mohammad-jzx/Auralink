import { DailyChallenge, UserAnswer, UserDailyResult } from '@/types/challenge'
import {
    collection,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    serverTimestamp,
    setDoc
} from 'firebase/firestore'
import { db } from './config'

export class ChallengeService {
  // Get today's challenge
  static async getTodayChallenge(): Promise<DailyChallenge | null> {
    try {
      const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
      const challengeRef = doc(db, 'dailyChallenges', today)
      const challengeSnap = await getDoc(challengeRef)
      
      if (challengeSnap.exists()) {
        return challengeSnap.data() as DailyChallenge
      }
      
      return null
    } catch (error) {
      console.error('Error fetching today challenge:', error)
      return null
    }
  }

  // Get user's daily result
  static async getUserDailyResult(uid: string, date: string): Promise<UserDailyResult | null> {
    try {
      const resultRef = doc(db, 'users', uid, 'dailyResults', date)
      const resultSnap = await getDoc(resultRef)
      
      if (resultSnap.exists()) {
        return resultSnap.data() as UserDailyResult
      }
      
      return null
    } catch (error) {
      console.error('Error fetching user daily result:', error)
      return null
    }
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
    try {
      // Get yesterday's result to calculate streak
      const yesterday = new Date(date)
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]
      
      const yesterdayResult = await this.getUserDailyResult(uid, yesterdayStr)
      const currentStreak = yesterdayResult?.streak || 0
      const newStreak = correct === total ? currentStreak + 1 : 0

      const result: UserDailyResult = {
        date,
        correct,
        total,
        durationSec,
        streak: newStreak,
        answers,
        updatedAt: serverTimestamp()
      }

      const resultRef = doc(db, 'users', uid, 'dailyResults', date)
      await setDoc(resultRef, result)
    } catch (error) {
      console.error('Error saving user daily result:', error)
      throw error
    }
  }

  // Get user's streak
  static async getUserStreak(uid: string): Promise<number> {
    try {
      const resultsRef = collection(db, 'users', uid, 'dailyResults')
      const q = query(resultsRef, orderBy('date', 'desc'), limit(1))
      const querySnapshot = await getDocs(q)
      
      if (!querySnapshot.empty) {
        const lastResult = querySnapshot.docs[0].data() as UserDailyResult
        return lastResult.streak
      }
      
      return 0
    } catch (error) {
      console.error('Error fetching user streak:', error)
      return 0
    }
  }

  // Get user's challenge history
  static async getUserChallengeHistory(uid: string, limit: number = 10): Promise<UserDailyResult[]> {
    try {
      const resultsRef = collection(db, 'users', uid, 'dailyResults')
      const q = query(resultsRef, orderBy('date', 'desc'), limit(limit))
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => doc.data() as UserDailyResult)
    } catch (error) {
      console.error('Error fetching user challenge history:', error)
      return []
    }
  }
}

