import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MessageSquare, X } from 'lucide-react';
import { toast } from 'sonner';
import { AboutCard } from '@/components/ui/about-card';

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
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              What People Say
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join 30,000+ happy users worldwide who are already using our amazing product.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <AboutCard key={index}>
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                    <div className="h-4 bg-muted rounded w-1/2 mt-4"></div>
                  </div>
                </AboutCard>
              ))
            ) : (
              testimonials.map((testimonial) => (
                <AboutCard 
                  key={testimonial.id} 
                  icon={<MessageSquare className="h-5 w-5" />}
                >
                  <p className="italic mb-4">"{testimonial.quote}"</p>
                  <div className="mt-auto pt-4 border-t border-border">
                    <p className="font-medium text-foreground">{testimonial.author}</p>
                    {testimonial.position && (
                      <p className="text-sm text-muted-foreground">{testimonial.position}</p>
                    )}
                  </div>
                </AboutCard>
              ))
            )}
          </div>

          {!showForm ? (
            <div className="text-center mt-8">
              <Button 
                variant="outline" 
                onClick={() => setShowForm(true)}
                className="gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Share Your Success Story
              </Button>
            </div>
          ) : (
            <AboutCard className="max-w-2xl mx-auto mt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Share Your Experience</h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowForm(false)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <form onSubmit={handleSubmitTestimonial} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="quote">Your Testimonial</Label>
                  <Textarea
                    id="quote"
                    name="quote"
                    value={formData.quote}
                    onChange={handleInputChange}
                    placeholder="Share your experience with us..."
                    rows={4}
                    required
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="author">Your Name</Label>
                    <Input
                      id="author"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="position">Your Position (Optional)</Label>
                    <Input
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      placeholder="Product Manager at Company"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Submit Testimonial
                  </Button>
                </div>
              </form>
            </AboutCard>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
