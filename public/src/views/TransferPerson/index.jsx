import React, { useContext, useState, useEffect } from 'react';
import Container from '../../components/Custom/Container';
import api from '../../actions/api';
import { goTo, ROUTES } from '../../actions/goTo';
import { Store, ACTION_ENUM } from '../../Store';
import validator from 'validator';
import RegisterCard from './RegisterCard';
import styles from './TransferPerson.module.css';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { LOGO_ENUM, REQUEST_STATUS_ENUM } from '../../../common/enums';
import { useRouter } from 'next/router';
import { formatRoute } from '../../utils/stringFormats';

export default function TransferPerson() {
  const router = useRouter();
  const { token } = router.query;

  const { dispatch } = useContext(Store);
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [personId, setPersonId] = useState();

  const fetchTransferInfos = async () => {
    if (!validator.isUUID(token)) {
      goTo(ROUTES.entityNotFound);
      return;
    }
    const res = await api(formatRoute('/api/user/transferPerson', null, { token }), { method: 'GET' });

    if (res.status === REQUEST_STATUS_ENUM.ERROR) {
      goTo(ROUTES.entityNotFound);
      return;
    }
    const { email, personId, isPending, userInfo, authToken } = res.data;
    if (!isPending) {
      goTo(ROUTES.transferPersonExpired);
      return;
    }
    if (userInfo) {
      dispatch({
        type: ACTION_ENUM.CLEAR_USER_INFO,
      });
      dispatch({
        type: ACTION_ENUM.LOGIN,
        payload: {
          authToken,
          params: { personId },
          userInfo: userInfo,
        },
      });
      goTo(ROUTES.userSettings);
      return;
    }

    dispatch({
      type: ACTION_ENUM.CLEAR_USER_INFO,
    });

    formik.setFieldValue('email', email);
    setPersonId(personId);
    setIsLoading(false);
  };

  useEffect(() => {
    if (token) {
      fetchTransferInfos();
    }
  }, [token]);

  const validate = (values) => {
    const errors = {};

    if (!values.password) {
      errors.password = t('value_is_required');
    } else if (values.password.length < 8 || values.password.length > 24) {
      errors.password = t('password_length');
    }
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validate,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values) => {
      const { email, password } = values;

      const res = await api('/api/auth/transferPersonSignup', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          personId,
        }),
      });
      if (res.status === REQUEST_STATUS_ENUM.ERROR) {
        formik.setFieldError('password', t('something_went_wrong'));
      } else {
        dispatch({
          type: ACTION_ENUM.LOGIN,
          payload: {
            authToken: res.data.authToken,
            userInfo: res.data.userInfo,
          },
        });
        goTo(ROUTES.home);
      }
    },
  });

  if (isLoading) {
    return (
      <div className={styles.center}>
        <p className={styles.text}>Redirecting you...</p>
      </div>
    );
  }

  return (
    <div>
      <Container className={styles.container}>
        <div className={styles.logo}>
          <img className={styles.img} src={LOGO_ENUM.LOGO_512X512} />
        </div>
        <RegisterCard formik={formik} />
      </Container>
    </div>
  );
}
