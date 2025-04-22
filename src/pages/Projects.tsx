import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { AppleButton } from '../components/UIUtils';
import ProgressHeader from '../components/ProgressHeader';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  categories: string[];
  technologies: string[];
  about: string;
  website: string;
  github: string;
}

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

const PageContainer = styled.div`
  min-height: 100vh;
  position: relative;
  padding: 80px 24px;
  max-width: 1200px;
  margin: 0 auto;
  z-index: 2;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 60px 24px;
  }
`;

const ProjectsHeader = styled.div`
  margin-bottom: 60px;
  text-align: center;
`;

const PageTitle = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 20px;
  background: linear-gradient(to right, #000, #444);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    height: 4px;
    width: 80px;
    background: linear-gradient(to right, #0071e3, #64acff);
    border-radius: 4px;
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const CategoryFilters = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 40px auto;
  flex-wrap: wrap;
  max-width: 800px;
  padding: 0 10px;
  
  @media (max-width: 768px) {
    gap: 10px;
    margin: 30px auto;
  }
  
  @media (max-width: 480px) {
    gap: 8px;
    margin: 25px auto 35px;
  }
`;

const FilterButton = styled(motion.button)<{ active: boolean }>`
  padding: 8px 18px;
  border-radius: 30px;
  font-size: 15px;
  font-weight: ${props => props.active ? '600' : '500'};
  background: ${props => props.active ? 'linear-gradient(to right, rgba(0, 113, 227, 0.15), rgba(100, 172, 255, 0.15))' : 'transparent'};
  color: ${props => props.active ? 'var(--primary-color)' : 'var(--text-dark)'};
  border: 1px solid ${props => props.active ? 'var(--primary-color)' : 'rgba(0, 0, 0, 0.1)'};
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 8px;
  letter-spacing: normal;
  box-shadow: ${props => props.active ? '0 4px 12px rgba(0, 113, 227, 0.15)' : 'none'};
  transform: ${props => props.active ? 'translateY(-2px)' : 'none'};
  
  &:hover {
    background: ${props => props.active 
      ? 'linear-gradient(to right, rgba(0, 113, 227, 0.15), rgba(100, 172, 255, 0.15))' 
      : 'rgba(0, 113, 227, 0.05)'};
    transform: translateY(-1px);
    border-color: ${props => props.active ? 'var(--primary-color)' : 'rgba(0, 113, 227, 0.2)'};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 113, 227, 0.2);
  }
  
  @media (max-width: 768px) {
    padding: 7px 16px;
    font-size: 14px;
  }
  
  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 13px;
  }
`;

const ProjectsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
  margin-top: 40px;
  width: 100%;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 25px;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const ProjectCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.7);
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    border-color: rgba(0, 113, 227, 0.2);
    
    img {
      transform: scale(1.02);
    }
  }
`;

const ProjectImage = styled.div`
  position: relative;
  overflow: hidden;
  height: 200px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.8s ease-out;
  }
`;

const ProjectContent = styled.div`
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ProjectTitle = styled.h3`
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--text-dark);
`;

const ProjectDescription = styled.p`
  font-size: 15px;
  line-height: 1.6;
  color: #555;
  margin-bottom: 20px;
  flex: 1;
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
`;

const TechTag = styled.span`
  padding: 5px 12px;
  background: rgba(0, 113, 227, 0.08);
  border-radius: 30px;
  font-size: 13px;
  color: var(--primary-color);
  font-weight: 500;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 0;
  grid-column: 1 / -1;
  
  h3 {
    font-size: 22px;
    margin-bottom: 12px;
    color: var(--text-dark);
  }
  
  p {
    color: #666;
    max-width: 500px;
    margin: 0 auto;
  }
