import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const themes: { name: 'nude' | 'blue' | 'corporate'; color: string; }[] = [
  { name: 'nude', color: '#CBAD8D' },
  { name: 'blue', color: '#5483B3' },
  { name: 'corporate', color: '#AEA885' },
];

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="mt-8 md:mt-0">
      <h3 className="text-lg font-bold mb-4 font-['Montserrat']">Select Color</h3>
      <div className="flex items-center space-x-3">
        {themes.map((t) => (
          <button
            key={t.name}
            title={`Switch to ${t.name} theme`}
            aria-label={`Switch to ${t.name} theme`}
            onClick={() => setTheme(t.name)}
            className={`w-8 h-8 rounded-md border-2 transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-primary)] focus:ring-white ${
              theme === t.name ? 'border-white scale-110' : 'border-transparent'
            }`}
            style={{ backgroundColor: t.color }}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSwitcher;