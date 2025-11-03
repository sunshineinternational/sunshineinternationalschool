import React from 'react';
import { Link } from 'react-router-dom';
import ThemeSwitcher from './ThemeSwitcher';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[var(--color-primary)] text-[var(--color-text-inverted)] pt-8 sm:pt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="footer-info">
            <h3 className="text-xl font-bold mb-3 font-['Montserrat']">Sunshine International School</h3>
            <p className="text-sm text-[var(--color-text-accent)] mb-2">Established 2012</p>
            <p className="text-sm text-[var(--color-footer-text-secondary)] leading-relaxed">"Empowering bright futures through innovative teaching and a diverse, nurturing curriculum."</p>
          </div>
          <div className="footer-links">
            <h3 className="text-lg font-bold mb-4 font-['Montserrat']">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-[var(--color-footer-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-[var(--color-footer-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">About Us</Link></li>
              <li><Link to="/academics" className="text-[var(--color-footer-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">Academics</Link></li>
              <li><Link to="/admission" className="text-[var(--color-footer-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">Admission</Link></li>
              <li><Link to="/teachers" className="text-[var(--color-footer-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">Teachers</Link></li>
              <li><Link to="/notices" className="text-[var(--color-footer-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">Notices</Link></li>
              <li><Link to="/gallery" className="text-[var(--color-footer-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">Gallery</Link></li>
              <li><Link to="/contact" className="text-[var(--color-footer-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div className="footer-contact">
            <h3 className="text-lg font-bold mb-4 font-['Montserrat']">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3 text-[var(--color-text-accent)]"></i>
                <span className="text-sm text-[var(--color-footer-text-secondary)]">Main Road, Kumari, <br />Purushottampur, 761018, Ganjam <br />Odisha, India</span>
              </div>
              <div className="flex items-start">
                <i className="fas fa-phone mt-1 mr-3 text-[var(--color-text-accent)]"></i>
                <div className="flex flex-col text-sm">
                  <a href="tel:+919692977727" className="text-[var(--color-footer-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">+91 9692977727</a>
                  <a href="tel:+919348181404" className="text-[var(--color-footer-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">+91 9348181404</a>
                </div>
              </div>
              <div className="flex items-start">
                <i className="fas fa-envelope mt-1 mr-3 text-[var(--color-text-accent)]"></i>
                <a href="mailto:schoolsunshineinternational@gmail.com" className="text-sm text-[var(--color-footer-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors break-all">schoolsunshineinternational@gmail.com</a>
              </div>
            </div>
          </div>
          <div className="footer-social">
            <h3 className="text-lg font-bold mb-4 font-['Montserrat']">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" aria-label="Visit our Facebook page" className="text-xl hover:text-[var(--color-text-accent)] transition-transform hover:scale-110"><i className="fab fa-facebook-f"></i></a>
              <a href="#" aria-label="Visit our Instagram profile" className="text-xl hover:text-[var(--color-text-accent)] transition-transform hover:scale-110"><i className="fab fa-instagram"></i></a>
              <a href="#" aria-label="Visit our Twitter profile" className="text-xl hover:text-[var(--color-text-accent)] transition-transform hover:scale-110"><i className="fab fa-twitter"></i></a>
            </div>
            <ThemeSwitcher />
          </div>
        </div>

        <div className="footer-map my-8 sm:my-12 py-8 border-t border-b border-white/10">
            <h3 className="text-2xl font-bold text-center mb-6 relative font-['Montserrat']">Our Location</h3>
            <div className="map-container rounded-lg overflow-hidden shadow-lg h-64 md:h-80">
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d384.0887261446648!2d84.89932858663845!3d19.516699656041418!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a22ab005e907835%3A0x91758fee54bd9111!2sSUNSHINE%20INTERNATIONAL%20SCHOOL!5e0!3m2!1sen!2sin!4v1762048537345!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            </div>
        </div>

        <div className="footer-bottom text-center py-4">
          <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} Sunshine International School. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;