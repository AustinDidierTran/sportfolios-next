import React, { useEffect, useState, useContext } from 'react';
import dynamic from 'next/dynamic';
import { goTo, ROUTES } from '../public/src/actions/goTo';
import { useTranslation } from 'react-i18next';
import { NextSeo } from 'next-seo';
import { CLIENT_BASE_URL } from '../conf';
import { IMAGE_ENUM, REQUEST_STATUS_ENUM, ROUTES_ENUM } from '../public/common/enums';
import { getForYouPage } from '../public/src/actions/service/entity/get';
import { ForYouPagePost } from '../typescript/types';
import { Store } from '../public/src/Store';

import { Amplify, API, withSSRContext } from 'aws-amplify';
import awsExports from '../src/aws-exports.js';

Amplify.configure({ ...awsExports, ssr: true });

const LoadingSpinner = dynamic(import('../public/src/components/Custom/LoadingSpinner'));
const IgContainer = dynamic(import('../public/src/components/Custom/IgContainer'));
const Home = dynamic(import('../public/src/views/Home'));

const HomeRoute: React.FunctionComponent = () => {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [posts, setPosts] = useState<ForYouPagePost[]>([]);
  const {
    state: { isAuthenticated },
  } = useContext(Store);

  useEffect(() => {
    if (isAuthenticated) {
      getPosts();
    }
  }, [isAuthenticated]);

  const getPosts = async (): Promise<void> => {
    setIsLoading(true);
    const { status, data } = await getForYouPage();
    if (status === REQUEST_STATUS_ENUM.SUCCESS) {
      setPosts(data);
    } else {
      goTo(ROUTES.landingPage);
    }
    setIsLoading(false);
  };

  return (
    <>
      <NextSeo
        title={t('metadata.forYouPage.title')}
        description={t('metadata.forYouPage.description')}
        canonical={CLIENT_BASE_URL}
        openGraph={{
          type: 'website',
          url: `${CLIENT_BASE_URL}${ROUTES_ENUM.home}`,
          title: t('metadata.forYouPage.title'),
          description: t('metadata.forYouPage.description'),
          images: [
            {
              url: IMAGE_ENUM.SPORTFOLIOS_BANNER,
            },
          ],
          site_name: 'Sportfolios',
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content:
              'Sportfolios.app, Sport, Organization, Athlete, Coach, Schedule, Registration, Results, Statistics, Coaching, Information, Gestion',
          },
          { name: 'apple-mobile-web-app-capable', content: 'yes' },
        ]}
        facebook={{ appId: '346677216672687' }}
        twitter={{
          site: '@sportfoliosapp',
          cardType: 'summary_large_image',
        }}
      />
      {isLoading ? (
        <IgContainer>
          <LoadingSpinner />
        </IgContainer>
      ) : (
        <Home posts={posts} />
      )}
    </>
  );
};
export default HomeRoute;
