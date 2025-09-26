import { AlertCircle, ArrowLeft, BookOpen, CheckCircle, Clock, ExternalLink, Loader2, Play, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { PlaylistVideosDrawer } from "../../../components/learning/PlaylistVideosDrawer"
import { SectionHeader } from "../../../components/learning/SectionHeader"
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Progress } from "../../../components/ui/progress"
import { useToast } from "../../../hooks/use-toast"
import { getPlaylistEmbedUrl, MockLessonsService } from "../../../lib/firestore/lessons-mock"
import { InteractiveLesson, UserProgress } from "../../../types/lessons"

export default function LessonViewerPage() {
  const params = useParams()
  const navigate = useNavigate()
  const lessonId = params.lessonId as string
  
  const [lesson, setLesson] = useState<InteractiveLesson | null>(null)
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(1)
  const { toast } = useToast()

  // Mock user ID (in real app, get from auth)
  const mockUserId = "user123"

  useEffect(() => {
    if (lessonId) {
      loadLessonAndProgress()
    }
  }, [lessonId])

  const loadLessonAndProgress = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Load lesson and user progress in parallel
      const [lessonsData, progressData] = await Promise.all([
        MockLessonsService.getInteractiveLessons(),
        MockLessonsService.getUserProgress(mockUserId, lessonId)
      ])
      
      const foundLesson = lessonsData.find(l => l.id === lessonId)
      if (!foundLesson) {
        setError("الدرس غير موجود")
        setIsLoading(false)
        return
      }
      
      setLesson(foundLesson)
      setUserProgress(progressData)
      
      // Mark lesson as started if not already
      if (!progressData || progressData.status === 'not_started') {
        await MockLessonsService.updateUserProgress(mockUserId, lessonId, 'started')
        setUserProgress({
          lessonId,
          status: 'started',
          progress: 0,
          updatedAt: new Date(),
          startedAt: new Date()
        })
      }
      
      setIsLoading(false)
    } catch (error) {
      console.error('Error loading lesson:', error)
      setError("حدث خطأ في تحميل الدرس")
      setIsLoading(false)
    }
  }

  const markAsCompleted = async () => {
    if (!lesson) return
    
    try {
      await MockLessonsService.updateUserProgress(mockUserId, lessonId, 'completed', 100)
      setUserProgress({
        lessonId,
        status: 'completed',
        progress: 100,
        updatedAt: new Date(),
        startedAt: userProgress?.startedAt || new Date(),
        completedAt: new Date()
      })
      
      toast({
        title: "أحسنت! 🎉",
        description: "لقد أكملت الدرس بنجاح",
      })
    } catch (error) {
      console.error('Error marking lesson as completed:', error)
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحديث التقدم",
        variant: "destructive"
      })
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
          title="جاري التحميل..." 
          description="جاري تحميل الدرس..." 
          icon={BookOpen} 
        />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">جاري تحميل الدرس...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !lesson) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <SectionHeader 
          title="خطأ" 
          description="حدث خطأ في تحميل الدرس" 
          icon={AlertCircle} 
        />
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <CardTitle>خطأ في تحميل الدرس</CardTitle>
            <CardDescription>
              {error || "الدرس غير موجود أو حدث خطأ في التحميل"}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <Link to="/learning/interactive-lessons">
                العودة للدروس
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header with Back Button */}
      <div className="mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          asChild
          className="mb-4"
        >
          <Link to="/learning/interactive-lessons">
            <ArrowLeft className="h-4 w-4 mr-2" />
            العودة للدروس
          </Link>
        </Button>
        
        <SectionHeader 
          title={lesson.title} 
          description={lesson.description || "درس تفاعلي بلغة الإشارة الأمريكية"} 
          icon={BookOpen} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Video Player */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">مشغل الفيديو</h2>
                <Badge variant="outline" className={`text-xs ${getLevelColor(lesson.level)}`}>
                  {lesson.level === 'beginner' ? 'مبتدئ' : 
                   lesson.level === 'intermediate' ? 'متوسط' : 'متقدم'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {/* YouTube Embed */}
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
                <iframe
                  src={getPlaylistEmbedUrl(lesson.playlist_id)}
                  title={lesson.title}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              
              {/* Video Controls */}
              <div className="mt-4 flex justify-between items-center">
                <PlaylistVideosDrawer 
                  playlistId={lesson.playlist_id} 
                  currentVideoIndex={currentVideoIndex}
                  onVideoSelect={(index) => setCurrentVideoIndex(index)}
                />
                
                <Button variant="outline" asChild>
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
        </div>

        {/* Sidebar - Lesson Info & Progress */}
        <div className="space-y-6">
          {/* Lesson Info */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">معلومات الدرس</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30">
                  {lesson.lang}
                </Badge>
                <Badge variant="outline" className={`text-xs ${getLevelColor(lesson.level)}`}>
                  {lesson.level === 'beginner' ? 'مبتدئ' : 
                   lesson.level === 'intermediate' ? 'متوسط' : 'متقدم'}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>المدة: {lesson.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  <span>عدد الفيديوهات: {lesson.videoCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>الترجمة: {lesson.captions ? 'متوفرة' : 'غير متوفرة'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Tracking */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">تقدمك</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {userProgress ? (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>الحالة</span>
                      <span className="font-medium">
                        {userProgress.status === 'not_started' ? 'لم يبدأ' :
                         userProgress.status === 'started' ? 'بدأ' :
                         userProgress.status === 'in_progress' ? 'قيد التقدم' : 'مكتمل'}
                      </span>
                    </div>
                    <Progress value={userProgress.progress} className="h-2" />
                    <div className="text-xs text-muted-foreground text-center">
                      {userProgress.progress}% مكتمل
                    </div>
                  </div>
                  
                  {userProgress.status !== 'completed' && (
                    <Button 
                      onClick={markAsCompleted}
                      className="w-full"
                      variant="default"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      إكمال الدرس
                    </Button>
                  )}
                  
                  {userProgress.status === 'completed' && (
                    <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                      <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-green-800">تم إكمال الدرس! 🎉</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center text-muted-foreground">
                  <p className="text-sm">لم يبدأ الدرس بعد</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">إجراءات سريعة</h3>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" asChild className="w-full">
                <a 
                  href={lesson.playlist_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  فتح في YouTube
                </a>
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link to="/learning/interactive-lessons">
                  <BookOpen className="h-4 w-4 mr-2" />
                  جميع الدروس
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

