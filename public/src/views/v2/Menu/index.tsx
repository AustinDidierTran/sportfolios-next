import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { goTo, ROUTES } from '../../../actions/goTo';
import { Icon } from '../../../components/Custom';
import { ACTION_ENUM, Store } from '../../../Store';
import HomeHeader from '../common/Header';
import MainContainer from '../common/MainLayout/Container';
import MainContent from '../common/MainLayout/Content';
import MainFooter from '../common/MainLayout/Footer';

const MenuOption = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  box-shadow: ${(props) => props.theme.shadow.primary};
  border-radius: 0.75rem;
  margin: 0 0.5rem 1rem 0.5rem;
`;

const Menu: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const { state, dispatch } = useContext(Store);

  const { userInfo } = state;

  console.log({ state });

  const routes = [
    {
      display: t('page.menu.options.create_person'),
      onClick: () => goTo(ROUTES.createPerson),
      icon: 'Person',
    },
    {
      display: t('page.menu.options.create_event'),
      onClick: () => goTo(ROUTES.createEvent),
      icon: 'Event',
    },
    {
      display: t('page.menu.options.create_team'),
      onClick: () => goTo(ROUTES.createTeam),
      icon: 'Group',
    },
    {
      display: t('page.menu.options.create_organization'),
      onClick: () => goTo(ROUTES.createOrganization),
      icon: 'Business',
    },
    {
      display: t('page.menu.options.messaging'),
      onClick: () => goTo(ROUTES.conversations, null, { recipientId: userInfo?.primaryPerson?.id }),
      icon: 'Chat',
    },
    {
      display: t('page.menu.options.cart'),
      onClick: () => goTo(ROUTES.cart),
      icon: 'ShoppingCart',
    },
    {
      display: t('page.menu.options.settings'),
      onClick: () => goTo(ROUTES.userSettings),
      icon: 'Settings',
    },
    {
      display: t('page.menu.options.logout'),
      onClick: () => dispatch({ type: ACTION_ENUM.LOGOUT }),
      style: { color: 'red' },
    },
  ];

  return (
    <MainContainer>
      <HomeHeader />
      <MainContent>
        {routes.map((route) => (
          <MenuOption key={route.display} style={route.style} onClick={route.onClick}>
            <Icon icon={route.icon} style={{ left: '1.5rem', position: 'absolute' }} />
            {route.display}
          </MenuOption>
        ))}
      </MainContent>
      <MainFooter />
    </MainContainer>
  );
};

export default Menu;
