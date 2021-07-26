import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import LoadingSpinner from '../../public/src/components/Custom/LoadingSpinner';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { IMAGE_ENUM } from '../../public/common/enums';

const AddPaymentMethod = dynamic(() => import('../../public/src/views/AddPaymentMethod'));

const AddPaymentMethodRoute: React.FunctionComponent = () => {
  const router = useRouter();
  const { redirect: redirectProps } = router.query;
  const { t } = useTranslation();

  const redirect = useMemo<string>(() => {
    if (Array.isArray(redirectProps)) {
      return redirectProps[0];
    }
    return redirectProps;
  }, [redirectProps]);

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.addPaymentMethod.title')} />
        <meta property="og:description" content={t('metadata.addPaymentMethod.description')} />
        <meta property="og:image" content={IMAGE_ENUM.SPORTFOLIOS_BANNER} />
      </Head>
      {redirect ? <AddPaymentMethod redirect={redirect} /> : <LoadingSpinner />}
    </>
  );
};

export default AddPaymentMethodRoute;
