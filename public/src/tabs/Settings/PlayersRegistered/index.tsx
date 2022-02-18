import React, { useCallback, useMemo, useEffect, useState, useContext } from 'react';

import LoadingSpinner from '../../../components/Custom/LoadingSpinner';
import IconButton from '../../../components/Custom/IconButton';
import Icon from '../../../components/Custom/Icon';
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
import { SEVERITY_ENUM, REQUEST_STATUS_ENUM } from '../../../../common/enums';
import { ERROR_ENUM } from '../../../../common/errors';
import { Store, ACTION_ENUM } from '../../../Store';
import PlayersRow from './PlayersRow';
import PlayersRowMobile from './PlayersRowMobile';
import { useWindowSize } from '../../../hooks/window';
import { MOBILE_WIDTH } from '../../../../common/constants';
import { COLORS } from '../../../utils/colors';
import { unregisterPeople } from '../../../actions/service/entity/post';
import {
  getAllPeopleRegisteredInfos,
  getAllPlayersAcceptedRegistered,
  getEventInfo,
} from '../../../actions/service/entity/get';

const PlayersRegistered: React.FunctionComponent<Record<string, unknown>> = () => {
  const { t } = useTranslation();
  const {
    dispatch,
    state: { id: eventId },
  } = useContext(Store);
  const [width] = useWindowSize();

  const [players, setPlayers] = useState([]);
  const [personId, setPersonId] = useState('');
  const [maximumSpots, setMaximumSpots] = useState<number>(0);
  const [acceptedSpots, setAcceptedSpots] = useState();
  const [openUnregister, setOpenUnregister] = useState(false);
  const [openUnregisterAll, setOpenUnregisterAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [playerAsc, setPlayerAsc] = useState(null);
  const [optionAsc, setOptionAsc] = useState(null);
  const [statusAsc, setStatusAsc] = useState(null);
  const [memberAsc, setMemberAsc] = useState(null);

  const iconPlayer = useMemo(() => {
    if (playerAsc == null) {
      return 'KeyboardArrowRight';
    }
    setOptionAsc(null);
    setStatusAsc(null);
    setMemberAsc(null);
    return playerAsc ? 'KeyboardArrowUp' : 'KeyboardArrowDown';
  }, [playerAsc]);

  const iconOption = useMemo(() => {
    if (optionAsc == null) {
      return 'KeyboardArrowRight';
    }
    setPlayerAsc(null);
    setStatusAsc(null);
    setMemberAsc(null);
    return optionAsc ? 'KeyboardArrowUp' : 'KeyboardArrowDown';
  }, [optionAsc]);

  const iconStatus = useMemo(() => {
    if (statusAsc == null) {
      return 'KeyboardArrowRight';
    }
    setOptionAsc(null);
    setPlayerAsc(null);
    setMemberAsc(null);
    return statusAsc ? 'KeyboardArrowUp' : 'KeyboardArrowDown';
  }, [statusAsc]);

  const iconMember = useMemo(() => {
    if (memberAsc == null) {
      return 'KeyboardArrowRight';
    }
    setOptionAsc(null);
    setStatusAsc(null);
    setPlayerAsc(null);
    return memberAsc ? 'KeyboardArrowUp' : 'KeyboardArrowDown';
  }, [memberAsc]);

  const onCloseUnregister = () => {
    setOpenUnregister(false);
  };

  const onCloseUnregisterAll = () => {
    setOpenUnregisterAll(false);
  };

  const getPlayers = useCallback(async () => {
    getAllPeopleRegisteredInfos(eventId).then(setPlayers);
  }, [eventId]);

  useEffect(() => {
    if (eventId) {
      getPlayers();
    }
  }, [eventId]);

  const handleUnregisterClick = (personId: string) => {
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
      people: [{ personId: person.personId, stripePrice: person.option.individualStripePriceId }],
    });

    if (res.status === REQUEST_STATUS_ENUM.SUCCESS) {
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
    getPlayers().then(() => {
      setIsLoading(false);
    });
  };

  const onUnregisterAll = async () => {
    setOpenUnregisterAll(false);
    setIsLoading(true);
    const res = await unregisterPeople({
      eventId,
      people: players.map((p) => ({ personId: p.personId, stripePrice: p.option.individualStripePriceId })),
    });
    setIsLoading(false);

    if (res.status === REQUEST_STATUS_ENUM.SUCCESS) {
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
    getEventInfo(eventId).then((data) => {
      setMaximumSpots(data.maximumSpots);
    });
  };

  const getAcceptedSpots = () => {
    getAllPlayersAcceptedRegistered(eventId).then((data) => {
      setAcceptedSpots(data?.length);
    });
  };

  useEffect(() => {
    getMaximumSpots();
    getAcceptedSpots();
  }, [players, maximumSpots]);

  const handlePlayer = async () => {
    if (playerAsc) {
      setPlayers([...players].sort((a, b) => b.name.localeCompare(a.name)));
    } else {
      setPlayers([...players].sort((a, b) => a.name.localeCompare(b.name)));
    }
    setPlayerAsc(!playerAsc);
  };

  const handleOption = async () => {
    if (optionAsc) {
      setPlayers(
        [...players].sort((a, b) =>
          b.option
            ? b.option.name.localeCompare(a.option ? a.option.name : t('no.no_option'))
            : t('no.no_option').localeCompare(a.option ? a.option.name : t('no.no_option'))
        )
      );
    } else {
      setPlayers(
        [...players].sort((a, b) =>
          a.option
            ? a.option.name.localeCompare(b.option ? b.option.name : t('no.no_option'))
            : t('no.no_option').localeCompare(b.option ? b.option.name : t('no.no_option'))
        )
      );
    }
    setOptionAsc(!optionAsc);
  };

  const handleStatus = async () => {
    if (statusAsc) {
      setPlayers(
        [...players].sort((a, b) =>
          b.status.localeCompare(a.status) == 0
            ? b.registrationStatus.localeCompare(a.registrationStatus)
            : b.status.localeCompare(a.status)
        )
      );
    } else {
      setPlayers(
        [...players].sort((a, b) =>
          a.status.localeCompare(b.status) == 0
            ? a.registrationStatus.localeCompare(b.registrationStatus)
            : a.status.localeCompare(b.status)
        )
      );
    }
    setStatusAsc(!statusAsc);
  };

  const handleIsMember = async () => {
    if (memberAsc) {
      setPlayers([...players].sort((a, b) => Number(a.isMember) - Number(b.isMember)));
    } else {
      setPlayers([...players].sort((a, b) => Number(b.isMember) - Number(a.isMember)));
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
                  {players.length > 0 && (
                    <IconButton
                      variant="contained"
                      icon="MoneyOff"
                      tooltip={t('register.unregister_all')}
                      onClick={handleUnregisterAllClick}
                      style={{ color: COLORS.red }}
                    />
                  )}
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableHead>
              <TableRow>
                <StyledTableCell className={styles.header} onClick={handlePlayer}>
                  <div>
                    {t('player')}
                    <Icon style={{ margin: '-5px 0 -5px -3px' }} icon={iconPlayer} />
                  </div>
                </StyledTableCell>
                <StyledTableCell className={styles.header} onClick={handleStatus} align="center">
                  <div>
                    {t('status')}
                    <Icon style={{ margin: '-5px 0 -5px -3px' }} icon={iconStatus} />
                  </div>
                </StyledTableCell>
                <StyledTableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <StyledTableRow>
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
                <StyledTableRow>
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
                {players.length > 0 ? (
                  <IconButton
                    variant="contained"
                    icon="MoneyOff"
                    tooltip={t('register.unregister_all')}
                    onClick={handleUnregisterAllClick}
                    style={{ color: COLORS.red }}
                  />
                ) : null}
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableHead>
            <TableRow>
              <StyledTableCell className={styles.header} onClick={handlePlayer}>
                <div>
                  {t('player')}
                  <Icon style={{ margin: '-5px 0 -5px -3px' }} icon={iconPlayer} />
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
              <StyledTableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <StyledTableRow>
                <StyledTableCell colSpan={4}>{t('register.unregister_pending')}</StyledTableCell>
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
              <StyledTableRow>
                <StyledTableCell colSpan={5}>{t('no.no_players_registered')}</StyledTableCell>
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
};

export default PlayersRegistered;
