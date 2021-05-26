import React, { useMemo, useState, useContext } from 'react';

import IconButton from '../../../../components/Custom/IconButton';
import StatusChip from '../StatusChip';

import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Chip from '@material-ui/core/Chip';

import { useTranslation } from 'react-i18next';
import { formatPrice } from '../../../../utils/stringFormats';
import CollapseTeamsRegistered from './CollapseTeamsRegistered';
import { Store } from '../../../../Store';

export default function TeamRow(props) {
  const { t } = useTranslation();
  const {
    state: { id: eventId },
  } = useContext(Store);
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
      <StyledTableRow>
        <StyledTableCell component="th" scope="row" onClick={handleExpand}>
          {team.name}
        </StyledTableCell>
        {team.option ? (
          <StyledTableCell component="th" scope="row" onClick={handleExpand}>
            {team.option.name}&nbsp;
            {`(${team.option.team_price === 0 ? t('free') : formatPrice(team.option.team_price)})`}
          </StyledTableCell>
        ) : (
          <StyledTableCell component="th" scope="row" onClick={handleExpand}>
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
        <StyledTableCell style={{ padding: '25px' }}>
          {team.isMember ? (
            <Chip label={t('yes')} color="primary" variant="outlined" />
          ) : (
            <Chip label={t('no')} color="secondary" variant="outlined" />
          )}
        </StyledTableCell>
        <StyledTableCell align="center" onClick={handleExpand}>
          <IconButton aria-expanded={expanded} icon={icon} style={{ color: 'grey' }} />
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
