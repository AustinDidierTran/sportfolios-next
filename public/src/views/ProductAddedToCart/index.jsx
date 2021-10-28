import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { formatPageTitle } from '../../utils/stringFormats';

import MessageAndButtons from '../../components/Custom/MessageAndButtons';
import { goTo, ROUTES } from '../../actions/goTo';
import { TABS_ENUM } from '../../../common/enums';
import { useRouter } from 'next/router';

export default function ProductAddedToCart() {
  const router = useRouter();
  const { name, total, amount, id } = router.query;
  const { t } = useTranslation();

  useEffect(() => {
    document.title = formatPageTitle(t('product_added_to_cart'));
  }, []);

  const goToCart = () => {
    goTo(ROUTES.cart);
  };

  const goToShop = () => {
    goTo(ROUTES.entity, { id }, { tab: TABS_ENUM.SHOP });
  };

  const buttons = [
    {
      name: t('back_to_shop'),
      endIcon: 'Store',
      color: 'default',
      onClick: goToShop,
    },
    {
      name: t('cart.title'),
      endIcon: 'ShoppingCart',
      color: 'primary',
      onClick: goToCart,
    },
  ];

  return (
    <MessageAndButtons
      buttons={buttons}
      message={t('you.your_item_has_been_added_to_cart', {
        name,
        amount,
        total,
      })}
    />
  );
}
