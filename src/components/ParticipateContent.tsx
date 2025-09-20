
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Award, Calendar } from 'lucide-react';

const ParticipateContent = () => {
  return (
    <section className="py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Participate</h1>
          <p className="text-muted-foreground">Join case challenges to build your portfolio and enhance your product management skills</p>
        </div>

        <div className="space-y-12 md:space-y-16">
          {/* Introduction Section */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 md:mb-8">
              Where can I participate in case challenges?
            </h2>

            <div className="max-w-4xl mb-8">
              <p className="text-muted-foreground text-lg mb-4">
                The portfolio of a product manager is a crucial document for any prospective employers.
                An excellent product manager portfolio highlights a product manager's abilities, successes,
                and experience to illustrate why they would make the best hire for a certain position.
              </p>
              <p className="text-foreground font-medium text-lg">
                So please take part, even if you don't win you can add it to your portfolio!
              </p>
            </div>
          </section>

          {/* Challenge Platforms Section */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 md:mb-8">
              Challenge Platforms
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
              <Card className="bg-card hover:shadow-lg transition-all duration-300 cursor-pointer border border-border overflow-hidden h-full flex flex-col group">
                <CardContent className="p-4 sm:p-5 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-sm sm:text-base leading-tight mb-1">The Product Folks</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">Monthly Challenges</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm mb-6 flex-1">
                    Regular product case challenges with networking opportunities and mentorship from industry experts.
                  </p>

                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" size="sm">
                    <span>Read more</span>
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card hover:shadow-lg transition-all duration-300 cursor-pointer border border-border overflow-hidden h-full flex flex-col group">
                <CardContent className="p-4 sm:p-5 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-sm sm:text-base leading-tight mb-1">PMSchool.in</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">Weekly Challenges</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm mb-6 flex-1">
                    Intensive weekly challenges focused on building practical product management skills in real-world scenarios.
                  </p>

                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" size="sm">
                    <span>Read more</span>
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card hover:shadow-lg transition-all duration-300 cursor-pointer border border-border overflow-hidden h-full flex flex-col group">
                <CardContent className="p-4 sm:p-5 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                        <Award className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-sm sm:text-base leading-tight mb-1">Unstop.com</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">Frequent Challenges</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm mb-6 flex-1">
                    Platform hosting various product challenges from top companies with opportunities for recognition and jobs.
                  </p>

                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" size="sm">
                    <span>Read more</span>
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Benefits Section */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 md:mb-8">
              Benefits of Participating in Case Challenges
            </h2>

            <div className="bg-muted/50 rounded-lg border border-border p-6">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="h-3 w-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-foreground">Enhances your portfolio with real-world problem-solving examples</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="h-3 w-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-foreground">Build networking opportunities with industry professionals</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="h-3 w-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-foreground">Gain recognition and credibility in the product management community</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="h-3 w-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-foreground">Practice applying product frameworks in realistic scenarios</span>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};

export default ParticipateContent;
