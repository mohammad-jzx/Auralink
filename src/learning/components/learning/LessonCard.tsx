import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Play } from "lucide-react"
import { Link } from "react-router-dom"

interface LessonCardProps {
  title: string
  lang: "ASL" | "JSL"
  href: string
  description?: string
  progress?: number
}

export function LessonCard({ title, lang, href, description, progress }: LessonCardProps) {
  return (
    <Card className="group hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl bg-gradient-to-br from-primary/5 to-accent/10 border-primary/20">
      <CardHeader className="p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary font-semibold px-3 py-1">
            {lang}
          </Badge>
        </div>
        <CardTitle className="text-2xl font-bold text-gray-800 mb-2">{title}</CardTitle>
        {description && (
          <CardDescription className="text-gray-600 text-base leading-relaxed">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="p-8 pt-0">
        {progress !== undefined && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium text-gray-700">التقدم</span>
              <span className="text-xl font-bold text-primary">{progress}%</span>
            </div>
            <Progress value={progress} className="h-3 bg-muted" />
          </div>
        )}
        <Button
          asChild
          className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Link href={href} className="flex items-center justify-center gap-2">
            <Play className="h-5 w-5" />
            {progress ? "تابع التعلم" : "ابدأ الدرس"}
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
