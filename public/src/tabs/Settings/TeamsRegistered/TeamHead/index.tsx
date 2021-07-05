import React from 'react';

import IconButton from '../../../../components/Custom/IconButton';
import Icon from '../../../../components/Custom/Icon';
import MailToButton from '../../../../components/Custom/MailToButton';

import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { useTranslation } from 'react-i18next';
import { EventTeam } from '../../../../../../typescript/types';
import styles from './TeamHead.module.css';
import Chip from '../../../../components/Custom/Chip';
import { PILL_TYPE_ENUM } from '../../../../../common/enums';

interface IProps {
  teams: EventTeam[];
  maximumSpots: number;
  acceptedSpots: number;
  handleUnregisterAllClick: () => void;
  handleTeam: () => void;
  iconTeam: string;
  handleOption: () => void;
  iconOption: string;
  handleStatus: () => void;
  iconStatus: string;
  handleIsMember: () => void;
  iconMember: string;
  emails: { email: string }[];
  chipClick: (type: string) => void;
  chips: PILL_TYPE_ENUM[];
}

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

const StyledTableCellWhite = withStyles(() => ({
  body: {
    fontSize: 14,
    maxWidth: '100%',
  },
}))(TableCell);

const TeamHead: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const {
    teams,
    maximumSpots,
    acceptedSpots,
    handleUnregisterAllClick,
    handleTeam,
    iconTeam,
    handleOption,
    iconOption,
    handleStatus,
    iconStatus,
    handleIsMember,
    iconMember,
    emails,
    chipClick,
    chips,
  } = props;

  const CHIPS_MAP = [
    {
      label: 'payment.not_paid',
      type: PILL_TYPE_ENUM.NOT_PAID,
      onClick: (): void => chipClick(PILL_TYPE_ENUM.NOT_PAID),
    },
    { label: 'not_member', type: PILL_TYPE_ENUM.NOT_MEMBER, onClick: (): void => chipClick(PILL_TYPE_ENUM.NOT_MEMBER) },
  ];

  const getVariant = (type: PILL_TYPE_ENUM): string => {
    if (chips.includes(type)) {
      return 'default';
    }
    return 'outlined';
  };

  const margin = { margin: '-5px 0 -5px -3px' };

  return (
    <>
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
            {teams.length > 0 ? (
              <IconButton
                variant="contained"
                icon="MoneyOff"
                tooltip={t('register.unregister_all')}
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
          <StyledTableCell className={styles.header} onClick={handleTeam}>
            <div>
              {t('team.team')}
              <Icon style={margin} icon={iconTeam} />
            </div>
          </StyledTableCell>
          <StyledTableCell className={styles.header} onClick={handleOption}>
            <div>
              {t('option')}
              <Icon style={margin} icon={iconOption} />
            </div>
          </StyledTableCell>
          <StyledTableCell className={styles.header} onClick={handleStatus} align="center">
            <div>
              {t('status')}
              <Icon style={margin} icon={iconStatus} />
            </div>
          </StyledTableCell>
          <StyledTableCell className={styles.header} onClick={handleIsMember} align="center">
            <div>
              {t('is_member')}
              <Icon style={margin} icon={iconMember} />
            </div>
          </StyledTableCell>
          <StyledTableCell>
            <MailToButton color={'white'} tooltip={t('send_email_to_all_teams_registered')} emails={emails} />
          </StyledTableCell>
        </TableRow>
      </TableHead>
      <TableHead>
        <TableRow>
          <StyledTableCellWhite colSpan={5} className={styles.chips}>
            {CHIPS_MAP.map((c: any, index: number) => (
              <Chip
                key={index}
                onClick={c.onClick}
                label={t(c.label)}
                variant={getVariant(c.type)}
                className={styles.chip}
                clickable
              />
            ))}
          </StyledTableCellWhite>
        </TableRow>
      </TableHead>
    </>
  );
};
export default TeamHead;
