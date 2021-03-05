import React, { useMemo, useState } from 'react';

import IconButton from '../../../../components/Custom/IconButton';
import StatusChip from '../StatusChip';

import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { useRouter } from 'next/router';
import CollapseTeamsRegisteredMobile from './CollapseTeamsRegisteredMobile';

export default function TeamRow(props) {
  const router = useRouter();
  const { id: eventId } = router.query;
  const { team, handleUnregisterClick } = props;

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
    handleUnregisterClick(team.rosterId);
  };

  return (
    <>
      <StyledTableRow onClick={handleExpand}>
        <StyledTableCell component="th" scope="row">
          {team.name}
        </StyledTableCell>

        <StyledTableCell>
          <StatusChip
            status={team.status}
            registrationStatus={team.registrationStatus}
            eventId={eventId}
            rosterId={team.rosterId}
          />
        </StyledTableCell>
        <StyledTableCell align="center">
          <IconButton onClick={handleExpand} aria-expanded={expanded} icon={icon} style={{ color: 'grey' }} />
        </StyledTableCell>
      </StyledTableRow>
      <StyledTableRow style={{ margin: '0px', padding: '0px' }}>
        <StyledTableCell colSpan={5} align="center" style={{ margin: '0px', padding: '0px' }}>
          <CollapseTeamsRegisteredMobile expanded={expanded} team={team} unregister={unregister} />
        </StyledTableCell>
      </StyledTableRow>
    </>
  );
}
