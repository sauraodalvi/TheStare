import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const AddYourWork = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-stare-navy mb-2">Add Your Work</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Showcase your work on "The Stare" and get it in front of a wider relevant audience.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="prose max-w-none">
              <p className="text-lg text-foreground">
                If you want to showcase your work on "The Stare" and get it in front of a wider relevant audience, 
                tagging us on your LinkedIn post is a great way to do it.
              </p>
              
              <div className="my-8 p-6 bg-muted/20 rounded-lg border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-4">How to get featured:</h3>
                <ol className="space-y-4 list-decimal list-inside">
                  <li className="text-foreground">
                    Create a LinkedIn post showcasing your work
                  </li>
                  <li className="text-foreground">
                    Mention "The Stare" (@The Stare) in your post by tagging the official LinkedIn account
                  </li>
                  <li className="text-foreground">
                    Our team will review your submission and reach out if it's a good fit
                  </li>
                </ol>
                
                <div className="mt-6 flex flex-col items-center justify-center p-4 bg-background rounded border border-border">
                  <img 
                    src="https://assets.softr-files.com/applications/fb373a75-278f-42c5-9baa-274e2cc5d2b2/assets/669f61aa-6d86-41de-b697-2e8858b1a41f.svg" 
                    alt="LinkedIn Post Example"
                    className="max-w-full h-auto rounded-md shadow-sm mb-4"
                  />
                  <p className="text-sm text-muted-foreground text-center">
                    Example of how to tag The Stare in your LinkedIn post
                  </p>
                </div>
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button 
                  asChild
                  variant="brand" 
                  className="w-full sm:w-auto"
                >
                  <a 
                    href="https://www.linkedin.com/company/the-stare" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Visit Our LinkedIn
                  </a>
                </Button>
                <Button 
                  asChild
                  variant="outline" 
                  className="w-full sm:w-auto"
                >
                  <Link to="/case-studies">
                    View Case Studies
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddYourWork;
