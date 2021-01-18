import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import ConfirmEmail from '../../../public/src/views/ConfirmEmail';
import { ACTION_ENUM, Store } from '../../../public/src/Store';
import api from '../../../public/src/actions/api';
import { goTo, ROUTES } from '../../../public/src/actions/goTo';

const ConfirmEmailRoute = () => {
  const router = useRouter();
  const { redirectUrl, token } = router.query;

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

  return <ConfirmEmail redirectUrl={redirectUrl} token={token} />;
};

export default ConfirmEmailRoute;
