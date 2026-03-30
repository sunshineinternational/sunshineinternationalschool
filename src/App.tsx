import React from 'react';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { Analytics } from "@vercel/analytics/react";
import { routes } from './routes';

const App: React.FC = () => {
    // This hook tells React to use the map we created in routes.tsx
    const element = useRoutes(routes);
    
    return (
        <ThemeProvider>
            {element}
            <Analytics />
        </ThemeProvider>
    );
};

export default App;