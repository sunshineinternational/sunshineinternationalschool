import React, { useState, useEffect } from 'react';

const FloatingWhatsAppButton: React.FC = () => {
    const [isShifted, setIsShifted] = useState(false);
    const phoneNumber = "917815087065";
    const message = "Hello! I am interested in Sunshine International School and have some queries.";
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
            className={`floating-whatsapp-button ${isShifted ? 'shifted' : ''}`}
            aria-label="Chat with us on WhatsApp"
        >
            <i className="fab fa-whatsapp"></i>
            <span className="whatsapp-tooltip">Chat with us</span>
        </a>
    );
};

export default FloatingWhatsAppButton;
