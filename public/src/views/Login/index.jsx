import React from 'react';
import api from '../../actions/api';
import { goTo, ROUTES } from '../../actions/goTo';
import { Store, ACTION_ENUM } from '../../Store';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { SEVERITY_ENUM, LOGIN_STATE_ENUM, PASSWORD_LENGTH_ENUM } from '../../../common/enums';
import loadable from '@loadable/component';

const LoginCard = loadable(() => import('./LoginCard'));
const SignupCard = loadable(() => import('./SignupCard'));
const ForgotPasswordCard = loadable(() => import('./ForgotPasswordCard'));

export default function Login() {
  const router = useRouter();
  const { t } = useTranslation();

  // TODO: Should be renamed redirectUrl everywhere
  const { redirectUrl } = router.query;
  const {
    state: { isAuthenticated },
    dispatch,
  } = React.useContext(Store);
  React.useEffect(() => {
    if (isAuthenticated) {
      const route = redirectUrl || ROUTES.home;
      router.push(route);
    }
  }, [isAuthenticated]);
  const validate = (values) => {
    const errors = {};
    if (formik.status.state === LOGIN_STATE_ENUM.SIGNUP) {
      if (!values.email) {
        errors.email = t('value_is_required');
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = t('invalid_email');
      }

      if (!values.firstName) {
        errors.firstName = t('value_is_required');
      }

      if (!values.lastName) {
        errors.lastName = t('value_is_required');
      }

      if (!values.password) {
        errors.password = t('value_is_required');
      } else if (
        values.password.length < PASSWORD_LENGTH_ENUM.MIN_LENGTH ||
        values.password.length > PASSWORD_LENGTH_ENUM.MAX_LENGTH
      ) {
        errors.password = t('password_length');
      }
    } else if (formik.status.state === LOGIN_STATE_ENUM.LOGIN) {
      if (!values.email) {
        errors.email = t('value_is_required');
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = t('invalid_email');
      }

      if (!values.password) {
        errors.password = t('value_is_required');
      } else if (
        values.password.length < PASSWORD_LENGTH_ENUM.MIN_LENGTH ||
        values.password.length > PASSWORD_LENGTH_ENUM.MAX_LENGTH
      ) {
        errors.password = t('password_length');
      }
    } else if (formik.status.state === LOGIN_STATE_ENUM.FORGOT_PASSWORD) {
      if (!values.email) {
        errors.email = t('value_is_required');
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = t('invalid_email');
      }
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    initialStatus: {
      state: LOGIN_STATE_ENUM.LOGIN,
    },
    validate,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values) => {
      if (formik.status.state === LOGIN_STATE_ENUM.SIGNUP) {
        const { firstName, lastName, email, password } = values;
        const res = await api('/api/auth/signup', {
          method: 'POST',
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
            redirectUrl,
          }),
        });
        if (res.status === 403) {
          formik.setFieldError('email', t('email_already_used'));
        } else if (res.status >= 400) {
          formik.setFieldError('firstName', t('something_went_wrong'));
        } else {
          goTo(ROUTES.confirmationEmailSent, { email });
        }
      } else if (formik.status.state === LOGIN_STATE_ENUM.LOGIN) {
        const { email, password } = values;
        const res = await api('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({
            email,
            password,
          }),
        });

        if (res.status === 401) {
          // Email is not validated
          await api('/api/auth/sendConfirmationEmail', {
            method: 'POST',
            body: JSON.stringify({
              email,
            }),
          });
          formik.setFieldError('email', t('email_not_confirmed'));
        } else if (res.status === 403) {
          // Password is not good
          formik.setFieldError('password', t('email_password_no_match'));
        } else if (res.status === 404) {
          formik.setStatus({ state: LOGIN_STATE_ENUM.SIGNUP });
          dispatch({
            type: Store.ACTION_ENUM.SNACK_BAR,
            message: t('you_have_no_account_with_this_email_create_one'),
            severity: SEVERITY_ENUM.INFO,
          });
        } else {
          let { data } = res;

          if (data) {
            if (typeof data === 'string') {
              data = JSON.parse(data);
            }

            const { token, userInfo } = data;

            dispatch({
              type: ACTION_ENUM.LOGIN,
              payload: token,
            });
            dispatch({
              type: ACTION_ENUM.UPDATE_USER_INFO,
              payload: userInfo,
            });
            if (redirectUrl) {
              goTo(decodeURI(redirectUrl));
            } else if (redirectUrl) {
              goTo(ROUTES.confirmEmailSuccess, null, {
                redirectUrl,
              });
            } else {
              if (formik.status.state === LOGIN_STATE_ENUM.SIGNUP) {
                goTo(ROUTES.confirmEmailSuccess);
              } else {
                goTo(ROUTES.home);
              }
            }
          }
        }
      } else if (formik.status.state === LOGIN_STATE_ENUM.FORGOT_PASSWORD) {
        const { email } = values;
        const res = await api('/api/auth/recoveryEmail', {
          method: 'POST',
          body: JSON.stringify({
            email,
          }),
        });

        if (res.status === 404) {
          // Email not found
          formik.setFieldError('email', t('email_not_found'));
          formik.setStatus({ state: LOGIN_STATE_ENUM.SIGNUP });
        }
        if (res.status === 200) {
          dispatch({
            type: Store.ACTION_ENUM.SNACK_BAR,
            message: t('confirmation_email_sent'),
          });
        }
      }
    },
  });

  if (formik.status.state === LOGIN_STATE_ENUM.SIGNUP) {
    return <SignupCard redirectUrl={redirectUrl} formik={formik} />;
  }

  if (formik.status.state === LOGIN_STATE_ENUM.FORGOT_PASSWORD) {
    return <ForgotPasswordCard formik={formik} />;
  }

  return <LoginCard formik={formik} />;
}
