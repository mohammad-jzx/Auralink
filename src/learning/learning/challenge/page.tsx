import { AlertCircle, Calendar, Clock, Loader2, Target, Trophy } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ChallengeQuestion } from "../../components/learning/ChallengeQuestion"
import { ChallengeResult } from "../../components/learning/ChallengeResult"
import { SectionHeader } from "../../components/learning/SectionHeader"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { useToast } from "../../hooks/use-toast"
import { MockChallengeService } from "../../lib/firestore/challenge-mock"
import { ChallengeState, DailyChallenge, UserAnswer, UserDailyResult } from "../../types/challenge"

export default function ChallengePage() {
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null)
  const [userResult, setUserResult] = useState<UserDailyResult | null>(null)
  const [challengeState, setChallengeState] = useState<ChallengeState>({
    currentQuestionIndex: 0,
    answers: [],
    startTime: Date.now(),
    isCompleted: false,
    showResult: false
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Mock user ID (in real app, get from auth)
  const mockUserId = "user123"

  useEffect(() => {
    loadTodayChallenge()
  }, [])

  const loadTodayChallenge = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Get today's challenge using mock service
      const todayChallenge = await MockChallengeService.getTodayChallenge()
      
      if (!todayChallenge) {
        setError("لا يوجد تحدي لليوم")
        setIsLoading(false)
        return
      }
      
      setChallenge(todayChallenge)
      
      // Check if user already completed today's challenge
      const today = new Date().toISOString().split('T')[0]
      const existingResult = await MockChallengeService.getUserDailyResult(mockUserId, today)
      
      if (existingResult) {
        setUserResult(existingResult)
        setChallengeState(prev => ({
          ...prev,
          isCompleted: true,
          showResult: true
        }))
      }
      
      setIsLoading(false)
    } catch (error) {
      console.error('Error loading challenge:', error)
      setError("حدث خطأ في تحميل التحدي")
      setIsLoading(false)
    }
  }

  const handleAnswer = (answer: UserAnswer) => {
    setChallengeState(prev => ({
      ...prev,
      answers: [...prev.answers, answer]
    }))
  }

  const handleNext = () => {
    setChallengeState(prev => {
      const nextIndex = prev.currentQuestionIndex + 1
      const isCompleted = nextIndex >= (challenge?.questions.length || 0)
      
      if (isCompleted) {
        // Challenge completed, save result
        saveChallengeResult()
        return {
          ...prev,
          currentQuestionIndex: nextIndex,
          isCompleted: true,
          showResult: true
        }
      }
      
      return {
        ...prev,
        currentQuestionIndex: nextIndex
      }
    })
  }

  const saveChallengeResult = async () => {
    if (!challenge) return
    
    try {
      const totalQuestions = challenge.questions.length
      const correctAnswers = challengeState.answers.filter(a => a.isCorrect).length
      const durationSec = Math.round((Date.now() - challengeState.startTime) / 1000)
      
      await MockChallengeService.saveUserDailyResult(
        mockUserId,
        challenge.date,
        correctAnswers,
        totalQuestions,
        durationSec,
        challengeState.answers
      )
      
      const result: UserDailyResult = {
        date: challenge.date,
        correct: correctAnswers,
        total: totalQuestions,
        durationSec,
        streak: 0, // Will be calculated by service
        answers: challengeState.answers,
        updatedAt: new Date()
      }
      
      setUserResult(result)
      
      toast({
        title: "تم حفظ النتيجة!",
        description: `أحسنت! حصلت على ${correctAnswers} من ${totalQuestions}`,
      })
    } catch (error) {
      console.error('Error saving result:', error)
      toast({
        title: "خطأ في حفظ النتيجة",
        description: "حدث خطأ في حفظ نتيجتك",
        variant: "destructive"
      })
    }
  }

  const handleRetry = () => {
    setChallengeState({
      currentQuestionIndex: 0,
      answers: [],
      startTime: Date.now(),
      isCompleted: false,
      showResult: false
    })
    setUserResult(null)
  }

  const handleShare = () => {
    if (navigator.share && userResult) {
      navigator.share({
        title: `نتيجة التحدي اليومي: ${userResult.correct}/${userResult.total}`,
        text: `حصلت على ${userResult.correct} من ${userResult.total} في التحدي اليومي! 🎯`,
        url: window.location.href
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <SectionHeader 
          title="التحدي اليومي" 
          description="جاري تحميل التحدي..." 
          icon={Trophy} 
        />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">جاري تحميل التحدي اليومي...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <SectionHeader 
          title="التحدي اليومي" 
          description="لا يوجد تحدي لليوم" 
          icon={Trophy} 
        />
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <CardTitle>لا يوجد تحدي لليوم</CardTitle>
            <CardDescription>
              عذراً، لا يوجد تحدي متاح لليوم. 
              تحقق غداً من التحدي الجديد!
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <Link to="/learning">
                العودة للتعلم
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (challengeState.showResult && userResult) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <SectionHeader 
          title="نتيجة التحدي اليومي" 
          description="أحسنت! إليك نتيجتك" 
          icon={Trophy} 
        />
        <ChallengeResult 
          result={userResult}
          onRetry={handleRetry}
          onShare={handleShare}
        />
      </div>
    )
  }

  if (!challenge) {
    return null
  }

  const currentQuestion = challenge.questions[challengeState.currentQuestionIndex]
  const currentAnswer = challengeState.answers[challengeState.currentQuestionIndex]
  const timeSpent = Math.round((Date.now() - challengeState.startTime) / 1000)

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <SectionHeader 
        title="التحدي اليومي" 
        description="اختبر معرفتك واكسب نقاط جديدة" 
        icon={Trophy} 
      />

      {/* Challenge Info */}
      <div className="mb-8">
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Badge variant="outline" className="bg-primary/10 text-primary">
                <Calendar className="h-4 w-4 mr-2" />
                {challenge.date}
              </Badge>
              <Badge variant="outline" className="bg-accent/10 text-accent">
                <Target className="h-4 w-4 mr-2" />
                المستوى: {challenge.level}
              </Badge>
            </div>
            <CardTitle>تحدي اليوم</CardTitle>
            <CardDescription>
              {challenge.questions.length} أسئلة لاختبار معرفتك بلغة الإشارة
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Current Question */}
      <ChallengeQuestion
        question={currentQuestion}
        questionIndex={challengeState.currentQuestionIndex}
        totalQuestions={challenge.questions.length}
        onAnswer={handleAnswer}
        onNext={handleNext}
        isAnswered={!!currentAnswer}
        userAnswer={currentAnswer}
        timeSpent={timeSpent}
      />

      {/* Progress Info */}
      <div className="mt-8 text-center">
        <p className="text-muted-foreground">
          السؤال {challengeState.currentQuestionIndex + 1} من {challenge.questions.length}
        </p>
        <div className="flex items-center justify-center gap-4 mt-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {Math.round(timeSpent)} ثانية
          </span>
          <span className="flex items-center gap-1">
            <Target className="h-4 w-4" />
            {challengeState.answers.filter(a => a.isCorrect).length} صحيح
          </span>
        </div>
      </div>
    </div>
  )
}
