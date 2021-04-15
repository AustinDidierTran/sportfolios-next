import React from 'react';
import { useTranslation } from 'react-i18next';
import { goTo, ROUTES } from '../../../../../actions/goTo';
import BasicFormDialog from '../../BasicFormDialog';

export default function GoToCart(props) {
  const { open, onClose } = props;
  const { t } = useTranslation();

  const buttons = [
    {
      onClick: onClose,
      name: t('cancel'),
      color: 'secondary',
    },
    {
      onClick: () => {
        onClose();
        goTo(ROUTES.cart);
      },
      name: t('go_to_cart'),
      color: 'primary',
    },
  ];

  return (
    <BasicFormDialog
      open={open}
      title={t('go_to_cart_to_pay_membership')}
      fields={[]}
      buttons={buttons}
      onClose={onClose}
    />
  );
}
