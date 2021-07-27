import React, { useContext, useMemo, useState } from 'react';
import styles from './RosterCard.module.css';
import Icon from '../../../components/Custom/Icon';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import { makeStyles } from '@material-ui/core/styles';

import Players from './Players';
import Typography from '@material-ui/core/Typography';
import { ROSTER_ROLE_ENUM, SEVERITY_ENUM, REQUEST_STATUS_ENUM } from '../../../../common/enums';
import api from '../../../actions/api';
import { ACTION_ENUM, Store } from '../../../Store';
import { useTranslation } from 'react-i18next';
import { formatRoute } from '../../../utils/stringFormats';
import { COLORS } from '../../../utils/colors';

const isEven = (n) => {
  return n % 2 == 0;
};

const useStyles = makeStyles((theme) => ({
  evenGreen: {
    backgroundColor: theme.palette.primary.light,
    color: COLORS.white,
  },
  oddGreen: { backgroundColor: theme.palette.primary.main, color: COLORS.white },
  even: { backgroundColor: theme.palette.shadesOfGrey.light },
  odd: { backgroundColor: theme.palette.shadesOfGrey.veryLight },
}));

export default function RosterCard(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);
  const {
    isEventAdmin,
    roster,
    whiteList,
    index = 0,
    update = () => {},
    expanded: expandedProps,
    withMyPersonsQuickAdd,
    editableRoster: editableRosterProp,
    editableRole: editableRoleProp,
  } = props;
  const { name, players, rosterId, role } = roster;

  const [expanded, setExpanded] = useState(expandedProps);

  const onExpand = () => {
    const exp = !expanded;
    setExpanded(exp);
  };

  const deletePlayerFromRoster = async (id) => {
    const res = await api(
      formatRoute('/api/entity/deletePlayerFromRoster', null, {
        id,
      }),
      {
        method: 'DELETE',
      }
    );

    if (res.status === REQUEST_STATUS_ENUM.FORBIDDEN) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('cant_delete_paid_player'),
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
      return;
    }
    if (res.status === REQUEST_STATUS_ENUM.METHOD_NOT_ALLOWED) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('team.team_player_role_error'),
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
      return;
    }
    if (res.status === REQUEST_STATUS_ENUM.ERROR) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('an_error_has_occured'),
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
      return;
    }
    return true;
  };

  const addPlayerToRoster = async (player) => {
    const res = await api(`/api/entity/addPlayerToRoster`, {
      method: 'POST',
      body: JSON.stringify({
        ...player,
        rosterId,
      }),
    });
    if (res.status === REQUEST_STATUS_ENUM.SUCCESS) {
      update();
    } else {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('an_error_has_occured'),
        severity: SEVERITY_ENUM.ERROR,
      });
    }
  };

  const updatePlayerRole = async (playerId, role) => {
    const res = await api(`/api/entity/rosterRole`, {
      method: 'PUT',
      body: JSON.stringify({
        rosterId,
        playerId,
        role,
      }),
    });

    if (res.status === REQUEST_STATUS_ENUM.SUCCESS) {
      update();
    } else if (res.status === REQUEST_STATUS_ENUM.FORBIDDEN) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('team.team_player_role_error'),
        severity: SEVERITY_ENUM.ERROR,
      });
    } else {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('an_error_has_occured'),
        severity: SEVERITY_ENUM.ERROR,
      });
    }
  };
  function remainsOtherPlayerWithRole(teamPlayerId) {
    return roster.players.some((p) => p.id !== teamPlayerId && p.role !== ROSTER_ROLE_ENUM.PLAYER);
  }
  const onDelete = async (id) => {
    if (!remainsOtherPlayerWithRole(id)) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('team.team_player_role_error'),
        severity: SEVERITY_ENUM.ERROR,
      });
      return;
    }
    const refresh = await deletePlayerFromRoster(id);
    if (refresh) {
      update();
    }
  };

  const isTeamEditor = useMemo(() => role == ROSTER_ROLE_ENUM.CAPTAIN || role == ROSTER_ROLE_ENUM.COACH, [role]);
  const editableRoster = useMemo(
    () => editableRosterProp || isTeamEditor || isEventAdmin,
    [editableRosterProp, isTeamEditor, isEventAdmin]
  );
  const editableRole = useMemo(
    () => editableRoleProp || isTeamEditor || isEventAdmin,
    [editableRoleProp, isTeamEditor, isEventAdmin]
  );

  const greenBackground = isEventAdmin || role != ROSTER_ROLE_ENUM.VIEWER;
  const style = useMemo(() => {
    if (greenBackground && isEven(index)) {
      return classes.evenGreen;
    } else if (greenBackground && !isEven(index)) {
      return classes.oddGreen;
    } else if (!greenBackground && isEven(index)) {
      return classes.even;
    } else {
      return classes.odd;
    }
  }, [greenBackground, index]);

  return (
    <Accordion expanded={expanded} onChange={onExpand}>
      <AccordionSummary className={style} expandIcon={<Icon icon="ExpandMore" />}>
        <Typography style={{ margin: '4px' }}>{name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Players
          className={styles.players}
          withPlayersInfos={isEventAdmin}
          editableRoster={editableRoster}
          editableRole={editableRole}
          whiteList={whiteList}
          players={players}
          rosterId={rosterId}
          onDelete={onDelete}
          onAdd={addPlayerToRoster}
          onRoleUpdate={updatePlayerRole}
          withMyPersonsQuickAdd={withMyPersonsQuickAdd}
        />
      </AccordionDetails>
    </Accordion>
  );
}
