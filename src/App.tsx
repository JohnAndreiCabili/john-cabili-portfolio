import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Use React.lazy for code splitting
const MainPage = lazy(() => import('./pages/MainPage'));
const About = lazy(() => import('./pages/About'));
const Resume = lazy(() => import('./pages/Resume'));
const Projects = lazy(() => import('./pages/Projects'));
const Blog = lazy(() => import('./pages/Blog'));

// Styled components for the loader
const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #f2f2f2, #e0e0e0);
  overflow: hidden;
  position: relative;
`;

const LoaderBlob = styled(motion.div)`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #0071e3, #64acff);
  border-radius: 50%;
  filter: drop-shadow(0 10px 30px rgba(0, 113, 227, 0.3));
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: -10%;
    left: -10%;
    right: -10%;
    bottom: -10%;
    background: radial-gradient(circle at center, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0) 70%);
    mix-blend-mode: overlay;
    opacity: 0.5;
    border-radius: inherit;
    pointer-events: none;
  }
`;

const BackgroundShape = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  background-color: rgba(0, 113, 227, 0.05);
  filter: blur(40px);
`;

// Loading component - simplified with no text
const Loading = () => {
  return (
    <LoaderContainer>
      {/* Background shapes */}
      <BackgroundShape
        style={{
          top: "20%",
          left: "20%",
          width: "400px",
          height: "400px",
        }}
        animate={{
          x: [0, 20, 0],
          y: [0, -20, 0],
          transition: { duration: 15, repeat: Infinity, ease: "easeInOut" }
        }}
      />
      <BackgroundShape
        style={{
          bottom: "30%",
          right: "15%",
          width: "500px",
          height: "500px",
        }}
        animate={{
          x: [0, -30, 0],
          y: [0, 20, 0],
          transition: { duration: 18, repeat: Infinity, ease: "easeInOut" }
        }}
      />
      
      {/* Main loader - simple pulsing circle */}
      <LoaderBlob
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </LoaderContainer>
  );
};

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Layout><MainPage /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/resume" element={<Layout><Resume /></Layout>} />
        <Route path="/projects" element={<Layout><Projects /></Layout>} />
        <Route path="/blog" element={<Layout><Blog /></Layout>} />
        <Route path="/contact" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
