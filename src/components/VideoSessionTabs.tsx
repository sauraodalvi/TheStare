import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VideoCard from '@/components/VideoCard';
import VideoModal from '@/components/VideoModal';

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

interface VideoSessionTabsProps {
  sessions: VideoSession[];
}

const VideoSessionTabs = ({ sessions }: VideoSessionTabsProps) => {
  const [selectedVideo, setSelectedVideo] = useState<VideoSession | null>(null);

  // Group sessions by category
  const groupedSessions = sessions.reduce((acc, session) => {
    if (!acc[session.category]) {
      acc[session.category] = [];
    }
    acc[session.category].push(session);
    return acc;
  }, {} as Record<string, VideoSession[]>);

  const categories = Object.keys(groupedSessions).sort();

  const handleVideoClick = (video: VideoSession) => {
    setSelectedVideo(video);
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
  };

  return (
    <>
      <Tabs defaultValue={categories[0]} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 mb-8 bg-muted p-1">
          {categories.map((category) => (
            <TabsTrigger 
              key={category} 
              value={category}
              className="text-xs md:text-sm whitespace-nowrap px-2 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedSessions[category].map((session) => (
                <VideoCard
                  key={session.id}
                  session={session}
                  onClick={() => handleVideoClick(session)}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <VideoModal
        video={selectedVideo}
        isOpen={!!selectedVideo}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default VideoSessionTabs;