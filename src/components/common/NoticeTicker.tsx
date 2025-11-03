import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchNoticesData } from '../../services/dataService';
import { parseDDMMYYYY } from '../../utils';
import type { Notice } from '../../types';

const NoticeTicker: React.FC = () => {
    const [latestNotice, setLatestNotice] = useState<Notice | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadLatestNotice = async () => {
            try {
                // Check session storage first
                const dismissed = sessionStorage.getItem('noticeTickerDismissed');
                if (dismissed) {
                    setIsLoading(false);
                    return;
                }

                const notices = await fetchNoticesData();
                if (notices.length > 0) {
                    const sortedNotices = notices.sort((a, b) => parseDDMMYYYY(b.date).getTime() - parseDDMMYYYY(a.date).getTime());
                    const mostRecent = sortedNotices[0];
                    setLatestNotice(mostRecent);
                    setIsVisible(true);
                }
            } catch (error) {
                console.error("Failed to load latest notice:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadLatestNotice();
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        try {
            sessionStorage.setItem('noticeTickerDismissed', 'true');
        } catch (error) {
            console.error("Could not set sessionStorage item:", error);
        }
    };
    
    // Don't render anything while loading or if it's not visible
    if (isLoading || !isVisible || !latestNotice) {
        return null;
    }

    return (
        <div className="bg-yellow-400 text-yellow-900 sticky top-[75px] z-[999] transition-transform duration-300"
             style={{ transform: isVisible ? 'translateY(0)' : 'translateY(-100%)' }}>
            <div className="container mx-auto px-4 py-2 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-shrink min-w-0">
                    <span className="font-bold bg-yellow-500 text-yellow-900 text-xs px-2 py-0.5 rounded-full flex-shrink-0">NEW</span>
                    <div className="overflow-hidden flex-grow marquee-container">
                      <Link to="/notices" className="animate-marquee hover:underline">
                        {latestNotice.title}
                      </Link>
                    </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                    <Link to="/notices" className="hidden sm:inline-block font-semibold text-sm hover:underline">View All</Link>
                    <button onClick={handleDismiss} aria-label="Dismiss notice" className="text-lg hover:bg-yellow-500 rounded-full w-6 h-6 flex items-center justify-center">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NoticeTicker;