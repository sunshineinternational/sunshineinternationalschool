import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { ThemeProvider } from './contexts/ThemeContext';
import { routes } from './routes';
import { useRoutes } from 'react-router-dom';

const MainApp = () => {
    const element = useRoutes(routes);
    return (
        <ThemeProvider>
            {element}
        </ThemeProvider>
    );
};

export function render(url: string) {
  return renderToString(
    <StaticRouter location={url}>
      <MainApp />
    </StaticRouter>
  );
}
