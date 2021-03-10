import React from 'react';
import { useTranslation } from 'react-i18next';

import { MessageAndButtons } from '../../components/Custom';

// @ts-ignore
import styles from './ConfirmationEmailSent.module.css';
import { goTo, ROUTES } from '../../actions/goTo';

interface IProps {
  email: string;
}

const ConfirmationEmailSent: React.FunctionComponent<IProps> = (props) => {
  const { email } = props;
  const { t } = useTranslation();

  const goToLogin = () => {
    goTo(ROUTES.login);
  };

  const buttons = [
    {
      name: t('go_back_to_login'),
      onClick: goToLogin,
      endIcon: 'Undo',
      color: 'primary',
    },
  ];

  return (
    <div className={styles.main}>
      <MessageAndButtons buttons={buttons} message={t('email.email_confirmed', { email })} />
    </div>
  );
};

export default ConfirmationEmailSent;
