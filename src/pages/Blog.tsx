import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressHeader from '../components/ProgressHeader';

// Styled components
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

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 120px 24px 80px;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    padding: 100px 24px 60px;
  }
`;

const BlogHeader = styled.div`
  margin-bottom: 60px;
  text-align: center;
`;

const BlogTitle = styled.h1`
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 16px;
  background: linear-gradient(to right, #000, #444);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: -0.02em;
  
  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const BlogSubtitle = styled.p`
  font-size: 18px;
  color: #555;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const CategoryFilter = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 40px;
`;

const CategoryButton = styled(motion.button)<{ active: boolean }>`
  padding: 10px 20px;
  border-radius: 30px;
  background: ${props => props.active ? 'linear-gradient(to right, #0071e3, #64acff)' : 'white'};
  color: ${props => props.active ? 'white' : '#555'};
  border: 1px solid ${props => props.active ? 'transparent' : 'rgba(0, 0, 0, 0.1)'};
  font-weight: ${props => props.active ? '600' : '500'};
  font-size: 16px;
  cursor: pointer;
  box-shadow: ${props => props.active ? '0 10px 25px rgba(0, 113, 227, 0.2)' : '0 4px 12px rgba(0, 0, 0, 0.05)'};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 113, 227, 0.15);
  }
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeaturedBlog = styled(motion.div)`
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
  margin-bottom: 40px;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const FeaturedImage = styled.div`
  height: 100%;
  min-height: 400px;
  background-size: cover;
  background-position: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.3));
  }
  
  @media (max-width: 900px) {
    min-height: 300px;
  }
`;

const FeaturedContent = styled.div`
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  @media (max-width: 768px) {
    padding: 30px;
  }
`;

const FeaturedBadge = styled.span`
  background: linear-gradient(to right, #ff9500, #ff2d55);
  color: white;
  font-size: 14px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 20px;
  margin-bottom: 20px;
  display: inline-block;
  box-shadow: 0 5px 15px rgba(255, 45, 85, 0.2);
`;

const BlogCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 50px rgba(0, 113, 227, 0.15);
  }
`;

const BlogImage = styled.div`
  height: 220px;
  background-size: cover;
  background-position: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.3));
  }
`;

const BlogContent = styled.div`
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
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
  margin-bottom: 12px;
  color: var(--text-dark);
  line-height: 1.3;
`;

const BlogExcerpt = styled.p`
  font-size: 16px;
  color: #555;
  line-height: 1.6;
  flex: 1;
  margin-bottom: 20px;
`;

const MetaInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #888;
  margin-top: auto;
`;

const DateInfo = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const ModalContent = styled(motion.div)`
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
  z-index: 10;
`;

const PostHeader = styled.div`
  padding: 40px 40px 30px;
  
  @media (max-width: 768px) {
    padding: 30px 20px 20px;
  }
`;

const PostTitle = styled.h2`
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 20px;
  color: var(--text-dark);
  
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

const PostImage = styled.div`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    height: 250px;
  }
