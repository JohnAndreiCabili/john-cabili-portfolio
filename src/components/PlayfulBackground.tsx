import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
`;

const BackgroundGradient = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(247, 251, 255, 0.9) 100%);
`;

const BlobShape = styled(motion.div)<{ size: number; color: string; opacity: number }>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  background: ${props => props.color};
  opacity: ${props => props.opacity};
  filter: blur(60px);
`;

const CircleShape = styled(motion.div)<{ size: number; color: string; borderWidth: number }>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  border: ${props => props.borderWidth}px solid ${props => props.color};
`;

const GridPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(0, 113, 227, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 113, 227, 0.03) 1px, transparent 1px);
  background-size: 30px 30px;
`;

interface PlayfulBackgroundProps {
  className?: string;
}

const PlayfulBackground: React.FC<PlayfulBackgroundProps> = ({ className }) => {
  const blobs = [
    { 
      size: 400, 
      color: 'rgba(0, 113, 227, 0.05)', 
      opacity: 0.3,
      x: '10vw', 
      y: '10vh',
      duration: 40
    },
    { 
      size: 350, 
      color: 'rgba(100, 172, 255, 0.08)', 
      opacity: 0.4,
      x: '70vw', 
      y: '20vh',
      duration: 35
    },
    { 
      size: 300, 
      color: 'rgba(178, 212, 255, 0.1)', 
      opacity: 0.3,
      x: '30vw', 
      y: '80vh',
      duration: 28
    }
  ];

  const circles = [
    { 
      size: 120, 
      color: 'rgba(0, 113, 227, 0.15)', 
      borderWidth: 1,
      x: '85vw', 
      y: '15vh',
      duration: 20 
    },
    { 
      size: 80, 
      color: 'rgba(100, 172, 255, 0.2)', 
      borderWidth: 2,
      x: '20vw', 
      y: '40vh',
      duration: 15
    },
    { 
      size: 50, 
      color: 'rgba(0, 113, 227, 0.25)', 
      borderWidth: 3,
      x: '75vw', 
      y: '70vh',
      duration: 12
    }
  ];

  return (
    <BackgroundContainer className={className}>
      <BackgroundGradient />
      <GridPattern />
      
      {blobs.map((blob, index) => (
        <BlobShape
          key={`blob-${index}`}
          size={blob.size}
          color={blob.color}
          opacity={blob.opacity}
          initial={{ x: blob.x, y: blob.y }}
          animate={{ 
            x: [blob.x, `calc(${blob.x} + 10vw)`, blob.x],
            y: [blob.y, `calc(${blob.y} + 8vh)`, blob.y]
          }}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      ))}
      
      {circles.map((circle, index) => (
        <CircleShape
          key={`circle-${index}`}
          size={circle.size}
          color={circle.color}
          borderWidth={circle.borderWidth}
          initial={{ x: circle.x, y: circle.y, opacity: 0.7 }}
          animate={{ 
            x: [circle.x, `calc(${circle.x} - 5vw)`, circle.x],
            y: [circle.y, `calc(${circle.y} - 3vh)`, circle.y],
            opacity: [0.7, 0.3, 0.7],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: circle.duration,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      ))}
    </BackgroundContainer>
  );
};

export default PlayfulBackground; 