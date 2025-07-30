import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { AppleButton } from '../components/UIUtils';
import ProgressHeader from '../components/ProgressHeader';

const BackgroundShapes = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
`;

const Shape = styled(motion.div)<{ size: string; color: string; top: string; left: string; opacity: number }>`
  position: absolute;
  width: ${props => props.size};
  height: ${props => props.size};
  background-color: ${props => props.color};
  filter: blur(60px);
  opacity: ${props => props.opacity};
  top: ${props => props.top};
  left: ${props => props.left};
  border-radius: 50%;
`;

const DecorativeElement = styled(motion.div)<{ top: string; left: string; color: string; size: string }>`
  position: absolute;
  width: ${props => props.size};
  height: ${props => props.size};
  border: 2px solid ${props => props.color};
  border-radius: 50%;
  top: ${props => props.top};
  left: ${props => props.left};
  z-index: 1;
`;

const DecorativeLine = styled(motion.div)<{ top: string; left: string; width: string; rotate: string }>`
  position: absolute;
  height: 2px;
  width: ${props => props.width};
  background: linear-gradient(to right, rgba(0, 113, 227, 0.5), rgba(0, 113, 227, 0.05));
  top: ${props => props.top};
  left: ${props => props.left};
  transform: rotate(${props => props.rotate});
  z-index: 1;
`;

const ResumeContainer = styled.div`
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  padding: 80px 24px;
  max-width: 1200px;
  margin: 0 auto;
  z-index: 2;
  
  @media (max-width: 768px) {
    padding: 40px 16px;
  }
  
  @media (max-width: 480px) {
    padding: 30px 12px;
  }
`;

const ResumeLayout = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 40px;
  position: relative;
  margin-top: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
    margin-top: 24px;
  }
  
  @media (max-width: 480px) {
    gap: 16px;
    margin-top: 20px;
  }
`;

const Sidebar = styled.div`
  position: fixed;
  top: 120px;
  left: max(24px, calc((100% - 1200px) / 2 + 24px));
  width: 220px;
  height: fit-content;
  z-index: 10;
  max-height: calc(100vh - 180px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 113, 227, 0.3) transparent;
  
  &::-webkit-scrollbar {
    width: 5px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 113, 227, 0.3);
    border-radius: 8px;
  }
  
  @media (max-width: 768px) {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    margin-bottom: 24px;
  }
`;

const SidebarPlaceholder = styled.div`
  width: 220px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 24px;
  padding: 20px;
  box-shadow: none;
  border: 1px solid rgba(255, 255, 255, 0.7);
  position: relative;
  overflow: hidden;
  
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
`;

const MainContent = styled.div`
  position: relative;
  width: 100%;
  
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const SectionsContainer = styled.div`
  position: relative;
  outline: none; /* Remove focus outline but keep focusable */
  scroll-behavior: smooth;
  
  @media (max-width: 768px) {
    min-height: 70vh;
  }
`;

const NavItem = styled(motion.div)<{ active: boolean }>`
  padding: 14px 16px;
  margin-bottom: 14px;
  background: ${props => props.active ? 'rgba(0, 113, 227, 0.1)' : 'transparent'};
  border-radius: 20px;
  font-weight: ${props => props.active ? '600' : '500'};
  color: ${props => props.active ? 'var(--primary-color)' : 'var(--text-dark)'};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  box-shadow: ${props => props.active ? '0 8px 24px rgba(0, 113, 227, 0.1)' : 'none'};
  transform: ${props => props.active ? 'translateY(-2px)' : 'none'};
  position: relative;
  z-index: 2;
  
  &:hover {
    background: rgba(0, 113, 227, 0.05);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 113, 227, 0.08);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const NavIcon = styled.span`
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  width: 36px;
  height: 36px;
  background: transparent;
  
  @media (max-width: 768px) {
    font-size: 18px;
    width: 30px;
    height: 30px;
    margin-right: 8px;
  }
`;

