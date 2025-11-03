// src/types/index.ts
export interface Notice {
    title: string;
    type: string;
    description: string;
    date: string;
    url: string;
}

export interface Teacher {
  name: string;
  role: string;
  qualification: string;
  experience: string;
  img: string;
  testimonial?: string;
}

export interface Event {
  img: string;
  title: string;
  date: string; // e.g., '2023-12-22'
  description: string;
  category: 'Academic' | 'Sports' | 'Cultural' | 'Celebration';
}

export interface Moment {
  src: string;
  caption: string;
}

export interface QuickLink {
  icon: string;
  title: string;
  description: string;
  path: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface Curriculum {
  icon: string;
  title: string;
  subjects: string[];
}

export interface Program {
  img: string;
  title: string;
  desc: string;
}

export interface AdmissionProcessStep {
  icon: string;
  title: string;
  description: string;
}

export interface GalleryImage {
  src: string;
  caption: string;
  event: string;
}

export interface House {
  name: string;
  color: string;
  textColor: string;
  img: string;
}

export interface WhyChooseUsItem {
  icon: string;
  title: string;
  description: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  relation: string;
  img: string;
}