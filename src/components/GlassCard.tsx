import React from 'react';
import styled from 'styled-components';

// Make this file a proper module with named exports
export {}; 

interface GlassCardProps {
  children: React.ReactNode;
  padding?: string;
  glowEffect?: boolean;
  onClick?: () => void;
}

const GlassCardContainer = styled.div<{ padding?: string; glowEffect?: boolean }>`
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: ${props => props.padding || '24px'};
  box-shadow: ${props => props.glowEffect ? 
    '0 8px 32px rgba(0, 113, 227, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.2)' : 
    '0 8px 32px rgba(0, 0, 0, 0.05), inset 0 0 0 1px rgba(255, 255, 255, 0.2)'
  };
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  position: relative;
  overflow: hidden;
  height: 100%;
  width: 100%;
  
  @media (max-width: 768px) {
    padding: ${props => props.padding || '12px'};
    border-radius: 14px;
  }
  
  @media (max-width: 480px) {
    padding: ${props => props.padding || '10px'};
    border-radius: 12px;
  }
  
  &:hover {
    box-shadow: ${props => props.glowEffect ? 
      '0 15px 40px rgba(0, 113, 227, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.4)' : 
      '0 15px 40px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.4)'
    };
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.5), transparent);
  }
`;

export const GlassCard: React.FC<GlassCardProps> = ({ children, padding, glowEffect, onClick }) => {
  return (
    <GlassCardContainer padding={padding} glowEffect={glowEffect} onClick={onClick}>
      {children}
    </GlassCardContainer>
  );
}; 