`;

// Project data
const projects: Project[] = [
  {
    id: 1,
    title: "Mango Classification System",
    description: "A mobile application that classifies mangoes by type and quality using machine learning algorithms.",
    image: "/images/project - mangosoft.jpg",
    categories: ["mobile", "ml"],
    technologies: ["Kotlin", "TensorFlow", "Jetpack Compose"],
    about: "A comprehensive mobile application that uses advanced machine learning algorithms to classify mangoes by type and quality. The system provides farmers with real-time feedback on their produce quality and helps streamline the sorting process.",
    website: "",
    github: "https://github.com/JohnAndreiCabili/Mangosoft.git"
  },
  {
    id: 2,
    title: "VeriLuxe Authenticator",
    description: "A luxury bag authentication platform with image recognition and blockchain verification.",
    image: "/images/project - veriluxe.jpg",
    categories: ["mobile", "blockchain"],
    technologies: ["Flutter", "Dart", "Firebase"],
    about: "VeriLuxe Authenticator is an easy-to-use mobile app that helps users check if luxury bags are authentic. Just scan the bag with your phone to get an instant verification.",
    website: "",
    github: "https://github.com/JohnAndreiCabili/VeriLuxe-Rn.git"
  },
  {
    id: 3,
    title: "OSCA Management System",
    description: "A desktop application for managing senior citizen records for a local government unit.",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80",
    categories: ["desktop", "database"],
    technologies: ["C#", "WinForms", "MySQL"],
    about: "The OSCA Management System is a desktop application built to help local government units manage senior citizen records more efficiently. With an easy-to-use interface, it allows for quick record entry, powerful search options, and report generation, making it easier for administrators to support and serve the senior community.",
    website: "",
    github: ""
  },
  {
    id: 4,
    title: "Portfolio Website",
    description: "A personal portfolio website built with React and styled-components with smooth animations.",
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2064&q=80",
    categories: ["web", "frontend"],
    technologies: ["React", "TypeScript", "Framer Motion"],
    about: "A modern, responsive portfolio website built to showcase my work and skills. The site features smooth animations, intuitive navigation, and a clean, professional design. It was developed using React and TypeScript with Framer Motion for animations.",
    website: "",
    github: ""
  },
  {
    id: 5,
    title: "Weather Forecast App",
    description: "A responsive weather application with 7-day forecasts and location-based services.",
    image: "https://images.unsplash.com/photo-1580193769210-b8d1c049a7d9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2338&q=80",
    categories: ["web", "api"],
    technologies: ["JavaScript", "OpenWeather API", "Geolocation"],
    about: "A weather forecasting application that provides users with accurate weather information for cities in the Philippines. The app features a 7-day forecast, real-time weather updates, and location-based services to automatically detect the user's current location.",
    website: "",
    github: "https://github.com/JohnAndreiCabili/weatherooo.git"
  },
  {
    id: 6,
    title: "Task Management PWA",
    description: "A progressive web application for task management with offline support and push notifications.",
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2072&q=80",
    categories: ["web", "frontend", "pwa"],
    technologies: ["React", "IndexedDB", "Service Workers", "In Progress"],
    about: "A task management web application that works offline. Users can create, organize, and prioritize tasks, receive push notifications for reminders, and synchronize their data when back online. The app utilizes service workers and IndexedDB for offline functionality.",
    website: "",
    github: ""
  }
];

// Filter categories
const categories = [
  { id: "all", label: "All Projects" },
  { id: "web", label: "Web Development" },
  { id: "mobile", label: "Mobile Apps" },
  { id: "desktop", label: "Desktop Apps" },
  { id: "ml", label: "AI & ML" }
];

// Custom detail panel with high-priority z-index to ensure it displays above all elements
const DetailPanel = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  width: 38%;
  height: 100vh;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  box-shadow: -5px 0 30px rgba(0, 0, 0, 0.1);
  z-index: 9999999 !important; /* Ensuring panel stays on top of all page elements */
  padding: 40px;
  overflow-y: auto;
  overflow-x: hidden;
  border-left: 1px solid rgba(0, 0, 0, 0.05);
  pointer-events: all !important;
  * {
    cursor: auto !important;
  }
  
  @media (max-width: 1024px) {
    width: 50%;
  }
  
  @media (max-width: 768px) {
    width: 85%;
  }
  
  @media (max-width: 480px) {
    width: 100%;
  }
`;

const DetailHeader = styled.div`
  margin-bottom: 30px;
  position: relative;
  padding-top: 50px; /* Added space for better content positioning */
`;

