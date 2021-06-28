import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { FORM_DIALOG_TYPE_ENUM, TABS_ENUM } from '../../../../../common/enums';
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
import { Entity, Member } from '../../../../../../typescript/types';
import { getRecentMember, getHasMemberships } from '../../../../actions/service/entity/get';

const BannerOrganization = dynamic(() => import('../../BannerOrganization'));

interface IProps {
  basicInfos: Entity;
  navTabs: INavTabs[];
  index: string;
  isAdmin: boolean;
  onSwitch: () => void;
  adminView: boolean;
}

interface INavTabs {
  component: React.ComponentType<any>;
  value: typeof TABS_ENUM;
  label: string;
  icon: string;
}

const HeaderOrganization: React.FunctionComponent<IProps> = (props) => {
  const { basicInfos, navTabs, index, isAdmin, onSwitch, adminView } = props;
  const { t } = useTranslation();
  const [width] = useWindowSize();
  const router = useRouter();

  const {
    state: { userInfo, isAuthenticated, id },
  } = useContext(Store);

  const [openBecomeMember, setOpenBecomeMember] = useState<boolean>(false);
  const [openToLogin, setOpenToLogin] = useState<boolean>(false);

  const [hasMemberships, setHasMemberships] = useState<boolean>(false);
  const [member, setMember] = useState<Member>(null);

  useEffect((): void => {
    if (id && userInfo) {
      getMemberships();
    }
  }, [id, userInfo]);

  const getMemberships = async (): Promise<void> => {
    getHasMemberships(id).then(setHasMemberships);
    getRecentMember(userInfo?.primaryPerson?.personId, id).then(setMember);
  };

  const goToLogin = (): void => {
    const redirectUrl = encodeURIComponent(router.asPath);
    goTo(ROUTES.login, null, { redirectUrl });
  };

  const onOpenBecomeMember = (): void => {
    setOpenBecomeMember(true);
  };
  const onCloseBecomeMember = (): void => {
    setOpenBecomeMember(false);
  };

  const onOpenToLoggin = (): void => {
    setOpenToLogin(true);
  };

  const onCloseToLoggin = (): void => {
    setOpenToLogin(false);
  };
  const update = (): void => {};

  return (
    <Paper elevation={1} className={styles.paper}>
      <BannerOrganization
        basicInfos={basicInfos}
        onBecomeMemberButton={onOpenBecomeMember}
        onOpenToLoggin={onOpenToLoggin}
        onSwitch={onSwitch}
        isAdmin={isAdmin}
        adminView={adminView}
        hasMemberships={hasMemberships}
        member={member}
        isAuthenticated={isAuthenticated}
      />
      <div className={styles.navigation}>
        <Tabs
          value={index}
          TabIndicatorProps={{
            style: { backgroundColor: 'white' },
          }}
          style={{
            color: 'white',
            backgroundColor: '#18B393',
            minHeight: 0,
            borderRadius: width > MOBILE_WIDTH ? '7px' : '0px',
          }}
          variant="fullWidth"
          scrollButtons="off"
        >
          {navTabs.map((s, index) => (
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
                borderRightColor: 'white',
                borderRightStyle: navTabs.length === index + 1 ? 'none' : 'solid',
                borderRightWidth: 1,
                minHeight: 0,
                minWidth: 0,
                overflow: 'auto',
              }}
            />
          ))}
        </Tabs>
        <FormDialog
          type={FORM_DIALOG_TYPE_ENUM.BECOME_MEMBER}
          items={{
            open: openBecomeMember,
            onClose: onCloseBecomeMember,
            onOpen: () => {},
            update,
          }}
        />
        <AlertDialog
          open={openToLogin}
          title={t('you.you_need_to_be_connected_to_become_member', { organization: basicInfos.name })}
          description={t('click_to_go_to_login')}
          onCancel={onCloseToLoggin}
          onSubmit={goToLogin}
        />
      </div>
    </Paper>
  );
};
export default HeaderOrganization;
