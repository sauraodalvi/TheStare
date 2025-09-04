import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ResumeCard from '@/components/ResumeCard';
import ResumeTemplateCard from '@/components/ResumeTemplateCard';
import ResumeModal from '@/components/ResumeModal';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Toaster } from 'sonner';

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
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredResumes = data?.resumes.filter(resume =>
    resume.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resume.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resume.designation.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handlePreview = (resume: Resume) => {
    setSelectedResume(resume);
    setIsModalOpen(true);
  };

  if (!data) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Toaster position="top-center" />
      
      <main className="flex-1 bg-background">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                {data.title}
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Learn from successful product managers by studying their resumes and career paths.
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search by name, company, or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Resumes Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResumes.map((resume) => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  onPreview={() => handlePreview(resume)}
                />
              ))}
            </div>
            
            {filteredResumes.length === 0 && searchTerm && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">
                  No resumes found matching "{searchTerm}"
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Templates Section */}
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Resume Templates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.templates.map((template, index) => (
                  <ResumeTemplateCard key={index} template={template} />
                ))}
              </div>
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