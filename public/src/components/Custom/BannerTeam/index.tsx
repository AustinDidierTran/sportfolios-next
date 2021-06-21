import React, { useState, useContext, useEffect } from 'react';
import Avatar from '../Avatar';
import Button from '../Button';
import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import styles from './BannerTeam.module.css';
import { Entity } from '../../../../../typescript/types';
import { getMyTeamPlayers } from '../../../actions/service/entity';
import { Store } from '../../../Store';

interface IProps {
  basicInfos: Entity;
  onJoinTeamButton: () => void;
  onOpenToLoggin: () => void;
  isAuthenticated: boolean;
  onSwitch: () => void;
  isAdmin: boolean;
  adminView: boolean;
}

const BannerTeam: React.FunctionComponent<IProps> = (props) => {
  const { basicInfos, onJoinTeamButton, onOpenToLoggin, isAuthenticated, isAdmin, onSwitch, adminView } = props;
  const { t } = useTranslation();

  const {
    state: { id: teamId },
  } = useContext(Store);

  useEffect(() => {
    if (teamId) {
      IsTeamPlayer();
    }
  }, [teamId]);

  const [isTeamPlayer, setIsTeamPlayer] = useState<boolean>(true);

  const IsTeamPlayer = async () => {
    const res = await getMyTeamPlayers(teamId);
    const 
    setIsTeamPlayer(res);
  };

  return (
    <div className={styles.root}>
      <Grid container>
        <Grid item lg={4} md={4} sm={12} xs={12}>
          <Avatar photoUrl={basicInfos.photoUrl} size="lg" className={styles.avatar}></Avatar>
        </Grid>
        <Grid item lg={8} md={8} sm={12} xs={12} container>
          <Grid container className={styles.gridText}>
            <Grid container item className={styles.title}>
              {basicInfos.name}
            </Grid>
          </Grid>
          <Grid container className={styles.gridButton}>
            {isTeamPlayer ? null : (
              <Button onClick={isAuthenticated ? onJoinTeamButton : onOpenToLoggin} className={styles.eventButton}>
                {t('join_team')}
              </Button>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Divider variant="middle" />
      <div className={styles.divIconButton}>
        <div>
          {isAdmin && (
            <>
              {adminView ? (
                <Button
                  className={styles.view}
                  startIcon="Autorenew"
                  color="secondary"
                  variant="outlined"
                  onClick={onSwitch}
                >
                  {t('player_view')}
                </Button>
              ) : (
                <Button
                  className={styles.view}
                  startIcon="Autorenew"
                  color="primary"
                  variant="outlined"
                  onClick={onSwitch}
                >
                  {t('admin_view')}
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default BannerTeam;
