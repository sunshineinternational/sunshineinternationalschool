import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { fetchNoticesData, fetchTeachersData, fetchEventsData, fetchGalleryData } from '../services/dataService';
import type { Notice, QuickLink, Testimonial, Teacher } from '../types';
import { handleImageError, parseDDMMYYYY } from '../utils';
import { client } from '../lib/sanity';
import { FaqItem } from '../components/common/FaqItem';
import Seo from '../components/common/Seo';
import { schoolLifeMomentsData } from '../data/schoolLifeMoments';
import { homeFaqData } from '../data/faqs';
import { whyChooseUsData } from '../data/whyChooseUs';
import { testimonialsData } from '../data/testimonials';
import ScrollAnimator from '../components/common/ScrollAnimator';
import NoticeTicker from '../components/common/NoticeTicker';
import NoticeSkeleton from '../components/common/NoticeSkeleton';


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
    const [isMobile, setIsMobile] = useState(false); // Default to false for server
    const [isPaused, setIsPaused] = useState(false);
    const [scrollOutput, setScrollOutput] = useState(0);

    // Update isMobile once the browser is ready
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize(); // Check once at start
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const [textIndex, setTextIndex] = useState(0);
    const heroTextWords = ["Leaders", "Innovators", "Scholars"];
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [typingSpeed, setTypingSpeed] = useState(150);

    // Typewriter Effect
    useEffect(() => {
        const handleType = () => {
            const i = textIndex % heroTextWords.length;
            const fullText = heroTextWords[i];

            setDisplayText(isDeleting
                ? fullText.substring(0, displayText.length - 1)
                : fullText.substring(0, displayText.length + 1)
            );

            setTypingSpeed(isDeleting ? 30 : 150);

            if (!isDeleting && displayText === fullText) {
                setTimeout(() => setIsDeleting(true), 1500); // Wait before deleting
            } else if (isDeleting && displayText === '') {
                setIsDeleting(false);
                setTextIndex(prev => prev + 1);
            }
        };

        const timer = setTimeout(handleType, typingSpeed);
        return () => clearTimeout(timer);
    }, [displayText, isDeleting, textIndex, heroTextWords, typingSpeed]);

    const nextSlide = useCallback(() => {
        if (slides.length === 0) return;
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    const prevSlide = useCallback(() => {
        if (slides.length === 0) return;
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }, [slides.length]);

    useEffect(() => {
        if (isPaused) return;
        const slideInterval = setInterval(nextSlide, 6000);
        return () => clearInterval(slideInterval);
    }, [nextSlide, isPaused]);

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

    const handlers = useSwipeable({
        onSwipedLeft: () => nextSlide(),
        onSwipedRight: () => prevSlide(),
        preventScrollOnSwipe: true,
        trackMouse: true
    });

    const scrollToContent = () => {
        const noticesSection = document.getElementById('notices-ticker');
        if (noticesSection) {
            noticesSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' });
        }
    };

    return (
        <section
            className="relative h-screen w-full overflow-hidden flex items-center"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            {...handlers}
        >
            <div
                className="absolute top-0 left-0 w-full h-[130%] z-0"
                style={{ transform: `translateY(${scrollOutput * 0.4 - 50}px)` }} // Parallax with negative start offset
            >
                {slides.map((slide, index) => (
                    <div
                        key={slide.src}
                        className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                    >
                        {slide.type === 'video' ? (
                            <video
                                playsInline
                                autoPlay
                                muted
                                loop
                                poster={slide.poster}
                                className={`w-full h-full object-cover transform ${index === currentSlide ? slide.animationClass : ''}`}
                                onError={() => handleMediaError(slide.src)}
                            >
                                <source src={slide.src} type="video/mp4" />
                            </video>
                        ) : (
                            <img
                                src={slide.src}
                                alt="School Environment"
                                className={`w-full h-full object-cover transform ${index === currentSlide ? slide.animationClass : ''}`}
                                onError={() => handleMediaError(slide.src)}
                            />
                        )}
                        {/* Improved Gradient Overlay: Bottom-up for mobile, Left-right for desktop */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent md:bg-gradient-to-r md:from-black/90 md:via-black/50 md:to-transparent"></div>
                        <div className="absolute inset-0 bg-black/20"></div>
                    </div>
                ))}
            </div>

            {/* Content Container */}
            <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-12 flex flex-col justify-center h-full pt-16 md:pt-0">
                <div className="max-w-4xl animate-fade-in-up text-center md:text-left md:pl-4">

                    {/* Welcome Badge & Play Button Row */}
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-6">
                        <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-wider text-[var(--color-button-text)] uppercase bg-[var(--color-accent)] rounded-full shadow-md drop-shadow-md">
                            Welcome to Excellence
                        </span>
                        {/* Pulsing Play Button */}
                        <a href="/gallery" className="group flex items-center gap-2 text-white/90 hover:text-white transition-colors cursor-pointer">
                            <span className="relative flex h-8 w-8">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-30"></span>
                                <span className="relative inline-flex rounded-full h-8 w-8 bg-white/20 items-center justify-center border border-white/40 group-hover:bg-white/30 transition-colors">
                                    <i className="fas fa-play text-xs pl-0.5"></i>
                                </span>
                            </span>
                            <span className="text-sm font-semibold tracking-wide border-b border-white/0 group-hover:border-white/80 transition-all">Watch Campus Tour</span>
                        </a>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-['Montserrat'] mb-6 leading-tight text-white drop-shadow-xl min-h-[1.2em]">
                        Inspiring Young Minds for <br />
                        <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] to-[#FFE5B4]">
                            {displayText}
                            <span className="animate-pulse text-[var(--color-accent)]">|</span>
                        </span>
                    </h1>

                    <p className="text-lg md:text-2xl mb-10 text-gray-100 font-medium max-w-2xl mx-auto md:mx-0 drop-shadow-md leading-relaxed">
                        A nurturing environment where knowledge meets excellence, empowering students to lead with confidence.
                    </p>

                    {/* Triple CTA Buttons */}
                    <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center md:justify-start">
                        <Link to="/results" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-[var(--color-button-text)] bg-[var(--color-accent)] hover:bg-[#D97706] rounded-full transition-all duration-300 shadow-[0_10px_20px_-10px_rgba(245,158,11,0.5)] hover:shadow-[0_15px_25px_-5px_rgba(245,158,11,0.6)] hover:scale-105 active:scale-95">
                            <span className="flex items-center gap-2 uppercase tracking-wider">
                                <i className="fas fa-graduation-cap"></i>
                                Check 2025-26 Results
                            </span>
                        </Link>

                        <Link to="/admission#inquiry-form" className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-[var(--color-primary)] bg-white border-2 border-white rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] shadow-xl">
                            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-[var(--color-primary)] rounded-full group-hover:w-80 group-hover:h-80 opacity-10"></span>
                            <span className="relative flex items-center gap-2">
                                Enroll for 2026-27
                                <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                            </span>
                        </Link>

                        <a
                            href="https://wa.me/917815087065?text=Hello!%20I%20have%20a%20query%20regarding%20Sunshine%20International%20School."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white border-2 border-white/60 bg-white/5 rounded-full hover:bg-white hover:text-[#25D366] hover:border-white transition-all duration-300 backdrop-blur-sm drop-shadow-md"
                        >
                            <i className="fab fa-whatsapp text-xl mr-2"></i>
                            WhatsApp Query
                        </a>
                    </div>
                </div>
            </div>

            {/* Navigation Dots */}
            <div className="absolute bottom-20 md:bottom-12 left-1/2 transform -translate-x-1/2 z-30 hidden md:flex gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`transition-all duration-500 rounded-full shadow-lg border border-white/20 ${index === currentSlide
                            ? 'w-10 h-3 bg-[var(--color-accent)]'
                            : 'w-3 h-3 bg-white/50 hover:bg-white'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    ></button>
                ))}
            </div>

            <div className="absolute bottom-0 left-0 w-full z-20">
                {/* Scroll Indicator (Floating at bottom) */}
                <div className="flex justify-center pb-8 animate-bounce">
                    <button
                        onClick={scrollToContent}
                        className="text-white/80 hover:text-white transition-colors cursor-pointer"
                        aria-label="Scroll down"
                    >
                        <i className="fas fa-chevron-down text-3xl md:text-2xl filter drop-shadow-lg"></i>
                    </button>
                </div>
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
    <section className="bg-[var(--color-background-body)] py-24">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 font-['Montserrat'] text-[var(--color-text-primary)]">Discover Sunshine International School</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {quickLinksData.map((link) => (
                    <div key={link.title} className="bg-[var(--color-background-card)] p-6 rounded-lg shadow-md text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col">
                        <div className="text-4xl text-[var(--color-text-accent)] mb-4"><i className={link.icon}></i></div>
                        <h3 className="text-xl font-bold mb-2 font-['Montserrat'] text-[var(--color-text-primary)]">{link.title}</h3>
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
    <section className="py-24 bg-[var(--color-background-body)]">
        <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
                <span className="text-[12px] font-extrabold tracking-[0.2em] text-[var(--color-primary)] opacity-50 uppercase mb-3 block">Foundation of Excellence</span>
                <h2 className="text-3xl md:text-5xl font-bold font-['Work_Sans'] text-[var(--color-text-primary)] mb-6">Our Core Pillars</h2>
                <div className="w-20 h-1.5 bg-[var(--color-accent)] mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[180px]">
                {/* Academic Excellence - Large Main Block */}
                <div className="md:col-span-2 md:row-span-2 bg-[#131b2e] text-white p-8 rounded-[20px] relative overflow-hidden group shadow-lg">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-white/10 transition-all duration-700"></div>
                    <div className="relative z-10 h-full flex flex-col justify-end">
                        <div className="w-12 h-12 bg-[var(--color-accent)]/20 rounded-xl flex items-center justify-center mb-4 border border-white/10">
                            <i className="fas fa-graduation-cap text-2xl text-[var(--color-accent)]"></i>
                        </div>
                        <h3 className="text-2xl font-bold font-['Work_Sans'] mb-2">Academic Excellence</h3>
                        <p className="text-white/70 text-sm leading-relaxed max-w-sm">Our rigorous curriculum and dedicated educators foster a culture of curiosity and critical thinking.</p>
                    </div>
                </div>

                {/* Modern Infrastructure - Smaller Secondary */}
                <div className="bg-white p-6 rounded-[20px] shadow-sm border border-black/5 flex flex-col justify-between group hover:shadow-md transition-all duration-500">
                    <div className="w-10 h-10 bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all">
                        <i className="fas fa-building text-lg"></i>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold font-['Work_Sans'] mb-1 text-[var(--color-text-primary)]">Modern Infrastructure</h3>
                        <p className="text-[var(--color-text-secondary)] text-xs leading-relaxed line-clamp-2">State-of-the-art labs, libraries, and smart classrooms for the digital age.</p>
                    </div>
                </div>

                {/* Holistic Development - Smaller Secondary */}
                <div className="bg-white p-6 rounded-[20px] shadow-sm border border-black/5 flex flex-col justify-between group hover:shadow-md transition-all duration-500">
                    <div className="w-10 h-10 bg-[#8B5CF6]/10 rounded-lg flex items-center justify-center text-[#8B5CF6] group-hover:bg-[#8B5CF6] group-hover:text-white transition-all">
                        <i className="fas fa-heart text-lg"></i>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold font-['Work_Sans'] mb-1 text-[var(--color-text-primary)]">Holistic Growth</h3>
                        <p className="text-[var(--color-text-secondary)] text-xs leading-relaxed line-clamp-2">Balancing arts, sports, and value-based education for all students.</p>
                    </div>
                </div>

                {/* Safe & Nurturing - Wide Base Block */}
                <div className="md:col-span-3 bg-[var(--color-accent)] p-6 md:p-10 rounded-[20px] shadow-md flex flex-col md:flex-row items-center gap-6 group">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center shrink-0 border border-white/30 group-hover:scale-110 transition-transform">
                        <i className="fas fa-shield-alt text-2xl text-[var(--color-primary)]"></i>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold font-['Work_Sans'] mb-1 text-[var(--color-primary)]">Safe & Nurturing Environment</h3>
                        <p className="text-[var(--color-primary)] opacity-80 text-md">A secure, child-centric campus where every student feels valued and encouraged.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
);


const SchoolLifeMoments = () => {
    const [moments, setMoments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const loadMoments = async () => {
            const data = await fetchGalleryData();
            // Take the 5 most recent images for a better bento feel
            setMoments(data.slice(0, 5));
            setLoading(false);
        };
        loadMoments();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4 h-[500px]">
                <div className="col-span-2 row-span-2 bg-gray-200 animate-pulse rounded-2xl"></div>
                <div className="bg-gray-200 animate-pulse rounded-2xl"></div>
                <div className="bg-gray-200 animate-pulse rounded-2xl"></div>
                <div className="col-span-2 bg-gray-200 animate-pulse rounded-2xl"></div>
            </div>
        );
    }

    if (moments.length === 0) return null;

    return (
        <section className="py-24 bg-[var(--color-background-body)]">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                    <span className="text-[var(--color-accent)] font-bold text-xs uppercase tracking-[0.3em] mb-2 block">Candid Memories</span>
                    <h2 className="text-3xl md:text-5xl font-bold font-['Work_Sans'] text-[var(--color-text-primary)]">School Life Moments</h2>
                </div>
                <Link to="/gallery" className="inline-flex items-center gap-2 font-bold text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-all group pb-1 border-b-2 border-transparent hover:border-[var(--color-accent)]">
                    Enter Full Gallery
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:h-[600px] auto-rows-[250px] md:auto-rows-auto">
                {/* Image 1 - Large Feature */}
                {moments[0] && (
                    <div className="col-span-2 row-span-2 group relative overflow-hidden rounded-[24px] shadow-sm hover:shadow-2xl transition-all duration-700">
                        <img src={moments[0].src} alt={moments[0].caption} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                            <span className="text-[var(--color-accent)] text-[10px] uppercase font-bold tracking-widest mb-1">{moments[0].event}</span>
                            <h3 className="text-white font-bold text-xl">{moments[0].caption}</h3>
                        </div>
                    </div>
                )}

                {/* Image 2 - Square */}
                {moments[1] && (
                    <div className="col-span-1 row-span-1 group relative overflow-hidden rounded-[24px] shadow-sm hover:shadow-xl transition-all duration-700">
                        <img src={moments[1].src} alt={moments[1].caption} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" loading="lazy" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center p-4">
                            <p className="text-white text-xs font-bold text-center">{moments[1].caption}</p>
                        </div>
                    </div>
                )}

                {/* Image 3 - Square */}
                {moments[2] && (
                    <div className="col-span-1 row-span-1 group relative overflow-hidden rounded-[24px] shadow-sm hover:shadow-xl transition-all duration-700">
                        <img src={moments[2].src} alt={moments[2].caption} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" loading="lazy" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center p-4">
                            <p className="text-white text-xs font-bold text-center">{moments[2].caption}</p>
                        </div>
                    </div>
                )}

                {/* Image 4 - Wide Feature */}
                {moments[3] && (
                    <div className="col-span-2 row-span-1 group relative overflow-hidden rounded-[24px] shadow-sm hover:shadow-xl transition-all duration-700">
                        <img src={moments[3].src} alt={moments[3].caption} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                            <h3 className="text-white font-bold text-sm">{moments[3].caption}</h3>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const InstitutionalNotices = () => {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadNotices = async () => {
            try {
                const data = await fetchNoticesData();
                const sorted = (data as Notice[]).sort((a, b) => parseDDMMYYYY(b.date).getTime() - parseDDMMYYYY(a.date).getTime());
                setNotices(sorted.slice(0, 10));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadNotices();
    }, []);

    return (
        <div className="bg-[#131b2e] text-white p-8 rounded-[16px] h-full flex flex-col shadow-2xl border border-white/5 relative overflow-hidden group">
            {/* Soft glow/crest decoration for empty space */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[var(--color-accent)]/5 rounded-full blur-3xl group-hover:bg-[var(--color-accent)]/10 transition-all duration-700"></div>
            
            <div className="flex items-center gap-4 mb-10 relative z-10">
                <div className="w-12 h-12 bg-[var(--color-accent)]/20 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-[var(--color-accent)] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>notifications_active</span>
                </div>
                <div>
                    <h3 className="text-2xl font-bold font-['Work_Sans'] tracking-tight">Latest Notices</h3>
                    <p className="text-[var(--color-accent)] text-[10px] uppercase tracking-widest font-bold">Official Updates</p>
                </div>
            </div>
            
            <div className="flex-grow overflow-y-auto no-scrollbar space-y-2 relative z-10">
                {loading ? (
                    [1, 2, 3, 4].map(i => (
                        <div key={i} className="animate-pulse py-4 border-b border-white/5 space-y-2">
                            <div className="h-2 bg-white/10 rounded w-1/4"></div>
                            <div className="h-4 bg-white/20 rounded w-full"></div>
                        </div>
                    ))
                ) : (
                    notices.map((notice, index) => (
                        <a key={index} href={notice.url} target="_blank" rel="noopener noreferrer" className="block group/item py-5 border-b border-white/5 hover:border-[var(--color-accent)]/30 transition-all">
                            <div className="flex items-start gap-3">
                                <div className="mt-1 w-1 h-1 rounded-full bg-[var(--color-accent)] shrink-0 group-hover/item:scale-150 transition-transform"></div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-[var(--color-accent)] font-bold uppercase tracking-wider">{notice.date}</p>
                                    <h4 className="font-medium text-white/90 group-hover/item:text-white transition-colors leading-relaxed">
                                        {notice.title}
                                    </h4>
                                </div>
                            </div>
                        </a>
                    ))
                )}
                {!loading && notices.length < 3 && (
                    <div className="py-10 opacity-30 text-center">
                        <span className="material-symbols-outlined text-4xl mb-2">history_edu</span>
                        <p className="text-xs">More updates coming soon</p>
                    </div>
                )}
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
                <Link to="/notices" className="flex items-center justify-between w-full group/btn">
                    <span className="text-sm font-bold text-[var(--color-accent)] group-hover/btn:tracking-widest transition-all uppercase tracking-wider">View All Notices</span>
                    <span className="material-symbols-outlined text-[var(--color-accent)] text-xl group-hover/btn:translate-x-2 transition-transform">arrow_right_alt</span>
                </Link>
            </div>
        </div>
    );
};

const InstitutionalHighlights = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const data = await fetchEventsData();
                setEvents(data.slice(0, 6));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadEvents();
    }, []);

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[var(--color-primary)] text-3xl">event_upcoming</span>
                    <h3 className="text-2xl font-bold font-['Work_Sans'] tracking-tight text-[var(--color-text-primary)]">Highlights & Events</h3>
                </div>
                <Link to="/events" className="text-sm font-bold text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors hidden sm:block">
                    View All Events &rarr;
                </Link>
            </div>
            
            <div className="flex gap-6 overflow-x-auto no-scrollbar snap-scroll pb-6 h-full">
                {loading ? (
                    [1, 2].map(i => <div key={i} className="shrink-0 w-full md:w-[420px] bg-white rounded-[16px] overflow-hidden shadow-sm animate-pulse h-full"></div>)
                ) : (
                    events.map((event, index) => (
                        <div key={index} className="snap-center shrink-0 w-full md:w-[420px] flex flex-col bg-white rounded-[16px] overflow-hidden group shadow-sm hover:shadow-xl transition-all border border-black/5">
                            {/* Image Part */}
                            <div className="relative aspect-[16/9] overflow-hidden">
                                <img 
                                    src={event.img} 
                                    alt={event.title} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/pages/home/hero-1.jpg'; }}
                                    loading="lazy"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-[var(--color-accent)] text-[var(--color-primary)] text-[10px] font-bold rounded-full uppercase tracking-tighter shadow-lg">
                                        {event.date}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Content Part */}
                            <div className="p-6 flex flex-col justify-between flex-grow bg-white">
                                <div>
                                    <h4 className="text-[var(--color-text-primary)] text-xl font-bold leading-tight mb-3 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2 min-h-[56px] font-['Work_Sans']">
                                        {event.title}
                                    </h4>
                                    <p className="text-[var(--color-text-secondary)] text-sm line-clamp-3 leading-relaxed mb-6 italic">
                                        "{event.description}"
                                    </p>
                                </div>
                                <div className="pt-4 border-t border-gray-100 mt-auto flex items-center justify-between">
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Featured Highlight</span>
                                    <span className="material-symbols-outlined text-[var(--color-primary)] group-hover:translate-x-1 transition-transform">arrow_forward_ios</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const InstitutionalPulse = () => {
    return (
        <section className="py-24 bg-[var(--color-background-body)] relative">
            {/* Subtle background element for the pulse section */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-[var(--color-accent)]/5 rounded-l-full blur-3xl -z-10"></div>
            
            <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
                    {/* Notices Column - Dynamic but minimum matching height */}
                    <div className="lg:col-span-4 min-h-[580px] h-full flex flex-col">
                        <InstitutionalNotices />
                    </div>
                    
                    {/* Highlights Column */}
                    <div className="lg:col-span-8 h-full flex flex-col">
                        <InstitutionalHighlights />
                    </div>
                </div>
            </div>
        </section>
    );
};


const Leadership = () => {
    const [leaders, setLeaders] = useState<Teacher[]>([]);
    
    useEffect(() => {
        const loadLeaders = async () => {
            const data = await fetchTeachersData();
            // Filter sanity data for leadership roles
            const sanityLeaders = data.filter(t => 
                t.role.toLowerCase().includes('principal') || 
                t.role.toLowerCase().includes('president') ||
                t.role.toLowerCase().includes('chairman')
            );
            
            // Sort by priority (President first, then Principal)
            const sorted = sanityLeaders.sort((a, b) => {
                const getOrder = (role: string) => {
                    if (role.toLowerCase().includes('president')) return 1;
                    if (role.toLowerCase().includes('principal')) return 2;
                    return 3;
                };
                return getOrder(a.role) - getOrder(b.role);
            });

            setLeaders(sorted);
        };
        loadLeaders();
    }, []);

    if (leaders.length === 0) {
        return null;
    }

    return (
        <section className="py-24 bg-[var(--color-background-body)] border-t border-black/5">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 text-[10px] font-bold tracking-widest text-[var(--color-primary)] uppercase bg-[var(--color-accent)]/20 rounded-full mb-4">
                        Leadership Reflection
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold font-['Work_Sans'] text-[var(--color-text-primary)]">From The Founders</h2>
                </div>
                <div className="flex flex-col gap-12 max-w-4xl mx-auto">
                    {leaders.map(leader => (
                        <div key={leader.name} className="bg-[var(--color-background-card)] rounded-lg shadow-lg flex flex-col md:flex-row items-center p-6 sm:p-8 transition-shadow duration-300 hover:shadow-xl overflow-hidden">
                            <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8 text-center">
                                <img
                                    src={leader.img}
                                    alt={leader.name}
                                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover object-center mx-auto border-4 border-[var(--color-background-section)] shadow-md"
                                    onError={(e) => { e.currentTarget.onerror = null; handleImageError(e, { width: 160, height: 160, text: leader.name }); }}
                                    loading="lazy"
                                    decoding="async"
                                    width="160"
                                    height="160"
                                />
                            </div>
                            <div className="flex flex-col w-full text-center md:text-left">
                                <h3 className="text-2xl font-bold font-['Montserrat'] text-[var(--color-text-primary)]">{`From the ${leader.role}'s Desk`}</h3>
                                <p className="text-md text-gray-500 mb-4">{`${leader.role}, Sunshine International School`}</p>

                                {leader.testimonial && (
                                    <blockquote className="relative text-[var(--color-text-secondary)] text-base italic mb-6 flex-grow">
                                        <i className="fas fa-quote-left absolute -top-2 -left-4 text-2xl text-[var(--color-border)] opacity-80"></i>
                                        <p className="pl-2">{leader.testimonial}</p>
                                    </blockquote>
                                )}

                                <div className="mt-auto md:text-right">
                                    <p className="font-semibold text-lg text-[var(--color-text-primary)]">{leader.name}</p>
                                    <p className="text-sm text-gray-500">{leader.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
const Testimonials = () => (
    <section className="bg-[var(--color-background-body)] py-24 border-t border-black/5 overflow-hidden">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
                <span className="inline-block px-4 py-1.5 text-[10px] font-bold tracking-widest text-[var(--color-primary)] uppercase bg-[var(--color-accent)]/20 rounded-full mb-4">
                    Community Voices
                </span>
                <h2 className="text-3xl md:text-5xl font-bold mb-4 font-['Work_Sans'] text-[var(--color-text-primary)]">Voices of our Community</h2>
                <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto">Hear from the parents and alumni who have experienced the sunshine approach to excellence.</p>
            </div>
            
            <div className="flex gap-6 overflow-x-auto no-scrollbar snap-scroll px-4 pb-8">
                {testimonialsData.map((testimonial, index) => (
                    <div key={index} className="snap-center shrink-0 w-[85%] md:w-[600px] bg-[var(--color-background-card)] p-8 md:p-10 rounded-[12px] shadow-sm relative border border-black/5 hover:shadow-md transition-shadow">
                        <span className="material-symbols-outlined text-[var(--color-accent)] absolute top-6 right-6 text-6xl opacity-20 pointer-events-none" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
                        <p className="text-lg md:text-xl leading-relaxed text-[var(--color-text-primary)] italic mb-8 relative z-10">"{testimonial.quote}"</p>
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 border-2 border-[var(--color-accent)]/30">
                                <img 
                                    src={testimonial.img} 
                                    alt={testimonial.name} 
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.currentTarget.onerror = null; handleImageError(e, { text: testimonial.name.charAt(0) }); }}
                                />
                            </div>
                            <div>
                                <p className="font-bold text-[var(--color-text-primary)] text-lg">{testimonial.name}</p>
                                <p className="text-sm text-[var(--color-text-secondary)] font-medium">{testimonial.relation}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);


const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    return (
        <section id="faq-section" className="relative bg-[var(--color-background-body)] py-24 scroll-mt-[75px]">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 text-[10px] font-bold tracking-widest text-[var(--color-primary)] uppercase bg-[var(--color-accent)]/20 rounded-full mb-4">
                        Knowledge Hub
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold font-['Work_Sans'] text-[var(--color-text-primary)] mb-4">Frequently Asked Questions</h2>
                    <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto">Providing clear answers to help you navigate our academic environment and community life.</p>
                </div>

                <div className="space-y-4">
                    {homeFaqData.map((faq, index) => (
                        <div 
                            key={index} 
                            className={`group border border-black/5 rounded-[12px] transition-all duration-300 ${openIndex === index ? 'bg-white shadow-lg ring-1 ring-[var(--color-accent)]/30' : 'bg-white/50 hover:bg-white'}`}
                        >
                            <button 
                                onClick={() => setOpenIndex(openIndex === index ? null : index)} 
                                className="w-full text-left flex justify-between items-center py-6 px-6 sm:px-8 focus:outline-none"
                            >
                                <span className={`font-bold text-lg font-['Work_Sans'] transition-colors ${openIndex === index ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-primary)]'}`}>
                                    {faq.q}
                                </span>
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${openIndex === index ? 'bg-[var(--color-primary)] text-white rotate-180' : 'bg-gray-100 text-gray-400'}`}>
                                    <span className="material-symbols-outlined text-xl">
                                        {openIndex === index ? 'remove' : 'add'}
                                    </span>
                                </span>
                            </button>
                            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === index ? 'max-h-96' : 'max-h-0'}`}>
                                <div className="px-6 sm:px-8 pb-8">
                                    <div className="h-px bg-gray-100 mb-6"></div>
                                    <p className="text-[var(--color-text-secondary)] leading-relaxed text-md">
                                        {faq.a}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-16 text-center">
                    <div className="inline-flex items-center gap-6 p-6 bg-[var(--color-primary)] text-white rounded-[16px] shadow-xl">
                        <div className="hidden sm:flex w-12 h-12 bg-white/10 rounded-full items-center justify-center">
                            <span className="material-symbols-outlined">contact_support</span>
                        </div>
                        <div className="text-left">
                            <p className="text-sm opacity-80 font-medium">Have more questions?</p>
                            <p className="font-bold">Contact our Admissions Office today</p>
                        </div>
                        <Link to="/contact" className="px-6 py-2.5 bg-[var(--color-accent)] text-[var(--color-primary)] font-bold rounded-full hover:scale-105 transition-transform text-sm">
                            Ask Us
                        </Link>
                    </div>
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
            <div id="notices-ticker">
                <NoticeTicker />
            </div>
            <div id="main-content" className="scroll-mt-[75px]">
                <ScrollAnimator>
                    <QuickLinks />
                </ScrollAnimator>
                
                <ScrollAnimator>
                    {/* Live Updates & Cinematic Highlights */}
                    <InstitutionalPulse />
                </ScrollAnimator>

                <ScrollAnimator>
                    <WhyChooseUs />
                </ScrollAnimator>

                <ScrollAnimator>
                    {/* School Life Moments */}
                    <section className="py-20 bg-[var(--color-background-body)]">
                        <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
                            <SchoolLifeMoments />
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
