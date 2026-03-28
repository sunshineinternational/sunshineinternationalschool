import React from 'react';
import { RouteObject } from 'react-router-dom';
import Layout from './components/layout/Layout'; // We'll move the layout component here
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

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'academics', element: <Academics /> },
      { path: 'admission', element: <Admission /> },
      { path: 'teachers', element: <Teachers /> },
      { path: 'notices', element: <Notices /> },
      { path: 'contact', element: <Contact /> },
      { path: 'gallery', element: <Gallery /> },
      { path: 'events', element: <Events /> },
      { path: 'house-system', element: <HouseSystem /> },
    ],
  },
];
