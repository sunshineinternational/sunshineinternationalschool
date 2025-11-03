import React, { useState, useEffect, useMemo } from 'react';
import PageHero from '../components/common/PageHero';
import Seo from '../components/common/Seo';
import { galleryImages } from '../data/gallery';
import type { GalleryImage } from '../types';
import ScrollAnimator from '../components/common/ScrollAnimator';
import { handleImageError } from '../utils';

// Lightbox Component
const Lightbox: React.FC<{
    images: GalleryImage[];
    currentIndex: number;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
}> = ({ images, currentIndex, onClose, onPrev, onNext }) => {
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') onPrev();
            if (e.key === 'ArrowRight') onNext();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, onPrev, onNext]);

    if (currentIndex < 0 || currentIndex >= images.length) {
        return null;
    }

    const image = images[currentIndex];

    return (
        <div className="lightbox-overlay" onClick={onClose}>
            <button className="lightbox-close" onClick={onClose} aria-label="Close lightbox">&times;</button>
            <button className="lightbox-prev" onClick={(e) => { e.stopPropagation(); onPrev(); }} aria-label="Previous image">&#10094;</button>
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                <img src={image.src} alt={image.caption} className="lightbox-image" />
                <div className="lightbox-caption">{image.caption}</div>
            </div>
            <button className="lightbox-next" onClick={(e) => { e.stopPropagation(); onNext(); }} aria-label="Next image">&#10095;</button>
        </div>
    );
};


const Gallery: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState('All');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const events = useMemo(() => ['All', ...Array.from(new Set(galleryImages.map(img => img.event)))], []);
  
  const filteredImages = useMemo(() => {
    if (selectedEvent === 'All') {
      return galleryImages;
    }
    return galleryImages.filter(img => img.event === selectedEvent);
  }, [selectedEvent]);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const showNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % filteredImages.length);
  };

  const showPrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + filteredImages.length) % filteredImages.length);
  };

  return (
    <div>
      <Seo
        title="Gallery | Sunshine International School, Purushottampur"
        description="Explore the photo gallery of Sunshine International School (SIS). See photos from our events, activities, and campus life in Purushottampur."
        imageUrl="/images/pages/gallery/hero.jpg"
      />
      <PageHero 
        title="Gallery"
        subtitle="Explore the vibrant life at Sunshine International School"
        imageUrl="/images/pages/gallery/hero.jpg"
      />

      <section className="py-8 bg-[var(--color-background-section)]">
        <div className="container mx-auto px-4 text-center">
            <div className="flex flex-wrap justify-center gap-2">
                {events.map(event => (
                    <button
                        key={event}
                        onClick={() => setSelectedEvent(event)}
                        className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${
                            selectedEvent === event
                                ? 'bg-[var(--color-accent)] text-[var(--color-text-inverted)] shadow-md'
                                : 'bg-[var(--color-background-card)] text-[var(--color-text-primary)] hover:bg-[var(--color-secondary)] hover:text-[var(--color-text-inverted)]'
                        }`}
                    >
                        {event}
                    </button>
                ))}
            </div>
        </div>
      </section>

      <ScrollAnimator>
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredImages.map((image, index) => (
                <div 
                  key={`${image.src}-${index}`} 
                  className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer aspect-video"
                  onClick={() => openLightbox(index)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && openLightbox(index)}
                >
                  <img 
                    src={image.src} 
                    alt={`${image.caption} at Sunshine International School`}
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110" 
                    onError={(e) => handleImageError(e, { width: 400, height: 224, text: "Image Not Found" })}
                    loading="lazy"
                    decoding="async"
                    width="400"
                    height="224"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-500 flex items-end justify-start p-4">
                    <h3 className="text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">{image.caption}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollAnimator>

      {isLightboxOpen && (
        <Lightbox
            images={filteredImages}
            currentIndex={currentImageIndex}
            onClose={closeLightbox}
            onPrev={showPrevImage}
            onNext={showNextImage}
        />
      )}
    </div>
  );
};

export default Gallery;