import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CourseCard from '@/components/CourseCard';
import VideoModal from '@/components/VideoModal';
import VideoSessionList from '@/components/VideoSessionList';

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
  const [selectedVideo, setSelectedVideo] = useState<VideoSession | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

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

  const handleCourseClick = (videoSession: VideoSession) => {
    setSelectedVideo(videoSession);
    setIsVideoModalOpen(true);
  };

  const handleCloseVideoModal = () => {
    setIsVideoModalOpen(false);
    setSelectedVideo(null);
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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Courses</h1>
            <p className="text-muted-foreground">Discover comprehensive courses and expert sessions to advance your product management skills</p>
          </div>
        </div>
      </section>

      <main className="flex-1">
        <section className="py-8 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="space-y-12 md:space-y-16">
            {/* Beginner Courses */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 md:mb-8">
                Beginner Level Courses
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                {data.beginnerCourses.map((course, index) => (
                  <CourseCard
                    key={index}
                    course={course}
                    courseType="beginner"
                    courseIndex={index}
                    onClick={handleCourseClick}
                  />
                ))}
              </div>
            </section>

            {/* Intermediate Courses */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 md:mb-8">
                Intermediate Level Courses
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                {data.intermediateCourses.map((course, index) => (
                  <CourseCard
                    key={index}
                    course={course}
                    courseType="intermediate"
                    courseIndex={index}
                    onClick={handleCourseClick}
                  />
                ))}
              </div>
            </section>

            {/* Video Sessions */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 md:mb-8">
                Free PM Sessions
              </h2>
              <VideoSessionList sessions={data.sessions} />
            </section>
            </div>
          </div>
        </section>
      </main>

      <VideoModal
        video={selectedVideo}
        isOpen={isVideoModalOpen}
        onClose={handleCloseVideoModal}
      />

      <Footer />
    </div>
  );
};

export default Courses;