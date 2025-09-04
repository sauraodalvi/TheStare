import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Eye, Download, ExternalLink } from 'lucide-react';

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
  const handleDownload = () => {
    window.open(resume.resumeLink, '_blank');
  };

  const handleViewPost = () => {
    if (resume.referenceLink) {
      window.open(resume.referenceLink, '_blank');
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage 
              src={resume.profileImage} 
              alt={resume.name}
              className="object-cover"
            />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {resume.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground truncate">
                {resume.name}
              </h3>
              {resume.featured && (
                <Badge variant="secondary" className="text-xs">
                  Featured
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-1">
              {resume.designation} at {resume.company}
            </p>
            <div className="flex items-center gap-2">
              {resume.companyLogo && (
                <img 
                  src={resume.companyLogo} 
                  alt={resume.company}
                  className="h-4 w-4 object-contain"
                />
              )}
              <Badge variant="outline" className="text-xs">
                {resume.source}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            onClick={onPreview}
            className="w-full"
            variant="default"
          >
            <Eye className="h-4 w-4 mr-2" />
            Open Preview
          </Button>
          
          <div className="flex gap-2">
            <Button
              onClick={handleDownload}
              variant="outline"
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            
            {resume.referenceLink && (
              <Button
                onClick={handleViewPost}
                variant="outline"
                className="flex-1"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Post
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeCard;