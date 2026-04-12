import React, { useState } from 'react';

const CONTACT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyXxUgjQ5cL6Ynim9fMIIRclU0lY8opvAqgq2JHYl30WIVS17oQ0PVrED3kfcXSb-PxIg/exec';

interface QuickInquiryFormProps {
    title?: string;
    subtitle?: string;
    compact?: boolean;
}

const QuickInquiryForm: React.FC<QuickInquiryFormProps> = ({ 
    title = "Admission Inquiry 2026-27", 
    subtitle = "Fill the form below and our admissions team will contact you shortly.",
    compact = false
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmissionStatus('idle');

        const form = e.currentTarget;
        const formData = new FormData(form);
        // Add a hidden field to identify the source
        formData.append('Subject', 'Quick Admission Inquiry');

        try {
            await fetch(CONTACT_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
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
        <div className={`bg-[var(--color-background-card)] rounded-2xl shadow-2xl overflow-hidden border border-[var(--color-primary)]/5 ${compact ? 'p-6' : 'p-8 md:p-10'}`}>
            <div className="mb-8 text-center">
                <h3 className="text-2xl font-bold font-['Montserrat'] text-[var(--color-text-primary)] mb-2">{title}</h3>
                <p className="text-[var(--color-text-secondary)] text-sm">{subtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className={compact ? "space-y-4" : "grid md:grid-cols-2 gap-5"}>
                    <div className="space-y-1.5">
                        <label htmlFor="inquiry-name" className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] ml-1">Parent Name</label>
                        <input 
                            type="text" 
                            id="inquiry-name" 
                            name="Full Name" 
                            placeholder="e.g. Rahul Sharma"
                            required 
                            className="w-full px-4 py-3 bg-[var(--color-background-body)] border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label htmlFor="inquiry-phone" className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] ml-1">Phone Number</label>
                        <input 
                            type="tel" 
                            id="inquiry-phone" 
                            name="Phone Number" 
                            placeholder="+91 XXXXX XXXXX"
                            required 
                            className="w-full px-4 py-3 bg-[var(--color-background-body)] border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="inquiry-class" className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] ml-1">Admission For Class</label>
                    <select 
                        id="inquiry-class" 
                        name="Message" 
                        required 
                        className="w-full px-4 py-3 bg-[var(--color-background-body)] border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent outline-none transition-all cursor-pointer"
                    >
                        <option value="">Select a class</option>
                        <option value="Nursery">Nursery</option>
                        <option value="LKG">LKG</option>
                        <option value="UKG">UKG</option>
                        <option value="Class 1">Class 1</option>
                        <option value="Class 2">Class 2</option>
                        <option value="Class 3">Class 3</option>
                        <option value="Class 4">Class 4</option>
                        <option value="Class 5">Class 5</option>
                        <option value="Class 6">Class 6</option>
                        <option value="Class 7">Class 7</option>
                        <option value="Class 8">Class 8</option>
                    </select>
                </div>

                {/* Additional hidden email to satisfy your existing Google Script if required */}
                <input type="hidden" name="Email Address" value="no-email-provided@sunshine.school" />

                <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[var(--color-primary)] text-[var(--color-text-inverted)] font-bold py-4 px-8 rounded-xl hover:bg-[var(--color-secondary)] hover:shadow-lg transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center transform active:scale-95 translate-y-2"
                >
                    {isSubmitting ? (
                        <>
                            <i className="fas fa-spinner fa-spin mr-2"></i>
                            Processing...
                        </>
                    ) : (
                        <>
                            <i className="fas fa-paper-plane mr-2 text-sm opacity-80"></i>
                            Submit Inquiry
                        </>
                    )}
                </button>

                {submissionStatus === 'success' && (
                    <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-100 flex items-center gap-3 animate-fade-in">
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0">
                            <i className="fas fa-check"></i>
                        </div>
                        <p className="text-green-700 text-sm font-medium">Thank you! Our admission team will call you within 24 hours.</p>
                    </div>
                )}
                {submissionStatus === 'error' && (
                    <div className="mt-6 p-4 bg-red-50 rounded-xl border border-red-100 flex items-center gap-3 animate-fade-in">
                        <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white shrink-0">
                            <i className="fas fa-exclamation-triangle"></i>
                        </div>
                        <p className="text-red-700 text-sm font-medium">Unable to send query. Please call us directly at +91 9692977727.</p>
                    </div>
                )}
            </form>
        </div>
    );
};

export default QuickInquiryForm;
