import React, { useState, useEffect } from 'react';

const SelfStudyHero = () => {
  const [headerData, setHeaderData] = useState<{title: string, subtitle: string} | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data.json');
        const data = await response.json();
        setHeaderData(data.header);
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback data
        setHeaderData({
          title: "Learning should never stop!",
          subtitle: "Check out our latest and hottest resources to upskill and get your dream product manager role."
        });
      }
    };

    fetchData();
  }, []);

  if (!headerData) {
    return (
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded-lg mb-4 max-w-md"></div>
              <div className="h-6 bg-muted rounded-lg mb-2 max-w-2xl"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{headerData.title}</h1>
          <p className="text-muted-foreground">{headerData.subtitle}</p>
        </div>
      </div>
    </section>
  );
};

export default SelfStudyHero;