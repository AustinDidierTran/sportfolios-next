import React from 'react';

import { useTranslation } from 'react-i18next';
import { ROSTER_ROLE_ENUM } from '../../../../common/enums';
import Tooltip from '@material-ui/core/Tooltip';
import Icon from '../Icon';
import styles from './RosterDisplay.module.css';
import Typography from '@material-ui/core/Typography';
export default function RosterDisplay(props) {
  const { t } = useTranslation();
  const { teams } = props;

  const getIconFromRole = (role) => {
    switch (role) {
      case ROSTER_ROLE_ENUM.COACH:
        return 'SportsWhistle';
      case ROSTER_ROLE_ENUM.CAPTAIN:
        return 'Stars';
      case ROSTER_ROLE_ENUM.ASSISTANT_CAPTAIN:
        return 'TextFormat';
      default:
        return 'Person';
    }
  };

  return (
    <>
      <Typography className={styles.title} variant="h4">
        {t('rosters')}
      </Typography>
      <div className={styles.root}>
        {teams.map((team, index) => (
          <div className={styles.roster} key={index}>
            {team.roster.map((player, index) => (
              <div className={styles.rootPlayer} key={index}>
                <div className={styles.position}>
                  {player.role === ROSTER_ROLE_ENUM.PLAYER ? (
                    <div></div>
                  ) : (
                    <Tooltip
                      title={t(player.role === ROSTER_ROLE_ENUM.ASSISTANT_CAPTAIN ? 'assistant_captain' : player.role)}
                    >
                      <div>
                        <Icon icon={getIconFromRole(player.role)} />
                      </div>
                    </Tooltip>
                  )}
                  <div className={styles.playerName}>
                    <Typography variant="h6">{player.name}</Typography>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