const StyledSection = styled(motion.section)`
  min-height: auto;
  margin-bottom: 60px;
  position: relative;
  
  &:first-of-type {
    padding-top: 20px;
    margin-top: 0;
  }
  
  &:last-child {
    margin-bottom: 0;
  }
  
  @media (max-width: 768px) {
    margin-bottom: 40px;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 30px;
  }
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const SkillCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.7);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow: hidden;
  position: relative;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(to right, #0071e3, #64acff);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, transparent, rgba(0, 113, 227, 0.03));
    border-radius: 80px 0 0 0;
    z-index: 0;
  }
`;

const SkillIcon = styled.div`
  font-size: 28px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: rgba(0, 113, 227, 0.1);
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.2));
  }
`;

const SkillName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 5px;
`;

// Experience section
const ExperienceContainer = styled.div`
  position: relative;
  margin-left: 20px;
  padding-left: 30px;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, 
      rgba(0, 113, 227, 0.8) 0%, 
      rgba(0, 113, 227, 0.2) 100%
    );
  }
`;

const ExperienceCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 28px;
  margin-bottom: 35px;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.7);
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  
  &::before {
    content: '';
    position: absolute;
    left: -36px;
    top: 30px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--primary-color);
    border: 4px solid white;
    box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.2);
    z-index: 2;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 120px;
    height: 120px;
    background: linear-gradient(135deg, rgba(0, 113, 227, 0.05), transparent);
    border-radius: 0 0 0 120px;
    z-index: 0;
  }
`;

const JobTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--text-dark);
`;

const Company = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DateBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  background: rgba(0, 113, 227, 0.1);
  border-radius: 30px;
  font-size: 14px;
  color: var(--primary-color);
  font-weight: 500;
  margin-bottom: 16px;
`;

const Description = styled.p`
  font-size: 15px;
  line-height: 1.6;
  color: #555;
  position: relative;
  padding-left: 18px;
  margin-bottom: 8px;
  
  &::before {
    content: '•';
    position: absolute;
    left: 0;
    color: var(--primary-color);
    font-weight: bold;
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

// Education section
const EducationCard = styled(motion.div)`
  display: flex;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  overflow: hidden;
  margin-bottom: 0;
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const EducationIcon = styled.div`
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0071e3, #5ac8fa);
  color: white;
  font-size: 40px;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.2));
  }
  
  @media (max-width: 768px) {
    min-height: 100px;
    min-width: unset;
  }
`;

const EducationContent = styled.div`
  padding: 30px;
  flex: 1;
`;

const SchoolName = styled.h3`
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 6px;
  color: var(--text-dark);
`;

const Degree = styled.h4`
  font-size: 17px;
  font-weight: 500;
  color: var(--secondary-color);
  margin-bottom: 16px;
`;

// Awards section
const AwardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AwardCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.6);
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
`;

const AwardHeader = styled.div`
  padding: 16px 20px;
  background: linear-gradient(to right, #0071e3, #64acff);
  color: white;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '🏆';
    position: absolute;
    right: -10px;
    top: -10px;
    font-size: 50px;
    opacity: 0.2;
  }
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.2));
  }
`;

const AwardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 0;
  position: relative;
  z-index: 1;
`;

const AwardContent = styled.div`
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const AwardOrganization = styled.h4`
  font-size: 15px;
  font-weight: 500;
  color: var(--primary-color);
  margin-bottom: 8px;
`;

const DownloadButton = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 60px;
`;

