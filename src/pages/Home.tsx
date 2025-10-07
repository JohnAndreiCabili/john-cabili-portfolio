import React, { useRef, useState, useEffect, useMemo, memo, useCallback } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { AppleButton } from '../components/UIUtils';

const HomeContainer = styled.div`
  min-height: 100vh;
  position: relative;
  overflow: hidden;
`;

const HeroSection = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px 24px 60px;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 16px 16px 40px;
  }
  
  @media (max-width: 480px) {
    padding: 12px 12px 30px;
  }
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
  position: relative;
  z-index: 2;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 32px;
  }
  
  @media (max-width: 768px) {
    gap: 24px;
  }
  
  @media (max-width: 480px) {
    gap: 20px;
  }
`;

const HeroLeftSide = styled(motion.div)`
  @media (max-width: 900px) {
    order: 2;
  }
`;

const HeroRightSide = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  
  @media (max-width: 900px) {
    order: 1;
    margin-bottom: 24px;
  }
  
  @media (max-width: 768px) {
    margin-top: 40px;
  }
  
  @media (max-width: 480px) {
    margin-top: 60px;
  }
`;

const BackgroundShapes = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  contain: layout paint style;
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
  will-change: transform;
  transform: translateZ(0);
  contain: layout paint style;
`;

// Text components
const Greeting = styled(motion.div)`
  display: inline-block;
  padding: 8px 16px;
  background: rgba(0, 113, 227, 0.15);
  border-radius: 30px;
  font-weight: 600;
  color: var(--primary-color);
  font-size: 16px;
  margin-bottom: 24px;
  box-shadow: 0 2px 10px rgba(0, 113, 227, 0.1);
  
  @media (max-width: 768px) {
    font-size: 14px;
    padding: 6px 12px;
  }
  
  @media (max-width: 480px) {
    font-size: 13px;
    padding: 5px 10px;
  }
`;

const Title = styled(motion.h1)`
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 16px;
  line-height: 1.1;
  background: linear-gradient(to right, #000, #555);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  letter-spacing: -0.02em;
  
  @media (max-width: 768px) {
    font-size: 36px;
  }
  
  @media (max-width: 480px) {
    font-size: 32px;
  }
`;

const RoleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 28px;
  
  @media (max-width: 900px) {
    justify-content: center;
  }
  
  @media (max-width: 768px) {
    font-size: 18px;
  }
  
  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const RoleText = styled.span`
  color: var(--text-dark);
  font-weight: 500;
`;

const RoleHighlight = styled.span`
  color: var(--primary-color);
  font-weight: 700;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 100%;
    height: 2px;
    background: var(--gradient-blue);
    opacity: 0.5;
    border-radius: 2px;
  }
`;

const Description = styled(motion.p)`
  font-size: 17px;
  line-height: 1.7;
  color: #555;
  margin-bottom: 38px;
  max-width: 550px;
  font-weight: 450;
  
  @media (max-width: 900px) {
    margin-left: auto;
    margin-right: auto;
  }
  
  @media (max-width: 768px) {
    font-size: 15px;
  }
  
  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const ButtonsContainer = styled(motion.div)`
  display: flex;
  gap: 16px;
  
  @media (max-width: 900px) {
    justify-content: center;
  }
  
  @media (max-width: 768px) {
    gap: 12px;
  }
  
  @media (max-width: 500px) {
    flex-direction: column;
    width: 100%;
    max-width: 280px;
    margin: 0 auto;
    gap: 10px;
  }
`;

// Social Media
const SocialMediaContainer = styled(motion.div)`
  display: flex;
  gap: 20px;
  margin-top: 48px;
  
  @media (max-width: 900px) {
    justify-content: center;
  }
  
  @media (max-width: 768px) {
    gap: 16px;
    margin-top: 32px;
  }
  
  @media (max-width: 480px) {
    gap: 12px;
    margin-top: 24px;
  }
`;

const SocialMediaButton = styled(motion.a)`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  font-size: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }
  
  @media (max-width: 480px) {
    width: 42px;
    height: 42px;
    font-size: 18px;
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
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
    width: 26px;
    height: 26px;
    z-index: 2;
  }
`;

// Illustration
const IllustrationContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 480px;
  height: 480px;
  margin: 0 auto;
  transform-style: preserve-3d;
  perspective: 1000px;
  
  @media (max-width: 768px) {
    max-width: 280px;
    height: 280px;
  }
  
  @media (max-width: 480px) {
    max-width: 240px;
    height: 240px;
  }
