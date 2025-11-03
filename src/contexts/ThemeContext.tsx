import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'nude' | 'blue' | 'corporate';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const savedTheme = localStorage.getItem('theme') as Theme | null;
      // If the saved theme is one of the valid themes, use it.
      if (savedTheme && ['nude', 'blue', 'corporate'].includes(savedTheme)) {
        return savedTheme;
      }
      return 'nude'; // Default to 'nude' otherwise
    } catch (error) {
      console.warn('Could not read theme from localStorage', error);
      return 'nude';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.error('Failed to save theme to localStorage', error);
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};