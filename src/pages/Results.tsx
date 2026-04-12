import React, { useState } from 'react';
import PageHero from '../components/common/PageHero';
import Seo from '../components/common/Seo';
import studentResults from '../data/student_results_final.json';
import ScrollAnimator from '../components/common/ScrollAnimator';

interface SubjectResult {
    subject: string;
    term1: { pt: number; nb: number; se: number; te: number; total: number; grade: string };
    term2: { pt: number; nb: number; se: number; te: number; total: number; grade: string };
}

interface StudentResult {
    class: string;
    roll_number: string;
    name: string;
    dob: string;
    subjects: SubjectResult[];
}

const Results: React.FC = () => {
    const [searchClass, setSearchClass] = useState('');
    const [rollNumber, setRollNumber] = useState('');
    const [result, setResult] = useState<StudentResult | null>(null);
    const [error, setError] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const classes = ['Nursery', 'LKG', 'UKG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setResult(null);
        setIsSearching(true);

        setTimeout(() => {
            try {
                const found = (studentResults as StudentResult[]).find(s => 
                    s.class.toUpperCase() === searchClass.toUpperCase() && 
                    parseInt(s.roll_number.toString()) === parseInt(rollNumber)
                );

                if (found) {
                    setResult(found);
                } else {
                    setError(`No result found for Class ${searchClass} Roll No ${rollNumber}.`);
                }
            } catch (err) {
                console.error('Search error:', err);
                setError('Could not process search. Please try again.');
            } finally {
                setIsSearching(false);
            }
        }, 800);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="bg-[var(--color-background-body)] min-h-screen pb-20">
            <Seo 
                title="Examination Results 2025-26" 
                description="Check Sunshine International School examination results for academic year 2025-26."
            />
            <PageHero 
                title="Examination Results" 
                subtitle="Academic Session 2025-26"
                imageUrl="/images/pages/admission/hero.jpg" 
            />

            <div className="container mx-auto px-4 mt-[-50px] relative z-30">
                <div className="max-w-4xl mx-auto">
                    
                    {/* Search Section */}
                    {!result && (
                        <ScrollAnimator>
                            <div className="bg-[var(--color-background-card)] rounded-2xl shadow-2xl p-8 border border-[var(--color-border)]">
                                <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6 text-center font-['Montserrat']">View Student Performance</h2>
                                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-[var(--color-text-secondary)] mb-2 uppercase tracking-slate-100">Select Class</label>
                                        <select 
                                            required
                                            value={searchClass}
                                            onChange={(e) => setSearchClass(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-gray-50 focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent outline-none transition-all"
                                        >
                                            <option value="">Choose Class</option>
                                            {classes.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-[var(--color-text-secondary)] mb-2 uppercase tracking-slate-100">Roll Number</label>
                                        <input 
                                            required
                                            type="text" 
                                            placeholder="e.g. 05"
                                            value={rollNumber}
                                            onChange={(e) => setRollNumber(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-gray-50 focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <button 
                                            disabled={isSearching}
                                            type="submit" 
                                            className="w-full py-4 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:bg-[var(--color-secondary)] transition-all shadow-lg flex items-center justify-center gap-2 group disabled:opacity-70"
                                        >
                                            {isSearching ? (
                                                <i className="fas fa-circle-notch animate-spin text-xl"></i>
                                            ) : (
                                                <>
                                                    <i className="fas fa-search group-hover:scale-110 transition-transform"></i>
                                                    Access My Result
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                                {error && <p className="mt-4 text-red-600 text-center font-medium bg-red-50 p-3 rounded-lg border border-red-100 animate-shake">{error}</p>}
                            </div>
                        </ScrollAnimator>
                    )}

                    {/* Result Display Section */}
                    {result && (
                        <div className="animate-fade-in-up print:mt-0">
                            <div className="mb-6 print:hidden">
                                <button 
                                    onClick={() => setResult(null)}
                                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] flex items-center gap-2 font-semibold transition-colors"
                                >
                                    <i className="fas fa-arrow-left"></i> Change Student
                                </button>
                            </div>

                            {/* The Report Card */}
                            <div id="report-card" className="bg-white rounded-2xl shadow-2xl p-10 border-4 border-[var(--color-primary)] relative overflow-hidden print:shadow-none print:border-2 print:p-6 print:rounded-none">
                                {/* School Header Tag for Report Card */}
                                <div className="text-center mb-8 border-b-2 border-gray-100 pb-6">
                                    <img src="/images/common/logo-full.png" alt="SIS Logo" className="h-20 mx-auto mb-4" />
                                    <h1 className="text-3xl font-bold text-[var(--color-primary)] font-['Montserrat'] uppercase tracking-widest">Sunshine International School</h1>
                                    <p className="text-gray-600 font-semibold uppercase text-sm mt-1">Nurturing Excellence, Inspiring Futures</p>
                                    <div className="mt-4 bg-[var(--color-primary)] text-white py-1.5 px-4 inline-block rounded-full font-bold text-sm tracking-widest uppercase">Progress Report: 2025-26</div>
                                </div>

                                {/* Student Info Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 bg-gray-50 p-6 rounded-xl border border-gray-100 print:bg-transparent">
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Student Name</p>
                                        <p className="font-bold text-[var(--color-text-primary)] text-lg leading-tight uppercase font-['Montserrat']">{result.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Class</p>
                                        <p className="font-bold text-[var(--color-text-primary)] text-lg capitalize">{result.class}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Roll Number</p>
                                        <p className="font-bold text-[var(--color-text-primary)] text-lg">{result.roll_number}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Date of Birth</p>
                                        <p className="font-bold text-[var(--color-text-primary)] text-lg">{result.dob}</p>
                                    </div>
                                </div>

                                {/* Main Results Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-[var(--color-primary)] text-white text-xs uppercase tracking-widest">
                                                <th rowSpan={2} className="p-3 border border-gray-200 text-left">Subject</th>
                                                <th colSpan={6} className="p-2 border border-gray-200 text-center">Term 1</th>
                                                <th colSpan={6} className="p-2 border border-gray-200 text-center">Term 2</th>
                                            </tr>
                                            <tr className="bg-gray-100 text-[10px] font-bold text-gray-600">
                                                <th className="p-2 border border-gray-200">PT</th>
                                                <th className="p-2 border border-gray-200">NB</th>
                                                <th className="p-2 border border-gray-200">SE</th>
                                                <th className="p-2 border border-gray-200">TE</th>
                                                <th className="p-2 border border-gray-200 bg-gray-200 font-black">Tot</th>
                                                <th className="p-2 border border-gray-200 bg-amber-50">Grd</th>
                                                <th className="p-2 border border-gray-200">PT</th>
                                                <th className="p-2 border border-gray-200">NB</th>
                                                <th className="p-2 border border-gray-200">SE</th>
                                                <th className="p-2 border border-gray-200">TE</th>
                                                <th className="p-2 border border-gray-200 bg-gray-200 font-black">Tot</th>
                                                <th className="p-2 border border-gray-200 bg-amber-50">Grd</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {result.subjects.map((sub, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                                    <td className="p-3 border border-gray-200 text-xs font-bold text-[var(--color-primary)] font-['Montserrat'] uppercase">{sub.subject}</td>
                                                    {/* Term 1 */}
                                                    <td className="p-2 border border-gray-200 text-center text-xs">{sub.term1.pt || '-'}</td>
                                                    <td className="p-2 border border-gray-200 text-center text-xs">{sub.term1.nb || '-'}</td>
                                                    <td className="p-2 border border-gray-200 text-center text-xs">{sub.term1.se || '-'}</td>
                                                    <td className="p-2 border border-gray-200 text-center text-xs">{sub.term1.te || '-'}</td>
                                                    <td className="p-2 border border-gray-200 text-center text-xs bg-gray-50 font-bold">{Math.max(sub.term1.total, sub.term1.te) || '-'}</td>
                                                    <td className="p-2 border border-gray-200 text-center text-xs font-black text-[var(--color-primary)] bg-[var(--color-accent)]/10">{sub.term1.grade || '-'}</td>
                                                    {/* Term 2 */}
                                                    <td className="p-2 border border-gray-200 text-center text-xs">{sub.term2.pt || '-'}</td>
                                                    <td className="p-2 border border-gray-200 text-center text-xs">{sub.term2.nb || '-'}</td>
                                                    <td className="p-2 border border-gray-200 text-center text-xs">{sub.term2.se || '-'}</td>
                                                    <td className="p-2 border border-gray-200 text-center text-xs">{sub.term2.te || '-'}</td>
                                                    <td className="p-2 border border-gray-200 text-center text-xs bg-gray-50 font-bold">{Math.max(sub.term2.total, sub.term2.te) || '-'}</td>
                                                    <td className="p-2 border border-gray-200 text-center text-xs font-black text-[var(--color-primary)] bg-[var(--color-accent)]/10">{sub.term2.grade || '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Grade Criteria Key & Abbreviations */}
                                <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col md:flex-row justify-between items-start gap-10">
                                    <div className="w-full md:w-1/2">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 underline">Abbreviations</h3>
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] text-gray-600 font-bold uppercase">
                                            <p><span className="text-[var(--color-primary)]">PT:</span> Periodic Test</p>
                                            <p><span className="text-[var(--color-primary)]">NB:</span> Note Book</p>
                                            <p><span className="text-[var(--color-primary)]">SE:</span> Subject Enrichment</p>
                                            <p><span className="text-[var(--color-primary)]">TE:</span> Terminal Exam</p>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-1/2">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 underline">Grading Key</h3>
                                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                            {[
                                                { g: 'A1', m: '91-100' }, { g: 'A2', m: '81-90' },
                                                { g: 'B1', m: '71-80' }, { g: 'B2', m: '61-70' },
                                                { g: 'C1', m: '51-60' }
                                            ].map(item => (
                                                <div key={item.g} className="text-[10px] bg-gray-50 p-1.5 rounded text-center border border-gray-100 flex flex-col">
                                                    <span className="font-bold text-[var(--color-primary)]">{item.g}</span>
                                                    <span className="text-[8px] text-gray-400">{item.m}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Certification & Signature */}
                                <div className="mt-12 flex justify-end">
                                    <div className="w-full md:w-1/3 flex flex-col items-center text-center">
                                        <div className="w-32 h-[1px] bg-gray-300 mb-2"></div>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">School Principal</p>
                                        <p className="text-[8px] text-gray-300 mt-1 uppercase italic">Sunshine International School</p>
                                    </div>
                                </div>

                                {/* Watermark for Premium feel */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] select-none pointer-events-none transform -rotate-12 w-full">
                                   <img src="/images/common/logo-full.png" alt="watermark" className="w-[500px] mx-auto" />
                                </div>
                            </div>

                            {/* Print Button at Bottom */}
                            <div className="mt-10 flex justify-center print:hidden">
                                <button 
                                    onClick={handlePrint}
                                    className="px-10 py-4 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-full font-bold shadow-[0_10px_20px_-10px_rgba(245,158,11,0.5)] hover:shadow-[0_15px_25px_-5px_rgba(245,158,11,0.6)] hover:scale-105 transition-all flex items-center gap-3 group"
                                >
                                    <i className="fas fa-print group-hover:animate-bounce"></i> 
                                    Download / Print Official Report Card
                                </button>
                            </div>

                        </div>
                    )}
                </div>
            </div>

            {/* Inline print styles to make the PDF look like a real Document */}
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    header, footer, .back-to-top-button, .floating-whatsapp-button { display: none !important; }
                    body { background: white !important; margin: 0 !important; padding: 0; }
                    .page-hero { display: none !important; }
                    .container { margin: 0 !important; width: 100% !important; max-width: none !important; }
                    #report-card { 
                        box-shadow: none !important; 
                        border: 2px solid black !important;
                        margin-top: 0 !important;
                        padding: 20px !important;
                        -webkit-print-color-adjust: exact;
                    }
                }
            ` }} />
        </div>
    );
};

export default Results;