`;

const Illustration = styled(motion.div)`
  width: 100%;
  height: 100%;
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  background: linear-gradient(135deg, #0071e3, #64acff, #5ac8fa);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 
    0 16px 70px rgba(0, 113, 227, 0.3),
    inset 0 -10px 30px rgba(0, 0, 0, 0.2);
  transform-style: preserve-3d;
  cursor: pointer;
  
  @media (max-width: 768px) {
    box-shadow: 
      0 12px 50px rgba(0, 113, 227, 0.25),
      inset 0 -8px 20px rgba(0, 0, 0, 0.15);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle at center,
      rgba(255, 255, 255, 0.5) 0%,
      rgba(255, 255, 255, 0) 70%
    );
    opacity: 0.4;
    mix-blend-mode: overlay;
    pointer-events: none;
    transform: translateZ(1px);
  }
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg, 
      rgba(255, 255, 255, 0.2) 0%, 
      rgba(255, 255, 255, 0) 60%
    );
    mix-blend-mode: overlay;
    pointer-events: none;
  }
`;

const ProfileContent = styled(motion.div)`
  width: 92%;
  height: 92%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: inherit;
  overflow: hidden;
  z-index: 1;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.1);
    border-radius: inherit;
    z-index: 1;
  }
  
  @media (max-width: 768px) {
    &::after {
      background: rgba(255, 255, 255, 0.05);
    }
  }
`;

const ProfileImage = styled(motion.div)`
  width: 100%;
  height: 100%;
  border-radius: inherit;
  transform-style: preserve-3d;
  z-index: 1;
  background: rgba(0, 0, 0, 0.05);
`;

const InteractText = styled(motion.div)`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.75);
  text-align: center;
  font-size: 18px;
  font-weight: 400;
  letter-spacing: normal;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  pointer-events: none;
  z-index: 2;
  transform: translateZ(25px);
  background: rgba(0, 0, 0, 0.08);
  border-radius: inherit;
  backdrop-filter: blur(1px);
  
  @media (max-width: 768px) {
    background: transparent;
    backdrop-filter: none;
  }
`;

const FloatingItem = styled(motion.div)<{ top: string; left: string; size: string; background: string }>`
  position: absolute;
  top: ${props => props.top};
  left: ${props => props.left};
  width: ${props => props.size};
  height: ${props => props.size};
  background: ${props => props.background};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: calc(${props => props.size} * 0.5);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 10;
  transform-style: preserve-3d;
  overflow: hidden;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  
  @media (max-width: 768px) {
    width: calc(${props => props.size} * 0.7);
    height: calc(${props => props.size} * 0.7);
    font-size: calc(${props => props.size} * 0.35);
  }
  
  @media (max-width: 480px) {
    width: calc(${props => props.size} * 0.6);
    height: calc(${props => props.size} * 0.6);
    font-size: calc(${props => props.size} * 0.3);
  }
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg,
      rgba(255, 255, 255, 0.4) 0%,
      rgba(255, 255, 255, 0) 60%
    );
    mix-blend-mode: overlay;
    pointer-events: none;
    border-radius: 50%;
  }
`;

const FloatingItemContent = styled(motion.span)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: inherit;
  transform-style: preserve-3d;
  filter: saturate(1.2);
`;

// Skill content for the blob
const SkillContent = styled(motion.div)`
  width: 86%;
  height: 86%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 24px 24px 60px 24px;
  color: white;
  border-radius: inherit;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(5px);
  z-index: 2;
  
  @media (max-width: 768px) {
    padding: 20px 20px 50px 20px;
  }
  
  @media (max-width: 480px) {
    padding: 16px 16px 40px 16px;
  }
`;

const SkillIcon = styled(motion.div)`
  font-size: 56px;
  margin-bottom: 16px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
  
  @media (max-width: 768px) {
    font-size: 42px;
    margin-bottom: 12px;
  }
  
  @media (max-width: 480px) {
    font-size: 36px;
    margin-bottom: 10px;
  }
`;

const SkillTitle = styled(motion.h3)`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 8px;
  }
  
  @media (max-width: 480px) {
    font-size: 18px;
    margin-bottom: 6px;
  }
`;

