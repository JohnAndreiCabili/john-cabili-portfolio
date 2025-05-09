import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const PageContainer = styled.div`
  min-height: 100vh;
  position: relative;
  overflow: hidden;
`;

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

const Section = styled(motion.section)`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 80px 24px;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    padding: 60px 24px;
  }
`;

const HeroSection = styled(Section)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }
`;

const ProfileContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 420px;
  height: 420px;
  margin: 0 auto;
  
  @media (max-width: 900px) {
    max-width: 320px;
    height: 320px;
  }
`;

const ProfileFrame = styled(motion.div)`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PlayfulDesign = styled(motion.div)`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SkillTag = styled(motion.div)<{ color: string; top: string; left: string; delay: number }>`
  position: absolute;
  padding: 10px 16px;
  border-radius: 12px;
  background: ${props => props.color};
  color: white;
  font-weight: 600;
  font-size: 15px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 8px;
  top: ${props => props.top};
  left: ${props => props.left};
  z-index: 2;
`;

const SkillIcon = styled.span`
  font-size: 18px;
`;

const GeometricShape = styled(motion.div)`
  width: 90%;
  height: 90%;
  background: white;
  border-radius: 24px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 70px rgba(0, 113, 227, 0.2);
  transform-style: preserve-3d;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, 
      rgba(100, 172, 255, 0.1) 0%,
      rgba(0, 113, 227, 0.05) 100%
    );
  }
`;

const ShapeContent = styled.div`
  position: absolute;
  inset: 0;
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 15px;
`;

const Tile = styled(motion.div)<{ color: string }>`
  background: ${props => props.color};
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transform-style: preserve-3d;
  padding: 15px;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg, 
      rgba(255, 255, 255, 0.2) 0%, 
      rgba(255, 255, 255, 0) 60%
    );
    mix-blend-mode: overlay;
  }
`;

const TileIcon = styled(motion.div)`
  font-size: 32px;
  margin-bottom: 8px;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 2;
`;

const TileLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: white;
  text-align: center;
  z-index: 2;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`;

const Title = styled(motion.h1)`
  font-size: 58px;
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
    font-size: 42px;
  }
`;

const Subtitle = styled(motion.div)`
  font-size: 22px;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  
  @media (max-width: 900px) {
    justify-content: center;
  }
`;

const Location = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(0, 113, 227, 0.15);
  border-radius: 30px;
  font-weight: 500;
  color: var(--text-dark);
  font-size: 15px;
  margin-bottom: 32px;
  max-width: fit-content;
  
  @media (max-width: 900px) {
    margin: 0 auto 32px;
  }
`;

const StoryText = styled(motion.p)`
  font-size: 19px;
  line-height: 1.7;
  color: #555;
  margin-bottom: 0;
  max-width: 550px;
  font-weight: 450;
  
  @media (max-width: 900px) {
    margin-left: auto;
    margin-right: auto;
  }
`;

const ContentSection = styled(Section)`
  display: flex;
  flex-direction: column;
  gap: 80px;
  
  @media (max-width: 768px) {
    gap: 60px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 32px;
  color: var(--text-dark);
  position: relative;
  background: linear-gradient(to right, #000, #555);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 80px;
    height: 3px;
    background: linear-gradient(to right, #0071e3, #64acff);
    border-radius: 3px;
  }
`;

const PhilosophyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const QuoteSection = styled(motion.div)`
  padding: 60px 40px;
  background: linear-gradient(to right, rgba(0, 113, 227, 0.08), rgba(100, 172, 255, 0.08));
  border-radius: 24px;
  position: relative;
  overflow: hidden;
  margin: 30px 0;
  transform-style: preserve-3d;
  
  &::before {
    content: '"';
    position: absolute;
    top: -40px;
    left: 20px;
    font-size: 240px;
    color: rgba(0, 113, 227, 0.08);
    font-family: serif;
    line-height: 1;
  }
  
  @media (max-width: 768px) {
    padding: 40px 24px;
  }
`;

const QuoteText = styled.p`
  font-size: 26px;
  line-height: 1.5;
  color: var(--text-dark);
  font-weight: 500;
  text-align: center;
  margin: 0;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const StoryCard = styled(motion.div)`
  background: white;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.06);
  margin-bottom: 40px;
  position: relative;
  overflow: hidden;
  transform-style: preserve-3d;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 150px;
    height: 150px;
    background: linear-gradient(135deg, rgba(0, 113, 227, 0.05), rgba(100, 172, 255, 0.01));
    border-radius: 0 0 0 150px;
    pointer-events: none;
  }
  
  @media (max-width: 768px) {
    padding: 30px 24px;
  }
