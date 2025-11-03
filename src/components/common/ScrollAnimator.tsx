import React, { useRef, useEffect, useState } from 'react';

interface ScrollAnimatorProps {
  children: React.ReactNode;
  className?: string;
}

const ScrollAnimator: React.FC<ScrollAnimatorProps> = ({ children, className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, []);

  return (
    <div
      ref={elementRef}
      className={`${className || ''} scroll-animate ${isVisible ? 'visible' : ''}`.trim()}
    >
      {children}
    </div>
  );
};

export default ScrollAnimator;