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
        <meta property="og:image" content="" />
      </Head>
      <Cart openTab={openTab} />
    </>
  );
};

export default CartRoute;
