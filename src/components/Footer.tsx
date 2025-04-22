import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

// Social Media
const FooterContainer = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 24px;
  background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.02));
  margin-top: 60px;
  border-top: 1px solid rgba(0, 113, 227, 0.1);
`;

const FooterContent = styled.div`
  max-width: 1200px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Copyright = styled.div`
  font-size: 14px;
  color: #777;
  margin-top: 24px;
`;

const SocialMediaContainer = styled(motion.div)`
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
  
  @media (max-width: 900px) {
    justify-content: center;
  }
`;

const SocialMediaButton = styled(motion.a)`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  font-size: 24px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.1);
    color: var(--primary-color);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.4) 0%, 
      rgba(255, 255, 255, 0) 60%
    );
    z-index: 1;
    pointer-events: none;
  }
  
  svg {
    width: 20px;
    height: 20px;
    z-index: 2;
  }
`;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    }
  },
};

const Footer: React.FC = () => {
  const location = useLocation();
  
  // Don't show footer on homepage
  if (location.pathname === '/') {
    return null;
  }
  
  return (
    <FooterContainer>
      <FooterContent>
        <SocialMediaContainer 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <SocialMediaButton 
            href="https://github.com/JohnAndreiCabili" 
            target="_blank" 
            rel="noopener noreferrer"
            variants={itemVariants}
            whileHover={{ y: -5, color: "#24292e" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </SocialMediaButton>
          
          <SocialMediaButton 
            href="https://www.linkedin.com/in/john-andrei-cabili-367711333" 
            target="_blank" 
            rel="noopener noreferrer"
            variants={itemVariants}
            whileHover={{ y: -5, color: "#0077b5" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </SocialMediaButton>
          
          <SocialMediaButton 
            href="https://facebook.com/johnandrei.cabili" 
            target="_blank" 
            rel="noopener noreferrer"
            variants={itemVariants}
            whileHover={{ y: -5, color: "#1877F2" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </SocialMediaButton>
        </SocialMediaContainer>
        
        <Copyright>
          © {new Date().getFullYear()} John Andrei Cabili. All rights reserved.
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer; 