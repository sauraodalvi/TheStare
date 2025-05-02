
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  BookOpen, 
  ArrowRight,
  Filter,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';

const CaseStudiesList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const caseStudies = [
    {
      title: "Product Strategy for Marketplace Apps",
      category: "Product Strategy",
      company: "E-commerce Platform",
      difficulty: "Advanced",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&auto=format&fit=crop",
      description: "Learn how a leading e-commerce platform redesigned their marketplace strategy to increase seller retention by 45% and improve buyer satisfaction."
    },
    {
      title: "User Onboarding Optimization",
      category: "UX Research",
      company: "FinTech Startup",
      difficulty: "Intermediate",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop",
      description: "A detailed analysis of how a fintech app reduced their activation time by 60% through strategic onboarding improvements."
    },
    {
      title: "Feature Prioritization Framework",
      category: "Product Management",
      company: "SaaS Company",
      difficulty: "Beginner",
      image: "https://images.unsplash.com/photo-1572177215652-32e68733525c?w=500&auto=format&fit=crop",
      description: "Explore the RICE scoring model implementation that helped a B2B SaaS company align their roadmap with business objectives."
    },
    {
      title: "Mobile App Performance Optimization",
      category: "Technical",
      company: "Food Delivery App",
      difficulty: "Advanced",
      image: "https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?w=500&auto=format&fit=crop",
      description: "How a food delivery app reduced load times by 70% and improved conversion rates through technical optimizations."
    },
    {
      title: "Data-Driven Product Decisions",
      category: "Analytics",
      company: "Media Streaming Service",
      difficulty: "Intermediate",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop",
      description: "Case study on implementing a robust analytics framework that transformed decision-making processes."
    },
    {
      title: "Building a Design System",
      category: "Design",
      company: "Global Retail Brand",
      difficulty: "Intermediate",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&auto=format&fit=crop",
      description: "The journey of creating a unified design system across web and mobile platforms that reduced design debt and accelerated development."
    }
  ];

  const filteredCaseStudies = caseStudies.filter(study => 
    study.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    study.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    study.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    study.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Header Section */}
      <section className="bg-slate-50 py-12 md:py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-display font-bold text-stare-navy mb-4">
              Product Management Case Studies
            </h1>
            <p className="text-lg text-slate-600 mb-6">
              Real-world scenarios and solutions to strengthen your product management skills and prepare for interviews.
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 border-b">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <Input 
                type="text" 
                placeholder="Search case studies..." 
                className="pl-10" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Button variant="outline" className="flex gap-2 items-center">
                <Filter size={16} />
                Filter
              </Button>
              <Button variant="outline">
                Difficulty
              </Button>
              <Button variant="outline">
                Category
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-12">
        <div className="container">
          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="w-full md:w-auto flex justify-start overflow-x-auto pb-2">
              <TabsTrigger value="all">All Categories</TabsTrigger>
              <TabsTrigger value="strategy">Strategy</TabsTrigger>
              <TabsTrigger value="ux">UX Research</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredCaseStudies.length > 0 ? (
                  filteredCaseStudies.map((study, index) => (
                    <Card key={index} className="overflow-hidden border-none shadow-md card-hover">
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={study.image} 
                          alt={study.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                        <span className="absolute top-4 right-4 bg-white/90 text-stare-navy text-xs font-semibold px-3 py-1 rounded-full">
                          {study.difficulty}
                        </span>
                      </div>
                      <CardContent className="pt-6">
                        <div className="text-sm font-medium text-stare-teal mb-2 flex items-center gap-2">
                          <BookOpen size={14} />
                          {study.category}
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-stare-navy hover:text-stare-teal transition-colors">
                          <a href="#">{study.title}</a>
                        </h3>
                        <p className="text-slate-600 mb-4 text-sm line-clamp-2">
                          {study.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                            {study.company}
                          </span>
                          <Button variant="link" className="px-0 text-stare-teal flex items-center gap-1">
                            Read Case Study
                            <ArrowRight size={14} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-lg text-slate-500">No case studies found matching your search.</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setSearchQuery('')}
                    >
                      Clear search
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="strategy" className="mt-6">
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredCaseStudies
                  .filter(study => study.category === "Product Strategy")
                  .map((study, index) => (
                    <Card key={index} className="overflow-hidden border-none shadow-md card-hover">
                      {/* Same card structure as above */}
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={study.image} 
                          alt={study.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                        <span className="absolute top-4 right-4 bg-white/90 text-stare-navy text-xs font-semibold px-3 py-1 rounded-full">
                          {study.difficulty}
                        </span>
                      </div>
                      <CardContent className="pt-6">
                        <div className="text-sm font-medium text-stare-teal mb-2 flex items-center gap-2">
                          <BookOpen size={14} />
                          {study.category}
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-stare-navy hover:text-stare-teal transition-colors">
                          <a href="#">{study.title}</a>
                        </h3>
                        <p className="text-slate-600 mb-4 text-sm line-clamp-2">
                          {study.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                            {study.company}
                          </span>
                          <Button variant="link" className="px-0 text-stare-teal flex items-center gap-1">
                            Read Case Study
                            <ArrowRight size={14} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
            
            {/* Similar structure for other tabs */}
            <TabsContent value="ux" className="mt-6">
              {/* UX Research case studies */}
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredCaseStudies
                  .filter(study => study.category === "UX Research")
                  .map((study, index) => (
                    <Card key={index} className="overflow-hidden border-none shadow-md card-hover">
                      {/* Same card structure */}
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={study.image} 
                          alt={study.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                        <span className="absolute top-4 right-4 bg-white/90 text-stare-navy text-xs font-semibold px-3 py-1 rounded-full">
                          {study.difficulty}
                        </span>
                      </div>
                      <CardContent className="pt-6">
                        <div className="text-sm font-medium text-stare-teal mb-2 flex items-center gap-2">
                          <BookOpen size={14} />
                          {study.category}
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-stare-navy hover:text-stare-teal transition-colors">
                          <a href="#">{study.title}</a>
                        </h3>
                        <p className="text-slate-600 mb-4 text-sm line-clamp-2">
                          {study.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                            {study.company}
                          </span>
                          <Button variant="link" className="px-0 text-stare-teal flex items-center gap-1">
                            Read Case Study
                            <ArrowRight size={14} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </>
  );
};

export default CaseStudiesList;