// Mobile navigation
const MobileNavigation = styled.div<{ isFixed: boolean; scrollProgress: number }>`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    overflow-x: auto;
    padding: 16px 24px;
    gap: 8px;
    position: ${(props) => props.isFixed ? 'fixed' : 'relative'};
    top: ${(props) => props.isFixed ? '0' : 'auto'};
    left: ${(props) => props.isFixed ? '0' : 'auto'};
    right: ${(props) => props.isFixed ? '0' : 'auto'};
    z-index: ${(props) => props.isFixed ? '1000' : 'auto'};
    background: ${(props) => props.isFixed ? 'rgba(255, 255, 255, 0.95)' : 'transparent'};
    backdrop-filter: ${(props) => props.isFixed ? 'blur(12px)' : 'none'};
    -webkit-backdrop-filter: ${(props) => props.isFixed ? 'blur(12px)' : 'none'};
    border-bottom: ${(props) => props.isFixed ? '1px solid rgba(0, 113, 227, 0.1)' : 'none'};
    box-shadow: ${(props) => props.isFixed ? '0 4px 20px rgba(0, 0, 0, 0.08)' : 'none'};
    margin-bottom: ${(props) => props.isFixed ? '0' : '24px'};
    transform: ${(props) => props.isFixed ? 'translateY(0)' : `translateY(${props.scrollProgress * -15}px)`};
    opacity: ${(props) => props.isFixed ? '1' : Math.max(0.95, 1 - props.scrollProgress * 0.05)};
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    
    /* Hide scrollbar but allow scrolling */
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const MobileNavButton = styled(motion.button)<{ active: boolean }>`
  padding: 10px 16px;
  background: ${(props) => props.active ? 'rgba(0, 113, 227, 0.1)' : 'transparent'};
  border: 1px solid ${(props) => props.active ? 'var(--primary-color)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 30px;
  color: ${(props) => props.active ? 'var(--primary-color)' : 'var(--text-dark)'};
  font-size: 14px;
  font-weight: ${(props) => props.active ? '600' : '400'};
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(0, 113, 227, 0.05);
    transform: translateY(-2px);
  }
`;

// Badge container
const BadgeContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
  margin-top: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-top: 16px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-top: 12px;
  }
`;

const Badge = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  height: 270px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 15px;
  border: 1px solid rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  
  @media (max-width: 768px) {
    height: 220px;
    padding-top: 12px;
  }
  
  @media (max-width: 480px) {
    height: 200px;
    padding-top: 10px;
  }
