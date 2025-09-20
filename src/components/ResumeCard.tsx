import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';

interface Resume {
  id: string;
  name: string;
  designation: string;
  company: string;
  companyLogo: string;
  profileImage: string;
  resumeLink: string;
  previewEmbed: string;
  referenceLink: string;
  source: string;
  featured: boolean;
}

interface ResumeCardProps {
  resume: Resume;
  onPreview: () => void;
}

const ResumeCard: React.FC<ResumeCardProps> = ({ resume, onPreview }) => {
  return (
    <Card className="bg-card hover:shadow-lg transition-all duration-300 cursor-pointer border border-border overflow-hidden h-full flex flex-col group" onClick={onPreview}>
      <CardContent className="p-4 sm:p-5 flex flex-col h-full">
        <div className="flex items-start gap-3 sm:gap-4 mb-4">
          <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {resume.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground text-sm sm:text-base leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                {resume.name}
              </h3>
              {resume.featured && (
                <Badge variant="secondary" className="text-xs">
                  Featured
                </Badge>
              )}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-1">
              {resume.designation} at {resume.company}
            </p>
          </div>
        </div>

        <div className="mt-auto">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onPreview();
            }}
            size="sm"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Eye className="h-3 w-3 mr-1" />
            Open
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeCard;