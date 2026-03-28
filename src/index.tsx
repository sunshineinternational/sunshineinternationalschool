import React from 'react';
import { ViteSSG } from 'vite-ssg';
import App from './App';
import { routes } from './routes';

// Import fonts from local dependencies for performance
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';

// Import Font Awesome from local dependencies
import '@fortawesome/fontawesome-free/css/all.min.css';

// This replaces the old ReactDOM.createRoot call. 
// It handles both development and the professional pre-rendering build.
export const createApp = ViteSSG(
  App,
  { routes },
  ({ app, router, routes, isClient, initialState }) => {
    // This is where we could add analytics or other setup if needed later
  }
);