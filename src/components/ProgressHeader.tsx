import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface ProgressHeaderProps {
  title: string;
  sectionId: string;
}

const HeaderContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 0 20px;
  padding: 0 0 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Title = styled(motion.h1)`
  font-size: 54px;
  font-weight: 800;
  margin-bottom: 40px;
  line-height: 1.1;
  letter-spacing: -0.03em;
  position: relative;
  text-align: center;
  width: 100%;
  color: #0071e3;
  
  @media (max-width: 768px) {
    font-size: 36px;
    margin-bottom: 30px;
  }
`;

const ProgressUnderline = styled(motion.div)<{ progress: number }>`
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  height: 4px;
  width: ${props => Math.max(20, props.progress * 160)}px;
  background: linear-gradient(
    to right,
    #0071e3 10%, 
    #64acff 45%,
    #ffffff 50%,
    #64acff 55%,
    #0071e3 90%
  );
  background-size: 200% auto;
  animation: shineUnderline 3s linear infinite;
  border-radius: 2px;
  transform-origin: center;
  
  @keyframes shineUnderline {
    to {
      background-position: 200% center;
    }
  }
`;

const ProgressHeader: React.FC<ProgressHeaderProps> = ({ title, sectionId }) => {
  const [progress, setProgress] = useState(0);
  const titleRef = useRef<HTMLHeadingElement>(null);
  
  useEffect(() => {
    const calculateProgress = () => {
      const section = document.getElementById(sectionId);
      if (!section) return;
      
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const scrollPosition = window.scrollY;
      const viewportHeight = window.innerHeight;
      
      // Calculate how far we've scrolled into the section
      const scrollIntoSection = scrollPosition + viewportHeight/2 - sectionTop;
      
      // Calculate percentage (0-1) of section scrolled
      let percentage = scrollIntoSection / sectionHeight;
      
      // Clamp between 0 and 1
      percentage = Math.max(0, Math.min(1, percentage));
      
      setProgress(percentage);
    };
    
    // Calculate initially and on scroll
    calculateProgress();
    window.addEventListener('scroll', calculateProgress);
    window.addEventListener('resize', calculateProgress);
    
    return () => {
      window.removeEventListener('scroll', calculateProgress);
      window.removeEventListener('resize', calculateProgress);
    };
  }, [sectionId]);
  
  const titleVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };
  
  return (
    <HeaderContainer>
      <Title 
        ref={titleRef}
        variants={titleVariants}
        initial="hidden"
        animate="visible"
      >
        {title}
        <ProgressUnderline 
          progress={progress}
          initial={{ width: 20 }}
          animate={{ width: Math.max(20, progress * 160) }}
          transition={{ duration: 0.1 }}
        />
      </Title>
    </HeaderContainer>
  );
};

export default ProgressHeader; 