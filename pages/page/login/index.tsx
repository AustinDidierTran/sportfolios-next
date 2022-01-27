import React from 'react';
import { useTranslation } from 'react-i18next';
import { NextSeo } from 'next-seo';
import { CLIENT_BASE_URL } from '../../../conf';
import { ROUTES_ENUM, IMAGE_ENUM } from '../../../public/common/enums';
import dynamic from 'next/dynamic';

const Login = dynamic(() => import('../../../public/src/views/Login'));

const LoginRoute: React.FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <>
      <NextSeo
        title={t('metadata.login.title')}
        description={t('metadata.login.description')}
        canonical={CLIENT_BASE_URL}
        openGraph={{
          type: 'website',
          url: `${CLIENT_BASE_URL}${ROUTES_ENUM.login}`,
          title: t('metadata.login.title'),
          description: t('metadata.login.description'),
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
      <Login />
    </>
  );
};

export default LoginRoute;
