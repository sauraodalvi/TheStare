import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, ExternalLink } from 'lucide-react';

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
  const handleExternalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(session.url, '_blank', 'noopener,noreferrer');
  };

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
      className="h-full flex flex-col bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-border group cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-0 flex flex-col h-full">
        {/* Video Thumbnail */}
        <div className="relative aspect-video bg-muted rounded-t-lg overflow-hidden">
          {thumbnailUrl ? (
            <img 
              src={thumbnailUrl} 
              alt={session.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
        <div className="p-6 flex flex-col flex-1">
          <div className="flex-1 space-y-3">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors leading-tight line-clamp-2">
              {session.title}
            </h3>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                {session.speaker}
              </p>
              <p className="text-xs text-muted-foreground">
                {session.role}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button
              size="sm"
              className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Play className="h-4 w-4 mr-2" />
              Watch
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleExternalClick}
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;