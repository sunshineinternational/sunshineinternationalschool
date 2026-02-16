import React from 'react';
import PageHero from '../components/common/PageHero';
import Seo from '../components/common/Seo';
import type { House } from '../types';
import ScrollAnimator from '../components/common/ScrollAnimator';
import { handleImageError } from '../utils';
import { houseData } from '../data/houseSystem';

const HouseSystem: React.FC = () => {
  return (
    <div>
      <Seo
        title="House System | Sunshine International School"
        description="Learn about the house system at Sunshine International School, fostering teamwork and a spirit of healthy competition among students."
        imageUrl="/images/pages/house-system/hero.jpg"
      />
      <PageHero
        title="The House System"
        subtitle="Fostering teamwork, leadership, and a spirit of healthy competition"
        imageUrl="/images/pages/house-system/hero.jpg"
      />

      <ScrollAnimator>
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center bg-[var(--color-background-card)] p-8 rounded-lg shadow-md">
              <h2 className="text-3xl font-bold mb-4 font-['Montserrat'] text-[var(--color-text-primary)]">Our Guiding Rivers</h2>
              <p className="text-[var(--color-text-secondary)] mb-4">Our House System is the vibrant heart of our school, designed to cultivate a spirit of camaraderie, leadership, and healthy competition. It is built upon a powerful theme that draws inspiration from the lifeblood of India: its mighty rivers.</p>
              <p className="text-[var(--color-text-secondary)] mb-4">Each of our four houses is named after a prominent river flowing from one of the four cardinal directions of our great nation: <strong>Jhelum</strong> from the North, <strong>Narmada</strong> from the West, <strong>Godavari</strong> from the East, and <strong>Kaveri</strong> from the South. These rivers are symbols of strength, perseverance, and the continuous flow of life and knowledge.</p>
              <p className="text-[var(--color-text-secondary)]">Just as these rivers nourish the lands they touch, our houses nurture the unique talents of every student. This system symbolizes our belief that our students, like these great rivers, are empowered to carve their own paths and achieve greatness in every direction their journey takes them.</p>
            </div>
          </div>
        </section>
      </ScrollAnimator>

      <ScrollAnimator>
        <section className="py-16 bg-[var(--color-background-section)]">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {houseData.map((house) => (
                <div key={house.name} className="bg-[var(--color-background-card)] rounded-lg shadow-lg overflow-hidden flex flex-col">
                  <div className={`p-4 ${house.color}`}>
                    <h3 className={`text-2xl font-bold font-['Montserrat'] text-center ${house.textColor}`}>
                      {house.name} House
                    </h3>
                  </div>
                  <div className="p-6 flex-grow">
                     <div className="aspect-video rounded-md overflow-hidden mb-4 shadow-inner bg-gray-200">
                          <img
                              src={house.img}
                              alt={`${house.name} House banner`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              decoding="async"
                              width="400"
                              height="225"
                              onError={(e) => handleImageError(e, { width: 400, height: 225, text: `${house.name} House` })}
                          />
                      </div>
                    {/* Description is intentionally left blank as per user request */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollAnimator>
    </div>
  );
};

export default HouseSystem;