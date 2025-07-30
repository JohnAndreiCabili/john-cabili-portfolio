import React, { useState, useEffect, useCallback, useMemo, memo, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressHeader from '../components/ProgressHeader';

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

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 120px 24px 80px;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    padding: 30px 16px 40px;
  }
  
  @media (max-width: 480px) {
    padding: 20px 12px 30px;
  }
`;

const CategoryFilter = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 50px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

// Mobile navigation
const MobileNavigation = styled.div<{ isFixed: boolean; scrollProgress: number }>`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    overflow-x: auto;
    padding: 12px 24px;
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
    margin-bottom: ${(props) => props.isFixed ? '0' : '8px'};
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

const CategoryButton = styled(motion.button)<{ active: boolean }>`
  padding: 8px 18px;
  border-radius: 30px;
  font-size: 15px;
  font-weight: ${props => props.active ? '600' : '500'};
  background: ${props => props.active ? 'linear-gradient(to right, rgba(0, 113, 227, 0.15), rgba(100, 172, 255, 0.15))' : 'transparent'};
  color: ${props => props.active ? 'var(--primary-color)' : 'var(--text-dark)'};
  border: 1px solid ${props => props.active ? 'var(--primary-color)' : 'rgba(0, 0, 0, 0.1)'};
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.active ? '0 4px 12px rgba(0, 113, 227, 0.15)' : 'none'};
  transform: ${props => props.active ? 'translateY(-2px)' : 'none'};
  
  &:hover {
    background: ${props => props.active 
      ? 'linear-gradient(to right, rgba(0, 113, 227, 0.15), rgba(100, 172, 255, 0.15))' 
      : 'rgba(0, 113, 227, 0.05)'};
    transform: translateY(-1px);
    border-color: ${props => props.active ? 'var(--primary-color)' : 'rgba(0, 113, 227, 0.2)'};
  }
  
  @media (max-width: 768px) {
    padding: 7px 16px;
    font-size: 14px;
  }
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 40px;
  margin-bottom: 60px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
    margin-bottom: 40px;
  }
  
  @media (max-width: 480px) {
    gap: 20px;
    margin-bottom: 30px;
  }
`;

const FeaturedBlog = styled(motion.div)`
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 50px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: 0 15px 40px rgba(0, 113, 227, 0.15);
    transform: translateY(-5px);
  }
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  height: 220px;
  width: 100%;
  overflow: hidden;
  
  @media (max-width: 900px) {
    height: 220px;
  }
`;

const FeaturedImageWrapper = styled(ImageWrapper)`
  height: 300px;
  
  @media (max-width: 900px) {
    height: 250px;
  }
`;

const BlogImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  
  ${FeaturedBlog}:hover & {
    transform: scale(1.05);
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.3));
  z-index: 1;
`;

const FeaturedContent = styled.div`
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  @media (max-width: 768px) {
    padding: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 16px;
  }
`;

const FeaturedBadge = styled.span`
  background: linear-gradient(to right, #ff9500, #ff2d55);
  color: white;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 14px;
  border-radius: 20px;
  margin-bottom: 20px;
  display: inline-block;
  box-shadow: 0 5px 15px rgba(255, 45, 85, 0.2);
  align-self: flex-start;
  
  @media (max-width: 768px) {
    font-size: 12px;
    padding: 6px 10px;
  }
`;

const BlogCard = styled(motion.div)`
  background: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  
  &:hover {
    box-shadow: 0 15px 40px rgba(0, 113, 227, 0.15);
    transform: translateY(-8px);
  }
  
  &:hover ${BlogImage} {
    transform: scale(1.05);
  }
`;

const BlogContent = styled.div`
  padding: 28px;
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  
  @media (max-width: 768px) {
    padding: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 16px;
  }
`;

const BlogCategory = styled.span`
  color: var(--primary-color);
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  display: block;
`;

const BlogPostTitle = styled.h3`
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 14px;
  color: var(--text-dark);
  line-height: 1.3;
  transition: color 0.3s ease;
  
  ${BlogCard}:hover & {
    color: var(--primary-color);
  }
`;

const BlogExcerpt = styled.p`
  font-size: 16px;
  color: #64748b;
  line-height: 1.6;
  flex: 1;
  margin-bottom: 20px;
`;

const MetaInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #94a3b8;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
`;

const DateInfo = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #64748b;
  font-size: 18px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
`;

// Modal Components
const ModalBackdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const ModalCard = styled(motion.div)`
  background: white;
  border-radius: 24px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  position: relative;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 20px;
  }
