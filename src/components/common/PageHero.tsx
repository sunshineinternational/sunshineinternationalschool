import React, { useState, useEffect } from 'react';

interface PageHeroProps {
  title: string;
  subtitle: string;
  imageUrl: string;
}

const PageHero: React.FC<PageHeroProps> = ({ title, subtitle, imageUrl }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => setIsImageLoaded(true);
    img.onerror = () => {
      setIsImageLoaded(false);
    };
  }, [imageUrl]);

  const heroStyle = isImageLoaded
    ? { backgroundImage: `url(${imageUrl})` }
    : {};

  return (
    <section 
      className="bg-cover bg-center text-white relative animate-fade-in-up bg-[var(--color-primary)]"
      style={heroStyle}
    >
      <div className="absolute inset-0" style={{ background: `rgba(var(--color-primary-rgb), 0.5)` }}></div>
      <div className="relative container mx-auto px-4 py-24 md:py-32 text-center">
        <h1 className="text-3xl md:text-5xl font-bold font-['Montserrat'] mb-4 text-shadow-lg">{title}</h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto text-shadow">{subtitle}</p>
      </div>
    </section>
  );
};

export default PageHero;