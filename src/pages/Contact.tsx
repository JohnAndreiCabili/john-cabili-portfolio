import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const simpleTransition = { duration: 0.2 };
const simpleSlideFade = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
  transition: simpleTransition
};

// Maximum number of messages to render
const MAX_MESSAGES = 20;

// Floating chat widget container
const ChatWidget = styled(motion.div)`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1001;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 12px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  
  @media (max-width: 768px) {
    bottom: 20px;
    right: 20px;
    gap: 10px;
  }
`;

const ChatButton = styled(motion.button)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--gradient-blue);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 8px 30px rgba(0, 113, 227, 0.3);
  font-size: 24px;
  position: relative;
  outline: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: 0 10px 40px rgba(0, 113, 227, 0.4);
  }
  
  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
    font-size: 18px;
  }
  
  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
`;

const ScrollToTopButton = styled(motion.button)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(0, 113, 227, 0.9);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  font-size: 24px;
  outline: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  
  &:hover {
    background: var(--primary-color);
    transform: translateY(-3px);
  }
  
  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
    font-size: 18px;
  }
  
  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
`;

const StatusIndicator = styled.div`
  position: absolute;
  width: 14px;
  height: 14px;
  background-color: #65B741;
  border-radius: 50%;
  top: 5px;
  right: 5px;
  border: 2px solid white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const ChatContainer = styled(motion.div)`
  width: 360px;
  height: 600px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.15);
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.8);
  position: absolute;
  bottom: 60px;
  right: 0;

  @media (max-width: 480px) {
    width: 300px;
    height: 500px;
    bottom: 50px;
  }
`;

const ChatTopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  background: rgba(255, 255, 255, 0.9);
`;

const BotInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BotName = styled.div`
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.3px;
  background: linear-gradient(to right, #0071e3, #64acff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-right: 5px;
`;

const BotStatus = styled.div`
  font-size: 12px;
  color: #65B741;
  display: flex;
  align-items: center;
`;

const StatusDot = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #65B741;
  border-radius: 50%;
  margin-right: 8px;
  box-shadow: 0 0 5px rgba(101, 183, 65, 0.5);
`;

const ChatTopActions = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--secondary-color);
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: var(--primary-color);
  }
`;

const ResetButton = styled(IconButton)`
  color: var(--secondary-color);
  position: relative;
  
  &:hover::before {
    content: 'Reset chat';
    position: absolute;
    bottom: -30px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 5px 8px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
  }
`;

const ChatMessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: rgba(248, 250, 252, 0.5);
  
  &::-webkit-scrollbar {
    width: 5px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 10px;
  }
  
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.1) transparent;
`;

const Message = styled(motion.div)<{ isBot?: boolean }>`
  max-width: 85%;
  padding: 12px 16px;
  border-radius: ${props => props.isBot ? '20px 20px 20px 4px' : '20px 20px 4px 20px'};
  background: ${props => props.isBot 
    ? 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ef 100%)' 
    : 'linear-gradient(135deg, #0062E6 0%, #33A5FF 100%)'};
  color: ${props => props.isBot ? 'var(--text-dark)' : 'white'};
  font-size: 14px;
  line-height: 1.5;
  box-shadow: 0 2px 10px rgba(0, 0, 0, ${props => props.isBot ? '0.05' : '0.1'});
  align-self: ${props => props.isBot ? 'flex-start' : 'flex-end'};
  position: relative;
  white-space: pre-wrap;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 15px rgba(0, 0, 0, ${props => props.isBot ? '0.08' : '0.15'});
    transform: translateY(-2px);
  }
`;

const MessageTime = styled.div`
  font-size: 10px;
  color: ${props => props.color || 'rgba(0, 0, 0, 0.4)'};
  margin-top: 6px;
  text-align: right;
  opacity: 0.8;
`;

const MessageGroup = styled.div<{ isBot?: boolean }>`
  display: flex;
  flex-direction: column;
  max-width: 85%;
  align-self: ${props => props.isBot ? 'flex-start' : 'flex-end'};
