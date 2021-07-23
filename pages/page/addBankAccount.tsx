import { useRouter } from 'next/router';
import React from 'react';
import { formatRoute } from '../../public/src/utils/stringFormats';
import api from '../../public/src/actions/api';
import { goTo } from '../../public/src/actions/goTo';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import LoadingSpinner from '../../public/src/components/Custom/LoadingSpinner';
import { IMAGE_ENUM } from '../../public/common/enums';

const AddBankAccount = dynamic(() => import('../../public/src/views/AddBankAccount'));

const AddBankAccountRoute: React.FunctionComponent = () => {
  const router = useRouter();
  const { entityId, id } = router.query;
  const { t } = useTranslation();

  React.useEffect(() => {
    hasStripeAccount();
  }, [entityId]);

  const hasStripeAccount = async (): Promise<void> => {
    if (!entityId) {
      return;
    }
    const { data: hasStripeAccount } = await api(formatRoute('/api/stripe/hasStripeAccount', null, { entityId }));
    if (!hasStripeAccount) {
      goTo(`/${entityId}?tab=settings`);
    }
  };

  if (entityId || id) {
    return (
      <>
        <Head>
          <meta property="og:title" content={t('metadata.addBankAccount.title')} />
          <meta property="og:description" content={t('metadata.addBankAccount.description')} />
          <meta property="og:image" content={IMAGE_ENUM.SPORTFOLIOS_BANNER} />
        </Head>
        <AddBankAccount entityId={entityId.toString()} id={id.toString()} />
      </>
    );
  }
  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.addBankAccount.title')} />
        <meta property="og:description" content={t('metadata.addBankAccount.description')} />
        <meta property="og:image" content={IMAGE_ENUM.SPORTFOLIOS_BANNER} />
      </Head>
      <LoadingSpinner />
    </>
  );
};
export default AddBankAccountRoute;
