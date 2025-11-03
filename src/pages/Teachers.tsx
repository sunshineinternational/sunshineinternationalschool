import React, { useState, useEffect } from 'react';
import PageHero from '../components/common/PageHero';
import { facultyData } from '../data/teachers';
import type { Teacher } from '../types';
import Seo from '../components/common/Seo';
import ScrollAnimator from '../components/common/ScrollAnimator';

const TeacherCard: React.FC<{ imgSrc: string; name: string; role: string; qualification: string; experience: string; }> = ({ imgSrc, name, role, qualification, experience }) => {
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.onerror = null; // Prevent infinite loop
        const initials = name.split(' ').map(n=>n[0]).join('');
        const placeholderSvg = `
          <svg xmlns="http://www.w3.org/2000/svg" width="144" height="144" viewBox="0 0 144 144">
            <rect fill="#F1EDE6" width="144" height="144"/>
            <text fill="#A48374" font-family="sans-serif" font-size="32" dy="10" x="50%" y="50%" text-anchor="middle">${initials}</text>
          </svg>`;
        e.currentTarget.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(placeholderSvg)}`;
    };
    
    return (
        <div className="bg-[var(--color-background-card)] rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col sm:flex-row items-stretch">
            <div className="w-full sm:w-36 flex-shrink-0">
                <img 
                    src={imgSrc} 
                    alt={name} 
                    className="w-full h-48 sm:h-full object-cover object-top"
                    onError={handleImageError}
                    loading="lazy"
                    decoding="async"
                />
            </div>
            <div className="p-4 flex flex-col justify-center text-left flex-grow">
                <h3 className="text-lg font-bold font-['Montserrat'] text-[var(--color-text-primary)] mb-1">{name}</h3>
                <p className="text-[var(--color-text-accent)] font-semibold text-sm mb-2">{role}</p>
                <div className="border-t border-[var(--color-border)] my-2"></div>
                <p className="text-sm text-[var(--color-text-secondary)]">{qualification}</p>
                <p className="text-xs text-gray-500 mt-1">{experience}</p>
            </div>
        </div>
    );
};

interface Testimonial {
    quote: string;
    name: string;
    role: string;
}

const Teachers: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials: Testimonial[] = facultyData
    .filter(t => t.testimonial && t.testimonial.trim() !== '')
    .map(t => ({
      quote: t.testimonial!,
      name: t.name,
      role: t.role,
    }));

  useEffect(() => {
    if (testimonials.length > 1) {
      const timer = setTimeout(() => {
        setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentTestimonial, testimonials.length]);

  const handlePrevTestimonial = () => {
    setCurrentTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNextTestimonial = () => {
    setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
  };

  return (
    <div>
      <Seo 
        title="Our Faculty | Experienced Teachers at Sunshine International School"
        description="Meet the dedicated and experienced faculty at Sunshine International School (SIS), Purushottampur. Our teachers are committed to nurturing young minds and shaping future leaders."
        imageUrl="/images/pages/teachers/hero.jpg"
      />
      <PageHero 
        title="Meet Our Dedicated Faculty"
        subtitle="Our team of experienced educators is committed to nurturing young minds and shaping future leaders."
        imageUrl="/images/pages/teachers/hero.jpg"
      />

      <ScrollAnimator>
        <section className="py-16 bg-[var(--color-background-section)]">
          <div className="container mx-auto px-4">
              <>
                {facultyData.length > 0 ? (
                  <div>
                    <h2 className="text-3xl font-bold text-center mb-4 font-['Montserrat'] text-[var(--color-text-primary)]">Our Esteemed Faculty</h2>
                    <p className="text-center text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-12">A team of passionate educators dedicated to student success.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {facultyData.map(t => <TeacherCard key={t.name} imgSrc={t.img} name={t.name} role={t.role} qualification={t.qualification} experience={`${t.experience} years experience`} />)}
                    </div>
                  </div>
                ) : (
                   <p className="text-center text-lg text-gray-500">Teacher information is currently unavailable.</p>
                )}
              </>
          </div>
        </section>
      </ScrollAnimator>
      
      {testimonials.length > 0 && (
        <ScrollAnimator>
          <section className="py-16 bg-[var(--color-background-body)]">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12 font-['Montserrat'] text-[var(--color-text-primary)]">Words From Our Team</h2>
              <div className="max-w-3xl mx-auto relative">
                <div className="relative overflow-hidden h-48">
                  {testimonials.map((testimonial, index) => (
                    <div key={index} 
                         className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ease-in-out ${index === currentTestimonial ? 'opacity-100' : 'opacity-0'}`}
                         aria-hidden={index !== currentTestimonial}>
                      <div className="bg-[var(--color-background-section)] p-8 rounded-lg shadow-lg relative h-full flex flex-col justify-center">
                        <i className="fas fa-quote-left text-3xl text-[var(--color-text-accent)] absolute top-4 left-6 opacity-20"></i>
                        <p className="text-[var(--color-text-secondary)] italic text-center mb-4">"{testimonial.quote}"</p>
                        <div className="text-right">
                          <h4 className="font-bold font-['Montserrat'] text-[var(--color-text-primary)]">{testimonial.name}</h4>
                          <p className="text-sm text-gray-500">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {testimonials.length > 1 && (
                  <>
                    <button onClick={handlePrevTestimonial} aria-label="Previous testimonial" className="absolute left-0 top-1/2 -translate-y-1/2 bg-[var(--color-background-card)]/50 text-[var(--color-text-primary)] rounded-full w-10 h-10 hover:bg-[var(--color-background-card)]/80 transition shadow-md -translate-x-6 z-10">
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    <button onClick={handleNextTestimonial} aria-label="Next testimonial" className="absolute right-0 top-1/2 -translate-y-1/2 bg-[var(--color-background-card)]/50 text-[var(--color-text-primary)] rounded-full w-10 h-10 hover:bg-[var(--color-background-card)]/80 transition shadow-md translate-x-6 z-10">
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </>
                )}
              </div>

              <div className="flex justify-center mt-6 space-x-2">
                  {testimonials.map((_, index) => (
                      <button 
                          key={index} 
                          onClick={() => setCurrentTestimonial(index)} 
                          aria-label={`Go to testimonial ${index + 1}`}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentTestimonial ? 'bg-[var(--color-accent)] scale-125' : 'bg-[var(--color-border)] hover:bg-[var(--color-secondary)]'}`}>
                      </button>
                  ))}
              </div>
            </div>
          </section>
        </ScrollAnimator>
      )}
    </div>
  );
};

export default Teachers;