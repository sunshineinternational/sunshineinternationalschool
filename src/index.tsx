import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import fonts from local dependencies for performance
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';

// Import Font Awesome from local dependencies
import '@fortawesome/fontawesome-free/css/all.min.css';


const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);