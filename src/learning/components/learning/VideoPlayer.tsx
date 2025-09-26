"use client"

import { Button } from "@/components/ui/button"
import { Maximize2, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface VideoPlayerProps {
  src: string
  className?: string
  poster?: string
  autoPlay?: boolean
  loop?: boolean
}

export function VideoPlayer({ 
  src, 
  className = "", 
  poster = "/placeholder.jpg",
  autoPlay = false,
  loop = false 
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => setCurrentTime(video.currentTime)
    const handleLoadedMetadata = () => setDuration(video.duration)
    const handleEnded = () => setIsPlaying(false)

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('ended', handleEnded)
    }
  }, [])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const restart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play()
      setIsPlaying(true)
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

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && videoRef.current) {
      const rect = progressRef.current.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const percentage = clickX / rect.width
      videoRef.current.currentTime = percentage * duration
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
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
        autoPlay={autoPlay}
        loop={loop}
        muted={isMuted}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Progress Bar */}
      <div 
        ref={progressRef}
        className="absolute bottom-0 left-0 right-0 h-1 bg-black/30 cursor-pointer"
        onClick={handleProgressClick}
      >
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
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 text-black hover:bg-white"
              onClick={toggleMute}
            >
              {isMuted ? <VolumeX className="h-4 w-4 text-red-500" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 text-black hover:bg-white"
              onClick={restart}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 text-black hover:bg-white"
              onClick={toggleFullscreen}
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
