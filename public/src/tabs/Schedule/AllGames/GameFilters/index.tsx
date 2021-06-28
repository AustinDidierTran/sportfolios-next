import React, { useState, useEffect, useContext } from 'react';
import { Button } from '../../../../components/Custom';
import MUIButton from '@material-ui/core/Button';
import styles from './GameFilters.module.css';
import { SELECT_ENUM, SEVERITY_ENUM } from '../../../../../common/enums';
import moment from 'moment';
import TeamSelect from './TeamSelect';
import PhaseSelect from './PhaseSelect';
import FieldSelect from './FieldSelect';
import TimeSlotSelect from './TimeSlotSelect';
import { useTranslation } from 'react-i18next';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { formatDate } from '../../../../utils/stringFormats';
import Typography from '@material-ui/core/Typography';
import { formatRoute } from '../../../../utils/stringFormats';
import api from '../../../../actions/api';
import { ACTION_ENUM, Store } from '../../../../Store';

interface IProps {
  eventId: string;
  oldFilter: IOldFilter;
  update: (
    teamId: string,
    teamName: string,
    phaseId: string,
    phaseName: string,
    fieldId: string,
    fieldName: string,
    timeSlot: string,
    onlyYourGames: boolean
  ) => void;
}

interface IOldFilter {
  onlyYourGames: boolean;
  teamId: string;
  teamName: string;
  phaseId: string;
  phaseName: string;
  fieldId: string;
  fieldName: string;
  timeSlot: string;
}

