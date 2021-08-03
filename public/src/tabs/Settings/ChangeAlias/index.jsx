import React, { useState, useEffect } from 'react';

import { Button, Paper, TextField } from '../../../components/Custom';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { goTo, ROUTES } from '../../../actions/goTo';
import api from '../../../actions/api';
import styles from './ChangeAlias.module.css';
import { useFormik } from 'formik';
import { REQUEST_STATUS_ENUM, SEVERITY_ENUM, TABS_ENUM } from '../../../../common/enums';
import { useContext } from 'react';
import { Store, ACTION_ENUM } from '../../../Store';
import { ERROR_ENUM } from '../../../../common/errors';
import validator from 'validator';
import { formatRoute } from '../../../utils/stringFormats';

export default function ChangeAlias() {
  const { t } = useTranslation();
  const {
    dispatch,
    state: { id: entityId },
  } = useContext(Store);

  const [edit, setEdit] = useState(false);

  const [theAlias, setTheAlias] = useState(null);

  useEffect(() => {
    if (entityId) {
      getAlias();
    }
  }, [entityId]);

  useEffect(() => {
    formik.setFieldValue('alias', theAlias);
  }, [theAlias]);

  const getAlias = async () => {
    const { data } = await api(formatRoute('/api/entity/alias', null, { entityId }), { method: 'GET' });
    setTheAlias(data?.alias);
  };

  const validate = (values) => {
    const { alias } = values;
    const errors = {};
    if (!alias) {
      errors.alias = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    } else if (!/^[\w.-]+$/.test(alias)) {
      errors.alias = t('invalid.invalid_alias');
    } else if (
      validator.isUUID(alias) ||
      Object.values(ROUTES)
        .map((r) => r.split('/')[1].toLowerCase())
        .includes(alias.toLowerCase())
    ) {
      errors.alias = t(ERROR_ENUM.VALUE_IS_INVALID);
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      alias: '',
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      const { alias } = values;
      const res = await api('/api/entity/alias', { method: 'PUT', body: JSON.stringify({ entityId, alias }) });
      if (res.status === REQUEST_STATUS_ENUM.ERROR) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('alias_is_already_used'),
          severity: SEVERITY_ENUM.ERROR,
        });
      } else {
        setEdit(false);
        setTheAlias(alias);
        goTo(ROUTES.entity, { id: entityId }, { tab: TABS_ENUM.SETTINGS });
      }
    },
  });

  const onEdit = () => {
    setEdit(true);
  };

  const onCancel = () => {
    setEdit(false);
  };

  if (edit) {
    return (
      <Paper title={t('alias')}>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            namespace="alias"
            label={t('alias')}
            formik={formik}
            type="text"
            fullWidth
            className={styles.textfield}
            autoFocus
          />
          <div className={styles.buttons}>
            <Button size="small" color="primary" className={styles.save} type="submit" endIcon="Check">
              {t('save')}
            </Button>
            <Button size="small" color="secondary" className={styles.cancel} endIcon="Close" onClick={onCancel}>
              {t('cancel')}
            </Button>
          </div>
        </form>
      </Paper>
    );
  }
  if (theAlias) {
    return (
      <Paper title={t('alias')}>
        <Typography>{theAlias}</Typography>
        <Button size="small" variant="contained" endIcon="Edit" style={{ margin: '8px' }} onClick={onEdit}>
          {t('edit.edit')}
        </Button>
      </Paper>
    );
  }

  return (
    <Paper title={t('alias')}>
      <Typography>{t('no.no_alias')}</Typography>
      <Button
        size="small"
        variant="contained"
        endIcon="Edit"
        style={{ margin: '8px' }}
        onClick={onEdit}
        className={styles.button}
      >
        {t('edit.edit')}
      </Button>
    </Paper>
  );
}
