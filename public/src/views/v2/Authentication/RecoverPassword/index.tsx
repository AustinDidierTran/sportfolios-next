import React, { useCallback, useContext, useMemo, useState } from 'react';
import Container from '../components/Container';
import Content from '../components/Content';

import styles from './RecoverPassword.module.css';

import SportfoliosLogo from '../../../../../images/svg/logo/sportfolios_teal.svg';
import { useTranslation } from 'react-i18next';
import Button from '../../../../components/Styled/Button';
import { ActionText, DescriptionText, ErrorText } from '../components';
import TextInput from '../../../../components/Styled/TextInput';
import { Auth } from 'aws-amplify';
import { goTo, ROUTES } from '../../../../actions/goTo';
import { useEnterListener } from '../../../../hooks/forms';
import { AUTH_ERROR_ENUM, AUTH_STATUS_ENUM } from '../../../../../common/errors';
import { useRouter } from 'next/router';
import { ACTION_ENUM, Store } from '../../../../Store';
import Link from 'next/link';

const ForgotPasswordView: React.FunctionComponent<any> = () => {
  const { dispatch } = useContext(Store);
  const router = useRouter();
  const { email: emailProps } = router.query;
  const { t } = useTranslation();

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [recoveryCode, setRecoveryCode] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');

  const email = useMemo(() => decodeURIComponent(emailProps as string), [emailProps]);

  const onSubmit = useCallback(async () => {
    try {
      const res = await Auth.forgotPasswordSubmit(email, recoveryCode, newPassword);

      if (res !== AUTH_STATUS_ENUM.SUCCESS) {
        throw new Error(AUTH_ERROR_ENUM.ERROR_OCCURED);
      }

      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('password_reset_message'),
      });

      goTo(ROUTES.loginEmail);
    } catch (error) {
      setErrorMessage(t(error.message));
    }
  }, [email, recoveryCode, newPassword]);

  useEnterListener(onSubmit);

  return (
    <Container>
      <Content>
        <SportfoliosLogo height={120} width={120} />
        <DescriptionText>{t('auth.recover_password', { email })}</DescriptionText>
        <TextInput
          autofocus
          classes={{ container: styles.input }}
          value={recoveryCode}
          onChange={(event) => setRecoveryCode(event.target.value)}
          placeholder={t('auth.fields.recovery_code')}
        />
        <TextInput
          classes={{ container: styles.input }}
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          placeholder={t('auth.fields.new_password')}
          type="password"
        />
        {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
        <Button className={styles.button} onClick={onSubmit}>
          {t('auth.reset_password')}
        </Button>
        <ActionText>
          <Link href={ROUTES.loginEmail}>{t('auth.go_to_login_email')}</Link>
        </ActionText>
      </Content>
    </Container>
  );
};

export default ForgotPasswordView;
