"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { UserDailyResult } from "@/types/challenge"
import {
    Clock,
    Home,
    RefreshCw,
    Share2,
    Target,
    TrendingUp,
    Trophy
} from "lucide-react"
import { Link } from "react-router-dom"

interface ChallengeResultProps {
  result: UserDailyResult
  onRetry?: () => void
  onShare?: () => void
}

export function ChallengeResult({ result, onRetry, onShare }: ChallengeResultProps) {
  const percentage = Math.round((result.correct / result.total) * 100)
  const isPerfect = result.correct === result.total
  const isGood = percentage >= 80
  const isAverage = percentage >= 60
  const isPoor = percentage < 60

  const getPerformanceColor = () => {
    if (isPerfect) return "text-yellow-600"
    if (isGood) return "text-green-600"
    if (isAverage) return "text-blue-600"
    return "text-red-600"
  }

  const getPerformanceText = () => {
    if (isPerfect) return "ممتاز! 🎉"
    if (isGood) return "جيد جداً! 👍"
    if (isAverage) return "جيد 😊"
    return "يحتاج تحسين 💪"
  }

  const getPerformanceEmoji = () => {
    if (isPerfect) return "🏆"
    if (isGood) return "⭐"
    if (isAverage) return "👍"
    return "💪"
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `نتيجة التحدي اليومي: ${result.correct}/${result.total}`,
        text: `حصلت على ${result.correct} من ${result.total} في التحدي اليومي! 🎯`,
        url: window.location.href
      })
    } else if (onShare) {
      onShare()
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className={`text-6xl ${getPerformanceColor()}`}>
            {getPerformanceEmoji()}
          </div>
        </div>
        
        <CardTitle className="text-2xl mb-2">
          {getPerformanceText()}
        </CardTitle>
        
        <CardDescription className="text-lg">
          انتهى التحدي اليومي! إليك نتيجتك
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Score Display */}
        <div className="text-center">
          <div className="text-4xl font-bold text-primary mb-2">
            {result.correct}/{result.total}
          </div>
          <div className="text-lg text-muted-foreground">
            {percentage}% من الإجابات صحيحة
          </div>
          <Progress value={percentage} className="h-3 mt-3" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-muted/20 rounded-lg">
            <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{formatTime(result.durationSec)}</div>
            <div className="text-sm text-muted-foreground">الوقت المستغرق</div>
          </div>
          
          <div className="text-center p-4 bg-muted/20 rounded-lg">
            <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{result.correct}</div>
            <div className="text-sm text-muted-foreground">إجابات صحيحة</div>
          </div>
        </div>

        {/* Streak Info */}
        {result.streak > 0 && (
          <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-yellow-600" />
              <span className="font-semibold text-yellow-800">سلسلة النجاح</span>
            </div>
            <div className="text-2xl font-bold text-yellow-700">
              {result.streak} يوم متتالي
            </div>
            <div className="text-sm text-yellow-600">
              استمر في التعلم للحفاظ على سلسلتك!
            </div>
          </div>
        )}

        {/* Performance Badge */}
        <div className="text-center">
          <Badge 
            variant="outline" 
            className={`text-lg px-4 py-2 ${getPerformanceColor()} border-current`}
          >
            {getPerformanceText()}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={onRetry}
            variant="outline"
            className="flex-1"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            إعادة المحاولة
          </Button>
          
          <Button
            onClick={handleShare}
            variant="outline"
            className="flex-1"
          >
            <Share2 className="h-4 w-4 mr-2" />
            مشاركة النتيجة
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <Button asChild className="flex-1">
            <Link to="/learning">
              <Home className="h-4 w-4 mr-2" />
              العودة للتعلم
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="flex-1">
            <Link to="/learning/challenge">
              <Trophy className="h-4 w-4 mr-2" />
              التحدي اليومي
            </Link>
          </Button>
        </div>

        {/* Encouragement */}
        <div className="text-center p-4 bg-primary/5 rounded-lg">
          <p className="text-sm text-primary/80">
            {isPerfect 
              ? "أحسنت! أنت متقن للغة الإشارة! 🎯"
              : isGood 
              ? "أداء ممتاز! استمر في التعلم! 📚"
              : isAverage 
              ? "أداء جيد! الممارسة تجعل الكمال! 💪"
              : "لا تستسلم! كل يوم فرصة للتحسن! 🌟"
            }
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