`;

const PostContent = styled.div`
  padding: 0 40px 40px;
  font-size: 18px;
  line-height: 1.8;
  color: #444;
  
  p {
    margin-bottom: 20px;
  }
  
  h3 {
    font-size: 24px;
    font-weight: 700;
    margin: 30px 0 20px;
    color: var(--text-dark);
  }
  
  ul, ol {
    margin-bottom: 20px;
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

const NoResults = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #555;
  font-size: 18px;
`;

// Sample blog posts data
const blogPosts = [
  {
    id: 1,
    title: 'Conducting Research and Evaluating Payment Integration Solutions',
    category: 'Research',
    date: 'March 15, 2024',
    image: '/images/project - veriluxe.jpg',
    excerpt: 'How I researched and evaluated different payment gateways for integration into our enterprise platform.',
    featured: true,
    content: `
      <p>During my internship at OTis Philippines Inc., one of my primary tasks was to research and evaluate various payment integration solutions for our enterprise platform. This project allowed me to develop valuable skills in technical research, comparative analysis, and documentation.</p>
      
      <h3>The Challenge</h3>
      <p>The company needed to implement a secure, reliable payment system that could support multiple currencies and payment methods with minimal transaction fees. As part of the technical team, my role was to:</p>
      <ul>
        <li>Research available payment gateways suitable for enterprise applications</li>
        <li>Evaluate their features, security protocols, and integration complexity</li>
        <li>Document findings in a comprehensive comparison matrix</li>
        <li>Provide recommendations based on specific project requirements</li>
      </ul>
      
      <h3>The Research Process</h3>
      <p>I began by identifying key players in the payment processing industry, focusing on those with robust APIs and documentation. For each provider, I assessed:</p>
      <ul>
        <li>Integration complexity and available SDKs</li>
        <li>Security features and compliance certifications</li>
        <li>Transaction fees and pricing structures</li>
        <li>Support for international payments</li>
        <li>Documentation quality and community support</li>
      </ul>
      
      <p>Throughout this process, I collaborated with senior developers to understand technical requirements and constraints, ensuring my research aligned with the project's objectives.</p>
      
      <h3>Deliverables and Impact</h3>
      <p>My research culminated in a comprehensive report that included:</p>
      <ul>
        <li>A comparison matrix of the top 5 payment gateways</li>
        <li>Detailed integration flowcharts for the top 3 candidates</li>
        <li>Cost analysis for different transaction volumes</li>
        <li>Security assessment and compliance overview</li>
        <li>Implementation recommendations and potential challenges</li>
      </ul>
      
      <p>Based on my findings, the development team proceeded with the most suitable solution, which significantly reduced integration time and helped establish a secure payment processing system.</p>
      
      <h3>Skills Developed</h3>
      <p>This project enhanced my abilities in:</p>
      <ul>
        <li>Technical research and comparative analysis</li>
        <li>Understanding of payment processing systems</li>
        <li>API evaluation and integration planning</li>
        <li>Technical documentation and reporting</li>
        <li>Communication with technical stakeholders</li>
      </ul>
    `
  },
  {
    id: 2,
    title: 'Implementing Test Scripts for Frontend Components',
    category: 'Development',
    date: 'April 2, 2024',
    image: '/images/project - mangosoft.jpg',
    excerpt: 'My experience creating automated tests for React components to improve code quality and reduce bugs.',
    featured: false,
    content: `
      <p>As part of my internship responsibilities, I was tasked with developing test scripts for frontend React components, contributing to the team's goal of improving code quality and reducing regression bugs.</p>
      
      <h3>The Project Context</h3>
      <p>The development team was working on a complex web application with numerous interactive components. With the rapid development pace, ensuring component reliability became crucial. I was assigned to help implement the testing infrastructure for these components.</p>
      
      <h3>My Approach</h3>
      <p>I approached this task methodically:</p>
      <ol>
        <li>First, I familiarized myself with the testing stack (Jest and React Testing Library)</li>
        <li>Identified critical components that needed test coverage based on their complexity and importance</li>
        <li>Studied component behavior to understand expected outcomes under different conditions</li>
        <li>Wrote comprehensive test cases covering: rendering, user interactions, state changes, and edge cases</li>
        <li>Integrated tests with the CI/CD pipeline to automate test execution</li>
      </ol>
      
      <h3>Challenges and Solutions</h3>
      <p>During this process, I encountered several challenges:</p>
      <ul>
        <li><strong>Complex component interactions:</strong> I used mock functions to isolate components and test their behavior independently</li>
        <li><strong>Asynchronous operations:</strong> I implemented proper async/await patterns and waitFor utilities to test components with API calls</li>
        <li><strong>UI animations:</strong> I learned to properly mock animation libraries to enable accurate testing</li>
      </ul>
      
      <h3>Results and Impact</h3>
      <p>My testing contributions led to:</p>
      <ul>
        <li>Test coverage increase from 45% to 78% for critical components</li>
        <li>Detection of 12 previously unidentified bugs</li>
        <li>Easier refactoring process due to comprehensive test cases</li>
        <li>Adoption of test-driven development practices by the team</li>
      </ul>
      
      <h3>Skills Enhanced</h3>
      <p>This experience significantly improved my:</p>
      <ul>
        <li>Understanding of Jest and React Testing Library</li>
        <li>Ability to write effective, maintainable tests</li>
        <li>Debugging skills and attention to detail</li>
        <li>Knowledge of React component lifecycle and behavior</li>
      </ul>
    `
  },
  {
    id: 3,
    title: 'Technical Documentation for Architecture Decision Records',
    category: 'Documentation',
    date: 'April 20, 2024',
    image: '/images/award-6.jpg',
    excerpt: 'Creating comprehensive documentation for architectural decisions and their technical implications.',
    featured: false,
    content: `
      <p>During my internship, I was assigned to assist the senior developers in documenting Architecture Decision Records (ADRs) for critical system components. This experience provided valuable insights into technical decision-making processes and documentation standards.</p>
      
      <h3>What Are ADRs?</h3>
      <p>Architecture Decision Records document important architectural decisions made during the development process. Each ADR includes the context, available options, decision made, and the reasoning behind it. These records serve as a historical reference for future developers and stakeholders.</p>
      
      <h3>My Responsibilities</h3>
      <p>I was responsible for:</p>
      <ul>
        <li>Attending architecture planning meetings to understand decisions</li>
        <li>Interviewing senior developers about their decision rationales</li>
        <li>Researching technical alternatives considered during the decision process</li>
        <li>Drafting clear, concise ADRs using the company's template</li>
        <li>Creating supporting diagrams to illustrate architectural choices</li>
        <li>Revising documents based on stakeholder feedback</li>
      </ul>
      
      <h3>The Documentation Process</h3>
      <p>For each architectural decision, I followed a structured process:</p>
      <ol>
        <li>Gather context and background information from meetings and interviews</li>
        <li>Research all considered alternatives and their pros/cons</li>
        <li>Document the decision in clear, technical language</li>
        <li>Create supporting diagrams using Mermaid and Lucidchart</li>
        <li>Submit for review by the technical team</li>
        <li>Incorporate feedback and finalize the documentation</li>
        <li>Add to the repository of ADRs for future reference</li>
      </ol>
      
      <h3>Impact and Value</h3>
      <p>My documentation work:</p>
      <ul>
        <li>Created a comprehensive record of 8 critical architectural decisions</li>
        <li>Improved knowledge transfer between development teams</li>
        <li>Provided clear context for new team members joining the project</li>
        <li>Established a standard for future architectural documentation</li>
      </ul>
      
      <h3>Skills Developed</h3>
      <p>This experience strengthened my:</p>
      <ul>
        <li>Technical writing and documentation skills</li>
        <li>Understanding of software architecture principles</li>
        <li>Ability to communicate complex technical concepts clearly</li>
        <li>Knowledge of diagram creation for technical documentation</li>
        <li>Collaboration with senior technical stakeholders</li>
      </ul>
    `
  },
  {
    id: 4,
    title: 'Evaluating Natural Language Processing Technologies',
    category: 'Research',
    date: 'May 5, 2024',
    image: '/images/award-2.jpg',
    excerpt: 'Researching and comparing language detection technologies for multilingual feature implementation.',
    featured: false,
    content: `
      <p>As part of my internship responsibilities, I conducted comprehensive research on natural language processing technologies, specifically focusing on language detection capabilities for a multilingual feature implementation.</p>
      
      <h3>Project Background</h3>
      <p>The company was expanding its software to support multiple languages, requiring automatic language detection for user inputs. I was tasked with researching available NLP libraries and services to find the most suitable solution based on accuracy, performance, and integration complexity.</p>
      
      <h3>Research Methodology</h3>
      <p>My approach to this research project involved:</p>
      <ul>
        <li>Identifying key NLP libraries and services with language detection capabilities</li>
        <li>Developing test datasets in multiple languages to evaluate accuracy</li>
        <li>Creating a testing framework to measure performance metrics</li>
        <li>Assessing integration complexity for each solution</li>
        <li>Analyzing cost implications for cloud-based services</li>
      </ul>
      
      <h3>Technologies Evaluated</h3>
      <p>I evaluated several technologies, including:</p>
      <ul>
        <li>Google Cloud Natural Language API</li>
        <li>Azure Text Analytics</li>
        <li>AWS Comprehend</li>
        <li>Open-source libraries like langdetect, fastText, and spaCy</li>
      </ul>
      
      <p>For each option, I conducted thorough testing across 15 different languages with varying text lengths and complexities.</p>
      
      <h3>Findings and Recommendations</h3>
      <p>Key findings from my research included:</p>
      <ul>
        <li>Cloud services provided higher accuracy but at a significant cost for high-volume applications</li>
        <li>Some open-source libraries performed almost as well for common languages</li>
        <li>Performance varied significantly based on text length and language rarity</li>
        <li>Hybrid approaches (using open-source for common languages and cloud services for rare languages) offered the best balance</li>
      </ul>
      
      <p>I provided detailed recommendations based on the project's specific requirements, including cost projections and scalability considerations.</p>
      
      <h3>Skills Enhanced</h3>
      <p>This project strengthened my abilities in:</p>
      <ul>
        <li>Technical research and comparative analysis</li>
        <li>Understanding of NLP technologies and their applications</li>
        <li>Designing and implementing testing frameworks</li>
        <li>Data analysis and interpretation</li>
        <li>Technical reporting and presentation</li>
      </ul>
    `
  },
  {
    id: 5,
    title: 'User Access Management Research and Implementation Planning',
    category: 'Security',
    date: 'May 18, 2024',
    image: '/images/award-3.jpg',
    excerpt: 'Exploring role-based access control systems and developing an implementation strategy.',
    featured: false,
    content: `
      <p>During my internship at OTis Philippines Inc., I was assigned to research user access management systems and develop an implementation strategy for improving the company's role-based access control (RBAC) system.</p>
      
      <h3>Project Objectives</h3>
      <p>The company needed to enhance its existing user permission system to support more granular access controls, improve security, and simplify administration. My task was to research available solutions and create a detailed implementation plan.</p>
      
      <h3>Research Focus</h3>
      <p>My research focused on several key areas:</p>
      <ul>
        <li>RBAC frameworks and best practices</li>
        <li>Authentication standards (OAuth 2.0, OpenID Connect)</li>
        <li>Authorization systems and policy enforcement points</li>
        <li>Audit logging and access tracking</li>
        <li>Implementation complexity and migration considerations</li>
      </ul>
      
      <h3>Methodology and Process</h3>
      <p>I approached this task through:</p>
      <ol>
        <li>Reviewing industry standards and security best practices</li>
        <li>Analyzing the current system's limitations and pain points</li>
        <li>Evaluating third-party solutions vs. custom implementation options</li>
        <li>Interviewing system administrators about their requirements</li>
        <li>Creating a comprehensive comparison of solutions</li>
        <li>Developing a detailed implementation plan</li>
      </ol>
      
      <h3>Key Findings and Recommendations</h3>
      <p>My research led to several important findings:</p>
      <ul>
        <li>The existing system lacked proper separation between authentication and authorization</li>
        <li>Attribute-based access control (ABAC) would provide more flexibility than basic RBAC</li>
        <li>Implementing JWT-based authentication with centralized policy management offered the best balance of security and usability</li>
        <li>A phased migration approach would minimize disruption to existing operations</li>
      </ul>
      
      <p>I developed a comprehensive implementation plan that included:</p>
      <ul>
        <li>Technical architecture design</li>
        <li>Migration strategy with minimal downtime</li>
        <li>Testing and validation procedures</li>
        <li>Administrator training requirements</li>
        <li>Timeline and resource estimates</li>
      </ul>
      
      <h3>Impact and Skills Developed</h3>
      <p>This project allowed me to develop:</p>
      <ul>
        <li>In-depth understanding of authentication and authorization systems</li>
        <li>Security considerations for user access management</li>
        <li>Technical planning and migration strategy development</li>
        <li>Requirements gathering and stakeholder communication</li>
        <li>Documentation and technical presentation skills</li>
      </ul>
    `
  }
];

// Categories derived from blog posts
const categories = ['All', ...new Set(blogPosts.map(post => post.category))];

const Blog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);
  const [selectedPost, setSelectedPost] = useState<typeof blogPosts[0] | null>(null);
  
  // Filter posts when category changes
  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredPosts(blogPosts);
    } else {
      setFilteredPosts(blogPosts.filter(post => post.category === selectedCategory));
    }
  }, [selectedCategory]);
  
  // Featured post
  const featuredPost = blogPosts.find(post => post.featured);
  
  // Open post detail
  const openPostDetail = (post: typeof blogPosts[0]) => {
    setSelectedPost(post);
    document.body.style.overflow = 'hidden';
  };
  
  // Close post detail
  const closePostDetail = () => {
    setSelectedPost(null);
    document.body.style.overflow = 'auto';
  };
  
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
      </BackgroundShapes>
      
      <ContentContainer>
        <ProgressHeader title="Professional Experience" sectionId="blog" />
        
        <BlogHeader>
          <BlogTitle>My Internship Journey</BlogTitle>
          <BlogSubtitle>
            Documenting my experiences, challenges and learnings during my internship at OTis Philippines Inc.
          </BlogSubtitle>
        </BlogHeader>
        
        <CategoryFilter>
          {categories.map(category => (
            <CategoryButton 
              key={category}
              active={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
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
            <FeaturedImage style={{ backgroundImage: `url(${featuredPost.image})` }} />
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
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => openPostDetail(post)}
                whileHover={{ y: -8 }}
              >
                <BlogImage style={{ backgroundImage: `url(${post.image})` }} />
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
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePostDetail}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <CloseButton
                onClick={closePostDetail}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
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
              
              <PostImage style={{ backgroundImage: `url(${selectedPost.image})` }} />
              
              <PostContent dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

export default Blog; 