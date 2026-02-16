import type { AdmissionProcessStep, Faq } from '../types';

export const admissionProcessData: AdmissionProcessStep[] = [
    { icon: 'fas fa-file-alt', title: '1. Application Submission', description: 'Collect the application form from the school office and submit it along with all required documents.' },
    { icon: 'fas fa-check-double', title: '2. Document Verification', description: 'Our admission team will review your application and documents for completeness and eligibility.' },
    { icon: 'fas fa-user-friends', title: '3. Student Interaction', description: 'A friendly interaction session with the student and parents will be scheduled to understand the child better.' },
    { icon: 'fas fa-envelope-open-text', title: '4. Admission Offer', description: 'Successful candidates will receive an admission offer letter with further instructions.' },
    { icon: 'fas fa-credit-card', title: '5. Fee Payment', description: 'Complete the admission by paying the required fees at the school office to confirm your seat.' },
    { icon: 'fas fa-check-circle', title: '6. Enrollment Complete', description: 'Once fees are paid, your child is officially enrolled. Welcome to the Sunshine family!' },
];

export const requiredDocuments: string[] = [
    'Birth Certificate of the student',
    'Previous year’s academic records/report card',
    'Transfer Certificate (TC) from the previous school (for Class II and above)',
    'Aadhaar Card of the student and parents/guardian',
    'Recent passport-sized photographs of the student and parents',
    'Proof of residence (e.g., utility bill, rental agreement)',
];

export const admissionFaqData: Faq[] = [
  { q: "What is the age criteria for admission to Nursery?", a: "The child should be at least 3 years old as of April 1st of the academic year for admission to Nursery." },
  { q: "Is there an entrance exam for admission?", a: "For lower classes (Nursery to UKG), admission is based on an informal interaction. For Class I and above, a baseline assessment is conducted to understand the student's academic level." },
  { q: "What are the school fees?", a: "The detailed fee structure will be provided along with the admission offer. You can also contact the admission office for more information." },
  { q: "When does the admission process for the next academic year begin?", a: "Admissions for the 2025-26 session typically begin in December. Please check our website for the exact schedule." },
];