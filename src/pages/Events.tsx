import React, { useState, useEffect } from 'react';
import PageHero from '../components/common/PageHero';
import Seo from '../components/common/Seo';
import type { Event } from '../types';
import { handleImageError, parseDDMMYYYY } from '../utils';
import ScrollAnimator from '../components/common/ScrollAnimator';
import { categoryColors } from '../data/eventColors';
import { fetchEventsData } from '../services/dataService';
import EventDetailModal from '../components/common/EventDetailModal';

const formatEventDate = (dateStr: string): string => {
    if (!dateStr) return '';
    const d = parseDDMMYYYY(dateStr);
    if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }
    const nativeDate = new Date(dateStr);
    if (!isNaN(nativeDate.getTime())) {
        return nativeDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }
    return dateStr;
};

const EventCard: React.FC<{ event: Event; onSelect: (e: Event) => void }> = ({ event, onSelect }) => {
    // @ts-ignore
    const colors = categoryColors[event.category] || { bg: 'bg-blue-100', text: 'text-[var(--color-primary)]' };
    const hasGallery = Array.isArray(event.gallery) && event.gallery.length > 0;

    return (
        <div 
            onClick={() => onSelect(event)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(event);
                }
            }}
            className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden border border-gray-100 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        >
            <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                <img 
                    src={event.img} 
                    alt={event.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    onError={(e) => handleImageError(e, { width: 400, height: 224, text: event.title })}
                    loading="lazy"
                    decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Category Pill */}
                <span className={`absolute top-3 left-3 text-[11px] font-bold ${colors.bg} ${colors.text} px-2.5 py-1 rounded-full shadow-sm`}>
                    {event.category || 'General'}
                </span>

                {/* Gallery photo count badge */}
                {hasGallery && (
                    <span className="absolute top-3 right-3 text-[10px] font-bold bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                        <i className="fas fa-images text-[9px] text-[var(--color-accent)]"></i>
                        <span>+{event.gallery!.length} Photos</span>
                    </span>
                )}
            </div>

            <div className="p-6 flex flex-col flex-grow justify-between">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-2">
                        <i className="far fa-calendar-alt text-[var(--color-accent)]"></i>
                        <span>{formatEventDate(event.date)}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2.5 font-['Montserrat'] text-[var(--color-text-primary)] group-hover:text-[var(--color-secondary)] transition-colors line-clamp-2">
                        {event.title}
                    </h3>
                    <p className="text-[var(--color-text-secondary)] text-sm line-clamp-3 leading-relaxed mb-6">
                        {event.description || 'Click to view the full details and photo gallery for this event.'}
                    </p>
                </div>

                <div className="pt-4 border-t border-gray-100 mt-auto flex items-center justify-between text-xs font-bold text-[var(--color-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                    <span>{hasGallery ? 'View Photos & Event Details' : 'View Event Details'}</span>
                    <span className="w-7 h-7 rounded-full bg-blue-50 group-hover:bg-[var(--color-accent)] group-hover:text-[#002A45] flex items-center justify-center transition-all duration-300">
                        <i className="fas fa-arrow-right text-[10px] group-hover:translate-x-0.5 transition-transform"></i>
                    </span>
                </div>
            </div>
        </div>
    );
};


const Events: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    useEffect(() => {
        const loadEvents = async () => {
            setLoading(true);
            const data = await fetchEventsData();
            setEvents(data);
            setLoading(false);
        };
        loadEvents();
    }, []);

    return (
        <div>
            <Seo
                title="Events | Sunshine International School, Purushottampur"
                description="Stay updated with the latest events and happenings at Sunshine International School (SIS). Explore our cultural, academic, and sports events."
                imageUrl="/images/pages/events/hero.jpg"
            />
            <PageHero 
                title="Latest Events & Happenings"
                subtitle="Explore the vibrant life and activities at our school"
                imageUrl="/images/pages/events/hero.jpg" 
            />

            <ScrollAnimator>
                <section className="py-16 bg-[var(--color-background-section)]">
                    <div className="container mx-auto px-4">
                        {loading ? (
                            <div className="text-center py-16">
                                <i className="fas fa-spinner fa-spin text-3xl text-[var(--color-accent)]"></i>
                                <p className="mt-4 text-lg text-[var(--color-text-secondary)]">Loading events...</p>
                            </div>
                        ) : events.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {events.map((event, index) => (
                                    <EventCard 
                                        key={index} 
                                        event={event} 
                                        onSelect={(ev) => setSelectedEvent(ev)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <p className="text-lg text-[var(--color-text-secondary)]">No events found at this time.</p>
                            </div>
                        )}
                    </div>
                </section>
            </ScrollAnimator>

            {/* Event Detail & Gallery Modal */}
            <EventDetailModal
                event={selectedEvent}
                isOpen={selectedEvent !== null}
                onClose={() => setSelectedEvent(null)}
            />
        </div>
    );
};

export default Events;