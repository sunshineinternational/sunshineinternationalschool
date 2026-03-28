import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { routes } from './routes';

import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const MainApp = () => {
    const element = useRoutes(routes);
    return (
        <ThemeProvider>
            {element}
        </ThemeProvider>
    );
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Could not find root element to mount to");

// If pre-rendered HTML exists, use hydrateRoot for high speed.
// Otherwise, use createRoot for development.
if (rootElement.hasChildNodes()) {
    ReactDOM.hydrateRoot(
        rootElement,
        <BrowserRouter>
            <MainApp />
        </BrowserRouter>
    );
} else {
    ReactDOM.createRoot(rootElement).render(
        <BrowserRouter>
            <MainApp />
        </BrowserRouter>
    );
}