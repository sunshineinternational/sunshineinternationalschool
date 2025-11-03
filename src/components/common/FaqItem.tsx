
import React from 'react';

interface FaqItemProps {
    faq: { q: string; a: string };
    isOpen: boolean;
    onClick: () => void;
}

export const FaqItem: React.FC<FaqItemProps> = ({ faq, isOpen, onClick }) => {
    return (
        <div className="border-b border-[var(--color-border)]">
            <button onClick={onClick} className="w-full text-left flex justify-between items-center py-4 px-2 focus:outline-none">
                <span className="font-semibold text-[var(--color-text-primary)]">{faq.q}</span>
                <span className={`transform transition-transform duration-300 text-[var(--color-text-accent)] ${isOpen ? 'rotate-45' : ''}`}>
                    <i className="fas fa-plus"></i>
                </span>
            </button>
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-40' : 'max-h-0'}`}>
                <p className="pt-0 p-2 text-[var(--color-text-secondary)]">{faq.a}</p>
            </div>
        </div>
    );
};