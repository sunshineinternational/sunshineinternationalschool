import React, { useState } from 'react';
import PageHero from '../components/common/PageHero';
import Seo from '../components/common/Seo';
import ScrollAnimator from '../components/common/ScrollAnimator';

// Google Apps Script URL for the Contact form
const CONTACT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyXxUgjQ5cL6Ynim9fMIIRclU0lY8opvAqgq2JHYl30WIVS17oQ0PVrED3kfcXSb-PxIg/exec';

const Contact: React.FC = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmissionStatus('idle');

        // FIX: Removed check for placeholder URL as it's already set and was causing a TypeScript error.
        const form = e.currentTarget;
        const formData = new FormData(form);

        try {
            await fetch(CONTACT_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Fix for CORS errors when posting to Google Apps Script
                body: formData,
            });

            setSubmissionStatus('success');
            form.reset();
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmissionStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

  return (
    <div>
      <Seo
        title="Contact Us | Sunshine International School, Purushottampur"
        description="Get in touch with Sunshine International School (SIS), Purushottampur. Find our address, phone number, email, and office hours. We are here to answer your questions."
        imageUrl="/images/pages/contact/hero.jpg"
      />
      <PageHero 
        title="Get in Touch"
        subtitle="We're here to answer your questions and help you learn more about our school"
        imageUrl="/images/pages/contact/hero.jpg"
      />

      <ScrollAnimator>
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center max-w-6xl mx-auto">
              <div className="bg-[var(--color-background-card)] p-8 rounded-lg shadow-md transition-transform duration-300 hover:-translate-y-2">
                  <div className="text-4xl text-[var(--color-text-accent)] mb-4"><i className="fas fa-map-marker-alt"></i></div>
                  <h3 className="text-xl font-bold mb-2 font-['Montserrat'] text-[var(--color-text-primary)]">Visit Us</h3>
                  <p className="text-[var(--color-text-secondary)]">Main Road, Kumari,<br/>Purushottampur, 761018,<br/>Ganjam, Odisha, India</p>
              </div>
              <div className="bg-[var(--color-background-card)] p-8 rounded-lg shadow-md transition-transform duration-300 hover:-translate-y-2">
                  <div className="text-4xl text-[var(--color-text-accent)] mb-4"><i className="fas fa-phone"></i></div>
                  <h3 className="text-xl font-bold mb-2 font-['Montserrat'] text-[var(--color-text-primary)]">Call Us</h3>
                  <p className="text-[var(--color-text-secondary)]">
                      <a href="tel:+919692977727" className="block hover:text-[var(--color-text-accent)]">+91 9692977727</a>
                      <a href="tel:+919348181404" className="block hover:text-[var(--color-text-accent)]">+91 9348181404</a>
                  </p>
              </div>
              <div className="bg-[var(--color-background-card)] p-8 rounded-lg shadow-md transition-transform duration-300 hover:-translate-y-2">
                  <div className="text-4xl text-[var(--color-text-accent)] mb-4"><i className="fas fa-envelope"></i></div>
                  <h3 className="text-xl font-bold mb-2 font-['Montserrat'] text-[var(--color-text-primary)]">Email Us</h3>
                  <a href="mailto:schoolsunshineinternational@gmail.com" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-accent)] break-all">schoolsunshineinternational@gmail.com</a>
              </div>
            </div>
          </div>
        </section>
      </ScrollAnimator>

      <ScrollAnimator>
        <section className="py-16 bg-[var(--color-background-section)]">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8 font-['Montserrat'] text-[var(--color-text-primary)]">Send Us a Message</h2>
            <div className="max-w-3xl mx-auto bg-[var(--color-background-card)] p-8 rounded-lg shadow-md">
              <form onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-6 mb-6">
                   <div>
                      <label htmlFor="full-name" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Full Name</label>
                      <input type="text" id="full-name" name="Full Name" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] bg-transparent" />
                  </div>
                  <div>
                      <label htmlFor="email-address-contact" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Email Address</label>
                      <input type="email" id="email-address-contact" name="Email Address" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] bg-transparent" />
                  </div>
                  <div>
                      <label htmlFor="phone-number-contact" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Phone Number</label>
                      <input type="tel" id="phone-number-contact" name="Phone Number" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] bg-transparent" />
                  </div>
                   <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Subject</label>
                      <select id="subject" name="Subject" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] bg-[var(--color-background-body)]">
                          <option value="">Select a subject</option>
                          <option value="admission">Admission Inquiry</option>
                          <option value="academics">Academic Information</option>
                          <option value="other">Other</option>
                      </select>
                  </div>
                </div>
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Message</label>
                  <textarea id="message" name="Message" rows={5} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] bg-transparent"></textarea>
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[var(--color-accent)] text-[var(--color-text-inverted)] font-bold py-3 px-6 rounded-md hover:bg-[var(--color-secondary)] transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                      <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Sending...
                      </>
                  ) : (
                      'Send Message'
                  )}
                </button>
                 {submissionStatus === 'success' && <p role="alert" aria-live="assertive" className="text-green-600 mt-4 text-center">Thank you for your message! We will get back to you soon.</p>}
                 {submissionStatus === 'error' && <p role="alert" aria-live="assertive" className="text-red-600 mt-4 text-center">Something went wrong. Please try again later.</p>}
              </form>
            </div>
          </div>
        </section>
      </ScrollAnimator>

      <ScrollAnimator>
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8 font-['Montserrat'] text-[var(--color-text-primary)]">Find Us</h2>
            <div className="rounded-lg overflow-hidden shadow-lg h-96">
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
        </section>
      </ScrollAnimator>

      <ScrollAnimator>
        <section className="py-16 bg-[var(--color-background-section)]">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 font-['Montserrat'] text-[var(--color-text-primary)]">Office Hours</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-[var(--color-background-card)] p-6 rounded-lg shadow-md text-center">
                  <h3 className="text-xl font-bold text-[var(--color-text-accent)] mb-4 font-['Montserrat']">Administration Office</h3>
                  <ul className="text-[var(--color-text-secondary)] space-y-2">
                      <li className="flex justify-between border-b pb-1"><span>Monday - Saturday</span> <span>8:00 AM - 2:30 PM</span></li>
                      <li className="flex justify-between"><span>Sunday</span> <span>Holiday</span></li>
                  </ul>
              </div>
               <div className="bg-[var(--color-background-card)] p-6 rounded-lg shadow-md text-center">
                  <h3 className="text-xl font-bold text-[var(--color-text-accent)] mb-4 font-['Montserrat']">Admission Office</h3>
                  <ul className="text-[var(--color-text-secondary)] space-y-2">
                      <li className="flex justify-between border-b pb-1"><span>Monday - Saturday</span> <span>9:00 AM - 4:00 PM</span></li>
                      <li className="flex justify-between"><span>Sunday</span> <span>Closed</span></li>
                  </ul>
              </div>
               <div className="bg-[var(--color-background-card)] p-6 rounded-lg shadow-md text-center">
                  <h3 className="text-xl font-bold text-[var(--color-text-accent)] mb-4 font-['Montserrat']">School Hours</h3>
                  <ul className="text-[var(--color-text-secondary)] space-y-2">
                      <li className="flex justify-between border-b pb-1"><span>Monday - Saturday</span> <span>8:00 AM - 2:30 PM</span></li>
                      <li className="flex justify-between"><span>Sunday</span> <span>Closed</span></li>
                  </ul>
              </div>
            </div>
          </div>
        </section>
      </ScrollAnimator>
    </div>
  );
};

export default Contact;