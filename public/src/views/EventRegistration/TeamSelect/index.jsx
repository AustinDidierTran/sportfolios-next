import React, { useContext, useEffect, useState } from 'react';
import TeamSearchList from '../../../components/Custom/SearchList/TeamSearchList';
import Button from '../../../components/Custom/Button';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { useFormInput } from '../../../hooks/forms';
import TeamItem from '../../../components/Custom/List/TeamItem';
import styles from './TeamSelect.module.css';
import { Store } from '../../../Store';
import { verifyTeamNameUnique } from '../../../actions/service/event/get.ts';
import WarningIcon from '@material-ui/icons/Warning';

export default function TeamSelect(props) {
  const { t } = useTranslation();
  const {
    state: { id: eventId },
  } = useContext(Store);

  const [teamNameIsUnique, setTeamNameIsUnique] = useState(true);

  const { stepHook, formik } = props;
  const query = useFormInput('');

  const { team } = formik.values;

  const verifyName = async (team) => {
    const isUnique = await verifyTeamNameUnique(team, eventId);
    setTeamNameIsUnique(isUnique);
  };

  useEffect(() => {
    if (team) {
      verifyName(team.name);
      stepHook.handleCompleted(1);
    }
  }, [team]);

  const handleClick = (e) => {
    formik.setFieldValue('team', {
      id: undefined,
      name: e.target.value.trim(),
    });
    stepHook.handleCompleted(1);
  };

  const onChange = () => {
    formik.setFieldValue('team', null);
    stepHook.handleNotCompleted(1);
  };

  if (team) {
    return (
      <div className={styles.main}>
        <Typography variant="body2" color="textSecondary" component="p" style={{ marginBottom: '8px' }}>
          {t('you.you_can_always_change_your_team_name_in_your_team_profile')}
        </Typography>
        <TeamItem {...team} secondary="Selected Team" className={styles.main} notClickable />
        {teamNameIsUnique ? (
          <>{}</>
        ) : (
          <div className={styles.warning}>
            <WarningIcon className={styles.warningIcon} />
            <Typography variant="body2" color="textSecondary" component="p" style={{ marginBottom: '8px' }}>
              {t('team.team_not_unique')}
            </Typography>
          </div>
        )}
        <Button
          className={styles.item}
          size="small"
          variant="contained"
          endIcon="Undo"
          style={{ margin: '8px' }}
          onClick={onChange}
        >
          {t('change_team')}
        </Button>
      </div>
    );
  }
  return (
    <div className={styles.main}>
      <Typography variant="body2" color="textSecondary" component="p" style={{ marginBottom: '8px' }}>
        {t('you.you_can_always_change_your_team_name_in_your_team_profile')}
      </Typography>
      <TeamSearchList
        className={styles.item}
        clearOnSelect={false}
        label={t('enter_team_name')}
        onClick={handleClick}
        query={query}
        allowCreate
        withoutIcon
        autoFocus
        formik={formik}
        eventId={eventId}
      />
    </div>
  );
}
