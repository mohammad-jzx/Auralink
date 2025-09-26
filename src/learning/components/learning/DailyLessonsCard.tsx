"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

export function DailyLessonsCard() {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/learning/daily')
  }

  return (
    <Card 
      className="group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl bg-gradient-to-br from-blue-50/80 to-indigo-50/80 border-blue-200/50 cursor-pointer" 
      onClick={handleClick}
    >
      <CardHeader className="p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-blue-100 rounded-xl shadow-sm">
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-300">
            يومي
          </Badge>
        </div>
        <CardTitle className="text-2xl font-bold text-foreground">الدروس اليومية</CardTitle>
        <CardDescription className="text-muted-foreground text-base">
          تعلم لغة الإشارة من خلال الدروس المختارة يومياً
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8 pt-0">
        <Link to="/learning/daily">
          <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 h-12 px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg">
            استعرض الدروس اليومية
          </button>
        </Link>
      </CardContent>
    </Card>
  )
}
