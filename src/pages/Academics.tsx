import React from 'react';
import PageHero from '../components/common/PageHero';
import Seo from '../components/common/Seo';
import type { Curriculum, Program } from '../types';
import ScrollAnimator from '../components/common/ScrollAnimator';
import { handleImageError } from '../utils';

const curriculumData: Curriculum[] = [
    {
        icon: 'fas fa-child',
        title: 'Kindergarten',
        subjects: ['English', 'Mathematics', 'EVS', 'Art & Craft', 'Music & Dance', 'Play-based Learning'],
    },
    {
        icon: 'fas fa-book-reader',
        title: 'Primary (I-V)',
        subjects: ['English', 'Hindi', 'Odia', 'Mathematics', 'EVS (I-II)', 'Science (III-V)', 'Social Studies (III-V)', 'Computer Science', 'General Knowledge'],
    },
    {
        icon: 'fas fa-book',
        title: 'Middle (VI-VIII)',
        subjects: ['English', 'Hindi', 'Odia', 'Mathematics', 'Science (Physics, Chemistry, Biology)', 'Social Science (History, Civics, Geography)', 'Third Language (Sanskrit)', 'Computer Science'],
    },
    {
        icon: 'fas fa-graduation-cap',
        title: 'High School (IX-X)',
        subjects: ['English', 'Hindi', 'Odia', 'Mathematics', 'Science (Physics, Chemistry, Biology)', 'Social Science (History, Civics, Geography, Economics)', 'Information Technology'],
    },
];

const programsData: Program[] = [
    { img: '/images/pages/academics/program-stem.webp', title: 'STEM Education', desc: 'Hands-on learning in Science, Technology, Engineering, and Mathematics' },
    { img: '/images/pages/academics/program-olympiad.png', title: 'Olympiad Training', desc: 'Specialized coaching for national and international competitions' },
    { img: '/images/pages/academics/program-taekwondo.jpg', title: 'Taekwondo Classes', desc: 'Martial arts training focusing on discipline and self-defense' },
    { img: '/images/pages/academics/program-language.jpg', title: 'Language Programs', desc: 'Comprehensive learning in English, Hindi, and French' },
];

const objectivesData: string[] = [
    "To develop critical thinking and problem-solving skills essential for lifelong learning.",
    "To foster creativity, innovation, and an appreciation for the arts and sciences.",
    "To promote ethical values, social responsibility, and a sense of global citizenship.",
    "To provide a strong and comprehensive foundation in core academic subjects.",
    "To encourage physical fitness, well-being, and the development of healthy lifestyle habits."
];

const visionGoalsLeft: string[] = [
    "To provide an integral formation.",
    "To enable the students to become men of action and reflection, rooted firmly in and inspired by the values of human dignity, equality, social justice and secularism.",
    "To create in the students a sense of compassion for the weak and the powerless in society, love for all living creatures, concern for the environment.",
    "To encourage the students to do their best in the curricular and co-curricular programmes leading towards fuller personal growth and transformation."
];

const visionGoalsRight: string[] = [
    "To foster in them skills to live and work in harmony with those who differ from them in religion, caste, language, ethnicity, etc., and in case of conflicts, to resolve or manage them constructively.",
    "To create agents of Social change.",
    "To form them into spiritual leaders with a social conscience and with a sense of global solidarity.",
    "To promote deeper bonding among the staff with a common mission.",
    "To reach out to parents and to share with them our vision of education."
];

const schoolTimings: string[] = [
    "Reporting Time for Students: 8:00 a.m.",
    "Warning Bell: 8:10 a.m. (To be ready for prayer/assembly)",
    "Prayer / Assembly: 8:15 a.m.",
    "Instructional Hours: 8:45 a.m. – 1:30 p.m."
];

const rulesOfConduct: string[] = [
    "Students should arrive at school on time.",
    "Respect for teachers, staff, and fellow students is mandatory.",
    "School property must be handled with care; any damage will be the student's responsibility.",
    "Maintaining cleanliness and tidiness of the school premises is expected from all.",
    "Electronic gadgets, unless permitted for educational purposes, are not allowed."
];

