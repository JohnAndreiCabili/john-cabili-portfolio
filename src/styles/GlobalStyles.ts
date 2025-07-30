import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    /* Core Colors */
    --primary-color: #0071e3;
    --primary-light: #409cff;
    --primary-dark: #0058b9;
    --secondary-color: #86868b;
    --accent-color: #ff2d55;
    
    /* Light Mode */
    --background-light: rgba(255, 255, 255, 0.7);
    --background-dark: rgba(30, 30, 30, 0.7);
    --text-light: #f5f5f7;
    --text-dark: #1d1d1f;
    
    /* Glass Effects */
    --glass-blur: 20px;
    --glass-border: 1px solid rgba(255, 255, 255, 0.2);
    
    /* Gradients */
    --gradient-blue: linear-gradient(135deg, #0071e3, #64acff);
    --gradient-pink: linear-gradient(135deg, #ff2d55, #ff64a6);
    --gradient-purple: linear-gradient(135deg, #5e5ce6, #bf5af2);
    --gradient-orange: linear-gradient(135deg, #ff9f0a, #ffcc00);
    
    /* Shadows */
    --shadow-sm: 0 2px 10px rgba(0, 0, 0, 0.08);
    --shadow-md: 0 5px 20px rgba(0, 0, 0, 0.12);
    --shadow-lg: 0 10px 30px rgba(0, 0, 0, 0.15);
    --shadow-xl: 0 15px 40px rgba(0, 0, 0, 0.2);
    
    /* Animations */
    --transition-fast: 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
    --transition-normal: 400ms cubic-bezier(0.165, 0.84, 0.44, 1);
    --transition-slow: 700ms cubic-bezier(0.19, 1, 0.22, 1);
    
    /* Spacing */
    --space-xs: 4px;
    --space-sm: 8px;
    --space-md: 16px;
    --space-lg: 24px;
    --space-xl: 32px;
    --space-xxl: 48px;
    --space-xxxl: 64px;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    cursor: none !important;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'San Francisco', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: linear-gradient(135deg, #f2f2f2, #e0e0e0);
    color: var(--text-dark);
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* Apple-style Typography */
  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
  }

  h1 {
    font-size: 42px;
    line-height: 1.1;
    letter-spacing: -0.015em;
  }

  h2 {
    font-size: 32px;
    line-height: 1.1;
    letter-spacing: -0.015em;
  }

  h3 {
    font-size: 24px;
    line-height: 1.2;
    letter-spacing: -0.01em;
  }

  p {
    font-size: 16px;
    line-height: 1.5;
    letter-spacing: -0.01em;
  }

  a {
    text-decoration: none;
    color: var(--primary-color);
    transition: color var(--transition-fast);
    &:hover {
      color: var(--primary-light);
    }
  }

  /* Apple-style container */
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 22px;
    
    @media (max-width: 768px) {
      padding: 0 16px;
    }
    
    @media (max-width: 480px) {
      padding: 0 12px;
    }
  }

  /* Responsive typography */
  @media (max-width: 768px) {
    h1 {
      font-size: 32px;
    }
    
    h2 {
      font-size: 28px;
    }

    h3 {
      font-size: 22px;
    }
    
    p {
      font-size: 15px;
    }
  }
  
  @media (max-width: 480px) {
    h1 {
      font-size: 28px;
    }
    
    h2 {
      font-size: 24px;
    }

    h3 {
      font-size: 20px;
    }
    
    p {
      font-size: 14px;
    }
  }

  /* Apple-style animations */
  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
  }

  /* Custom cursor rules for better accessibility */
  @media (pointer: coarse) {
    * {
      cursor: auto !important;
    }
  }

  /* Turn off custom cursor for mobile and tablet - uses default cursor instead */
  @media (max-width: 768px) {
    * {
      cursor: auto !important;
    }
  }
`;

export default GlobalStyle; 