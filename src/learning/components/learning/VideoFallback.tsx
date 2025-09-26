"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DictItem } from "@/data/learningDummy"
import { useToast } from "@/hooks/use-toast"
import { Copy, Image, Play, Volume2 } from "lucide-react"
import { useState } from "react"

interface VideoFallbackProps {
  item: DictItem
}

export function VideoFallback({ item }: VideoFallbackProps) {
  const [showImage, setShowImage] = useState(false)
  const { toast } = useToast()

  const handleTTS = () => {
    toast({
      title: "قراءة صوتية",
      description: `سيتم قراءة "${item.term}" صوتياً قريباً`,
    })
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(item.term)
    toast({
      title: "تم النسخ",
      description: `تم نسخ "${item.term}" إلى الحافظة`,
    })
  }

  const toggleImage = () => {
    setShowImage(!showImage)
  }

  return (
    <Card className="group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
      <CardHeader className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-foreground mb-2">
              {item.term}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mb-3">
              {item.description}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30">
            {item.lang}
          </Badge>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline" className="text-xs">
            {item.category}
          </Badge>
          {item.tags.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        {/* Image/Placeholder Section */}
        <div className="relative mb-4 rounded-lg overflow-hidden bg-muted/20 aspect-video">
          {showImage ? (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
              <div className="text-center p-4">
                <Image className="h-16 w-16 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  صورة توضيحية لـ "{item.term}"
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  في لغة الإشارة الأردنية
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted/20 to-muted/30">
              <div className="text-center p-4">
                <Play className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  اضغط لعرض الصورة التوضيحية
                </p>
              </div>
            </div>
          )}
          
          {/* Toggle Button */}
          <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 text-black hover:bg-white"
              onClick={toggleImage}
            >
              <Image className="h-4 w-4 mr-2" />
              {showImage ? "إخفاء" : "عرض"}
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={handleTTS}
          >
            <Volume2 className="h-4 w-4 mr-2" />
            قراءة صوتية
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

