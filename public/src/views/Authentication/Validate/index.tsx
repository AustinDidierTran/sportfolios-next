import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Validate.module.css';
import templateStyles from '../Authentication.module.css';

import SportfoliosLogo from '../../../../images/svg/logo/sportfolios_teal.svg';

import { useRouter } from 'next/router';
import { Store } from '../../../Store';
import { goTo, ROUTES } from '../../../actions/goTo';
import LoginFooter from '../components/Footer/Footer';
import { resendValidationCode, validateEmail } from '../../../actions/utils/auth/auth';
import { useEnterListener } from '../../../hooks/forms';
import Button from '../../../components/Styled/Button';
import styled from 'styled-components';
import SixDigitInput from '../../../components/Styled/SixDigitInput';
import { COGNITO_ERROR_ENUM } from '../../../../common/errors';
import { ROUTES_ENUM } from '../../../../common/enums';

const ErrorText = styled.span`
  font-size: 0.75rem;
  color: red;
  text-align: left;
  margin-top: 1rem;
`;

const DescriptionText = styled.p`
  font-size: 0.6875rem;
  color: ${(props) => props.theme.primary.main};
  text-align: center;
`;

const ActionText = styled.p`
  cursor: pointer;
  font-size: 0.75rem;
  color: ${(props) => props.theme.blue.main};
`;

const ValidateEmail: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { email: emailProps, redirectUrl } = router.query;

  const email = useMemo(() => {
    const e = Array.isArray(emailProps) ? emailProps[0] : emailProps;
    return decodeURIComponent(e);
  }, [emailProps]);

  const {
    state: { isAuthenticated },
  } = React.useContext(Store);

  React.useEffect(() => {
    if (isAuthenticated) {
      const route = (redirectUrl as string) || ROUTES.home;
      router.push(route);
    }
  }, [isAuthenticated]);

  const [validationCode, setValidationCode] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [newCodeSent, setNewCodeSent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onValidate = useCallback(async () => {
    try {
      setIsLoading(true);
      await validateEmail(email, validationCode);
      goTo(ROUTES_ENUM.loginEmail);
    } catch (error) {
      if (error.message === COGNITO_ERROR_ENUM.INVALID_CODE) {
        setErrorMessage(t('auth.errors.invalid_code'));
      }
      if (error.message === COGNITO_ERROR_ENUM.EMPTY_CODE) {
        setErrorMessage(t('auth.errors.empty_code'));
      }
    } finally {
      setIsLoading(false);
    }
  }, [email, validationCode]);

  const onResendValidationCode = useCallback(() => {
    resendValidationCode(email);
    setNewCodeSent(true);
  }, [email]);

  useEnterListener(onValidate);

  return (
    <div className={templateStyles.container}>
      <div className={templateStyles.content}>
        <SportfoliosLogo height={120} width={120} />
        <DescriptionText>
          {t('auth.enter_6_digit_code')} {email}
        </DescriptionText>
        <SixDigitInput value={validationCode} onChange={(value) => setValidationCode(value)} />
        {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
        <Button className={styles.button} disabled={isLoading} onClick={onValidate}>
          {t('auth.validate')}
        </Button>
        <ActionText onClick={onResendValidationCode}>
          {newCodeSent ? t('auth.new_code_sent') : t('auth.new_code')}
        </ActionText>
      </div>
      <LoginFooter />
    </div>
  );
};

export default ValidateEmail;
