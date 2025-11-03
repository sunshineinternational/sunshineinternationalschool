import React from 'react';
import PageHero from '../components/common/PageHero';
import Seo from '../components/common/Seo';
import ScrollAnimator from '../components/common/ScrollAnimator';
import { handleImageError } from '../utils';

const About: React.FC = () => {
  return (
    <div>
      <Seo
        title="About Us | Sunshine International School, Purushottampur"
        description="Discover the rich history, mission, and vision of Sunshine International School (SIS) in Purushottampur. Learn about our commitment to excellence as a leading CBSE school."
        imageUrl="/images/pages/about/hero.jpg"
      />
      <PageHero 
        title="About Our School"
        subtitle="Discover our rich history and commitment to excellence"
        imageUrl="/images/pages/about/hero.jpg"
      />

      <ScrollAnimator>
        <section className="py-16 bg-[var(--color-background-section)]">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8 font-['Montserrat'] text-[var(--color-text-primary)]">Our History</h2>
            <div className="max-w-3xl mx-auto bg-[var(--color-background-card)] p-8 rounded-lg shadow-md">
              <p className="text-[var(--color-text-secondary)] mb-4">Founded in 2012, Sunshine International School has grown from a small educational institution to a leading center of academic excellence in Odisha. Our journey began with a vision to provide quality education that combines traditional values with modern learning methodologies.</p>
              <p className="text-[var(--color-text-secondary)]">Over the years, we have expanded our infrastructure, enhanced our curriculum, and built a team of dedicated educators who are committed to nurturing young minds. Today, we stand proud as an institution that has consistently produced outstanding academic results and well-rounded individuals.</p>
            </div>
          </div>
        </section>
      </ScrollAnimator>

      <ScrollAnimator>
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 font-['Montserrat'] text-[var(--color-text-primary)]">Our Mission & Vision</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-[var(--color-background-card)] p-8 rounded-lg shadow-md text-center transition-transform duration-300 hover:-translate-y-2">
                <div className="text-4xl text-[var(--color-text-accent)] mb-4"><i className="fas fa-bullseye"></i></div>
                <h3 className="text-2xl font-bold mb-3 font-['Montserrat'] text-[var(--color-text-primary)]">Our Mission</h3>
                <p className="text-[var(--color-text-secondary)]">To provide a nurturing environment that fosters academic excellence, character development, and global citizenship through innovative teaching methods and a comprehensive curriculum.</p>
              </div>
              <div className="bg-[var(--color-background-card)] p-8 rounded-lg shadow-md text-center transition-transform duration-300 hover:-translate-y-2">
                <div className="text-4xl text-[var(--color-text-accent)] mb-4"><i className="fas fa-eye"></i></div>
                <h3 className="text-2xl font-bold mb-3 font-['Montserrat'] text-[var(--color-text-primary)]">Our Vision</h3>
                <p className="text-[var(--color-text-secondary)]">To be a premier educational institution that shapes future leaders by instilling values of integrity, compassion, and lifelong learning in every student.</p>
              </div>
            </div>
          </div>
        </section>
      </ScrollAnimator>

      <ScrollAnimator>
        <section className="py-16 bg-[var(--color-background-section)]">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 font-['Montserrat'] text-[var(--color-text-primary)]">Our Core Values</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-[var(--color-background-card)] p-6 rounded-lg shadow-md text-center transition-transform duration-300 hover:-translate-y-2">
                <div className="text-3xl text-[var(--color-text-accent)] mb-4"><i className="fas fa-graduation-cap"></i></div>
                <h3 className="text-xl font-bold mb-2 text-[var(--color-text-primary)]">Excellence</h3>
                <p className="text-[var(--color-text-secondary)] text-sm">Striving for the highest standards in academics and personal development</p>
              </div>
              <div className="bg-[var(--color-background-card)] p-6 rounded-lg shadow-md text-center transition-transform duration-300 hover:-translate-y-2">
                <div className="text-3xl text-[var(--color-text-accent)] mb-4"><i className="fas fa-heart"></i></div>
                <h3 className="text-xl font-bold mb-2 text-[var(--color-text-primary)]">Integrity</h3>
                <p className="text-[var(--color-text-secondary)] text-sm">Upholding ethical values and moral principles in all our actions</p>
              </div>
              <div className="bg-[var(--color-background-card)] p-6 rounded-lg shadow-md text-center transition-transform duration-300 hover:-translate-y-2">
                <div className="text-3xl text-[var(--color-text-accent)] mb-4"><i className="fas fa-globe"></i></div>
                <h3 className="text-xl font-bold mb-2 text-[var(--color-text-primary)]">Global Perspective</h3>
                <p className="text-[var(--color-text-secondary)] text-sm">Preparing students to be global citizens in an interconnected world</p>
              </div>
              <div className="bg-[var(--color-background-card)] p-6 rounded-lg shadow-md text-center transition-transform duration-300 hover:-translate-y-2">
                <div className="text-3xl text-[var(--color-text-accent)] mb-4"><i className="fas fa-users"></i></div>
                <h3 className="text-xl font-bold mb-2 text-[var(--color-text-primary)]">Community</h3>
                <p className="text-[var(--color-text-secondary)] text-sm">Building a supportive and inclusive learning community</p>
              </div>
            </div>
          </div>
        </section>
      </ScrollAnimator>

      <ScrollAnimator>
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 font-['Montserrat'] text-[var(--color-text-primary)]">Our Facilities</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-[var(--color-background-card)] rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-2">
                <img src="/images/pages/about/facility-classroom.jpg" alt="Modern Classrooms at Sunshine International School" className="w-full h-48 object-cover" onError={(e) => handleImageError(e, { width: 400, height: 192, text: e.currentTarget.alt })} loading="lazy" decoding="async" width="400" height="192" />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-[var(--color-text-primary)]">Modern Classrooms</h3>
                  <p className="text-[var(--color-text-secondary)]">Spacious, well-equipped classrooms with smart learning technology</p>
                </div>
              </div>
              <div className="bg-[var(--color-background-card)] rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-2">
                <img src="/images/pages/about/facility-library.jpg" alt="Digital Library at Sunshine International School" className="w-full h-48 object-cover" onError={(e) => handleImageError(e, { width: 400, height: 192, text: e.currentTarget.alt })} loading="lazy" decoding="async" width="400" height="192" />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-[var(--color-text-primary)]">Digital Library</h3>
                  <p className="text-[var(--color-text-secondary)]">Extensive collection of books and digital resources</p>
                </div>
              </div>
              <div className="bg-[var(--color-background-card)] rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-2">
                <img src="/images/pages/about/facility-sports.jpg" alt="Sports Facilities at Sunshine International School" className="w-full h-48 object-cover" onError={(e) => handleImageError(e, { width: 400, height: 192, text: e.currentTarget.alt })} loading="lazy" decoding="async" width="400" height="192" />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-[var(--color-text-primary)]">Sports Facilities</h3>
                  <p className="text-[var(--color-text-secondary)]">State-of-the-art sports complex and playgrounds</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollAnimator>
    </div>
  );
};

export default About;