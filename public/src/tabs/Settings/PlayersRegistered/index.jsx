import React, { useEffect, useState, useContext } from 'react';

import LoadingSpinner from '../../../components/Custom/LoadingSpinner';
import IconButton from '../../../components/Custom/IconButton';
import Paper from '../../../components/Custom/Paper';
import AlertDialog from '../../../components/Custom/Dialog/AlertDialog';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import styles from './PlayersRegistered.module.css';
import { useTranslation } from 'react-i18next';
import api from '../../../actions/api';
import { unregisterPeople } from '../../../actions/api/helpers';
import { SEVERITY_ENUM, STATUS_ENUM } from '../../../../common/enums';
import { ERROR_ENUM } from '../../../../common/errors';
import { Store, ACTION_ENUM } from '../../../Store';
import { useRouter } from 'next/router';
import { formatRoute } from '../../../../common/utils/stringFormat';
import PlayersRow from './PlayersRow';
import PlayersRowMobile from './PlayersRowMobile';

export default function PlayersRegistered() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id: eventId } = router.query;
  const { dispatch } = useContext(Store);

  const [players, setPlayers] = useState([]);
  const [personId, setPersonId] = useState('');
  const [maximumSpots, setMaximumSpots] = useState();
  const [acceptedSpots, setAcceptedSpots] = useState();
  const [openUnregister, setOpenUnregister] = useState(false);
  const [openUnregisterAll, setOpenUnregisterAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onCloseUnregister = () => {
    setOpenUnregister(false);
  };

  const onCloseUnregisterAll = () => {
    setOpenUnregisterAll(false);
  };

  const getPlayers = async () => {
    const { data } = await api(
      formatRoute('/api/entity/allPeopleRegisteredInfos', null, {
        eventId,
      })
    );
    setPlayers(data);
  };

  useEffect(() => {
    getPlayers();
  }, [eventId]);

  const handleUnregisterClick = (personId) => {
    setPersonId(personId);
    setOpenUnregister(true);
  };

  const handleUnregisterAllClick = () => {
    setOpenUnregisterAll(true);
  };

  const onUnregisterPerson = async () => {
    setOpenUnregister(false);
    setIsLoading(true);
    const person = players.find((x) => x.personId === personId);
    const res = await unregisterPeople({
      eventId,
      people: [{ personId: person.personId, stripePrice: person.option.individual_stripe_price_id }],
    });
    setIsLoading(false);

    if (res.status === STATUS_ENUM.SUCCESS) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('player_unregister_success'),
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

    setPlayers(res.data);
  };

  const onUnregisterAll = async () => {
    setOpenUnregisterAll(false);
    setIsLoading(true);
    const res = await unregisterPeople({
      eventId,
      people: players.map((p) => ({ personId: p.personId, stripePrice: p.option.individual_stripe_price_id })),
    });
    setIsLoading(false);

    if (res.status === STATUS_ENUM.SUCCESS) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('players_unregister_success'),
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

    setPlayers(res.data);
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
      formatRoute('/api/entity/allPlayersAcceptedRegistered', null, {
        eventId,
      })
    );
    setAcceptedSpots(data?.length);
  };

  useEffect(() => {
    getMaximumSpots();
    getAcceptedSpots();
  }, [players]);

  const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
      maxWidth: 55,
    },
  }))(TableCell);

  const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow);

  if (players.length < 1) {
    return <></>;
  }

  if (window.innerWidth < 600) {
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
                  {players.length > 0 && (
                    <IconButton
                      variant="contained"
                      icon="MoneyOff"
                      tooltip={t('register.unregister_all')}
                      onClick={handleUnregisterAllClick}
                      style={{ color: '#f44336' }}
                    />
                  )}
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableHead>
              <TableRow>
                <StyledTableCell>{t('player')}</StyledTableCell>
                <StyledTableCell align="center">{t('status')}</StyledTableCell>
                <StyledTableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <StyledTableRow align="center">
                  <StyledTableCell colSpan={2}>{t('register.unregister_pending')}</StyledTableCell>
                  <StyledTableCell>
                    <LoadingSpinner isComponent />
                  </StyledTableCell>
                </StyledTableRow>
              ) : players?.length > 0 ? (
                <>
                  {players.map((player, index) => (
                    <PlayersRowMobile player={player} key={index} handleUnregisterClick={handleUnregisterClick} />
                  ))}
                </>
              ) : (
                <StyledTableRow align="center">
                  <StyledTableCell colSpan={3}>{t('no.no_players_registered')}</StyledTableCell>
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <AlertDialog
          open={openUnregister}
          onCancel={onCloseUnregister}
          onSubmit={onUnregisterPerson}
          title={t('register.are_you_sure_you_want_to_unregister_this_player')}
          description={players.find((x) => x.personId === personId)?.completeName}
        />
        <AlertDialog
          open={openUnregisterAll}
          onCancel={onCloseUnregisterAll}
          onSubmit={onUnregisterAll}
          title={t('register.are_you_sure_you_want_to_unregister_all_players')}
          description={players.map((p) => p.completeName).join(', ')}
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
                <StyledTableCell colSpan={3}>
                  {t('register.registration_status')}:&nbsp;
                  {acceptedSpots}/{maximumSpots}&nbsp;
                  {t('accepted')}
                </StyledTableCell>
              ) : (
                <StyledTableCell colSpan={3}>
                  {t('register.registration_status')}:&nbsp;
                  {acceptedSpots}&nbsp;
                  {t('accepted')}
                </StyledTableCell>
              )}
              <StyledTableCell align="center">
                {players.length > 0 ? (
                  <IconButton
                    variant="contained"
                    icon="MoneyOff"
                    tooltip={t('register.unregister_all')}
                    onClick={handleUnregisterAllClick}
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
              <StyledTableCell>{t('player')}</StyledTableCell>
              <StyledTableCell>{t('option')}</StyledTableCell>
              <StyledTableCell align="center">{t('status')}</StyledTableCell>
              <StyledTableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <StyledTableRow align="center">
                <StyledTableCell colSpan={3}>{t('register.unregister_pending')}</StyledTableCell>
                <StyledTableCell>
                  <LoadingSpinner isComponent />
                </StyledTableCell>
              </StyledTableRow>
            ) : players?.length > 0 ? (
              <>
                {players.map((player, index) => (
                  <PlayersRow player={player} key={index} handleUnregisterClick={handleUnregisterClick} />
                ))}
              </>
            ) : (
              <StyledTableRow align="center">
                <StyledTableCell colSpan={4}>{t('no.no_players_registered')}</StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <AlertDialog
        open={openUnregister}
        onCancel={onCloseUnregister}
        onSubmit={onUnregisterPerson}
        title={t('register.are_you_sure_you_want_to_unregister_this_player')}
        description={players.find((x) => x.personId === personId)?.completeName}
      />
      <AlertDialog
        open={openUnregisterAll}
        onCancel={onCloseUnregisterAll}
        onSubmit={onUnregisterAll}
        title={t('register.are_you_sure_you_want_to_unregister_all_players')}
        description={players.map((p) => p.completeName).join(', ')}
      />
    </Paper>
  );
}
