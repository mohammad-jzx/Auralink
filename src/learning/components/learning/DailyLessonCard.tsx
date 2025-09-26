"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lesson } from "@/lib/firestore/daily-lessons"
import { BookOpen, Play, Target, Users } from "lucide-react"
import { Link } from "react-router-dom"

interface DailyLessonCardProps {
  lesson: Lesson
}

export function DailyLessonCard({ lesson }: DailyLessonCardProps) {
  // Choose icon based on category
  const getIcon = () => {
    switch (lesson.category) {
      case 'أساسيات':
        return <BookOpen className="h-6 w-6 text-primary" />
      case 'الأرقام':
        return <Target className="h-6 w-6 text-blue-600" />
      case 'المهن':
        return <Users className="h-6 w-6 text-green-600" />
      default:
        return <BookOpen className="h-6 w-6 text-primary" />
    }
  }

  // Choose background color based on category
  const getBgColor = () => {
    switch (lesson.category) {
      case 'أساسيات':
        return 'bg-primary/10'
      case 'الأرقام':
        return 'bg-blue-100'
      case 'المهن':
        return 'bg-green-100'
      default:
        return 'bg-primary/10'
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className={`p-2 ${getBgColor()} rounded-lg`}>
            {getIcon()}
          </div>
          <div>
            <CardTitle className="text-lg">{lesson.title}</CardTitle>
            <CardDescription>{lesson.titleAr}</CardDescription>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-xs">{lesson.levelAr}</Badge>
          <Badge variant="secondary" className="text-xs">{lesson.lang}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {lesson.description}
        </p>
        <Button asChild className="w-full">
          <Link to={`/learning/interactive-lessons/${lesson.id}`}>
            <Play className="h-4 w-4 mr-2" />
            ابدأ الدرس
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