const Academics: React.FC = () => {
  return (
    <div>
      <Seo
        title="Academics | CBSE Curriculum at Sunshine International School"
        description="Explore the comprehensive CBSE curriculum at Sunshine International School, Purushottampur, from Kindergarten to High School, along with our special academic programs for holistic growth."
        imageUrl="/images/pages/academics/hero.jpg"
      />
      <PageHero 
        title="Academic Excellence"
        subtitle="A holistic approach to education that nurtures every student's potential"
        imageUrl="/images/pages/academics/hero.jpg"
      />

      <ScrollAnimator>
        <section className="py-16 bg-[var(--color-background-section)]">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 font-['Montserrat'] text-[var(--color-text-primary)]">Our CBSE Curriculum</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {curriculumData.map((item, index) => (
                  <div key={index} className="bg-[var(--color-background-card)] p-6 rounded-lg shadow-md transition-transform duration-300 hover:-translate-y-2 flex flex-col">
                      <div className="text-3xl text-[var(--color-text-accent)] mb-4"><i className={item.icon}></i></div>
                      <h3 className="text-xl font-bold mb-3 font-['Montserrat'] text-[var(--color-text-primary)]">{item.title}</h3>
                      <ul className="text-[var(--color-text-secondary)] space-y-2 text-sm list-disc list-inside">
                          {item.subjects.map((subject, i) => <li key={i}>{subject}</li>)}
                      </ul>
                  </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollAnimator>

      <ScrollAnimator>
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 font-['Montserrat'] text-[var(--color-text-primary)]">Our Academic Objectives</h2>
            <div className="max-w-4xl mx-auto bg-[var(--color-background-card)] p-8 rounded-lg shadow-md">
              <ul className="space-y-4">
                {objectivesData.map((objective, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-[var(--color-text-accent)] mr-3 mt-1"><i className="fas fa-check-circle"></i></span>
                    <p className="text-[var(--color-text-secondary)]">{objective}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </ScrollAnimator>

      <ScrollAnimator>
        <section className="py-16 bg-[var(--color-background-section)]">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 font-['Montserrat'] text-[var(--color-text-primary)]">VISION STATEMENT & GOALS</h2>
            <div className="max-w-6xl mx-auto bg-[var(--color-background-card)] p-8 rounded-lg shadow-md">
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                <ul className="space-y-4">
                  {visionGoalsLeft.map((goal, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-[var(--color-text-accent)] mr-3 mt-1"><i className="fas fa-arrow-right"></i></span>
                      <p className="text-[var(--color-text-secondary)]">{goal}</p>
                    </li>
                  ))}
                </ul>
                <ul className="space-y-4">
                  {visionGoalsRight.map((goal, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-[var(--color-text-accent)] mr-3 mt-1"><i className="fas fa-arrow-right"></i></span>
                      <p className="text-[var(--color-text-secondary)]">{goal}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </ScrollAnimator>

      <ScrollAnimator>
        <section className="py-16">
          <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-2 font-['Montserrat'] text-[var(--color-text-primary)]">ORDER & CONDUCT</h2>
              <div className="text-center text-2xl text-[var(--color-text-accent)] mb-10">
                  <span>&#10003;</span>
              </div>
              <div className="max-w-6xl mx-auto bg-[var(--color-background-card)] p-8 rounded-lg shadow-md">
                  <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                      <div>
                          <h3 className="text-xl font-bold mb-4 font-['Montserrat'] text-[var(--color-text-primary)] flex items-center"><i className="fas fa-clock mr-3 text-[var(--color-text-accent)]"></i>School Timings</h3>
                          <ul className="space-y-3">
                              {schoolTimings.map((time, index) => (
                                  <li key={index} className="flex items-start text-sm">
                                      <span className="text-gray-400 mr-3 mt-1"><i className="far fa-clock"></i></span>
                                      <p className="text-[var(--color-text-secondary)]">{time}</p>
                                  </li>
                              ))}
                          </ul>
                      </div>
                      <div className="border-t pt-8 md:border-t-0 md:pt-0 md:border-l md:pl-12 border-[var(--color-border)]">
                          <h3 className="text-xl font-bold mb-4 font-['Montserrat'] text-[var(--color-text-primary)] flex items-center"><i className="fas fa-gavel mr-3 text-[var(--color-text-accent)]"></i>Rules of Conduct</h3>
                          <ul className="space-y-3">
                              {rulesOfConduct.map((item, index) => (
                                  <li key={index} className="flex items-start text-sm">
                                      <span className="text-[var(--color-text-accent)] mr-3 mt-1"><i className="fas fa-edit"></i></span>
                                      <p className="text-[var(--color-text-secondary)]">{item}</p>
                                  </li>
                              ))}
                          </ul>
                      </div>
                  </div>
              </div>
          </div>
        </section>
      </ScrollAnimator>

      <ScrollAnimator>
        <section className="py-16 bg-[var(--color-background-section)]">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 font-['Montserrat'] text-[var(--color-text-primary)]">Special Programs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {programsData.map((program, index) => (
                  <div key={index} className="bg-[var(--color-background-card)] rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-2">
                      <img src={program.img} alt={`${program.title} at Sunshine International School`} className="w-full h-40 object-cover" onError={(e) => handleImageError(e, { width: 400, height: 160, text: e.currentTarget.alt })} loading="lazy" decoding="async" width="400" height="160" />
                      <div className="p-6">
                          <h3 className="text-lg font-bold mb-2 font-['Montserrat'] text-[var(--color-text-primary)]">{program.title}</h3>
                          <p className="text-[var(--color-text-secondary)] text-sm">{program.desc}</p>
                      </div>
                  </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollAnimator>
    </div>
  );
};

export default Academics;