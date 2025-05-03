import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const ProgressIndicator = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(to right, #0071e3, #64acff);
  transform-origin: 0%;
  z-index: 1001;
`;

const HeaderContainer = styled(motion.header)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
  z-index: 1000;
  transition: all 0.3s ease;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.2rem 2rem;

  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
  }
`;

const Logo = styled(Link)`
  font-size: 1.8rem;
  font-weight: 800;
  text-decoration: none;
  background: linear-gradient(to right, #0071e3, #64acff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const NavLinks = styled.ul`
  display: flex;
  list-style: none;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    gap: 0.8rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

const NavItem = styled(Link)<{ active: boolean }>`
  position: relative;
  text-decoration: none;
  font-size: 1rem;
  font-weight: ${props => (props.active ? '600' : '500')};
  color: ${props => (props.active ? '#0071e3' : '#555')};
  padding: 0.5rem 0;
  transition: all 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    width: ${props => (props.active ? '100%' : '0%')};
    height: 2px;
    bottom: 0;
    left: 0;
    background: linear-gradient(to right, #0071e3, #64acff);
    transition: width 0.3s ease;
    border-radius: 2px;
  }

  &:hover {
    color: #0071e3;

    &::after {
      width: 100%;
    }
  }
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.5rem 0.2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const Header = () => {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const [isProjectDetailOpen, setIsProjectDetailOpen] = useState(false);
  const location = useLocation();

  // Monitor body for detail-panel-open class
  useEffect(() => {
    const checkDetailPanel = () => {
      const isDetailOpen = document.body.classList.contains('detail-panel-open');
      setIsProjectDetailOpen(isDetailOpen);
    };

    // Initial check
    checkDetailPanel();

    // Set up mutation observer to detect when the class changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkDetailPanel();
        }
      });
    });

    observer.observe(document.body, { attributes: true });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollHeight = documentHeight - windowHeight;
      const progress = scrollTop / scrollHeight;
      setScrollProgress(progress);

      // Hide header on scroll down, show on scroll up
      if (scrollTop > 100) {
        setIsHeaderVisible(scrollTop < lastScrollTop);
      } else {
        setIsHeaderVisible(true);
      }
      lastScrollTop = scrollTop;
    };

    let lastScrollTop = 0;
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update active section based on URL path
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setActiveSection('home');
    } else {
      setActiveSection(path.slice(1)); // Remove the leading slash
    }
    
    // If the path is /contact, dispatch event to open chat widget
    // This handles if someone refreshes or directly accesses the /contact URL
    if (path === '/contact') {
      const event = new CustomEvent('openChatWidget');
      window.dispatchEvent(event);
    }
  }, [location]);

  // Modify scrollToSection to use router
  const scrollToSection = (section: string) => {
    if (section === 'contact') {
      // For contact, dispatch event to open chat widget
      const event = new CustomEvent('openChatWidget');
      window.dispatchEvent(event);
      return;
    }
    
    if (location.pathname === '/') {
      // If on homepage, scroll to section
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <ProgressIndicator 
        style={{ scaleX: scrollProgress }}
        transition={{ ease: "easeOut", duration: 0.2 }}
      />
      <HeaderContainer
        animate={{ 
          y: isHeaderVisible && !isProjectDetailOpen ? 0 : -80,
          opacity: isHeaderVisible && !isProjectDetailOpen ? 1 : 0
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <Nav>
          <Logo to="/" onClick={() => scrollToSection('home')}>JAC</Logo>
          
          <NavLinks>
            <NavItem 
              to="/" 
              active={activeSection === 'home'}
              onClick={() => scrollToSection('home')}
            >
              Home
            </NavItem>
            <NavItem 
              to="/about" 
              active={activeSection === 'about'}
            >
              About
            </NavItem>
            <NavItem 
              to="/resume" 
              active={activeSection === 'resume'}
            >
              Resume
            </NavItem>
            <NavItem 
              to="/projects" 
              active={activeSection === 'projects'}
            >
              Projects
            </NavItem>
            <NavItem 
              to="/blog" 
              active={activeSection === 'blog'}
            >
              Blog
            </NavItem>
            <NavItem 
              to="/"
              active={activeSection === 'contact'}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('contact');
              }}
            >
              Contact
            </NavItem>
          </NavLinks>
        </Nav>
      </HeaderContainer>
    </>
  );
};

export default Header;