`;

const StoryCardTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
  color: var(--text-dark);
  display: flex;
  align-items: center;
  
  &::before {
    content: '';
    display: inline-block;
    width: 20px;
    height: 20px;
    background: linear-gradient(to right, #0071e3, #64acff);
    border-radius: 50%;
    margin-right: 12px;
    flex-shrink: 0;
  }
`;

const StoryCardContent = styled.p`
  font-size: 17px;
  line-height: 1.7;
  color: #555;
  margin-bottom: 0;
`;

const CTASection = styled(motion.div)`
  padding: 60px;
  background: linear-gradient(135deg, #0071e3, #5ac8fa);
  border-radius: 24px;
  color: white;
  text-align: center;
  box-shadow: 0 16px 70px rgba(0, 113, 227, 0.3);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle at center,
      rgba(255, 255, 255, 0.2) 0%,
      rgba(255, 255, 255, 0) 70%
    );
    opacity: 0.4;
    mix-blend-mode: overlay;
    pointer-events: none;
  }
  
  @media (max-width: 768px) {
    padding: 40px 24px;
  }
`;

const CTATitle = styled.h2`
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const CTADescription = styled.p`
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 32px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  opacity: 0.9;
`;

const CTAButton = styled(motion.button)`
  background: white;
  color: var(--primary-color);
  font-size: 16px;
  font-weight: 600;
  padding: 16px 32px;
  border-radius: 50px;
  border: none;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
  }
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 24px;
`;

const AwardImage = styled(motion.div)`
  height: 180px;
  background: linear-gradient(45deg, rgba(0, 113, 227, 0.1), rgba(100, 172, 255, 0.1));
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  font-weight: 600;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  
  &:hover {
    background: linear-gradient(45deg, rgba(0, 113, 227, 0.15), rgba(100, 172, 255, 0.15));
  }
`;

// Add new styled components for the image preview modal
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 40px;
`;

const ModalContent = styled(motion.div)`
  position: relative;
  max-width: 90%;
  max-height: 80vh;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 70px rgba(0, 0, 0, 0.3);
`;

const ModalImage = styled.img`
  display: block;
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  z-index: 10000;
`;

const NavButton = styled(motion.button)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0071e3, #64acff);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(0, 113, 227, 0.35);
  z-index: 10000;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg, 
      rgba(255, 255, 255, 0.2) 0%, 
      rgba(255, 255, 255, 0) 60%
    );
    z-index: -1;
  }
`;

const PrevButton = styled(NavButton)`
  left: 25px;
`;

const NextButton = styled(NavButton)`
  right: 25px;
`;

const HobbyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const HobbyCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
  position: relative;
  height: 280px;
  transform-style: preserve-3d;
`;

const HobbyImage = styled.div<{ bgColor: string }>`
  height: 140px;
  background: ${props => props.bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg, 
      rgba(255, 255, 255, 0.2) 0%, 
      rgba(255, 255, 255, 0) 60%
    );
    z-index: 1;
  }
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 50%,
      rgba(0, 0, 0, 0.25) 100%
    );
    pointer-events: none;
  }
`;

const HobbyContent = styled.div`
  padding: 20px;
  position: relative;
  height: 100px;
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
`;

const HobbyTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
  background: linear-gradient(to right, #333, #666);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const HobbyText = styled.p`
  font-size: 15px;
  color: #666;
  line-height: 1.6;
  padding-bottom: 30px;
`;

const SkillConnector = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: -15px;
  width: 1px;
  height: 30px;
  background: linear-gradient(to bottom, rgba(0, 113, 227, 0.1), rgba(0, 113, 227, 0.3));
`;

const CodeSymbol = styled(motion.div)<{ top: string; left: string; size: string; rotation: number }>`
  position: absolute;
  font-size: ${props => props.size};
  color: rgba(0, 113, 227, 0.1);
  top: ${props => props.top};
  left: ${props => props.left};
  font-family: monospace;
  font-weight: bold;
  z-index: 1;
`;

const HobbyIcon = styled.div`
  font-size: 36px;
  margin-bottom: 15px;
  transform-origin: center;
`;

const BadgeContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
  margin-top: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const Badge = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  height: 270px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 15px;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 113, 227, 0.15);
  }
