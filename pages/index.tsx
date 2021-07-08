import dynamic from 'next/dynamic';
import React from 'react';
import { goTo, ROUTES } from '../public/src/actions/goTo';
import { useTranslation } from 'react-i18next';
import { useApiRoute } from '../public/src/hooks/queries';
import { NextSeo } from 'next-seo';
import { CLIENT_BASE_URL } from '../conf';
import { IMAGE_ENUM, ROUTES_ENUM } from '../public/common/enums';

const LoadingSpinner = dynamic(import('../public/src/components/Custom/LoadingSpinner'));
const IgContainer = dynamic(import('../public/src/components/Custom/IgContainer'));
const Home = dynamic(import('../public/src/views/Home'));

const HomeRoute: React.FunctionComponent = () => {
  const { t } = useTranslation();

  const {
    isLoading,
    refetch,
    response: posts,
    status,
  } = useApiRoute('/api/entity/forYouPage', {
    defaultValue: [],
    method: 'GET',
  });

  if (status === 401) {
    goTo(ROUTES.landingPage);
  }

  if (isLoading) {
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
        <IgContainer>
          <LoadingSpinner />
        </IgContainer>
      </>
    );
  }

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
      <Home posts={posts} refetch={refetch} />
    </>
  );
};
export default HomeRoute;
