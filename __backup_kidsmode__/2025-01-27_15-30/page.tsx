import { Baby, Heart, Star, Sparkles, Gamepad2, Music, Palette } from "lucide-react"
import { Link } from "react-router-dom"
import { SectionHeader } from "../../components/learning/SectionHeader"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"

export default function KidsModePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-pink-900/20 dark:via-purple-900/20 dark:to-blue-900/20">
      <div className="container mx-auto p-6 max-w-7xl">
        <SectionHeader
          title="KidsMode 🎨"
          description="عالم تعليمي ممتع ومبسط للأطفال لتعلم لغة الإشارة"
          icon={Baby}
        />

        {/* Welcome Section */}
        <div className="mb-12">
          <Card className="bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 border-pink-200 dark:border-pink-800 shadow-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg">
                  <Baby className="h-12 w-12 text-pink-600 dark:text-pink-400" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-pink-800 dark:text-pink-200 mb-2">
                مرحباً أيها الصغير! 👋
              </CardTitle>
              <CardDescription className="text-lg text-pink-700 dark:text-pink-300">
                هيا نتعلم لغة الإشارة معاً بطريقة ممتعة وملونة! 🌈
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Activities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Coloring Activity */}
          <Card className="group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
            <CardHeader className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl shadow-sm">
                  <Palette className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                </div>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700">
                  تلوين
                </Badge>
              </div>
              <CardTitle className="text-xl font-bold text-foreground">التلوين التفاعلي</CardTitle>
              <CardDescription className="text-muted-foreground">
                لون الإشارات وتعلم معانيها بطريقة ممتعة
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 h-12 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg">
                <Palette className="h-5 w-5 mr-2" />
                ابدأ التلوين
              </Button>
            </CardContent>
          </Card>

          {/* Games */}
          <Card className="group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border-green-200 dark:border-green-800">
            <CardHeader className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl shadow-sm">
                  <Gamepad2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700">
                  ألعاب
                </Badge>
              </div>
              <CardTitle className="text-xl font-bold text-foreground">ألعاب تعليمية</CardTitle>
              <CardDescription className="text-muted-foreground">
                العب وتعلم في نفس الوقت مع ألعاب ممتعة
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <Button className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600 h-12 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg">
                <Gamepad2 className="h-5 w-5 mr-2" />
                العب الآن
              </Button>
            </CardContent>
          </Card>

          {/* Songs */}
          <Card className="group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
            <CardHeader className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl shadow-sm">
                  <Music className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700">
                  أغاني
                </Badge>
              </div>
              <CardTitle className="text-xl font-bold text-foreground">أغاني الإشارة</CardTitle>
              <CardDescription className="text-muted-foreground">
                غني وتعلم مع أغاني لغة الإشارة الممتعة
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 h-12 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg">
                <Music className="h-5 w-5 mr-2" />
                استمع للأغاني
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Basic Signs Section */}
        <div className="mb-12">
          <SectionHeader 
            title="الإشارات الأساسية للأطفال" 
            description="تعلم الإشارات المهمة بطريقة بسيطة وممتعة" 
            icon={Heart} 
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { word: "مرحباً", emoji: "👋", color: "from-pink-400 to-rose-400" },
              { word: "شكراً", emoji: "🙏", color: "from-blue-400 to-cyan-400" },
              { word: "أحبك", emoji: "❤️", color: "from-red-400 to-pink-400" },
              { word: "أمي", emoji: "👩", color: "from-purple-400 to-indigo-400" },
              { word: "أبي", emoji: "👨", color: "from-green-400 to-emerald-400" },
              { word: "أكل", emoji: "🍎", color: "from-yellow-400 to-orange-400" },
              { word: "ماء", emoji: "💧", color: "from-cyan-400 to-blue-400" },
              { word: "نوم", emoji: "😴", color: "from-indigo-400 to-purple-400" }
            ].map((sign, index) => (
              <Card key={index} className="group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                <CardHeader className="text-center p-4">
                  <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r ${sign.color} flex items-center justify-center text-2xl shadow-lg`}>
                    {sign.emoji}
                  </div>
                  <CardTitle className="text-lg font-bold text-foreground">{sign.word}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <Button className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300 h-10 rounded-lg font-medium transition-all duration-300">
                    <Sparkles className="h-4 w-4 mr-2" />
                    تعلم الإشارة
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Progress Section */}
        <div className="mb-12">
          <Card className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border-purple-200 dark:border-purple-800 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-purple-800 dark:text-purple-200 mb-2">
                إنجازاتك الصغيرة 🌟
              </CardTitle>
              <CardDescription className="text-purple-700 dark:text-purple-300">
                كل إشارة تتعلمها تحصل على نجمة جديدة!
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-8 w-8 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-purple-600 dark:text-purple-400 font-medium">
                لقد تعلمت 5 إشارات! أنت رائع! 🎉
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <Link to="/learning">
            <Button variant="outline" size="lg" className="px-8 py-3 text-lg rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800">
              العودة للتعلم
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
