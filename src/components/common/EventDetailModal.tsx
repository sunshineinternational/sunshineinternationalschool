import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Close on Escape key & manage body scroll
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

    if (!mounted || !isOpen || !event) return null;

    const hasGallery = Array.isArray(event.gallery) && event.gallery.length > 0;
    const coverImage = event.img || '/images/pages/home/hero-1.jpg';

    const modalContent = (
        <div 
            className="fixed inset-0 z-[99999] flex flex-col justify-end sm:justify-center items-center bg-black/80 backdrop-blur-md transition-opacity duration-300"
            onClick={(e) => {
                if (e.target === e.currentTarget && selectedPhotoIndex === null) {
                    onClose();
                }
            }}
        >
            {/* Modal Dialog: Bottom Sheet on Mobile, Centered Modal on Desktop */}
            <div 
                className="w-full sm:max-w-3xl md:max-w-4xl bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[88vh] border border-white/20 animate-scale-in relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Mobile Pull Indicator */}
                <div className="sm:hidden absolute top-2.5 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/70 rounded-full z-20 pointer-events-none shadow-sm"></div>

                {/* Floating Close Button */}
                <button
                    onClick={onClose}
                    aria-label="Close event modal"
                    className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md shadow-lg transition-transform hover:scale-105 active:scale-95 border border-white/20"
                >
                    <span className="material-symbols-outlined text-xl">close</span>
                </button>

                {/* Hero Cover Header */}
                <div className="relative w-full h-56 sm:h-72 md:h-80 bg-slate-900 shrink-0 overflow-hidden">
                    <img
                        src={coverImage}
                        alt={event.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/images/pages/home/hero-1.jpg';
                        }}
                    />
                    {/* Multi-stop gradient scrim for readable typography */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-black/30"></div>

                    {/* Header Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 md:p-8 text-white">
                        <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-accent)] text-[var(--color-primary)] text-[11px] font-black uppercase tracking-wider shadow-sm">
                                <span className="material-symbols-outlined text-xs">verified</span>
                                {event.category || 'School Event'}
                            </span>
                            {event.date && (
                                <span className="inline-flex items-center gap-1.5 text-xs text-white/90 font-semibold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                                    <span className="material-symbols-outlined text-xs text-amber-300">calendar_month</span>
                                    {formatModalDate(event.date)}
                                </span>
                            )}
                        </div>
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold font-['Work_Sans'] text-white tracking-tight leading-tight">
                            {event.title}
                        </h2>
                    </div>
                </div>

                {/* Modal Body (Scrollable) */}
                <div className="overflow-y-auto p-5 sm:p-7 md:p-8 space-y-6 flex-grow custom-scrollbar bg-white">
                    {/* Event Story Description */}
                    <div className="prose prose-slate max-w-none">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50/80 px-3 py-1.5 rounded-lg w-fit mb-3">
                            <span className="material-symbols-outlined text-sm">menu_book</span>
                            Event Highlights & Story
                        </div>
                        <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line font-['Work_Sans']">
                            {event.description || 'Join us in celebrating this special occasion at Sunshine International School.'}
                        </p>
                    </div>

                    {/* Event Photo Gallery */}
                    {hasGallery ? (
                        <div className="pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg sm:text-xl font-bold font-['Work_Sans'] text-[var(--color-text-primary)] flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[var(--color-accent)]">photo_library</span>
                                        Event Photo Album
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-0.5">Tap any photo to view in high resolution</p>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-blue-50 text-[var(--color-primary)] text-xs font-bold border border-blue-100/80">
                                    {event.gallery!.length} {event.gallery!.length === 1 ? 'Photo' : 'Photos'}
                                </span>
                            </div>

                            {/* Gallery Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3.5">
                                {event.gallery!.map((photoUrl, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setSelectedPhotoIndex(idx)}
                                        className="relative aspect-square rounded-2xl overflow-hidden group shadow-sm hover:shadow-lg border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all bg-gray-100"
                                    >
                                        <img
                                            src={photoUrl}
                                            alt={`${event.title} - photo ${idx + 1}`}
                                            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                            <span className="w-10 h-10 rounded-full bg-white/90 text-gray-800 flex items-center justify-center shadow-md transform scale-75 group-hover:scale-100 transition-transform">
                                                <span className="material-symbols-outlined text-lg">zoom_in</span>
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100/60 flex items-center gap-3.5 text-xs text-blue-900">
                            <span className="material-symbols-outlined text-2xl text-blue-600 shrink-0">school</span>
                            <div>
                                <p className="font-bold text-sm">Sunshine International School</p>
                                <p className="text-gray-600 mt-0.5">Purushottampur, Ganjam, Odisha • Fostering Academic Excellence</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="px-5 py-3.5 sm:px-8 sm:py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-4">
                    <span className="text-xs text-gray-500 font-medium hidden sm:inline-block">
                        Sunshine International School Campus Life
                    </span>
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-xs font-bold hover:bg-blue-900 transition-colors ml-auto shadow-sm"
                    >
                        Done
                    </button>
                </div>
            </div>

            {/* Sub-Lightbox for Fullscreen Photo Zoom */}
            {selectedPhotoIndex !== null && event.gallery && event.gallery[selectedPhotoIndex] && (
                <div 
                    className="fixed inset-0 z-[100000] bg-black/95 flex flex-col items-center justify-center p-3 sm:p-6 animate-fade-in"
                    onClick={() => setSelectedPhotoIndex(null)}
                >
                    {/* Top Controls */}
                    <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-md">
                            {selectedPhotoIndex + 1} / {event.gallery.length}
                        </span>
                        <button
                            onClick={() => setSelectedPhotoIndex(null)}
                            className="w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition-colors shadow-lg"
                            aria-label="Close photo"
                        >
                            <span className="material-symbols-outlined text-2xl">close</span>
                        </button>
                    </div>

                    {/* Left Navigation Chevron */}
                    {event.gallery.length > 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPhotoIndex((prev) => (prev !== null ? (prev - 1 + event.gallery!.length) % event.gallery!.length : 0));
                            }}
                            className="absolute left-3 sm:left-6 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-md transition-colors"
                            aria-label="Previous photo"
                        >
                            <span className="material-symbols-outlined text-3xl">chevron_left</span>
                        </button>
                    )}

                    {/* Image Viewer */}
                    <div className="relative max-w-5xl max-h-[85vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={event.gallery[selectedPhotoIndex]}
                            alt={`${event.title} - expanded view`}
                            className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl animate-scale-in"
                        />
                    </div>

                    {/* Right Navigation Chevron */}
                    {event.gallery.length > 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPhotoIndex((prev) => (prev !== null ? (prev + 1) % event.gallery!.length : 0));
                            }}
                            className="absolute right-3 sm:right-6 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-md transition-colors"
                            aria-label="Next photo"
                        >
                            <span className="material-symbols-outlined text-3xl">chevron_right</span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default EventDetailModal;
