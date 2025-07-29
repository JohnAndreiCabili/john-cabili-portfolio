import React, { memo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Header from './Header';

import PlayfulBackground from './PlayfulBackground';
import CustomCursor from './CustomCursor';
import GlobalStyle from '../styles/GlobalStyles';
import Contact from '../pages/Contact';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Main = styled(motion.main)`
  min-height: 100vh;
  padding: 50px 0 0;
  position: relative;
`;

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.6, 0.05, 0.01, 0.99],
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.4,
    },
  },
};

// Memoize the Layout component to prevent unnecessary re-renders
const Layout: React.FC<LayoutProps> = memo(({ children }) => {
  return (
    <>
      <GlobalStyle />
      <PlayfulBackground />
      <CustomCursor />
      <Header />
      <Main
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        {children}
      </Main>
      <Footer />
      <Contact />
    </>
  );
});

Layout.displayName = 'Layout';

export default Layout; 