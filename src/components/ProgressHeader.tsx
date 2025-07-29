import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform } from 'framer-motion';

// Styled components
const HeaderContainer = styled.div`
  margin-bottom: 70px;
  text-align: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -25px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 3px;
    background: linear-gradient(to right, #0071e3, #64acff);
    border-radius: 3px;
  }
`;

const Title = styled(motion.h2)`
  font-size: 52px;
  font-weight: 800;
  margin-bottom: 20px;
  position: relative;
  display: inline-block;
  background: linear-gradient(120deg, #0071e3, #1e88e5);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: -0.02em;
  
  @media (max-width: 768px) {
    font-size: 38px;
  }
`;

const Subtitle = styled.div`
  font-size: 18px;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
  font-weight: 400;
`;

const SubtitleLink = styled.a`
  color: #0071e3;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  
  &:hover {
    color: #0056b3;
    text-decoration: underline;
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
  subtitle?: string;
}

const ProgressHeader: React.FC<ProgressHeaderProps> = ({ title, sectionId, subtitle }) => {
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

  // Function to render subtitle with clickable links
  const renderSubtitleWithLinks = (subtitleText: string) => {
    const parts = subtitleText.split(' | ');
    return parts.map((part, index) => {
      if (part === 'GitHub') {
        return (
          <React.Fragment key={index}>
            {index > 0 && ' | '}
            <SubtitleLink href="https://github.com/JohnAndreiCabili" target="_blank" rel="noopener noreferrer">
              GitHub
            </SubtitleLink>
          </React.Fragment>
        );
      } else if (part === 'Website') {
        return (
          <React.Fragment key={index}>
            {index > 0 && ' | '}
            <SubtitleLink href="https://john-cabili-portfolio.vercel.app" target="_blank" rel="noopener noreferrer">
              Website
            </SubtitleLink>
          </React.Fragment>
        );
      } else {
        return (
          <React.Fragment key={index}>
            {index > 0 && ' | '}
            {part}
          </React.Fragment>
        );
      }
    });
  };
  
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
      {subtitle && <Subtitle>{renderSubtitleWithLinks(subtitle)}</Subtitle>}
    </HeaderContainer>
  );
};

export default ProgressHeader; 