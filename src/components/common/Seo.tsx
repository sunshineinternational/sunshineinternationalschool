import React, { useEffect } from 'react';

interface SeoProps {
  title: string;
  description: string;
  imageUrl?: string;
  keywords?: string;
}

const Seo: React.FC<SeoProps> = ({ title, description, imageUrl, keywords }) => {
  useEffect(() => {
    const baseUrl = 'https://www.sisppur.com';
    const fullTitle = `${title} | Sunshine International School`;
    const defaultImageUrl = `${baseUrl}/images/common/logo-full.png`;
    const pageUrl = `${baseUrl}${window.location.pathname}`;
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
    setMetaTag('property', 'og:image', imageUrl ? `${baseUrl}${imageUrl}` : defaultImageUrl);
    setMetaTag('property', 'og:url', pageUrl);
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:site_name', 'Sunshine International School');

    // Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', imageUrl ? `${baseUrl}${imageUrl}` : defaultImageUrl);
    
    // JSON-LD Structured Data
    const schoolSchema = {
        '@context': 'https://schema.org',
        '@type': 'EducationalOrganization',
        'name': 'Sunshine International School',
        'alternateName': 'SIS',
        'url': 'https://www.sisppur.com',
        'logo': `https://www.sisppur.com/images/common/logo-full.png`,
        'description': description,
        'image': imageUrl ? `https://www.sisppur.com${imageUrl}` : defaultImageUrl,
        'sameAs': [
          'https://www.facebook.com/profile.php?id=61587215428404',
          'https://www.instagram.com/school.sunshine.international/'
        ],
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': 'Main Road, Kumari',
          'addressLocality': 'Purushottampur',
          'addressRegion': 'Odisha',
          'postalCode': '761018',
          'addressCountry': 'IN'
        },
        'contactPoint': [
          {
            '@type': 'ContactPoint',
            'telephone': '+91-9692977727',
            'contactType': 'admissions',
            'areaServed': 'IN',
            'availableLanguage': ['English', 'Hindi', 'Odia']
          }
        ]
      };

    // Breadcrumb Schema
    const pathParts = window.location.pathname.split('/').filter(p => p);
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
            {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': 'https://www.sisppur.com'
            },
            ...pathParts.map((part, index) => ({
                '@type': 'ListItem',
                'position': index + 2,
                'name': part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' '),
                'item': `https://www.sisppur.com/${pathParts.slice(0, index + 1).join('/')}`
            }))
        ]
    };

    // Sitelinks Searchbox (Only for Homepage)
    const sitelinkSchema = window.location.pathname === '/' ? {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'url': 'https://www.sisppur.com',
        'potentialAction': {
            '@type': 'SearchAction',
            'target': 'https://www.sisppur.com/search?q={search_term_string}',
            'query-input': 'required name=search_term_string'
        }
    } : null;

    // Main Navigation Schema
    const navigationSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        'itemListElement': [
            { '@type': 'SiteNavigationElement', 'position': 1, 'name': 'Admissions', 'url': 'https://www.sisppur.com/admission' },
            { '@type': 'SiteNavigationElement', 'position': 2, 'name': 'Academics', 'url': 'https://www.sisppur.com/academics' },
            { '@type': 'SiteNavigationElement', 'position': 3, 'name': 'About Us', 'url': 'https://www.sisppur.com/about' },
            { '@type': 'SiteNavigationElement', 'position': 4, 'name': 'Gallery', 'url': 'https://www.sisppur.com/gallery' },
            { '@type': 'SiteNavigationElement', 'position': 5, 'name': 'Notices', 'url': 'https://www.sisppur.com/notices' },
            { '@type': 'SiteNavigationElement', 'position': 6, 'name': 'Teachers', 'url': 'https://www.sisppur.com/teachers' },
            { '@type': 'SiteNavigationElement', 'position': 7, 'name': 'Contact Us', 'url': 'https://www.sisppur.com/contact' }
        ]
    };

    const combinedSchema: any[] = [schoolSchema, breadcrumbSchema, navigationSchema];
    if (sitelinkSchema) combinedSchema.push(sitelinkSchema);

    // Find or create the script tag for schema
    let scriptTag = document.getElementById('school-schema');
    if (!scriptTag) {
        const newScriptTag = document.createElement('script');
        newScriptTag.type = 'application/ld+json';
        newScriptTag.id = 'school-schema';
        document.head.appendChild(newScriptTag);
        scriptTag = newScriptTag;
    }
    scriptTag.textContent = JSON.stringify(combinedSchema);


  }, [title, description, imageUrl, keywords]);

  return null; // This component does not render anything to the DOM
};

export default Seo;