import React, { useState } from 'react';
import PageHero from '../components/common/PageHero';
import { FaqItem } from '../components/common/FaqItem';
import Seo from '../components/common/Seo';
import ScrollAnimator from '../components/common/ScrollAnimator';
import { admissionProcessData, requiredDocuments, admissionFaqData } from '../data/admission';
import QuickInquiryForm from '../components/common/QuickInquiryForm';

const Admission: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div>
            <Seo
                title="Admissions 2026-27 | Sunshine International School, Purushottampur"
                description="Join our community of learners. Find information about the admission process, eligibility, and required documents for the 2026-27 session at Sunshine International School (SIS), a premier CBSE school in Purushottampur."
                imageUrl="/images/pages/admission/hero.jpg"
            />
            <PageHero
                title="Admissions 2026-27"
                subtitle="Join our community of learners and thinkers. Your future starts here."
                imageUrl="/images/pages/admission/hero.jpg"
            />

            <ScrollAnimator>
                <section className="py-16 bg-[var(--color-background-section)]">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12 font-['Montserrat'] text-[var(--color-text-primary)]">Our Admission Process</h2>
                        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {admissionProcessData.map((step, index) => (
                                <div key={index} className="bg-[var(--color-background-card)] p-6 rounded-lg shadow-md text-center transition-transform duration-300 hover:-translate-y-2 flex flex-col items-center">
                                    <div className="text-4xl text-[var(--color-primary)] mb-4"><i className={step.icon}></i></div>
                                    <h3 className="text-xl font-bold mb-3 font-['Montserrat'] text-[var(--color-text-primary)]">{step.title}</h3>
                                    <p className="text-[var(--color-text-secondary)] text-sm flex-grow">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </ScrollAnimator>

            <ScrollAnimator>
                <section id="inquiry-form" className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col lg:flex-row items-center gap-12 max-w-6xl mx-auto">
                            <div className="lg:w-1/2">
                                <h2 className="text-4xl font-bold mb-6 font-['Montserrat'] text-[var(--color-text-primary)] leading-tight">Start Your Child's <br/><span className="text-[var(--color-primary)]">Journey to Excellence</span></h2>
                                <p className="text-lg text-[var(--color-text-secondary)] mb-8 leading-relaxed">
                                    Choosing the right school is the most important decision for your child's future. 
                                    Our admissions team is here to guide you through every step of the process. 
                                    Fill out the form to book a <span className="font-bold text-[var(--color-text-primary)]">Personal Campus Tour</span> or to get a call back from us.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 text-[var(--color-text-primary)]">
                                        <div className="w-10 h-10 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-primary)]"><i className="fas fa-phone-alt"></i></div>
                                        <div className="font-medium">+91 9692977727</div>
                                    </div>
                                    <div className="flex items-center gap-4 text-[var(--color-text-primary)]">
                                        <div className="w-10 h-10 rounded-full bg-[var(--color-secondary)]/20 flex items-center justify-center text-[var(--color-secondary)]"><i className="fas fa-envelope"></i></div>
                                        <div className="font-medium">schoolsunshineinternational@gmail.com</div>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:w-1/2 w-full">
                                <QuickInquiryForm />
                            </div>
                        </div>
                    </div>
                </section>
            </ScrollAnimator>

            <ScrollAnimator>
                <section className="py-16 bg-[var(--color-background-section)]">
                    <div className="container mx-auto px-4 max-w-3xl">
                        <h2 className="text-3xl font-bold text-center mb-8 font-['Montserrat'] text-[var(--color-text-primary)]">Admission FAQs</h2>
                        <div className="bg-[var(--color-background-card)] p-4 sm:p-8 rounded-lg shadow-md">
                            {admissionFaqData.map((faq, index) => (
                                <FaqItem
                                    key={index}
                                    faq={faq}
                                    isOpen={openIndex === index}
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            </ScrollAnimator>

            <ScrollAnimator>
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12 font-['Montserrat'] text-[var(--color-text-primary)]">Documents Required</h2>
                        <div className="max-w-3xl mx-auto bg-[var(--color-background-card)] p-8 rounded-lg shadow-md">
                            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
                                {requiredDocuments.map((doc, index) => (
                                    <li key={index} className="flex items-start">
                                        <span className="text-[var(--color-text-accent)] mr-3 mt-1"><i className="fas fa-file-check"></i></span>
                                        <p className="text-[var(--color-text-secondary)]">{doc}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>
            </ScrollAnimator>

            <ScrollAnimator>
                <section className="py-16 bg-[#FDF2F2]">
                    <div className="container mx-auto px-4 text-center max-w-4xl">
                        <i className="fas fa-file-pdf text-5xl text-red-500 mb-6"></i>
                        <h2 className="text-3xl font-bold mb-4 font-['Montserrat'] text-[var(--color-text-primary)]">Download Prospectus 2026-27</h2>
                        <p className="text-[var(--color-text-secondary)] mb-8">Get detailed information about our curriculum, facilities, academic calendar, and school life by downloading our official prospectus.</p>
                        <a href="/documents/prospectus.pdf" target="_blank" className="btn-secondary inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-full text-white bg-red-600 hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                            Download Prospectus (PDF)
                        </a>
                    </div>
                </section>
            </ScrollAnimator>
        </div>
    );
};

export default Admission;