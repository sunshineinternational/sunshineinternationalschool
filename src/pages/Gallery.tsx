import React, { useState, useEffect, useMemo } from 'react';
import PageHero from '../components/common/PageHero';
import Seo from '../components/common/Seo';
import type { GalleryImage } from '../types';
import { fetchGalleryData } from '../services/dataService';
import ScrollAnimator from '../components/common/ScrollAnimator';
import { handleImageError } from '../utils';

import { createPortal } from 'react-dom';

// Lightbox Component
const Lightbox: React.FC<{
    images: GalleryImage[];
    currentIndex: number;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
}> = ({ images, currentIndex, onClose, onPrev, onNext }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') onPrev();
            if (e.key === 'ArrowRight') onNext();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, onPrev, onNext]);

    if (!mounted || currentIndex < 0 || currentIndex >= images.length) {
        return null;
    }

    const image = images[currentIndex];

    return createPortal(
        <div 
            className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-md flex flex-col justify-between items-center p-3 sm:p-6 select-none animate-fade-in"
            onClick={onClose}
        >
            {/* Top Control Bar */}
            <div className="w-full max-w-6xl flex items-center justify-between text-white z-20 shrink-0 pt-1 sm:pt-0">
                <div className="flex items-center gap-2.5">
                    <span className="px-3 py-1 rounded-full bg-[var(--color-accent)] text-[#002A45] text-xs font-black uppercase tracking-wider shadow-sm">
                        {image.event || 'Gallery'}
                    </span>
                    <span className="text-xs text-white/80 font-semibold bg-white/15 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                        {currentIndex + 1} / {images.length}
                    </span>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    aria-label="Close photo preview"
                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95 backdrop-blur-md border border-white/20 shadow-lg"
                >
                    <span className="material-symbols-outlined text-xl">close</span>
                </button>
            </div>

            {/* Center Image Container with Navigation Arrows */}
            <div className="relative w-full max-w-6xl flex-grow flex items-center justify-center min-h-0 py-2">
                {/* Left Chevron */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onPrev();
                    }}
                    aria-label="Previous photo"
                    className="absolute left-1 sm:left-4 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all hover:scale-105 active:scale-95 border border-white/20 shadow-xl"
                >
                    <span className="material-symbols-outlined text-2xl">chevron_left</span>
                </button>

                {/* Photo Display */}
                <div 
                    className="relative max-w-full max-h-[72vh] sm:max-h-[78vh] flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    <img
                        src={image.src}
                        alt={image.caption}
                        className="max-w-full max-h-[72vh] sm:max-h-[78vh] object-contain rounded-2xl shadow-2xl animate-scale-in"
                        onError={(e) => handleImageError(e, { width: 800, height: 600, text: image.caption })}
                    />
                </div>

                {/* Right Chevron */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onNext();
                    }}
                    aria-label="Next photo"
                    className="absolute right-1 sm:right-4 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all hover:scale-105 active:scale-95 border border-white/20 shadow-xl"
                >
                    <span className="material-symbols-outlined text-2xl">chevron_right</span>
                </button>
            </div>

            {/* Bottom Caption Bar */}
            <div className="w-full max-w-2xl text-center shrink-0 pb-2 z-20" onClick={(e) => e.stopPropagation()}>
                <p className="text-white text-sm sm:text-base font-medium px-4 leading-relaxed font-['Work_Sans'] drop-shadow-md">
                    {image.caption}
                </p>
            </div>
        </div>,
        document.body
    );
};


const Gallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedEvent, setSelectedEvent] = useState('All');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const IMAGES_PER_PAGE = 12;

  useEffect(() => {
    const loadImages = async () => {
      const data = await fetchGalleryData();
      setImages(data);
    };
    loadImages();
  }, []);

  const events = useMemo(() => ['All', ...Array.from(new Set(images.map(img => img.event)))], [images]);
  
  const filteredImages = useMemo(() => {
    if (selectedEvent === 'All') {
      return images;
    }
    return images.filter(img => img.event === selectedEvent);
  }, [selectedEvent, images]);

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
          const gallerySection = document.getElementById('gallery-section');
          if (gallerySection) {
              if (typeof window === 'undefined') return;
              const headerOffset = 75;
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