import React, { useState, useEffect, useContext, useMemo } from 'react';

import Paper from '../../../components/Custom/Paper';
import Button from '../../../components/Custom/Button';
import TextField from '../../../components/Custom/TextField';
import { useTranslation } from 'react-i18next';
import api from '../../../actions/api';
import styles from './QuickDescription.module.css';
import { formatRoute } from '../../../utils/stringFormats';
import { ACTION_ENUM, Store } from '../../../Store';
import { useFormik } from 'formik';
import { SEVERITY_ENUM, STATUS_ENUM } from '../../../../common/enums';
import { ERROR_ENUM } from '../../../../common/errors';

export default function Description() {
  const { t } = useTranslation();
  const {
    dispatch,
    state: { id: entityId },
  } = useContext(Store);

  useEffect(() => {
    if (entityId) {
      getDescription();
    }
  }, [entityId]);

  const [initial, setInitial] = useState('');

  const getDescription = async () => {
    const { data } = await api(
      formatRoute('/api/entity/generalInfos', null, {
        entityId,
      })
    );
    if (data.quickDescription) {
      setInitial(decodeURIComponent(data.quickDescription));
      formik.setFieldValue('description', decodeURIComponent(data.quickDescription));
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
          quickDescription: encoded,
          entityId,
        }),
      });
      if (res.status === STATUS_ENUM.ERROR) {
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

  const onCancel = () => {
    formik.setFieldValue('description', initial);
  };

  const disabled = useMemo(() => {
    return formik.values.description === initial;
  }, [formik.values.description, initial]);

  return (
    <Paper title="Description">
      <form onSubmit={formik.handleSubmit}>
        <TextField
          className={styles.description}
          namespace="description"
          formik={formik}
          multiline
          rows={1}
          rowsMax={5}
          label={t('quick_description')}
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
}
