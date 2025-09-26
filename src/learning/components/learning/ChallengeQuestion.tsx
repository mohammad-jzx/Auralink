"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChallengeQuestion as ChallengeQuestionType, UserAnswer } from "@/types/challenge"
import { ArrowRight, CheckCircle, Clock, Trophy, XCircle } from "lucide-react"
import { useState } from "react"

interface ChallengeQuestionProps {
  question: ChallengeQuestionType
  questionIndex: number
  totalQuestions: number
  onAnswer: (answer: UserAnswer) => void
  onNext: () => void
  isAnswered: boolean
  userAnswer?: UserAnswer
  timeSpent: number
}

export function ChallengeQuestion({
  question,
  questionIndex,
  totalQuestions,
  onAnswer,
  onNext,
  isAnswered,
  userAnswer,
  timeSpent
}: ChallengeQuestionProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return
    
    setSelectedIndex(index)
    const isCorrect = index === question.answerIndex
    
    const answer: UserAnswer = {
      questionId: question.id,
      selectedIndex: index,
      isCorrect,
      timeSpent
    }
    
    onAnswer(answer)
    setShowExplanation(true)
  }

  const handleNext = () => {
    setShowExplanation(false)
    setSelectedIndex(null)
    onNext()
  }

  const getOptionStyle = (index: number) => {
    if (!isAnswered) {
      return "hover:bg-muted/80 transition-colors"
    }
    
    if (index === question.answerIndex) {
      return "bg-green-100 border-green-500 text-green-800"
    }
    
    if (index === selectedIndex && !userAnswer?.isCorrect) {
      return "bg-red-100 border-red-500 text-red-800"
    }
    
    return "bg-muted/50 text-muted-foreground"
  }

  const renderMedia = () => {
    const { type, url } = question.media
    
    switch (type) {
      case 'video':
        return (
          <video
            src={url}
            className="w-full h-64 object-cover rounded-lg shadow-lg"
            controls
            autoPlay
            loop
            muted
            playsInline
            onError={(e) => {
              console.error('Video load error:', e)
              const target = e.target as HTMLVideoElement
              target.style.display = 'none'
            }}
          >
            <source src={url} type="video/mp4" />
            متصفحك لا يدعم تشغيل الفيديو
          </video>
        )
      case 'gif':
      case 'image':
        return (
          <img
            src={url}
            alt={question.prompt}
            className="w-full h-48 object-cover rounded-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.jpg"
            }}
          />
        )
      case 'youtube':
        return (
          <iframe
            src={url}
            className="w-full h-48 rounded-lg"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )
      default:
        return (
          <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
            <span className="text-muted-foreground">وسائط غير مدعومة</span>
          </div>
        )
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className="bg-primary/10 text-primary">
            المستوى: {question.level || 'مبتدئ'}
          </Badge>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {Math.round(timeSpent)} ثانية
          </div>
        </div>
        
        <CardTitle className="text-xl mb-2">
          السؤال {questionIndex + 1} من {totalQuestions}
        </CardTitle>
        
        <CardDescription className="text-lg">
          {question.prompt}
        </CardDescription>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <Progress value={((questionIndex + 1) / totalQuestions) * 100} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Media */}
        <div className="flex justify-center">
          {renderMedia()}
        </div>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className={`w-full h-16 text-right justify-start text-lg ${getOptionStyle(index)}`}
              onClick={() => handleOptionSelect(index)}
              disabled={isAnswered}
            >
              <span className="ml-3 text-sm font-mono text-muted-foreground">
                {String.fromCharCode(65 + index)}.
              </span>
              {option}
              
              {isAnswered && index === question.answerIndex && (
                <CheckCircle className="h-5 w-5 text-green-600 mr-auto" />
              )}
              
              {isAnswered && index === selectedIndex && !userAnswer?.isCorrect && (
                <XCircle className="h-5 w-5 text-red-600 mr-auto" />
              )}
            </Button>
          ))}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className={`p-4 rounded-lg border-2 ${
            userAnswer?.isCorrect 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <h4 className="font-semibold mb-3 flex items-center gap-2 text-lg">
              {userAnswer?.isCorrect ? (
                <>
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span className="text-green-800">إجابة صحيحة! 🎉</span>
                </>
              ) : (
                <>
                  <XCircle className="h-6 w-6 text-red-600" />
                  <span className="text-red-800">إجابة خاطئة ❌</span>
                </>
              )}
            </h4>
            
            <div className="space-y-2">
              <p className="text-gray-700 font-medium">
                {userAnswer?.isCorrect 
                  ? "أحسنت! لقد اخترت الإجابة الصحيحة." 
                  : `الإجابة الصحيحة هي: "${question.options[question.answerIndex]}"`
                }
              </p>
              <p className="text-gray-600">{question.explain}</p>
            </div>
          </div>
        )}

        {/* Next Button */}
        {isAnswered && (
          <div className="flex justify-center">
            <Button
              onClick={handleNext}
              className="px-8 py-3 text-lg"
              disabled={questionIndex === totalQuestions - 1}
            >
              {questionIndex === totalQuestions - 1 ? (
                <>
                  <Trophy className="h-5 w-5 mr-2" />
                  انتهى التحدي
                </>
              ) : (
                <>
                  التالي
                  <ArrowRight className="h-5 w-5 mr-2" />
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

