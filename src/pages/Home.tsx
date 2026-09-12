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
import { testimonialsData } from '../data/testimonials';
import ScrollAnimator from '../components/common/ScrollAnimator';
import NoticeTicker from '../components/common/NoticeTicker';
import NoticeSkeleton from '../components/common/NoticeSkeleton';
import { fetchHomeSettings } from '../services/dataService';
import { heroSlidesData, featuredHomeGallery } from '../data/homeConfig';


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
    
    useEffect(() => {
        const syncGallery = async () => {
            const liveData = await fetchHomeSettings();
            if (liveData && liveData.featuredGallery && liveData.featuredGallery.length > 0) {
                setMoments(liveData.featuredGallery);
            }
        };
        syncGallery();
    }, []);

    return (
        <section className="py-14 bg-[var(--color-background-body)] border-t border-blue-100/30">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                    <span className="text-[var(--color-accent)] font-bold text-[10px] uppercase tracking-[0.3em] mb-2 block">Curated Memories</span>
                    <h2 className="text-2xl md:text-4xl font-bold font-['Work_Sans'] text-[var(--color-text-primary)] tracking-tight">School Life Moments</h2>
                </div>
                <Link to="/gallery" className="inline-flex items-center gap-2 font-bold text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-all group pb-1 border-b border-transparent hover:border-[var(--color-accent)] text-sm">
                    Enter Full Gallery
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:h-[700px] auto-rows-[200px] md:auto-rows-auto">
                {/* 1. Large Feature (2x2) */}
                <div className="col-span-2 row-span-2 group relative overflow-hidden rounded-[20px] shadow-sm hover:shadow-2xl transition-all duration-700">
                    <img src={moments[0].src} alt={moments[0].caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                        <span className="text-[var(--color-accent)] text-[8px] uppercase font-extrabold tracking-widest mb-1">{moments[0].event}</span>
                        <h3 className="text-white font-bold text-lg leading-tight">{moments[0].caption}</h3>
                    </div>
                </div>

                {/* 2. Wide Snapshot (2x1) */}
                <div className="col-span-2 row-span-1 group relative overflow-hidden rounded-[20px] shadow-sm hover:shadow-xl transition-all duration-700">
                    <img src={moments[1].src} alt={moments[1].caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" loading="lazy" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center p-4">
                        <p className="text-white text-xs font-bold text-center leading-snug">{moments[1].caption}</p>
                    </div>
                </div>

                {/* 3. Accent Square */}
                <div className="col-span-1 row-span-1 group relative overflow-hidden rounded-[20px] shadow-sm hover:shadow-xl transition-all duration-700">
                    <img src={moments[2].src} alt={moments[2].caption} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" loading="lazy" />
                    <div className="absolute inset-0 bg-[var(--color-primary)]/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center p-4">
                        <p className="text-white text-[10px] font-bold text-center leading-tight">{moments[2].caption}</p>
                    </div>
                </div>

                {/* 4. Accent Square */}
                <div className="col-span-1 row-span-1 group relative overflow-hidden rounded-[20px] shadow-sm hover:shadow-xl transition-all duration-700">
                    <img src={moments[3].src} alt={moments[3].caption} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" loading="lazy" />
                    <div className="absolute inset-0 bg-[var(--color-primary)]/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center p-4">
                        <p className="text-white text-[10px] font-bold text-center leading-tight">{moments[3].caption}</p>
                    </div>
                </div>

                {/* 5-8. Bottom Row Snapshots */}
                {[4, 5, 6, 7].map((idx) => (
                   <div key={idx} className="col-span-1 row-span-1 group relative overflow-hidden rounded-[20px] shadow-sm hover:shadow-xl transition-all duration-700">
                        <img src={moments[idx].src} alt={moments[idx].caption} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" loading="lazy" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center p-4">
                            <p className="text-white text-[9px] font-bold text-center leading-tight uppercase tracking-tighter opacity-80">{moments[idx].event}</p>
                        </div>
                   </div>
                ))}
            </div>
        </div>
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
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

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
    };

    const handleScroll = (direction: 'left' | 'right') => {
        const el = scrollContainerRef.current;
        if (!el) return;
        const scrollAmount = Math.min(el.clientWidth * 0.85, 460);
        el.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header with Desktop Carousel Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center border border-blue-100 shadow-sm">
                        <i className="fas fa-calendar-star text-xl"></i>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold font-['Work_Sans'] tracking-tight text-[var(--color-text-primary)]">Highlights & Events</h3>
                        <p className="text-xs text-[var(--color-text-secondary)]">Celebrations, milestones, and vibrant campus life</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                    <Link 
                        to="/events" 
                        className="text-xs font-bold text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-1.5 mr-2"
                    >
                        <span>View All Events</span>
                        <i className="fas fa-arrow-right text-[10px]"></i>
                    </Link>

                    {/* Left & Right Chevrons for Desktop Scrolling */}
                    <div className="hidden md:flex items-center gap-2">
                        <button
                            onClick={() => handleScroll('left')}
                            disabled={!canScrollLeft}
                            aria-label="Previous events"
                            className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-200 ${
                                canScrollLeft 
                                    ? 'bg-white border-blue-200 text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white shadow-sm hover:scale-105 active:scale-95' 
                                    : 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed'
                            }`}
                        >
                            <i className="fas fa-chevron-left text-xs"></i>
                        </button>
                        <button
                            onClick={() => handleScroll('right')}
                            disabled={!canScrollRight}
                            aria-label="Next events"
                            className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-200 ${
                                canScrollRight 
                                    ? 'bg-white border-blue-200 text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white shadow-sm hover:scale-105 active:scale-95' 
                                    : 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed'
                            }`}
                        >
                            <i className="fas fa-chevron-right text-xs"></i>
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Horizontal Scroll Track */}
            <div 
                ref={scrollContainerRef}
                onScroll={checkScrollBounds}
                className="flex gap-6 overflow-x-auto no-scrollbar snap-scroll pb-6 h-full items-stretch"
            >
                {loading ? (
                    [1, 2].map(i => (
                        <div key={i} className="shrink-0 w-full sm:w-[380px] md:w-[420px] bg-white rounded-[22px] overflow-hidden shadow-sm animate-pulse h-[450px]"></div>
                    ))
                ) : events.length > 0 ? (
                    events.map((event, index) => (
                        <Link 
                            to="/events" 
                            key={index} 
                            className="snap-start shrink-0 w-full sm:w-[380px] md:w-[420px] flex flex-col bg-white rounded-[22px] overflow-hidden group shadow-sm hover:shadow-2xl transition-all duration-500 border border-blue-100 hover:border-[var(--color-accent)]/50 hover:-translate-y-1.5 text-left cursor-pointer"
                        >
                            {/* Image Banner */}
                            <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                                <img 
                                    src={event.img} 
                                    alt={event.title} 
                                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/pages/home/hero-1.jpg'; }}
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                {/* Floating Date Tag */}
                                <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-black/5 flex items-center gap-2">
                                    <i className="far fa-calendar-alt text-[var(--color-accent)] text-xs"></i>
                                    <span className="text-xs font-bold text-[var(--color-text-primary)]">
                                        {formatDisplayDate(event.date)}
                                    </span>
                                </div>

                                {/* Gallery Count Indicator */}
                                {event.gallery && event.gallery.length > 0 && (
                                    <div className="absolute top-3.5 right-3.5 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-md">
                                        <i className="fas fa-images text-[9px] text-[var(--color-accent)]"></i>
                                        <span>+{event.gallery.length} Photos</span>
                                    </div>
                                )}
                            </div>
                            
                            {/* Card Body */}
                            <div className="p-6 flex flex-col justify-between flex-grow bg-white">
                                <div>
                                    <h4 className="text-[var(--color-text-primary)] text-lg md:text-xl font-bold leading-tight mb-2.5 group-hover:text-[var(--color-secondary)] transition-colors line-clamp-2 min-h-[52px] font-['Work_Sans']">
                                        {event.title}
                                    </h4>
                                    <p className="text-[var(--color-text-secondary)] text-xs md:text-sm line-clamp-3 leading-relaxed mb-6">
                                        {event.description || 'Join our vibrant school community in celebrating excellence and academic milestones.'}
                                    </p>
                                </div>

                                {/* Card Footer CTA */}
                                <div className="pt-4 border-t border-gray-100 mt-auto flex items-center justify-between text-xs font-bold text-[var(--color-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                                    <span>Explore Event Gallery & Details</span>
                                    <span className="w-7 h-7 rounded-full bg-blue-50 text-[var(--color-primary)] group-hover:bg-[var(--color-accent)] group-hover:text-[#002A45] flex items-center justify-center transition-all duration-300">
                                        <i className="fas fa-arrow-right text-[10px] group-hover:translate-x-0.5 transition-transform"></i>
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="w-full py-16 text-center text-gray-400 bg-white rounded-2xl border border-gray-100">
                        <i className="far fa-calendar-times text-4xl mb-3 text-gray-300"></i>
                        <p className="text-base font-semibold text-gray-600">No events scheduled at this moment.</p>
                        <p className="text-xs text-gray-400 mt-1">Please check back soon for upcoming events.</p>
                    </div>
                )}
            </div>
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
                                    onError={(e) => { e.currentTarget.onerror = null; handleImageError(e, { width: 144, height: 144, text: leader.name }); }}
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
const Testimonials = () => (
    <section className="bg-[var(--color-background-body)] py-14 border-t border-blue-100/30 overflow-hidden">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
            <div className="text-center mb-12">
                <span className="inline-block px-4 py-1.5 text-[10px] font-bold tracking-[0.3em] text-[var(--color-primary)] uppercase bg-blue-100/50 rounded-full mb-6">
                    Community Voices
                </span>
                <h2 className="text-2xl md:text-4xl font-bold mb-4 font-['Work_Sans'] text-[var(--color-text-primary)] tracking-tight">Voices of our Community</h2>
                <p className="text-[var(--color-text-secondary)] text-sm max-w-2xl mx-auto leading-relaxed">Hear from parents and alumni who have experienced the sunshine approach to excellence.</p>
            </div>
            
            <div className="flex gap-4 overflow-x-auto no-scrollbar snap-scroll px-4 pb-12">
                {testimonialsData.map((testimonial, index) => (
                    <div key={index} className="snap-center shrink-0 w-[85%] md:w-[420px] bg-[var(--color-background-card)] p-6 md:p-8 rounded-[20px] shadow-sm relative border border-blue-100 hover:shadow-lg transition-all group">
                        <span className="material-symbols-outlined text-[var(--color-text-primary)] absolute top-5 right-6 text-5xl opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
                        <p className="text-base leading-relaxed text-[var(--color-text-primary)] italic mb-8 relative z-10 font-['Work_Sans']">"{testimonial.quote}"</p>
                        <div className="flex items-center gap-5 relative z-10">
                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border-2 border-blue-100 group-hover:border-[var(--color-accent)] transition-colors shadow-sm">
                                <img 
                                    src={testimonial.img} 
                                    alt={testimonial.name} 
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.currentTarget.onerror = null; handleImageError(e, { text: testimonial.name.charAt(0) }); }}
                                />
                            </div>
                            <div>
                                <p className="font-bold text-[var(--color-text-primary)] text-lg tracking-tight">{testimonial.name}</p>
                                <p className="text-xs text-[var(--color-text-accent)] font-extrabold uppercase tracking-widest">{testimonial.relation}</p>
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
        <section id="faq-section" className="relative bg-[var(--color-background-soft)] py-14 border-t border-blue-100/30 scroll-mt-[75px]">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-12">
                    <span className="inline-block px-4 py-1.5 text-[10px] font-bold tracking-[0.3em] text-[var(--color-primary)] uppercase bg-blue-100/50 rounded-full mb-6">
                        Knowledge Hub
                    </span>
                    <h2 className="text-2xl md:text-4xl font-bold font-['Work_Sans'] text-[var(--color-text-primary)] mb-4 tracking-tight">Frequently Asked Questions</h2>
                    <p className="text-[var(--color-text-secondary)] text-md max-w-2xl mx-auto leading-relaxed">Providing clear answers to help you navigate our academic environment and community life.</p>
                </div>

                <div className="space-y-4">
                    {homeFaqData.map((faq, index) => (
                        <div 
                            key={index} 
                            className={`group border border-blue-100 rounded-[20px] transition-all duration-500 overflow-hidden ${openIndex === index ? 'bg-blue-100/50 shadow-md ring-1 ring-blue-200' : 'bg-white/60 hover:bg-white shadow-sm'}`}
                        >
                            <button 
                                onClick={() => setOpenIndex(openIndex === index ? null : index)} 
                                className="w-full text-left flex justify-between items-center py-7 px-8 focus:outline-none"
                            >
                                <span className={`font-bold text-xl font-['Work_Sans'] transition-colors duration-300 ${openIndex === index ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-primary)]'}`}>
                                    {faq.q}
                                </span>
                                <span className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${openIndex === index ? 'bg-[var(--color-primary)] text-white rotate-180' : 'bg-blue-50 text-blue-400'}`}>
                                    <span className="material-symbols-outlined text-2xl">
                                        {openIndex === index ? 'remove' : 'add'}
                                    </span>
                                </span>
                            </button>
                            <div className={`overflow-hidden transition-all duration-700 ease-in-out ${openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="px-8 pb-10">
                                    <div className={`h-px mb-8 transition-colors duration-500 ${openIndex === index ? 'bg-blue-200/50' : 'bg-black/5'}`}></div>
                                    <p className={`leading-relaxed text-lg transition-colors duration-500 ${openIndex === index ? 'text-[var(--color-text-primary)]/80' : 'text-[var(--color-text-secondary)]'}`}>
                                        {faq.a}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-12 text-center">
                    <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-8 p-6 bg-[var(--color-primary)] text-white rounded-[20px] shadow-lg">
                        <div className="text-left">
                            <p className="text-xs opacity-80 font-medium uppercase tracking-wider mb-1">Have more questions?</p>
                            <p className="font-bold text-lg">Contact our Admissions Office</p>
                        </div>
                        <Link to="/contact" className="px-8 py-2.5 bg-[var(--color-accent)] text-[var(--color-primary)] font-bold rounded-full hover:scale-105 transition-transform text-xs uppercase tracking-widest">
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
