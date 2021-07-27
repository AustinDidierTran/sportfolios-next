import React, { useContext, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { ACTION_ENUM, Store } from '../../../public/src/Store';
import { goTo, ROUTES } from '../../../public/src/actions/goTo';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { IMAGE_ENUM } from '../../../public/common/enums';
import dynamic from 'next/dynamic';
import { confirmEmail as confirmEmailApi } from '../../../public/src/actions/service/entity/post';

const ConfirmEmail = dynamic(() => import('../../../public/src/views/ConfirmEmail'));

const ConfirmEmailRoute: React.FunctionComponent = () => {
  const router = useRouter();
  const { redirectUrl, token: tokenProps } = router.query;
  const { t } = useTranslation();

  const { dispatch } = useContext(Store);

  useEffect(() => {
    confirmEmail();
  }, []);

  const token = useMemo(() => {
    if (Array.isArray(tokenProps)) {
      return tokenProps[0];
    }
    return tokenProps;
  }, [tokenProps]);

  const confirmEmail = async (): Promise<void> => {
    if (!token) {
      return;
    }
    const res = await confirmEmailApi(token);

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

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.confirmEmail.title')} />
        <meta property="og:description" content={t('metadata.confirmEmail.description')} />
        <meta property="og:image" content={IMAGE_ENUM.SPORTFOLIOS_BANNER} />
      </Head>
      <ConfirmEmail />
    </>
  );
};

export default ConfirmEmailRoute;