`;

const BotTypingIndicator = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 14px;
  background: white;
  border-radius: 18px;
  width: fit-content;
  margin-top: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const TypingDot = styled(motion.div)`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--primary-color);
`;

// Chat input container optimization - prevent re-renders
const ChatInputContainer = memo(styled.div`
  padding: 10px 16px 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  background: white;
`);

const ChatInput = styled.input`
  flex: 1;
  border: none;
  background: rgba(248, 250, 252, 0.8);
  padding: 14px 18px;
  border-radius: 20px;
  font-size: 14px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    box-shadow: 0 2px 10px rgba(0, 113, 227, 0.15);
    background: rgba(248, 250, 252, 1);
  }
`;

const InputActions = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const SendButton = styled(motion.button)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--gradient-blue);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 3px 10px rgba(0, 113, 227, 0.2);
  font-size: 18px;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Welcome tooltip
const WelcomeTooltip = styled(motion.div)`
  position: absolute;
  bottom: 75px;
  right: 0;
  background: white;
  padding: 14px 18px;
  border-radius: 18px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.1);
  max-width: 240px;
  font-size: 14px;
  color: var(--text-dark);
  line-height: 1.5;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    right: 24px;
    width: 16px;
    height: 16px;
    background: white;
    transform: rotate(45deg);
    border-radius: 2px;
  }
`;

// Quick reply options
const QuickRepliesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
`;

const QuickReplyButton = styled(motion.button)`
  background: white;
  border: 1px solid rgba(0, 113, 227, 0.1);
  border-radius: 18px;
  padding: 10px 14px;
  font-size: 13px;
  color: var(--primary-color);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
  
  &:hover {
    background: rgba(0, 113, 227, 0.08);
    border-color: var(--primary-color);
    box-shadow: 0 2px 8px rgba(0, 113, 227, 0.1);
    transform: translateY(-1px);
  }
`;

