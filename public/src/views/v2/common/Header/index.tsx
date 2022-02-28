import React from 'react';
import styled from 'styled-components';
import MessagingModule from './MessagingModule';
import NotificationModule from './NotificationModule';

const Container = styled.div`
  height: 5.5rem;
  padding: 1.5rem 1.5rem;
  gap: 1rem;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const LogoText = styled.span`
  font-size: 2rem;
  color: #22b995;
  text-transform: uppercase;
  font-weight: 700;
`;

const HomeHeader: React.FunctionComponent<Record<string, unknown>> = () => {
  return (
    <Container>
      <LogoText>Sportfolios</LogoText>
      <div style={{ flex: 1 }} />
      <NotificationModule />
      <MessagingModule />
    </Container>
  );
};

export default HomeHeader;
