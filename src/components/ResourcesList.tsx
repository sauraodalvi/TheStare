
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
      path: "/self-study",
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
    },
    {
      title: "Participate",
      description: "Join case challenges and competitions to apply your product management skills.",
      icon: Briefcase,
      path: "/participate",
      color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
    },
    {
      title: "Portfolio",
      description: "Examples and templates to help you build an impressive product management portfolio.",
      icon: FileText,
      path: "/portfolio",
      color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
    },
    {
      title: "Resume",
      description: "Professional resume templates and examples for product management roles.",
      icon: FileSpreadsheet,
      path: "/resume",
      color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
    },
    {
      title: "Courses",
      description: "Recommended courses to enhance your product management skills and knowledge.",
      icon: GraduationCap,
      path: "/courses",
      color: "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400"
    }
  ];

  return (
    <section className="py-16 bg-muted/30 dark:bg-gray-900/30">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource, index) => (
            <Card key={index} className="shadow-md hover:shadow-lg dark:shadow-gray-800/50 dark:hover:shadow-gray-700/50 transition-shadow duration-300 border-t-4 dark:bg-gray-800 dark:border-gray-700" style={{ borderTopColor: resource.color.split(' ')[1].replace('text-', 'var(--') + ')' }}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-full ${resource.color}`}>
                    <resource.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground dark:text-white">{resource.title}</h3>
                </div>
                <p className="text-muted-foreground dark:text-gray-300 mb-6">{resource.description}</p>
                <Link
                  to={resource.path}
                  className="text-stare-teal hover:text-stare-navy dark:text-teal-400 dark:hover:text-teal-300 font-medium flex items-center"
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
