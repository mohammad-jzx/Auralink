import { BookOpen, CheckCircle, Clock, ExternalLink, Loader2, Play, PlayCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { SectionHeader } from "../../components/learning/SectionHeader"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Progress } from "../../components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { useToast } from "../../hooks/use-toast"
import { MockLessonsService } from "../../lib/firestore/lessons-mock"
import { InteractiveLesson, UserProgress } from "../../types/lessons"

export default function InteractiveLessonsPage() {
  const [lessons, setLessons] = useState<InteractiveLesson[]>([])
  const [userProgress, setUserProgress] = useState<Record<string, UserProgress>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLang, setSelectedLang] = useState<'ASL' | 'JSL'>('ASL')
  const { toast } = useToast()

  // Mock user ID (in real app, get from auth)
  const mockUserId = "user123"

  useEffect(() => {
    loadLessonsAndProgress()
  }, [])

  const loadLessonsAndProgress = async () => {
    try {
      setIsLoading(true)
      
      // Load lessons and user progress in parallel
      const [lessonsData, progressData] = await Promise.all([
        MockLessonsService.getInteractiveLessons(),
        MockLessonsService.getAllUserProgress(mockUserId)
      ])
      
      setLessons(lessonsData)
      setUserProgress(progressData)
      setIsLoading(false)
    } catch (error) {
      console.error('Error loading lessons:', error)
      setIsLoading(false)
    }
  }

  const getProgressStatus = (lessonId: string) => {
    const progress = userProgress[lessonId]
    if (!progress) return { status: 'not_started', text: 'ابدأ', variant: 'default' as const }
    
    switch (progress.status) {
      case 'started':
        return { status: 'started', text: 'متابعة', variant: 'secondary' as const }
      case 'in_progress':
        return { status: 'in_progress', text: 'متابعة', variant: 'secondary' as const }
      case 'completed':
        return { status: 'completed', text: 'تمّت', variant: 'outline' as const }
      default:
        return { status: 'not_started', text: 'ابدأ', variant: 'default' as const }
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <SectionHeader 
          title="الدروس التفاعلية" 
          description="جاري تحميل الدروس..." 
          icon={BookOpen} 
        />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">جاري تحميل الدروس التفاعلية...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <SectionHeader 
        title="الدروس التفاعلية" 
        description={selectedLang === 'ASL' ? 
          "تعلم لغة الإشارة الأمريكية من خلال قوائم تشغيل تفاعلية" : 
          "تعلم لغة الإشارة الأردنية من خلال قوائم تشغيل تفاعلية"
        } 
        icon={BookOpen} 
      />
      
      {/* Language Tabs */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="bg-muted/30 rounded-lg p-1 backdrop-blur-sm border border-border/50 mx-auto">
          <Tabs value={selectedLang} onValueChange={(value) => setSelectedLang(value as 'ASL' | 'JSL')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-transparent p-1 h-12">
              <TabsTrigger 
                value="ASL" 
                className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:text-foreground transition-all duration-300 rounded-md px-8 py-2"
              >
                <span className="font-medium">ASL</span>
                <Badge 
                  variant="secondary" 
                  className={`text-xs px-2 py-1 transition-all duration-300 ${
                    selectedLang === "ASL" 
                      ? "bg-primary text-white shadow-md" 
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {lessons.filter(l => l.lang === 'ASL').length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="JSL" 
                className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:text-foreground transition-all duration-300 rounded-md px-8 py-2"
              >
                <span className="font-medium">JSL</span>
                <Badge 
                  variant="secondary" 
                  className={`text-xs px-2 py-1 transition-all duration-300 ${
                    selectedLang === "JSL" 
                      ? "bg-blue-500 text-white shadow-md" 
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {lessons.filter(l => l.lang === 'JSL').length}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{lessons.filter(l => l.lang === selectedLang).length}</p>
                <p className="text-sm text-muted-foreground">درس متاح</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <PlayCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {Object.entries(userProgress)
                    .filter(([id, p]) => 
                      (p.status === 'started' || p.status === 'in_progress') && 
                      lessons.find(l => l.id === id)?.lang === selectedLang
                    ).length
                  }
                </p>
                <p className="text-sm text-muted-foreground">درس قيد التقدم</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">
                  {Object.entries(userProgress)
                    .filter(([id, p]) => 
                      p.status === 'completed' && 
                      lessons.find(l => l.id === id)?.lang === selectedLang
                    ).length
                  }
                </p>
                <p className="text-sm text-muted-foreground">درس مكتمل</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.filter(lesson => lesson.lang === selectedLang).map((lesson) => {
          const progress = userProgress[lesson.id]
          const { status, text, variant } = getProgressStatus(lesson.id)
          
          return (
            <Card key={lesson.id} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold text-foreground mb-2">
                      {lesson.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground mb-3">
                      {lesson.description}
                    </CardDescription>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30">
                    {lesson.lang}
                  </Badge>
                  <Badge variant="outline" className={`text-xs ${getLevelColor(lesson.level)}`}>
                    {lesson.level === 'beginner' ? 'مبتدئ' : 
                     lesson.level === 'intermediate' ? 'متوسط' : 'متقدم'}
                  </Badge>
                </div>

                {/* Progress Bar */}
                {progress && progress.status !== 'not_started' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>التقدم</span>
                      <span>{progress.progress}%</span>
                    </div>
                    <Progress value={progress.progress} className="h-2" />
                  </div>
                )}
              </CardHeader>

              <CardContent className="p-4 pt-0">
                {/* Lesson Info */}
                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {lesson.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Play className="h-4 w-4" />
                    {lesson.videoCount} فيديو
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button 
                    asChild 
                    variant={variant} 
                    className="w-full"
                    disabled={status === 'completed'}
                  >
                    <Link to={`/learning/interactive-lessons/${lesson.id}`}>
                      {status === 'completed' ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {text}
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          {text}
                        </>
                      )}
                    </Link>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    asChild
                  >
                    <a 
                      href={lesson.playlist_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      فتح في YouTube
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {lessons.filter(lesson => lesson.lang === selectedLang).length === 0 && (
        <div className="text-center py-20">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">لا توجد دروس متاحة</h3>
          <p className="text-muted-foreground">
            عذراً، لا توجد دروس تفاعلية {selectedLang === 'ASL' ? 'للغة الإشارة الأمريكية' : 'للغة الإشارة الأردنية'} متاحة حالياً
          </p>
        </div>
      )}
    </div>
  )
}

