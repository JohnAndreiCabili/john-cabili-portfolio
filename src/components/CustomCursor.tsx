import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const CursorWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  pointer-events: none;
`;

const CursorDot = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 10px;
  height: 10px;
  background-color: #0071e3;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 10000;
  pointer-events: none;
  mix-blend-mode: difference;
`;

const CursorCircle = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 35px;
  height: 35px;
  background-color: transparent;
  border: 1.5px solid #0071e3;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 9999;
  opacity: 0.5;
`;

const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [hidden, setHidden] = useState(false);
  const requestRef = useRef<number | undefined>(undefined);
  const previousTimeRef = useRef<number>(0);
  
  // Mouse position
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Circle position with lerp (linear interpolation) for smooth following
  const [circlePosition, setCirclePosition] = useState({ x: 0, y: 0 });
  
  // Lerp function for smooth movement
  const lerp = useCallback((start: number, end: number, amt: number) => {
    return (1 - amt) * start + amt * end;
  }, []);
  
  // Define animateCircle as a useCallback to use in useEffect deps
  const animateCircle = useCallback(
    (time: number) => {
      setCirclePosition((prevPosition) => ({
        x: lerp(prevPosition.x, mousePosition.x, 0.15),
        y: lerp(prevPosition.y, mousePosition.y, 0.15),
      }));
      
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animateCircle);
    },
    [mousePosition, lerp]
  );
  
  useEffect(() => {
    // Handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
    };
    
    // Handle mouse events
    const handleMouseDown = () => {
      setIsClicked(true);
    };
    
    const handleMouseUp = () => {
      setIsClicked(false);
    };
    
    const handleMouseEnter = () => {
      setHidden(false);
    };
    
    const handleMouseLeave = () => {
      setHidden(true);
    };
    
    // Add cursor hover effect for interactive elements
    const addHoverEvents = () => {
      const interactiveElements = document.querySelectorAll(
        'button, a, input, textarea, [role="button"], [role="link"]'
      );
      
      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', () => setIsHovered(true));
        el.addEventListener('mouseleave', () => setIsHovered(false));
      });
    };
    
    // Add all event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    // Start animation loop
    requestRef.current = requestAnimationFrame(animateCircle);
    
    // Add hover events for interactive elements
    addHoverEvents();
    
    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animateCircle]);
  
  // Circle animation variants
  const variants = {
    default: {
      height: 35,
      width: 35,
      opacity: 0.5,
      x: "-50%",
      y: "-50%",
      transition: {
        type: "spring",
        mass: 0.6
      }
    },
    hovered: {
      height: 60,
      width: 60,
      opacity: 0.4,
      x: "-50%",
      y: "-50%",
      backgroundColor: "rgba(0, 113, 227, 0.05)",
      transition: {
        type: "spring",
        mass: 0.6
      }
    },
    clicked: {
      height: 20,
      width: 20,
      opacity: 0.8,
      x: "-50%",
      y: "-50%",
      borderWidth: "2px",
      backgroundColor: "rgba(0, 113, 227, 0.1)",
      transition: {
        type: "spring",
        mass: 0.6,
        damping: 20
      }
    },
    hidden: {
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };
  
  // Get the current animation variant
  const getVariant = () => {
    if (hidden) return "hidden";
    if (isClicked) return "clicked";
    if (isHovered) return "hovered";
    return "default";
  };
  
  return (
    <CursorWrapper>
      <CursorDot 
        ref={dotRef} 
        style={{ opacity: hidden ? 0 : 1 }}
      />
      <CursorCircle
        ref={circleRef}
        animate={getVariant()}
        variants={variants}
        style={{
          left: circlePosition.x,
          top: circlePosition.y
        }}
      />
    </CursorWrapper>
  );
};

export default CustomCursor; 