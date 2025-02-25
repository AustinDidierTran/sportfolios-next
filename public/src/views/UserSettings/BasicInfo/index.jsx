import React, { useContext, useEffect, useState } from 'react';
import i18n from '../../../i18n';
import { useTranslation } from 'react-i18next';
import CardContent from '@material-ui/core/CardContent';
import Paper from '../../../components/Custom/Paper';
import Select from '../../../components/Custom/Select';
import styles from './BasicInfo.module.css';

import api from '../../../actions/api';
import { Store, ACTION_ENUM } from '../../../Store';
import { goTo, ROUTES } from '../../../actions/goTo';
import { REQUEST_STATUS_ENUM } from '../../../../common/enums';

export default function BasicInfo() {
  const [basicInfos, setBasicInfos] = useState([]);
  const { dispatch } = useContext(Store);
  const { t } = useTranslation();

  useEffect(() => {
    if (basicInfos.language) {
      handleChange(basicInfos.language);
    }
  }, [basicInfos.language]);

  const submit = async (values) => {
    const { language } = values;

    const res = await api(`/api/user/changeBasicUserInfo`, { method: 'POST', body: JSON.stringify({ language }) });

    if (res.status === REQUEST_STATUS_ENUM.UNAUTHORIZED) {
      // Token is expired, redirect
      goTo(ROUTES.login);
    } else if (res.status >= 400) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('something_went_wrong'),
        severity: 'error',
      });
    } else {
      basicInfos.language = language;
      i18n.changeLanguage(language);
    }
    //No error
    return true;
  };

  const handleChange = (values) => {
    submit({ language: values });
  };

  const updateData = async () => {
    const { data } = await api('/api/user/userInfo', { method: 'GET' });
    setBasicInfos(data);
  };

  useEffect(() => {
    updateData();
  }, []);

  return (
    <Paper className={styles.card}>
      <form className={styles.form}>
        <CardContent onSubmit={submit}>
          <Select
            onChange={handleChange}
            label={t('select.select_language')}
            namespace="language"
            value={basicInfos.language}
            options={[
              { value: 'en', display: 'English' },
              { value: 'fr', display: 'Français' },
            ]}
          />
        </CardContent>
      </form>
    </Paper>
  );
}
