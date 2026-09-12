import type { Notice, GalleryImage } from '../types';
import { client, urlFor } from '../lib/sanity';

const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ7ukhF8GqkwiCN4oYvT6FcO3RBMuk8c56emdFrN0EY9j5HA5oZkLzLQX6JQXRFA5BNQC4jc0Z8nJ5R/pub?output=csv';

interface Cache<T> {
    data: T;
    timestamp: number;
}

let noticesCache: Cache<Notice[]> | null = null;
let galleryCache: Cache<GalleryImage[]> | null = null;
const CACHE_DURATION = 5 * 60 * 1000;

function normalizeHeader(header: string): string {
    return header.trim().replace(/\s+/g, ' ').split(' ').map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join('');
}

function parseCsvRobust(csv: string): any[] {
  const lines = csv.trim().replace(/\r\n/g, '\n').split('\n');
  if (lines.length < 2) return [];
  const headers = lines.shift()!.trim().split(',').map(normalizeHeader);
  return lines.map(line => {
    const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    const obj: { [key: string]: string } = {};
    headers.forEach((header, i) => {
      let value = (values[i] || '').trim();
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      value = value.replace(/""/g, '"');
      obj[header] = value;
    });
    return obj;
  });
}

/**
 * Safely resolves an image URL from a Sanity source without throwing if asset is missing or invalid.
 */
function safeImageUrl(source: any, fallback: string = ''): string {
    if (!source) return fallback;
    const hasAsset = Boolean(source.asset?._ref || source.asset?._id || source._ref || (typeof source === 'string' && source.length > 0));
    if (!hasAsset) return fallback;
    try {
        const url = urlFor(source)?.url();
        return url || fallback;
    } catch {
        return fallback;
    }
}

/**
 * Safely resolves a cropped thumbnail URL from a Sanity source.
 */
function safeThumbnailUrl(source: any, width: number = 400, height: number = 400, fallback: string = ''): string {
    if (!source) return fallback;
    const hasAsset = Boolean(source.asset?._ref || source.asset?._id || source._ref || (typeof source === 'string' && source.length > 0));
    if (!hasAsset) return fallback;
    try {
        const url = urlFor(source)?.width(width)?.height(height)?.fit('crop')?.url();
        return url || fallback;
    } catch {
        return fallback;
    }
}

/**
 * Fetches notices from Sanity, or falls back to Google Sheets if Sanity is empty.
 */
export async function fetchNoticesData(): Promise<Notice[]> {
    const now = Date.now();
    if (noticesCache && (now - noticesCache.timestamp < CACHE_DURATION)) return noticesCache.data;
    
    try {
        const query = `*[_type == "notice"] | order(date desc)`;
        const sanityNotices = await client.fetch(query);
        if (sanityNotices && sanityNotices.length > 0) {
            const formatted = sanityNotices.map((n: any) => ({
                title: n.title || 'Untitled Notice',
                date: n.date && typeof n.date === 'string' ? n.date.split('-').reverse().join('-') : '',
                url: n.url || '#'
            }));
            noticesCache = { data: formatted, timestamp: now };
            return formatted;
        }
        const response = await fetch(GOOGLE_SHEET_URL);
        const data = parseCsvRobust(await response.text()) as Notice[];
        noticesCache = { data, timestamp: now };
        return data;
    } catch (error) {
        console.error("Notices fetch failed:", error);
        return noticesCache ? noticesCache.data : [];
    }
}

/**
 * Fetches gallery images from Sanity.
 */
export async function fetchGalleryData(): Promise<GalleryImage[]> {
    const now = Date.now();
    if (galleryCache && (now - galleryCache.timestamp < CACHE_DURATION)) return galleryCache.data;

    try {
        const query = `*[_type == "gallery"] | order(_createdAt desc)`;
        const sanityImages = await client.fetch(query);
        
        if (sanityImages && sanityImages.length > 0) {
            const formatted = sanityImages
                .filter((img: any) => img && img.image && (img.image.asset || img.image._ref))
                .map((img: any) => ({
                    src: safeImageUrl(img.image, '/images/pages/home/hero-1.jpg'),
                    thumbnail: safeThumbnailUrl(img.image, 400, 400, '/images/pages/home/hero-1.jpg'),
                    caption: img.caption || img.title || 'School Moment',
                    event: img.category ? (img.category.charAt(0).toUpperCase() + img.category.slice(1)) : 'General'
                }));
            galleryCache = { data: formatted, timestamp: now };
            return formatted;
        }
        return [];
    } catch (error) {
        console.error("Gallery fetch failed:", error);
        return [];
    }
}

/**
 * Fetches teachers from Sanity.
 */
export async function fetchTeachersData(): Promise<any[]> {
    try {
        const query = `*[_type == "teacher"] | order(priority desc)`;
        const sanityTeachers = await client.fetch(query);
        
        if (sanityTeachers && sanityTeachers.length > 0) {
            return sanityTeachers.map((t: any) => ({
                name: t.name || 'Faculty Member',
                role: t.role || 'Teacher',
                qualification: t.qualification || '',
                experience: t.experience || '',
                img: safeImageUrl(t.image, '/images/staff/default-teacher.jpg'),
                testimonial: t.bio || ''
            }));
        }
        return [];
    } catch (error) {
        console.error("Teachers fetch failed:", error);
        return [];
    }
}

/**
 * Fetches events from Sanity.
 */
export async function fetchEventsData(): Promise<any[]> {
    try {
        const query = `*[_type == "event"] | order(date desc)`;
        const sanityEvents = await client.fetch(query);
        
        if (sanityEvents && sanityEvents.length > 0) {
            return sanityEvents.map((e: any) => {
                const galleryUrls: string[] = Array.isArray(e.gallery)
                    ? e.gallery
                        .map((img: any) => safeImageUrl(img, ''))
                        .filter((url: string) => url.length > 0)
                    : [];

                return {
                    title: e.title || 'School Event',
                    date: e.date || '',
                    img: safeImageUrl(e.mainImage, '/images/pages/home/hero-1.jpg'),
                    description: e.description || '',
                    showOnHome: Boolean(e.showOnHome),
                    gallery: galleryUrls
                };
            });
        }
        return [];
    } catch (error) {
        console.error("Events fetch failed:", error);
        return [];
    }
}

/**
 * Fetches homepage specific curation settings from Sanity.
 * Falls back to local config logic if empty.
 */
export async function fetchHomeSettings(): Promise<any> {
    try {
        const query = `*[_type == "homeSettings"][0]{
            heroSlides[]{
                type,
                "src": select(type == "video" => videoUrl, urlFor(source).url()),
                caption,
                ctaText,
                ctaLink
            },
            featuredGallery[]->{
                "src": urlFor(image).url(),
                caption,
                "event": coalesce(category, "General")
            }
        }`;
        const data = await client.fetch(query);
        return data;
    } catch (error) {
        console.error("Home Settings fetch failed:", error);
        return null;
    }
}