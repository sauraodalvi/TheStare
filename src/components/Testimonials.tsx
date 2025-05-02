
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Users } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "A fantastic resource with a large collection of product teardowns. Learn and get inspired. An instant bookmark for product managers",
      author: "Paweł Huryn",
      position: "Author, Product Coach"
    },
    {
      quote: "This is a fantastic platform with a large collection of 500+ product teardowns that will help you crack your next dream role",
      author: "Shravan Tickoo",
      position: "Group PM"
    },
    {
      quote: "It has hundreds of in-depth product teardown. Every PM should know this website!",
      author: "Carl Vellott",
      position: "Senior PM"
    },
    {
      quote: "This is a great useful resource!",
      author: "Filip Miloszewski",
      position: "Co-founder, Board Member"
    },
    {
      quote: "Don't miss out on this PM goldmine!",
      author: "George Nurijanian",
      position: "Senior PM"
    },
    {
      quote: "This helped me a lot while preparing for case studies.",
      author: "V parameswaran",
      position: ""
    },
    {
      quote: "The platform is really helping me a lot. thanks a lot for building it.",
      author: "Mukesh Agrawal",
      position: ""
    },
    {
      quote: "Liked the latest decks and variety",
      author: "Aditya",
      position: "Product manager intern"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-5">
            <div className="p-2 rounded-full bg-stare-teal/10">
              <Star className="h-6 w-6 text-stare-teal" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-stare-navy mb-4 font-display">
            What People Say
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Join 30,000+ happy users worldwide who are already using our amazing product.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.slice(0, 6).map((testimonial, index) => (
            <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="flex text-stare-teal">
                    <Star className="h-5 w-5 fill-stare-teal" />
                    <Star className="h-5 w-5 fill-stare-teal" />
                    <Star className="h-5 w-5 fill-stare-teal" />
                    <Star className="h-5 w-5 fill-stare-teal" />
                    <Star className="h-5 w-5 fill-stare-teal" />
                  </div>
                </div>
                <p className="text-slate-700 mb-6">"{testimonial.quote}"</p>
                <div>
                  <h4 className="font-semibold text-stare-navy">{testimonial.author}</h4>
                  {testimonial.position && (
                    <p className="text-sm text-slate-500">{testimonial.position}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col items-center">
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
                <Button className="bg-stare-navy hover:bg-stare-navy/90">
                  Submit Testimonial
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
