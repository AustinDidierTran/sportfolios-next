import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { ROUTES } from '../../public/src/actions/goTo';
import LoadingSpinner from '../../public/src/components/Custom/LoadingSpinner';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { IMAGE_ENUM } from '../../public/common/enums';

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
          <meta property="og:image" content={IMAGE_ENUM.SPORTFOLIOS_BANNER} />
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
        <meta property="og:image" content={IMAGE_ENUM.SPORTFOLIOS_BANNER} />
      </Head>
      <LoadingSpinner />
    </>
  );
};

export default AddPaymentMethodRoute;
