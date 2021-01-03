import { useRouter } from "next/router";
import React, { useContext } from "react";
import { goTo, ROUTES } from "../../../public/src/actions/goTo";
import { ACTION_ENUM, Store } from "../../../public/src/Store";
import ConfirmationEmailSent from "../../../public/src/views/ConfirmationEmailSent";

const ConfirmationEmailSentRoute = () => {
  const router = useRouter();
  const { email } = router.query;
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

  return <ConfirmationEmailSent email={email} />;
};

export default ConfirmationEmailSentRoute;
