"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, Download, Maximize2, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface ChromeVideoPlayerProps {
  src: string
  title: string
  className?: string
  poster?: string
}

export function ChromeVideoPlayer({ src, title, className = "", poster = "/placeholder.jpg" }: ChromeVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => setCurrentTime(video.currentTime)
    const handleLoadedMetadata = () => setDuration(video.duration)
    const handleEnded = () => setIsPlaying(false)
    const handleError = () => setHasError(true)
    const handleLoadStart = () => setIsLoading(true)
    const handleCanPlay = () => setIsLoading(false)

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('error', handleError)
    video.addEventListener('loadstart', handleLoadStart)
    video.addEventListener('canplay', handleCanPlay)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('error', handleError)
      video.removeEventListener('loadstart', handleLoadStart)
      video.removeEventListener('canplay', handleCanPlay)
    }
  }, [])

  const togglePlay = async () => {
    if (videoRef.current && !hasError) {
      try {
        setIsLoading(true)
        
        if (isPlaying) {
          videoRef.current.pause()
          setIsPlaying(false)
          setIsLoading(false)
        } else {
          // Try to play the video
          const playPromise = videoRef.current.play()
          
          if (playPromise !== undefined) {
            await playPromise
            setIsPlaying(true)
            setIsLoading(false)
            toast({
              title: "تم تشغيل الفيديو",
              description: `جاري تشغيل "${title}"`,
            })
          }
        }
      } catch (error) {
        console.error("Error playing video:", error)
        setHasError(true)
        setIsLoading(false)
        toast({
          title: "خطأ في تشغيل الفيديو",
          description: "لا يمكن تشغيل هذا الفيديو. يرجى تحميله أو استخدام الوضع البديل.",
          variant: "destructive"
        })
      }
    }
  }

  const toggleMute = () => {
    if (videoRef.current && !hasError) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const restart = async () => {
    if (videoRef.current && !hasError) {
      try {
        setIsLoading(true)
        videoRef.current.currentTime = 0
        const playPromise = videoRef.current.play()
        if (playPromise !== undefined) {
          await playPromise
          setIsPlaying(true)
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Error restarting video:", error)
        setIsLoading(false)
      }
    }
  }

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        videoRef.current.requestFullscreen()
      }
    }
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = src
    link.download = `${title}.mov`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast({
      title: "بدء التحميل",
      description: `جاري تحميل "${title}"`,
    })
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (hasError) {
    return (
      <div className={`relative rounded-lg overflow-hidden bg-muted/20 aspect-video ${className}`}>
        <div className="w-full h-full flex flex-col items-center justify-center bg-muted/30 text-center p-4">
          <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
          <p className="text-sm text-muted-foreground mb-2">
            لا يمكن تشغيل هذا الفيديو في Chrome
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            ملفات .mov غير مدعومة في هذا المتصفح
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleDownload}
              className="bg-primary/10 text-primary border-primary/30"
            >
              <Download className="h-4 w-4 mr-2" />
              تحميل الفيديو
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`relative group ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover rounded-lg"
        preload="metadata"
        muted={isMuted}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        crossOrigin="anonymous"
        controls={false}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p className="text-sm">جاري التحميل...</p>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
        <div 
          className="h-full bg-primary transition-all duration-100"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
      </div>

      {/* Controls Overlay */}
      {showControls && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 text-black hover:bg-white"
              onClick={togglePlay}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
              ) : isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 text-black hover:bg-white"
              onClick={toggleMute}
              disabled={isLoading}
            >
              {isMuted ? <VolumeX className="h-4 w-4 text-red-500" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 text-black hover:bg-white"
              onClick={restart}
              disabled={isLoading}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 text-black hover:bg-white"
              onClick={toggleFullscreen}
              disabled={isLoading}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Time Display */}
      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>
  )
}

