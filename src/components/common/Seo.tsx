import React, { useEffect } from 'react';

interface SeoProps {
  title: string;
  description: string;
  imageUrl?: string;
  keywords?: string;
}

const Seo: React.FC<SeoProps> = ({ title, description, imageUrl, keywords }) => {
  useEffect(() => {
    const fullTitle = `${title} | Sunshine International School`;
    const defaultImageUrl = `${window.location.origin}/images/common/logo-full.png`;
    const pageUrl = window.location.href.split('#')[0]; // Get URL without hash
    const baseKeywords = 'Sunshine International School, SIS, CBSE School, School in Purushottampur, Ganjam, Best School, Quality Education, School Admissions';

    // Set title
    document.title = fullTitle;

    // Helper to create or update meta tags
    const setMetaTag = (attr: 'name' | 'property', key: string, content: string) => {
      let element = document.querySelector(`meta[${attr}='${key}']`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };
    
    // Helper to create or update link tags
    const setLinkTag = (rel: string, href: string) => {
        let element = document.querySelector(`link[rel='${rel}']`);
        if (!element) {
            element = document.createElement('link');
            element.setAttribute('rel', rel);
            document.head.appendChild(element);
        }
        element.setAttribute('href', href);
    };
    
    // Standard Meta Tags
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords ? `${baseKeywords}, ${keywords}` : baseKeywords);
    setMetaTag('name', 'author', 'Sunshine International School');

    // Canonical Link
    setLinkTag('canonical', pageUrl);

    // Open Graph Tags (for social sharing)
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', imageUrl ? `${window.location.origin}${imageUrl}` : defaultImageUrl);
    setMetaTag('property', 'og:url', pageUrl);
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:site_name', 'Sunshine International School');

    // Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', imageUrl ? `${window.location.origin}${imageUrl}` : defaultImageUrl);
    
    // JSON-LD Structured Data
    const schoolSchema = {
        '@context': 'https://schema.org',
        '@type': 'EducationalOrganization',
        'name': 'Sunshine International School',
        'alternateName': 'SIS',
        'url': window.location.origin,
        'logo': `${window.location.origin}/images/common/logo-full.png`,
        'description': 'A leading CBSE affiliated school in Purushottampur, Ganjam, dedicated to providing quality education and fostering holistic development.',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': 'Main Road, Kumari',
          'addressLocality': 'Purushottampur',
          'addressRegion': 'Odisha',
          'postalCode': '761018',
          'addressCountry': 'IN'
        },
        'contactPoint': {
          '@type': 'ContactPoint',
          'telephone': '+91-9692977727',
          'contactType': 'customer service'
        }
      };

    // Find or create the script tag for schema
    let scriptTag = document.getElementById('school-schema');
    if (!scriptTag) {
        // FIX: Property 'type' does not exist on type 'HTMLElement'. By creating a new `newScriptTag` variable,
        // TypeScript correctly infers its type as `HTMLScriptElement`, allowing the `type` property to be set without error.
        const newScriptTag = document.createElement('script');
        newScriptTag.type = 'application/ld+json';
        newScriptTag.id = 'school-schema';
        document.head.appendChild(newScriptTag);
        scriptTag = newScriptTag;
    }
    scriptTag.textContent = JSON.stringify(schoolSchema);


  }, [title, description, imageUrl, keywords]);

  return null; // This component does not render anything to the DOM
};

export default Seo;