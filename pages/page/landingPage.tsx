import React from 'react';
import { useTranslation } from 'react-i18next';
import { NextSeo } from 'next-seo';
import { CLIENT_BASE_URL } from '../../conf';
import { ROUTES_ENUM, IMAGE_ENUM } from '../../public/common/enums';
import dynamic from 'next/dynamic';

const LandingPage = dynamic(() => import('../../public/src/views/LandingPage'));

const LandingPageRoute: React.FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <>
      <NextSeo
        title={t('metadata.landingPage.title')}
        description={t('metadata.landingPage.description')}
        canonical={CLIENT_BASE_URL}
        openGraph={{
          type: 'website',
          url: `${CLIENT_BASE_URL}${ROUTES_ENUM.landingPage}`,
          title: t('metadata.landingPage.title'),
          description: t('metadata.landingPage.description'),
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
      <LandingPage />
    </>
  );
};

export default LandingPageRoute;
