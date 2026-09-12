import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { fetchNoticesData, fetchTeachersData, fetchEventsData, fetchGalleryData } from '../services/dataService';
import type { Notice, QuickLink, Testimonial, Teacher, Event } from '../types';
import { handleImageError, parseDDMMYYYY } from '../utils';
import { client } from '../lib/sanity';
import { FaqItem } from '../components/common/FaqItem';
import Seo from '../components/common/Seo';
import { schoolLifeMomentsData } from '../data/schoolLifeMoments';
import { homeFaqData } from '../data/faqs';
import { testimonialsData } from '../data/testimonials';
import ScrollAnimator from '../components/common/ScrollAnimator';
import NoticeTicker from '../components/common/NoticeTicker';
import NoticeSkeleton from '../components/common/NoticeSkeleton';
import { fetchHomeSettings } from '../services/dataService';
import { heroSlidesData, featuredHomeGallery } from '../data/homeConfig';
import EventDetailModal from '../components/common/EventDetailModal';


const Hero: React.FC = () => {
    const [slides, setSlides] = useState(heroSlidesData);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isMobile, setIsMobile] = useState(false); // Default to false for server
    const [isPaused, setIsPaused] = useState(false);
    const [scrollOutput, setScrollOutput] = useState(0);

    // Live Sanity Data
    useEffect(() => {
        const syncHomeSettings = async () => {
            const liveData = await fetchHomeSettings();
            if (liveData) {
                if (liveData.heroSlides && liveData.heroSlides.length > 0) {
                    setSlides(liveData.heroSlides);
                }
            }
        };
        syncHomeSettings();
    }, []);

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

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-['Montserrat'] mb-6 leading-tight text-white drop-shadow-xl min-h-[1.2em]">
                        Inspiring Young Minds for <br />
                        <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] to-[#FFE5B4]">
                            {displayText}
                            <span className="animate-pulse text-[var(--color-accent)]">|</span>
                        </span>
                    </h1>

                    <p className="text-base md:text-xl mb-10 text-gray-100 font-medium max-w-2xl mx-auto md:mx-0 drop-shadow-md leading-relaxed">
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

const Counter = ({ target, duration = 2000, suffix = "" }: { target: number, duration?: number, suffix?: string }) => {
    const [count, setCount] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasStarted) {
                    setHasStarted(true);
                }
            },
            { threshold: 0.1 }
        );

        if (elementRef.current) observer.observe(elementRef.current);
        return () => observer.disconnect();
    }, [hasStarted]);

    useEffect(() => {
        if (!hasStarted) return;

        let startTime: number | null = null;
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            
            // Ease-out cubic for premium deceleration
            const easeOut = 1 - Math.pow(1 - percentage, 3);
            setCount(Math.floor(easeOut * target));

            if (percentage < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [hasStarted, target, duration]);

    return (
        <div ref={elementRef} className="font-['Montserrat'] font-extrabold text-3xl md:text-5xl text-[var(--color-accent)] drop-shadow-sm">
            {count}{suffix}
        </div>
    );
};

const ImpactGrid = () => (
    <section className="bg-[#131b2e] py-16 relative overflow-hidden">
        {/* Subtle background crest / glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-accent)]/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
                <div className="text-center group">
                    <Counter target={14} suffix="+" />
                    <p className="mt-4 text-white/90 font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs">Years of Legacy</p>
                    <div className="w-10 h-1.5 bg-[var(--color-accent)] mx-auto mt-6 rounded-full group-hover:w-20 transition-all duration-500 shadow-[0_0_15px_rgba(255,185,21,0.5)]"></div>
                </div>

                <div className="text-center group">
                    <Counter target={100} suffix="%" />
                    <p className="mt-4 text-white/90 font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs">Board Success</p>
                    <div className="w-10 h-1.5 bg-[var(--color-accent)] mx-auto mt-6 rounded-full group-hover:w-20 transition-all duration-500 shadow-[0_0_15px_rgba(255,185,21,0.5)]"></div>
                </div>

                <div className="text-center group">
                    <Counter target={18} suffix=":1" />
                    <p className="mt-4 text-white/90 font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs">Student-Teacher Ratio</p>
                    <div className="w-10 h-1.5 bg-[var(--color-accent)] mx-auto mt-6 rounded-full group-hover:w-20 transition-all duration-500 shadow-[0_0_15px_rgba(255,185,21,0.5)]"></div>
                </div>

                <div className="text-center group">
                    <Counter target={50} suffix="+" />
                    <p className="mt-4 text-white/90 font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs">Annual Activities</p>
                    <div className="w-10 h-1.5 bg-[var(--color-accent)] mx-auto mt-6 rounded-full group-hover:w-20 transition-all duration-500 shadow-[0_0_15px_rgba(255,185,21,0.5)]"></div>
                </div>
            </div>
        </div>
    </section>
);

const QuickLinks = () => (
    <section className="bg-[var(--color-background-body)] py-14">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-10 font-['Work_Sans'] text-[var(--color-text-primary)] tracking-tight">Discover Sunshine International</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickLinksData.map((link) => (
                    <div key={link.title} className="bg-[var(--color-background-card)] p-6 md:p-7 rounded-[20px] shadow-sm text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-200/50 flex flex-col border border-blue-100 group">
                        <div className="text-3xl text-[var(--color-text-primary)] mb-5 transition-transform duration-500 group-hover:scale-110"><i className={link.icon}></i></div>
                        <h3 className="text-lg font-bold mb-2 font-['Work_Sans'] text-[var(--color-text-primary)]">{link.title}</h3>
                        <p className="text-[var(--color-text-secondary)] mb-6 text-xs leading-relaxed flex-grow">{link.description}</p>
                        <Link to={link.path} className="font-bold text-[var(--color-text-primary)] hover:text-[var(--color-text-accent)] mt-auto inline-flex items-center gap-2 group/link mx-auto">
                            Learn More 
                            <span className="material-symbols-outlined text-sm group-hover/link:translate-x-1 transition-transform">arrow_forward</span>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    </section>
);



const SchoolLifeMoments = () => {
    const [moments, setMoments] = useState(featuredHomeGallery);
    const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const syncGallery = async () => {
            const liveData = await fetchHomeSettings();
            if (liveData && liveData.featuredGallery && liveData.featuredGallery.length > 0) {
                setMoments(liveData.featuredGallery);
            }
        };
        syncGallery();
    }, []);

    // Guaranteed safe 8-item array preventing array undefined crashes
    const safeMoments = moments.length >= 8 
        ? moments 
        : [...moments, ...featuredHomeGallery].slice(0, 8);

    // Close lightbox on Escape and support Left/Right arrow navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (activeLightboxIndex === null) return;
            if (e.key === 'Escape') setActiveLightboxIndex(null);
            if (e.key === 'ArrowRight') setActiveLightboxIndex((prev) => (prev !== null ? (prev + 1) % safeMoments.length : 0));
            if (e.key === 'ArrowLeft') setActiveLightboxIndex((prev) => (prev !== null ? (prev - 1 + safeMoments.length) % safeMoments.length : 0));
        };
        if (activeLightboxIndex !== null) {
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [activeLightboxIndex, safeMoments.length]);

    const m0 = safeMoments[0] || featuredHomeGallery[0];
    const m1 = safeMoments[1] || featuredHomeGallery[1];
    const m2 = safeMoments[2] || featuredHomeGallery[2];
    const m3 = safeMoments[3] || featuredHomeGallery[3];

    return (
        <section className="py-14 bg-[var(--color-background-body)] border-t border-blue-100/30">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header with Prominent Enlarge Hints */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 md:mb-10 gap-4">
                    <div>
                        <span className="text-[var(--color-accent)] font-bold text-[10px] uppercase tracking-[0.3em] mb-1.5 block">
                            Curated Memories
                        </span>
                        <h2 className="text-2xl md:text-4xl font-bold font-['Work_Sans'] text-[var(--color-text-primary)] tracking-tight">
                            School Life Moments
                        </h2>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                        {/* Visible on Mobile */}
                        <span className="inline-flex sm:hidden items-center gap-1.5 text-xs text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100/80 font-bold">
                            <span className="material-symbols-outlined text-xs text-blue-600">zoom_in</span>
                            Tap photo to enlarge
                        </span>
                        {/* Visible on Desktop */}
                        <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                            <span className="material-symbols-outlined text-sm text-[var(--color-accent)]">zoom_in</span>
                            Click any photo to enlarge
                        </span>
                        <Link to="/gallery" className="inline-flex items-center gap-1.5 font-bold text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-all group pb-0.5 border-b border-transparent hover:border-[var(--color-accent)] text-xs sm:text-sm">
                            <span>Enter Full Gallery</span>
                            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </Link>
                    </div>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:h-[700px] auto-rows-[180px] sm:auto-rows-[200px] md:auto-rows-auto">
                    {/* 1. Large Feature (2x2) */}
                    <div 
                        onClick={() => setActiveLightboxIndex(0)}
                        role="button"
                        tabIndex={0}
                        aria-label={`Enlarge photo: ${m0.caption}`}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveLightboxIndex(0); } }}
                        className="col-span-2 row-span-2 group relative overflow-hidden rounded-[20px] shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] bg-gray-100"
                    >
                        <img src={m0.src} alt={m0.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                        
                        {/* Mobile Zoom Cue Icon */}
                        <span className="absolute bottom-2.5 right-2.5 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center sm:hidden backdrop-blur-md shadow-md pointer-events-none">
                            <span className="material-symbols-outlined text-xs">zoom_in</span>
                        </span>
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[9px] font-bold sm:hidden">
                            {m0.event}
                        </span>

                        {/* Desktop Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 hidden sm:flex flex-col justify-end p-6">
                            <div className="flex items-end justify-between gap-3">
                                <div>
                                    <span className="text-[var(--color-accent)] text-[9px] uppercase font-extrabold tracking-widest mb-1 block">{m0.event}</span>
                                    <h3 className="text-white font-bold text-lg leading-tight">{m0.caption}</h3>
                                </div>
                                <span className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-base">zoom_in</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 2. Wide Snapshot (2x1) */}
                    <div 
                        onClick={() => setActiveLightboxIndex(1)}
                        role="button"
                        tabIndex={0}
                        aria-label={`Enlarge photo: ${m1.caption}`}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveLightboxIndex(1); } }}
                        className="col-span-2 row-span-1 group relative overflow-hidden rounded-[20px] shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] bg-gray-100"
                    >
                        <img src={m1.src} alt={m1.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                        
                        {/* Mobile Zoom Cue Icon */}
                        <span className="absolute bottom-2.5 right-2.5 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center sm:hidden backdrop-blur-md shadow-md pointer-events-none">
                            <span className="material-symbols-outlined text-xs">zoom_in</span>
                        </span>

                        {/* Desktop Hover Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 hidden sm:flex items-center justify-between p-5">
                            <div>
                                <span className="text-[var(--color-accent)] text-[9px] uppercase font-extrabold tracking-widest mb-0.5 block">{m1.event}</span>
                                <p className="text-white text-sm font-bold leading-snug">{m1.caption}</p>
                            </div>
                            <span className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center flex-shrink-0">
                                <span className="material-symbols-outlined text-sm">zoom_in</span>
                            </span>
                        </div>
                    </div>

                    {/* 3. Accent Square */}
                    <div 
                        onClick={() => setActiveLightboxIndex(2)}
                        role="button"
                        tabIndex={0}
                        aria-label={`Enlarge photo: ${m2.caption}`}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveLightboxIndex(2); } }}
                        className="col-span-1 row-span-1 group relative overflow-hidden rounded-[20px] shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] bg-gray-100"
                    >
                        <img src={m2.src} alt={m2.caption} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                        
                        {/* Mobile Zoom Cue Icon */}
                        <span className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center sm:hidden backdrop-blur-md shadow-md pointer-events-none">
                            <span className="material-symbols-outlined text-[10px]">zoom_in</span>
                        </span>

                        {/* Desktop Hover Overlay */}
                        <div className="absolute inset-0 bg-[var(--color-primary)]/80 opacity-0 group-hover:opacity-100 transition-all duration-300 hidden sm:flex flex-col justify-between p-4">
                            <span className="text-[var(--color-accent)] text-[8px] uppercase font-extrabold tracking-widest">{m2.event}</span>
                            <p className="text-white text-xs font-bold leading-tight line-clamp-2">{m2.caption}</p>
                        </div>
                    </div>

                    {/* 4. Accent Square */}
                    <div 
                        onClick={() => setActiveLightboxIndex(3)}
                        role="button"
                        tabIndex={0}
                        aria-label={`Enlarge photo: ${m3.caption}`}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveLightboxIndex(3); } }}
                        className="col-span-1 row-span-1 group relative overflow-hidden rounded-[20px] shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] bg-gray-100"
                    >
                        <img src={m3.src} alt={m3.caption} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                        
                        {/* Mobile Zoom Cue Icon */}
                        <span className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center sm:hidden backdrop-blur-md shadow-md pointer-events-none">
                            <span className="material-symbols-outlined text-[10px]">zoom_in</span>
                        </span>

                        {/* Desktop Hover Overlay */}
                        <div className="absolute inset-0 bg-[var(--color-primary)]/80 opacity-0 group-hover:opacity-100 transition-all duration-300 hidden sm:flex flex-col justify-between p-4">
                            <span className="text-[var(--color-accent)] text-[8px] uppercase font-extrabold tracking-widest">{m3.event}</span>
                            <p className="text-white text-xs font-bold leading-tight line-clamp-2">{m3.caption}</p>
                        </div>
                    </div>

                    {/* 5-8. Bottom Row Snapshots */}
                    {[4, 5, 6, 7].map((idx) => {
                        const m = safeMoments[idx] || featuredHomeGallery[idx % featuredHomeGallery.length];
                        return (
                            <div 
                                key={idx} 
                                onClick={() => setActiveLightboxIndex(idx)}
                                role="button"
                                tabIndex={0}
                                aria-label={`Enlarge photo: ${m.caption}`}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveLightboxIndex(idx); } }}
                                className="col-span-1 row-span-1 group relative overflow-hidden rounded-[20px] shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] bg-gray-100"
                            >
                                <img src={m.src} alt={m.caption} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                                
                                {/* Mobile Zoom Cue Icon */}
                                <span className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center sm:hidden backdrop-blur-md shadow-md pointer-events-none">
                                    <span className="material-symbols-outlined text-[10px]">zoom_in</span>
                                </span>

                                {/* Desktop Hover Overlay */}
                                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-300 hidden sm:flex flex-col justify-between p-3.5">
                                    <span className="text-[var(--color-accent)] text-[8px] font-bold uppercase tracking-wider">{m.event}</span>
                                    <p className="text-white text-[10px] font-semibold leading-tight line-clamp-2">{m.caption}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Portal-Mounted Lightbox Dialog */}
            {mounted && activeLightboxIndex !== null && safeMoments[activeLightboxIndex] && createPortal(
                <div 
                    className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-md flex flex-col justify-between items-center p-3 sm:p-6 select-none animate-fade-in"
                    onClick={() => setActiveLightboxIndex(null)}
                >
                    {/* Top Control Bar */}
                    <div className="w-full max-w-6xl flex items-center justify-between text-white z-20 shrink-0 pt-1 sm:pt-0">
                        <div className="flex items-center gap-2.5">
                            <span className="px-3 py-1 rounded-full bg-[var(--color-accent)] text-[#002A45] text-xs font-black uppercase tracking-wider shadow-sm">
                                {safeMoments[activeLightboxIndex].event || 'School Life'}
                            </span>
                            <span className="text-xs text-white/80 font-semibold bg-white/15 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                                {activeLightboxIndex + 1} / {safeMoments.length}
                            </span>
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveLightboxIndex(null);
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
                                setActiveLightboxIndex((prev) => (prev !== null ? (prev - 1 + safeMoments.length) % safeMoments.length : 0));
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
                                src={safeMoments[activeLightboxIndex].src}
                                alt={safeMoments[activeLightboxIndex].caption}
                                className="max-w-full max-h-[72vh] sm:max-h-[78vh] object-contain rounded-2xl shadow-2xl animate-scale-in"
                            />
                        </div>

                        {/* Right Chevron */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveLightboxIndex((prev) => (prev !== null ? (prev + 1) % safeMoments.length : 0));
                            }}
                            aria-label="Next photo"
                            className="absolute right-1 sm:right-4 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all hover:scale-105 active:scale-95 border border-white/20 shadow-xl"
                        >
                            <span className="material-symbols-outlined text-2xl">chevron_right</span>
                        </button>
                    </div>

                    {/* Bottom Caption & Thumbnail Indicators */}
                    <div className="w-full max-w-2xl text-center shrink-0 pb-2 z-20" onClick={(e) => e.stopPropagation()}>
                        <p className="text-white text-sm sm:text-base font-medium px-4 leading-relaxed font-['Work_Sans'] drop-shadow-md">
                            {safeMoments[activeLightboxIndex].caption}
                        </p>

                        {/* Dot Progress Indicators */}
                        <div className="flex items-center justify-center gap-1.5 mt-2.5">
                            {safeMoments.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveLightboxIndex(i)}
                                    aria-label={`Jump to photo ${i + 1}`}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                        activeLightboxIndex === i
                                            ? 'w-6 bg-[var(--color-accent)]'
                                            : 'w-2 bg-white/30 hover:bg-white/60'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </section>
    );
};

