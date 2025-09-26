"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle } from "lucide-react"

interface MCQProps {
  question: string
  options: string[]
  answerIdx: number
  onAnswered?: (correct: boolean) => void
}

export function MCQ({ question, options, answerIdx, onAnswered }: MCQProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleAnswer = (idx: number) => {
    if (showResult) return

    setSelectedIdx(idx)
    setShowResult(true)

    const isCorrect = idx === answerIdx
    onAnswered?.(isCorrect)
  }

  const getButtonVariant = (idx: number) => {
    if (!showResult) return "outline"
    if (idx === answerIdx) return "default"
    if (idx === selectedIdx && idx !== answerIdx) return "destructive"
    return "outline"
  }

  const getButtonIcon = (idx: number) => {
    if (!showResult) return null
    if (idx === answerIdx) return <CheckCircle className="h-4 w-4" />
    if (idx === selectedIdx && idx !== answerIdx) return <XCircle className="h-4 w-4" />
    return null
  }

  return (
    <Card className="rounded-2xl shadow-md">
      <CardHeader className="p-6">
        <CardTitle className="text-xl font-semibold">{question}</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-3">
        {options.map((option, idx) => (
          <Button
            key={idx}
            variant={getButtonVariant(idx)}
            className="w-full justify-start text-right h-auto p-4"
            onClick={() => handleAnswer(idx)}
            disabled={showResult}
          >
            <div className="flex items-center justify-between w-full">
              <span>{option}</span>
              {getButtonIcon(idx)}
            </div>
          </Button>
        ))}

        {showResult && (
          <div className="mt-4 p-4 rounded-xl bg-muted">
            <p className="text-center font-medium">
              {selectedIdx === answerIdx ? (
                <span className="text-green-600">إجابة صحيحة! 🎉</span>
              ) : (
                <span className="text-red-600">إجابة خاطئة. حاول مرة أخرى!</span>
              )}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