const BackArrow = styled.button`
  position: absolute;
  top: 0;
  left: 0;
  margin-top: 0; /* Keeps arrow position clean with minimal spacing */
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin-bottom: 20px;
  border-radius: 50%;
  cursor: pointer !important;
  color: var(--primary-color);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 113, 227, 0.1);
  }
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const DetailTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const DetailDescription = styled.p`
  font-size: 16px;
  color: #555;
  line-height: 1.6;
`;

const DetailSection = styled.div`
  margin: 30px 0;
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: #333;
`;

const DetailTechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 15px 0;
`;

const DetailTechTag = styled.span`
  padding: 8px 16px;
  background: rgba(0, 113, 227, 0.08);
  border-radius: 30px;
  font-size: 14px;
  color: var(--primary-color);
  font-weight: 500;
`;

const DetailImage = styled.div`
  margin: 20px auto 25px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-height: 300px;
  
  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }
`;

// Define LinkButton
interface LinkButtonProps {
  primary?: boolean;
}

const LinkButton = styled.a<LinkButtonProps>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: ${props => props.primary ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.primary ? 'white' : 'var(--primary-color)'};
  border: 1px solid ${props => props.primary ? 'var(--primary-color)' : 'rgba(0, 113, 227, 0.2)'};
  padding: 10px 20px;
  border-radius: 30px;
  font-weight: 500;
  margin-right: 15px;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 113, 227, 0.1);
  }
`;

const LinkButtonGroup = styled.div`
  display: flex;
  margin-top: 30px;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 15px;
    
    ${LinkButton} {
      margin-right: 0;
      text-align: center;
      justify-content: center;
    }
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(5px);
  z-index: 9999998 !important;
  pointer-events: all !important;
  cursor: pointer !important;
