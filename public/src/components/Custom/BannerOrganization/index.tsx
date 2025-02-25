import React, { useContext, useMemo } from 'react';
import Avatar from '../Avatar';
import CustomButton from '../Button';
import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Chip from '@material-ui/core/Chip';
import styles from './BannerOrganization.module.css';
import { getMembershipName } from '../../../utils/stringFormats';
import { Entity } from '../../../../../typescript/types';
import Chat from '@material-ui/icons/Chat';
import { COLORS } from '../../../utils/colors';
import { createConversation } from '../../../actions/service/messaging';
import { Store } from '../../../Store';
import { goTo, ROUTES } from '../../../actions/goTo';
import CheckCirleIcon from '@material-ui/icons/CheckCircle';
import Typography from '@material-ui/core/Typography';

interface IProps {
  basicInfos: Entity;
  onBecomeMemberButton: () => void;
  onOpenToLoggin: () => void;
  hasMemberships: boolean;
  isAuthenticated: boolean;
  adminView: boolean;
  onSwitch: () => void;
  isAdmin: boolean;
  member: number;
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
  const {
    state: { userInfo: userInfo },
  } = useContext(Store);

  const handleMessage = () => {
    if (!userInfo || !userInfo.primaryPerson) {
      goTo(ROUTES.login);
    }
    const participantId = [basicInfos.id];
    createConversation(participantId, userInfo?.primaryPerson.id).then((newConversationId) => {
      goTo(ROUTES.conversation, { convoId: newConversationId }, { recipientId: userInfo?.primaryPerson.id });
    });
  };

  const membersAmount = useMemo(() => {
    if (basicInfos.numberOfMembers?.count > 1) {
      return t('number_of_members', { amountOfMembers: basicInfos.numberOfMembers?.count });
    }
    return t('number_of_member', { amountOfMembers: basicInfos.numberOfMembers?.count });
  }, [basicInfos.numberOfMembers?.count]);

  return (
    <div className={styles.root}>
      <Grid container>
        <Grid item lg={4} md={4} sm={12} xs={12}>
          <Avatar photoUrl={basicInfos.photoUrl} size="lg" className={styles.avatar} />
        </Grid>
        <Grid item lg={8} md={8} sm={12} xs={12} container>
          <Grid container className={styles.gridText}>
            <Typography className={styles.title}>
              {basicInfos.name}
              {basicInfos.verifiedAt ? <CheckCirleIcon className={styles.verified} /> : <></>}
            </Typography>
          </Grid>
          <Grid container className={styles.gridButton}>
            <CustomButton
              onClick={isAuthenticated ? onBecomeMemberButton : onOpenToLoggin}
              className={styles.eventButton}
              disabled={!hasMemberships && isAuthenticated}
            >
              {t('become_member')}
            </CustomButton>
            <CustomButton className={styles.chatButton} onClick={handleMessage}>
              <Chat className={styles.chat} />
            </CustomButton>
          </Grid>
          <Grid container className={styles.gridText}>
            <Grid container item className={styles.followers}>
              {membersAmount}
            </Grid>
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
            <Chip label={getMembershipName(member)} color="primary" variant="outlined" />
          ) : (
            <Chip label={t('not_member')} style={{ color: COLORS.grey }} variant="outlined" />
          )}
        </div>
      </div>
    </div>
  );
};
export default BannerOrganization;
