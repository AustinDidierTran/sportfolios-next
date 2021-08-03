import React, { useMemo, useState, useContext } from 'react';

import IconButton from '../../../../components/Custom/IconButton';
import StatusChip from '../../../../components/Custom/StatusChip';

import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import CollapseTeamsRegisteredMobile from './CollapseTeamsRegisteredMobile';
import { Store } from '../../../../Store';
import { ROUTES_ENUM, STATUS_ENUM } from '../../../../../common/enums';
import { goTo } from '../../../../actions/goTo';
import { EventTeam } from '../../../../../../typescript/types';
import { COLORS } from '../../../../utils/colors';

interface IProps {
  team: EventTeam;
  handleUnregisterClick: (rosterId: string) => void;
}

const TeamRowMobile: React.FunctionComponent<IProps> = (props) => {
  const {
    state: { id: eventId },
  } = useContext(Store);
  const { team, handleUnregisterClick } = props;

  const [expanded, setExpanded] = useState<boolean>(false);

  const icon = useMemo((): string => (expanded ? 'KeyboardArrowUp' : 'KeyboardArrowDown'), [expanded]);

  const handleExpand = (): void => {
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

  const unregister = (): void => {
    handleUnregisterClick(team.rosterId);
  };

  return (
    <>
      <StyledTableRow onClick={handleExpand}>
        <StyledTableCell component="th" scope="row">
          {team.name}
        </StyledTableCell>

        <StyledTableCell>
          {team.registrationStatus === STATUS_ENUM.REFUSED || team.registrationStatus === STATUS_ENUM.PENDING ? (
            <StatusChip
              status={team.registrationStatus}
              onClick={() => {
                goTo(ROUTES_ENUM.teamsAcceptation, { id: eventId }, { rosterId: team.rosterId });
              }}
            />
          ) : (
            <StatusChip status={team.status} />
          )}
        </StyledTableCell>
        <StyledTableCell align="center">
          <IconButton onClick={handleExpand} aria-expanded={expanded} icon={icon} style={{ color: COLORS.grey }} />
        </StyledTableCell>
      </StyledTableRow>
      <StyledTableRow style={{ margin: '0px', padding: '0px' }}>
        <StyledTableCell colSpan={5} align="center" style={{ margin: '0px', padding: '0px' }}>
          <CollapseTeamsRegisteredMobile expanded={expanded} team={team} unregister={unregister} />
        </StyledTableCell>
      </StyledTableRow>
    </>
  );
};
export default TeamRowMobile;
