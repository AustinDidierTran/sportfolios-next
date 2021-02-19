import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { MessageAndButtons } from '../../components/Custom';

import { goTo, ROUTES } from '../../actions/goTo';
import { useRouter } from 'next/router';

export default function ConfirmEmailSuccess() {
  const { t } = useTranslation();
  const router = useRouter();
  const { redirectUrl } = router.query;

  useEffect(() => {
    setTimeout(() => {
      if (redirectUrl) {
        goTo(redirectUrl);
      } else {
        goTo(ROUTES.home);
      }
    }, 3000);
  }, []);

  const successButtons = [
    {
      name: t('go_to_page'),
      endIcon: 'ExitToApp',
      onClick: () => {
        goTo(redirectUrl);
      },
      color: 'primary',
    },
  ];

  const buttons = [
    {
      name: t('home'),
      onClick: () => {
        goTo(ROUTES.home);
      },
      endIcon: 'Home',
      color: 'primary',
    },
  ];

  if (redirectUrl) {
    return (
      <MessageAndButtons
        buttons={successButtons}
        message={`${t('email.email_confirm_success')} ${t('redirect_to_success_route')}`}
      />
    );
  }

  return (
    <MessageAndButtons buttons={buttons} message={`${t('email.email_confirm_success')} ${t('redirect_to_home')}`} />
  );
}
