import React from 'react';
import Link from 'next/link';

import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const FooterContainer = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
    'Helvetica Neue', sans-serif;
  font-size: 0.5625rem;
  text-align: center;

  b {
    cursor: pointer;
  }
`;

const LoginFooter: React.FunctionComponent<Record<string, unknown>> = () => {
  const { t } = useTranslation();
  const privacyPolicy = 'https://sportfolios-images.s3.amazonaws.com/production/privacy-policy/privacy-policy.html';
  const termsConditions = 'https://www.termsconditionstemplate.net/live.php?token=BCbkqtde4eVFO4unde1jCE7Wq6xucBzV';

  return (
    <FooterContainer>
      {t('auth.footer.by_continuing')}{' '}
      <Link href={termsConditions}>
        <b>{t('auth.footer.terms_and_conditions')}</b>
      </Link>{' '}
      {t('auth.footer.sportfolios_confirm')}{' '}
      <Link href={privacyPolicy}>
        <b>{t('auth.footer.privacy_policy')}</b>
      </Link>{' '}
      {t('auth.footer.of_sportfolios')}
    </FooterContainer>
  );
};

export default LoginFooter;
