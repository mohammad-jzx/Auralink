"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DictItem } from "@/data/learningDummy"
import { useToast } from "@/hooks/use-toast"
import { Copy, Image as ImageIcon, Maximize2, Pause, Play, RotateCcw, Video as VideoIcon, Volume2 as VolumeIcon, VolumeX } from "lucide-react"
import { useRef, useState } from "react"

interface DictionaryCardProps {
  item: DictItem
}

export function DictionaryCard({ item }: DictionaryCardProps) {
  const { toast } = useToast()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const expandedVideoRef = useRef<HTMLVideoElement>(null)

  // Check if the media is a video, image, or YouTube
  const isVideo = item.videoUrl && item.videoUrl.match(/\.(mp4|webm|ogg|mov)$/i)
  const isImage = item.videoUrl && item.videoUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)
  const isYouTube = item.video?.provider === 'youtube'

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

  const handleImageLoad = () => {
    setImageLoaded(true)
    setImageError(false)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoaded(false)
  }

  const togglePlay = () => {
    if (videoRef.current && isVideo) {
      if (isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      } else {
        videoRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const toggleMute = () => {
    if (videoRef.current && isVideo) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const restart = () => {
    if (videoRef.current && isVideo) {
      videoRef.current.currentTime = 0
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleExpand = () => {
    setIsExpanded(true)
    // Sync video state with expanded video
    if (expandedVideoRef.current && videoRef.current) {
      expandedVideoRef.current.currentTime = videoRef.current.currentTime
      expandedVideoRef.current.muted = videoRef.current.muted
      if (isPlaying) {
        expandedVideoRef.current.play()
      }
    }
  }

  const handleCloseExpanded = () => {
    setIsExpanded(false)
    // Sync back to main video
    if (expandedVideoRef.current && videoRef.current) {
      videoRef.current.currentTime = expandedVideoRef.current.currentTime
      videoRef.current.muted = expandedVideoRef.current.muted
      if (!expandedVideoRef.current.paused) {
        videoRef.current.play()
        setIsPlaying(true)
      } else {
        videoRef.current.pause()
        setIsPlaying(false)
      }
    }
  }

  // Generate YouTube embed URL
  const getYouTubeEmbedUrl = () => {
    if (!isYouTube || !item.video?.videoId) return '';
    
    let url = `https://www.youtube.com/embed/${item.video.videoId}?`;
    
    // Add start time if available
    if (item.video.startSec !== undefined) {
      url += `start=${item.video.startSec}`;
    }
    
    // Add end time if available
    if (item.video.endSec !== undefined) {
      url += `&end=${item.video.endSec}`;
    }
    
    // Add additional parameters
    url += '&autoplay=1&modestbranding=1&rel=0';
    
    return url;
  };
  
  // Get YouTube thumbnail URL with timestamp
  const getYouTubeThumbnailUrl = () => {
    if (!isYouTube || !item.video?.videoId) return '';
    
    // Try to get thumbnail from the middle of the clip if startSec and endSec are defined
    const startSec = item.video.startSec || 0;
    const endSec = item.video.endSec;
    
    // If we have both start and end, get thumbnail from the middle point
    const timestamp = endSec ? Math.floor(startSec + ((endSec - startSec) / 2)) : startSec;
    
    // Return the URL with timestamp
    return `https://img.youtube.com/vi/${item.video.videoId}/maxresdefault.jpg`;
  };

  const renderMedia = () => {
    // Show error state if video failed to load
    if (imageError && isVideo) {
      return (
        <div className="mb-4 relative">
          <div className="w-full aspect-video bg-muted/20 rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <div className="text-4xl mb-2">⚠️</div>
              <p className="text-sm">فيديو غير متاح</p>
              <p className="text-xs mt-1">الملف: {item.videoUrl}</p>
            </div>
          </div>
        </div>
      );
    }
    
    if (isYouTube) {
      // YouTube embed
      return (
        <div className="mb-4 relative group/youtube cursor-pointer" onClick={handleExpand}>
          <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
            {/* Thumbnail with play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <img 
                src={getYouTubeThumbnailUrl()}
                alt={item.term}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to hqdefault if maxresdefault is not available
                  (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${item.video?.videoId}/hqdefault.jpg`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10 flex items-center justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-red-600 hover:bg-red-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg"
                >
                  <Play className="h-8 w-8" />
                </Button>
              </div>
            </div>
            
            {/* Expand Hint */}
            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
              <Maximize2 className="h-3 w-3" />
              اضغط للتوسيع
            </div>
            
            {/* Media Type Badge */}
            <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
              <VideoIcon className="h-3 w-3" />
              <span className="text-xs">فيديو</span>
            </div>
            
            {/* Timestamp Badge */}
            {item.video?.startSec !== undefined && (
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {Math.floor(item.video.startSec / 60)}:{(item.video.startSec % 60).toString().padStart(2, '0')}
              </div>
            )}
          </div>
        </div>
      );
    } else if (isVideo) {
      return (
        <div 
          className="mb-4 relative group/video cursor-pointer"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
          onClick={handleExpand}
        >
          <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              src={item.videoUrl}
              className="w-full h-full object-cover"
              preload="metadata"
              muted={isMuted}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              onError={(e) => {
                console.error('Video error:', e);
                setImageError(true);
              }}
              controls={false}
            />
            
            {/* Video Controls Overlay */}
            {showControls && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/90 text-black hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay();
                    }}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/90 text-black hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMute();
                    }}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4 text-red-500" /> : <VolumeIcon className="h-4 w-4" />}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/90 text-black hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      restart();
                    }}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>

                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/90 text-black hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExpand();
                    }}
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Play Button (when not playing) */}
            {!isPlaying && !showControls && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white/90 text-black hover:bg-white opacity-0 group-hover/video:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                  }}
                >
                  <Play className="h-6 w-6" />
                </Button>
              </div>
            )}

            {/* Expand Hint */}
            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
              <Maximize2 className="h-3 w-3" />
              اضغط للتوسيع
            </div>

            {/* Media Type Badge */}
            <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
              <VideoIcon className="h-3 w-3" />
              فيديو
            </div>
          </div>
        </div>
      );
    } else if (isImage) {
      return (
        <div className="mb-4 relative group/image cursor-pointer" onClick={handleExpand}>
          <img
            src={item.videoUrl}
            alt={item.term}
            className="w-full h-full object-cover rounded-lg aspect-video"
          />
          
          {/* Image Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/10 transition-all duration-300 rounded-lg" />
          
          {/* Expand Hint */}
          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <Maximize2 className="h-3 w-3" />
            اضغط للتوسيع
          </div>
          
          {/* Media Type Badge */}
          <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <ImageIcon className="h-3 w-3" />
            صورة
          </div>
        </div>
      );
    } else {
      // Fallback for unknown media types
      return (
        <div className="mb-4 relative">
          <div className="w-full aspect-video bg-muted/20 rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <div className="text-4xl mb-2">📁</div>
              <p className="text-sm">نوع الملف غير مدعوم</p>
              <p className="text-xs mt-1">{item.videoUrl || (item.video?.videoId ? `فيديو: ${item.video.videoId}` : 'لا توجد وسائط متاحة')}</p>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <>
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
          {/* Media Renderer */}
          {renderMedia()}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={handleTTS}
            >
              <VolumeIcon className="h-4 w-4 mr-2" />
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

      {/* Expanded Video/Image Dialog */}
      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="max-w-4xl w-full h-full max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-center">{item.term}</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 flex items-center justify-center">
            {isYouTube ? (
              <div className="relative w-full h-full">
                <iframe
                  src={getYouTubeEmbedUrl()}
                  className="w-full aspect-video rounded-lg shadow-xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={item.term}
                ></iframe>
                <div className="absolute bottom-4 left-4 bg-black/70 text-white text-sm px-3 py-1.5 rounded-full">
                  {item.term}
                </div>
              </div>
            ) : isVideo ? (
              <div className="relative w-full h-full">
                <video
                  ref={expandedVideoRef}
                  src={item.videoUrl}
                  className="w-full h-full object-contain rounded-lg shadow-xl"
                  controls
                  autoPlay={isPlaying}
                  muted={isMuted}
                  onError={(e) => {
                    console.error('Expanded video error:', e);
                  }}
                />
                <div className="absolute bottom-4 left-4 bg-black/70 text-white text-sm px-3 py-1.5 rounded-full">
                  {item.term}
                </div>
              </div>
            ) : isImage ? (
              <div className="relative w-full h-full">
                <img
                  src={item.videoUrl}
                  alt={item.term}
                  className="w-full h-full object-contain rounded-lg shadow-xl"
                />
                <div className="absolute bottom-4 left-4 bg-black/70 text-white text-sm px-3 py-1.5 rounded-full">
                  {item.term}
                </div>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}