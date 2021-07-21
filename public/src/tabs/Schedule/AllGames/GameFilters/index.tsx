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
import { ACTION_ENUM, Store } from '../../../../Store';
import { getMyRosters, getGameOptions } from '../../../../actions/service/entity/get';

interface IProps {
  eventId: string;
  oldFilter: IOldFilter;
  update: (
    teams: IFilterFields[],
    phases: IFilterFields[],
    fields: IFilterFields[],
    timeSlots: IFilterFields[],
    onlyYourGames: boolean
  ) => void;
}

interface IFilterFields {
  value: string;
  display: string;
}

interface IDataTeams {
  rosterId: string;
  name: string;
}

interface IOldFilter {
  onlyYourGames: boolean;
  teams: IFilterFields[];
  phases: IFilterFields[];
  fields: IFilterFields[];
  timeSlots: IFilterFields[];
}

const GameFilters: React.FunctionComponent<IProps> = (props) => {
  const { eventId, oldFilter, update } = props;
  const { t } = useTranslation();
  const {
    dispatch,
    state: { isAuthenticated },
  } = useContext(Store);

  const [teams, setTeams] = useState<IFilterFields[]>([{ value: SELECT_ENUM.ALL, display: t('all_teams') }]);
  const [phases, setPhases] = useState<IFilterFields[]>([{ value: SELECT_ENUM.ALL, display: t('all_phases') }]);
  const [fields, setFields] = useState<IFilterFields[]>([{ value: SELECT_ENUM.ALL, display: t('all_fields') }]);
  const [timeSlots, setTimeSlots] = useState<IFilterFields[]>([
    { value: SELECT_ENUM.ALL, display: t('all_time_slots') },
  ]);
  const [open, setOpen] = useState<boolean>(false);
  const [description, setDescription] = useState<string>();
  const [allTimeSlots, setAllTimeSlots] = useState<IFilterFields[]>([]);
  const [allTeams, setAllTeams] = useState<IFilterFields[]>([]);
  const [allFields, setAllFields] = useState<IFilterFields[]>([]);
  const [allPhases, setAllPhases] = useState<IFilterFields[]>([]);

  const [onlyYourGames, setOnlyYourGames] = useState<boolean>(false);

  useEffect((): void => {
    update(teams, phases, fields, timeSlots, onlyYourGames);
    getDescription();
  }, [teams, phases, fields, timeSlots, onlyYourGames]);

  useEffect((): void => {
    if (!oldFilter) {
      return;
    } else {
      getFiltersData();
      if (oldFilter.onlyYourGames) {
        getYourGames();
      }
      if (oldFilter?.teams[0].value !== SELECT_ENUM.ALL) {
        setTeams(oldFilter.teams);
      }
      if (oldFilter.phases[0].value !== SELECT_ENUM.ALL) {
        setPhases(oldFilter.phases);
      }
      if (oldFilter.fields[0].value !== SELECT_ENUM.ALL) {
        setFields(oldFilter.fields);
      }
      if (oldFilter.timeSlots[0].value !== SELECT_ENUM.ALL) {
        setTimeSlots(oldFilter.timeSlots);
      }
    }
  }, []);

  useEffect((): void => {
    if (eventId) {
      getFiltersData();
    }
  }, [eventId]);

  const getYourGames = async (): Promise<void> => {
    const data = await getMyRosters(eventId);

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
      changeTeams(data?.map((d: IDataTeams) => ({ value: d.rosterId, display: d.name })));
      setOnlyYourGames(true);
    }
  };

  const changeTeams = (teams: IFilterFields[]): void => {
    if (onlyYourGames) {
      setOnlyYourGames(false);
    }
    setTeams(teams);
  };

  const changePhaseId = (phases: IFilterFields[]): void => {
    setPhases(phases);
  };

  const changeFieldId = (fields: IFilterFields[]): void => {
    setFields(fields);
  };

  const changeTimeSlot = (timeSlot: IFilterFields[]): void => {
    setTimeSlots(timeSlot);
  };

  const getFiltersData = async (): Promise<void> => {
    const data = await getGameOptions(eventId);
    const resPhases = data.phases.map((d) => ({
      value: d.id,
      display: d.name,
    }));

    const resTimeSlots = data.timeSlots
      .map((d: any) => ({
        value: moment.utc(d.date).format('YYYY M D'),
        display: formatDate(moment.utc(d.date), 'DD MMM'),
      }))
      .reduce((prev, curr) => {
        if (prev) {
          if (!prev.map((p: any) => p.value).includes(curr.value)) {
            return [...prev, curr];
          }
          return prev;
        }
      }, []);

    const resTeams = data.teams.map((d: IDataTeams) => ({
      value: d.rosterId,
      display: d.name,
    }));

    const resFields = data.fields.map((d) => ({
      value: d.id,
      display: d.field,
    }));

    setAllPhases([{ value: SELECT_ENUM.ALL, display: t('all_phases') }, ...resPhases]);
    setAllTimeSlots([{ value: SELECT_ENUM.ALL, display: t('all_time_slots') }, ...resTimeSlots]); //maybe if data.length > 0
    setAllTeams([{ value: SELECT_ENUM.ALL, display: t('all_teams') }, ...resTeams]);
    setAllFields([{ value: SELECT_ENUM.ALL, display: t('all_fields') }, ...resFields]);
  };

  const getDescription = (): void => {
    let description = t('games');
    if (
      teams[0].value === SELECT_ENUM.ALL &&
      phases[0].value === SELECT_ENUM.ALL &&
      fields[0].value === SELECT_ENUM.ALL &&
      timeSlots[0].value === SELECT_ENUM.ALL
    ) {
      description = null;
    }
    if (teams[0].value != SELECT_ENUM.ALL) {
      if (teams.length > 1) {
        description =
          description +
          ` ${t('of_teams')}` +
          ` ${teams.map((team) => {
            return ' ' + team.display;
          })}`;
      } else {
        description = description + ` ${t('of_team')} ${teams[0].display}`;
      }
    }
    if (phases[0].value != SELECT_ENUM.ALL) {
      if (phases.length > 1) {
        description =
          description +
          ` ${t('of_phases')}` +
          ` ${phases.map((phase) => {
            return ' ' + phase.display;
          })}`;
      } else {
        description = description + ` ${t('of_phase')} ${phases[0].display}`;
      }
    }
    if (fields[0].value != SELECT_ENUM.ALL) {
      if (fields.length > 1) {
        description =
          description +
          ` ${t('on_multiple')}` +
          ` ${fields.map((field) => {
            return ' ' + field.display;
          })}`;
      } else {
        description = description + ` ${t('on')} ${fields[0].display}`;
      }
    }
    if (timeSlots[0].value != SELECT_ENUM.ALL) {
      if (timeSlots.length > 1) {
        description =
          description +
          ` ${t('on_timeslot')}` +
          ` ${timeSlots.map((timeslot) => {
            return ' ' + formatDate(moment.utc(timeslot.value), 'DD MMM');
          })}`;
      } else {
        description = description + ` ${t('on_timeslot')} ${formatDate(moment.utc(timeSlots[0].value), 'DD MMM')}`;
      }
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
    setTeams([{ value: SELECT_ENUM.ALL, display: t('all_teams') }]);
    setPhases([{ value: SELECT_ENUM.ALL, display: t('all_phases') }]);
    setFields([{ value: SELECT_ENUM.ALL, display: t('all_fields') }]);
    setTimeSlots([{ value: SELECT_ENUM.ALL, display: t('all_time_slots') }]);
    setOnlyYourGames(false);
  };

  const clearMyTeam = (): void => {
    setTeams([{ value: SELECT_ENUM.ALL, display: t('all_teams') }]);
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
              <TeamSelect allTeams={allTeams} onChange={changeTeams} teams={teams} />
              <TimeSlotSelect allTimeSlots={allTimeSlots} onChange={changeTimeSlot} timeSlots={timeSlots} />
              <PhaseSelect allPhases={allPhases} onChange={changePhaseId} phases={phases} />
              <FieldSelect allFields={allFields} onChange={changeFieldId} fields={fields} />
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
