import AccountCircle from '@material-ui/icons/AccountCircle';
import Home from '@material-ui/icons/Home';
import Menu from '@material-ui/icons/Menu';
import Search from '@material-ui/icons/Search';
import { useRouter } from 'next/router';
import React, { useContext, useMemo } from 'react';
import styled from 'styled-components';
import { goTo, ROUTES } from '../../../../actions/goTo';
import { Store } from '../../../../Store';

const FooterContainer = styled.div`
  bottom: 0;
  left: 0;
  width: 100%;
  height: 5.5rem;
  display: flex;
  background: #a0a0a0;
  display: flex;
  flex-direction: row;
`;

const ButtonContainer = styled.button`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  border: none;
  background-color: white;
  color: ${(props) => (props.color === 'active' ? props.theme.primary.main : props.theme.shadesOfGrey.dark)};
`;

const HomeFooter: React.FunctionComponent<Record<string, unknown>> = () => {
  const {
    state: { userInfo },
  } = useContext(Store);

  const router = useRouter();

  const homeColor = useMemo(() => (router.pathname === ROUTES.home ? 'active' : ''), [router.pathname]);

  // To implement when these pages will be implemented
  const searchColor = useMemo(() => '', [router.pathname]);
  const profileColor = useMemo(() => '', [router.pathname]);
  const menuColor = useMemo(() => '', [router.pathname]);

  return (
    <FooterContainer>
      <ButtonContainer color={homeColor} onClick={() => goTo(ROUTES.home)}>
        <Home />
        <span>Home</span>
      </ButtonContainer>
      <ButtonContainer color={searchColor} onClick={() => goTo(ROUTES.search)}>
        <Search />
        <span>Search</span>
      </ButtonContainer>
      <ButtonContainer color={profileColor} onClick={() => goTo(ROUTES.entity, { id: userInfo.primaryPerson.id })}>
        <AccountCircle />
        <span>Profile</span>
      </ButtonContainer>
      <ButtonContainer color={menuColor} onClick={() => goTo(ROUTES.menu)}>
        <Menu />
        <span>Menu</span>
      </ButtonContainer>
    </FooterContainer>
  );
};

export default HomeFooter;
