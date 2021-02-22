import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import ConfirmEmail from '../../../public/src/views/ConfirmEmail';
import { ACTION_ENUM, Store } from '../../../public/src/Store';
import api from '../../../public/src/actions/api';
import { goTo, ROUTES } from '../../../public/src/actions/goTo';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

const ConfirmEmailRoute = () => {
  const router = useRouter();
  const { redirectUrl, token } = router.query;
  const { t } = useTranslation();

  const { dispatch } = useContext(Store);

  const confirmEmail = async () => {
    if (!token) {
      return;
    }
    const res = await api('/api/auth/confirmEmail', {
      method: 'POST',
      body: JSON.stringify({
        token,
      }),
    });

    const { token: authToken, userInfo } = res.data;

    if (res.status < 300) {
      // Success!
      dispatch({
        type: ACTION_ENUM.LOGIN,
        payload: authToken,
      });
      dispatch({
        type: ACTION_ENUM.UPDATE_USER_INFO,
        payload: userInfo,
      });

      if (redirectUrl) {
        goTo(ROUTES.confirmEmailSuccess, null, { redirectUrl });
      } else {
        goTo(ROUTES.confirmEmailSuccess);
      }
    } else {
      // Failure...
      goTo(ROUTES.confirmEmailFailure);
    }
  };

  React.useEffect(() => {
    confirmEmail();
  }, [redirectUrl, token]);

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.confirmEmail.title')} />
        <meta property="og:description" content={t('metadata.confirmEmail.description')} />
        <meta
          property="og:image"
          content="https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210213-xfi77-8317ff33-3b04-49a1-afd3-420202cddf73"
        />
      </Head>
      <ConfirmEmail redirectUrl={redirectUrl} token={token} />
    </>
  );
};

export default ConfirmEmailRoute;
