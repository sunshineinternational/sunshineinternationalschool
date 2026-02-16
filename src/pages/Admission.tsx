import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/common/PageHero';
import { FaqItem } from '../components/common/FaqItem';
import Seo from '../components/common/Seo';
import type { AdmissionProcessStep, Faq } from '../types';
import ScrollAnimator from '../components/common/ScrollAnimator';
import { admissionProcessData, requiredDocuments, admissionFaqData } from '../data/admission';

const Admission: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div>
            <Seo
                title="Admissions 2025-26 | Sunshine International School, Purushottampur"
                description="Join our community of learners. Find information about the admission process, eligibility, and required documents for the 2025-26 session at Sunshine International School (SIS), a premier CBSE school in Purushottampur."
                imageUrl="/images/pages/admission/hero.jpg"
            />
            <PageHero
                title="Admissions 2025-26"
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
                                    <div className="text-4xl text-[var(--color-text-accent)] mb-4"><i className={step.icon}></i></div>
                                    <h3 className="text-xl font-bold mb-3 font-['Montserrat'] text-[var(--color-text-primary)]">{step.title}</h3>
                                    <p className="text-[var(--color-text-secondary)] text-sm flex-grow">{step.description}</p>
                                </div>
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
                    <div className="container mx-auto px-4 text-center max-w-4xl">
                        <h2 className="text-3xl font-bold mb-4 font-['Montserrat'] text-[var(--color-text-primary)]">Have More Questions?</h2>
                        <p className="text-[var(--color-text-secondary)] mb-8">Our admissions team is here to help. Feel free to reach out to us for any queries regarding the admission process.</p>
                        <Link to="/contact" className="btn-secondary inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-full text-[var(--color-text-inverted)] bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] transition-all duration-300 transform hover:scale-105 shadow-lg">
                            Contact Admissions Office
                        </Link>
                    </div>
                </section>
            </ScrollAnimator>
        </div>
    );
};

export default Admission;