"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { List, X } from "lucide-react"
import { useEffect, useState } from "react"

interface PlaylistVideo {
  id: number
  title: string
  thumbnail: string
  duration: string
}

interface PlaylistVideosDrawerProps {
  playlistId: string
  currentVideoIndex?: number
  onVideoSelect?: (index: number) => void
}

// Mock data for videos in playlist
const mockPlaylistVideos: Record<string, PlaylistVideo[]> = {
  // JSL Playlist
  "PLnfudGWrboXyULqw4sO4W8Y0l9sUfnDmx": [
    {
      id: 1,
      title: "الدرس الأول - أساسيات لغة الإشارة الأردنية",
      thumbnail: "https://img.youtube.com/vi/wZwZ--J_eQQ/mqdefault.jpg",
      duration: "5:30"
    },
    {
      id: 2,
      title: "الدرس الثاني - التحيات بلغة الإشارة الأردنية",
      thumbnail: "https://img.youtube.com/vi/videoId2/mqdefault.jpg",
      duration: "6:15"
    },
    {
      id: 3,
      title: "الدرس الثالث - الأرقام بلغة الإشارة الأردنية",
      thumbnail: "https://img.youtube.com/vi/videoId3/mqdefault.jpg",
      duration: "4:45"
    },
    {
      id: 4,
      title: "الدرس الرابع - الألوان بلغة الإشارة الأردنية",
      thumbnail: "https://img.youtube.com/vi/videoId4/mqdefault.jpg",
      duration: "5:20"
    },
    {
      id: 5,
      title: "الدرس الخامس - العائلة بلغة الإشارة الأردنية",
      thumbnail: "https://img.youtube.com/vi/videoId5/mqdefault.jpg",
      duration: "7:10"
    }
  ],
  "PLMN7QCuj6dfaO7v-Oqkg3Bjq0XOT3c07X": [
    {
      id: 1,
      title: "How to Sign Numbers in ASL | Ultimate Guide",
      thumbnail: "https://img.youtube.com/vi/videoId1/mqdefault.jpg",
      duration: "5:43"
    },
    {
      id: 2,
      title: "Learn How to Sign Money in ASL | Number Signs",
      thumbnail: "https://img.youtube.com/vi/videoId2/mqdefault.jpg",
      duration: "6:21"
    },
    {
      id: 3,
      title: "How to Sign Time in ASL | Number Series",
      thumbnail: "https://img.youtube.com/vi/videoId3/mqdefault.jpg",
      duration: "4:55"
    },
    {
      id: 4,
      title: "How to Sign Age in ASL | Numbers in American Sign Language",
      thumbnail: "https://img.youtube.com/vi/videoId4/mqdefault.jpg",
      duration: "7:12"
    },
    {
      id: 5,
      title: "Incorporating Numbers Into Signs | ASL | Rule of 9",
      thumbnail: "https://img.youtube.com/vi/videoId5/mqdefault.jpg",
      duration: "8:30"
    }
  ],
  "PLMN7QCuj6dfYD8DfG1rN6rEo1b1RyvgKF": [
    {
      id: 1,
      title: "ASL Basics - Introduction to American Sign Language",
      thumbnail: "https://img.youtube.com/vi/videoId6/mqdefault.jpg",
      duration: "6:15"
    },
    {
      id: 2,
      title: "ASL Basics - Greetings and Introductions",
      thumbnail: "https://img.youtube.com/vi/videoId7/mqdefault.jpg",
      duration: "5:48"
    },
    {
      id: 3,
      title: "ASL Basics - Common Phrases You Need to Know",
      thumbnail: "https://img.youtube.com/vi/videoId8/mqdefault.jpg",
      duration: "7:22"
    },
    {
      id: 4,
      title: "ASL Basics - Questions and Answers",
      thumbnail: "https://img.youtube.com/vi/videoId9/mqdefault.jpg",
      duration: "6:54"
    },
    {
      id: 5,
      title: "ASL Basics - Everyday Vocabulary",
      thumbnail: "https://img.youtube.com/vi/videoId10/mqdefault.jpg",
      duration: "8:10"
    },
    {
      id: 6,
      title: "ASL Basics - Practice Conversation",
      thumbnail: "https://img.youtube.com/vi/videoId11/mqdefault.jpg",
      duration: "9:25"
    }
  ],
  "PLMN7QCuj6dfZZIfLeSwBWJEv8mL4TgBKh": [
    {
      id: 1,
      title: "ASL Professions - Medical Field Signs",
      thumbnail: "https://img.youtube.com/vi/videoId12/mqdefault.jpg",
      duration: "7:30"
    },
    {
      id: 2,
      title: "ASL Professions - Education Field Signs",
      thumbnail: "https://img.youtube.com/vi/videoId13/mqdefault.jpg",
      duration: "6:45"
    },
    {
      id: 3,
      title: "ASL Professions - Business and Office Signs",
      thumbnail: "https://img.youtube.com/vi/videoId14/mqdefault.jpg",
      duration: "8:20"
    },
    {
      id: 4,
      title: "ASL Professions - Technology Field Signs",
      thumbnail: "https://img.youtube.com/vi/videoId15/mqdefault.jpg",
      duration: "7:15"
    },
    {
      id: 5,
      title: "ASL Professions - Service Industry Signs",
      thumbnail: "https://img.youtube.com/vi/videoId16/mqdefault.jpg",
      duration: "6:50"
    },
    {
      id: 6,
      title: "ASL Professions - Arts and Entertainment Signs",
      thumbnail: "https://img.youtube.com/vi/videoId17/mqdefault.jpg",
      duration: "7:40"
    },
    {
      id: 7,
      title: "ASL Professions - Government and Law Signs",
      thumbnail: "https://img.youtube.com/vi/videoId18/mqdefault.jpg",
      duration: "8:10"
    },
    {
      id: 8,
      title: "ASL Professions - Practice and Review",
      thumbnail: "https://img.youtube.com/vi/videoId19/mqdefault.jpg",
      duration: "9:30"
    }
  ]
}

