import React, { useContext, useEffect, useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import styled from 'styled-components';
import { getForYouPage } from '../../../actions/service/entity/get';
import { REQUEST_STATUS_ENUM } from '../../../../common/enums';
import { Store } from '../../../Store';
import { useRouter } from 'next/router';
import { goTo, ROUTES } from '../../../actions/goTo';
import HomeContainer from './components/Container';
import HomeHeader from '../common/Header';
import HomeFooter from '../common/Footer';
import HomeContent from './components/Content';
import EventCard from '../common/Cards/Event';
import { EventPost } from '../../../../../typescript/event';
import CartModule from './components/CartModule';

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const CenterOnPage = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ForYouPage: React.FunctionComponent<Record<string, unknown>> = () => {
  const router = useRouter();
  const {
    state: { isAuthenticated, userInfo },
  } = useContext(Store);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [posts, setPosts] = useState<EventPost[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      goTo(ROUTES.login, null, { redirectUrl: encodeURIComponent(router.asPath) });
      return;
    }

    if (!userInfo?.persons.length) {
      goTo(ROUTES.setupPrimaryPerson);
    }

    getForYouPage().then((res) => {
      const { status, data } = res;
      if (status !== REQUEST_STATUS_ENUM.SUCCESS) {
        // You are not logged in, go back to login
        goTo(ROUTES.login);
      }

      setPosts(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <CenterOnPage>
        <CircularProgress />
      </CenterOnPage>
    );
  }

  return (
    <MainContainer>
      <HomeHeader />
      <HomeContainer>
        <HomeContent>
          {posts.map((post) => (
            <EventCard key={post.eventId} post={post} />
          ))}
        </HomeContent>
        <CartModule />
      </HomeContainer>
      <HomeFooter />
    </MainContainer>
  );
};

export default ForYouPage;