// Main Contact component with memoization
const Contact: React.FC<{ openChat?: boolean }> = memo(({ openChat = false }) => {
  const [messages, setMessages] = useState<{ text: string; isBot: boolean; id: number; timestamp?: Date }[]>([
    { 
      text: "Hi there! I'm JAC, John's virtual assistant. How can I help you today?", 
      isBot: true, 
      id: 1,
      timestamp: new Date() 
    }
  ]);
  
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(openChat);
  const [showWelcomeTooltip, setShowWelcomeTooltip] = useState(false);
  const [currentContextPrompts, setCurrentContextPrompts] = useState<{ text: string, response: string }[]>([]);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const messageSound = useRef<HTMLAudioElement | null>(null);
  
  // Memoize initial quick replies to prevent recreation
  const initialQuickReplies = useMemo(() => [
    { text: "Looking for John's resume", response: "You can view John's detailed resume on the Resume page. Would you like me to take you there?" },
    { text: "Just saying hello!", response: "Hello there! Nice to meet you. I'm JAC, John's digital assistant. Is there anything specific you'd like to know about John or his work?" },
    { text: "Interested in services", response: "John specializes in: \n\n• Front-end development (React, TypeScript)\n• Web Design\n• Full-stack solutions\n• Mobile app development\n\nWhich service are you interested in?" },
    { text: "We'd like to hire John", response: "Thank you for your interest! John is currently open to new opportunities. Would you like me to help you contact him?" }
  ], []);
  
  const [quickReplies, setQuickReplies] = useState(initialQuickReplies);
  
  // Memoize context quick replies to avoid recreating on every render
  const contextQuickReplies = useMemo(() => ({
    resume: [
      { text: "Yes, show me the resume", response: "Opening John's resume page for you now..." },
      { text: "Tell me about his skills first", response: "John specializes in React, TypeScript, Node.js, and Web Design. He's also familiar with mobile development and machine learning." },
      { text: "I'd like to contact him", response: "I'll open your email client to contact John directly. Would you like to discuss a project or opportunity?" }
    ],
    hire: [
      { text: "Send an email about a job", response: "Opening your email client to contact John about a job opportunity..." },
      { text: "Discuss a project", response: "Opening your email client to discuss a potential project with John..." },
      { text: "Tell me more about his work", response: "John is a Front-End Developer from Manila with over 3 years of experience in React and modern JavaScript frameworks. Would you like to see specific projects?" },
      { text: "Compose email", response: "I'll open your email with a blank template so you can compose your own message..." }
    ],
    services: [
      { text: "Need a website built", response: "John has extensive experience building modern, responsive websites with React. Would you like to discuss your project with him?" },
      { text: "Interested in Web Design", response: "John creates intuitive and appealing web designs. Would you like to contact him about your design project?" },
      { text: "Mobile app development", response: "John develops cross-platform mobile applications using React Native. Would you like to email him about your app idea?" },
      { text: "Compose email", response: "I'll open your email with a blank template so you can compose your own message..." }
    ],
    contact: [
      { text: "Job opportunity", response: "Opening your email client to contact John about a job opportunity..." },
      { text: "Project collaboration", response: "Opening your email client to discuss a potential project with John..." },
      { text: "General inquiry", response: "Opening your email client for a general inquiry to John..." },
      { text: "Compose email", response: "I'll open your email with a blank template so you can compose your own message..." }
    ],
    hello: [
      { text: "Tell me about John", response: "John is a Front-End Developer from Manila with over 3 years of experience in React and modern JavaScript frameworks." },
      { text: "What projects has he worked on?", response: "John has worked on various projects including web applications, mobile apps, and Web Design. Would you like to see some examples?" },
      { text: "What services does he offer?", response: "John offers web development, Web Design, mobile app development, and full-stack solutions. Which are you interested in?" }
    ]
  }), []);
  
  // Memoize email templates to avoid recreating on every render
  const emailTemplates = useMemo(() => ({
    job: {
      subject: "Job Opportunity for John Andrei Cabili",
      body: "Hi John,\n\nI'm reaching out about a job opportunity that I believe matches your skills and experience.\n\n[Please include details about the position, company, and requirements]\n\nLooking forward to discussing this opportunity with you.\n\nBest regards,"
    },
    project: {
      subject: "Project Collaboration with John Andrei Cabili",
      body: "Hi John,\n\nI'm interested in collaborating with you on a project.\n\n[Please include project details, timeline, and objectives]\n\nWould love to discuss this further.\n\nBest regards,"
    },
    website: {
      subject: "Website Development Inquiry",
      body: "Hi John,\n\nI'm interested in your web development services.\n\n[Please include details about your website needs, timeline, and specific requirements]\n\nLooking forward to your response.\n\nBest regards,"
    },
    uiux: {
      subject: "UI/UX Design Services Inquiry",
      body: "Hi John,\n\nI'm interested in your UI/UX design services.\n\n[Please include details about your design needs, timeline, and specific requirements]\n\nLooking forward to your response.\n\nBest regards,"
    },
    mobile: {
      subject: "Mobile App Development Inquiry",
      body: "Hi John,\n\nI'm interested in your mobile app development services.\n\n[Please include details about your app concept, platform preferences, and specific requirements]\n\nLooking forward to your response.\n\nBest regards,"
    },
    general: {
      subject: "Inquiry for John Andrei Cabili",
      body: "Hi John,\n\nI'm reaching out regarding:\n\n[Your message here]\n\nLooking forward to your response.\n\nBest regards,"
    },
    blank: {
      subject: "",
      body: ""
    }
  }), []);
  
  // Memoize bot responses to avoid recreating on every render
  const botResponses = useMemo(() => ({
    default: "I'm not sure I understand. Could you tell me more about what you're looking for?",
    greeting: ["Hello there! How can I help you today?", "Hi! Nice to meet you. What brings you to John's portfolio?", "Hey! I'm here to help. What would you like to know about John's work?"],
    about: "John is a Front-End Developer from Manila with over 3 years of experience in React and modern JavaScript frameworks. He specializes in creating responsive, user-friendly web applications.",
    skills: "John specializes in React, TypeScript, Node.js, and Web Design. He's also experienced with mobile development and machine learning. What specific skills are you interested in?",
    contact: "Would you like me to open your email client to contact John directly? I can help you format an appropriate message.",
    project: "John has worked on various projects including web applications, mobile apps, and Web Design. Would you like to see some examples or discuss a potential collaboration?",
    thanks: ["You're welcome! Let me know if you need anything else.", "No problem at all! Feel free to reach out anytime.", "Glad I could help! Is there anything else you'd like to know?"],
    hire: "Thank you for your interest in working with John! He's currently open to new opportunities. Would you like to discuss a job position or project collaboration?",
    resume: "You can view John's comprehensive resume on the Resume page. Would you like me to redirect you there now?",
    services: "John offers several services including:\n\n• Front-end development (React, TypeScript)\n• Web Design\n• Full-stack solutions\n• Mobile app development\n\nWhich service are you most interested in?",
    email: "I'll open your email client to contact John directly. Please include details about what you need help with in your message."
  }), []);
  
  // Memoize visible messages to reduce rendering cost
  const visibleMessages = useMemo(() => {
    return messages.length > MAX_MESSAGES 
      ? messages.slice(messages.length - MAX_MESSAGES) 
      : messages;
  }, [messages]);
  

  const playMessageSound = useCallback(() => {
    if (soundEnabled && messageSound.current) {
      messageSound.current.currentTime = 0;
      messageSound.current.play().catch(e => console.log("Audio play error:", e));
    }
  }, [soundEnabled]);
  

  const toggleSoundEnabled = useCallback(() => {
    setSoundEnabled(!soundEnabled);
  }, [soundEnabled]);
  

  const formatTime = useCallback((date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, []);
  

  const openEmail = useCallback((templateType: keyof typeof emailTemplates) => {
    const template = emailTemplates[templateType];
    const mailtoLink = `mailto:johnandreicabili@gmail.com?subject=${encodeURIComponent(template.subject)}&body=${encodeURIComponent(template.body)}`;
    window.open(mailtoLink);
  }, [emailTemplates]);
  

  const getBotResponse = useCallback((text: string): string => {
    const lowerText = text.toLowerCase();
    
    if (/hello|hi|hey|greetings/i.test(lowerText)) {
      setCurrentContextPrompts(contextQuickReplies.hello);
      return botResponses.greeting[Math.floor(Math.random() * botResponses.greeting.length)];
    } else if (/about|who|john/i.test(lowerText)) {
      setCurrentContextPrompts(contextQuickReplies.hello);
      return botResponses.about;
    } else if (/skill|can do|experience|expertise/i.test(lowerText)) {
      setCurrentContextPrompts(contextQuickReplies.hire);
      return botResponses.skills;
    } else if (/contact|email|reach/i.test(lowerText)) {
      setCurrentContextPrompts(contextQuickReplies.contact);
      return botResponses.contact;
    } else if (/send.*email.*job/i.test(lowerText) || /job opportunity/i.test(lowerText)) {
      setTimeout(() => {
        openEmail('job');
      }, 1000);
      return "Opening your email client to contact John about a job opportunity...";
    } else if (/send.*email.*project/i.test(lowerText) || /discuss.*project/i.test(lowerText) || /project collaboration/i.test(lowerText)) {
      setTimeout(() => {
        openEmail('project');
      }, 1000);
      return "Opening your email client to discuss a potential project with John...";
    } else if (/general inquiry/i.test(lowerText)) {
      setTimeout(() => {
        openEmail('general');
      }, 1000);
      return "Opening your email client for a general inquiry to John...";
    } else if (/website/i.test(lowerText) && /built|develop|create|make/i.test(lowerText)) {
      setTimeout(() => {
        openEmail('website');
      }, 1000);
      return "Opening your email client to discuss website development with John...";
    } else if (/mobile app/i.test(lowerText) && /develop|create|build/i.test(lowerText)) {
      setTimeout(() => {
        openEmail('mobile');
      }, 1000);
      return "Opening your email client to discuss mobile app development with John...";
    } else if (/web design/i.test(lowerText) && /interested|need|want/i.test(lowerText)) {
      setTimeout(() => {
        openEmail('uiux');
      }, 1000);
      return "Opening your email client to discuss Web Design with John...";
    } else if (/project|work|portfolio/i.test(lowerText)) {
      setCurrentContextPrompts(contextQuickReplies.services);
      return botResponses.project;
    } else if (/thanks|thank you|appreciate/i.test(lowerText)) {
      setCurrentContextPrompts(initialQuickReplies);
      return botResponses.thanks[Math.floor(Math.random() * botResponses.thanks.length)];
    } else if (/hire|job|opportunity|work with/i.test(lowerText)) {
      setCurrentContextPrompts(contextQuickReplies.hire);
      return botResponses.hire;
    } else if (/resume|cv/i.test(lowerText) || /yes.*resume/i.test(lowerText) || /show.*resume/i.test(lowerText)) {
      setTimeout(() => {
        window.location.href = '/resume';
      }, 1000);
      return "I'm redirecting you to John's resume page where you can view his complete professional background.";
    } else if (/service|offer|provide/i.test(lowerText)) {
      setCurrentContextPrompts(contextQuickReplies.services);
      return botResponses.services;
    } else if (/website|web app|web application/i.test(lowerText)) {
      setCurrentContextPrompts(contextQuickReplies.services);
      return "John has extensive experience building modern, responsive websites with React. Would you like to discuss your project with him directly?";
    } else if (/mobile|app|ios|android/i.test(lowerText)) {
      setCurrentContextPrompts(contextQuickReplies.services);
      return "John develops cross-platform mobile applications using React Native. Would you like to email him about your mobile app idea?";
    } else if (/web design|interface/i.test(lowerText)) {
      setCurrentContextPrompts(contextQuickReplies.services);
      return "John creates intuitive and appealing web designs. Would you like to see some examples or contact him about your project?";
    }
    
    return botResponses.default;
  }, [botResponses, contextQuickReplies, initialQuickReplies, openEmail]);

  const handleQuickReply = useCallback((reply: { text: string, response: string }) => {
    const userMessage = {
      text: reply.text,
      isBot: false,
      id: messages.length + 1,
      timestamp: new Date()
    };
    
    let updatedMessages = [...messages, userMessage];
    if (updatedMessages.length > MAX_MESSAGES) {
      updatedMessages = updatedMessages.slice(updatedMessages.length - MAX_MESSAGES);
    }
    
    setMessages(updatedMessages);
    
    setIsTyping(true);
    
    playMessageSound();
    
    const isResumeRequest = /resume|cv/i.test(reply.text);
    
    setTimeout(() => {
      const botResponse = {
        text: getBotResponse(reply.text),
        isBot: true,
        id: updatedMessages.length + 1,
        timestamp: new Date()
      };
      
      let newMessages = [...updatedMessages, botResponse];
      if (newMessages.length > MAX_MESSAGES) {
        newMessages = newMessages.slice(newMessages.length - MAX_MESSAGES);
      }
      
      setMessages(newMessages);
      setIsTyping(false);
      
      playMessageSound();
      
      if (isResumeRequest && /show|see|view|yes/i.test(reply.text)) {
        setTimeout(() => {
          window.location.href = '/resume';
        }, 1500);
      }
    }, 1000 + Math.random() * 500);
  }, [messages, getBotResponse, playMessageSound]);

  const handleQuickReplyClick = useCallback((reply: { text: string, response: string }) => {
    // Handle specific quick replies directly
    if (reply.text === "Send an email about a job") {
      openEmail('job');
    } else if (reply.text === "Discuss a project") {
      openEmail('project');
    } else if (reply.text === "Job opportunity") {
      openEmail('job');
    } else if (reply.text === "Project collaboration") {
      openEmail('project');
    } else if (reply.text === "General inquiry") {
      openEmail('general');
    } else if (reply.text === "Need a website built") {
      openEmail('website');
    } else if (reply.text === "Interested in Web Design") {
      openEmail('uiux');
    } else if (reply.text === "Mobile app development") {
      openEmail('mobile');
    } else if (reply.text === "Yes, show me the resume") {
      setTimeout(() => {
        window.location.href = '/resume';
      }, 1000);
    } else {
      handleQuickReply(reply);
    }
  }, [openEmail, handleQuickReply]);

  // Optimize send message function with useCallback
  const handleSendMessage = useCallback(() => {
    if (inputText.trim() === '') return;
    
    const userMessage = {
      text: inputText,
      isBot: false,
      id: messages.length + 1,
      timestamp: new Date()
    };
    
    let updatedMessages = [...messages, userMessage];
    if (updatedMessages.length > MAX_MESSAGES) {
      updatedMessages = updatedMessages.slice(updatedMessages.length - MAX_MESSAGES);
    }
    
    setMessages(updatedMessages);
    setInputText('');
    
    setIsTyping(true);
    
    playMessageSound();

    const isResumeRequest = /resume|cv/i.test(inputText);
    
    setTimeout(() => {
      const botResponse = {
        text: getBotResponse(inputText),
        isBot: true,
        id: updatedMessages.length + 1,
        timestamp: new Date()
      };
      
      let newMessages = [...updatedMessages, botResponse];
      if (newMessages.length > MAX_MESSAGES) {
        newMessages = newMessages.slice(newMessages.length - MAX_MESSAGES);
      }
      
      setMessages(newMessages);
      setIsTyping(false);
      
      playMessageSound();
      
      if (isResumeRequest && /show|see|view|yes/i.test(inputText)) {
        setTimeout(() => {
          window.location.href = '/resume';
        }, 1500);
      }
    }, 1000 + Math.random() * 500);
  }, [inputText, messages, getBotResponse, playMessageSound]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const toggleChat = useCallback(() => {
    console.log("Toggle chat called, current state:", isChatOpen);
    setIsChatOpen(prevState => !prevState);
    setShowWelcomeTooltip(false);
    
    // If opening the chat
    if (!isChatOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    } else {
      // If closing the chat, ensure elements are blurred
      setTimeout(() => {
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement) {
          activeElement.blur();
        }
      }, 50);
    }
  }, [isChatOpen]);

  const handleResetChat = useCallback(() => {
    setMessages([
      { 
        text: "Hi there! I'm JAC, John's virtual assistant. How can I help you today?", 
        isBot: true, 
        id: 1,
        timestamp: new Date() 
      }
    ]);
    
    setCurrentContextPrompts([]);
    
    setQuickReplies(initialQuickReplies);
    
    setInputText("");
    
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 800);
  }, [initialQuickReplies]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isChatOpen) {
        setShowWelcomeTooltip(true);
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [isChatOpen]);
  
  // Listen for openChatWidget event
  useEffect(() => {
    const handleOpenChatWidget = () => {
      // If chat is already open, don't do anything to prevent multiple opens
      if (isChatOpen) return;
      
      setIsChatOpen(true);
      setShowWelcomeTooltip(false);
      
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    };
    
    window.addEventListener('openChatWidget', handleOpenChatWidget);
    return () => window.removeEventListener('openChatWidget', handleOpenChatWidget);
  }, [isChatOpen]);
  
  useEffect(() => {
    if (openChat && !isChatOpen) {
      setIsChatOpen(true);
    }
  }, [openChat, isChatOpen]);

  useEffect(() => {
    messageSound.current = new Audio('https://assets.mixkit.co/active_storage/sfx/933/933-preview.mp3');
    messageSound.current.volume = 0.6;
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Get the actual toggle button element
      const toggleButton = document.querySelector(".chat-toggle-button");
      const target = event.target as Node;
      
      // Check if the click is outside the chat container AND not on the toggle button
      if (isChatOpen && 
          chatContainerRef.current && 
          !chatContainerRef.current.contains(target) && 
          toggleButton !== target &&
          !toggleButton?.contains(target)) {
        console.log("Closing chat from outside click");
        setIsChatOpen(false);
        setShowWelcomeTooltip(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isChatOpen]);

  // Show scroll to top button when user scrolls down
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const toggleScrollToTop = () => {
      clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        const scrollPosition = window.pageYOffset;
        const currentState = showScrollToTop;
        
        // Add hysteresis to prevent rapid toggling
        if (currentState && scrollPosition < 400) {
          setShowScrollToTop(false);
        } else if (!currentState && scrollPosition > 500) {
          setShowScrollToTop(true);
        }
        
        // Hide welcome tooltip when scrolling down
        if (scrollPosition > 100) {
          setShowWelcomeTooltip(false);
        }
      }, 150); // Increased debounce time for more stability
    };
    
    window.addEventListener('scroll', toggleScrollToTop, { passive: true });
    return () => {
      window.removeEventListener('scroll', toggleScrollToTop);
      clearTimeout(timeoutId);
    };
  }, [showScrollToTop]);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <ChatWidget>
      <AnimatePresence>
        {isChatOpen && (
          <ChatContainer
            ref={chatContainerRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <ChatTopBar>
              <BotInfo>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <StatusDot />
                  <BotName>JAC</BotName>
                </div>
              </BotInfo>
              <ChatTopActions>
                <IconButton 
                  title={soundEnabled ? "Mute sound" : "Unmute sound"}
                  onClick={toggleSoundEnabled}
                >
                  {soundEnabled ? "🔊" : "🔇"}
                </IconButton>
                <ResetButton 
                  title="Reset chat"
                  onClick={handleResetChat}
                >↺</ResetButton>
              </ChatTopActions>
            </ChatTopBar>
            
            <ChatMessagesContainer ref={chatMessagesRef}>
              <AnimatePresence initial={false}>
                {visibleMessages.map((message) => (
                  <MessageGroup 
                    key={message.id} 
                    isBot={message.isBot}
                  >
                    <Message
                      isBot={message.isBot}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {message.text}
                      {message.timestamp && (
                        <MessageTime color={message.isBot ? undefined : "rgba(255, 255, 255, 0.7)"}>
                          {formatTime(message.timestamp)}
                        </MessageTime>
                      )}
                    </Message>
                  </MessageGroup>
                ))}
              </AnimatePresence>
              
              {isTyping && (
                <BotTypingIndicator
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <TypingDot animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, repeatType: 'loop', delay: 0 }} />
                  <TypingDot animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, repeatType: 'loop', delay: 0.2 }} />
                  <TypingDot animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, repeatType: 'loop', delay: 0.4 }} />
                </BotTypingIndicator>
              )}
              
              <div ref={messagesEndRef} />
            </ChatMessagesContainer>
            
            <ChatInputContainer>
              <QuickRepliesContainer>
                {(currentContextPrompts.length > 0 ? currentContextPrompts : quickReplies).map((reply, index) => (
                  <QuickReplyButton
                    key={index}
                    onClick={() => handleQuickReplyClick(reply)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {reply.text}
                  </QuickReplyButton>
                ))}
              </QuickRepliesContainer>
              
              <InputActions>
                <ChatInput
                  ref={inputRef}
                  type="text"
                  placeholder="Type your message here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <SendButton
                  onClick={handleSendMessage}
                  disabled={inputText.trim() === ""}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ↑
                </SendButton>
              </InputActions>
            </ChatInputContainer>
          </ChatContainer>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showWelcomeTooltip && !isChatOpen && !showScrollToTop && (
          <WelcomeTooltip
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
          >
            Need assistance? JAC is here to help.
          </WelcomeTooltip>
        )}
      </AnimatePresence>
      
      <AnimatePresence mode="wait">
        {showScrollToTop ? (
          <ScrollToTopButton
            key="scroll-to-top"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            ↑
          </ScrollToTopButton>
        ) : (
          <ChatButton
            key="chat-button"
            className="chat-toggle-button"
            onClick={(e) => {
              e.stopPropagation(); // Stop event propagation
              console.log("Chat button clicked");
              toggleChat();
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {isChatOpen ? '✕' : '💬'}
            <StatusIndicator />
          </ChatButton>
        )}
      </AnimatePresence>
    </ChatWidget>
  );
});

Contact.displayName = 'Contact';

export default Contact; 