`;

const CloseButton = styled.button`
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
  z-index: 1001;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
`;

const PostHeader = styled.div`
  padding: 40px 40px 30px;
  
  @media (max-width: 768px) {
    padding: 30px 20px 20px;
  }
`;

const PostTitle = styled.h2`
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 20px;
  background: linear-gradient(120deg, #0071e3, #1e88e5);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  
  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 15px;
  }
`;

const PostImageContainer = styled.div`
  width: 100%;
  height: 400px;
  position: relative;
  margin-bottom: 30px;
  overflow: hidden;
  
  @media (max-width: 768px) {
    height: 250px;
  }
`;

const PostImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PostContent = styled.div`
  padding: 0 40px 40px;
  font-size: 18px;
  line-height: 1.8;
  color: #334155;
  
  p {
    margin-bottom: 24px;
  }
  
  h3 {
    font-size: 24px;
    font-weight: 700;
    margin: 36px 0 20px;
    color: var(--text-dark);
  }
  
  ul, ol {
    margin-bottom: 24px;
    padding-left: 24px;
  }
  
  li {
    margin-bottom: 12px;
  }
  
  img {
    max-width: 100%;
    border-radius: 12px;
    margin: 30px 0;
  }
  
  @media (max-width: 768px) {
    padding: 0 20px 30px;
    font-size: 16px;
  }
