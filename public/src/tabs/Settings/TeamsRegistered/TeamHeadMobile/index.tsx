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
import { COLORS } from '../../../../utils/colors';

interface IProps {
  teams: EventTeam[];
  maximumSpots: number;
  acceptedSpots: number;
  handleUnregisterAllClick: () => void;
  handleTeam: () => void;
  iconTeam: string;
  handleStatus: () => void;
  iconStatus: string;
  emails: { email: string }[];
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

const TeamHeadMobile: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const {
    teams,
    maximumSpots,
    acceptedSpots,
    handleUnregisterAllClick,
    handleTeam,
    iconTeam,
    handleStatus,
    iconStatus,
    emails,
  } = props;

  const margin = { margin: '-5px 0 -5px -3px' };

  return (
    <>
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
            {teams.length > 0 && (
              <IconButton
                variant="contained"
                icon="MoneyOff"
                tooltip={t('register.unregister_all')}
                onClick={() => handleUnregisterAllClick()}
                style={COLORS.red}
              />
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
          <StyledTableCell className={styles.header} onClick={handleStatus} align="center">
            <div>
              {t('status')}
              <Icon style={margin} icon={iconStatus} />
            </div>
          </StyledTableCell>
          <StyledTableCell>
            <MailToButton color={'white'} tooltip={t('send_email_to_all_teams_registered')} emails={emails} />
          </StyledTableCell>
        </TableRow>
      </TableHead>
    </>
  );
};
export default TeamHeadMobile;