export function PlaylistVideosDrawer({ playlistId, currentVideoIndex = 1, onVideoSelect }: PlaylistVideosDrawerProps) {
  const [videos, setVideos] = useState<PlaylistVideo[]>([])
  const [isOpen, setIsOpen] = useState(false)
  
  useEffect(() => {
    // In a real app, this would fetch the videos from YouTube API
    setVideos(mockPlaylistVideos[playlistId] || [])
  }, [playlistId])

  const handleVideoClick = (index: number) => {
    if (onVideoSelect) {
      onVideoSelect(index)
    }
    setIsOpen(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <List className="h-4 w-4" />
          <span>قائمة الفيديوهات</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[350px] sm:w-[450px] p-0">
        <SheetHeader className="p-4 border-b sticky top-0 bg-background z-10">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg">قائمة الفيديوهات</SheetTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>
        
        <div className="overflow-y-auto max-h-[calc(100vh-80px)] p-2">
          {videos.map((video, index) => (
            <Card 
              key={video.id}
              className={`mb-2 hover:bg-accent/10 transition-colors cursor-pointer ${
                index + 1 === currentVideoIndex ? 'border-primary bg-primary/5' : ''
              }`}
              onClick={() => handleVideoClick(index + 1)}
            >
              <CardContent className="p-3">
                <div className="flex gap-3">
                  <div className="relative w-24 h-16 flex-shrink-0">
                    <div className="absolute inset-0 bg-black/5 rounded-md overflow-hidden">
                      <div className="w-full h-full relative">
                        {/* Placeholder for video thumbnail */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30 flex items-center justify-center">
                          <span className="text-xs text-white bg-black/70 px-1 rounded absolute bottom-1 right-1">
                            {video.duration}
                          </span>
                        </div>
                        <div className="w-full h-full flex items-center justify-center bg-black/10 text-xs text-white">
                          {index + 1}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="text-sm font-medium line-clamp-2">
                        {video.title}
                      </div>
                      <div className="text-xs text-muted-foreground font-bold bg-muted px-1.5 py-0.5 rounded-full">
                        {index + 1}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Learn How to Sign
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
