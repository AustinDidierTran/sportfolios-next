import React, { useMemo, useEffect, useState, useContext } from 'react';

import Paper from '../../../components/Custom/Paper';
import AlertDialog from '../../../components/Custom/Dialog/AlertDialog';
import IconButton from '../../../components/Custom/IconButton';
import Icon from '../../../components/Custom/Icon';
import LoadingSpinner from '../../../components/Custom/LoadingSpinner';
import Button from '../../../components/Custom/Button';

import withStyles from '@material-ui/core/styles/withStyles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import styles from './TeamsRegistered.module.css';
import { useTranslation } from 'react-i18next';
import { unregisterTeams } from '../../../actions/api/helpers';
import { SEVERITY_ENUM, STATUS_ENUM } from '../../../../common/enums';
import { ERROR_ENUM } from '../../../../common/errors';
import { Store, ACTION_ENUM } from '../../../Store';
import { goTo, ROUTES } from '../../../actions/goTo';
import TeamRow from './TeamRow';
import TeamRowMobile from './TeamRowMobile';
import MailtoButton from '../../../components/Custom/MailToButton';
import { useWindowSize } from '../../../hooks/window';
import { MOBILE_WIDTH } from '../../../../common/constants';
import { EventTeam } from '../../../../../typescript/types';
import {
  getCanUnregisterTeamsList as getCanUnregisterTeamsListApi,
  getAllTeamsRegisteredInfos,
  getEventInfo,
  getAllTeamsAcceptedRegistered,
} from '../../../actions/service/entity/get';