`;

const ProjectStyles = () => {
  useEffect(() => {
    const styleEl = document.createElement('style');
    
    const css = `
      body.detail-panel-open header {
        z-index: 99 !important;
      }
      
      .project-detail-panel {
        position: fixed !important;
        top: 0 !important;
        right: 0 !important;
        z-index: 999999 !important;
        background: rgba(255, 255, 255, 0.98) !important;
      }
      
      .project-detail-overlay {
        position: fixed !important;
        inset: 0 !important;
        z-index: 999998 !important;
      }
    `;
    
    styleEl.textContent = css;
    document.head.appendChild(styleEl);
    
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);
  
  return null;
};

const Projects: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  const isMounted = useRef(false);
  
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  useEffect(() => {
    const filterTimer = setTimeout(() => {
      if (activeCategory === "all") {
        setFilteredProjects(projects);
      } else {
        const filtered = projects.filter(project => 
          project.categories.includes(activeCategory)
        );
        setFilteredProjects(filtered);
      }
    }, 300);
    
    return () => clearTimeout(filterTimer);
  }, [activeCategory]);
  
  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    document.body.classList.add('detail-panel-open');
    document.body.style.overflow = 'hidden';
  };
  
  const closeProjectDetail = () => {
    setSelectedProject(null);
    document.body.classList.remove('detail-panel-open');
    document.body.style.overflow = 'auto';
  };
  
  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <ProjectStyles />
      
      <BackgroundShapes>
        <Shape 
          size="500px" 
          color="#0071e3" 
          top="-5%" 
          left="-10%" 
          opacity={0.05}
          animate={{
            x: [0, 10, 0],
            y: [0, 8, 0],
          }}
          transition={{
            duration: 30,
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
            x: [0, -10, 0],
            y: [0, -8, 0],
          }}
          transition={{
            duration: 28,
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
            x: [0, 8, 0],
            y: [0, -6, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <DecorativeElement 
          top="15%" 
          left="20%" 
          color="rgba(0, 113, 227, 0.1)" 
          size="40px"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.6, 0.8, 0.6]
          }}
          transition={{
            duration: 8,
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
            scale: [1, 1.05, 1],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </BackgroundShapes>
      
      <PageContainer>
        <ProjectsHeader>
          <ProgressHeader title="Projects" sectionId="projects" />
        </ProjectsHeader>
        
        {/* Category filters */}
        <CategoryFilters>
          {categories.map(category => (
            <FilterButton
              key={category.id}
              active={activeCategory === category.id}
              onClick={() => setActiveCategory(category.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              {category.label}
            </FilterButton>
          ))}
        </CategoryFilters>
        
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeCategory} 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }} 
            transition={{ duration: 0.4 }}
          >
            {filteredProjects.length > 0 ? (
              <ProjectsGrid
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {filteredProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: {
                        duration: 0.4,
                        delay: index * 0.08,
                        ease: [0.23, 0.01, 0.1, 1]
                      }
                    }}
                    whileHover={{ 
                      y: -8,
                      boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
                      borderColor: 'rgba(0, 113, 227, 0.2)'
                    }}
                    onClick={() => handleProjectClick(project)}
                    style={{ cursor: 'pointer' }}
                  >
                    <ProjectImage>
                      <img src={project.image} alt={project.title} />
                    </ProjectImage>
                    <ProjectContent>
                      <ProjectTitle>{project.title}</ProjectTitle>
                      <ProjectDescription>{project.description}</ProjectDescription>
                      <TechStack>
                        {project.technologies.slice(0, 3).map((tech, index) => (
                          <TechTag key={index}>{tech}</TechTag>
                        ))}
                        {project.technologies.length > 3 && (
                          <TechTag>+{project.technologies.length - 3}</TechTag>
                        )}
                      </TechStack>
                    </ProjectContent>
                  </ProjectCard>
                ))}
              </ProjectsGrid>
            ) : (
              <EmptyState>
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  No projects found
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  There are no projects in the <strong>"{categories.find(c => c.id === activeCategory)?.label}"</strong> category yet. 
                  <br />Try selecting a different category or check back later.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  style={{ marginTop: '25px' }}
                >
                  <FilterButton 
                    active={false}
                    onClick={() => setActiveCategory("all")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View All Projects
                  </FilterButton>
                </motion.div>
              </EmptyState>
            )}
          </motion.div>
        </AnimatePresence>
        
        {/* Project Detail Panel */}
        <AnimatePresence>
          {selectedProject && (
            <>
              <Overlay 
                className="project-detail-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeProjectDetail}
                transition={{ duration: 0.3 }}
              />
              <DetailPanel
                className="project-detail-panel"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              >
                <DetailHeader>
                  <BackArrow onClick={closeProjectDetail}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </BackArrow>
                  <DetailTitle>{selectedProject.title}</DetailTitle>
                  <DetailDescription>{selectedProject.description}</DetailDescription>
                </DetailHeader>
                
                <DetailImage>
                  <img src={selectedProject.image} alt={selectedProject.title} />
                </DetailImage>
                
                <DetailSection>
                  <SectionTitle>About</SectionTitle>
                  <DetailDescription>{selectedProject.about}</DetailDescription>
                </DetailSection>
                
                <DetailSection>
                  <SectionTitle>Technologies</SectionTitle>
                  <DetailTechStack>
                    {selectedProject.technologies.map((tech, index) => (
                      <DetailTechTag key={index}>{tech}</DetailTechTag>
                    ))}
                  </DetailTechStack>
                </DetailSection>
                
                <LinkButtonGroup>
                  {selectedProject?.github && (
                    <LinkButton href={selectedProject?.github} target="_blank" rel="noopener noreferrer">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 19C4.7 20.4 4.7 16.5 3 16L9 19ZM15 21V17.5C15 16.5 15.1 16.1 14.5 15.5C17.3 15.2 20 14.1 20 9.49995C19.9988 8.30492 19.5325 7.15726 18.7 6.29995C19.0905 5.26192 19.0545 4.11158 18.6 3.09995C18.6 3.09995 17.5 2.79995 15.1 4.39995C13.1056 3.87054 11.0944 3.87054 9.1 4.39995C6.7 2.79995 5.6 3.09995 5.6 3.09995C5.14548 4.11158 5.10953 5.26192 5.5 6.29995C4.66745 7.15726 4.20122 8.30492 4.2 9.49995C4.2 14.1 6.9 15.2 9.7 15.5C9.1 16.1 9 16.5 9 17.5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Open in GitHub
                    </LinkButton>
                  )}
                </LinkButtonGroup>
              </DetailPanel>
            </>
          )}
        </AnimatePresence>
      </PageContainer>
    </div>
  );
};

export default Projects; 