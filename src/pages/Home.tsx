import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchNoticesData } from '../services/dataService';
import type { Notice, Event as SchoolEvent, QuickLink, Testimonial } from '../types';
import { leadershipData } from '../data/teachers';
import { handleImageError, parseDDMMYYYY } from '../utils';
import { FaqItem } from '../components/common/FaqItem';
import Seo from '../components/common/Seo';
import { eventsData } from '../data/events';
import { schoolLifeMomentsData } from '../data/schoolLifeMoments';
import { homeFaqData } from '../data/faqs';
import { whyChooseUsData } from '../data/whyChooseUs';
import { testimonialsData } from '../data/testimonials';
import ScrollAnimator from '../components/common/ScrollAnimator';
import NoticeTicker from '../components/common/NoticeTicker';


const heroSlidesData = [
  { type: 'image', src: '/images/pages/home/hero-3.jpg', animationClass: 'animate-pan-up' },
  { type: 'image', src: '/images/pages/home/hero-1.jpg', animationClass: 'animate-pan-right' },
  { type: 'image', src: '/images/pages/home/hero-2.jpg', animationClass: 'animate-zoom-in' },
  { type: 'image', src: '/images/pages/home/hero-4.jpg', animationClass: 'animate-pan-left' },
  { type: 'video', src: '/images/pages/home/video.mp4', animationClass: 'animate-pan-left', poster: '/images/pages/home/video-poster.jpg' },
];

const Hero: React.FC = () => {
    const [slides, setSlides] = useState(heroSlidesData);
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = useCallback(() => {
        if (slides.length === 0) return;
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, [slides.length]);
    
    useEffect(() => {
        const slideInterval = setInterval(nextSlide, 5000);
        return () => clearInterval(slideInterval);
    }, [nextSlide]);

    const handleMediaError = (src: string) => {
        setSlides(prevSlides => {
            const newSlides = prevSlides.filter(slide => slide.src !== src);
            if (newSlides.length > 0 && currentSlide >= newSlides.length) {
                setCurrentSlide(0);
            } else if (newSlides.length === 0) {
                setCurrentSlide(0);
            }
            return newSlides;
        });
    };

    return (
        <section className="relative h-screen overflow-hidden flex items-center justify-start">
            <div className="absolute top-0 left-0 w-full h-full z-0">
                {slides.map((slide, index) => (
                    <div key={slide.src} className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                        {slide.type === 'video' ? (
                            <video key={slide.src} playsInline autoPlay muted loop poster={slide.poster} className={`w-full h-full object-cover scale-105 ${slide.animationClass}`} onError={() => handleMediaError(slide.src)}>
                                <source src={slide.src} type="video/mp4" />
                            </video>
                        ) : (
                            <img src={slide.src} alt="School" className={`w-full h-full object-cover scale-105 ${slide.animationClass}`} onError={() => handleMediaError(slide.src)} />
                        )}
                    </div>
                ))}
            </div>
            <div className="absolute top-0 left-0 w-full h-full hero-gradient-overlay z-10"></div>
            
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up">
                <div className="max-w-2xl text-left text-white">
                    <h1 className="text-4xl md:text-6xl font-bold font-[\'Montserrat\'] mb-4 leading-tight text-shadow-lg">Inspiring Young Minds for a Brighter Tomorrow</h1>
                    <p className="text-lg md:text-xl mb-8 text-shadow">A nurturing environment where knowledge meets excellence.</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link to="/admission" className="btn-primary inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-full text-[var(--color-text-inverted)] bg-[var(--color-accent)] hover:bg-[var(--color-secondary)] transition-all duration-300 transform hover:scale-105 shadow-lg">Admissions Open 2025-26</Link>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-24 left-4 sm:left-6 lg:left-8 z-20 flex gap-2">
                {slides.map((_, index) => (
                    <button key={index} onClick={() => setCurrentSlide(index)} className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-[var(--color-accent)] scale-125' : 'bg-white/50'}`}></button>
                ))}
            </div>
        </section>
    );
};

const quickLinksData: QuickLink[] = [
  { icon: 'fas fa-info-circle', title: 'About Us', description: 'Our history, mission, and values', path: '/about' },
  { icon: 'fas fa-book-open', title: 'Academics', description: 'Explore our comprehensive curriculum', path: '/academics' },
  { icon: 'fas fa-graduation-cap', title: 'Admissions', description: 'Join our vibrant school community', path: '/admission' },
  { icon: 'fas fa-images', title: 'Gallery', description: 'A glimpse into our school life', path: '/gallery' },
];

const QuickLinks = () => (
  <section className="bg-[var(--color-background-section)] py-16">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-12 font-[\'Montserrat\'] text-[var(--color-text-primary)]">Discover Sunshine International School</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {quickLinksData.map((link) => (
            <div key={link.title} className="bg-[var(--color-background-card)] p-6 rounded-lg shadow-md text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col">
              <div className="text-4xl text-[var(--color-text-accent)] mb-4"><i className={link.icon}></i></div>
              <h3 className="text-xl font-bold mb-2 font-[\'Montserrat\'] text-[var(--color-text-primary)]">{link.title}</h3>
              <p className="text-[var(--color-text-secondary)] mb-4 text-sm flex-grow">{link.description}</p>
              <Link to={link.path} className="font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-text-accent)] mt-auto">
                Learn More &rarr;
              </Link>
            </div>
        ))}
      </div>
    </div>
  </section>
);