`;

// Resume sections
const sections = [
  { id: 'education', label: 'Education', icon: '🎓' },
  { id: 'skills', label: 'Skills', icon: '🔧' },
  { id: 'experience', label: 'Experience', icon: '💼' },
  { id: 'certifications', label: 'Certifications', icon: '🏅' },
  { id: 'awards', label: 'Awards', icon: '🏆' }
];

// Programming skills
const programmingSkills = [
  { name: 'Java', icon: '☕' },
  { name: 'Kotlin', icon: '📱' },
  { name: 'Python', icon: '🐍' },
  { name: 'JavaScript', icon: '🌐' },
  { name: 'HTML/CSS', icon: '🎨' },
  { name: 'C#', icon: '💻' },
  { name: 'Dart', icon: '📊' },
  { name: 'PHP', icon: '🌀' },
];

// Technology skills
const techSkills = [
  { name: 'React Native', icon: '📱' },
  { name: 'Android Studio', icon: '🤖' },
  { name: 'Visual Studio', icon: '🔧' },
  { name: 'Git & GitHub', icon: '🔄' },
  { name: 'MySQL', icon: '🗃️' },
  { name: 'Power BI', icon: '📊' },
];

// Enhanced section titles
const SectionTitle = styled.h2`
  font-size: 38px;
  font-weight: 800;
  margin-bottom: 40px;
  position: relative;
  display: inline-block;
  background: linear-gradient(to right, #000, #444);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: -0.01em;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  
  &:after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    height: 4px;
    width: 60px;
    background: linear-gradient(to right, #0071e3, #64acff);
    border-radius: 4px;
  }
  
  &::before {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #0071e3;
    left: -20px;
    top: 50%;
    transform: translateY(-50%);
  }
  
  @media (max-width: 768px) {
    font-size: 28px;
  }
  
  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

const Resume: React.FC = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement }>({});
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [sidebarOffset, setSidebarOffset] = useState(300);
  const [headerHeight, setHeaderHeight] = useState(80);
  const resumeTitleRef = useRef<HTMLDivElement>(null);
  // Add isMobile state
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isMobileNavFixed, setIsMobileNavFixed] = useState(false);
  const [mobileNavScrollProgress, setMobileNavScrollProgress] = useState(0);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    const handleScroll = () => {
      if (isMobile && resumeTitleRef.current) {
        const headerBottom = resumeTitleRef.current.offsetTop + resumeTitleRef.current.offsetHeight;
        const scrollPosition = window.scrollY;
        const transitionStart = headerBottom - 60; // Start transition 60px before header ends
        const transitionEnd = headerBottom + 30; // End transition 30px after header ends
        
        if (scrollPosition >= transitionEnd) {
          setIsMobileNavFixed(true);
          setMobileNavScrollProgress(1);
        } else if (scrollPosition >= transitionStart) {
          setIsMobileNavFixed(false);
          const progress = (scrollPosition - transitionStart) / (transitionEnd - transitionStart);
          setMobileNavScrollProgress(progress);
        } else {
          setIsMobileNavFixed(false);
          setMobileNavScrollProgress(0);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);
  
  const handleViewPDF = () => {
    const pdfUrl = "/assets/documents/Resume - John Andrei C. Cabili.pdf";
    window.open(pdfUrl, '_blank');
  };
  
  const registerSectionRef = useCallback((id: string, element: HTMLDivElement | null) => {
    if (element) {
      sectionRefs.current[id] = element;
    }
  }, []);
  
  const scrollToSection = useCallback((sectionId: string) => {
    if (isTransitioning) return;
    
    const sectionIndex = sections.findIndex(s => s.id === sectionId);
    if (sectionIndex === -1) return;
    
    setIsTransitioning(true);
    setActiveSection(sectionIndex);
    
    const sectionElement = sectionRefs.current[sectionId];
    if (sectionElement) {
      const currentHeaderHeight = headerHeight + 20;
      // Add a small timeout for mobile to ensure the section is rendered
      setTimeout(() => {
        window.scrollTo({
          top: sectionElement.offsetTop - currentHeaderHeight,
          behavior: 'smooth'
        });
      }, 50);
    }
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, 700);
  }, [isTransitioning, headerHeight]);
  
  const handleScroll = useCallback(() => {
    if (isTransitioning) return;
    
    const scrollPosition = window.scrollY + 150;
    
    let activeIndex = 0;
    Object.entries(sectionRefs.current).forEach(([id, element]) => {
      if (!element) return;
      
      if (scrollPosition >= element.offsetTop) {
        const sectionIndex = sections.findIndex(s => s.id === id);
        if (sectionIndex !== -1) {
          activeIndex = sectionIndex;
        }
      }
    });
    
    if (activeIndex !== activeSection) {
      setActiveSection(activeIndex);
    }
  }, [activeSection, isTransitioning]);
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const measureHeights = () => {
      const siteHeader = document.querySelector('header');
      if (siteHeader) {
        setHeaderHeight(siteHeader.offsetHeight);
      }
      
      if (resumeTitleRef.current) {
        const titleBottom = resumeTitleRef.current.offsetTop + resumeTitleRef.current.offsetHeight;
        setSidebarOffset(titleBottom + 80);
      }
    };
    
    measureHeights();
    
    window.addEventListener('resize', measureHeights);
    return () => {
      window.removeEventListener('resize', measureHeights);
    };
  }, []);
  
  useEffect(() => {
    const handleWindowScroll = () => {
      const siteHeaderMinimum = headerHeight + 20;
      const scrollY = window.scrollY;
      
      const initialPosition = resumeTitleRef.current 
        ? resumeTitleRef.current.offsetTop + resumeTitleRef.current.offsetHeight + 80
        : 300;
      
      const newOffset = Math.max(siteHeaderMinimum, initialPosition - scrollY);
      
      setSidebarOffset(newOffset);
    };

    handleWindowScroll();

    window.addEventListener('scroll', handleWindowScroll);
    return () => {
      window.removeEventListener('scroll', handleWindowScroll);
    };
  }, [headerHeight]);

  useEffect(() => {
    if (!document.querySelector('script[src="//cdn.credly.com/assets/utilities/embed.js"]')) {
      const script = document.createElement('script');
      script.src = "//cdn.credly.com/assets/utilities/embed.js";
      script.async = true;
      script.type = "text/javascript";
      document.body.appendChild(script);
      
      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <BackgroundShapes>
        <Shape 
          size="500px" 
          color="#0071e3" 
          top="-5%" 
          left="-10%" 
          opacity={0.05}
          animate={{
            x: [0, 20, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <Shape 
          size="600px" 
          color="#5ac8fa" 
          top="30%" 
          left="60%" 
          opacity={0.04}
          animate={{
            x: [0, -20, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <Shape 
          size="400px" 
          color="#0071e3" 
          top="70%" 
          left="5%" 
          opacity={0.05}
          animate={{
            x: [0, 15, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Add decorative elements */}
        <DecorativeElement 
          top="15%" 
          left="20%" 
          color="rgba(0, 113, 227, 0.1)" 
          size="40px"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <DecorativeElement 
          top="45%" 
          left="85%" 
          color="rgba(0, 113, 227, 0.1)" 
          size="60px"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <DecorativeElement 
          top="80%" 
          left="30%" 
          color="rgba(0, 113, 227, 0.1)" 
          size="30px"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <DecorativeLine 
          top="28%" 
          left="-5%" 
          width="200px" 
          rotate="15deg" 
          animate={{
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <DecorativeLine 
          top="60%" 
          left="75%" 
          width="150px" 
          rotate="-30deg" 
          animate={{
            opacity: [0.15, 0.3, 0.15]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </BackgroundShapes>
      
      <ResumeContainer>
        <motion.div
          ref={resumeTitleRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <ProgressHeader 
            title="JOHN ANDREI C. CABILI"
            sectionId="resume"
            subtitle="City of Manila, Metro Manila | GitHub | Website"
          />
        </motion.div>
        
        {/* Mobile navigation */}
        {isMobile && (
          <MobileNavigation isFixed={isMobileNavFixed} scrollProgress={mobileNavScrollProgress}>
            {sections.map((section, index) => (
              <MobileNavButton
                key={section.id}
                active={activeSection === index}
                onClick={() => scrollToSection(section.id)}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
              >
                {section.icon} {section.label}
              </MobileNavButton>
            ))}
          </MobileNavigation>
        )}
        {/* Main content layout */}
        <ResumeLayout>
          <SidebarPlaceholder />
          {!isMobile && (
            <Sidebar style={{ top: `${sidebarOffset}px` }}>
              <NavContainer
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {sections.map((section, index) => (
                  <NavItem 
                    key={section.id}
                    active={activeSection === index}
                    onClick={() => scrollToSection(section.id)}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <NavIcon>{section.icon}</NavIcon>
                    {section.label}
                  </NavItem>
                ))}
                <div style={{ padding: '10px 0 0 0', margin: '10px 0 0 0', borderTop: '1px solid rgba(0, 113, 227, 0.1)' }}>
                  <div style={{ padding: '14px 16px' }}>
                    <AppleButton variant="primary" onClick={handleViewPDF}>
                      View in PDF
                    </AppleButton>
                  </div>
                </div>
              </NavContainer>
            </Sidebar>
          )}
          <MainContent>
            <SectionsContainer>
              {/* Education Section */}
              <StyledSection 
                id="education-section" 
                ref={(el) => {
                  if (el) registerSectionRef('education', el as unknown as HTMLDivElement);
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <SectionTitle>Education</SectionTitle>
                <EducationCard
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <EducationIcon>
                    <motion.div
                      initial={{ rotate: -5 }}
                      animate={{ rotate: 5 }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut" 
                      }}
                    >
                      🎓
                    </motion.div>
                  </EducationIcon>
                  <EducationContent>
                    <SchoolName>Adamson University</SchoolName>
                    <Degree>Bachelor of Science in Computer Science (with Specialization in Web Science)</Degree>
                    <DateBadge>2021 - 2025</DateBadge>
                    <Description>Honors: Summa Cum Laude; Top 2 Performing Computer Science Student</Description>
                    <Description>Academic Distinctions: Academic Scholar; Dean’s Lister, 7 consecutive semesters</Description>
                    <Description>Relevant Coursework: Web Development, Mobile App Development, Software Engineering, Machine Learning, Cybersecurity Fundamentals, Data Structures and Algorithms, and Cloud and API Integration</Description>
                  </EducationContent>
                </EducationCard>
              </StyledSection>
              
              {/* Technical Skills Section */}
              <StyledSection 
                id="skills-section" 
                ref={(el) => {
                  if (el) registerSectionRef('skills', el as unknown as HTMLDivElement);
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <SectionTitle>Technical Skills</SectionTitle>
                
                <SkillsGrid>
                  <SkillCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <SkillIcon>💻</SkillIcon>
                    <SkillName>Languages & Markup</SkillName>
                    <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.5', marginTop: '8px' }}>
                      Kotlin, Dart, Python, Java, TypeScript, HTML/CSS, PHP
                    </div>
                  </SkillCard>
                  
                  <SkillCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <SkillIcon>📦</SkillIcon>
                    <SkillName>Frameworks & Libraries</SkillName>
                    <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.5', marginTop: '8px' }}>
                      Jetpack Compose, Flutter, React, Next.js, TailwindCSS
                    </div>
                  </SkillCard>
                  
                  <SkillCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <SkillIcon>🛠️</SkillIcon>
                    <SkillName>Tools & Platforms</SkillName>
                    <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.5', marginTop: '8px' }}>
                      Android Studio, Visual Studio, Git, GitHub, Power BI, MySQL
                    </div>
                  </SkillCard>
                  
                  <SkillCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <SkillIcon>🔌</SkillIcon>
                    <SkillName>Technologies & APIs</SkillName>
                    <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.5', marginTop: '8px' }}>
                      REST APIs, UI/UX Design, ML Model Integration, Technical Documentation
                    </div>
                  </SkillCard>
                </SkillsGrid>
              </StyledSection>
              
              {/* Experience Section */}
              <StyledSection 
                id="experience-section" 
                ref={(el) => {
                  if (el) registerSectionRef('experience', el as unknown as HTMLDivElement);
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <SectionTitle>Professional Experience</SectionTitle>
                <ExperienceContainer>
                  <ExperienceCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                  >
                    <JobTitle>Software Development and Artificial Intelligence Intern</JobTitle>
                    <Company><span>🏢</span> OTis Philippines Inc.</Company>
                    <DateBadge>2025</DateBadge>
                    <Description>Conducted integration research on payment APIs and role-based access control (RBAC)</Description>
                    <Description>Wrote and executed automated test scripts for language detection modules</Description>
                    <Description>Contributed to technical documentation and architecture decision records for internal tools</Description>
                  </ExperienceCard>
                </ExperienceContainer>
              </StyledSection>
              
              {/* Project Experience Section */}
              <StyledSection 
                id="projects-section" 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <SectionTitle>Project Experience</SectionTitle>
                <ExperienceContainer>
                  <ExperienceCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                  >
                    <JobTitle>Mangosoft: Philippine Mango Classification and Price Estimation</JobTitle>
                    <Company><span>🏢</span> Mangosoft</Company>
                    <DateBadge>2024</DateBadge>
                    <Description>Developed a Kotlin-based Android app using Jetpack Compose for mango classification</Description>
                    <Description>Integrated CNN for image processing and Random Forest for price estimation</Description>
                    <Description>Implemented end-to-end ML pipeline and UI</Description>
                    <Description><b>Awards:</b></Description>
                    <Description>Best Research Paper, SIKAPTala 2025 National CS & IT Competition</Description>
                    <Description>Best Research Project, CS Research Colloquium 2025</Description>
                  </ExperienceCard>
                  <ExperienceCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <JobTitle>OSCA (Office of Senior Citizen Affairs) Management System</JobTitle>
                    <Company><span>🏢</span> Barangay 473, City of Manila</Company>
                    <DateBadge>2023</DateBadge>
                    <Description>Built a C# WinForms application for record management automation</Description>
                    <Description>Implemented modular CRUD operations and real-time search functionality</Description>
                    <Description>Optimized data workflows for senior citizen services in Barangay 473</Description>
                    <Description><b>Recognition:</b></Description>
                    <Description>Best in Academic Service Learning, Adamson University</Description>
                  </ExperienceCard>
                </ExperienceContainer>
              </StyledSection>
              
              {/* Certifications Section */}
              <StyledSection 
                id="certifications-section" 
                ref={(el) => {
                  if (el) registerSectionRef('certifications', el as unknown as HTMLDivElement);
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <SectionTitle>Certifications</SectionTitle>
                <BadgeContainer>
                  <Badge>
                    <div 
                      data-iframe-width="150" 
                      data-iframe-height="270" 
                      data-share-badge-id="789be343-ee18-4731-8a0d-665a03074f49" 
                      data-share-badge-host="https://www.credly.com">
                    </div>
                  </Badge>
                  <Badge>
                    <div 
                      data-iframe-width="150" 
                      data-iframe-height="270" 
                      data-share-badge-id="5343d218-6986-488d-8822-23f0ea071572" 
                      data-share-badge-host="https://www.credly.com">
                    </div>
                  </Badge>
                  <Badge>
                    <div 
                      data-iframe-width="150" 
                      data-iframe-height="270" 
                      data-share-badge-id="c81478ce-7b25-4263-9fc9-adf50b29196d" 
                      data-share-badge-host="https://www.credly.com">
                    </div>
                  </Badge>
                  <Badge>
                    <div 
                      data-iframe-width="150" 
                      data-iframe-height="270" 
                      data-share-badge-id="db4fa698-ea9d-4544-adfe-6c10e21a4937" 
                      data-share-badge-host="https://www.credly.com">
                    </div>
                  </Badge>
                </BadgeContainer>
              </StyledSection>
              
              {/* Awards Section */}
              <StyledSection 
                id="awards-section" 
                ref={(el) => {
                  if (el) registerSectionRef('awards', el as unknown as HTMLDivElement);
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <SectionTitle>Awards & Recognition</SectionTitle>
                
                <AwardsGrid>
                  <AwardCard
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    <AwardHeader>
                      <AwardTitle>Best Research Paper</AwardTitle>
                    </AwardHeader>
                    <AwardContent>
                      <AwardOrganization>SIKAPTala 2025 National CS & IT Competition</AwardOrganization>
                      <DateBadge>2025</DateBadge>
                      <Description>CNN-Based Philippine Mango Classification and Quality Assessment with Price Estimation</Description>
                    </AwardContent>
                  </AwardCard>
                  
                  <AwardCard
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <AwardHeader>
                      <AwardTitle>Best Research Project</AwardTitle>
                    </AwardHeader>
                    <AwardContent>
                      <AwardOrganization>CS Research Exhibit and Presentation</AwardOrganization>
                      <DateBadge>2025</DateBadge>
                      <Description>CNN-Based Philippine Mango Classification and Quality Assessment with Price Estimation</Description>
                    </AwardContent>
                  </AwardCard>
                  
                  <AwardCard
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <AwardHeader>
                      <AwardTitle>Best Research Presenter</AwardTitle>
                    </AwardHeader>
                    <AwardContent>
                      <AwardOrganization>CS Research Exhibit and Presentation</AwardOrganization>
                      <DateBadge>2025</DateBadge>
                      <Description>Recognized for exceptional presentation skills and delivery of technical content</Description>
                    </AwardContent>
                  </AwardCard>
                  
                  <AwardCard
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <AwardHeader>
                      <AwardTitle>Best in Academic Service Learning</AwardTitle>
                    </AwardHeader>
                    <AwardContent>
                      <DateBadge>2023</DateBadge>
                      <Description>Recognized for excellence in service-learning initiatives</Description>
                      <Description>Created impactful community-focused software solutions</Description>
                    </AwardContent>
                  </AwardCard>
                </AwardsGrid>
              </StyledSection>
            </SectionsContainer>
          </MainContent>
        </ResumeLayout>
      </ResumeContainer>
    </div>
  );
};

export default Resume; 