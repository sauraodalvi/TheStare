
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Star, Users, X } from 'lucide-react';
import { toast } from 'sonner';

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  position: string;
  publish: boolean | number;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    quote: '',
    author: '',
    position: ''
  });

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const response = await fetch('/data/testimonials.json');
        const data = await response.json();

        // Filter testimonials where publish is true or 1
        const publishedTestimonials = data.testimonials.filter((testimonial: Testimonial) =>
          testimonial.publish === true || testimonial.publish === 1
        );

        setTestimonials(publishedTestimonials);
      } catch (error) {
        console.error('Error loading testimonials:', error);
        // Fallback to empty array if loading fails
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  const handleSubmitTestimonial = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.quote.trim() || !formData.author.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Here you would typically send the data to your backend
    // For now, we'll just show a success message
    toast.success('Thank you for your testimonial! It will be reviewed and published soon.');

    // Reset form and close
    setFormData({ quote: '', author: '', position: '' });
    setShowForm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section className="py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="space-y-12 md:space-y-16">
          <div className="text-center">
            <div className="flex justify-center mb-5">
              <div className="p-2 rounded-full bg-stare-teal/10">
                <Star className="h-6 w-6 text-stare-teal" />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 md:mb-8">
              What People Say
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
              Join 30,000+ happy users worldwide who are already using our amazing product.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="bg-card hover:shadow-lg transition-all duration-300 border border-border overflow-hidden h-full flex flex-col group">
                <CardContent className="p-4 sm:p-5 flex flex-col h-full">
                  <div className="mb-4">
                    <div className="flex text-gray-300">
                      <Star className="h-5 w-5" />
                      <Star className="h-5 w-5" />
                      <Star className="h-5 w-5" />
                      <Star className="h-5 w-5" />
                      <Star className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="h-20 bg-gray-200 rounded mb-6 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                </CardContent>
              </Card>
            ))
          ) : (
            testimonials.slice(0, 6).map((testimonial, index) => (
              <Card key={testimonial.id || index} className="bg-card hover:shadow-lg transition-all duration-300 cursor-pointer border border-border overflow-hidden h-full flex flex-col group">
                <CardContent className="p-4 sm:p-5 flex flex-col h-full">
                  <div className="mb-4">
                    <div className="flex text-stare-teal">
                      <Star className="h-5 w-5 fill-stare-teal" />
                      <Star className="h-5 w-5 fill-stare-teal" />
                      <Star className="h-5 w-5 fill-stare-teal" />
                      <Star className="h-5 w-5 fill-stare-teal" />
                      <Star className="h-5 w-5 fill-stare-teal" />
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-6 flex-1">"{testimonial.quote}"</p>
                  <div>
                    <h4 className="font-semibold text-foreground">{testimonial.author}</h4>
                    {testimonial.position && (
                      <p className="text-sm text-muted-foreground">{testimonial.position}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="flex flex-col items-center">
          {!showForm ? (
            <Card className="border-none shadow-md bg-slate-50 max-w-2xl mx-auto w-full">
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center">
                  <div className="p-2 rounded-full bg-stare-navy/10 mb-4">
                    <Users className="h-5 w-5 text-stare-navy" />
                  </div>
                  <h3 className="text-xl font-bold text-stare-navy mb-2">
                    Share Your Success Story
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Tell Us About Your Experience with Stare
                  </p>
                  <Button
                    className="bg-stare-navy hover:bg-stare-navy/90"
                    onClick={() => setShowForm(true)}
                  >
                    Submit Testimonial
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-none shadow-md max-w-2xl mx-auto w-full">
              <CardContent className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-stare-navy">
                    Submit Your Testimonial
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowForm(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <form onSubmit={handleSubmitTestimonial} className="space-y-4">
                  <div>
                    <label htmlFor="quote" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Testimonial *
                    </label>
                    <Textarea
                      id="quote"
                      name="quote"
                      value={formData.quote}
                      onChange={handleInputChange}
                      placeholder="Share your experience with TheStare.in..."
                      className="min-h-[100px]"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <Input
                      id="author"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Position/Title
                    </label>
                    <Input
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      placeholder="e.g., Product Manager at Company"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="submit"
                      className="bg-stare-navy hover:bg-stare-navy/90 flex-1"
                    >
                      Submit Testimonial
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