const WhyChooseUs = () => (
  <section className="py-16">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-12 font-[\'Montserrat\'] text-[var(--color-text-primary)]">Why Choose Sunshine?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {whyChooseUsData.map((item) => (
          <div key={item.title} className="bg-[var(--color-background-card)] p-6 rounded-lg shadow-md text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
            <div className="text-5xl text-[var(--color-text-accent)] mb-4"><i className={item.icon}></i></div>
            <h3 className="text-xl font-bold mb-3 font-[\'Montserrat\'] text-[var(--color-text-primary)]">{item.title}</h3>
            <p className="text-[var(--color-text-secondary)] text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);


const SchoolLifeMoments = () => (
    <div>
        <h2 className="text-3xl font-bold text-center lg:text-left mb-8 font-[\'Montserrat\'] text-[var(--color-text-primary)]">School Life Moments</h2>
        <div className="grid grid-cols-2 gap-4">
            {schoolLifeMomentsData.map((moment, index) => (
                <div key={index} className="group relative overflow-hidden rounded-lg shadow-md cursor-pointer aspect-w-1 aspect-h-1">
                    <img 
                        src={moment.src} 
                        alt={moment.caption} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        onError={(e) => handleImageError(e, { text: moment.caption })}
                        loading="lazy"
                        decoding="async"
                        width="400"
                        height="400"
                    />
                    <div className="absolute inset-0 bg-black/60 transition-all duration-300 opacity-0 group-hover:opacity-100">
                        <div className="absolute bottom-0 left-0 p-4 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                            <h3 className="text-white text-sm sm:text-base font-bold">{moment.caption}</h3>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        <div className="text-center mt-8">
            <Link to="/gallery" className="btn-secondary inline-flex items-center justify-center px-6 py-3 text-sm font-bold rounded-full text-[var(--color-text-inverted)] bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] transition-all duration-300 transform hover:scale-105 shadow-lg">
                View All Moments
            </Link>
        </div>
    </div>
);

const HomepageNotices = () => {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadNotices = async () => {
            setLoading(true);
            setError(null);
            try {
                const noticesData = await fetchNoticesData();
                const sortedNotices = (noticesData as Notice[]).sort((a, b) => parseDDMMYYYY(b.date).getTime() - parseDDMMYYYY(a.date).getTime());
                setNotices(sortedNotices);
            } catch (err) {
                console.error(err);
                setError('Failed to load notices.');
            } finally {
                setLoading(false);
            }
        };
        loadNotices();
    }, []);

    return (
        <div>
            <h2 className="text-3xl font-bold text-center lg:text-left mb-8 font-[\'Montserrat\'] text-[var(--color-text-primary)]">Notices</h2>
            <div className="bg-[var(--color-background-card)] p-6 rounded-lg shadow-md">
                {loading && <p className="text-center text-[var(--color-text-secondary)]">Loading notices...</p>}
                {error && <p className="text-center text-red-600">{error}</p>}
                
                {!loading && !error && (
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar pr-4 space-y-4">
                        {notices.length > 0 ? (
                            notices.map((notice, index) => {
                                const isNew = (new Date().getTime() - parseDDMMYYYY(notice.date).getTime()) < 14 * 24 * 60 * 60 * 1000;
                                return (
                                    <a 
                                        key={index} 
                                        href={notice.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block bg-white p-3 rounded-md border border-[var(--color-border)] transition-all duration-300 hover:shadow-lg hover:border-[var(--color-accent)] hover:-translate-y-0.5"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="font-bold text-sm text-[var(--color-text-primary)]">{notice.title}</h3>
                                                <p className="text-xs text-gray-500 mt-1">{notice.date}</p>
                                            </div>
                                            <div className="flex items-center space-x-3 flex-shrink-0 ml-2">
                                                {isNew && <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">NEW</span>}
                                                <i className="fas fa-chevron-right text-gray-400"></i>
                                            </div>
                                        </div>
                                    </a>
                                );
                            })
                        ) : (
                            <p className="text-center text-gray-500">No recent notices found.</p>
                        )}
                    </div>
                )}
                 
                <div className="text-center mt-6">
                    <Link to="/notices" className="btn-secondary inline-flex items-center justify-center px-6 py-3 text-sm font-bold rounded-full text-[var(--color-text-inverted)] bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] transition-all duration-300 transform hover:scale-105 shadow-lg">
                        View All Notices
                    </Link>
                </div>
            </div>
        </div>
    );
};

const LatestEvents = () => {
    const latestEvents = [...eventsData]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 4);

    return (
        <section className="py-16 bg-[var(--color-background-section)]">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12 font-[\'Montserrat\'] text-[var(--color-text-primary)]">Latest Events</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {latestEvents.map((event, index) => (
                        <div key={index} className="group relative rounded-lg shadow-md overflow-hidden aspect-[4/3] cursor-pointer">
                            <img 
                                src={event.img} 
                                alt={event.title} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                onError={(e) => handleImageError(e, { text: event.title })}
                                loading="lazy"
                                decoding="async"
                                width="400"
                                height="300"
                            />
                            <div className="absolute inset-0 bg-black/60 transition-all duration-300 opacity-0 group-hover:opacity-100">
                               <div className="absolute bottom-0 left-0 w-full p-4 transition-all duration-300 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                                    <h3 className="text-md font-bold font-[\'Montserrat\'] text-white">{event.title}</h3>
                                    <p className="text-xs text-gray-300 mt-1">{new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                            </div>
                        </div>
                    ))}\
                </div>
                <div className="text-center mt-12">
                    <Link to="/events" className="btn-secondary inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-full text-[var(--color-text-inverted)] bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] transition-all duration-300 transform hover:scale-105 shadow-lg">
                        View All Events
                    </Link>
                </div>
            </div>
        </section>
    );
};

const Leadership = () => {
    const leaders = leadershipData;
    
    if (leaders.length === 0) {
        return null;
    }

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12 font-[\'Montserrat\'] text-[var(--color-text-primary)]">From The Founders</h2>
                <div className="flex flex-col gap-8 max-w-5xl mx-auto">
                    {leaders.map(leader => (
                        <div key={leader.name} className="bg-[var(--color-background-card)] rounded-lg shadow-md flex flex-col sm:flex-row items-start p-6 sm:p-8 transition-shadow duration-300 hover:shadow-xl">
                            <div className="w-full sm:w-48 flex-shrink-0 mb-6 sm:mb-0 sm:mr-8">
                                <img 
                                    src={leader.img} 
                                    alt={leader.name} 
                                    className="w-full rounded-lg object-cover object-center aspect-[4/5]"
                                    onError={(e) => handleImageError(e, { width: 192, height: 240, text: leader.name })}
                                    loading="lazy"
                                    decoding="async"
                                    width="192"
                                    height="240"
                                />
                            </div>
                            <div className="flex flex-col w-full">
                                <h3 className="text-xl font-bold font-[\'Montserrat\'] text-[var(--color-text-primary)]">{`From the ${leader.role}'s Desk`}</h3>
                                <p className="text-sm text-gray-500 mb-4">{`${leader.role}, Sunshine International School`}</p>
                                
                                {leader.testimonial && <p className="text-[var(--color-text-secondary)] text-base mb-4 flex-grow">"{leader.testimonial}"</p>}
                                
                                <div className="text-right">
                                    <p className="font-semibold text-[var(--color-text-primary)]">{leader.name}</p>
                                    <p className="text-sm text-gray-500">{leader.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}\
                </div>
            </div>
        </section>
    );
};

const Testimonials = () => {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    useEffect(() => {
        if (testimonialsData.length > 1) {
            const timer = setTimeout(() => {
                setCurrentTestimonial(prev => (prev + 1) % testimonialsData.length);
            }, 7000);
            return () => clearTimeout(timer);
        }
    }, [currentTestimonial]);

    const handlePrevTestimonial = () => {
        setCurrentTestimonial(prev => (prev - 1 + testimonialsData.length) % testimonialsData.length);
    };

    const handleNextTestimonial = () => {
        setCurrentTestimonial(prev => (prev + 1) % testimonialsData.length);
    };

    if (testimonialsData.length === 0) return null;

    return (
        <section className="py-16 bg-[var(--color-background-section)]">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12 font-[\'Montserrat\'] text-[var(--color-text-primary)]">What Our Community Says</h2>
                <div className="max-w-3xl mx-auto relative">
                    <div className="relative overflow-hidden min-h-[250px] sm:min-h-[200px]">
                        {testimonialsData.map((testimonial, index) => (
                            <div
                                key={index}
                                className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ease-in-out ${index === currentTestimonial ? 'opacity-100' : 'opacity-0'}`}
                                aria-hidden={index !== currentTestimonial}
                            >
                                <div className="bg-[var(--color-background-card)] p-8 rounded-lg shadow-lg relative h-full flex flex-col items-center text-center">
                                    <img
                                        src={testimonial.img}
                                        alt={testimonial.name}
                                        className="w-20 h-20 rounded-full object-cover border-4 border-white -mt-16 mb-4 shadow-md"
                                        onError={(e) => handleImageError(e, { width: 80, height: 80, text: '👤' })}
                                        loading="lazy"
                                        decoding="async"
                                        width="80"
                                        height="80"
                                    />
                                    <i className="fas fa-quote-left text-2xl text-[var(--color-text-accent)] opacity-30 mb-4"></i>
                                    <p className="text-[var(--color-text-secondary)] italic text-base mb-4 flex-grow">"{testimonial.quote}"</p>
                                    <div>
                                        <h4 className="font-bold font-[\'Montserrat\'] text-[var(--color-text-primary)]">{testimonial.name}</h4>
                                        <p className="text-sm text-gray-500">{testimonial.relation}</p>
                                    </div>
                                </div>
                            </div>
                        ))}\
                    </div>
                    {testimonialsData.length > 1 && (
                        <>
                            <button onClick={handlePrevTestimonial} aria-label="Previous testimonial" className="absolute left-0 top-1/2 -translate-y-1/2 bg-[var(--color-background-card)]/50 text-[var(--color-text-primary)] rounded-full w-10 h-10 hover:bg-[var(--color-background-card)]/80 transition shadow-md -translate-x-6 z-10 hidden sm:flex items-center justify-center">
                                <i className="fas fa-chevron-left"></i>
                            </button>
                            <button onClick={handleNextTestimonial} aria-label="Next testimonial" className="absolute right-0 top-1/2 -translate-y-1/2 bg-[var(--color-background-card)]/50 text-[var(--color-text-primary)] rounded-full w-10 h-10 hover:bg-[var(--color-background-card)]/80 transition shadow-md translate-x-6 z-10 hidden sm:flex items-center justify-center">
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </>
                    )}
                </div>
                 <div className="flex justify-center mt-6 space-x-2">
                    {testimonialsData.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentTestimonial(index)}
                            aria-label={`Go to testimonial ${index + 1}`}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentTestimonial ? 'bg-[var(--color-accent)] scale-125' : 'bg-[var(--color-border)] hover:bg-[var(--color-secondary)]'}`}
                        ></button>
                    ))}\
                </div>
            </div>
        </section>
    );
};


const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    return (
        <section id="faq-section" className="bg-[var(--color-background-body)] py-16 scroll-mt-[75px]">
            <div className="container mx-auto px-4 max-w-3xl">
                <h2 className="text-3xl font-bold text-center mb-8 font-[\'Montserrat\'] text-[var(--color-text-primary)]">Frequently Asked Questions</h2>
                <div className="bg-[var(--color-background-card)] p-4 sm:p-8 rounded-lg shadow-md">
                    {homeFaqData.map((faq, index) => (
                        <FaqItem 
                            key={index} 
                            faq={faq} 
                            isOpen={openIndex === index}
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        />
                    ))}\
                </div>
            </div>
        </section>
    );
};


const Home: React.FC = () => {
  return (
    <>
      <Seo
        title="Sunshine International School (SIS) | Top CBSE School in Purushottampur"
        description="Welcome to Sunshine International School (SIS), a leading CBSE affiliated school in Purushottampur, Ganjam. We offer quality education, fostering academic excellence and holistic development."
        imageUrl="/images/pages/home/hero-1.jpg"
      />
      <Hero />
      <NoticeTicker />
      <div id="quick-links" className="scroll-mt-[75px]">
        <ScrollAnimator>
          <QuickLinks />
        </ScrollAnimator>
        <ScrollAnimator>
          <WhyChooseUs />
        </ScrollAnimator>
        <ScrollAnimator>
          <LatestEvents />
        </ScrollAnimator>
        <ScrollAnimator>
          <section className="py-16 bg-[var(--color-background-section)]">
              <div className="container mx-auto px-4">
                  <div className="grid lg:grid-cols-4 gap-12 items-start">
                      <div className="lg:col-span-3">
                          <SchoolLifeMoments />
                      </div>
                      <div className="lg:col-span-1">
                          <HomepageNotices />
                      </div>
                  </div>
              </div>
          </section>
        </ScrollAnimator>
        <ScrollAnimator>
          <Leadership />
        </ScrollAnimator>
        <ScrollAnimator>
          <Testimonials />
        </ScrollAnimator>
        <ScrollAnimator>
          <FAQ />
        </ScrollAnimator>
      </div>
    </>
  );
};

export default Home;