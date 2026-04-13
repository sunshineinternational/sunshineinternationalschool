// src/data/homeConfig.ts

export const heroSlidesData = [
    { type: 'image', src: '/images/pages/home/hero-3.jpg', animationClass: 'animate-pan-up' },
    { type: 'image', src: '/images/pages/home/hero-1.jpg', animationClass: 'animate-pan-right' },
    { type: 'image', src: '/images/pages/home/hero-2.jpg', animationClass: 'animate-zoom-in' },
    { type: 'image', src: '/images/pages/home/hero-4.jpg', animationClass: 'animate-pan-left' },
    { type: 'video', src: '/images/pages/home/video.mp4', animationClass: 'animate-pan-left', poster: '/images/pages/home/video-poster.jpg' },
];

/**
 * Featured Gallery Images for the 'Japanese Bento' Grid on Home Page
 * Use this to hand-pick curated images.
 */
export const featuredHomeGallery = [
    {
        src: '/images/pages/home/annualday.webp',
        caption: 'Academic Excellence in Action',
        event: 'Classroom',
        layout: 'large' // Spans 2x2
    },
    {
        src: '/images/pages/home/hero-3.jpg',
        caption: 'Campus Morning Assemblies',
        event: 'Community',
        layout: 'wide' // Spans 2x1
    },
    {
        src: '/images/pages/home/competitions.webp',
        caption: 'Sports Day 2024',
        event: 'Sports',
        layout: 'square'
    },
    {
        src: '/images/pages/home/archive2012-2020(28).webp',
        caption: 'Scientific Discovery',
        event: 'Lab',
        layout: 'square'
    },
    {
        src: '/images/pages/home/annualfunction2024-25(16).webp',
        caption: 'Art & Expression',
        event: 'Arts',
        layout: 'square'
    },
    {
        src: '/images/pages/home/hero-2.jpg',
        caption: 'Cultural Fest Highlights',
        event: 'Cultural',
        layout: 'square'
    },
    {
        src: '/images/pages/home/annualfunction2024-25(18).webp',
        caption: 'Annual Prize Distribution',
        event: 'Award',
        layout: 'square'
    },
    {
        src: '/images/pages/home/hero-4.jpg',
        caption: 'Library Study Sessions',
        event: 'Academic',
        layout: 'square'
    }
];
