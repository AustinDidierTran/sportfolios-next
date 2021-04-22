import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { ROUTES } from '../../public/src/actions/goTo';
import LoadingSpinner from '../../public/src/components/Custom/LoadingSpinner';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';

const AddPaymentMethod = dynamic(() => import('../../public/src/views/AddPaymentMethod'));

const AddPaymentMethodRoute = () => {
  const router = useRouter();
  const { redirect: redirectProps } = router.query;
  const { t } = useTranslation();

  const redirect = useMemo(() => {
    if (redirectProps) {
      return redirectProps;
    }
    return ROUTES.userSettings;
  });

  if (redirect) {
    return (
      <>
        <Head>
          <meta property="og:title" content={t('metadata.addPaymentMethod.title')} />
          <meta property="og:description" content={t('metadata.addPaymentMethod.description')} />
          <meta
            property="og:image"
            content="https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210225-h08xs-8317ff33-3b04-49a1-afd3-420202cddf73"
          />
        </Head>
        <AddPaymentMethod redirect={redirect} />
      </>
    );
  }
  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.addPaymentMethod.title')} />
        <meta property="og:description" content={t('metadata.addPaymentMethod.description')} />
        <meta
          property="og:image"
          content="https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210225-h08xs-8317ff33-3b04-49a1-afd3-420202cddf73"
        />
      </Head>
      <LoadingSpinner />
    </>
  );
};

export default AddPaymentMethodRoute;
