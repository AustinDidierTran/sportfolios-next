import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './LoginEmail.module.css';
import templateStyles from '../Login.module.css';
import Link from 'next/link';

import SportfoliosLogo from '../../../../images/svg/logo/sportfolios_teal.svg';

import * as yup from 'yup';

import { PASSWORD_LENGTH_ENUM } from '../../../../common/config';
import { useRouter } from 'next/router';
import { ACTION_ENUM, Store } from '../../../Store';
import { ROUTES } from '../../../actions/goTo';
import { useRedirectUrl } from '../../../hooks/url';
import LoginFooter from '../components/Footer/Footer';
import TextInput from '../../../components/V2/TextInput';
import { loginWithEmail } from '../../../actions/utils/auth/auth';
import { useEnterListener } from '../../../hooks/forms';
import Button from '../../../components/V2/Button';

const LoginEmail: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { redirectUrl } = router.query;

  const {
    state: { isAuthenticated },
    dispatch,
  } = React.useContext(Store);

  React.useEffect(() => {
    if (isAuthenticated) {
      const route = (redirectUrl as string) || ROUTES.home;
      router.push(route);
    }
  }, [isAuthenticated]);

  const validationSchema = yup.object().shape({
    email: yup.string().email(t('invalid.invalid_email')).required(t('value_is_required')),
    password: yup
      .string()
      .min(PASSWORD_LENGTH_ENUM.MIN_LENGTH, t('password_length'))
      .max(PASSWORD_LENGTH_ENUM.MAX_LENGTH, t('password_length'))
      .required(t('value_is_required')),
  });

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onLogin = useCallback(async () => {
    setIsLoading(true);
    try {
      const inputIsValid = await validationSchema.isValid({ email, password });

      if (!inputIsValid) {
        setErrorMessage(t('login.invalid_values'));
        setIsLoading(false);
        return;
      }

      const { userInfo, token } = await loginWithEmail(email, password);

      dispatch({
        type: ACTION_ENUM.LOGIN,
        payload: token,
      });
      dispatch({
        type: ACTION_ENUM.UPDATE_USER_INFO,
        payload: userInfo,
      });
    } catch (error) {
      setErrorMessage(t('login.invalid_values'));
      setIsLoading(false);
    }
  }, [email, password, loginWithEmail]);

  useEnterListener(onLogin);

  const signupRoute = useRedirectUrl(ROUTES.signup, redirectUrl as string);

  return (
    <div className={templateStyles.container}>
      <div className={templateStyles.content}>
        <SportfoliosLogo height={120} width={120} />
        <h3>{t('login.login_to_sportfolios')}</h3>
        <TextInput
          autofocus
          classes={{
            container: styles.input,
          }}
          placeholder={t('login.email')}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          value={email}
        />
        <TextInput
          classes={{
            container: styles.input,
          }}
          placeholder={t('login.password')}
          type="password"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          value={password}
        />
        {errorMessage && <span className={styles.error}>{errorMessage}</span>}
        <Button className={styles.button} disabled={isLoading} onClick={onLogin}>
          {t('login.login')}
        </Button>
        <p>
          {t('login.no_account')} <Link href={signupRoute}>{t('login.signup')}</Link>
        </p>
      </div>
      <LoginFooter />
    </div>
  );
};

export default LoginEmail;
