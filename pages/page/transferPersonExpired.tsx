import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { IMAGE_ENUM } from '../../public/common/enums';

const TransferPersonExpired = dynamic(() => import('../../public/src/views/TransferPerson/TransferPersonExpired'));

const TransferPersonExpiredRoute: React.FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.transferPersonExpired.title')} />
        <meta property="og:description" content={t('metadata.transferPersonExpired.description')} />
        <meta property="og:image" content={IMAGE_ENUM.SPORTFOLIOS_BANNER} />
      </Head>
      <TransferPersonExpired />
    </>
  );
};

export default TransferPersonExpiredRoute;
