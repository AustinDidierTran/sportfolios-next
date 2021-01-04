import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { TABS_ENUM } from '../../public/common/enums';
import Cart from '../../public/src/views/Cart';

const CartRoute = (props) => {
  const router = useRouter();
  const { tab } = router.query;

  const openTab = useMemo(() => {
    if (tab) {
      return tab;
    }
    return TABS_ENUM.CART;
  });

  return <Cart openTab={openTab} />;
};

export default CartRoute;
