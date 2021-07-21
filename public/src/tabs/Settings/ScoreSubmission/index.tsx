import React, { useState, useEffect, useContext, useMemo } from 'react';

import Paper from '../../../components/Custom/Paper';
import Button from '../../../components/Custom/Button';
import CheckBox from '../../../components/Custom/CheckBox';
import { useTranslation } from 'react-i18next';
import styles from './ScoreSubmission.module.css';
import { ACTION_ENUM, Store } from '../../../Store';
import { useFormik } from 'formik';
import { SEVERITY_ENUM, REQUEST_STATUS_ENUM } from '../../../../common/enums';
import { ERROR_ENUM } from '../../../../common/errors';
import { getHasSpirit } from '../../../actions/service/entity/get';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { updateHasSpirit } from '../../../actions/service/entity/put';

const ScoreSubmission: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const {
    dispatch,
    state: { id: entityId },
  } = useContext(Store);

  useEffect((): void => {
    if (entityId) {
      getScoreSubmissionSetting();
    }
  }, [entityId]);

  const [initial, setInitial] = useState<boolean>(false);

  const handleChecked = (): void => {
    formik.setFieldValue('spiritSubmission', !spiritSubmission);
  };

  const getScoreSubmissionSetting = (): void => {
    getHasSpirit(entityId).then((spirit) => {
      setInitial(spirit);
      formik.setFieldValue('spiritSubmission', spirit);
    });
  };

  const formik = useFormik({
    initialValues: {
      spiritSubmission: false,
    },
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      const { spiritSubmission } = values;

      updateHasSpirit(entityId, spiritSubmission).then((status) => {
        if (status === REQUEST_STATUS_ENUM.ERROR) {
          dispatch({
            type: ACTION_ENUM.SNACK_BAR,
            message: ERROR_ENUM.ERROR_OCCURED,
            severity: SEVERITY_ENUM.ERROR,
            duration: 4000,
          });
        } else {
          setInitial(spiritSubmission);
          dispatch({
            type: ACTION_ENUM.SNACK_BAR,
            message: t('saved'),
            severity: SEVERITY_ENUM.SUCCESS,
            duration: 2000,
          });
        }
      });
    },
  });

  const spiritSubmission = useMemo((): boolean => formik.values.spiritSubmission, [formik.values.spiritSubmission]);

  const onCancel = (): void => {
    formik.setFieldValue('spiritSubmission', initial);
  };

  const disabled = useMemo(
    (): boolean => formik.values.spiritSubmission === initial,
    [formik.values.spiritSubmission, initial]
  );

  return (
    <Paper title={t('score.score_submission_settings')}>
      <form onSubmit={formik.handleSubmit}>
        <List>
          <ListItem>
            <CheckBox
              style={{ marginBottom: '6px' }}
              label={t('have_spirit')}
              checked={spiritSubmission}
              formik={formik}
              onChange={handleChecked}
            />
          </ListItem>
        </List>
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
export default ScoreSubmission;
