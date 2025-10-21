import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ResumeCard from '@/components/ResumeCard';
import ResumeTemplateCard from '@/components/ResumeTemplateCard';
import ResumeModal from '@/components/ResumeModal';
import { Skeleton } from '@/components/LayoutStable';

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

interface Template {
  name: string;
  author: string;
  description: string;
  downloadInstructions?: string;
  link: string;
  button?: string;
}

interface ResumeData {
  title: string;
  resumes: Resume[];
  templates: Template[];
}

const Resume = () => {
  const [data, setData] = useState<ResumeData | null>(null);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/resumes.json');
        const resumeData = await response.json();
        setData(resumeData);
      } catch (error) {
        console.error('Error fetching resume data:', error);
      }
    };

    fetchData();
  }, []);

  const handlePreview = (resume: Resume) => {
    setSelectedResume(resume);
    setIsModalOpen(true);
  };

  if (!data) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <section className="py-8 px-4">
            <div className="container mx-auto max-w-7xl">
              <div className="mb-8">
                <Skeleton width="150px" height={36} className="mb-2" />
                <Skeleton width="450px" height={20} />
              </div>
            </div>
          </section>
          <section className="py-8 px-4">
            <div className="container mx-auto max-w-7xl">
              <div className="space-y-12">
                <section>
                  <Skeleton width="350px" height={32} className="mb-6" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className="space-y-3 p-4 border rounded-lg">
                        <Skeleton width="100%" height={250} className="rounded-lg" />
                        <Skeleton width="80%" height={24} />
                        <Skeleton width="60%" height={20} />
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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        {/* Header Section */}
        <section className="py-8 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Resume</h1>
              <p className="text-muted-foreground">Explore inspiring resumes from successful product managers</p>
            </div>
          </div>
        </section>

        <section className="py-8 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="space-y-12 md:space-y-16">
              {/* Featured Resumes Section */}
              <section>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 md:mb-8">
                  Product Manager Resumes
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                  {data.resumes
                    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
                    .map((resume) => (
                      <ResumeCard
                        key={resume.id}
                        resume={resume}
                        onPreview={() => handlePreview(resume)}
                      />
                    ))}
                </div>
              </section>

              {/* Resume Templates Section */}
              <section>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 md:mb-8">
                  Resume Templates
                </h2>

                <div className="space-y-8">
                  {data.templates.map((template, index) => (
                    <div key={index}>
                      <h3 className="text-xl font-semibold text-foreground mb-4">
                        {template.name}
                      </h3>
                      <ResumeTemplateCard template={template} />
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Resume Preview Modal */}
      <ResumeModal
        resume={selectedResume}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Resume;