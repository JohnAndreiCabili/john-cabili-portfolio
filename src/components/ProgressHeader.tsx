import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform } from 'framer-motion';

// Styled components
const HeaderContainer = styled.div`
  margin-bottom: 60px;
  position: relative;
`;

const Title = styled(motion.h2)`
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 12px;
  position: relative;
  display: inline-block;
  background: linear-gradient(to right, #000, #555);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  
  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const ProgressLine = styled(motion.div)`
  height: 3px;
  background: linear-gradient(to right, #0071e3, #64acff);
  position: absolute;
  bottom: -6px;
  left: 0;
  border-radius: 2px;
`;

interface ProgressHeaderProps {
  title: string;
  sectionId: string;
}

const ProgressHeader: React.FC<ProgressHeaderProps> = ({ title, sectionId }) => {
  const [scrollPercent, setScrollPercent] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById(sectionId) || document.documentElement;
      const scrollPosition = window.scrollY;
      const sectionTop = section.offsetTop;
      const sectionHeight = section.scrollHeight;
      const viewportHeight = window.innerHeight;
      
      // Calculate scroll percentage within the section
      const percent = Math.min(
        Math.max(
          (scrollPosition - sectionTop + viewportHeight / 2) / 
          (sectionHeight - viewportHeight / 2), 
          0
        ), 
        1
      );
      
      setScrollPercent(percent);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize on mount
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionId]);
  
  return (
    <HeaderContainer id={sectionId}>
      <Title
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {title}
        <ProgressLine 
          style={{ width: `${scrollPercent * 100}%` }}
          transition={{ ease: "easeOut", duration: 0.2 }}
        />
      </Title>
    </HeaderContainer>
  );
};

export default ProgressHeader; 