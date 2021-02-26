import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { TABS_ENUM } from '../../public/common/enums';
import Cart from '../../public/src/views/Cart';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

const CartRoute = () => {
  const router = useRouter();
  const { tab } = router.query;
  const { t } = useTranslation();

  const openTab = useMemo(() => {
    if (tab) {
      return tab;
    }
    return TABS_ENUM.CART;
  });

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.cart.title')} />
        <meta property="og:description" content={t('metadata.cart.description')} />
        <meta
          property="og:image"
          content="https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210225-h08xs-8317ff33-3b04-49a1-afd3-420202cddf73"
        />
      </Head>
      <Cart openTab={openTab} />
    </>
  );
};

export default CartRoute;
