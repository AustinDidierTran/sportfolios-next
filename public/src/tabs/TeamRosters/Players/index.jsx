import React from 'react';

import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import Tooltip from '@material-ui/core/Tooltip';
import { getIconFromRole } from '../../../utils/stringFormats';
import styles from './Players.module.css';
import { ROSTER_ROLE_ENUM } from '../../../../common/enums';
import { useTranslation } from 'react-i18next';
import Icon from '../../../components/Custom/Icon';

export default function Players(props) {
  const { players } = props;
  const { t } = useTranslation();

  return (
    <List>
      {players.map((player, index) => (
        <div key={player.id} className={index % 2 === 0 ? styles.card : styles.greycard}>
          <div className={styles.player}>
            <div className={styles.position}>
              {player.role === ROSTER_ROLE_ENUM.PLAYER ? (
                <></>
              ) : (
                <Tooltip
                  title={t(player.role === ROSTER_ROLE_ENUM.ASSISTANT_CAPTAIN ? 'assistant_captain' : player.role)}
                >
                  <div>
                    <Icon icon={getIconFromRole(player.role)} />
                  </div>
                </Tooltip>
              )}
            </div>
            <div className={styles.name}>
              <Typography>{player.name}</Typography>
            </div>
          </div>
        </div>
      ))}
    </List>
  );
}
