import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { FORM_DIALOG_TYPE_ENUM } from '../../../../../common/enums';
import FormDialog from '../../FormDialog';
import styles from '../HeaderHome.module.css';
import CustomIcon from '../../Icon';
import { goTo, ROUTES } from '../../../../actions/goTo';
import Typography from '@material-ui/core/Typography';
import dynamic from 'next/dynamic';
import AlertDialog from '../../Dialog/AlertDialog';
import { Store } from '../../../../Store';
import { useWindowSize } from '../../../../hooks/window';
import { MOBILE_WIDTH } from '../../../../../common/constants';
import { useRouter } from 'next/router';
import { Entity, NavTabs } from '../../../../../../typescript/types';
import { COLORS } from '../../../../utils/colors';

const BannerTeam = dynamic(() => import('../../BannerTeam'));

interface IProps {
  basicInfos: Entity;
  navTabs: NavTabs[];
  index: number;
  isAdmin: boolean;
  onSwitch: () => void;
  adminView: boolean;
}

const HeaderTeam: React.FunctionComponent<IProps> = (props) => {
  const { basicInfos, navTabs, index, isAdmin, onSwitch, adminView } = props;
  const { t } = useTranslation();
  const [width] = useWindowSize();
  const router = useRouter();

  const {
    state: { isAuthenticated, id },
  } = useContext(Store);

  const [open, setOpen] = useState<boolean>(false);
  const [openToLogin, setOpenToLogin] = useState<boolean>(false);

  const goToLogin = (): void => {
    const redirectUrl = encodeURIComponent(router.asPath);
    goTo(ROUTES.login, null, { redirectUrl });
  };

  const onOpenToLoggin = (): void => {
    setOpenToLogin(true);
  };

  const onCloseToLoggin = (): void => {
    setOpenToLogin(false);
  };

  return (
    <Paper elevation={1} className={styles.paper}>
      <BannerTeam
        basicInfos={basicInfos}
        onJoinTeamButton={() => {
          setOpen(true);
        }}
        onOpenToLoggin={onOpenToLoggin}
        onSwitch={onSwitch}
        isAdmin={isAdmin}
        adminView={adminView}
        isAuthenticated={isAuthenticated}
      />
      <div className={styles.navigation}>
        <Tabs
          value={index}
          TabIndicatorProps={{
            style: { backgroundColor: COLORS.white },
          }}
          style={{
            color: COLORS.white,
            backgroundColor: COLORS.turquoise,
            minHeight: 0,
            borderRadius: width > MOBILE_WIDTH ? '7px' : '0px',
          }}
          variant="fullWidth"
          scrollButtons="off"
        >
          {navTabs.map((s: NavTabs, index: number) => (
            <Tab
              key={index}
              onClick={() => {
                goTo(ROUTES.entity, { id }, { tab: s.value });
              }}
              label={
                <div className={styles.div}>
                  <CustomIcon icon={s.icon} />
                  {width > MOBILE_WIDTH && (
                    <Typography variant="body2" className={styles.typo}>
                      {s.label}
                    </Typography>
                  )}
                </div>
              }
              style={{
                borderRightColor: COLORS.white,
                borderRightStyle: navTabs.length === index + 1 ? 'none' : 'solid',
                borderRightWidth: 1,
                minHeight: 0,
                minWidth: 0,
                overflow: 'auto',
                fontSize: 0.6,
              }}
            />
          ))}
        </Tabs>
        <FormDialog
          type={FORM_DIALOG_TYPE_ENUM.JOIN_TEAM}
          items={{
            open,
            onClose: () => {
              setOpen(false);
            },
            onOpen: () => {
              setOpen(true);
            },
          }}
        />
        <AlertDialog
          open={openToLogin}
          title={t('you.you_need_to_be_connected_to_join_team', { team: basicInfos.name })}
          description={t('click_to_go_to_login')}
          onCancel={onCloseToLoggin}
          onSubmit={goToLogin}
        />
      </div>
    </Paper>
  );
};
export default HeaderTeam;
