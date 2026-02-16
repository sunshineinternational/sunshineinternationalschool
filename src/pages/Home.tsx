import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { fetchNoticesData } from '../services/dataService';
import type { Notice, QuickLink, Testimonial } from '../types';
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
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isPaused, setIsPaused] = useState(false);
    const [scrollOutput, setScrollOutput] = useState(0);
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
                        <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-wider text-white uppercase bg-[var(--color-accent)] rounded-full shadow-md drop-shadow-md">
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

                    {/* Dual CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <Link to="/admission" className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-[#3A2D28] bg-[#CBAD8D] rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(203,173,141,0.6)] shadow-xl ring-2 ring-[#CBAD8D] ring-offset-2 ring-offset-black/20">
                            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-80 group-hover:h-80 opacity-20"></span>
                            <span className="relative flex items-center gap-2">
                                Apply for Admission 2026-27
                                <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                            </span>
                        </Link>

                        <a
                            href="https://wa.me/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white border-2 border-white/60 bg-white/5 rounded-full hover:bg-white hover:text-[#25D366] hover:border-white transition-all duration-300 backdrop-blur-sm drop-shadow-md"
                        >
                            <i className="fab fa-whatsapp text-xl mr-2"></i>
                            Chat on WhatsApp
                        </a>
                    </div>
                </div>
            </div>

            {/* Quick Stats Strip - Glassmorphism */}
            <div className="absolute top-1/2 -translate-y-1/2 right-0 hidden lg:flex flex-col gap-6 mr-8 z-20">
                {[
                    { number: "25+", label: "Years of Excellence" },
                    { number: "100%", label: "Result Success" },
                    { number: "1:20", label: "Teacher Ratio" }
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-lg text-center w-32 transform transition-transform hover:scale-105 hover:bg-white/20">
                        <div className="text-2xl font-bold text-[var(--color-accent)] font-['Montserrat']">{stat.number}</div>
                        <div className="text-xs text-white/90 font-medium">{stat.label}</div>
                    </div>
                ))}
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
                {/* Scroll Indicator (Floating above wave) */}
                <div className="absolute bottom-12 md:bottom-20 left-1/2 transform -translate-x-1/2 w-full hidden md:flex justify-center pointer-events-none">
                    <button
                        onClick={scrollToContent}
                        className="flex flex-col items-center text-white/80 hover:text-white transition-colors cursor-pointer animate-bounce drop-shadow-md pointer-events-auto"
                        aria-label="Scroll down"
                    >
                        <i className="fas fa-chevron-down text-3xl md:text-2xl filter drop-shadow-lg"></i>
                    </button>
                </div>

                {/* Wave SVG */}
                <svg className="w-full h-12 md:h-24 fill-[var(--color-background-body)]" viewBox="0 0 1440 320" preserveAspectRatio="none">
                    <path fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
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
    <section className="py-16">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 font-['Montserrat'] text-[var(--color-text-primary)]">Why Choose Sunshine?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                {whyChooseUsData.map((item) => (
                    <div key={item.title} className="bg-[var(--color-background-card)] p-6 rounded-lg shadow-md text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                        <div className="text-5xl text-[var(--color-text-accent)] mb-4"><i className={item.icon}></i></div>
                        <h3 className="text-xl font-bold mb-3 font-['Montserrat'] text-[var(--color-text-primary)]">{item.title}</h3>
                        <p className="text-[var(--color-text-secondary)] text-sm">{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
        {/* Gentle Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
            <svg className="relative block w-[calc(140%+1.3px)] h-[60px] md:h-[120px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-[var(--color-background-section)]" transform="scale(1, -1) translate(0, -120)"></path>
            </svg>
        </div>
    </section >
);


const SchoolLifeMoments = () => (
    <div>
        <h2 className="text-3xl font-bold text-center lg:text-left mb-8 font-['Montserrat'] text-[var(--color-text-primary)]">School Life Moments</h2>
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
                // Simulate a longer loading time to demonstrate the skeleton
                await new Promise(resolve => setTimeout(resolve, 1500));
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

    const renderSkeletons = () => {
        return Array.from({ length: 5 }).map((_, index) => <NoticeSkeleton key={index} />);
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-center lg:text-left mb-8 font-['Montserrat'] text-[var(--color-text-primary)]">Notices</h2>
            <div className="bg-[var(--color-background-card)] p-6 rounded-lg shadow-md">
                <div className="max-h-[400px] overflow-y-auto custom-scrollbar pr-4 space-y-4">
                    {loading && renderSkeletons()}
                    {error && <p className="text-center text-red-600">{error}</p>}

                    {!loading && !error && (
                        <>
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
                        </>
                    )}
                </div>

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
        .slice(0, 6);

    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    useEffect(() => {
        resetTimeout();
        timeoutRef.current = setTimeout(
            () =>
                setCurrentIndex((prevIndex) =>
                    prevIndex === latestEvents.length - 1 ? 0 : prevIndex + 1
                ),
            3000
        );

        return () => {
            resetTimeout();
        };
    }, [currentIndex, latestEvents.length]);

    const handlers = useSwipeable({
        onSwipedLeft: () => setCurrentIndex((prevIndex) => (prevIndex + 1) % latestEvents.length),
        onSwipedRight: () => setCurrentIndex((prevIndex) => (prevIndex - 1 + latestEvents.length) % latestEvents.length),
        preventScrollOnSwipe: true,
        trackMouse: true
    });

    return (
        <section className="py-16 bg-[var(--color-background-section)]">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12 font-['Montserrat'] text-[var(--color-text-primary)]">Latest Events</h2>

                {/* Mobile Carousel */}
                <div className="sm:hidden">
                    <div {...handlers} className="overflow-hidden relative">
                        <div
                            className="flex transition-transform ease-in-out duration-500"
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {latestEvents.map((event, index) => (
                                <div key={index} className="flex-shrink-0 w-full px-2">
                                    <div className="group relative rounded-lg shadow-md overflow-hidden aspect-[4/3] cursor-pointer">
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
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end">
                                            <div className="p-4">
                                                <h3 className="text-md font-bold font-['Montserrat'] text-white">{event.title}</h3>
                                                <p className="text-xs text-gray-300 mt-1">{new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-center mt-4 space-x-2">
                        {latestEvents.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-[var(--color-accent)] scale-125' : 'bg-[var(--color-border)]'}`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Desktop Grid */}
                <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {latestEvents.slice(0, 3).map((event, index) => (
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
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-0 left-0 w-full p-4">
                                    <h3 className="text-md font-bold font-['Montserrat'] text-white">{event.title}</h3>
                                    <p className="text-xs text-gray-300 mt-1">{new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                            </div>
                        </div>
                    ))}
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
                <h2 className="text-3xl font-bold text-center mb-12 font-['Montserrat'] text-[var(--color-text-primary)]">From The Founders</h2>
                <div className="flex flex-col gap-12 max-w-4xl mx-auto">
                    {leaders.map(leader => (
                        <div key={leader.name} className="bg-[var(--color-background-card)] rounded-lg shadow-lg flex flex-col md:flex-row items-center p-6 sm:p-8 transition-shadow duration-300 hover:shadow-xl overflow-hidden">
                            <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8 text-center">
                                <img
                                    src={leader.img}
                                    alt={leader.name}
                                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover object-center mx-auto border-4 border-[var(--color-background-section)] shadow-md"
                                    onError={(e) => handleImageError(e, { width: 160, height: 160, text: leader.name, isAvatar: true })}
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
                <h2 className="text-3xl font-bold text-center mb-12 font-['Montserrat'] text-[var(--color-text-primary)]">What Our Community Says</h2>
                <div className="max-w-3xl mx-auto relative">
                    <div className="relative overflow-hidden min-h-[220px] sm:min-h-[200px]">
                        {testimonialsData.map((testimonial, index) => (
                            <div
                                key={index}
                                className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ease-in-out ${index === currentTestimonial ? 'opacity-100' : 'opacity-0'}`}
                                aria-hidden={index !== currentTestimonial}
                            >
                                <div className="bg-[var(--color-background-card)] p-4 sm:p-8 rounded-lg shadow-lg relative h-full flex flex-col items-center text-center">
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
                                        <h4 className="font-bold font-['Montserrat'] text-[var(--color-text-primary)]">{testimonial.name}</h4>
                                        <p className="text-sm text-gray-500">{testimonial.relation}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {testimonialsData.length > 1 && (
                        <>
                            <button onClick={handlePrevTestimonial} aria-label="Previous testimonial" className="absolute left-0 top-1/2 -translate-y-12 bg-[var(--color-background-card)]/50 text-[var(--color-text-primary)] rounded-full w-10 h-10 hover:bg-[var(--color-background-card)]/80 transition shadow-md -translate-x-6 z-10 hidden sm:flex items-center justify-center">
                                <i className="fas fa-chevron-left"></i>
                            </button>
                            <button onClick={handleNextTestimonial} aria-label="Next testimonial" className="absolute right-0 top-1/2 -translate-y-12 bg-[var(--color-background-card)]/50 text-[var(--color-text-primary)] rounded-full w-10 h-10 hover:bg-[var(--color-background-card)]/80 transition shadow-md translate-x-6 z-10 hidden sm:flex items-center justify-center">
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
                    ))}
                </div>
            </div>
        </section>
    );
};


const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    return (
        <section id="faq-section" className="relative bg-[var(--color-background-body)] py-16 scroll-mt-[75px]">
            <div className="container mx-auto px-4 max-w-3xl">
                <h2 className="text-3xl font-bold text-center mb-8 font-['Montserrat'] text-[var(--color-text-primary)]">Frequently Asked Questions</h2>
                <div className="bg-[var(--color-background-card)] p-4 sm:p-8 rounded-lg shadow-md">
                    {homeFaqData.map((faq, index) => (
                        <FaqItem
                            key={index}
                            faq={faq}
                            isOpen={openIndex === index}
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        />
                    ))}
                </div>
            </div>
            {/* Footer Wave Divider */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform translate-y-1">
                <svg className="relative block w-[calc(100%+1.3px)] h-[50px] md:h-[80px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-[var(--color-primary)]"></path>
                </svg>
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
