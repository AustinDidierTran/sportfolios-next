import React from 'react';
import styled from 'styled-components';
import MainHeader from '../MainLayout/Header';
import MessagingModule from './MessagingModule';
import NotificationModule from './NotificationModule';

const LogoText = styled.span`
  font-size: 2rem;
  color: #22b995;
  text-transform: uppercase;
  font-weight: 700;
`;

const HomeHeader: React.FunctionComponent<Record<string, unknown>> = () => {
  return (
    <MainHeader>
      <LogoText>Sportfolios</LogoText>
      <div style={{ flex: 1 }} />
      <NotificationModule />
      <MessagingModule />
    </MainHeader>
  );
};

export default HomeHeader;