`;

const CircleDecoration = styled(motion.div)<{ size: string; color: string; top: string; left: string; delay: number }>`
  position: absolute;
  width: ${props => props.size};
  height: ${props => props.size};
  border-radius: 50%;
  background: ${props => props.color};
  opacity: 0.15;
  top: ${props => props.top};
  left: ${props => props.left};
`;

const getOptimizedImage = (originalPath: string) => {
  return originalPath;
};

const About: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  
  const awardImages = [
    '/images/award-1.png',
    '/images/award-2.jpg',
    '/images/award-3.jpg',
    '/images/award-4.jpg',
    '/images/award-5.jpg',
    '/images/award-6.jpg',
  ];
  
  const handleMouseMove = (e: React.MouseEvent) => {
    const x = e.clientX;
    const y = e.clientY;
    setMousePosition({ x, y });
  };
  
  useEffect(() => {
    const moveHandler = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', moveHandler);
    return () => {
      window.removeEventListener('mousemove', moveHandler);
    };
  }, []);
  
  const calculateTransform = (factor: number = 1, originX = 0.5, originY = 0.5) => {
    const { innerWidth: width, innerHeight: height } = window;
    const offsetX = ((mousePosition.x / width) - originX) * 20 * factor;
    const offsetY = ((mousePosition.y / height) - originY) * 20 * factor;
    
    return {
      x: offsetX,
      y: offsetY
    };
  };
  
  const handleContactClick = () => {
    const event = new CustomEvent('openChatWidget');
    window.dispatchEvent(event);
  };
  
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
  
  const tileAnimation = {
    scale: [1, 1.03, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut",
    },
  };
  
  const floatAnimation = {
    y: [0, -6, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut",
    },
  };
  
  const openImagePreview = (imageSrc: string) => {
    setSelectedImage(imageSrc);
    const index = awardImages.findIndex(img => img === imageSrc);
    setCurrentImageIndex(index >= 0 ? index : 0);
    document.body.style.overflow = 'hidden';
  };

  // Add functions to navigate between images
  const showPreviousImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIndex = (currentImageIndex - 1 + awardImages.length) % awardImages.length;
    setCurrentImageIndex(newIndex);
    setSelectedImage(awardImages[newIndex]);
  };

  const showNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIndex = (currentImageIndex + 1) % awardImages.length;
    setCurrentImageIndex(newIndex);
    setSelectedImage(awardImages[newIndex]);
  };

  // Add function to close the modal
  const closeImagePreview = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };
  
  useEffect(() => {
    // Only load the script if it doesn't already exist
    if (!document.querySelector('script[src="//cdn.credly.com/assets/utilities/embed.js"]')) {
      const script = document.createElement('script');
      script.src = "//cdn.credly.com/assets/utilities/embed.js";
      script.async = true;
      script.type = "text/javascript";
      document.body.appendChild(script);
      
      return () => {
        // Clean up the script if component unmounts
        document.body.removeChild(script);
      };
    }
  }, []);
  
  return (
    <PageContainer onMouseMove={handleMouseMove}>
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
      </BackgroundShapes>
      
      <HeroSection
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <Title
            variants={itemVariants}
          >
            I'm John.
          </Title>
          <Subtitle
            variants={itemVariants}
          >
            Frontend Developer with a passion for Data Science
          </Subtitle>
          <Location
            variants={itemVariants}
          >
            <span role="img" aria-label="location">📍</span> Manila, Philippines
          </Location>
          <StoryText
            variants={itemVariants}
          >
            I work with frontend development and have hands-on experience with component architecture, state management, and responsive design. I've also spent time exploring data science concepts through practical projects, focusing on building things that are both functional and user-friendly.
          </StoryText>
        </motion.div>
        
        <ProfileContainer>
          <ProfileFrame
            style={calculateTransform(0.5)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <PlayfulDesign>
              <CircleDecoration 
                size="220px"
                color="#0071e3"
                top="5%"
                left="10%"
                delay={0}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.15, 0.2, 0.15]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  delay: 0.2
                }}
              />
              <CircleDecoration 
                size="180px"
                color="#ff9500"
                top="65%"
                left="65%"
                delay={0.3}
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.15, 0.25, 0.15]
                }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  delay: 0.5
                }}
              />
              <CircleDecoration 
                size="150px"
                color="#34c759"
                top="45%"
                left="0%"
                delay={0.6}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.15, 0.18, 0.15]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  delay: 0.8
                }}
              />
              <CircleDecoration 
                size="120px"
                color="#5e5ce6"
                top="20%"
                left="75%"
                delay={0.9}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.12, 0.18, 0.12]
                }}
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
                  delay: 1.2
                }}
              />
              
              <CodeSymbol
                top="35%"
                left="25%"
                size="24px"
                rotation={15}
                animate={{ 
                  opacity: [0.6, 1, 0.6],
                  rotate: [0, 15, 0]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity
                }}
              >
                &lt;/&gt;
              </CodeSymbol>
              
              <CodeSymbol
                top="60%"
                left="45%"
                size="18px"
                rotation={-10}
                animate={{ 
                  opacity: [0.4, 0.8, 0.4],
                  rotate: [0, -15, 0]
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  delay: 1
                }}
              >
                { }
              </CodeSymbol>
              
              <SkillTag 
                color="linear-gradient(135deg, #0071e3, #64acff)"
                top="12%"
                left="22%"
                delay={0.1}
                animate={{
                  y: [0, -8, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: 0.1
                }}
                whileHover={{ scale: 1.1, boxShadow: "0 10px 25px rgba(0, 113, 227, 0.3)" }}
              >
                <SkillIcon>⚛️</SkillIcon> React
              </SkillTag>
              
              <SkillTag 
                color="linear-gradient(135deg, #ff9500, #ff2d55)"
                top="30%"
                left="60%"
                delay={0.2}
                animate={{
                  y: [0, -6, 0]
                }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  delay: 0.3
                }}
                whileHover={{ scale: 1.1, boxShadow: "0 10px 25px rgba(255, 149, 0, 0.3)" }}
                style={{ whiteSpace: "nowrap" }}
              >
                <SkillIcon>🧠</SkillIcon> ML
              </SkillTag>
              
              <SkillTag 
                color="linear-gradient(135deg, #34c759, #64acff)"
                top="55%"
                left="20%"
                delay={0.3}
                animate={{
                  y: [0, -7, 0]
                }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  delay: 0.5
                }}
                whileHover={{ scale: 1.1, boxShadow: "0 10px 25px rgba(52, 199, 89, 0.3)" }}
              >
                <SkillIcon>📱</SkillIcon> Responsive
              </SkillTag>
              
              <SkillTag 
                color="linear-gradient(135deg, #5e5ce6, #5ac8fa)"
                top="75%"
                left="55%"
                delay={0.4}
                animate={{
                  y: [0, -5, 0]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: 0.7
                }}
                whileHover={{ scale: 1.1, boxShadow: "0 10px 25px rgba(94, 92, 230, 0.3)" }}
              >
                <SkillIcon>📊</SkillIcon> Data Science
              </SkillTag>
              
              <SkillTag 
                color="linear-gradient(135deg, #cf4a86, #f06292)"
                top="42%"
                left="40%"
                delay={0.5}
                animate={{
                  y: [0, -6, 0]
                }}
                transition={{
                  duration: 2.7,
                  repeat: Infinity,
                  delay: 0.6
                }}
                whileHover={{ scale: 1.1, boxShadow: "0 10px 25px rgba(207, 74, 134, 0.3)" }}
              >
                <SkillIcon>🚀</SkillIcon> Next.js
              </SkillTag>
            </PlayfulDesign>
          </ProfileFrame>
        </ProfileContainer>
      </HeroSection>

      <ContentSection>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <SectionTitle>What I believe</SectionTitle>
          <StoryText
            style={{ 
              maxWidth: '700px', 
              marginBottom: '40px', 
              fontSize: '20px', 
              textAlign: 'center',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}
          >
I build functional applications with a focus on creativity and practicality. I like finding simple, effective solutions that make sense in real-world use. My approach leans more on making things work well and look good.
          </StoryText>
        </motion.div>
        
        <PhilosophyGrid>
          <StoryCard
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <StoryCardTitle>01</StoryCardTitle>
            <StoryCardContent>
              <strong>Thoughtful engineering</strong><br/><br/>
              I try to build applications with care, keeping performance and readability in mind. I value solutions that 
              load reasonably fast, use memory wisely, and apply practical data structures—with functions written to be 
              clear and easy to maintain.
            </StoryCardContent>
          </StoryCard>
          
          <StoryCard
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <StoryCardTitle>02</StoryCardTitle>
            <StoryCardContent>
              <strong>Systematic approach</strong><br/><br/>
              I believe that strong solutions come from well-organized processes. I make use of version control, set up basic CI/CD 
              workflows, and rely on automated testing to help keep code stable and easier to maintain as projects grow.
            </StoryCardContent>
          </StoryCard>

          <StoryCard
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <StoryCardTitle>03</StoryCardTitle>
            <StoryCardContent>
              <strong>Technical standards</strong><br/><br/>
              I do my best to follow web standards and aim for consistent performance across browsers. This includes writing 
              semantic HTML, using ARIA when needed, and applying reliable JavaScript techniques that hold up in different environments.
            </StoryCardContent>
          </StoryCard>

          <StoryCard
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <StoryCardTitle>04</StoryCardTitle>
            <StoryCardContent>
              <strong>Continuous improvement</strong><br/><br/>
              I like revisiting code to make it better over time. This includes running performance checks, trimming 
              down bundle sizes, and adding helpful features like code splitting and lazy loading whenever they make sense.
            </StoryCardContent>
          </StoryCard>
        </PhilosophyGrid>

        <QuoteSection
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          style={calculateTransform(0.2)}
          animate={floatAnimation}
        >
          <QuoteText>
            I solve problems by combining technical knowledge with practical approaches.
          </QuoteText>
        </QuoteSection>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <SectionTitle>My background</SectionTitle>
          <StoryCard
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <StoryCardContent>
              My computer science education has included learning about algorithms, data structures, and basic system design. These concepts help me approach programming problems methodically.
              <br /><br />
              I've practiced building React components, working with hooks for state management, and implementing responsive designs. I'm familiar with the React component lifecycle and common optimization techniques.
              <br /><br />
              In my projects, I enjoy exploring different libraries and frameworks to better understand frontend development patterns and best practices.
            </StoryCardContent>
          </StoryCard>
          
          <StoryCard
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            <StoryCardTitle>Professional Experience</StoryCardTitle>
            <StoryCardContent>
              I worked as an intern at OTis Philippines Inc., where I contributed to research tasks for software development projects. My responsibilities included:
              <br /><br />
              • Researching payment systems integration and user management solutions
              <br />
              • Conducting technical evaluations of language detection technologies
              <br />
              • Developing test scripts for frontend components
              <br />
              • Contributing to documentation for architecture decision records
              <br /><br />
              This experience allowed me to apply my technical skills in a professional environment while learning about software development workflows and best practices.
            </StoryCardContent>
          </StoryCard>
          
          <StoryCard
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <StoryCardTitle>Awards and Recognition</StoryCardTitle>
            <StoryCardContent>
              During my learning journey, I've worked on several projects that have helped me develop my technical skills. 
              These experiences have given me practical knowledge of development concepts.
              <br /><br />
              <ImageGrid>
                <AwardImage 
                  whileHover={{ scale: 1.05, y: -5 }} 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openImagePreview(getOptimizedImage('/images/award-1.png'))}
                >
                  <img 
                    src={getOptimizedImage('/images/award-1.png')} 
                    alt="Award Certificate" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      borderRadius: '10px'
                    }} 
                  />
                </AwardImage>
                <AwardImage 
                  whileHover={{ scale: 1.05, y: -5 }} 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openImagePreview(getOptimizedImage('/images/award-2.jpg'))}
                >
                  <img 
                    src={getOptimizedImage('/images/award-2.jpg')} 
                    alt="Award Certificate" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      borderRadius: '10px'
                    }} 
                  />
                </AwardImage>
                <AwardImage 
                  whileHover={{ scale: 1.05, y: -5 }} 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openImagePreview(getOptimizedImage('/images/award-3.jpg'))}
                >
                  <img 
                    src={getOptimizedImage('/images/award-3.jpg')} 
                    alt="Award Certificate" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      borderRadius: '10px'
                    }} 
                  />
                </AwardImage>
                <AwardImage 
                  whileHover={{ scale: 1.05, y: -5 }} 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openImagePreview(getOptimizedImage('/images/award-4.jpg'))}
                >
                  <img 
                    src={getOptimizedImage('/images/award-4.jpg')} 
                    alt="Award Certificate" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      borderRadius: '10px'
                    }} 
                  />
                </AwardImage>
                <AwardImage 
                  whileHover={{ scale: 1.05, y: -5 }} 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openImagePreview(getOptimizedImage('/images/award-5.jpg'))}
                >
                  <img 
                    src={getOptimizedImage('/images/award-5.jpg')} 
                    alt="Award Certificate" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      borderRadius: '10px'
                    }} 
                  />
                </AwardImage>
                <AwardImage 
                  whileHover={{ scale: 1.05, y: -5 }} 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openImagePreview(getOptimizedImage('/images/award-6.jpg'))}
                >
                  <img 
                    src={getOptimizedImage('/images/award-6.jpg')} 
                    alt="Award Certificate" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      borderRadius: '10px'
                    }} 
                  />
                </AwardImage>
              </ImageGrid>
            </StoryCardContent>
          </StoryCard>
          
          <StoryCard
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <StoryCardTitle>Certifications</StoryCardTitle>
            <StoryCardContent>
              Professional certifications that validate my expertise in various technologies and methodologies.
              <br /><br />
              <BadgeContainer>
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
            </StoryCardContent>
          </StoryCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <SectionTitle>Beyond code</SectionTitle>
          <StoryText
            style={{
              maxWidth: '700px',
              marginBottom: '30px',
              fontSize: '18px',
              marginLeft: 'auto',
              marginRight: 'auto',
              textAlign: 'center'
            }}
          >
            When I'm not coding, these are some activities I enjoy that help me maintain balance and bring fresh perspectives to my work.
          </StoryText>
          
          <HobbyGrid>
            <HobbyCard
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <HobbyImage bgColor="linear-gradient(135deg, #C0A080, #8B5A2B)">
                <HobbyIcon>☕</HobbyIcon>
              </HobbyImage>
              <HobbyContent>
                <HobbyTitle>Coffee Exploration</HobbyTitle>
                <HobbyText>
                  Tinkering with brew times and bean ratios to find that perfect cup—bold flavor, just the right kick.
                </HobbyText>
              </HobbyContent>
            </HobbyCard>
            
            <HobbyCard
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <HobbyImage bgColor="linear-gradient(135deg, #5851DB, #833AB4)">
                <HobbyIcon>🎵</HobbyIcon>
              </HobbyImage>
              <HobbyContent>
                <HobbyTitle>Music Companion</HobbyTitle>
                <HobbyText>
                  Curating feel-good sounds and focus-friendly tunes that make deep work a little more fun.
                </HobbyText>
              </HobbyContent>
            </HobbyCard>
            
            <HobbyCard
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <HobbyImage bgColor="linear-gradient(135deg, #3F729B, #1C92D2)">
                <HobbyIcon>📷</HobbyIcon>
              </HobbyImage>
              <HobbyContent>
                <HobbyTitle>Photography</HobbyTitle>
                <HobbyText>
                  Snapping photos and playing with edits to turn everyday moments into stories and creative visuals.
                </HobbyText>
              </HobbyContent>
            </HobbyCard>
          </HobbyGrid>
        </motion.div>
        
        <CTASection
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <CTATitle>Let's build something together</CTATitle>
          <CTADescription>
            I build applications using modern JavaScript frameworks,
            state management solutions, and data processing techniques. If you have a project that needs 
            implementation help, let's talk about working together.
          </CTADescription>
          <CTAButton 
            onClick={handleContactClick}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            Get in touch
          </CTAButton>
        </CTASection>
      </ContentSection>

      {/* Update image preview modal with navigation buttons */}
      <AnimatePresence>
        {selectedImage && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeImagePreview}
          >
            <ModalContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalImage src={selectedImage} alt="Award Certificate Preview" />
            </ModalContent>
            <CloseButton 
              onClick={closeImagePreview}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ✕
            </CloseButton>
            <PrevButton
              onClick={showPreviousImage}
              whileHover={{ 
                scale: 1.1, 
                boxShadow: "0 12px 30px rgba(0, 113, 227, 0.5)" 
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span style={{ 
                fontSize: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                lineHeight: 1,
                marginTop: '-4px' 
              }}>←</span>
            </PrevButton>
            <NextButton
              onClick={showNextImage}
              whileHover={{ 
                scale: 1.1, 
                boxShadow: "0 12px 30px rgba(0, 113, 227, 0.5)" 
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span style={{ 
                fontSize: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                lineHeight: 1,
                marginTop: '-4px' 
              }}>→</span>
            </NextButton>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

export default About;