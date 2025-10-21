import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';
import { OptimizedImage } from '@/components/OptimizedImage';

interface Course {
  title: string;
  credits: string;
  url: string;
}

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

interface CourseCardProps {
  course: Course;
  courseType?: 'beginner' | 'intermediate';
  courseIndex?: number;
  onClick?: (videoSession: VideoSession) => void;
}

const CourseCard = ({ course, courseType = 'beginner', courseIndex = 0, onClick }: CourseCardProps) => {
  const [imageError, setImageError] = useState(false);

  // Convert Course to VideoSession format for VideoModal compatibility
  const convertToVideoSession = (course: Course, type: string, index: number): VideoSession => {
    // Extract YouTube video ID for embed URL
    const getEmbedUrl = (url: string) => {
      const videoMatch = url.match(/[?&]v=([^&]+)/);
      if (videoMatch) {
        return `https://www.youtube.com/embed/${videoMatch[1]}`;
      }
      // If no video ID found, use the original URL (will be handled by iframe)
      return url.replace('watch?v=', 'embed/').replace('&list=', '?list=');
    };

    return {
      id: index + 1000 + (type === 'intermediate' ? 100 : 0), // Unique ID
      category: type === 'beginner' ? 'Beginner Course' : 'Intermediate Course',
      title: course.title,
      speaker: course.credits,
      role: 'Course Instructor',
      credits: course.credits,
      url: course.url,
      embed: getEmbedUrl(course.url)
    };
  };

  const handleClick = () => {
    if (onClick) {
      const videoSession = convertToVideoSession(course, courseType, courseIndex);
      onClick(videoSession);
    } else {
      window.open(course.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleWatchCourseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Trigger the same modal behavior as clicking the card
    if (onClick) {
      const videoSession = convertToVideoSession(course, courseType, courseIndex);
      onClick(videoSession);
    }
  };

  // Extract YouTube playlist/video thumbnail
  const getPlaylistThumbnail = (url: string) => {
    const playlistMatch = url.match(/[?&]list=([^&]+)/);
    if (playlistMatch) {
      // For playlists, try to extract the first video ID from the URL
      const videoMatch = url.match(/[?&]v=([^&]+)/);
      if (videoMatch) {
        return `https://img.youtube.com/vi/${videoMatch[1]}/hqdefault.jpg`;
      }
      // If no video ID found in playlist URL, return null to show gradient
      return null;
    }

    const videoMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    if (videoMatch) {
      return `https://img.youtube.com/vi/${videoMatch[1]}/hqdefault.jpg`;
    }
    return null;
  };

  const thumbnailUrl = getPlaylistThumbnail(course.url);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Card
      className="bg-card hover:shadow-lg transition-all duration-300 cursor-pointer border border-border overflow-hidden h-full flex flex-col group"
      onClick={handleClick}
    >
      <CardContent className="p-4 sm:p-5 flex flex-col h-full">
        {/* Course Icon and Title */}
        <div className="flex items-start gap-3 sm:gap-4 mb-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-background border-2 border-border flex items-center justify-center flex-shrink-0">
            <PlayCircle className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm sm:text-base leading-tight mb-1 line-clamp-2 group-hover:text-primary transition-colors">
              {course.title}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
              by {course.credits}
            </p>
          </div>
        </div>

        {/* Thumbnail */}
        <div className="aspect-video rounded-lg overflow-hidden mb-3">
          {thumbnailUrl && !imageError ? (
            <OptimizedImage
              src={thumbnailUrl}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onLoad={() => setImageError(false)}
              width={480}
              height={270}
            />
          ) : (
            <div className="w-full h-full stare-gradient flex items-center justify-center">
              <PlayCircle className="w-12 h-12 text-white/80" />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-auto">
          <Button
            onClick={handleWatchCourseClick}
            size="sm"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <span>Watch Course</span>
            <PlayCircle className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;