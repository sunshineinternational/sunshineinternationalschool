import React, { useState, useEffect } from 'react';
import PageHero from '../components/common/PageHero';
import { fetchNoticesData } from '../services/dataService';
import type { Notice } from '../types';
import Seo from '../components/common/Seo';
import { parseDDMMYYYY } from '../utils';
import ScrollAnimator from '../components/common/ScrollAnimator';

/**
 * Formats a date string into DD/MM/YYYY format, ensuring consistency.
 * If parsing fails, it returns the original string.
 * @param dateString The date string to format (e.g., "20/11/2025").
 * @returns The formatted date string.
 */
const formatDate = (dateString: string): string => {
    const date = parseDDMMYYYY(dateString);
    if (isNaN(date.getTime())) {
        return dateString; // Return original string if parsing fails
    }
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
};


const Notices: React.FC = () => {
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
                setError('Failed to load notices. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        loadNotices();
    }, []);

    return (
        <div>
            <Seo
                title="Notices | Sunshine International School (SIS), Purushottampur"
                description="Stay informed with the latest updates, announcements, and events from Sunshine International School (SIS). View all official school notices for our Purushottampur campus."
                imageUrl="/images/pages/notices/hero.jpg"
            />
            <PageHero 
                title="School Notices"
                subtitle="Stay informed with the latest updates, announcements, and events."
                imageUrl="/images/pages/notices/hero.jpg"
            />

            <ScrollAnimator>
                <section className="py-16 bg-[var(--color-background-section)]">
                    <div className="container mx-auto px-4">
                        {loading && (
                            <div className="text-center">
                                <i className="fas fa-spinner fa-spin text-3xl text-[var(--color-text-accent)]"></i>
                                <p className="mt-4 text-[var(--color-text-secondary)]">Loading notices...</p>
                            </div>
                        )}
                        {error && <p className="text-center text-lg text-red-600">{error}</p>}
                        
                        {!loading && !error && (
                            notices.length > 0 ? (
                                <div className="overflow-x-auto bg-[var(--color-background-card)] shadow-lg rounded-lg">
                                    <table className="w-full text-sm text-left text-[var(--color-text-secondary)]">
                                        <thead className="text-xs text-[var(--color-text-inverted)] uppercase bg-[var(--color-primary)]">
                                            <tr>
                                                <th scope="col" className="px-6 py-4 w-16 text-center font-['Montserrat']">S.N.</th>
                                                <th scope="col" className="px-6 py-4 w-40 font-['Montserrat']">Publish Date</th>
                                                <th scope="col" className="px-6 py-4 font-['Montserrat']">Title</th>
                                                <th scope="col" className="px-6 py-4 w-24 text-center font-['Montserrat']">Browse</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {notices.map((notice, index) => {
                                                const isNew = (new Date().getTime() - parseDDMMYYYY(notice.date).getTime()) < 14 * 24 * 60 * 60 * 1000; // 14 days
                                                return (
                                                    <tr key={index} className="border-b border-[var(--color-border)] odd:bg-[var(--color-background-card)] even:bg-[var(--color-background-section)]">
                                                        <td className="px-6 py-4 font-medium text-center text-[var(--color-text-primary)]">{index + 1}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{formatDate(notice.date)}</td>
                                                        <td className="px-6 py-4 font-medium text-[var(--color-text-primary)]">
                                                            {notice.title}
                                                            {notice.type && <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full align-middle">{notice.type}</span>}
                                                            {isNew && <span className="ml-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded align-middle">New</span>}
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <a 
                                                                href={notice.url} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer" 
                                                                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-accent)] text-[var(--color-text-inverted)] hover:bg-[var(--color-secondary)] transition-colors"
                                                                aria-label={`View notice: ${notice.title}`}
                                                            >
                                                                <i className="fas fa-eye"></i>
                                                            </a>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-center text-lg text-gray-500">No notices found at this time.</p>
                            )
                        )}
                    </div>
                </section>
            </ScrollAnimator>
        </div>
    );
};

export default Notices;