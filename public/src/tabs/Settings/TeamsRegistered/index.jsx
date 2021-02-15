import React, { useMemo, useEffect, useState, useContext } from 'react';

import Paper from '../../../components/Custom/Paper';
import MailToButton from '../../../components/Custom/MailToButton';
import AlertDialog from '../../../components/Custom/Dialog/AlertDialog';
import IconButton from '../../../components/Custom/IconButton';
import LoadingSpinner from '../../../components/Custom/LoadingSpinner';
import Button from '../../../components/Custom/Button';
import StatusChip from './StatusChip';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import styles from './TeamsRegistered.module.css';
import { useTranslation } from 'react-i18next';
import api from '../../../actions/api';
import { unregisterTeams } from '../../../actions/api/helpers';
import { formatPrice } from '../../../utils/stringFormats';
import { SEVERITY_ENUM, STATUS_ENUM } from '../../../../common/enums';
import { ERROR_ENUM } from '../../../../common/errors';
import { Store, ACTION_ENUM } from '../../../Store';
import { useRouter } from 'next/router';
import { formatRoute } from '../../../../common/utils/stringFormat';
import { goTo, ROUTES } from '../../../actions/goTo';

export default function TeamsRegistered() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id: eventId } = router.query;
  const { dispatch } = useContext(Store);

  const [teams, setTeams] = useState([]);
  const [teamsThatCanBeUnregistered, setTeamsThatCanBeUnregistered] = useState([]);
  const [maximumSpots, setMaximumSpots] = useState();
  const [acceptedSpots, setAcceptedSpots] = useState();
  const [openUnregister, setOpenUnregister] = useState(false);
  const [openUnregisterAll, setOpenUnregisterAll] = useState(false);
  const [rosterId, setRosterId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onCloseUnregister = () => {
    setOpenUnregister(false);
  };

  const onCloseUnregisterAll = () => {
    setOpenUnregisterAll(false);
  };

  const getTeams = async () => {
    const { data } = await api(
      formatRoute('/api/entity/allTeamsRegisteredInfos', null, {
        eventId,
      })
    );
    setTeams(data);
  };

  useEffect(() => {
    getTeams();
  }, [eventId]);

  const hasPending = useMemo(() => {
    return teams.some((t) => t.registrationStatus === STATUS_ENUM.PENDING);
  }, [teams]);

  const getCanUnregisterTeamsList = async (rosterIds) => {
    const { data } = await api(
      formatRoute('/api/entity/canUnregisterTeamsList', null, {
        eventId,
        rosterIds: JSON.stringify(rosterIds),
      })
    );

    return data;
  };

  const handleUnregisterClick = async (rosterId) => {
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

  const handleUnregisterAllClick = async () => {
    const data = await getCanUnregisterTeamsList(teams.map((t) => t.rosterId));

    setTeamsThatCanBeUnregistered(data);

    if (data.length) {
      setOpenUnregisterAll(true);
    } else {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('cant_unregister_any_teams'),
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
    }
  };

  const onUnregisterTeam = async () => {
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
        message: t('team_unregister_success'),
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

  const onUnregisterAll = async () => {
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
        message: t('teams_unregister_success'),
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

  const getMaximumSpots = async () => {
    const { data } = await api(
      formatRoute('/api/entity/event', null, {
        eventId,
      })
    );
    setMaximumSpots(data.maximum_spots);
  };

  const getAcceptedSpots = async () => {
    const { data } = await api(
      formatRoute('/api/entity/allTeamsAcceptedRegistered', null, {
        eventId,
      })
    );
    setAcceptedSpots(data?.length);
  };

  useEffect(() => {
    getMaximumSpots();
    getAcceptedSpots();
  }, [teams]);

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

  return (
    <Paper className={styles.paper}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {maximumSpots ? (
                <StyledTableCell colSpan={4}>
                  {t('registration_status')}:&nbsp;
                  {acceptedSpots}/{maximumSpots}&nbsp;
                  {t('accepted')}
                </StyledTableCell>
              ) : (
                <StyledTableCell colSpan={4}>
                  {t('registration_status')}:&nbsp;
                  {acceptedSpots}&nbsp;
                  {t('accepted')}
                </StyledTableCell>
              )}
              <StyledTableCell align="center">
                {teams.length > 0 ? (
                  <IconButton
                    //color="primary"
                    variant="contained"
                    icon="MoneyOff"
                    tooltip={t('unregister_all')}
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
              <StyledTableCell>{t('team')}</StyledTableCell>
              <StyledTableCell>{t('captain')}</StyledTableCell>
              <StyledTableCell>{t('option')}</StyledTableCell>
              <StyledTableCell align="center">{t('status')}</StyledTableCell>
              <StyledTableCell align="center">{t('actions')}</StyledTableCell>
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
                <StyledTableCell colSpan={4}>{t('unregister_pending')}</StyledTableCell>
                <StyledTableCell>
                  <LoadingSpinner isComponent />
                </StyledTableCell>
              </StyledTableRow>
            ) : teams?.length > 0 ? (
              <>
                {teams.map((team, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell component="th" scope="row">
                      {team.name}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      {team.captains[0].name}&nbsp;
                      {team.captains[0].surname}
                    </StyledTableCell>
                    {team.option ? (
                      <StyledTableCell component="th" scope="row">
                        {team.option.name}&nbsp;
                        {`(${team.option.team_price === 0 ? t('free') : formatPrice(team.option.team_price)})`}
                      </StyledTableCell>
                    ) : (
                      <StyledTableCell component="th" scope="row">
                        {t('no_option')}
                      </StyledTableCell>
                    )}

                    <StyledTableCell align="center">
                      <StatusChip
                        status={team.status}
                        registrationStatus={team.registrationStatus}
                        eventId={eventId}
                        rosterId={team.rosterId}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <MailToButton emails={team.emails} color="grey" />
                      <IconButton
                        variant="contained"
                        icon="MoneyOff"
                        tooltip={t('unregister')}
                        onClick={() => handleUnregisterClick(team.rosterId)}
                        style={{ color: 'primary' }}
                      />
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </>
            ) : (
              <StyledTableRow align="center">
                <StyledTableCell colSpan={5}>{t('no_teams_registered')}</StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <AlertDialog
        open={openUnregister}
        onCancel={onCloseUnregister}
        onSubmit={onUnregisterTeam}
        title={t('are_you_sure_you_want_to_unregister_this_team')}
        description={teams.find((x) => x.rosterId === rosterId)?.name}
      />
      <AlertDialog
        open={openUnregisterAll}
        onCancel={onCloseUnregisterAll}
        onSubmit={onUnregisterAll}
        title={
          teamsThatCanBeUnregistered.length < teams.length
            ? t('cant_unregister_all_teams', {
                howManyCanUnregister: teamsThatCanBeUnregistered.length,
                totalOfTeams: teams.length,
              })
            : t('are_you_sure_you_want_to_unregister_all_teams')
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
