import React, { useMemo, useState } from 'react';

import IconButton from '../../../../components/Custom/IconButton';
import StatusChip from '../StatusChip';

import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { useTranslation } from 'react-i18next';
import { formatPrice } from '../../../../utils/stringFormats';
import { useRouter } from 'next/router';
import CollapseTeamsRegistered from './CollapseTeamsRegistered';

export default function TeamRow(props) {
  const { t } = useTranslation();
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
        {team.option ? (
          <StyledTableCell component="th" scope="row">
            {team.option.name}&nbsp;
            {`(${team.option.team_price === 0 ? t('free') : formatPrice(team.option.team_price)})`}
          </StyledTableCell>
        ) : (
          <StyledTableCell component="th" scope="row">
            {t('no.no_option')}
          </StyledTableCell>
        )}

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
        <StyledTableCell colSpan={4} align="center" style={{ margin: '0px', padding: '0px' }}>
          <CollapseTeamsRegistered expanded={expanded} team={team} unregister={unregister} />
        </StyledTableCell>
      </StyledTableRow>
    </>
  );
}
