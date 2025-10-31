import React, { useState, useEffect } from 'react';
import { SEO } from '@/components/SEO';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CourseCard from '@/components/CourseCard';
import VideoModal from '@/components/VideoModal';
import VideoSessionList from '@/components/VideoSessionList';
import { Skeleton } from '@/components/LayoutStable';

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
        <main className="flex-1">
          <section className="py-8 px-4">
            <div className="container mx-auto max-w-7xl">
              <div className="mb-8">
                <Skeleton width="200px" height={36} className="mb-2" />
                <Skeleton width="400px" height={20} />
              </div>
            </div>
          </section>
          <section className="py-8 px-4">
            <div className="container mx-auto max-w-7xl">
              <div className="space-y-12">
                <section>
                  <Skeleton width="300px" height={32} className="mb-6" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className="space-y-3 p-4 border rounded-lg">
                        <div className="flex items-start gap-3">
                          <Skeleton width={48} height={48} className="rounded-lg" />
                          <div className="flex-1 space-y-2">
                            <Skeleton width="100%" height={20} />
                            <Skeleton width="60%" height={16} />
                          </div>
                        </div>
                        <Skeleton width="100%" height={120} className="rounded-lg" />
                        <Skeleton width="100%" height={36} className="rounded" />
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </section>
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
    <>
      <SEO
        title="Product Management Courses & Free PM Sessions | Stare"
        description="Learn product management with beginner and intermediate courses, plus free expert sessions from top PMs. Master PM skills with structured learning paths."
        keywords="PM courses, product management courses, PM training, product manager education, PM learning resources"
        url="/courses"
      />
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
    </>
  );
};

export default Courses;