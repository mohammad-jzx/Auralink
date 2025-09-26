import React, { useEffect, useState } from 'react';
import { YouTubePlaylist, YT_PLAYLISTS } from '../../data/youtubePlaylists';
import {
    getCachedValid,
    PlaylistBrief,
    PlaylistItem,
    setCached
} from '../../services/youtube';
import { SkeletonCard } from '../ui/Skeleton';
import { PlayerModal } from './PlayerModal';
import { PlaylistCard } from './PlaylistCard';

export const Stories: React.FC = () => {
  const [briefs, setBriefs] = useState<Record<string, PlaylistBrief>>({});
  const [loading, setLoading] = useState(true);
  const [selectedPlaylist, setSelectedPlaylist] = useState<{
    playlist: YouTubePlaylist;
    items: PlaylistItem[];
    title: string;
  } | null>(null);
  const [loadingItems, setLoadingItems] = useState(false);

  // Load playlist briefs on mount (enhancement only)
  useEffect(() => {
    const loadBriefs = async () => {
      setLoading(true);
      
      // Load from cache first
      YT_PLAYLISTS.forEach(playlist => {
        const cached = getCachedValid<PlaylistBrief>(`brief:${playlist.id}`);
        if (cached) {
          setBriefs(prev => ({ ...prev, [playlist.id]: cached }));
        }
      });

      // Fetch fresh data for each playlist
      YT_PLAYLISTS.forEach(async (playlist) => {
        try {
          const response = await fetch(`/api/yt/playlist/${playlist.id}/brief`);
          if (response.status === 200) {
            const data = await response.json() as PlaylistBrief;
            setBriefs(prev => ({ ...prev, [playlist.id]: data }));
            setCached(`brief:${playlist.id}`, data);
          }
        } catch (error) {
          console.warn("YT brief failed", playlist.id, error);
        }
      });

      setLoading(false);
    };

    loadBriefs();
  }, []);

  const handlePlaylistClick = async (playlist: YouTubePlaylist) => {
    setLoadingItems(true);
    
    try {
      const response = await fetch(`/api/yt/playlist/${playlist.id}/items`);
      if (response.status === 200) {
        const data = await response.json();
        if (Array.isArray(data.items) && data.items.length > 0) {
          // Items mode - show video list with navigation
          setSelectedPlaylist({
            playlist,
            items: data.items,
            title: briefs[playlist.id]?.title || playlist.title
          });
        } else {
          // Fallback to playlist mode
          setSelectedPlaylist({
            playlist,
            items: [],
            title: briefs[playlist.id]?.title || playlist.title
          });
        }
      } else {
        // 204 or error - fallback to playlist mode
        setSelectedPlaylist({
          playlist,
          items: [],
          title: briefs[playlist.id]?.title || playlist.title
        });
      }
    } catch (error) {
      console.warn("Failed to load playlist items:", error);
      // Fallback to playlist mode
      setSelectedPlaylist({
        playlist,
        items: [],
        title: briefs[playlist.id]?.title || playlist.title
      });
    } finally {
      setLoadingItems(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedPlaylist(null);
  };

  const handleResume = (playlistId: string, index: number, time: number) => {
    console.log('Resuming from:', { playlistId, index, time });
    // This would be handled by the player component
  };

  return (
    <section dir="rtl" lang="ar" aria-labelledby="storiesHeading" className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 id="storiesHeading" className="text-2xl font-bold text-gray-900 mb-2">
          قصصي التعليمية
        </h2>
        <p className="text-gray-600">اختر قصة واستمتع بالتعلم</p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {YT_PLAYLISTS.map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        /* Always show playlist cards from YT_PLAYLISTS */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {YT_PLAYLISTS.map((playlist, index) => {
            const brief = briefs[playlist.id];
            const isCurrentlyLoading = loadingItems && selectedPlaylist?.playlist.id === playlist.id;
            
            return (
              <PlaylistCard
                key={playlist.id}
                title={brief?.title || playlist.title}
                subtitle={brief?.count ? `${brief.count} فيديو` : undefined}
                count={brief?.count}
                thumbUrl={brief?.thumbUrl || playlist.coverFallback}
                onOpen={() => handlePlaylistClick(playlist)}
                accent={index % 2 === 0 ? 'green' : 'blue'}
                loading={isCurrentlyLoading}
              />
            );
          })}
        </div>
      )}

      {/* Player Modal */}
      {selectedPlaylist && (
        <PlayerModal
          open={!!selectedPlaylist}
          onClose={handleCloseModal}
          mode={selectedPlaylist.items.length > 0 ? 'items' : 'playlist'}
          playlistId={selectedPlaylist.playlist.id}
          playlistTitle={selectedPlaylist.title}
          items={selectedPlaylist.items}
          onResume={handleResume}
        />
      )}
    </section>
  );
};