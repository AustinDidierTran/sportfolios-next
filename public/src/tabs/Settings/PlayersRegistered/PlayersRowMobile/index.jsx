import React, { useMemo, useState, useContext } from 'react';

import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import CollapsePlayersRegisteredMobile from './CollapsePlayersRegisteredMobile';
import Status from '../StatusChip';
import IconButton from '../../../../components/Custom/IconButton';
import { Store } from '../../../../Store';
import { COLORS } from '../../../../utils/colors';

export default function PlayersRowMobile(props) {
  const { player, handleUnregisterClick } = props;
  const {
    state: { id: eventId },
  } = useContext(Store);

  const [expanded, setExpanded] = useState(false);

  const icon = useMemo(() => (expanded ? 'KeyboardArrowUp' : 'KeyboardArrowDown'), [expanded]);

  const handleExpand = () => {
    setExpanded(!expanded);
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

  const unregister = () => {
    handleUnregisterClick(player.personId);
  };
  return (
    <>
      <StyledTableRow>
        <StyledTableCell component="th" scope="row">
          {player.completeName}
        </StyledTableCell>

        <StyledTableCell>
          <Status
            status={player.status}
            registrationStatus={player.registrationStatus}
            eventId={eventId}
            personId={player.personId}
          />
        </StyledTableCell>
        <StyledTableCell align="center">
          <IconButton onClick={handleExpand} aria-expanded={expanded} icon={icon} style={{ color: COLORS.grey }} />
        </StyledTableCell>
      </StyledTableRow>
      <StyledTableRow style={{ margin: '0px', padding: '0px' }}>
        <StyledTableCell colSpan={4} align="center" style={{ margin: '0px', padding: '0px' }}>
          <CollapsePlayersRegisteredMobile expanded={expanded} player={player} unregister={unregister} />
        </StyledTableCell>
      </StyledTableRow>
    </>
  );
}