const SkillDescription = styled(motion.p)`
  font-size: 16px;
  line-height: 1.5;
  font-weight: 400;
  max-width: 300px;
  opacity: 0.9;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 14px;
    max-width: 250px;
  }
  
  @media (max-width: 480px) {
    font-size: 12px;
    max-width: 220px;
  }
`;

const BackButton = styled(motion.button)`
  position: absolute;
  bottom: 10%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 3;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

// Skill data
interface Skill {
  id: string;
  icon: string;
  title: string;
  description: string;
  background: string;
  floatingPosition: {
    top: string;
    left: string;
    size: string;
  };
}

const skillsData: Skill[] = [
  {
    id: 'react',
    icon: '⚛️',
    title: 'React Development',
    description: 'Building interactive UIs with React, hooks, and modern state management.',
    background: 'linear-gradient(135deg, #5ac8fa, #0071e3)',
    floatingPosition: {
      top: '5%',
      left: '0%',
      size: '70px'
    }
  },
  {
    id: 'design',
    icon: '📊',
    title: 'Data Science',
    description: 'Transforming data into insights through ML and statistical analysis.',
    background: 'linear-gradient(135deg, #5e5ce6, #af52de)',
    floatingPosition: {
      top: '15%',
      left: '85%',
      size: '60px'
    }
  },
  {
    id: 'ai',
    icon: '🤖',
    title: 'AI & ML',
    description: 'Developing intelligent solutions with machine learning and artificial intelligence.',
    background: 'linear-gradient(135deg, #ff6b6b, #ffa726)',
    floatingPosition: {
      top: '60%',
      left: '5%',
      size: '68px'
    }
  },
  {
    id: 'code',
    icon: '💻',
    title: 'Full-stack Development',
    description: 'Building complete web applications from frontend to backend with modern technologies.',
    background: 'linear-gradient(135deg, #34c759, #5ac8fa)',
    floatingPosition: {
      top: '85%',
      left: '10%',
      size: '65px'
    }
  },
  {
    id: 'mobile',
    icon: '📱',
    title: 'Mobile Development',
    description: 'Building cross-platform mobile apps with React Native.',
    background: 'linear-gradient(135deg, #af52de, #5e5ce6)',
    floatingPosition: {
      top: '70%',
      left: '85%',
      size: '62px'
    }
  },
  {
    id: 'api',
    icon: '🔌',
    title: 'API Integration',
    description: 'Connecting frontend apps with backend services via REST and GraphQL.',
    background: 'linear-gradient(135deg, #4cd964, #30b845)',
    floatingPosition: {
      top: '30%',
      left: '-5%',
      size: '64px'
    }
  },
  {
    id: 'perf',
    icon: '⚡',
    title: 'Performance Optimization',
    description: 'Enhancing app speed through code splitting and optimization.',
    background: 'linear-gradient(135deg, #ffcc00, #ff9500)',
    floatingPosition: {
      top: '50%',
      left: '90%',
      size: '66px'
    }
  }
];

// Create memoized child components to prevent re-renders
const SocialMediaSection = memo(({ variants, itemVariants }: { variants: any, itemVariants: any }) => (
  <SocialMediaContainer variants={variants}>
    <SocialMediaButton 
      href="https://github.com/JohnAndreiCabili" 
      target="_blank" 
      rel="noopener noreferrer"
      variants={itemVariants}
      whileHover={{ y: -8, color: "#24292e" }}
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
      whileHover={{ y: -8, color: "#0077b5" }}
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
      whileHover={{ y: -8, color: "#1877F2" }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    </SocialMediaButton>
  </SocialMediaContainer>
));

SocialMediaSection.displayName = 'SocialMediaSection';

const Home: React.FC = memo(() => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [blobTransform, setBlobTransform] = useState({ x: 0, y: 0 });
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [showProfile, setShowProfile] = useState(true);
  const illustrationRef = useRef<HTMLDivElement>(null);
  
  // Calculate transform based on mouse position relative to window
  const calculateTransform = useCallback((e: MouseEvent) => {
    const { innerWidth: width, innerHeight: height } = window;
    // Much gentler factor (0.05 instead of 1) for subtle movement
    const factor = 0.05;
    
    // Calculate offsets with reduced sensitivity
    const offsetX = ((e.clientX / width) - 0.5) * 8 * factor;
    const offsetY = ((e.clientY / height) - 0.5) * 8 * factor;
    
    // Apply limits to create very gentle movement
    const limitedX = Math.max(-1.5, Math.min(1.5, offsetX));
    const limitedY = Math.max(-1.5, Math.min(1.5, offsetY));
    
    // Only update if movement is significant enough
    if (Math.abs(limitedX - blobTransform.x) > 0.02 || Math.abs(limitedY - blobTransform.y) > 0.02) {
      setBlobTransform({
        x: limitedX,
        y: limitedY,
      });
    }
  }, [blobTransform]);
  
  // Handle mouse movement
  useEffect(() => {
    let debounceTimer: NodeJS.Timeout;
    
    const handleMouseMoveWithDebounce = (e: MouseEvent) => {
      // Save raw mouse position for other calculations
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Debounce the transform calculation
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => calculateTransform(e), 10);
    };

    document.addEventListener('mousemove', handleMouseMoveWithDebounce);
    return () => {
      document.removeEventListener('mousemove', handleMouseMoveWithDebounce);
      clearTimeout(debounceTimer);
    };
  }, [calculateTransform]);

  // Parallax scroll effect
  const { scrollYProgress } = useScroll();
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const parallaxYSpring = useSpring(parallaxY, { stiffness: 400, damping: 90 });
  const opacityTransform = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
   
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, 0.05, 0.01, 0.99],
      },
    },
  };

  const blobAnimation = {
    borderRadius: [
      "60% 40% 30% 70% / 60% 30% 70% 40%",
      "40% 60% 70% 30% / 50% 60% 40% 60%",
      "30% 60% 70% 40% / 70% 30% 50% 60%",
      "60% 40% 30% 70% / 60% 30% 70% 40%",
    ],
    transition: {
      duration: 15,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };
  
  const floatingAnimation = {
    y: [0, -15, 0],
    transition: {
      duration: 5, 
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut",
    },
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    filter: [
      'brightness(1)',
      'brightness(1.1)',
      'brightness(1)',
    ],
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut",
    },
  };

  // Skill content animation variants
  const skillContentVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: {
        duration: 0.3
      }
    }
  };
   
  // Handle skill selection
  const handleSkillClick = (skill: Skill, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedSkill(skill);
    setShowProfile(false);
  };
   
  // Handle back to profile
  const handleBackClick = (event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setShowProfile(true);
    setSelectedSkill(null);
  };
   
  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'contact') {
      const event = new CustomEvent('openChatWidget');
      window.dispatchEvent(event);
      return;
    }
     
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop,
        behavior: 'smooth'
      });
    }
  };
   
  // Using useMemo for the roles array to avoid dependency issues
  const roles = useMemo(() => ["Full-stack Developer", "React Developer", "AI Researcher", "Machine Learning Developer"], []);
  const [roleIndex, setRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
   
  useEffect(() => {
    const typeSpeed = isDeleting ? 80 : 150;
    const role = roles[roleIndex];
     
    const timer = setTimeout(() => {
      if (!isDeleting) {
        setCurrentText(role.substring(0, currentText.length + 1));
         
        if (currentText === role) {
          setTimeout(() => {
            setIsDeleting(true);
          }, 1000);
        }
      } else {
        setCurrentText(role.substring(0, currentText.length - 1));
         
        if (currentText === "") {
          setIsDeleting(false);
          setRoleIndex((prevIndex) => (prevIndex + 1) % roles.length);
        }
      }
    }, typeSpeed);
     
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, roleIndex, roles]);

  // Background blob with subtle animation
  const BackgroundBlob = styled(motion.div)`
    position: absolute;
    width: 650px;
    height: 650px;
    background: radial-gradient(circle at center, rgba(0, 113, 227, 0.1), rgba(0, 113, 227, 0));
    border-radius: 50%;
    filter: blur(60px);
    transform-origin: center;
    z-index: -1;
    pointer-events: none;
  `;
  
  const gentleMovement = {
    rotateX: [0, 0.5, 0, -0.5, 0],
    rotateY: [0, 0.5, 0, -0.5, 0],
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: "easeInOut",
    }
  };

  return (
    <HomeContainer>
      <HeroSection>
        <BackgroundShapes>
          <Shape 
            size="550px" 
            color="#0071e3" 
            top="-10%" 
            left="15%" 
            opacity={0.05}
            animate={{
              x: [0, 30, 0],
              y: [0, 40, 0],
            }}
            transition={{
              duration: 25, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <Shape 
            size="400px" 
            color="#5ac8fa" 
            top="60%" 
            left="70%" 
            opacity={0.06}
            animate={{
              x: [0, -20, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 30, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <Shape 
            size="300px" 
            color="#5856d6" 
            top="40%" 
            left="-10%" 
            opacity={0.04}
            animate={{
              x: [0, 40, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 28, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </BackgroundShapes>
        
        <ContentContainer>
          <HeroLeftSide
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <Greeting variants={itemVariants}>Hello there! 👋</Greeting>
            <Title variants={itemVariants}>I'm John Andrei Cabili</Title>
            <RoleWrapper>
              <RoleText>I'm a </RoleText>
              <RoleHighlight>{currentText}<motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }}>|</motion.span></RoleHighlight>
            </RoleWrapper>
            <Description variants={itemVariants}>
              Based in Manila, I enjoy creating engaging digital experiences with a focus on functionality and performance. 
              I work on building modern web applications that aim to be both practical and impactful.
            </Description>
            <ButtonsContainer variants={itemVariants}>
              <AppleButton onClick={() => window.location.href = '/about'}>
                See More About Me
              </AppleButton>
              <AppleButton variant="secondary" onClick={() => window.location.href = '/projects'}>
                View My Works
              </AppleButton>
            </ButtonsContainer>
            
            <SocialMediaSection variants={containerVariants} itemVariants={itemVariants} />
          </HeroLeftSide>
          
          <HeroRightSide
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <IllustrationContainer 
              ref={illustrationRef}
              style={{
                rotateY: blobTransform.x,
                rotateX: -blobTransform.y,
                transformStyle: 'preserve-3d',
                perspective: 1000,
              }}
              animate={gentleMovement}
            >
              <Illustration
                animate={{
                  ...blobAnimation,
                  ...pulseAnimation,
                }}
                style={{ background: selectedSkill?.background || 'linear-gradient(135deg, #0071e3, #64acff, #5ac8fa)' }}
                onClick={handleBackClick}
              >
                <AnimatePresence mode="wait">
                  {showProfile ? (
                    <ProfileContent
                      key="profile"
                      animate={blobAnimation}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <ProfileImage
                        style={{ transformStyle: 'preserve-3d' }}
                      />
                      <InteractText
                        initial={{ opacity: 0 }}
                        animate={{ 
                          opacity: 0.85
                        }}
                        transition={{ 
                          duration: 1
                        }}
                      >
                        interact with me
                      </InteractText>
                    </ProfileContent>
                  ) : selectedSkill && (
                    <SkillContent
                      key={selectedSkill.id}
                      variants={skillContentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <SkillIcon>{selectedSkill.icon}</SkillIcon>
                      <SkillTitle>{selectedSkill.title}</SkillTitle>
                      <SkillDescription>{selectedSkill.description}</SkillDescription>
                      <BackButton 
                        whileHover={{ scale: 1.1 }} 
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBackClick();
                        }}
                      >
                        ←
                      </BackButton>
                    </SkillContent>
                  )}
                </AnimatePresence>
              </Illustration>
              
              {skillsData.map((skill) => (
                <FloatingItem 
                  key={skill.id}
                  top={skill.floatingPosition.top}
                  left={skill.floatingPosition.left}
                  size={skill.floatingPosition.size}
                  background={skill.background}
                  animate={floatingAnimation}
                  style={{ 
                    transformStyle: 'preserve-3d', 
                    transform: `translateZ(${40 + skillsData.indexOf(skill) * 5}px)`,
                    opacity: selectedSkill?.id === skill.id ? 0 : 1
                  }}
                  whileHover={{ scale: 1.1, rotate: skillsData.indexOf(skill) % 2 === 0 ? 10 : -10 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => handleSkillClick(skill, e)}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    // Create a synthetic mouse event for touch
                    const syntheticEvent = {
                      ...e,
                      preventDefault: () => e.preventDefault(),
                      stopPropagation: () => e.stopPropagation()
                    } as React.MouseEvent;
                    handleSkillClick(skill, syntheticEvent);
                  }}
                >
                  <FloatingItemContent>{skill.icon}</FloatingItemContent>
                </FloatingItem>
              ))}
            </IllustrationContainer>
          </HeroRightSide>
        </ContentContainer>
      </HeroSection>
    </HomeContainer>
  );
});

Home.displayName = 'Home';

export default Home; 