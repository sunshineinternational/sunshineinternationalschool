import React from 'react';
import PageHero from '../components/common/PageHero';
import Seo from '../components/common/Seo';
import { eventsData } from '../data/events';
import type { Event } from '../types';
import { handleImageError } from '../utils';
import ScrollAnimator from '../components/common/ScrollAnimator';

const categoryColors: { [key: string]: { bg: string; text: string; } } = {
    'Academic': { bg: 'bg-blue-100', text: 'text-blue-800' },
    'Sports': { bg: 'bg-green-100', text: 'text-green-800' },
    'Cultural': { bg: 'bg-purple-100', text: 'text-purple-800' },
    'Celebration': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
};

const EventCard: React.FC<{ event: Event }> = ({ event }) => {
    const colors = categoryColors[event.category] || { bg: 'bg-gray-100', text: 'text-gray-800' };

    return (
        <div className="bg-[var(--color-background-card)] rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
            <div className="relative">
                <img 
                    src={event.img} 
                    alt={event.title} 
                    className="w-full h-56 object-cover" 
                    onError={(e) => handleImageError(e, { text: event.title })}
                    loading="lazy"
                    decoding="async"
                />
                <span className={`absolute top-2 right-2 text-xs font-semibold ${colors.bg} ${colors.text} px-2 py-1 rounded-full`}>
                    {event.category}
                </span>
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-2 font-['Montserrat'] text-[var(--color-text-primary)]">{event.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="text-[var(--color-text-secondary)] text-sm flex-grow">{event.description}</p>
            </div>
        </div>
    );
};


const Events: React.FC = () => {
    const sortedEvents = [...eventsData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
        imageUrl="/images/pages/events/hero.jpg" // Using gallery hero as a placeholder
      />

      <ScrollAnimator>
        <section className="py-16 bg-[var(--color-background-section)]">
          <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {sortedEvents.map((event, index) => (
                      <EventCard key={index} event={event} />
                  ))}
              </div>
          </div>
        </section>
      </ScrollAnimator>
    </div>
  );
};

export default Events;