import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './LoginEmail.module.css';
import templateStyles from '../../Authentication.module.css';
import Link from 'next/link';

import SportfoliosLogo from '../../../../../images/svg/logo/sportfolios_teal.svg';

import * as yup from 'yup';

import { PASSWORD_LENGTH_ENUM } from '../../../../../common/config';
import { useRouter } from 'next/router';
import { ACTION_ENUM, Store } from '../../../../Store';
import { goTo, ROUTES } from '../../../../actions/goTo';
import { useRedirectUrl } from '../../../../hooks/url';
import LoginFooter from '../../components/Footer/Footer';
import TextInput from '../../../../components/Styled/TextInput';
import { loginWithEmail } from '../../../../actions/utils/auth/auth';
import { useEnterListener } from '../../../../hooks/forms';
import Button from '../../../../components/Styled/Button';
import { ROUTES_ENUM } from '../../../../../common/enums';

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
    email: yup.string().email(t('invalid.invalid_email')).required(t('auth.errors.invalid_email')),
    password: yup
      .string()
      .min(PASSWORD_LENGTH_ENUM.MIN_LENGTH, t('auth.errors.invalid_password'))
      .max(PASSWORD_LENGTH_ENUM.MAX_LENGTH, t('auth.errors.invalid_password')),
  });

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onLogin = useCallback(async () => {
    setIsLoading(true);
    console.log({ email, password });
    try {
      await validationSchema.validate({ email, password });
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
      if (error.message === 'User is not confirmed.') {
        goTo(ROUTES_ENUM.signupEmailValidate, null, { email });
      }
      setErrorMessage(error.message);
      setIsLoading(false);
    }
  }, [email, password, loginWithEmail]);

  useEnterListener(onLogin);

  const signupRoute = useRedirectUrl(ROUTES.signup, redirectUrl as string);

  return (
    <div className={templateStyles.container}>
      <div className={templateStyles.content}>
        <SportfoliosLogo height={120} width={120} />
        <h3>{t('auth.login_to_sportfolios')}</h3>
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
        <Button className={styles.button} disabled={isLoading} onClick={onLogin}>
          {t('auth.login')}
        </Button>
        <p>
          {t('auth.no_account')} <Link href={signupRoute}>{t('auth.signup')}</Link>
        </p>
      </div>
      <LoginFooter />
    </div>
  );
};

export default LoginEmail;
