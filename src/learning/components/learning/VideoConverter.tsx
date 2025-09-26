"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DictItem } from "@/data/learningDummy"
import { useToast } from "@/hooks/use-toast"
import { AlertTriangle, CheckCircle, Download, FileVideo, Upload } from "lucide-react"
import { useState } from "react"

interface VideoConverterProps {
  item: DictItem
}

export function VideoConverter({ item }: VideoConverterProps) {
  const [conversionStatus, setConversionStatus] = useState<'idle' | 'converting' | 'success' | 'error'>('idle')
  const { toast } = useToast()

  const handleConvertVideo = async () => {
    setConversionStatus('converting')
    
    // Simulate conversion process
    setTimeout(() => {
      setConversionStatus('success')
      toast({
        title: "تم التحويل بنجاح",
        description: `تم تحويل "${item.term}" إلى صيغة MP4`,
      })
    }, 3000)
  }

  const handleDownloadOriginal = () => {
    const link = document.createElement('a')
    link.href = item.videoUrl
    link.download = `${item.term}.mov`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast({
      title: "بدء التحميل",
      description: `جاري تحميل "${item.term}" بصيغة MOV`,
    })
  }

  const handleDownloadConverted = () => {
    // This would download the converted video
    toast({
      title: "تحميل الفيديو المحول",
      description: `جاري تحميل "${item.term}" بصيغة MP4`,
    })
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
        {/* Video Format Info */}
        <div className="mb-4 p-4 bg-muted/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FileVideo className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">معلومات الفيديو</span>
          </div>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>الصيغة الحالية: <span className="font-mono">.MOV</span></p>
            <p>الحالة: <span className="text-orange-500">غير مدعوم في المتصفح</span></p>
            <p>الحل: تحويل إلى MP4 أو تحميل الملف الأصلي</p>
          </div>
        </div>

        {/* Conversion Status */}
        {conversionStatus !== 'idle' && (
          <div className="mb-4 p-3 rounded-lg border">
            {conversionStatus === 'converting' && (
              <div className="flex items-center gap-2 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm">جاري التحويل...</span>
              </div>
            )}
            {conversionStatus === 'success' && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">تم التحويل بنجاح!</span>
              </div>
            )}
            {conversionStatus === 'error' && (
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">فشل في التحويل</span>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={handleConvertVideo}
            disabled={conversionStatus === 'converting'}
          >
            <Upload className="h-4 w-4 mr-2" />
            تحويل إلى MP4
          </Button>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={handleDownloadOriginal}
            >
              <Download className="h-4 w-4 mr-2" />
              تحميل MOV
            </Button>
            
            {conversionStatus === 'success' && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={handleDownloadConverted}
              >
                <Download className="h-4 w-4 mr-2" />
                تحميل MP4
              </Button>
            )}
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-800">
            💡 <strong>نصيحة:</strong> ملفات .MOV لا تعمل في المتصفحات. 
            استخدم "تحويل إلى MP4" أو "تحميل MOV" لفتحها على جهازك.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

