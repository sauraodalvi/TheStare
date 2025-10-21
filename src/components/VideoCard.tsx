import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, ExternalLink } from 'lucide-react';
import { OptimizedImage } from '@/components/OptimizedImage';

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

interface VideoCardProps {
  session: VideoSession;
  onClick: () => void;
}

const VideoCard = ({ session, onClick }: VideoCardProps) => {

  // Extract YouTube video ID for thumbnail
  const getVideoThumbnail = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId[1]}/hqdefault.jpg`;
    }
    return null;
  };

  const thumbnailUrl = getVideoThumbnail(session.url);

  return (
    <Card
      className="bg-card hover:shadow-lg transition-all duration-300 cursor-pointer border border-border overflow-hidden h-full flex flex-col group"
      onClick={onClick}
    >
      <CardContent className="p-0 flex flex-col h-full">
        {/* Video Thumbnail */}
        <div className="relative aspect-video bg-muted rounded-t-lg overflow-hidden">
          {thumbnailUrl ? (
            <OptimizedImage 
              src={thumbnailUrl} 
              alt={session.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              width={480}
              height={270}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <Play className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          
          {/* Play overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-accent text-accent-foreground rounded-full p-3">
              <Play className="h-6 w-6 fill-current" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 flex flex-col flex-1">
          <div className="flex-1 space-y-3">
            <h3 className="font-semibold text-foreground text-sm sm:text-base leading-tight mb-1 line-clamp-2 group-hover:text-primary transition-colors">
              {session.title}
            </h3>
            
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-medium text-foreground">
                {session.speaker}
              </p>
              <p className="text-xs text-muted-foreground">
                {session.role}
              </p>
            </div>
          </div>
          
          <div className="mt-4">
            <Button
              size="sm"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Play className="h-3 w-3 mr-1" />
              Watch
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;