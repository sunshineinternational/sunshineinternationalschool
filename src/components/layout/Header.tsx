import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';

interface NavLinkChild {
  name: string;
  path: string;
}

interface NavLinkItem {
  name: string;
  path?: string;
  children?: NavLinkChild[];
}

const navLinks: NavLinkItem[] = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about' },
  { name: 'Academics', path: '/academics' },
  { name: 'Admission', path: '/admission' },
  { 
    name: 'Explore', 
    children: [
      { name: 'Our Faculty', path: '/teachers' },
      { name: 'Gallery', path: '/gallery' },
      { name: 'Events', path: '/events' },
      { name: 'School Notices', path: '/notices' },
      { name: 'House System', path: '/house-system' },
    ] 
  },
  { name: 'Contact Us', path: '/contact' },
];

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isMenuOpen]);
  
  // Close mobile dropdown when menu is closed
  useEffect(() => {
    if (!isMenuOpen) {
      setOpenMobileDropdown(null);
    }
  }, [isMenuOpen]);
  
  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const activeLinkClass = "text-[var(--color-text-accent)]";
  const baseLinkClass = "text-[var(--color-text-primary)] transition-colors duration-300 hover:text-[var(--color-text-accent)]";
  const logoSrc = "/images/common/logo-full.png";

  // Mobile-specific link classes for high contrast on dark background
  const mobileActiveLinkClass = "text-[var(--color-text-accent)]";
  const mobileBaseLinkClass = "text-[var(--color-footer-text-secondary)] hover:text-white";

  const handleMobileDropdown = (dropdownName: string) => {
    setOpenMobileDropdown(prev => prev === dropdownName ? null : dropdownName);
  };


  return (
    <header className={`fixed top-0 left-0 w-full bg-[var(--color-background-header)] text-[var(--color-header-text)] z-[1000] transition-shadow duration-300 ${isScrolled ? 'shadow-lg' : 'border-b border-gray-300'}`}>
      <div className="container mx-auto max-w-[1400px] flex justify-between items-center h-[75px] px-4 md:px-8">
        <Link to="/" className="flex items-center">
          <img 
            src={logoSrc}
            alt="Sunshine International School Logo" 
            className="h-14 w-auto" 
          />
        </Link>
        
        <nav className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              link.children ? (
                <li key={link.name} className="relative group">
                  <button className={`${baseLinkClass} font-semibold flex items-center gap-2 pb-1 ${link.children.some(child => location.pathname === child.path) ? activeLinkClass : ''}`}>
                    {link.name}
                    <i className="fas fa-chevron-down text-xs transition-transform duration-300 group-hover:rotate-180"></i>
                  </button>
                  <ul className="absolute top-full left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-md mt-2 w-56 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-10">
                    {link.children.map(child => (
                      <li key={child.name}>
                        <NavLink 
                          to={child.path}
                          className={({ isActive }) => 
                            `block w-full text-left px-4 py-2 text-sm rounded-md transition-colors duration-200 ${
                              isActive 
                                ? 'bg-[var(--color-accent)] text-[var(--color-text-inverted)]' 
                                : 'text-[var(--color-text-primary)] hover:bg-[var(--color-accent)] hover:text-[var(--color-text-inverted)]'
                            }`
                          }
                        >
                          {child.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={link.name} className="relative">
                  <NavLink 
                    to={link.path!}
                    end={link.path === '/'}
                    className={({ isActive }) => `${isActive ? activeLinkClass : baseLinkClass} font-semibold relative pb-1 after:content-[''] after:absolute after:h-0.5 after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:bg-[var(--color-accent)] after:transition-all after:duration-300 ${isActive ? 'after:w-1/2' : 'after:w-0 hover:after:w-full'}`}
                  >
                    {link.name}
                  </NavLink>
                </li>
              )
            ))}
          </ul>
        </nav>
        
        <button className="lg:hidden text-2xl" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle mobile menu">
          <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </div>
      
      {/* Mobile Menu */}
      <div className={`fixed top-0 right-0 h-full w-full bg-[var(--color-primary)] z-50 transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} lg:hidden`}>
        <div className="flex justify-end p-5 h-[75px]">
            <button className="text-3xl text-[var(--color-text-inverted)]" onClick={() => setIsMenuOpen(false)} aria-label="Close mobile menu">
                <i className="fas fa-times"></i>
            </button>
        </div>
        <ul className="flex flex-col items-center justify-center h-[calc(100%-75px)] gap-6 px-8 overflow-y-auto">
          {navLinks.map((link) => (
            <li key={link.name} className="w-full text-center">
              {link.children ? (
                <div className="w-full">
                  <button 
                    onClick={() => handleMobileDropdown(link.name)}
                    className={`text-2xl font-semibold w-full flex justify-center items-center gap-2 ${link.children.some(child => location.pathname === child.path) ? mobileActiveLinkClass : mobileBaseLinkClass}`}
                  >
                    {link.name}
                    <i className={`fas fa-chevron-down text-base transition-transform duration-300 ${openMobileDropdown === link.name ? 'rotate-180' : ''}`}></i>
                  </button>
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openMobileDropdown === link.name ? 'max-h-96' : 'max-h-0'}`}>
                    <ul className="flex flex-col gap-4 mt-4">
                      {link.children.map(child => (
                        <li key={child.name}>
                          <NavLink
                            to={child.path}
                            onClick={() => setIsMenuOpen(false)}
                            className={({ isActive }) => `text-xl font-medium ${isActive ? mobileActiveLinkClass : mobileBaseLinkClass}`}
                          >
                            {child.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <NavLink 
                  to={link.path!}
                  end={link.path === '/'}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) => `text-2xl font-semibold ${isActive ? mobileActiveLinkClass : mobileBaseLinkClass}`}
                >
                  {link.name}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Header;