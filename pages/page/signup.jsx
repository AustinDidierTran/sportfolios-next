import React from 'react';

import Signup from '../../public/src/views/Signup';
import { useTranslation } from 'react-i18next';
import { ROUTES_ENUM } from '../../public/common/enums';
import { CLIENT_BASE_URL } from '../../conf';
import { NextSeo } from 'next-seo';

const SignupRoute = () => {
  const { t } = useTranslation();

  return (
    <>
      <NextSeo
        title={t('metadata.signup.title')}
        description={t('metadata.signup.description')}
        canonical={CLIENT_BASE_URL}
        openGraph={{
          type: 'website',
          url: `${CLIENT_BASE_URL}${ROUTES_ENUM.signup}`,
          title: t('metadata.signup.title'),
          description: t('metadata.signup.description'),
          images: [
            {
              url:
                'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210225-h08xs-8317ff33-3b04-49a1-afd3-420202cddf73',
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
        ]}
        facebook={{ appId: '346677216672687' }}
        twitter={{
          site: '@sportfoliosapp',
          cardType: 'summary_large_image',
        }}
      />
      <Signup />
    </>
  );
};

export default SignupRoute;
