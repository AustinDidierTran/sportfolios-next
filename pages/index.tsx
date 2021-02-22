import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import React, { useContext, useEffect } from 'react';
import { ROUTES } from '../public/src/actions/goTo';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

const LoadingSpinner = dynamic(import('../public/src/components/Custom/LoadingSpinner'));
const IgContainer = dynamic(import('../public/src/components/Custom/IgContainer'));
const Home = dynamic(import('../public/src/views/Home'));
import { useApiRoute } from '../public/src/hooks/queries';
import { Store } from '../public/src/Store';

export default function HomeRoute() {
  const router = useRouter();
  const { t } = useTranslation();

  const {
    state: { isAuthenticated },
  } = useContext(Store);

  useEffect(() => {
    if (isAuthenticated === false) {
      router.push(ROUTES.login);
    }
  }, [isAuthenticated]);

  const { isLoading, refetch, response: posts } = useApiRoute('/api/entity/forYouPage', {
    defaultValue: [],
    method: 'GET',
  });

  if (isLoading) {
    return (
      <IgContainer>
        <LoadingSpinner />
      </IgContainer>
    );
  }

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.forYouPage.title')} />
        <meta property="og:description" content={t('metadata.forYouPage.description')} />
        <meta property="og:image" content="" />
      </Head>
      <Home posts={posts} refetch={refetch} />
    </>
  );
}
