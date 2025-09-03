import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'sonner';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import CourseCard from '@/components/CourseCard';
import VideoSessionTabs from '@/components/VideoSessionTabs';

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

interface CoursesData {
  header: {
    title: string;
    subtitle: string;
  };
  beginnerCourses: Course[];
  intermediateCourses: Course[];
  sessions: VideoSession[];
}

const Courses = () => {
  const [data, setData] = useState<CoursesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/courses.json');
        const coursesData = await response.json();
        setData(coursesData);
      } catch (error) {
        console.error('Error fetching courses data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filterCourses = (courses: Course[], searchTerm: string) => {
    if (!searchTerm) return courses;
    return courses.filter(course => 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.credits.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filterSessions = (sessions: VideoSession[], searchTerm: string) => {
    if (!searchTerm) return sessions;
    return sessions.filter(session => 
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.credits.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.speaker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Failed to load courses data.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const filteredBeginnerCourses = filterCourses(data.beginnerCourses, searchTerm);
  const filteredIntermediateCourses = filterCourses(data.intermediateCourses, searchTerm);
  const filteredSessions = filterSessions(data.sessions, searchTerm);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Toaster position="top-center" />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            {data.header.title}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            {data.header.subtitle}
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search courses and sessions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/50 backdrop-blur-sm border-muted"
            />
          </div>
        </div>
      </section>

      <main className="flex-1 container mx-auto px-4 py-12 space-y-16">
        {/* Beginner Courses */}
        {filteredBeginnerCourses.length > 0 && (
          <section>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-foreground">Beginner Level Courses</h2>
              <p className="text-muted-foreground">Perfect for those starting their PM journey</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBeginnerCourses.map((course, index) => (
                <CourseCard key={index} course={course} />
              ))}
            </div>
          </section>
        )}

        {/* Intermediate Courses */}
        {filteredIntermediateCourses.length > 0 && (
          <section>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-foreground">Intermediate Level Courses</h2>
              <p className="text-muted-foreground">Take your skills to the next level</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIntermediateCourses.map((course, index) => (
                <CourseCard key={index} course={course} />
              ))}
            </div>
          </section>
        )}

        {/* Video Sessions */}
        {filteredSessions.length > 0 && (
          <section>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-foreground">Free PM Sessions</h2>
              <p className="text-muted-foreground">Learn from industry experts and top PMs</p>
            </div>
            
            <VideoSessionTabs sessions={filteredSessions} />
          </section>
        )}

        {/* No Results */}
        {searchTerm && filteredBeginnerCourses.length === 0 && filteredIntermediateCourses.length === 0 && filteredSessions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No results found for "{searchTerm}"</p>
            <p className="text-muted-foreground">Try adjusting your search terms</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Courses;