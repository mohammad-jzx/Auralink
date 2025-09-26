import { BookOpen, Flame, Play, Target, Trophy, Users, Baby } from "lucide-react"
import { Link } from "react-router-dom"
import { DailyLessonsCard } from "../components/learning/DailyLessonsCard"
import { SectionHeader } from "../components/learning/SectionHeader"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Progress } from "../components/ui/progress"
import { userProgress } from "../data/learningDummy"

export default function LearningPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/20">
      <div className="container mx-auto p-6 max-w-7xl">
        <SectionHeader
          title="رحلة التعلّم"
          description="اكتشف عالم لغة الإشارة بطريقة تفاعلية وممتعة"
          icon={BookOpen}
        />

        {/* Progress and Badges Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Progress Card */}
          <Card className="lg:col-span-2 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl text-foreground">
                <Target className="h-7 w-7 text-primary" />
                <span>إنجازاتك</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-foreground">التقدم الإجمالي</span>
                    <span className="text-2xl font-bold text-primary">
                      {Math.round((userProgress.lessonProgress.completed / userProgress.lessonProgress.total) * 100)}%
                    </span>
                  </div>
                  <Progress
                    value={Math.round(
                      (userProgress.lessonProgress.completed / userProgress.lessonProgress.total) * 100,
                    )}
                    className="h-4 bg-muted/60"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-accent/10 to-accent/20 rounded-xl border border-accent/30 shadow-sm">
                    <div className="flex items-center justify-center gap-2 text-accent mb-2">
                      <Flame className="h-5 w-5" />
                      <span className="text-2xl font-bold">{userProgress.streak}</span>
                    </div>
                    <p className="text-sm text-accent/80">يوم متتالي</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl border border-primary/30 shadow-sm">
                    <div className="flex items-center justify-center gap-2 text-primary mb-2">
                      <BookOpen className="h-5 w-5" />
                      <span className="text-2xl font-bold">{userProgress.lessonProgress.completed}</span>
                    </div>
                    <p className="text-sm text-primary/80">درس مكتمل</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Badges Card */}
          <Card className="bg-gradient-to-br from-chart-4/10 to-primary/10 border-chart-4/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-foreground">
                <Trophy className="h-6 w-6" style={{ color: "var(--chart-4)" }} />
                <span>الشارات</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {userProgress.badges.map((badge) => (
                  <Badge
                    key={badge.id}
                    variant={badge.earned ? "default" : "secondary"}
                    className={`p-3 text-center justify-center transition-all duration-200 ${
                      badge.earned ? "text-primary-foreground shadow-md" : "opacity-60 bg-muted hover:opacity-80"
                    }`}
                    style={badge.earned ? { backgroundColor: "var(--chart-4)" } : {}}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg">{badge.icon}</span>
                      <span className="text-xs">{badge.name}</span>
                    </div>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Lessons Section */}
        <div className="mb-12">
          <SectionHeader 
            title="الدروس التفاعلية" 
            description="تعلم من خلال قوائم تشغيل YouTube التفاعلية" 
            icon={BookOpen} 
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">ASL Basics</CardTitle>
                    <CardDescription>أساسيات لغة الإشارة الأمريكية</CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">مبتدئ</Badge>
                  <Badge variant="secondary" className="text-xs">ASL</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  سلسلة فيديوهات تفاعلية لتعلم أساسيات لغة الإشارة الأمريكية
                </p>
                <Button asChild className="w-full">
                  <Link to="/learning/interactive-lessons">
                    <Play className="h-4 w-4 mr-2" />
                    استكشف الدروس
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">ASL Professions</CardTitle>
                    <CardDescription>إشارات المهن والوظائف</CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">متوسط</Badge>
                  <Badge variant="secondary" className="text-xs">ASL</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  تعلم إشارات المهن المختلفة والوظائف بلغة الإشارة الأمريكية
                </p>
                <Button asChild className="w-full">
                  <Link to="/learning/interactive-lessons">
                    <Play className="h-4 w-4 mr-2" />
                    استكشف الدروس
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">ASL Numbers</CardTitle>
                    <CardDescription>الأرقام من 1 إلى 10</CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">مبتدئ</Badge>
                  <Badge variant="secondary" className="text-xs">ASL</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  تعلم الأرقام الأساسية بلغة الإشارة الأمريكية بطريقة تفاعلية
                </p>
                <Button asChild className="w-full">
                  <Link to="/learning/interactive-lessons">
                    <Play className="h-4 w-4 mr-2" />
                    استكشف الدروس
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Access Section */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-foreground">اختر طريقة التعلم</h2>
            <p className="text-muted-foreground text-lg">ابدأ رحلتك التعليمية من هنا</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <DailyLessonsCard />

            <Card className="group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200 dark:from-pink-900/20 dark:to-purple-900/20 dark:border-pink-800">
              <CardHeader className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-xl shadow-sm">
                    <Baby className="h-8 w-8 text-pink-600 dark:text-pink-400" />
                  </div>
                  <Badge variant="secondary" className="bg-pink-100 text-pink-700 border-pink-300 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-700">
                    للأطفال
                  </Badge>
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">KidsMode</CardTitle>
                <CardDescription className="text-muted-foreground text-base">
                  عالم تعليمي ممتع ومبسط للأطفال لتعلم لغة الإشارة
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <Link to="/learning/kids-mode">
                  <button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 h-12 px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg">
                    ابدأ المغامرة
                  </button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl bg-gradient-to-br from-accent/8 to-accent/15 border-accent/20">
              <CardHeader className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-accent/15 rounded-xl shadow-sm">
                    <Target className="h-8 w-8 text-accent" />
                  </div>
                  <Badge variant="secondary" className="bg-accent/15 text-accent border-accent/30">
                    يومي
                  </Badge>
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">التحدي اليومي</CardTitle>
                <CardDescription className="text-muted-foreground text-base">
                  اختبر معرفتك بأسئلة متنوعة واكسب نقاط إضافية
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <Link to="/learning/challenge">
                  <button className="w-full bg-gradient-to-r from-accent to-accent/90 text-accent-foreground hover:from-accent/90 hover:to-accent/80 h-12 px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg">
                    ابدأ التحدي الآن
                  </button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl bg-gradient-to-br from-primary/8 to-primary/15 border-primary/20">
              <CardHeader className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-primary/15 rounded-xl shadow-sm">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <Badge variant="secondary" className="bg-primary/15 text-primary border-primary/30">
                    مرجع
                  </Badge>
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">القاموس المرئي</CardTitle>
                <CardDescription className="text-muted-foreground text-base">
                  استكشف مكتبة شاملة من الإشارات مع الفيديوهات التوضيحية
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <Link to="/learning/dictionary">
                  <button className="w-full bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary/80 h-12 px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg">
                    استكشف القاموس
                  </button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
