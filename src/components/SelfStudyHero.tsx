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
      <section className="bg-gradient-to-r from-stare-navy to-stare-navy/90 text-white py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl">
            <div className="animate-pulse">
              <div className="h-12 bg-white/20 rounded-lg mb-6"></div>
              <div className="h-6 bg-white/15 rounded-lg mb-4"></div>
              <div className="h-6 bg-white/15 rounded-lg w-3/4"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-r from-stare-navy to-stare-navy/90 text-white py-16 md:py-24">
      <div className="container">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">
            {headerData.title}
          </h1>
          <p className="text-xl text-white/80 mb-8">
            {headerData.subtitle}
          </p>
        </div>
      </div>
    </section>
  );
};

export default SelfStudyHero;