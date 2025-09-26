import { Database, Search, Video } from "lucide-react"
import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { DictionaryCard } from "../../components/learning/DictionaryCard"
import { SectionHeader } from "../../components/learning/SectionHeader"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { dictionary } from "../../data/learningDummy"

export default function DictionaryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("الكل")
  const [selectedLang, setSelectedLang] = useState<string>("JSL")

  // Get unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(dictionary.map(item => item.category)))
    return ["الكل", ...cats]
  }, [])

  // Filter dictionary items
  const filteredItems = useMemo(() => {
    return dictionary.filter(item => {
      const matchesSearch = searchTerm === "" || 
        item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = selectedCategory === "الكل" || item.category === selectedCategory
      const matchesLang = item.lang === selectedLang
      
      return matchesSearch && matchesCategory && matchesLang
    })
  }, [searchTerm, selectedCategory, selectedLang])

  // Count items for each language
  const jslCount = dictionary.filter(item => item.lang === "JSL").length
  const aslCount = dictionary.filter(item => item.lang === "ASL").length

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <SectionHeader 
        title="القاموس المرئي" 
        description="تعلم لغة الإشارة الأمريكية والأردنية من خلال الفيديوهات التوضيحية" 
        icon={Video}
      />

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="ابحث عن كلمة أو وصف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10 text-right"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="transition-all duration-200 hover:scale-105"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Language Tabs - تصميم احترافي */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="bg-muted/30 rounded-lg p-1 backdrop-blur-sm border border-border/50">
            <Tabs value={selectedLang} onValueChange={setSelectedLang} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-transparent p-1 h-12">
                <TabsTrigger 
                  value="JSL" 
                  className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:text-foreground transition-all duration-300 rounded-md px-4 py-2"
                  disabled={jslCount === 0}
                >
                  <span className="font-medium">JSL</span>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs px-2 py-1 transition-all duration-300 ${
                      selectedLang === "JSL" 
                        ? "bg-blue-500 text-white shadow-md" 
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {jslCount}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger 
                  value="ASL" 
                  className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:text-foreground transition-all duration-300 rounded-md px-4 py-2"
                >
                  <span className="font-medium">ASL</span>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs px-2 py-1 transition-all duration-300 ${
                      selectedLang === "ASL" 
                        ? "bg-gray-500 text-white shadow-md" 
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {aslCount}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Results Count & Admin */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">
          تم العثور على {filteredItems.length} نتيجة
          {searchTerm && ` لـ "${searchTerm}"`}
          {` في ${selectedLang}`}
        </p>
        
        <Link to="/learning/admin/seed">
          <Button 
            size="sm" 
            variant="outline"
            className="flex items-center gap-2"
          >
            <Database className="h-4 w-4" />
            <span className="text-xs">Admin</span>
          </Button>
        </Link>
      </div>

      {/* Dictionary Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <DictionaryCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">لا توجد نتائج</h3>
          <p className="text-muted-foreground">
            {selectedLang === "ASL" 
              ? "لا توجد فيديوهات ASL متاحة حالياً. سيتم إضافتها قريباً."
              : "جرب تغيير كلمات البحث أو الفلاتر"
            }
          </p>
        </div>
      )}
    </div>
  )
}
