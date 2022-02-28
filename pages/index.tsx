import React from 'react';
import dynamic from 'next/dynamic';
import { useTranslation } from 'react-i18next';
import { NextSeo } from 'next-seo';
import { CLIENT_BASE_URL } from '../conf';
import { IMAGE_ENUM, ROUTES_ENUM } from '../public/common/enums';

const ForYouPage = dynamic(import('../public/src/views/v2/ForYouPage'));

const HomeRoute: React.FunctionComponent = () => {
  const { t } = useTranslation();

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
      <ForYouPage />
    </>
  );
};
export default HomeRoute;
