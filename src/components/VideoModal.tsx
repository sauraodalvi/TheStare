import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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

interface VideoModalProps {
  video: VideoSession | null;
  isOpen: boolean;
  onClose: () => void;
}

const VideoModal = ({ video, isOpen, onClose }: VideoModalProps) => {
  if (!video) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0 bg-background">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-semibold text-foreground pr-8">
            {video.title}
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            {video.credits}
          </p>
        </DialogHeader>
        
        <div className="px-6 pb-6">
          <div className="aspect-video rounded-lg overflow-hidden bg-muted">
            <iframe
              src={video.embed}
              title={video.title}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;