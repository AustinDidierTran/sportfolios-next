import React, { useContext, useEffect, useMemo, useState } from 'react';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Typography from '@material-ui/core/Typography';

import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { REQUEST_STATUS_ENUM, SEVERITY_ENUM } from '../../../../../../common/enums';
import { ACTION_ENUM, Store } from '../../../../../Store';
import styles from '../SubmitScoreSpiritForm.module.css';
import TextField from '../../../TextField';
import IconButton from '../../../IconButton';
import Collapse from '../../../Collapse';
import Button from '../../../Button';
import { SpiritSubmission, SubmissionerInfos } from '../../../../../../../typescript/types';
import { submitSpirit } from '../../../../../actions/service/game/index';

interface IProps {
  submittedSpirit: SpiritSubmission;
  gameId: string;
  IsSubmittedCheck: JSX.Element;
  submissionerInfos: SubmissionerInfos;
}

const spiritCategories = [
  'rules_knowledge_and_use',
  'fouls_and_body_contact',
  'fair_mindedness',
  'positive_attitude_and_self_control',
  'communication',
];

interface SpiritValues {
  [key: string]: number;
}

const SectionSpirit: React.FunctionComponent<IProps> = (props) => {
  const { submittedSpirit, gameId, IsSubmittedCheck, submissionerInfos } = props;
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);

  const initialSpiritValues: SpiritValues = spiritCategories.reduce(
    (prev, curr) => ({
      ...prev,
      [curr]: 2,
    }),
    {}
  );

  const formik = useFormik({
    initialValues: {
      spirit: initialSpiritValues,
      comment: '',
    },
    onSubmit: async (values) => {
      const { spirit, comment } = values;

      submitSpirit(
        submissionerInfos.myTeam.rosterId,
        submissionerInfos.person.entityId,
        gameId,
        submissionerInfos.enemyTeam.rosterId,
        Object.values(spirit).reduce((a, b) => a + b, 0),
        spirit,
        comment
      ).then((status) => {
        if (status === REQUEST_STATUS_ENUM.SUCCESS) {
          submittedState(true);
        } else {
          dispatch({
            type: ACTION_ENUM.SNACK_BAR,
            message: t('an_error_has_occured'),
            severity: SEVERITY_ENUM.ERROR,
          });
        }
      });
    },
  });

  const [expanded, setExpanded] = useState<boolean>(true);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(true);
  const expandedIcon = useMemo(
    (): 'KeyboardArrowUp' | 'KeyboardArrowDown' => (!expanded ? 'KeyboardArrowDown' : 'KeyboardArrowUp'),
    [expanded]
  );
  const spiritTotal = useMemo(
    (): number => Object.values(formik.values.spirit).reduce((a, b) => a + b, 0),
    [formik.values.spirit]
  );

  useEffect((): void => {
    submittedState(Boolean(submittedSpirit?.spiritScore));
  }, [submittedSpirit]);

  const submittedState = (submitted: boolean): void => {
    setExpanded(!submitted);
    setIsSubmitted(submitted);
  };

  const handleRadioChange = (event: any): void => {
    formik.setFieldValue(`spirit[${event.target.name.substring(1)}]`, Number(event.target.value));
  };

  const RadioButtons = spiritCategories.map((category, indexCategory) => (
    <FormControl className={styles.radioGroup} component="fieldset" key={indexCategory} size="small">
      <FormLabel component="legend">{`${indexCategory + 1}. ${t(category)}`}</FormLabel>
      <RadioGroup
        className={styles.radioGroupContainer}
        row
        name={`r${category}`}
        onChange={handleRadioChange}
        value={formik.values.spirit[category]}
      >
        {Array(5)
          .fill(0)
          .map((_, indexRadioButton) => (
            <FormControlLabel
              className={styles.radioGroupControlLabel}
              key={indexRadioButton}
              value={indexRadioButton}
              control={<Radio color="primary" size="small" disabled={isSubmitted} />}
              label={indexRadioButton}
              labelPlacement="bottom"
            />
          ))}
      </RadioGroup>
    </FormControl>
  ));

  return (
    <div>
      <div className={styles.collapseHeader} onClick={() => setExpanded(!expanded)}>
        <Typography>{t('spirit')}</Typography>
        <div className={styles.expand}>
          {isSubmitted ? IsSubmittedCheck : null}
          <IconButton
            className={styles.arrowButton}
            aria-expanded={expanded}
            icon={expandedIcon}
            style={{ color: 'primary' }}
          />
        </div>
      </div>
      <Divider />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {isSubmitted ? (
          <div>
            <Typography className={styles.totalSpirit}>{`Total: ${
              submittedSpirit?.spiritScore || spiritTotal
            }`}</Typography>
            {formik.values.comment ? (
              <TextField type="text" value={submittedSpirit?.comment} fullWidth formikDisabled />
            ) : null}
          </div>
        ) : (
          <div>
            <Typography className={styles.spiritChart} color="textSecondary">
              {t('spirit_chart_ligue_mardi')}
            </Typography>
            {RadioButtons}
            <Typography className={styles.totalSpirit}>{`Total: ${spiritTotal}`}</Typography>
            <TextField type="text" namespace="comment" placeholder={t('comments')} formik={formik} fullWidth />
          </div>
        )}
        {!isSubmitted ? (
          <div className={styles.divSubmitButton}>
            <Button
              className={styles.submitButton}
              onClick={() => formik.handleSubmit()}
              color={'primary'}
              variant="outlined"
            >
              {t('submit')}
            </Button>
          </div>
        ) : null}
      </Collapse>
    </div>
  );
};
export default SectionSpirit;
