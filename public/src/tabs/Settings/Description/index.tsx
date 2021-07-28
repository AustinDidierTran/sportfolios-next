import React, { useState, useEffect, useContext, useMemo } from 'react';

import Paper from '../../../components/Custom/Paper';
import Button from '../../../components/Custom/Button';
import TextField from '../../../components/Custom/TextField';
import { useTranslation } from 'react-i18next';
import api from '../../../actions/api';
import styles from './Description.module.css';
import { ACTION_ENUM, Store } from '../../../Store';
import { useFormik } from 'formik';
import { SEVERITY_ENUM, REQUEST_STATUS_ENUM } from '../../../../common/enums';
import { ERROR_ENUM } from '../../../../common/errors';
import { getGeneralInfos } from '../../../actions/service/entity/get';

const Description: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const {
    dispatch,
    state: { id: entityId },
  } = useContext(Store);

  useEffect((): void => {
    if (entityId) {
      getDescription();
    }
  }, [entityId]);

  const [initial, setInitial] = useState<string>('');

  const getDescription = async () => {
    const generalInfos = await getGeneralInfos(entityId);

    if (generalInfos.description) {
      setInitial(decodeURIComponent(generalInfos.description));
      formik.setFieldValue('description', decodeURIComponent(generalInfos.description));
    } else {
      setInitial('');
      formik.setFieldValue('description', '');
    }
  };

  const formik = useFormik({
    initialValues: {
      description: '',
    },
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      const { description } = values;

      const encoded = encodeURIComponent(description);
      const res = await api('/api/entity/updateGeneralInfos', {
        method: 'PUT',
        body: JSON.stringify({
          description: encoded,
          entityId,
        }),
      });
      if (res.status === REQUEST_STATUS_ENUM.ERROR) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: ERROR_ENUM.ERROR_OCCURED,
          severity: SEVERITY_ENUM.ERROR,
          duration: 4000,
        });
      } else {
        setInitial(description);
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('saved'),
          severity: SEVERITY_ENUM.SUCCESS,
          duration: 2000,
        });
      }
    },
  });

  const onCancel = (): void => {
    formik.setFieldValue('description', initial);
  };

  const disabled = useMemo((): boolean => formik.values.description === initial, [formik.values.description, initial]);

  return (
    <Paper title={t('description.description')}>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          className={styles.description}
          namespace="description"
          formik={formik}
          multiline
          rows={1}
          rowsMax={20}
          label={t('description.description')}
        />
        <div className={styles.buttons}>
          <Button type="submit" className={styles.save} size="small" endIcon="Check" disabled={disabled}>
            {t('save')}
          </Button>
          <Button
            className={styles.cancel}
            size="small"
            color="secondary"
            endIcon="Close"
            onClick={onCancel}
            disabled={disabled}
          >
            {t('cancel')}
          </Button>
        </div>
      </form>
    </Paper>
  );
};
export default Description;
