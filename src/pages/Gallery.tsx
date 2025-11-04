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
  const [currentPage, setCurrentPage] = useState(1);
  const IMAGES_PER_PAGE = 12;

  const events = useMemo(() => ['All', ...Array.from(new Set(galleryImages.map(img => img.event)))], []);
  
  const filteredImages = useMemo(() => {
    if (selectedEvent === 'All') {
      return galleryImages;
    }
    return galleryImages.filter(img => img.event === selectedEvent);
  }, [selectedEvent]);

  // Reset to first page whenever the event filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedEvent]);

  // Pagination logic
  const totalPages = Math.ceil(filteredImages.length / IMAGES_PER_PAGE);
  const startIndex = (currentPage - 1) * IMAGES_PER_PAGE;
  const paginatedImages = filteredImages.slice(startIndex, startIndex + IMAGES_PER_PAGE);

  const openLightbox = (indexInFullArray: number) => {
    setCurrentImageIndex(indexInFullArray);
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
  
  const handlePageChange = (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
          setCurrentPage(newPage);
          // Scroll to the top of the gallery section for better UX on page change
          const gallerySection = document.getElementById('gallery-section');
          if (gallerySection) {
              const headerOffset = 75; // Adjust for fixed header height
              const elementPosition = gallerySection.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
              
              window.scrollTo({
                  top: offsetPosition,
                  behavior: 'smooth'
              });
          }
      }
  };


  return (
    <div id="gallery-section">
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
        <div className="container mx-auto px-4 flex justify-center items-center gap-4">
            <label htmlFor="event-filter" className="font-semibold text-[var(--color-text-primary)] whitespace-nowrap">Filter by Event:</label>
            <select
              id="event-filter"
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="px-4 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-background-card)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] transition w-full max-w-xs"
              aria-label="Filter gallery by event"
            >
              {events.map(event => (
                <option key={event} value={event}>{event}</option>
              ))}
            </select>
        </div>
      </section>

      <ScrollAnimator>
        <section className="py-16">
          <div className="container mx-auto px-4">
            {paginatedImages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {paginatedImages.map((image, index) => (
                  <div 
                    key={`${image.src}-${index}`} 
                    className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer aspect-video"
                    onClick={() => openLightbox(startIndex + index)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && openLightbox(startIndex + index)}
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
            ) : (
                <div className="text-center py-12">
                    <p className="text-lg text-[var(--color-text-secondary)]">No images found for this event.</p>
                </div>
            )}

            {totalPages > 1 && (
                <nav className="mt-12 flex justify-center items-center gap-2 flex-wrap" aria-label="Gallery pagination">
                    <button 
                        onClick={() => handlePageChange(currentPage - 1)} 
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-300 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed bg-[var(--color-background-card)] text-[var(--color-text-primary)] hover:bg-[var(--color-secondary)] hover:text-[var(--color-text-inverted)]"
                    >
                        &laquo; Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                        <button 
                            key={pageNumber} 
                            onClick={() => handlePageChange(pageNumber)}
                            aria-current={currentPage === pageNumber ? 'page' : undefined}
                            className={`w-10 h-10 text-sm font-semibold rounded-md transition-colors duration-300 ${
                                currentPage === pageNumber
                                    ? 'bg-[var(--color-accent)] text-[var(--color-text-inverted)] shadow-md'
                                    : 'bg-[var(--color-background-card)] text-[var(--color-text-primary)] hover:bg-[var(--color-secondary)] hover:text-[var(--color-text-inverted)]'
                            }`}
                        >
                            {pageNumber}
                        </button>
                    ))}
                    <button 
                        onClick={() => handlePageChange(currentPage + 1)} 
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-300 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed bg-[var(--color-background-card)] text-[var(--color-text-primary)] hover:bg-[var(--color-secondary)] hover:text-[var(--color-text-inverted)]"
                    >
                        Next &raquo;
                    </button>
                </nav>
            )}
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