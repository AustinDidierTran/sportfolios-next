import AccountCircle from '@material-ui/icons/AccountCircle';
import Home from '@material-ui/icons/Home';
import Menu from '@material-ui/icons/Menu';
import Search from '@material-ui/icons/Search';
import { useRouter } from 'next/router';
import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { goTo, ROUTES } from '../../../../../actions/goTo';
import { Store } from '../../../../../Store';

const FooterContainer = styled.div`
  bottom: 0;
  left: 0;
  width: 100%;
  max-width: ${(props) => props.theme.breakpoints.container};
  margin-left: auto;
  margin-right: auto;
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

const MainFooter: React.FunctionComponent<Record<string, unknown>> = () => {
  const { t } = useTranslation();
  const {
    state: { userInfo },
  } = useContext(Store);

  const router = useRouter();

  // To implement when these pages will be implemented
  const homeColor = useMemo(() => (router.pathname === ROUTES.home ? 'active' : ''), [router.pathname]);
  const searchColor = useMemo(() => (router.pathname === ROUTES.search ? 'active' : ''), [router.pathname]);

  const profileColor = useMemo(() => '', [router.pathname]);
  const menuColor = useMemo(() => '', [router.pathname]);

  return (
    <FooterContainer>
      <ButtonContainer color={homeColor} onClick={() => goTo(ROUTES.home)}>
        <Home />
        <span>{t('footer.home')}</span>
      </ButtonContainer>
      <ButtonContainer color={searchColor} onClick={() => goTo(ROUTES.search)}>
        <Search />
        <span>{t('footer.search')}</span>
      </ButtonContainer>
      <ButtonContainer color={profileColor} onClick={() => goTo(ROUTES.entity, { id: userInfo.primaryPerson.id })}>
        <AccountCircle />
        <span>{t('footer.profile')}</span>
      </ButtonContainer>
      <ButtonContainer color={menuColor} onClick={() => goTo(ROUTES.menu)}>
        <Menu />
        <span>{t('footer.menu')}</span>
      </ButtonContainer>
    </FooterContainer>
  );
};

export default MainFooter;
