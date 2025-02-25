import React, { useMemo, useState, useContext } from 'react';

import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Chip from '@material-ui/core/Chip';

import { useTranslation } from 'react-i18next';
import { formatPrice } from '../../../../utils/stringFormats';
import CollapsePlayersRegistered from './CollapsePlayersRegistered';
import StatusChip from '../StatusChip';
import IconButton from '../../../../components/Custom/IconButton';
import { Store } from '../../../../Store';
import { COLORS } from '../../../../utils/colors';

export default function PlayersRow(props) {
  const { t } = useTranslation();
  const {
    state: { id: eventId },
  } = useContext(Store);
  const { player, handleUnregisterClick } = props;

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
        <StyledTableCell component="th" scope="row" onClick={handleExpand}>
          {player.completeName}
        </StyledTableCell>
        {player.option ? (
          <StyledTableCell component="th" scope="row" onClick={handleExpand}>
            {player.option.name}&nbsp;
            {`(${player.option.individualPrice === 0 ? t('free') : formatPrice(player.option.individualPrice)})`}
          </StyledTableCell>
        ) : (
          <StyledTableCell component="th" scope="row" onClick={handleExpand}>
            {t('no.no_option')}
          </StyledTableCell>
        )}
        <StyledTableCell>
          <StatusChip
            status={player.status}
            registrationStatus={player.registrationStatus}
            eventId={eventId}
            personId={player.personId}
          />
        </StyledTableCell>
        <StyledTableCell style={{ padding: '25px' }}>
          {player.isMember ? (
            <Chip label={t('yes')} color="primary" variant="outlined" />
          ) : (
            <Chip label={t('no.no')} color="secondary" variant="outlined" />
          )}
        </StyledTableCell>
        <StyledTableCell align="center" onClick={handleExpand}>
          <IconButton aria-expanded={expanded} icon={icon} style={{ color: COLORS.grey }} />
        </StyledTableCell>
      </StyledTableRow>
      <StyledTableRow style={{ margin: '0px', padding: '0px' }}>
        <StyledTableCell colSpan={4} align="center" style={{ margin: '0px', padding: '0px' }}>
          <CollapsePlayersRegistered expanded={expanded} player={player} unregister={unregister} />
        </StyledTableCell>
      </StyledTableRow>
    </>
  );
}
