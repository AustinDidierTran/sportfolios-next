import React, { useCallback, useState } from 'react';
import Container from '../components/Container';
import Content from '../components/Content';

import styles from './ForgotPassword.module.css';

import SportfoliosLogo from '../../../../../images/svg/logo/sportfolios_teal.svg';
import { useTranslation } from 'react-i18next';
import Button from '../../../../components/Styled/Button';
import { DescriptionText, ErrorText } from '../components';
import TextInput from '../../../../components/Styled/TextInput';
import { Auth } from 'aws-amplify';
import { goTo, ROUTES } from '../../../../actions/goTo';
import { useEnterListener } from '../../../../hooks/forms';

const ForgotPasswordView: React.FunctionComponent<any> = () => {
  const { t } = useTranslation();

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const onSubmit = useCallback(async () => {
    try {
      await Auth.forgotPassword(email);
      goTo(ROUTES.recoveryEmail, null, { email: encodeURIComponent(email) });
    } catch (error) {
      setErrorMessage(t(error.message));
    }
  }, [email]);

  useEnterListener(onSubmit);

  return (
    <Container>
      <Content>
        <SportfoliosLogo height={120} width={120} />
        <DescriptionText>{t('auth.forgotten_password')}</DescriptionText>
        <TextInput
          autofocus
          classes={{ container: styles.input }}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={t('auth.fields.email')}
        />
        {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
        <Button className={styles.button} onClick={onSubmit}>
          {t('auth.send_recovery_code')}
        </Button>
      </Content>
    </Container>
  );
};

export default ForgotPasswordView;
