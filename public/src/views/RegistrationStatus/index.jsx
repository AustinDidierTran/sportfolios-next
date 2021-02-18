import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { MessageAndButtons } from '../../components/Custom';
import { STATUS_ENUM, REJECTION_ENUM } from '../../../common/enums';
import { goTo, ROUTES } from '../../actions/goTo';
import RosterInviteLink from '../../tabs/Rosters/RosterCard/RosterInviteLink';
import { useRouter } from 'next/router';
import api from '../../actions/api';
import { ACTION_ENUM, Store } from '../../Store';

export default function RegistrationStatus() {
  const { t } = useTranslation();
  const router = useRouter();
  const { reason, status, rosterId } = router.query;
  const { dispatch } = useContext(Store);

  const updateCart = async () => {
    const { data: cartItems } = await api('/api/shop/getCartItems');
    dispatch({
      type: ACTION_ENUM.UPDATE_CART,
      payload: cartItems,
    });
  };

  useEffect(() => {
    updateCart();
  }, []);

  const goToCart = () => {
    goTo(ROUTES.cart);
  };

  const returnHome = () => {
    goTo(ROUTES.home);
  };

  let values = {};

  switch (status) {
    case STATUS_ENUM.ACCEPTED_FREE:
      values = {
        message: t('register.registration_accepted_free'),
        children: (
          <RosterInviteLink message={t('to_invite_people_to_your_roster_share_the_invite_link')} rosterId={rosterId} />
        ),
        onClick: returnHome,
        button: t('home'),
        endIcon: 'Home',
      };
      break;
    case STATUS_ENUM.ACCEPTED:
      values = {
        message: t('register.registration_accepted'),
        children: (
          <RosterInviteLink message={t('to_invite_people_to_your_roster_share_the_invite_link')} rosterId={rosterId} />
        ),
        onClick: goToCart,
        button: t('cart'),
        endIcon: 'ShoppingCart',
      };
      break;
    case STATUS_ENUM.PENDING:
      values = {
        message: t('register.registration_pending'),
        onClick: returnHome,
        button: t('home'),
        endIcon: 'Home',
      };
      break;
    case STATUS_ENUM.REFUSED:
      if (reason === REJECTION_ENUM.NO_REMAINING_SPOTS) {
        values = {
          message: t('no.no_remaining_spots'),
          onClick: returnHome,
          button: t('home'),
          endIcon: 'Home',
        };
      } else {
        values = {
          message: t('register.registration_refused'),
          onClick: returnHome,
          button: t('home'),
          endIcon: 'Home',
        };
      }
      break;
    default:
      values = {
        message: null,
        onClick: null,
        button: null,
        endIcon: null,
      };
  }

  const buttons = [
    {
      name: values.button,
      onClick: values.onClick,
      endIcon: values.endIcon,
      color: 'primary',
    },
  ];

  return (
    <MessageAndButtons buttons={buttons} message={values.message}>
      {values.children}
    </MessageAndButtons>
  );
}
