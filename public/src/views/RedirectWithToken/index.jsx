import React, { useContext, useEffect } from 'react';
import { REQUEST_STATUS_ENUM } from '../../../common/enums';
import { Store, ACTION_ENUM } from '../../Store';
import { goTo } from '../../actions/goTo';
import Container from '@material-ui/core/Container';
import api from '../../actions/api';
import { useRouter } from 'next/router';
import { formatRoute } from '../../utils/stringFormats';

export default function RedirectWithToken() {
  const router = useRouter();
  const { token, url } = router.query;
  const realUrl = decodeURI(url);
  const { dispatch } = useContext(Store);
  const login = async () => {
    if (!token) {
      return;
    }
    const res = await api(
      formatRoute('/api/auth/loginWithToken', null, {
        token,
      }),
      { method: 'GET' }
    );
    if (res.status === REQUEST_STATUS_ENUM.SUCCESS) {
      dispatch({
        type: ACTION_ENUM.LOGIN,
        payload: {
          authToken: token,
          userInfo: res.data,
          route: realUrl,
        },
      });
    } else {
      goTo(realUrl);
    }
  };

  useEffect(() => {
    login();
  }, [token]);

  return (
    <div>
      <Container>
        <p>Redirecting you...</p>
      </Container>
    </div>
  );
}