const TeamsRegistered: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const {
    dispatch,
    state: { id: eventId },
  } = useContext(Store);
  const [width] = useWindowSize();

  const [teams, setTeams] = useState<EventTeam[]>([]);
  const [teamsThatCanBeUnregistered, setTeamsThatCanBeUnregistered] = useState<EventTeam[]>([]);
  const [maximumSpots, setMaximumSpots] = useState<number>();
  const [acceptedSpots, setAcceptedSpots] = useState<number>();
  const [openUnregister, setOpenUnregister] = useState<boolean>(false);
  const [openUnregisterAll, setOpenUnregisterAll] = useState<boolean>(false);
  const [rosterId, setRosterId] = useState<string>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [teamAsc, setTeamAsc] = useState<boolean>(null);
  const [optionAsc, setOptionAsc] = useState<boolean>(null);
  const [statusAsc, setStatusAsc] = useState<boolean>(null);
  const [memberAsc, setMemberAsc] = useState<boolean>(null);

  const iconTeam = useMemo<string>(() => {
    if (teamAsc == null) {
      return 'KeyboardArrowRight';
    }
    setOptionAsc(null);
    setStatusAsc(null);
    setMemberAsc(null);
    return teamAsc ? 'KeyboardArrowUp' : 'KeyboardArrowDown';
  }, [teamAsc]);

  const iconOption = useMemo<string>(() => {
    if (optionAsc == null) {
      return 'KeyboardArrowRight';
    }
    setTeamAsc(null);
    setStatusAsc(null);
    setMemberAsc(null);
    return optionAsc ? 'KeyboardArrowUp' : 'KeyboardArrowDown';
  }, [optionAsc]);

  const iconStatus = useMemo<string>(() => {
    if (statusAsc == null) {
      return 'KeyboardArrowRight';
    }
    setOptionAsc(null);
    setTeamAsc(null);
    setMemberAsc(null);
    return statusAsc ? 'KeyboardArrowUp' : 'KeyboardArrowDown';
  }, [statusAsc]);

  const iconMember = useMemo<string>(() => {
    if (memberAsc == null) {
      return 'KeyboardArrowRight';
    }
    setOptionAsc(null);
    setStatusAsc(null);
    setTeamAsc(null);
    return memberAsc ? 'KeyboardArrowUp' : 'KeyboardArrowDown';
  }, [memberAsc]);

  const onCloseUnregister = (): void => {
    setOpenUnregister(false);
  };

  const onCloseUnregisterAll = (): void => {
    setOpenUnregisterAll(false);
  };

  const getTeams = (): void => {
    getAllTeamsRegisteredInfos(eventId).then(setTeams);
  };

  useEffect((): void => {
    if (eventId) {
      getTeams();
    }
  }, [eventId]);

  const emails = useMemo<{ email: string }[]>(() => {
    if (teams) {
      const res = teams
        .filter((t) => !(t.registrationStatus === STATUS_ENUM.PENDING || t.registrationStatus === STATUS_ENUM.REFUSED))
        .map((t) => ({ email: t.email }));
      return res;
    }
  }, [teams]);

  const hasPending = useMemo<boolean>(() => {
    if (teams) {
      return teams.some((t) => t.registrationStatus === STATUS_ENUM.PENDING);
    }
    return false;
  }, [teams]);

  const getCanUnregisterTeamsList = (rosterIds: string[]): Promise<EventTeam[]> => {
    return getCanUnregisterTeamsListApi(eventId, rosterIds);
  };

  const handleUnregisterClick = async (rosterId: string): Promise<void> => {
    setRosterId(rosterId);
    const data = await getCanUnregisterTeamsList([rosterId]);

    if (data.length) {
      setOpenUnregister(true);
    } else {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('this_team_cannot_be_deleted'),
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
    }
  };

  const handleUnregisterAllClick = async (): Promise<void> => {
    const data = await getCanUnregisterTeamsList(teams.map((t) => t.rosterId));

    setTeamsThatCanBeUnregistered(data);

    if (data.length) {
      setOpenUnregisterAll(true);
    } else {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('register.cant_unregister_any_teams'),
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
    }
  };

  const onUnregisterTeam = async (): Promise<void> => {
    setOpenUnregister(false);
    setIsLoading(true);
    const res = await unregisterTeams({
      eventId,
      rosterIds: [rosterId],
    });
    setIsLoading(false);

    if (res.status === STATUS_ENUM.SUCCESS) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('team.team_unregister_success'),
        severity: SEVERITY_ENUM.SUCCESS,
        duration: 4000,
      });
    } else {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: ERROR_ENUM.ERROR_OCCURED,
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
    }

    setTeams(res.data);
  };

  const onUnregisterAll = async (): Promise<void> => {
    setOpenUnregisterAll(false);
    setIsLoading(true);
    const res = await unregisterTeams({
      eventId,
      rosterIds: teamsThatCanBeUnregistered,
    });
    setIsLoading(false);

    if (res.status === STATUS_ENUM.SUCCESS) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('team.teams_unregister_success'),
        severity: SEVERITY_ENUM.SUCCESS,
        duration: 4000,
      });
    } else {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: ERROR_ENUM.ERROR_OCCURED,
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
    }

    setTeams(res.data);
  };

  const getMaximumSpots = (): void => {
    getEventInfo(eventId).then((res) => setMaximumSpots(res.maximumSpots));
  };

  const getAcceptedSpots = (): void => {
    getAllTeamsAcceptedRegistered(eventId).then((res) => setAcceptedSpots(res?.length));
  };

  useEffect(() => {
    if (eventId) {
      getMaximumSpots();
      getAcceptedSpots();
    }
  }, [teams]);

  const handleTeam = (): void => {
    if (teamAsc) {
      setTeams([...teams].sort((a, b) => b.name.localeCompare(a.name)));
    } else {
      setTeams([...teams].sort((a, b) => a.name.localeCompare(b.name)));
    }
    setTeamAsc(!teamAsc);
  };

  const handleOption = (): void => {
    if (optionAsc) {
      setTeams(
        [...teams].sort((a, b) =>
          b.option
            ? b.option.name.localeCompare(a.option ? a.option.name : t('no.no_option'))
            : t('no.no_option').localeCompare(a.option ? a.option.name : t('no.no_option'))
        )
      );
    } else {
      setTeams(
        [...teams].sort((a, b) =>
          a.option
            ? a.option.name.localeCompare(b.option ? b.option.name : t('no.no_option'))
            : t('no.no_option').localeCompare(b.option ? b.option.name : t('no.no_option'))
        )
      );
    }
    setOptionAsc(!optionAsc);
  };

  const handleStatus = (): void => {
    if (statusAsc) {
      setTeams(
        [...teams].sort((a, b) =>
          b.status.localeCompare(a.status) == 0
            ? b.registrationStatus.localeCompare(a.registrationStatus)
            : b.status.localeCompare(a.status)
        )
      );
    } else {
      setTeams(
        [...teams].sort((a, b) =>
          a.status.localeCompare(b.status) == 0
            ? a.registrationStatus.localeCompare(b.registrationStatus)
            : a.status.localeCompare(b.status)
        )
      );
    }
    setStatusAsc(!statusAsc);
  };

  const handleIsMember = (): void => {
    if (memberAsc) {
      setTeams([...teams].sort((a, b) => Number(a.isMember) - Number(b.isMember)));
    } else {
      setTeams([...teams].sort((a, b) => Number(b.isMember) - Number(a.isMember)));
    }
    setMemberAsc(!memberAsc);
  };

  const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
      maxWidth: '100%',
    },
  }))(TableCell);

  const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow);

  if (teams.length < 1) {
    return <></>;
  }

  if (width < MOBILE_WIDTH) {
    return (
      <Paper className={styles.paper}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {maximumSpots ? (
                  <StyledTableCell colSpan={2}>
                    {t('register.registration_status')}:&nbsp;
                    {acceptedSpots}/{maximumSpots}&nbsp;
                    {t('accepted')}
                  </StyledTableCell>
                ) : (
                  <StyledTableCell colSpan={2}>
                    {t('register.registration_status')}:&nbsp;
                    {acceptedSpots}&nbsp;
                    {t('accepted')}
                  </StyledTableCell>
                )}
                <StyledTableCell align="center">
                  {teams.length > 0 && (
                    <IconButton
                      variant="contained"
                      icon="MoneyOff"
                      tooltip={t('register.unregister_all')}
                      onClick={() => handleUnregisterAllClick()}
                      style={{ color: '#f44336' }}
                    />
                  )}
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableHead>
              <TableRow>
                <StyledTableCell className={styles.header} onClick={handleTeam}>
                  <div>
                    {t('team.team')}
                    <Icon style={{ margin: '-5px 0 -5px -3px' }} icon={iconTeam} />
                  </div>
                </StyledTableCell>
                <StyledTableCell className={styles.header} onClick={handleStatus} align="center">
                  <div>
                    {t('status')}
                    <Icon style={{ margin: '-5px 0 -5px -3px' }} icon={iconStatus} />
                  </div>
                </StyledTableCell>
                <StyledTableCell>
                  <MailtoButton color={'white'} tooltip={t('send_email_to_all_teams_registered')} emails={emails} />
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <StyledTableRow align="center">
              {hasPending && (
                <StyledTableCell colSpan={3}>
                  <Button
                    onClick={() => {
                      goTo(ROUTES.teamsAcceptation, { id: eventId });
                    }}
                  >
                    {t('accept_teams')}
                  </Button>
                </StyledTableCell>
              )}
            </StyledTableRow>
            <TableBody>
              {isLoading ? (
                <StyledTableRow align="center">
                  <StyledTableCell colSpan={2}>{t('register.unregister_pending')}</StyledTableCell>
                  <StyledTableCell>
                    <LoadingSpinner isComponent />
                  </StyledTableCell>
                </StyledTableRow>
              ) : teams?.length > 0 ? (
                <>
                  {teams.map((team, index) => (
                    <TeamRowMobile team={team} key={index} handleUnregisterClick={handleUnregisterClick} />
                  ))}
                </>
              ) : (
                <StyledTableRow align="center">
                  <StyledTableCell colSpan={5}>{t('no.no_teams_registered')}</StyledTableCell>
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <AlertDialog
          open={openUnregister}
          onCancel={onCloseUnregister}
          onSubmit={onUnregisterTeam}
          title={t('register.are_you_sure_you_want_to_unregister_this_team')}
          description={teams.find((x) => x.rosterId === rosterId)?.name}
        />
        <AlertDialog
          open={openUnregisterAll}
          onCancel={onCloseUnregisterAll}
          onSubmit={onUnregisterAll}
          title={
            teamsThatCanBeUnregistered.length < teams.length
              ? t('register.cant_unregister_all_teams', {
                  howManyCanUnregister: teamsThatCanBeUnregistered.length,
                  totalOfTeams: teams.length,
                })
              : t('register.are_you_sure_you_want_to_unregister_all_teams')
          }
          description={teamsThatCanBeUnregistered
            .map(function (rosterId) {
              return teams.find((x) => x.rosterId === rosterId)?.name;
            })
            .join(', ')}
        />
      </Paper>
    );
  }

  return (
    <Paper className={styles.paper}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {maximumSpots ? (
                <StyledTableCell colSpan={4}>
                  {t('register.registration_status')}:&nbsp;
                  {acceptedSpots}/{maximumSpots}&nbsp;
                  {t('accepted')}
                </StyledTableCell>
              ) : (
                <StyledTableCell colSpan={4}>
                  {t('register.registration_status')}:&nbsp;
                  {acceptedSpots}&nbsp;
                  {t('accepted')}
                </StyledTableCell>
              )}
              <StyledTableCell align="center">
                {teams.length > 0 ? (
                  <IconButton
                    variant="contained"
                    icon="MoneyOff"
                    tooltip={t('register.unregister_all')}
                    onClick={() => handleUnregisterAllClick()}
                    style={{ color: '#f44336' }}
                  />
                ) : (
                  <></>
                )}
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableHead>
            <TableRow>
              <StyledTableCell className={styles.header} onClick={handleTeam}>
                <div>
                  {t('team.team')}
                  <Icon style={{ margin: '-5px 0 -5px -3px' }} icon={iconTeam} />
                </div>
              </StyledTableCell>
              <StyledTableCell className={styles.header} onClick={handleOption}>
                <div>
                  {t('option')}
                  <Icon style={{ margin: '-5px 0 -5px -3px' }} icon={iconOption} />
                </div>
              </StyledTableCell>
              <StyledTableCell className={styles.header} onClick={handleStatus} align="center">
                <div>
                  {t('status')}
                  <Icon style={{ margin: '-5px 0 -5px -3px' }} icon={iconStatus} />
                </div>
              </StyledTableCell>
              <StyledTableCell className={styles.header} onClick={handleIsMember} align="center">
                <div>
                  {t('is_member')}
                  <Icon style={{ margin: '-5px 0 -5px -3px' }} icon={iconMember} />
                </div>
              </StyledTableCell>
              <StyledTableCell>
                <MailtoButton color={'white'} tooltip={t('send_email_to_all_teams_registered')} emails={emails} />
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <StyledTableRow align="center">
            {hasPending ? (
              <StyledTableCell colSpan={5}>
                <Button
                  onClick={() => {
                    goTo(ROUTES.teamsAcceptation, { id: eventId });
                  }}
                >
                  {t('accept_teams')}
                </Button>
              </StyledTableCell>
            ) : (
              <></>
            )}
          </StyledTableRow>
          <TableBody>
            {isLoading ? (
              <StyledTableRow align="center">
                <StyledTableCell colSpan={4}>{t('register.unregister_pending')}</StyledTableCell>
                <StyledTableCell>
                  <LoadingSpinner isComponent />
                </StyledTableCell>
              </StyledTableRow>
            ) : teams?.length > 0 ? (
              <>
                {teams.map((team, index) => (
                  <TeamRow team={team} key={index} handleUnregisterClick={handleUnregisterClick} />
                ))}
              </>
            ) : (
              <StyledTableRow align="center">
                <StyledTableCell colSpan={5}>{t('no.no_teams_registered')}</StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <AlertDialog
        open={openUnregister}
        onCancel={onCloseUnregister}
        onSubmit={onUnregisterTeam}
        title={t('register.are_you_sure_you_want_to_unregister_this_team')}
        description={teams.find((x) => x.rosterId === rosterId)?.name}
      />
      <AlertDialog
        open={openUnregisterAll}
        onCancel={onCloseUnregisterAll}
        onSubmit={onUnregisterAll}
        title={
          teamsThatCanBeUnregistered.length < teams.length
            ? t('register.cant_unregister_all_teams', {
                howManyCanUnregister: teamsThatCanBeUnregistered.length,
                totalOfTeams: teams.length,
              })
            : t('register.are_you_sure_you_want_to_unregister_all_teams')
        }
        description={teamsThatCanBeUnregistered
          .map(function (rosterId) {
            return teams.find((x) => x.rosterId === rosterId)?.name;
          })
          .join(', ')}
      />
    </Paper>
  );
};
export default TeamsRegistered;
