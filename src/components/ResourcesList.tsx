
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Book, FileText, Briefcase, BookOpen, FileSpreadsheet, ListChecks, GraduationCap } from 'lucide-react';

const ResourcesList = () => {
  const resources = [
    {
      title: "Self Study",
      description: "Access a curated collection of books, courses, and articles for independent learning.",
      icon: Book,
      path: "/resources/self-study",
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Participate",
      description: "Join case challenges and competitions to apply your product management skills.",
      icon: Briefcase,
      path: "/resources/participate",
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Portfolio",
      description: "Examples and templates to help you build an impressive product management portfolio.",
      icon: FileText,
      path: "/resources/portfolio",
      color: "bg-purple-100 text-purple-600"
    },
    {
      title: "Resume",
      description: "Professional resume templates and examples for product management roles.",
      icon: FileSpreadsheet,
      path: "/resources/resume",
      color: "bg-amber-100 text-amber-600"
    },
    {
      title: "Articles",
      description: "Insightful articles on product management trends, strategies, and best practices.",
      icon: BookOpen,
      path: "/resources/articles",
      color: "bg-rose-100 text-rose-600"
    },
    {
      title: "Interview Questions",
      description: "Common interview questions and effective answers for product management roles.",
      icon: ListChecks,
      path: "/resources/interview-questions",
      color: "bg-cyan-100 text-cyan-600"
    },
    {
      title: "Courses",
      description: "Recommended courses to enhance your product management skills and knowledge.",
      icon: GraduationCap,
      path: "/resources/courses",
      color: "bg-teal-100 text-teal-600"
    }
  ];

  return (
    <section className="py-16 bg-slate-50">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource, index) => (
            <Card key={index} className="shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4" style={{ borderTopColor: resource.color.split(' ')[1].replace('text-', 'var(--') + ')' }}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-full ${resource.color}`}>
                    <resource.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold">{resource.title}</h3>
                </div>
                <p className="text-gray-600 mb-6">{resource.description}</p>
                <Link 
                  to={resource.path} 
                  className="text-stare-teal hover:text-stare-navy font-medium flex items-center"
                >
                  Explore {resource.title} 
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResourcesList;
