import React, { useState, useMemo } from 'react';
import VideoCard from '@/components/VideoCard';
import VideoModal from '@/components/VideoModal';
import VideoSessionHeader, { VideoSortOption } from '@/components/VideoSessionHeader';

interface VideoSession {
  id: number;
  category: string;
  title: string;
  speaker: string;
  role: string;
  credits: string;
  url: string;
  embed: string;
}

interface VideoSessionListProps {
  sessions: VideoSession[];
}

const VideoSessionList = ({ sessions }: VideoSessionListProps) => {
  const [selectedVideo, setSelectedVideo] = useState<VideoSession | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<VideoSortOption>('date-recent');

  // Extract unique categories from sessions
  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    sessions.forEach(session => {
      if (session.category) {
        categories.add(session.category);
      }
    });
    return Array.from(categories).sort();
  }, [sessions]);

  // Filter and sort sessions
  const filteredAndSortedSessions = useMemo(() => {
    let filtered = sessions;

    // Apply category filters
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(session => 
        selectedCategories.includes(session.category)
      );
    }

    // Apply sorting
    const sorted = [...filtered];
    switch (sortBy) {
      case 'date-recent':
        // Sort by ID (assuming higher ID = more recent)
        sorted.sort((a, b) => b.id - a.id);
        break;
      case 'popularity':
        // Sort by speaker name as a proxy for popularity (could be enhanced with actual metrics)
        sorted.sort((a, b) => a.speaker.localeCompare(b.speaker));
        break;
      case 'alphabetical':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return sorted;
  }, [sessions, selectedCategories, sortBy]);

  const handleVideoClick = (video: VideoSession) => {
    setSelectedVideo(video);
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
  };

  return (
    <>
      <VideoSessionHeader
        selectedCategories={selectedCategories}
        availableCategories={availableCategories}
        sortBy={sortBy}
        totalResults={filteredAndSortedSessions.length}
        onCategoryChange={setSelectedCategories}
        onSortChange={setSortBy}
        onClearFilters={handleClearFilters}
      />

      {filteredAndSortedSessions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-2">No sessions found</p>
          <p className="text-muted-foreground/70 text-sm mb-4">Try adjusting your filters to see more results.</p>
          <button
            onClick={handleClearFilters}
            className="text-primary hover:text-primary/80 text-sm font-medium"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredAndSortedSessions.map((session) => (
            <VideoCard
              key={session.id}
              session={session}
              onClick={() => handleVideoClick(session)}
            />
          ))}
        </div>
      )}

      <VideoModal
        video={selectedVideo}
        isOpen={!!selectedVideo}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default VideoSessionList;
