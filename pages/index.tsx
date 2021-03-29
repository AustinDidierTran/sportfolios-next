import dynamic from 'next/dynamic';
import React from 'react';
import { goTo, ROUTES } from '../public/src/actions/goTo';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

const LoadingSpinner = dynamic(import('../public/src/components/Custom/LoadingSpinner'));
const IgContainer = dynamic(import('../public/src/components/Custom/IgContainer'));
const Home = dynamic(import('../public/src/views/Home'));
import { useApiRoute } from '../public/src/hooks/queries';

export default function HomeRoute() {
  const { t } = useTranslation();

  const { isLoading, refetch, response: posts, status } = useApiRoute('/api/entity/forYouPage', {
    defaultValue: [],
    method: 'GET',
  });

  if (status === 401) {
    goTo(ROUTES.landingPage);
  }

  if (isLoading) {
    return (
      <>
        <Head>
          <meta property="og:title" content={t('metadata.forYouPage.title')} />
          <meta property="og:description" content={t('metadata.forYouPage.description')} />
          <meta
            property="og:image"
            content="https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210225-h08xs-8317ff33-3b04-49a1-afd3-420202cddf73"
          />
          <title>{t('metadata.forYouPage.title')} </title>
        </Head>
        <IgContainer>
          <LoadingSpinner />
        </IgContainer>
      </>
    );
  }

  return (
    <>
      <Head>
        <meta name="description" content={t('metadata.forYouPage.description')} />
        <meta
          name="keywords"
          content={
            'Sportfolios.app, Sport, Organization, Athlete, Coach, Schedule, Registration, Results, Statistics, Ultimate Frisbee,'
          }
        />
        <meta property="og:title" content={t('metadata.forYouPage.title')} />
        <meta property="og:description" content={t('metadata.forYouPage.description')} />
        <meta
          property="og:image"
          content="https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210225-h08xs-8317ff33-3b04-49a1-afd3-420202cddf73"
        />
        <title>{t('metadata.forYouPage.title')} </title>
      </Head>
      <Home posts={posts} refetch={refetch} />
    </>
  );
}
