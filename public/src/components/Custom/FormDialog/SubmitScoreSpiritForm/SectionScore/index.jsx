import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import { useTranslation } from 'react-i18next';
import { STATUS_ENUM, SEVERITY_ENUM } from '../../../../../../common/enums';
import { ERROR_ENUM } from '../../../../../../common/errors';
import api from '../../../../../actions/api';
import { ACTION_ENUM, Store } from '../../../../../Store';

import styles from '../SubmitScoreSpiritForm.module.css';
import Collapse from '../../../Collapse';
import TextField from '../../../TextField';
import IconButton from '../../../IconButton';
import Button from '../../../Button';

export default function SectionScore(props) {
  const { suggestions, gameId, IsSubmittedCheck, submissionerInfos, update } = props;
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);

  const [expanded, setExpanded] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const expandedIcon = useMemo(() => (!expanded ? 'KeyboardArrowDown' : 'KeyboardArrowUp'), [expanded]);

  const validate = (values) => {
    const { scoreTeam1, scoreTeam2 } = values;
    const errors = {};
    if (scoreTeam1 < 0) {
      errors.scoreTeam1 = t(ERROR_ENUM.VALUE_IS_INVALID);
    }
    if (scoreTeam2 < 0) {
      errors.scoreTeam2 = t(ERROR_ENUM.VALUE_IS_INVALID);
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      scoreTeam1: 0,
      scoreTeam2: 0,
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      const { scoreTeam1, scoreTeam2 } = values;

      const score = {};
      score[submissionerInfos.myTeam.rosterId] = scoreTeam1;
      score[submissionerInfos.enemyTeam.rosterId] = scoreTeam2;

      const { status } = await api('/api/entity/suggestScore', {
        method: 'POST',
        body: JSON.stringify({
          game_id: gameId,
          submitted_by_roster: submissionerInfos.myTeam.rosterId,
          submitted_by_person: submissionerInfos.person.entityId,
          score: JSON.stringify(score),
        }),
      });

      if (status === STATUS_ENUM.SUCCESS) {
        submittedState(true);
      } else {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('an_error_has_occured'),
          severity: SEVERITY_ENUM.ERROR,
        });
      }
    },
  });

  const [acceptedOrRefused, setAcceptedOrRefused] = useState(false);
  const handleAcceptSuggestion = async () => {
    const { status } = await api('/api/entity/acceptScore', {
      method: 'POST',
      body: JSON.stringify({
        id: enemyScoreSuggestion.id,
        submitted_by_roster: submissionerInfos.myTeam.rosterId,
        submitted_by_person: submissionerInfos.person.entityId,
      }),
    });

    if (status === STATUS_ENUM.SUCCESS) {
      update();
      setAcceptedOrRefused(true);
      submittedState(true);
    } else {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('an_error_has_occured'),
        severity: SEVERITY_ENUM.ERROR,
      });
    }
  };

  const handleRefuseSuggestion = () => {
    setAcceptedOrRefused(true);
  };

  const submittedState = (submitted) => {
    setIsSubmitted(submitted);
  };

  const myScoreSuggestion = useMemo(
    () => suggestions?.find((s) => s.submitted_by_roster === submissionerInfos.myTeam.rosterId),
    [suggestions]
  );
  const enemyScoreSuggestion = useMemo(
    () => suggestions?.find((s) => s.submitted_by_roster === submissionerInfos.enemyTeam.rosterId),
    [suggestions]
  );
  const showSuggestion = useMemo(() => enemyScoreSuggestion && !myScoreSuggestion && !acceptedOrRefused, [
    myScoreSuggestion,
    enemyScoreSuggestion,
    acceptedOrRefused,
  ]);

  useEffect(() => {
    if (myScoreSuggestion) {
      submittedState(true);
      formik.setFieldValue('scoreTeam1', myScoreSuggestion.score[submissionerInfos.myTeam.rosterId]);
      formik.setFieldValue('scoreTeam2', myScoreSuggestion.score[submissionerInfos.enemyTeam.rosterId]);
    } else if (enemyScoreSuggestion) {
      formik.setFieldValue('scoreTeam1', enemyScoreSuggestion.score[submissionerInfos.myTeam.rosterId]);
      formik.setFieldValue('scoreTeam2', enemyScoreSuggestion.score[submissionerInfos.enemyTeam.rosterId]);
    }
  }, [suggestions]);

  const getChipStyle = (status) => {
    switch (status) {
      case STATUS_ENUM.ACCEPTED:
        return { border: '1px solid #18B393', color: '#18B393 ' };
      case STATUS_ENUM.REFUSED:
        return { border: '1px solid #f44336', color: '#f44336 ' };
      case STATUS_ENUM.PENDING:
        return { border: '1px solid #dddd00', color: '#dddd00 ' };
      default:
        return { border: '1px solid #18B393', color: '#18B393 ' };
    }
  };

  return (
    <div>
      <div className={styles.collapseHeader} onClick={() => setExpanded(!expanded)}>
        <Typography>{t('score.score')}</Typography>
        <div className={styles.expand}>
          {isSubmitted ? IsSubmittedCheck : <></>}
          <IconButton
            className={styles.arrowButton}
            aria-expanded={expanded}
            icon={expandedIcon}
            style={{
              color: 'primary',
            }}
          />
        </div>
      </div>
      <Divider />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <div>
          {showSuggestion && enemyScoreSuggestion.status === STATUS_ENUM.PENDING && !acceptedOrRefused ? (
            <Typography className={styles.suggestedBy}>{'*' + t('suggested_by_the_other_team')}</Typography>
          ) : (
            <></>
          )}
          <div className={styles.scores}>
            <Typography className={styles.teamName}>{`${submissionerInfos.myTeam.name}: (${t(
              'you.your_team'
            )})`}</Typography>
            <TextField
              type="number"
              namespace="scoreTeam1"
              formik={formik}
              formikDisabled={isSubmitted || showSuggestion}
            />
            <Typography className={styles.teamName}>{`${submissionerInfos.enemyTeam.name}:`}</Typography>
            <TextField
              type="number"
              namespace="scoreTeam2"
              formik={formik}
              formikDisabled={isSubmitted || showSuggestion}
            />
          </div>
        </div>
        {showSuggestion && enemyScoreSuggestion.status === STATUS_ENUM.PENDING && !acceptedOrRefused ? (
          <div className={styles.divSubmitScoreButton}>
            <div className={styles.acceptRefuseScore}>
              <Button
                color={'primary'}
                onClick={handleAcceptSuggestion}
                className={styles.acceptButton}
                variant="outlined"
              >
                {t('accept')}
              </Button>
              <Button
                color={'secondary'}
                onClick={handleRefuseSuggestion}
                className={styles.refuseButton}
                variant="outlined"
              >
                {t('refuse')}
              </Button>
            </div>
          </div>
        ) : (
          <div className={styles.divSubmitScoreButton}>
            {myScoreSuggestion ? (
              <Chip
                className={styles.submitButton}
                label={t(myScoreSuggestion.status)}
                style={getChipStyle(myScoreSuggestion.status)}
                variant="outlined"
              />
            ) : (
              <Button
                className={styles.submitButton}
                onClick={() => formik.handleSubmit()}
                color={'primary'}
                variant="outlined"
                disabled={isSubmitted || showSuggestion}
              >
                {t('submit')}
              </Button>
            )}
          </div>
        )}
      </Collapse>
    </div>
  );
}
