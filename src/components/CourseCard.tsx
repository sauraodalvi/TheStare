import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, PlayCircle } from 'lucide-react';

interface Course {
  title: string;
  credits: string;
  url: string;
}

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const handleClick = () => {
    window.open(course.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="h-full flex flex-col bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-border group">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex-1 space-y-4">
          <div className="flex items-start gap-3">
            <PlayCircle className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors leading-tight">
                {course.title}
              </h3>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">By:</span> {course.credits}
            </p>
          </div>
        </div>
        
        <Button
          onClick={handleClick}
          className="w-full mt-6 bg-accent hover:bg-accent/90 text-accent-foreground"
          size="sm"
        >
          <span>Watch Course</span>
          <ExternalLink className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default CourseCard;