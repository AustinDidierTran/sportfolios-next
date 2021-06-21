import React from 'react';
import Avatar from '../Avatar';
import CustomButton from '../Button';
import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Chip from '@material-ui/core/Chip';
import styles from './BannerOrganization.module.css';
import { getMembershipName } from '../../../utils/stringFormats';
import { Entity, Member } from '../../../../../typescript/types';



interface IProps {
  basicInfos: Entity;
  onBecomeMemberButton: () => void;
  onOpenToLoggin: () => void;
  hasMemberships: boolean;
  isAuthenticated: boolean;
  adminView: boolean;
  onSwitch: () => void;
  isAdmin: boolean;
  member: Member;
}

const BannerOrganization: React.FunctionComponent<IProps> = (props) => {
  const {
    basicInfos,
    onBecomeMemberButton,
    onOpenToLoggin,
    hasMemberships,
    isAuthenticated,
    isAdmin,
    onSwitch,
    adminView,
    member,
  } = props;
  const { t } = useTranslation();

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
            <CustomButton
              onClick={isAuthenticated ? onBecomeMemberButton : onOpenToLoggin}
              className={styles.eventButton}
              disabled={!hasMemberships && isAuthenticated}
            >
              {t('become_member')}
            </CustomButton>
          </Grid>
        </Grid>
      </Grid>
      <Divider variant="middle" />
      <div className={styles.divIconButton}>
        <div>
          {isAdmin && (
            <>
              {adminView ? (
                <CustomButton
                  className={styles.view}
                  startIcon="Autorenew"
                  color="secondary"
                  variant="outlined"
                  onClick={onSwitch}
                >
                  {t('player_view')}
                </CustomButton>
              ) : (
                <CustomButton
                  className={styles.view}
                  startIcon="Autorenew"
                  color="primary"
                  variant="outlined"
                  onClick={onSwitch}
                >
                  {t('admin_view')}
                </CustomButton>
              )}
            </>
          )}
        </div>
        <div className={styles.chip}>
          {member ? (
            <Chip label={t(getMembershipName(member.memberType))} color="primary" variant="outlined" />
          ) : (
            <Chip label={t('not_member')} style={{ color: 'grey' }} variant="outlined" />
          )}
        </div>
      </div>
    </div>
  );
}
export default BannerOrganization; 