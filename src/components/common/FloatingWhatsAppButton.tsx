import React, { useState, useEffect } from 'react';

const FloatingWhatsAppButton: React.FC = () => {
    const [isShifted, setIsShifted] = useState(false);
    const phoneNumber = "917815087065";
    const message = "Hello! I have an inquiry regarding student admission for the 2026-27 session.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    const toggleShift = () => {
        if (window.pageYOffset > 300) {
            setIsShifted(true);
        } else {
            setIsShifted(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleShift);
        return () => {
            window.removeEventListener('scroll', toggleShift);
        };
    }, []);

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`floating-whatsapp-button ${isShifted ? 'shifted' : ''} group`}
            aria-label="Inquiry on WhatsApp"
        >
            <div className="absolute -left-40 top-1/2 -translate-y-1/2 bg-white text-[var(--color-primary)] px-4 py-2 rounded-lg shadow-xl text-xs font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none border border-[var(--color-primary)]/10 whitespace-nowrap">
                Talk to Admissions 🎓
            </div>
            <i className="fab fa-whatsapp animate-bounce-slow"></i>
        </a>
    );
};

export default FloatingWhatsAppButton;
