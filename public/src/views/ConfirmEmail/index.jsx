import React, { useContext } from "react";

import { Container } from "../../components/Custom";
import styles from "./ConfirmEmail.module.css";
import api from "../../actions/api";
import { goTo, ROUTES } from "../../actions/goTo";
import { Store, ACTION_ENUM } from "../../Store";
import { useRouter } from "next/router";

export default function ConfirmEmail() {
  const router = useRouter();
  const { redirectUrl, token } = router.query;
  const { dispatch } = useContext(Store);

  const confirmEmail = async () => {
    const res = await api("/api/auth/confirmEmail", {
      method: "POST",
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
  }, []);

  return (
    <div className={styles.main}>
      <Container>
        <p>
          Hey, we are now trying to confirm your email, please wait a moment...
        </p>
      </Container>
    </div>
  );
}
