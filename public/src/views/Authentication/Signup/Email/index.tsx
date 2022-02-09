import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SignupEmail.module.css';
import templateStyles from '../../Authentication.module.css';
import Link from 'next/link';

import SportfoliosLogo from '../../../../../images/svg/logo/sportfolios_teal.svg';

import * as yup from 'yup';

import { PASSWORD_LENGTH_ENUM } from '../../../../../common/config';
import { useRouter } from 'next/router';
import { Store } from '../../../../Store';
import { goTo, ROUTES } from '../../../../actions/goTo';
import { useRedirectUrl } from '../../../../hooks/url';
import LoginFooter from '../../components/Footer/Footer';
import TextInput from '../../../../components/Styled/TextInput';
import { loginWithEmail, signupWithEmail } from '../../../../actions/utils/auth/auth';
import { useEnterListener } from '../../../../hooks/forms';
import Button from '../../../../components/Styled/Button';
import { ROUTES_ENUM } from '../../../../../common/enums';

const SignupEmail: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { redirectUrl } = router.query;

  const {
    state: { isAuthenticated },
  } = React.useContext(Store);

  React.useEffect(() => {
    if (isAuthenticated) {
      const route = (redirectUrl as string) || ROUTES.home;
      router.push(route);
    }
  }, [isAuthenticated]);

  const validationSchema = yup.object().shape({
    email: yup.string().email(t('invalid.invalid_email')).required(t('auth.errors.invalid_email')),
    password: yup
      .string()
      .min(PASSWORD_LENGTH_ENUM.MIN_LENGTH, t('auth.errors.invalid_password'))
      .max(PASSWORD_LENGTH_ENUM.MAX_LENGTH, t('auth.errors.invalid_password'))
      .required(t('auth.errors.invalid_password')),
  });

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSignup = useCallback(async () => {
    setIsLoading(true);
    try {
      await validationSchema.validate({ email, password });

      await signupWithEmail(email, password);

      // Go to validation page
      goTo(ROUTES_ENUM.signupEmailValidate, null, { email: encodeURIComponent(email) });
    } catch (error) {
      if (error.message === 'An account with the given email already exists.') {
        // Try to sign in?
        try {
          await loginWithEmail(email, password);
        } catch (error) {
          if (error.message === 'User is not confirmed.') {
            goTo(ROUTES_ENUM.signupEmailValidate, null, { email: encodeURIComponent(email) });
          }
          throw error;
        }
      }
      setErrorMessage(error.message);
      setIsLoading(false);
    }
  }, [email, password, signupWithEmail]);

  useEnterListener(onSignup);

  const loginRoute = useRedirectUrl(ROUTES.login, redirectUrl as string);

  return (
    <div className={templateStyles.container}>
      <div className={templateStyles.content}>
        <SportfoliosLogo height={120} width={120} />
        <h3>{t('auth.register_sportfolios')}</h3>
        <TextInput
          autofocus
          classes={{
            container: styles.input,
          }}
          placeholder={t('auth.fields.email')}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          value={email}
        />
        <TextInput
          classes={{
            container: styles.input,
          }}
          placeholder={t('auth.fields.password')}
          type="password"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          value={password}
        />
        {errorMessage && <span className={styles.error}>{errorMessage}</span>}
        <Button className={styles.button} disabled={isLoading} onClick={onSignup}>
          {t('auth.signup')}
        </Button>
        <p>
          {t('auth.already_account')} <Link href={loginRoute}>{t('auth.login')}</Link>
        </p>
      </div>
      <LoginFooter />
    </div>
  );
};

export default SignupEmail;
