import React from 'react';
import { HashRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Academics from './pages/Academics';
import Admission from './pages/Admission';
import Teachers from './pages/Teachers';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import Notices from './pages/Notices';
import Events from './pages/Events';
import HouseSystem from './pages/HouseSystem';
import { ThemeProvider } from './contexts/ThemeContext';
import BackToTopButton from './components/common/BackToTopButton';

const Layout: React.FC = () => {
  const location = useLocation();

  React.useEffect(() => {
    // If there's a hash in the URL, smoothly scroll to the corresponding element
    if (location.hash) {
      const id = location.hash.substring(1); // Remove the '#'
      // Use a timeout to ensure the element is rendered, especially after a page transition
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const headerOffset = 75; // Corresponds to the header height
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }, 100);
    } else {
      // Otherwise, scroll smoothly to the top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname, location.hash]); // Rerun effect when path or hash changes

  return (
    <div className="font-['Roboto']">
      <Header />
      <main style={{ paddingTop: '75px' }}>
        <Outlet />
      </main>
      <Footer />
      <BackToTopButton />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="academics" element={<Academics />} />
            <Route path="admission" element={<Admission />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="notices" element={<Notices />} />
            <Route path="contact" element={<Contact />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="events" element={<Events />} />
            <Route path="house-system" element={<HouseSystem />} />
          </Route>
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
};

export default App;