const GameFilters: React.FunctionComponent<IProps> = (props) => {
  const { eventId, oldFilter, update } = props;
  const { t } = useTranslation();
  const {
    dispatch,
    state: { isAuthenticated },
  } = useContext(Store);

  const [teamId, setTeamId] = useState<string>(SELECT_ENUM.ALL);
  const [teamName, setTeamName] = useState<string>('');
  const [phaseId, setPhaseId] = useState<string>(SELECT_ENUM.ALL);
  const [phaseName, setPhaseName] = useState<string>('');
  const [fieldId, setFieldId] = useState<string>(SELECT_ENUM.ALL);
  const [fieldName, setFieldName] = useState<string>('');
  const [timeSlot, setTimeSlot] = useState<string>(SELECT_ENUM.ALL);
  const [open, setOpen] = useState<boolean>(false);
  const [description, setDescription] = useState<string>();

  const [onlyYourGames, setOnlyYourGames] = useState<boolean>(false);

  useEffect((): void => {
    update(teamId, teamName, phaseId, phaseName, fieldId, fieldName, timeSlot, onlyYourGames);
    getDescription();
  }, [teamId, phaseId, fieldId, timeSlot, onlyYourGames]);

  useEffect((): void => {
    if (!oldFilter) {
      return;
    } else {
      if (oldFilter.onlyYourGames) {
        getYourGames();
      }
      if (oldFilter.teamId !== SELECT_ENUM.ALL) {
        setTeamName(oldFilter.teamName);
        setTeamId(oldFilter.teamId);
      }
      if (oldFilter.phaseId !== SELECT_ENUM.ALL) {
        setPhaseName(oldFilter.phaseName);
        setPhaseId(oldFilter.phaseId);
      }
      if (oldFilter.fieldId !== SELECT_ENUM.ALL) {
        setFieldName(oldFilter.fieldName);
        setFieldId(oldFilter.fieldId);
      }
      if (oldFilter.timeSlot !== SELECT_ENUM.ALL) {
        setTimeSlot(oldFilter.timeSlot);
      }
    }
  }, []);

  const getYourGames = async (): Promise<void> => {
    const { data } = await api(formatRoute('/api/entity/myRosters', null, { eventId }));

    if (!data) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('login_to_see_your_games'),
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
    } else if (isAuthenticated && !data.length) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('no.no_games'),
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
    } else {
      if (data.length > 1) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('you.you_have_more_than_one_team_in_event', { team: data[0].name }),
          severity: SEVERITY_ENUM.INFO,
          duration: 4000,
        });
      }
      changeTeam({ value: data[0].roster_id, display: data[0].name });
      setOnlyYourGames(true);
    }
  };

  const changeTeam = (team: { value: string; display: string }): void => {
    if (onlyYourGames) {
      setOnlyYourGames(false);
    }
    const { value, display } = team;
    setTeamName(display);
    setTeamId(value);
  };

  const changePhaseId = (phase: { value: string; display: string }): void => {
    const { value, display } = phase;
    setPhaseId(value);
    setPhaseName(display);
  };

  const changeFieldId = (field: { value: string; display: string }): void => {
    const { value, display } = field;
    setFieldId(value);
    setFieldName(display);
  };

  const changeTimeSlot = (timeSlot: string): void => {
    setTimeSlot(timeSlot);
  };

  const getDescription = (): void => {
    let description = t('games');
    if (
      teamId === SELECT_ENUM.ALL &&
      phaseId === SELECT_ENUM.ALL &&
      fieldId === SELECT_ENUM.ALL &&
      timeSlot === SELECT_ENUM.ALL
    ) {
      description = null;
    }
    if (teamId != SELECT_ENUM.ALL) {
      description = description + ` ${t('of_team')} ${teamName}`;
    }
    if (phaseId != SELECT_ENUM.ALL) {
      description = description + ` ${t('of')} ${phaseName}`;
    }
    if (fieldId != SELECT_ENUM.ALL) {
      description = description + ` ${t('on')} ${fieldName}`;
    }
    if (timeSlot != SELECT_ENUM.ALL) {
      description = description + ` ${t('on_le_in_french')} ${formatDate(moment.utc(timeSlot), 'DD MMM')}`;
    }
    setDescription(description);
  };

  const openDialog = (): void => {
    setOpen(true);
  };

  const closeDialog = (): void => {
    setOpen(false);
  };

  const clearAll = (): void => {
    setTeamId(SELECT_ENUM.ALL);
    setTeamName('');
    setPhaseId(SELECT_ENUM.ALL);
    setPhaseName('');
    setFieldId(SELECT_ENUM.ALL);
    setFieldName('');
    setTimeSlot(SELECT_ENUM.ALL);
    setOnlyYourGames(false);
  };

  const clearMyTeam = (): void => {
    setTeamName('');
    setTeamId(SELECT_ENUM.ALL);
    setOnlyYourGames(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={closeDialog}
        aria-labelledby="form-dialog-title"
        className={styles.dialog}
        maxWidth={'xs'}
        fullWidth
      >
        <DialogTitle id="form-dialog-title">{t('filters')}</DialogTitle>
        <div>
          <DialogContent>
            <div className={styles.select}>
              <TeamSelect onChange={changeTeam} teamId={teamId} />
              <TimeSlotSelect onChange={changeTimeSlot} timeSlot={timeSlot} />
              <PhaseSelect onChange={changePhaseId} phaseId={phaseId} />
              <FieldSelect onChange={changeFieldId} fieldId={fieldId} />
            </div>
            <DialogContentText className={styles.description}>{description}</DialogContentText>
            <Button size="small" variant="contained" onClick={clearAll}>
              {t('clear_all')}
            </Button>
          </DialogContent>
          <DialogActions>
            <MUIButton onClick={closeDialog} color="primary">
              {t('finish')}
            </MUIButton>
          </DialogActions>
        </div>
      </Dialog>
      <Button
        size="small"
        variant="contained"
        endIcon={onlyYourGames ? 'PeopleIcon' : 'Person'}
        style={{ marginLeft: '12px ', marginRight: '12px' }}
        onClick={onlyYourGames ? clearMyTeam : getYourGames}
      >
        {onlyYourGames ? t('all_games') : t('you.your_games')}
      </Button>
      <Button
        size="small"
        variant="contained"
        endIcon="Add"
        style={{ marginLeft: '12px', marginRight: '12px' }}
        onClick={openDialog}
      >
        {t('filters')}
      </Button>
      <Typography style={{ marginTop: '8px' }} variant="body2" color="textSecondary">
        {description}
      </Typography>
    </>
  );
};
export default GameFilters;
