import React from 'react';
import { renderToString } from 'react-dom/server';
import { ThemeProvider } from './contexts/ThemeContext';
import { routes } from './routes';
import Layout from './components/layout/Layout';

// This is a robust 'mini-router' for our snapshot tool
export function render(url: string) {
  // 1. Find the correct page component for this URL
  const path = url === '/' ? '/' : url;
  const childRoute = routes[0].children?.find(r => 
    r.index ? path === '/' : `/${r.path}` === path
  );

  const PageComponent = childRoute?.element || <div>404</div>;

  // 2. Render it inside the Layout and Theme
  return renderToString(
    <ThemeProvider>
      <div className="font-['Roboto'] min-h-screen flex flex-col">
          {/* We manually recreate the layout here to avoid browser-only code in server build */}
          <main className="flex-grow" style={{ paddingTop: '75px' }}>
              {PageComponent}
          </main>
      </div>
    </ThemeProvider>
  );
}
