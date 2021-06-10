import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { ROSTER_ROLE_ENUM } from '../../../../common/enums';
import { getIconFromRole, getInitialsFromName } from '../../../utils/stringFormats';

import Tooltip from '@material-ui/core/Tooltip';
import Icon from '../Icon';
import styles from './Roster.module.css';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Avatar from '../Avatar';
import { Player } from '../../../../../typescript/types';

interface IProps {
  roster?: Player[];
}

const Roster: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { roster } = props;
  const [teamRoster, setTeamRoster] = useState<Player[]>([]);

  useEffect(() => {
    if (roster) {
      setTeamRoster(roster);
    }
  }, [props]);

  return (
    <>
      <Typography className={styles.title} variant="h4">
        {t('roster')}
      </Typography>
      {teamRoster.map((player: Player, index: number) => (
        <ListItem key={player.id} className={index % 2 === 0 ? styles.greycard : styles.card}>
          <ListItemIcon>
            <Avatar photoUrl={player.photoUrl} initials={getInitialsFromName(player.name)} />
          </ListItemIcon>
          <div className={styles.position}>
            {player.role === ROSTER_ROLE_ENUM.PLAYER ? (
              <></>
            ) : (
              <Tooltip
                title={t<string>(
                  player.role === ROSTER_ROLE_ENUM.ASSISTANT_CAPTAIN ? 'assistant_captain' : player.role
                )}
              >
                <div>
                  <Icon icon={getIconFromRole(player.role)} />
                </div>
              </Tooltip>
            )}
          </div>
          <ListItemText primary={player.name} />
        </ListItem>
      ))}
    </>
  );
};

export default Roster;
