import React, { useContext, useEffect, useState } from 'react';
import { getForYouPage } from '../../../actions/service/entity/get';
import { REQUEST_STATUS_ENUM } from '../../../../common/enums';
import { Store } from '../../../Store';
import { useRouter } from 'next/router';
import { goTo, ROUTES } from '../../../actions/goTo';
import HomeHeader from '../common/Header';
import MainFooter from '../common/MainLayout/Footer';
import HomeContent from './components/Content';
import EventCard from '../common/Cards/Event';
import { EventPost } from '../../../../../typescript/event';
import CartModule from './components/CartModule';
import MainContainer from '../common/MainLayout/Container';
import MainContent from '../common/MainLayout/Content';
import CenteredLoadingSpinner from '../common/CenteredLoadingSpinner';

const ForYouPage: React.FunctionComponent = () => {
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

  return (
    <MainContainer>
      <HomeHeader />
      <MainContent>
        {(() => {
          if (isLoading) {
            return <CenteredLoadingSpinner />;
          }
          return (
            <React.Fragment>
              <HomeContent>
                {posts.map((post) => (
                  <EventCard key={post.eventId} post={post} />
                ))}
              </HomeContent>
              <CartModule />
            </React.Fragment>
          );
        })()}
      </MainContent>
      <MainFooter />
    </MainContainer>
  );
};

export default ForYouPage;
