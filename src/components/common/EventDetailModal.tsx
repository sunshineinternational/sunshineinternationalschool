import React, { useState, useEffect } from 'react';
import type { Event } from '../../types';
import { parseDDMMYYYY } from '../../utils';

interface EventDetailModalProps {
    event: Event | null;
    isOpen: boolean;
    onClose: () => void;
}

const formatModalDate = (dateStr: string): string => {
    if (!dateStr) return '';
    const d = parseDDMMYYYY(dateStr);
    if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    }
    const nativeDate = new Date(dateStr);
    if (!isNaN(nativeDate.getTime())) {
        return nativeDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    }
    return dateStr;
};

const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, isOpen, onClose }) => {
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (selectedPhotoIndex !== null) {
                    setSelectedPhotoIndex(null);
                } else if (isOpen) {
                    onClose();
                }
            } else if (selectedPhotoIndex !== null && event?.gallery && event.gallery.length > 0) {
                if (e.key === 'ArrowRight') {
                    setSelectedPhotoIndex((prev) => (prev !== null ? (prev + 1) % event.gallery!.length : 0));
                } else if (e.key === 'ArrowLeft') {
                    setSelectedPhotoIndex((prev) => (prev !== null ? (prev - 1 + event.gallery!.length) % event.gallery!.length : 0));
                }
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, selectedPhotoIndex, event, onClose]);

    if (!isOpen || !event) return null;

    const hasGallery = Array.isArray(event.gallery) && event.gallery.length > 0;

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/75 backdrop-blur-md animate-fade-in">
            {/* Modal Dialog Card */}
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-gray-100 animate-scale-in">
                
                {/* Modal Header */}
                <div className="px-6 py-5 bg-gradient-to-r from-[var(--color-primary)] via-[#003759] to-[#004a77] text-white flex items-start justify-between gap-4 relative">
                    <div className="space-y-2 pr-6">
                        <div className="flex flex-wrap items-center gap-2.5">
                            <span className="px-3 py-1 rounded-full bg-[var(--color-accent)] text-[#002A45] text-xs font-black uppercase tracking-wider shadow-sm">
                                {event.category || 'School Event'}
                            </span>
                            <span className="text-xs text-white/80 font-medium flex items-center gap-1.5">
                                <i className="far fa-calendar-alt text-[var(--color-accent)]"></i>
                                {formatModalDate(event.date)}
                            </span>
                        </div>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-['Work_Sans'] text-white leading-tight">
                            {event.title}
                        </h2>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        aria-label="Close event details"
                        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors flex-shrink-0"
                    >
                        <i className="fas fa-times text-lg"></i>
                    </button>
                </div>

                {/* Modal Body (Scrollable) */}
                <div className="overflow-y-auto p-6 md:p-8 space-y-8 flex-grow custom-scrollbar">
                    
                    {/* Event Cover Image */}
                    {event.img && (
                        <div className="relative rounded-2xl overflow-hidden shadow-md bg-gray-100 max-h-[380px]">
                            <img
                                src={event.img}
                                alt={event.title}
                                className="w-full h-full object-cover max-h-[380px]"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = '/images/pages/home/hero-1.jpg';
                                }}
                            />
                        </div>
                    )}

                    {/* Event Full Description */}
                    <div className="space-y-3 bg-gray-50/80 rounded-2xl p-5 md:p-6 border border-gray-100">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-secondary)]/70 flex items-center gap-2">
                            <i className="fas fa-align-left text-[var(--color-accent)]"></i>
                            About This Event
                        </h4>
                        <p className="text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-line font-['Roboto']">
                            {event.description || 'Details for this event will be updated shortly.'}
                        </p>
                    </div>

                    {/* Event Photo Gallery */}
                    {hasGallery && (
                        <div className="space-y-4 pt-2">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                <div>
                                    <h4 className="text-lg md:text-xl font-bold font-['Work_Sans'] text-[var(--color-text-primary)] flex items-center gap-2.5">
                                        <i className="fas fa-camera-retro text-[var(--color-accent)]"></i>
                                        Event Photo Album
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-0.5">Click any photo to view in high resolution</p>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-blue-50 text-[var(--color-primary)] text-xs font-bold border border-blue-100">
                                    {event.gallery!.length} {event.gallery!.length === 1 ? 'Photo' : 'Photos'}
                                </span>
                            </div>

                            {/* Gallery Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                                {event.gallery!.map((photoUrl, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setSelectedPhotoIndex(idx)}
                                        className="relative aspect-square rounded-xl overflow-hidden group shadow-sm hover:shadow-md border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                                    >
                                        <img
                                            src={photoUrl}
                                            alt={`${event.title} - photo ${idx + 1}`}
                                            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                            <span className="w-9 h-9 rounded-full bg-white/90 text-gray-800 flex items-center justify-center shadow-md transform scale-75 group-hover:scale-100 transition-transform">
                                                <i className="fas fa-search-plus text-sm"></i>
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-gray-400 font-medium hidden sm:inline-block">
                        Sunshine International School Activities & Events
                    </span>
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-xs font-bold hover:bg-[var(--color-secondary)] transition-colors ml-auto shadow-sm"
                    >
                        Close
                    </button>
                </div>
            </div>

            {/* Sub-Lightbox for Fullscreen Photo Zoom */}
            {selectedPhotoIndex !== null && event.gallery && event.gallery[selectedPhotoIndex] && (
                <div 
                    className="fixed inset-0 z-[2100] bg-black/90 flex flex-col items-center justify-center p-4 animate-fade-in"
                    onClick={() => setSelectedPhotoIndex(null)}
                >
                    {/* Top Bar */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-10">
                        <span className="text-xs md:text-sm font-semibold bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
                            Photo {selectedPhotoIndex + 1} of {event.gallery.length}
                        </span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPhotoIndex(null);
                            }}
                            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors text-lg"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    {/* Navigation Arrows */}
                    {event.gallery.length > 1 && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedPhotoIndex((prev) => (prev !== null ? (prev - 1 + event.gallery!.length) % event.gallery!.length : 0));
                                }}
                                aria-label="Previous photo"
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors text-lg z-10"
                            >
                                <i className="fas fa-chevron-left"></i>
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedPhotoIndex((prev) => (prev !== null ? (prev + 1) % event.gallery!.length : 0));
                                }}
                                aria-label="Next photo"
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors text-lg z-10"
                            >
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </>
                    )}

                    {/* Main Full Image */}
                    <div 
                        className="max-w-4xl max-h-[80vh] flex items-center justify-center p-2"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={event.gallery[selectedPhotoIndex]}
                            alt={`${event.title} zoomed view`}
                            className="max-w-full max-h-[78vh] object-contain rounded-xl shadow-2xl"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventDetailModal;
