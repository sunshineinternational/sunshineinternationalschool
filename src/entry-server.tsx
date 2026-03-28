import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { routes } from './routes';

export function render(url: string) {
  // 1. Find the correct page component
  const path = url === '/' ? '/' : url;
  const childRoute = routes[0].children?.find(r => 
    r.index ? path === '/' : `/${r.path}` === path
  );

  const PageComponent = childRoute?.element || <div>404</div>;

  // 2. Wrap it in a 'MemoryRouter' so Links and Hooks work perfectly
  return renderToString(
    <MemoryRouter initialEntries={[url]}>
      <ThemeProvider>
        <div className="font-['Roboto'] min-h-screen flex flex-col">
            <main className="flex-grow" style={{ paddingTop: '75px' }}>
                {PageComponent}
            </main>
        </div>
      </ThemeProvider>
    </MemoryRouter>
  );
}
