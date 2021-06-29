import React from 'react';

import { getInitialsFromName } from '../../../../utils/stringFormats';
import styles from './Player.module.css';
import { useTranslation } from 'react-i18next';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '../../../../components/Custom/Avatar';
import { Player as PlayerType } from '../../../../../../typescript/types';
import { goTo } from '../../../../actions/goTo';
import { ROUTES_ENUM } from '../../../../../common/enums';
import StatusChip from '../../../../components/Custom/StatusChip';

interface IProps {
  player: PlayerType & { status: string };
  index: number;
  update: () => void;
  teamId: string;
  isAdmin: boolean;
}

const PendingPlayer: React.FunctionComponent<IProps> = (props) => {
  const { player, index, teamId, isAdmin } = props;
  if (isAdmin) {
    return (
      <ListItem
        className={index % 2 === 0 ? styles.greycard : styles.card}
        onClick={() => {
          goTo(ROUTES_ENUM.teamPlayersAcceptation, { id: teamId }, { personId: player.id });
        }}
        button
      >
        <ListItemIcon>
          <Avatar photoUrl={player.photoUrl} initials={getInitialsFromName(player.name)} />
        </ListItemIcon>
        <ListItemText primary={`${player.name}`} />
        <StatusChip
          status={player.status}
          onClick={() => {
            goTo(ROUTES_ENUM.teamPlayersAcceptation, { id: teamId }, { personId: player.id });
          }}
        />
      </ListItem>
    );
  }
  return (
    <ListItem className={index % 2 === 0 ? styles.greycard : styles.card}>
      <ListItemIcon>
        <Avatar photoUrl={player.photoUrl} initials={getInitialsFromName(player.name)} />
      </ListItemIcon>
      <ListItemText primary={`${player.name}`} />
      <StatusChip status={player.status} clickable={false} />
    </ListItem>
  );
};
export default PendingPlayer;
