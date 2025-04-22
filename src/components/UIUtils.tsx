import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// AppleButton component
interface AppleButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

interface StyledButtonProps {
  variant: 'primary' | 'secondary';
  size: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

const ButtonContainer = styled(motion.button)<StyledButtonProps>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${props => 
    props.size === 'small' ? '8px 16px' : 
    props.size === 'large' ? '14px 32px' : '12px 24px'
  };
  font-size: ${props => 
    props.size === 'small' ? '14px' : 
    props.size === 'large' ? '18px' : '16px'
  };
  font-weight: 500;
  border-radius: 12px;
  border: none;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  overflow: hidden;
  user-select: none;
  opacity: ${props => props.disabled ? 0.7 : 1};
  color: ${props => props.variant === 'primary' ? 'white' : 'var(--text-dark)'};
  background: ${props => props.variant === 'primary' ? 'var(--primary-color)' : 'rgba(0, 0, 0, 0.05)'};
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.15),
      rgba(255, 255, 255, 0)
    );
    border-radius: 12px 12px 0 0;
  }
  
  &:hover {
    box-shadow: ${props => !props.disabled && (props.variant === 'primary' 
      ? '0 10px 20px rgba(0, 0, 0, 0.15)' 
      : '0 8px 16px rgba(0, 0, 0, 0.05)')
    };
    transform: ${props => !props.disabled ? 'translateY(-2px)' : 'none'};
  }
  
  &:active {
    transform: ${props => !props.disabled ? 'translateY(1px)' : 'none'};
    box-shadow: ${props => !props.disabled ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none'};
  }
`;

const ButtonContent = styled.span`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 2;
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const AppleButton: React.FC<AppleButtonProps> = ({
  onClick,
  children,
  variant = 'primary',
  size = 'medium',
  icon,
  disabled = false,
  type = 'button'
}) => {
  return (
    <ButtonContainer
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      initial={{ y: 0 }}
      whileHover={!disabled ? { y: -2 } : undefined}
      type={type}
    >
      <ButtonContent>
        {icon && <IconWrapper>{icon}</IconWrapper>}
        {children}
      </ButtonContent>
    </ButtonContainer>
  );
}; 