`;

// Blog data
const blogPosts = [
  {
    id: 1,
    title: 'Payment Information Management Architecture for Slack Integration',
    category: 'Research',
    date: 'February 27, 2025',
    image: '/images/blog-1.jpg',
    excerpt: 'Researching payment management architecture for Slack workspaces using Paddle with role-based access control.',
    featured: true,
    content: `
      <p>At OTis Philippines Inc., I researched payment information management architecture for Slack workspaces using Paddle, focusing on secure role-based access for workspace owners and admins.</p>
      
      <h3>Requirements</h3>
      <p>The project needed to address:</p>
      <ul>
        <li>Enabling workspace owners and potentially admins to manage payment information</li>
        <li>Supporting multiple authorized users per workspace to prevent access loss if owners become inactive</li>
        <li>Isolating payment information from the Slack frontend for security</li>
        <li>Maintaining secure access control while enabling management functions</li>
      </ul>
      
      <h3>Research Methods</h3>
      <p>I conducted the research by:</p>
      <ul>
        <li>Evaluating Paddle integration options for payment processing</li>
        <li>Analyzing role-based access models specific to Slack workspaces</li>
        <li>Creating Architecture Decision Records (MADRs) to document technical options</li>
        <li>Designing sequence diagrams illustrating authorization and payment flows between Slack and Paddle</li>
      </ul>
      
      <h3>Key Findings</h3>
      <p>Research determined that:</p>
      <ul>
        <li>Direct integration with Paddle's customer portal optimized security and usability</li>
        <li>This approach prevented Slack frontend from accessing sensitive payment data</li>
        <li>Paddle's built-in user management handled multi-user access requirements</li>
        <li>Webhook integration enabled real-time payment status notifications back to Slack</li>
      </ul>
      
      <h3>Deliverables</h3>
      <p>The project produced:</p>
      <ul>
        <li>Architecture Decision Record comparing four integration options</li>
        <li>Sequence diagrams showing user flows from Slack to Paddle for payment management</li>
        <li>Security analysis for each approach focusing on data isolation</li>
        <li>Implementation guidelines for directing users to Paddle portal</li>
      </ul>
      
      <h3>Technical Skills Applied</h3>
      <p>This project involved:</p>
      <ul>
        <li>Technical architecture research and analysis</li>
        <li>Payment processing integration patterns</li>
        <li>Security and compliance assessment for financial data</li>
        <li>MADR documentation methodology</li>
        <li>UML sequence diagramming for cross-system workflows</li>
      </ul>
    `
  },
  {
    id: 2,
    title: 'Selenium Test Automation for Slack UI Components',
    category: 'Development',
    date: 'March 15, 2025',
    image: '/images/blog-2.jpg',
    excerpt: 'Implementing Selenium tests to validate UI components in a Slack-integrated application.',
    featured: false,
    content: `
      <p>I developed automated testing scripts at OTis Philippines Inc. to validate UI components in a Slack-integrated application, focusing on the billing settings functionality.</p>
      
      <h3>Project Scope</h3>
      <p>The application required test automation for a Slack integration with billing settings modals and user interaction flows.</p>
      
      <h3>Implementation</h3>
      <p>The testing approach involved:</p>
      <ol>
        <li>Analyzing the existing codebase and testing infrastructure</li>
        <li>Identifying UI components and workflows requiring testing</li>
        <li>Developing Selenium scripts for the billing interface</li>
        <li>Implementing validation checks for UI states and interactions</li>
        <li>Setting up test cases for expected workflow outcomes</li>
      </ol>
      
      <h3>Test Coverage</h3>
      <p>The developed scripts tested:</p>
      <ul>
        <li>Navigation to billing settings modals</li>
        <li>UI element validation and state checking</li>
        <li>User interaction simulation (clicks, form submissions)</li>
        <li>Error state validation</li>
        <li>Success state confirmation</li>
      </ul>
      
      <h3>Technical Challenges</h3>
      <p>Implementation required solving:</p>
      <ul>
        <li>UI element selection for dynamically generated components</li>
        <li>Frame-switching logic for Slack's iframe architecture</li>
        <li>Timing synchronization for modal animations and state changes</li>
      </ul>
      
      <h3>Results</h3>
      <p>The test implementation:</p>
      <ul>
        <li>Automated verification of billing UI functionality</li>
        <li>Reduced manual testing time by 75%</li>
        <li>Established a framework for expanding test coverage</li>
        <li>Identified UI inconsistencies during development</li>
      </ul>
      
      <h3>Technical Skills Applied</h3>
      <p>This project utilized:</p>
      <ul>
        <li>Selenium WebDriver and automation frameworks</li>
        <li>Test strategy development for UI workflows</li>
        <li>JavaScript for test script implementation</li>
        <li>DOM traversal and element selection techniques</li>
        <li>Test debugging and CI/CD integration</li>
      </ul>
    `
  },
  {
    id: 3,
    title: 'Language Detection Library Evaluation for Rust',
    category: 'Research',
    date: 'March 6, 2025',
    image: '/images/blog-3.jpg',
    excerpt: 'Comparing language detection libraries in Rust with a focus on whitelisting capabilities for 26 specific languages.',
    featured: false,
    content: `
      <p>At OTis Philippines Inc., I evaluated language detection technologies in the Rust ecosystem, focusing on libraries supporting language whitelisting for multilingual applications.</p>
      
      <h3>Research Objectives</h3>
      <p>The research aimed to:</p>
      <ul>
        <li>Identify Rust language detection libraries with whitelisting support</li>
        <li>Verify support for 26 specific languages including rare languages</li>
        <li>Measure performance, accuracy, and implementation requirements</li>
        <li>Document findings for technical decision-making</li>
      </ul>
      
      <h3>Evaluated Technologies</h3>
      <p>The research covered:</p>
      <ul>
        <li>Lingua-RS: Trigram-based detection with native whitelisting</li>
        <li>Whichlang: Logistic regression with n-gram preprocessing</li>
        <li>CLD3-RS: Neural network-based language detector</li>
        <li>Rust-CLD2: Naïve Bayesian classification for language detection</li>
        <li>Additional Rust ecosystem libraries</li>
      </ul>
      
      <h3>Methodology</h3>
      <p>The evaluation process consisted of:</p>
      <ol>
        <li>Testing each library with identical text samples</li>
        <li>Documenting support for the 26 required languages</li>
        <li>Testing whitelisting implementation or potential workarounds</li>
        <li>Measuring memory usage and processing performance</li>
        <li>Documenting implementation examples</li>
      </ol>
      
      <h3>Technical Findings</h3>
      <p>Key findings included:</p>
      <ul>
        <li>Language support varied from 16 to 100+ languages across libraries</li>
        <li>Few libraries provided native whitelisting functionality</li>
        <li>Memory usage ranged from 5MB to 1.2GB depending on the library</li>
        <li>Detection accuracy for rare languages varied significantly</li>
      </ul>
      
      <h3>Deliverables</h3>
      <p>The research produced:</p>
      <ul>
        <li>Architecture Decision Record with technical comparisons</li>
        <li>Implementation examples for each library</li>
        <li>Performance benchmarks and resource utilization data</li>
        <li>Technical recommendations based on project constraints</li>
      </ul>
      
      <h3>Technical Skills Applied</h3>
      <p>This project involved:</p>
      <ul>
        <li>Technical library evaluation and benchmarking</li>
        <li>Natural language processing technology assessment</li>
        <li>API and implementation pattern analysis</li>
        <li>Technical documentation and architectural decision-making</li>
        <li>Rust ecosystem knowledge</li>
      </ul>
    `
  },
  {
    id: 4,
    title: 'Portfolio Website Implementation',
    category: 'Development',
    date: 'April 22, 2024',
    image: '/images/blog-4.jpg',
    excerpt: 'Building a portfolio website with React, TypeScript, and Framer Motion to showcase technical skills and projects.',
    featured: false,
    content: `
      <p>I developed this portfolio website as a final project during my OTis Philippines Inc. internship to showcase technical skills and professional experience using React and TypeScript.</p>
      
      <h3>Technical Requirements</h3>
      <p>The project aimed to:</p>
      <ul>
        <li>Create a responsive SPA with animation support</li>
        <li>Implement performance optimization techniques</li>
        <li>Showcase technical skills and internship projects</li>
        <li>Apply frontend development best practices</li>
        <li>Create a maintainable component architecture</li>
      </ul>
      
      <h3>Technology Stack</h3>
      <p>Implementation used:</p>
      <ul>
        <li>React 18 with TypeScript</li>
        <li>Styled-components for CSS-in-JS styling</li>
        <li>Framer Motion for animation system</li>
        <li>React Router for navigation</li>
        <li>Dynamic imports for code splitting</li>
        <li>Responsive design with CSS Grid and Flexbox</li>
      </ul>
      
      <h3>Implementation Process</h3>
      <p>Development followed this workflow:</p>
      <ol>
        <li>Component architecture planning and wireframing</li>
        <li>Project structure setup and build configuration</li>
        <li>Core component implementation</li>
        <li>Animation and interaction integration</li>
        <li>Performance optimization</li>
        <li>Cross-device testing and bug fixing</li>
      </ol>
      
      <h3>Key Features</h3>
      <p>The implementation includes:</p>
      <ul>
        <li>Interactive homepage with particle system</li>
        <li>Project showcase with image galleries</li>
        <li>Resume section with PDF export</li>
        <li>Blog component for internship documentation</li>
        <li>Contact form with validation</li>
        <li>Animated page transitions</li>
      </ul>
      
      <h3>Technical Challenges</h3>
      <p>Development required solving:</p>
      <ul>
        <li>Animation performance optimization</li>
        <li>Browser compatibility for CSS features</li>
        <li>Responsive layout implementation</li>
        <li>Asset loading and optimization</li>
      </ul>
      
      <h3>Technical Skills Applied</h3>
      <p>This project utilized:</p>
      <ul>
        <li>React component architecture</li>
        <li>TypeScript for type safety</li>
        <li>CSS-in-JS patterns</li>
        <li>Performance optimization techniques</li>
        <li>Modern JavaScript features</li>
      </ul>
    `
  },
  {
    id: 5,
    title: 'MADR Technical Documentation Implementation',
    category: 'Documentation',
    date: 'April 5, 2025',
    image: '/images/blog-5.jpg',
    excerpt: 'Creating standardized technical documentation using the MADR methodology for system design decisions.',
    featured: false,
    content: `
      <p>At OTis Philippines Inc., I developed technical documentation using Architecture Decision Records (ADRs) for multiple projects, creating standardized records of technical decisions.</p>
      
      <h3>Documentation Goals</h3>
      <p>The documentation aimed to:</p>
      <ul>
        <li>Record technical decisions with reasoning</li>
        <li>Document alternative options considered</li>
        <li>Preserve context and constraints for decisions</li>
        <li>Enable knowledge transfer between teams</li>
        <li>Standardize decision documentation format</li>
      </ul>
      
      <h3>MADR Implementation</h3>
      <p>The documentation used Markdown Architecture Decision Records with:</p>
      <ul>
        <li>Structured format with standardized sections</li>
        <li>Problem statements and decision outcomes</li>
        <li>Option analysis with pros/cons tables</li>
        <li>Decision drivers and consequence documentation</li>
        <li>Version control for change tracking</li>
      </ul>
      
      <h3>Documented Technical Decisions</h3>
      <p>Projects documented included:</p>
      <ul>
        <li>Payment system integration architecture</li>
        <li>Language detection technology selection</li>
        <li>Authentication system design</li>
        <li>Data storage architecture</li>
      </ul>
      
      <h3>Documentation Process</h3>
      <p>Each ADR followed this workflow:</p>
      <ol>
        <li>Requirement gathering from stakeholders</li>
        <li>Technical option research</li>
        <li>Option documentation with pros/cons analysis</li>
        <li>Sequence diagram creation for visual explanation</li>
        <li>Technical review facilitation</li>
        <li>Final documentation with implementation details</li>
      </ol>
      
      <h3>Business Impact</h3>
      <p>The documentation provided:</p>
      <ul>
        <li>Technical knowledge base for current and future development</li>
        <li>Structured framework for technical discussions</li>
        <li>Transparency for cross-team decision understanding</li>
        <li>Reduced decision revisiting and redundant analysis</li>
        <li>Technical governance foundation</li>
      </ul>
      
      <h3>Technical Skills Applied</h3>
      <p>This work involved:</p>
      <ul>
        <li>Technical writing and documentation</li>
        <li>System architecture analysis</li>
        <li>Technical alternative comparison</li>
        <li>Technical diagramming</li>
        <li>Technical stakeholder communication</li>
      </ul>
    `
  }
];

const categories = ['All', ...Array.from(new Set(blogPosts.map(post => post.category)))];

const Blog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);
  const [selectedPost, setSelectedPost] = useState<typeof blogPosts[0] | null>(null);
  
  // Mobile navigation states
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isMobileNavFixed, setIsMobileNavFixed] = useState(false);
  const [mobileNavScrollProgress, setMobileNavScrollProgress] = useState(0);
  const blogTitleRef = useRef<HTMLDivElement>(null);
  
  const updateCategory = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);
  
  // Mobile navigation logic
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    const handleScroll = () => {
      if (isMobile && blogTitleRef.current) {
        const headerBottom = blogTitleRef.current.offsetTop + blogTitleRef.current.offsetHeight;
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
  
  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredPosts(blogPosts);
    } else {
      setFilteredPosts(blogPosts.filter(post => post.category === selectedCategory));
    }
  }, [selectedCategory]);
  
  const featuredPost = useMemo(() => blogPosts.find(post => post.featured), []);
  
  const openPostDetail = useCallback((post: typeof blogPosts[0]) => {
    setSelectedPost(post);
    document.body.style.overflow = 'hidden';
  }, []);
  
  const closePostDetail = useCallback(() => {
    setSelectedPost(null);
    document.body.style.overflow = 'auto';
  }, []);
  
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closePostDetail();
    }
  }, [closePostDetail]);
  
  return (
    <PageContainer>
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
      
      <ContentContainer>
        <motion.div
          ref={blogTitleRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <ProgressHeader 
            title="My Internship Journey" 
            sectionId="blog" 
            subtitle="Documenting my experiences, challenges and learnings during my internship at OTis Philippines Inc."
          />
        </motion.div>
        
        {/* Mobile navigation */}
        {isMobile && (
          <MobileNavigation isFixed={isMobileNavFixed} scrollProgress={mobileNavScrollProgress}>
            {categories.map(category => (
              <MobileNavButton
                key={category}
                active={selectedCategory === category}
                onClick={() => updateCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category === 'All' ? '📋' : 
                 category === 'Research' ? '🔬' : 
                 category === 'Development' ? '💻' : 
                 category === 'Documentation' ? '📝' : '📦'} {category}
              </MobileNavButton>
            ))}
          </MobileNavigation>
        )}
        
        <CategoryFilter>
          {categories.map(category => (
            <CategoryButton 
              key={category}
              active={selectedCategory === category}
              onClick={() => updateCategory(category)}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </CategoryButton>
          ))}
        </CategoryFilter>
        
        {featuredPost && selectedCategory === 'All' && (
          <FeaturedBlog
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => openPostDetail(featuredPost)}
          >
            <FeaturedImageWrapper>
              <BlogImage
                src={featuredPost.image}
                alt={featuredPost.title}
              />
              <ImageOverlay />
            </FeaturedImageWrapper>
            <FeaturedContent>
              <FeaturedBadge>Featured</FeaturedBadge>
              <BlogCategory>{featuredPost.category}</BlogCategory>
              <BlogPostTitle>{featuredPost.title}</BlogPostTitle>
              <BlogExcerpt>{featuredPost.excerpt}</BlogExcerpt>
              <MetaInfo>
                <DateInfo>
                  <span role="img" aria-label="calendar">📅</span> {featuredPost.date}
                </DateInfo>
              </MetaInfo>
            </FeaturedContent>
          </FeaturedBlog>
        )}
        
        <BlogGrid>
          {filteredPosts.length > 0 ? filteredPosts
            .filter(post => !post.featured || selectedCategory !== 'All')
            .map((post, index) => (
              <BlogCard
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => openPostDetail(post)}
              >
                <ImageWrapper>
                  <BlogImage
                    src={post.image}
                    alt={post.title}
                  />
                  <ImageOverlay />
                </ImageWrapper>
                <BlogContent>
                  <BlogCategory>{post.category}</BlogCategory>
                  <BlogPostTitle>{post.title}</BlogPostTitle>
                  <BlogExcerpt>{post.excerpt}</BlogExcerpt>
                  <MetaInfo>
                    <DateInfo>
                      <span role="img" aria-label="calendar">📅</span> {post.date}
                    </DateInfo>
                  </MetaInfo>
                </BlogContent>
              </BlogCard>
            )) : (
            <NoResults>No posts found in this category</NoResults>
          )}
        </BlogGrid>
      </ContentContainer>
      
      <AnimatePresence>
        {selectedPost && (
          <ModalBackdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
          >
            <ModalCard
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
            >
              <CloseButton onClick={closePostDetail}>
                ✕
              </CloseButton>
              
              <PostHeader>
                <BlogCategory>{selectedPost.category}</BlogCategory>
                <PostTitle>{selectedPost.title}</PostTitle>
                <PostMeta>
                  <DateInfo>
                    <span role="img" aria-label="calendar">📅</span> {selectedPost.date}
                  </DateInfo>
                </PostMeta>
              </PostHeader>
              
              <PostImageContainer>
                <PostImage src={selectedPost.image} alt={selectedPost.title} />
              </PostImageContainer>
              
              <PostContent dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
            </ModalCard>
          </ModalBackdrop>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

export default Blog; 