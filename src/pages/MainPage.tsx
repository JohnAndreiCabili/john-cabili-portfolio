import React from 'react';
import styled from 'styled-components';
import Home from './Home';

const Main = styled.main`
  scroll-behavior: smooth;
  position: relative;
`;

const Section = styled.section`
  min-height: 100vh;
  position: relative;
  scroll-margin-top: 80px;
  
  /* Create subtle separator between sections */
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 10%;
    right: 10%;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(0, 113, 227, 0.2), transparent);
  }
`;

const MainPage: React.FC = () => {
  return (
    <Main>
      <Section id="home">
        <Home />
      </Section>
    </Main>
  );
};

export default MainPage; 