import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ResultPopup: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Set the expiry date: 3 days from March 30, 2026 (approx April 2, 2026)
    const EXPIRY_DATE = new Date('2026-04-02T23:59:59').getTime();

    useEffect(() => {
        const now = new Date().getTime();
        const hasSeen = localStorage.getItem('result_popup_seen_2025_26');

        // Only show if: 
        // 1. Current date is before the expiry date
        // 2. User hasn't dismissed it yet
        if (now < EXPIRY_DATE && !hasSeen) {
            // Delay showing by 1.5 seconds for a "Premium" smooth entry
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, [EXPIRY_DATE]);

    const handleClose = () => {
        setIsVisible(false);
        // Remember that user closed it for this browser session
        localStorage.setItem('result_popup_seen_2025_26', 'true');
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border-4 border-[var(--color-accent)] animate-scale-in">
                
                {/* Visual Header */}
                <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] p-8 text-center text-white relative">
                    <button 
                        onClick={handleClose}
                        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                    >
                        <i className="fas fa-times text-xl"></i>
                    </button>
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/30">
                        <i className="fas fa-graduation-cap text-4xl animate-bounce"></i>
                    </div>
                    <h2 className="text-2xl font-bold font-['Montserrat'] uppercase tracking-wider">Results Declared!</h2>
                    <p className="text-white/80 text-sm mt-1 uppercase font-semibold tracking-widest">Academic Session 2025-26</p>
                </div>

                {/* Content Area */}
                <div className="p-8 text-center">
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        The performance reports for all classes (Nursery to VIII) have been officially published. 
                        Parents can now access and download the digital report cards.
                    </p>
                    
                    <div className="flex flex-col gap-3">
                        <Link 
                            to="/results" 
                            onClick={handleClose}
                            className="bg-[var(--color-accent)] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-[var(--color-accent-dark)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group"
                        >
                            <span>Check All Results</span>
                            <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                        </Link>
                        
                        <button 
                            onClick={handleClose}
                            className="text-gray-400 text-sm font-semibold hover:text-gray-600 transition-colors py-2"
                        >
                            I'll check later
                        </button>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="bg-gray-50 p-4 border-t border-gray-100 text-center">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Sunshine International School Examination Portal</p>
                </div>
            </div>
        </div>
    );
};

export default ResultPopup;