/**
 * Helper to humanize dates for notices and events
 */
const formatDisplayDate = (dateStr: string): string => {
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

const isRecentNotice = (dateStr: string): boolean => {
    const d = parseDDMMYYYY(dateStr);
    if (isNaN(d.getTime())) return false;
    return (Date.now() - d.getTime()) < 14 * 24 * 60 * 60 * 1000;
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
                console.error("Failed to load notices:", err);
            } finally {
                setLoading(false);
            }
        };
        loadNotices();
    }, []);

    return (
        <div className="bg-gradient-to-b from-[#00253f] via-[#001e33] to-[#001727] text-white p-6 sm:p-7 rounded-[24px] h-full flex flex-col shadow-2xl border border-white/10 relative overflow-hidden group">
            {/* Ambient Gold Glow */}
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-[var(--color-accent)]/15 rounded-full blur-3xl pointer-events-none group-hover:bg-[var(--color-accent)]/20 transition-all duration-700"></div>

            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-6 relative z-10">
                <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 bg-[var(--color-accent)]/20 rounded-2xl flex items-center justify-center border border-[var(--color-accent)]/30 text-[var(--color-accent)] shadow-inner">
                        <i className="fas fa-bullhorn text-xl"></i>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-2xl font-bold font-['Work_Sans'] tracking-tight text-white">Latest Notices</h3>
                        </div>
                        <p className="text-[var(--color-accent)] text-[10px] uppercase tracking-widest font-extrabold mt-0.5">Circulars & Announcements</p>
                    </div>
                </div>
                {notices.length > 0 && (
                    <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-white/80 text-[11px] font-semibold border border-white/10">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]"></span>
                        {notices.length} Circulars
                    </span>
                )}
            </div>

            {/* Scrollable Notice List */}
            <div className="flex-grow overflow-y-auto custom-scrollbar space-y-3 pr-1 max-h-[480px] relative z-10">
                {loading ? (
                    [1, 2, 3, 4].map(i => (
                        <div key={i} className="animate-pulse bg-white/5 border border-white/5 rounded-xl p-4 space-y-2">
                            <div className="h-2.5 bg-white/10 rounded w-1/3"></div>
                            <div className="h-4 bg-white/20 rounded w-full"></div>
                        </div>
                    ))
                ) : notices.length > 0 ? (
                    notices.map((notice, index) => {
                        const isNew = isRecentNotice(notice.date);
                        const isExternal = notice.url && notice.url !== '#';
                        return (
                            <a
                                key={index}
                                href={notice.url}
                                target={isExternal ? "_blank" : "_self"}
                                rel={isExternal ? "noopener noreferrer" : undefined}
                                className="block bg-white/[0.04] hover:bg-white/[0.09] border border-white/5 hover:border-[var(--color-accent)]/40 rounded-xl p-4 transition-all duration-300 group/item shadow-sm hover:translate-x-1"
                            >
                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <i className="far fa-calendar-alt text-[var(--color-accent)] text-xs"></i>
                                        <span className="text-[11px] font-bold text-[var(--color-accent)] tracking-wide">
                                            {formatDisplayDate(notice.date)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        {isNew && (
                                            <span className="px-1.5 py-0.5 rounded-md bg-[var(--color-accent)] text-[#002A45] text-[9px] font-black uppercase tracking-wider shadow-sm">
                                                NEW
                                            </span>
                                        )}
                                        {isExternal && (
                                            <i className="fas fa-external-link-alt text-[10px] text-white/40 group-hover/item:text-white transition-colors"></i>
                                        )}
                                    </div>
                                </div>
                                <h4 className="font-medium text-white/90 group-hover/item:text-white transition-colors leading-snug line-clamp-2 text-sm">
                                    {notice.title}
                                </h4>
                            </a>
                        );
                    })
                ) : (
                    <div className="py-16 text-center text-white/50">
                        <i className="far fa-bell-slash text-3xl mb-3 block"></i>
                        <p className="text-sm font-medium">No notices published at this moment.</p>
                        <p className="text-xs text-white/30 mt-1">Check back later for school circulars.</p>
                    </div>
                )}
            </div>

            {/* Footer Link */}
            <div className="mt-5 pt-4 border-t border-white/10 relative z-10">
                <Link 
                    to="/notices" 
                    className="flex items-center justify-between w-full text-xs font-bold text-[var(--color-accent)] hover:text-white transition-colors group/btn py-1"
                >
                    <span className="uppercase tracking-wider">View All Circulars & Archive</span>
                    <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center group-hover/btn:bg-[var(--color-accent)] group-hover/btn:text-[#002A45] transition-all duration-300">
                        <i className="fas fa-arrow-right text-xs group-hover/btn:translate-x-0.5 transition-transform"></i>
                    </span>
                </Link>
            </div>
        </div>
    );
};

const InstitutionalHighlights = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [activeEventIndex, setActiveEventIndex] = useState(0);

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const data = await fetchEventsData();
                setEvents(data.slice(0, 8));
            } catch (err) {
                console.error("Failed to load events:", err);
            } finally {
                setLoading(false);
            }
        };
        loadEvents();
    }, []);

    const checkScrollBounds = () => {
        const el = scrollContainerRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 10);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);

        const cardWidth = el.clientWidth < 640 ? el.clientWidth * 0.84 : 380;
        const newIndex = Math.min(
            events.length - 1,
            Math.max(0, Math.round(el.scrollLeft / cardWidth))
        );
        setActiveEventIndex(newIndex);
    };

    const handleScroll = (direction: 'left' | 'right') => {
        const el = scrollContainerRef.current;
        if (!el) return;
        const scrollAmount = Math.min(el.clientWidth * 0.85, 420);
        el.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    const scrollToIndex = (idx: number) => {
        const el = scrollContainerRef.current;
        if (!el) return;
        const items = el.children;
        if (items[idx]) {
            (items[idx] as HTMLElement).scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'start'
            });
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header with Carousel Controls & Swipe Hint */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center border border-blue-100 shadow-sm shrink-0">
                        <span className="material-symbols-outlined text-2xl text-[var(--color-primary)]">campaign</span>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-xl sm:text-2xl font-bold font-['Work_Sans'] tracking-tight text-[var(--color-text-primary)]">
                                Highlights & Events
                            </h3>
                            <span className="inline-flex sm:hidden items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                                <span className="material-symbols-outlined text-xs">swipe</span> Swipe
                            </span>
                        </div>
                        <p className="text-xs text-[var(--color-text-secondary)]">Click any event to view photos and full story</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 justify-between sm:justify-end">
                    <Link 
                        to="/events" 
                        className="text-xs font-bold text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-1.5"
                    >
                        <span>View All Events</span>
                        <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </Link>

                    {/* Left & Right Chevrons */}
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => handleScroll('left')}
                            disabled={!canScrollLeft}
                            aria-label="Previous events"
                            className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 ${
                                canScrollLeft 
                                    ? 'bg-white border-blue-200 text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white shadow-sm hover:scale-105 active:scale-95' 
                                    : 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed'
                            }`}
                        >
                            <span className="material-symbols-outlined text-base">chevron_left</span>
                        </button>
                        <button
                            onClick={() => handleScroll('right')}
                            disabled={!canScrollRight}
                            aria-label="Next events"
                            className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 ${
                                canScrollRight 
                                    ? 'bg-white border-blue-200 text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white shadow-sm hover:scale-105 active:scale-95' 
                                    : 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed'
                            }`}
                        >
                            <span className="material-symbols-outlined text-base">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Horizontal Scroll Track: w-[84vw] on mobile gives clear peek of next card */}
            <div 
                ref={scrollContainerRef}
                onScroll={checkScrollBounds}
                className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4 h-full items-stretch -mx-4 px-4 sm:mx-0 sm:px-0"
            >
                {loading ? (
                    [1, 2].map(i => (
                        <div key={i} className="shrink-0 w-[84vw] sm:w-[360px] md:w-[400px] bg-white rounded-[22px] overflow-hidden shadow-sm animate-pulse h-[430px]"></div>
                    ))
                ) : events.length > 0 ? (
                    events.map((event, index) => (
                        <div 
                            key={index} 
                            onClick={() => setSelectedEvent(event)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    setSelectedEvent(event);
                                }
                            }}
                            className="snap-center sm:snap-start shrink-0 w-[84vw] sm:w-[360px] md:w-[400px] flex flex-col bg-white rounded-[22px] overflow-hidden group shadow-sm hover:shadow-2xl transition-all duration-500 border border-blue-100 hover:border-[var(--color-accent)]/50 hover:-translate-y-1 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                        >
                            {/* Image Banner */}
                            <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                                <img 
                                    src={event.img} 
                                    alt={event.title} 
                                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/pages/home/hero-1.jpg'; }}
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                {/* Floating Date Tag */}
                                <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl shadow-md border border-black/5 flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-xs text-amber-500">calendar_month</span>
                                    <span className="text-xs font-bold text-[var(--color-text-primary)]">
                                        {formatDisplayDate(event.date)}
                                    </span>
                                </div>

                                {/* Gallery Count Indicator */}
                                {event.gallery && event.gallery.length > 0 && (
                                    <div className="absolute top-3.5 right-3.5 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-md">
                                        <span className="material-symbols-outlined text-xs text-[var(--color-accent)]">photo_library</span>
                                        <span>+{event.gallery.length} Photos</span>
                                    </div>
                                )}
                            </div>
                            
                            {/* Card Body */}
                            <div className="p-5 sm:p-6 flex flex-col justify-between flex-grow bg-white">
                                <div>
                                    <h4 className="text-[var(--color-text-primary)] text-lg sm:text-xl font-bold leading-snug mb-2 group-hover:text-[var(--color-secondary)] transition-colors line-clamp-2 min-h-[48px] font-['Work_Sans']">
                                        {event.title}
                                    </h4>
                                    <p className="text-[var(--color-text-secondary)] text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4">
                                        {event.description || 'Join our vibrant school community in celebrating excellence and academic milestones.'}
                                    </p>
                                </div>

                                {/* Card Footer CTA */}
                                <div className="pt-3.5 border-t border-gray-100 mt-auto flex items-center justify-between text-xs font-bold text-[var(--color-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                                    <span>{event.gallery && event.gallery.length > 0 ? 'View Photos & Story' : 'View Event Details'}</span>
                                    <span className="w-7 h-7 rounded-full bg-blue-50 text-[var(--color-primary)] group-hover:bg-[var(--color-accent)] group-hover:text-[#002A45] flex items-center justify-center transition-all duration-300">
                                        <span className="material-symbols-outlined text-sm group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="w-full py-16 text-center text-gray-400 bg-white rounded-2xl border border-gray-100">
                        <span className="material-symbols-outlined text-4xl mb-2 text-gray-300">event_busy</span>
                        <p className="text-base font-semibold text-gray-600">No events scheduled at this moment.</p>
                        <p className="text-xs text-gray-400 mt-1">Please check back soon for upcoming events.</p>
                    </div>
                )}
            </div>

            {/* Pagination Dots (showing active position on mobile and desktop) */}
            {events.length > 1 && (
                <div className="flex items-center justify-center gap-1.5 mt-2">
                    {events.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => scrollToIndex(i)}
                            aria-label={`Go to event ${i + 1}`}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                activeEventIndex === i
                                    ? 'w-6 bg-[var(--color-primary)]'
                                    : 'w-2 bg-blue-200 hover:bg-blue-300'
                            }`}
                        />
                    ))}
                </div>
            )}

            {/* Event Detail & Gallery Modal */}
            <EventDetailModal
                event={selectedEvent}
                isOpen={selectedEvent !== null}
                onClose={() => setSelectedEvent(null)}
            />
        </div>
    );
};

const InstitutionalPulse = () => {
    return (
        <section className="py-16 bg-[var(--color-background-soft)] relative border-t border-blue-100/30 overflow-hidden">
            {/* Subtle background ambient blur */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-accent)]/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
            
            <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
                    {/* Notices Column (4 cols) */}
                    <div className="lg:col-span-4 flex flex-col">
                        <InstitutionalNotices />
                    </div>
                    
                    {/* Highlights Column (8 cols) */}
                    <div className="lg:col-span-8 flex flex-col">
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
        <section className="py-14 bg-[var(--color-background-soft)] border-t border-blue-100/30">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-12">
                    <span className="inline-block px-4 py-1.5 text-[10px] font-bold tracking-[0.3em] text-[var(--color-primary)] uppercase bg-blue-100/50 rounded-full mb-6">
                        Leadership Reflection
                    </span>
                    <h2 className="text-2xl md:text-4xl font-bold font-['Work_Sans'] text-[var(--color-text-primary)] tracking-tight">From The Founders</h2>
                </div>
                <div className="flex flex-col gap-12 max-w-4xl mx-auto">
                    {leaders.map(leader => (
                        <div key={leader.name} className="bg-[var(--color-background-card)] text-[var(--color-text-primary)] rounded-[24px] shadow-sm flex flex-col md:flex-row items-center p-6 md:p-8 transition-all duration-500 hover:shadow-xl hover:shadow-blue-200/30 border border-blue-100 relative overflow-hidden group">
                            {/* Subtle crest watermark */}
                            <span className="material-symbols-outlined absolute -bottom-10 -right-10 text-[120px] text-blue-900/5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">school</span>
                            
                            <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8 text-center relative z-10">
                                <img
                                    src={leader.img}
                                    alt={leader.name}
                                    className="w-28 h-28 md:w-36 md:h-36 rounded-[20px] object-cover object-center mx-auto border-4 border-white shadow-lg group-hover:border-[var(--color-accent)]/50 transition-all duration-500"
                                    onError={(e) => {
                                        const slug = (leader.name || '').toLowerCase().replace(/[^a-z]/g, '');
                                        const localUrl = `/images/staff/${slug}.jpg`;
                                        if (!e.currentTarget.src.includes(localUrl)) {
                                            e.currentTarget.src = localUrl;
                                        } else {
                                            handleImageError(e, { width: 144, height: 144, text: leader.name });
                                        }
                                    }}
                                    loading="lazy"
                                />
                            </div>
                            <div className="flex flex-col w-full text-center md:text-left relative z-10">
                                <h3 className="text-xl md:text-2xl font-bold font-['Montserrat'] text-[var(--color-text-primary)] mb-1 uppercase tracking-tighter">{`The ${leader.role}'s Desk`}</h3>
                                <p className="text-sm text-[var(--color-text-secondary)] mb-6 font-medium tracking-wide">{`Sunshine International School`}</p>

                                {leader.testimonial && (
                                    <blockquote className="relative text-[var(--color-text-secondary)] text-md leading-relaxed italic mb-8 flex-grow">
                                        <i className="fas fa-quote-left absolute -top-3 -left-4 text-2xl text-[var(--color-accent)] opacity-40"></i>
                                        <p className="pl-4 border-l-2 border-[var(--color-accent)]/40">{leader.testimonial}</p>
                                    </blockquote>
                                )}

                                <div className="mt-auto md:text-right border-t border-blue-100 pt-4">
                                    <p className="font-bold text-lg text-[var(--color-text-primary)] tracking-tight">{leader.name}</p>
                                    <p className="text-[10px] text-[var(--color-text-accent)] uppercase font-extrabold tracking-[0.2em]">{leader.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
const Testimonials = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);

    const checkScroll = useCallback(() => {
        if (!scrollContainerRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setCanScrollLeft(scrollLeft > 20);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 20);

        const cardWidth = 380;
        const newIndex = Math.min(
            testimonialsData.length - 1,
            Math.max(0, Math.round(scrollLeft / cardWidth))
        );
        setActiveIndex(newIndex);
    }, []);

    useEffect(() => {
        const el = scrollContainerRef.current;
        if (!el) return;
        checkScroll();
        el.addEventListener('scroll', checkScroll, { passive: true });
        window.addEventListener('resize', checkScroll);
        return () => {
            el.removeEventListener('scroll', checkScroll);
            window.removeEventListener('resize', checkScroll);
        };
    }, [checkScroll]);

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollContainerRef.current) return;
        const scrollAmount = 420;
        scrollContainerRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    const scrollToIndex = (idx: number) => {
        if (!scrollContainerRef.current) return;
        const items = scrollContainerRef.current.children;
        if (items[idx]) {
            (items[idx] as HTMLElement).scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    };

    return (
        <section className="bg-[var(--color-background-body)] py-16 md:py-20 border-t border-blue-100/30 overflow-hidden relative">
            <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
                {/* Section Header with Desktop Navigation Controls */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-12 gap-6">
                    <div>
                        <span className="inline-block px-4 py-1.5 text-[10px] font-bold tracking-[0.3em] text-[var(--color-primary)] uppercase bg-blue-100/50 rounded-full mb-4">
                            Community Voices
                        </span>
                        <h2 className="text-2xl md:text-4xl font-bold font-['Work_Sans'] text-[var(--color-text-primary)] tracking-tight">
                            Voices of Our Community
                        </h2>
                        <p className="text-[var(--color-text-secondary)] text-sm md:text-base max-w-2xl mt-2 leading-relaxed">
                            Hear how parents and students experience the Sunshine standard of holistic growth and academic care.
                        </p>
                    </div>

                    {/* Navigation Buttons (Desktop & Tablet) */}
                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={() => scroll('left')}
                            disabled={!canScrollLeft}
                            aria-label="Previous testimonial"
                            className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all duration-300 ${
                                canScrollLeft
                                    ? 'border-blue-200 bg-white text-[var(--color-text-primary)] hover:bg-blue-50 shadow-sm hover:scale-105 active:scale-95'
                                    : 'border-blue-100/60 bg-white/40 text-blue-300 cursor-not-allowed'
                            }`}
                        >
                            <span className="material-symbols-outlined text-xl">chevron_left</span>
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            disabled={!canScrollRight}
                            aria-label="Next testimonial"
                            className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all duration-300 ${
                                canScrollRight
                                    ? 'border-blue-200 bg-white text-[var(--color-text-primary)] hover:bg-blue-50 shadow-sm hover:scale-105 active:scale-95'
                                    : 'border-blue-100/60 bg-white/40 text-blue-300 cursor-not-allowed'
                            }`}
                        >
                            <span className="material-symbols-outlined text-xl">chevron_right</span>
                        </button>
                    </div>
                </div>

                {/* Testimonials Carousel Track */}
                <div
                    ref={scrollContainerRef}
                    className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory px-1 pb-6 -mx-1"
                >
                    {testimonialsData.map((testimonial, index) => (
                        <div
                            key={index}
                            className="snap-center shrink-0 w-[88vw] sm:w-[380px] md:w-[420px] bg-[var(--color-background-card)] p-6 md:p-8 rounded-[24px] shadow-sm relative border border-blue-100 hover:border-[var(--color-accent)]/40 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 flex flex-col justify-between group"
                        >
                            {/* Watermark Quote Icon */}
                            <span
                                className="material-symbols-outlined text-[var(--color-text-primary)] absolute top-6 right-6 text-6xl opacity-5 pointer-events-none group-hover:opacity-10 group-hover:scale-110 transition-all duration-500"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                                format_quote
                            </span>

                            <div>
                                {/* Rating Stars & Verified Badge */}
                                <div className="flex items-center justify-between mb-4 relative z-10">
                                    <div className="flex items-center gap-1 text-amber-400">
                                        {[...Array(5)].map((_, i) => (
                                            <span
                                                key={i}
                                                className="material-symbols-outlined text-base"
                                                style={{ fontVariationSettings: "'FILL' 1" }}
                                            >
                                                star
                                            </span>
                                        ))}
                                    </div>
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50/80 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                        <span className="material-symbols-outlined text-xs text-blue-600">verified</span>
                                        Verified
                                    </span>
                                </div>

                                {/* Quote Body */}
                                <p className="text-sm md:text-base leading-relaxed text-[var(--color-text-primary)] italic mb-6 relative z-10 font-['Work_Sans']">
                                    "{testimonial.quote}"
                                </p>
                            </div>

                            {/* Author Row */}
                            <div className="flex items-center gap-4 relative z-10 pt-4 border-t border-blue-50 mt-auto">
                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl overflow-hidden bg-white border-2 border-blue-100 group-hover:border-[var(--color-accent)] transition-colors shadow-sm shrink-0">
                                    <img
                                        src={testimonial.img}
                                        alt={testimonial.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            handleImageError(e, { text: testimonial.name.charAt(0) });
                                        }}
                                    />
                                </div>
                                <div>
                                    <p className="font-bold text-[var(--color-text-primary)] text-base md:text-lg tracking-tight">
                                        {testimonial.name}
                                    </p>
                                    <p className="text-xs text-[var(--color-text-accent)] font-extrabold uppercase tracking-wider mt-0.5">
                                        {testimonial.relation}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Dots (Mobile & Interactive Visual Feedback) */}
                <div className="flex items-center justify-center gap-2 mt-4">
                    {testimonialsData.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => scrollToIndex(i)}
                            aria-label={`Go to testimonial ${i + 1}`}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                activeIndex === i
                                    ? 'w-8 bg-[var(--color-primary)]'
                                    : 'w-2 bg-blue-200 hover:bg-blue-300'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};


const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section id="faq-section" className="relative bg-[var(--color-background-soft)] pt-16 pb-14 border-t border-blue-100/30 scroll-mt-[75px]">
            <div className="container mx-auto px-4 max-w-3xl">
                {/* Header */}
                <div className="text-center mb-10 md:mb-12">
                    <span className="inline-block px-4 py-1.5 text-[10px] font-bold tracking-[0.3em] text-[var(--color-primary)] uppercase bg-blue-100/50 rounded-full mb-4">
                        Knowledge Hub
                    </span>
                    <h2 className="text-2xl md:text-4xl font-bold font-['Work_Sans'] text-[var(--color-text-primary)] mb-3 tracking-tight">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-[var(--color-text-secondary)] text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                        Clear, transparent answers to help you navigate admissions, timings, and campus life.
                    </p>
                </div>

                {/* Accordion List */}
                <div className="space-y-3.5">
                    {homeFaqData.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={index}
                                className={`group border rounded-[20px] transition-all duration-300 overflow-hidden ${
                                    isOpen
                                        ? 'bg-white border-blue-200 shadow-md ring-1 ring-blue-100'
                                        : 'bg-white/70 hover:bg-white border-blue-100/80 shadow-sm'
                                }`}
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    aria-expanded={isOpen}
                                    className="w-full text-left flex justify-between items-center py-4 px-5 md:py-5 md:px-7 focus:outline-none transition-colors"
                                >
                                    <span
                                        className={`font-bold text-base md:text-lg font-['Work_Sans'] transition-colors duration-200 pr-4 ${
                                            isOpen
                                                ? 'text-[var(--color-primary)]'
                                                : 'text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)]'
                                        }`}
                                    >
                                        {faq.q}
                                    </span>
                                    <span
                                        className={`w-9 h-9 md:w-10 md:h-10 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 ${
                                            isOpen
                                                ? 'bg-[var(--color-primary)] text-white rotate-180 shadow-sm'
                                                : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-xl">
                                            {isOpen ? 'remove' : 'add'}
                                        </span>
                                    </span>
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                        isOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                                >
                                    <div className="px-5 pb-6 md:px-7 md:pb-7">
                                        <div className="h-px mb-4 bg-blue-100/60"></div>
                                        <p className="text-sm md:text-base leading-relaxed text-[var(--color-text-secondary)] font-normal">
                                            {faq.a}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom CTA Card: Refined Admissions Banner that seamlessly transitions into the Footer */}
                <div className="mt-12 md:mt-14">
                    <div className="bg-white rounded-2xl md:rounded-3xl p-6 sm:p-7 border border-blue-100 shadow-md shadow-blue-950/5 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left relative overflow-hidden">
                        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-50/70 rounded-full blur-2xl pointer-events-none -z-1"></div>
                        <div>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider text-blue-700 bg-blue-50 uppercase mb-2">
                                <span className="material-symbols-outlined text-xs text-blue-600">support_agent</span>
                                Admissions Helpdesk
                            </span>
                            <h3 className="text-lg md:text-xl font-bold font-['Work_Sans'] text-[var(--color-text-primary)]">
                                Have more questions?
                            </h3>
                            <p className="text-xs md:text-sm text-[var(--color-text-secondary)] mt-1">
                                Our admissions team is ready to guide you through admission guidelines, transport routes, and campus tours.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                            <Link
                                to="/contact"
                                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[var(--color-primary)] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-blue-900 transition-all shadow-sm hover:shadow group"
                            >
                                <span>Ask Us</span>
                                <span className="material-symbols-outlined text-sm group-hover:translate-x-0.5 transition-transform">
                                    arrow_forward
                                </span>
                            </Link>
                            <a
                                href="tel:+919692977727"
                                className="inline-flex items-center justify-center w-10 h-10 bg-blue-50 text-[var(--color-primary)] rounded-xl hover:bg-blue-100 transition-colors"
                                title="Call SIS Admissions"
                                aria-label="Call Admissions Office"
                            >
                                <span className="material-symbols-outlined text-lg">call</span>
                            </a>
                        </div>
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
                    <ImpactGrid />
                </ScrollAnimator>
                
                <ScrollAnimator>
                    {/* Live Updates & Cinematic Highlights */}
                    <InstitutionalPulse />
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
