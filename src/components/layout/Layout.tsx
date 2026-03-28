import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import BackToTopButton from '../common/BackToTopButton';
import FloatingWhatsAppButton from '../common/FloatingWhatsAppButton';

const Layout: React.FC = () => {
    const location = useLocation();

    React.useEffect(() => {
        // Smooth scroll for hash links or top of page
        if (location.hash) {
            const id = location.hash.substring(1);
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    const headerOffset = 75;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
            }, 100);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [location.pathname, location.hash]);

    return (
        <div className="font-['Roboto'] min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow" style={{ paddingTop: '75px' }}>
                <Outlet />
            </main>
            <Footer />
            <FloatingWhatsAppButton />
            <BackToTopButton />
        </div>
    );
};

export default Layout;
