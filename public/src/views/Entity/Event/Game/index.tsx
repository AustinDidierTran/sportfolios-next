import Typography from '@material-ui/core/Typography';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CustomIcon from '../../../../components/Custom/Icon';
import { goTo, ROUTES } from '../../../../actions/goTo';

const AdminSettings = dynamic(() => import('./tabs/admin/Settings'));
const AdminTickets = dynamic(() => import('./tabs/admin/Tickets'));
const ViewerAbout = dynamic(() => import('./tabs/viewer/About'));
const ViewerTickets = dynamic(() => import('./tabs/viewer/Tickets'));

import moment from 'moment';
import { NextSeo } from 'next-seo';
import React, { useEffect, useMemo, useState } from 'react';
import { CLIENT_BASE_URL } from '../../../../../../conf';
import IgContainer from '../../../../components/Custom/IgContainer';
import styles from './game.module.css';
import { COLORS } from '../../../../utils/colors';
import { ENTITIES_ROLE_ENUM, TABS_ENUM } from '../../../../../common/enums';
import { useTranslation } from 'react-i18next';
import Divider from '@material-ui/core/Divider';
import { getRole as getRoleApi } from '../../../../actions/service/entity/get';
import CustomButton from '../../../../components/Custom/Button';

export interface IGameProps {
  id: string;
  name: string;
  description: string;
  photoUrl: string;
  startDate: string;
}

const Game: React.FunctionComponent<IGameProps> = (props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { mode, tab } = router.query;

  const [role, setRole] = useState<ENTITIES_ROLE_ENUM>(ENTITIES_ROLE_ENUM.VIEWER);
  const { id, name, description, photoUrl, startDate } = props;
  const viewerTabs = useMemo(
    () => [
      {
        value: TABS_ENUM.ABOUT,
        label: t('information'),
        icon: 'Info',
        component: ViewerAbout,
      },
      {
        value: TABS_ENUM.TICKETS,
        label: t('tickets'),
        icon: 'ConfirmationNumber',
        component: ViewerTickets,
      },
    ],
    []
  );

  const adminTabs = useMemo(
    () => [
      {
        value: TABS_ENUM.SETTINGS,
        label: t('settings'),
        icon: 'Settings',
        component: AdminSettings,
      },
      {
        value: TABS_ENUM.ADMIN_TICKETS,
        label: t('tickets'),
        icon: 'ConfirmationNumber',
        component: AdminTickets,
      },
    ],
    []
  );

  const tabs = useMemo((): any[] => (mode === 'admin' ? adminTabs : viewerTabs), [mode, viewerTabs, adminTabs]);

  const tabIndex = useMemo(
    (): number =>
      Math.max(
        tabs.findIndex((t) => t.value === tab),
        0
      ),
    [tab]
  );

  useEffect((): void => {
    if (id) {
      getRoleApi(id).then((res) => {
        setRole(Number(res.data));
        if (![ENTITIES_ROLE_ENUM.ADMIN, ENTITIES_ROLE_ENUM.EDITOR].includes(Number(res.data))) {
          goTo(ROUTES.entity, { id }, { tab: viewerTabs[0].value });
        }
      });
    }
  }, [id]);

  const OpenTab = useMemo(() => {
    if (mode === 'admin') {
      return adminTabs.find((t) => t.value === tab).component;
    }
    return viewerTabs.find((t) => t.value === tab)?.component || viewerTabs[0].component;
  }, [tab]);

  return (
    <>
      <NextSeo
        title={name}
        description={description}
        canonical={CLIENT_BASE_URL}
        openGraph={{
          type: 'website',
          url: `${CLIENT_BASE_URL}/${id}`,
          title: name,
          description,
          images: [{ url: photoUrl }],
          site_name: 'Sportfolios',
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content:
              'Sportfolios.app, Sport, Organization, Athlete, Coach, Schedule, Registration, Results, Statistics, Coaching, Information, Management',
          },
          { name: 'apple-mobile-web-app-capable', content: 'yes' },
        ]}
        facebook={{ appId: '346677216672687' }}
        twitter={{
          site: '@sportfoliosapp',
          cardType: 'summary_large_image',
        }}
      />
      <Paper className={styles.topContainer}>
        <div>
          <img src={photoUrl} className={styles.bannerImg} />
          <div className={styles.rootInfo}>
            <Paper className={styles.date}>
              <Typography variant="h3">{moment.parseZone(startDate || '0').format('DD')}</Typography>
            </Paper>
            <div>
              <Typography variant="h3">{name}</Typography>
              <span>{moment(startDate).format('LLLL')}</span>
            </div>
          </div>
          <Divider />
          <div className={styles.buttonRow}>
            {[ENTITIES_ROLE_ENUM.ADMIN, ENTITIES_ROLE_ENUM.EDITOR].includes(role) ? (
              mode === 'admin' ? (
                <CustomButton
                  startIcon="Autorenew"
                  variant="outlined"
                  onClick={() => goTo(ROUTES.entity, { id }, { tab: viewerTabs[0].value })}
                >
                  {t('player_view')}
                </CustomButton>
              ) : (
                <CustomButton
                  startIcon="Autorenew"
                  variant="outlined"
                  onClick={() => goTo(ROUTES.entity, { id }, { mode: 'admin', tab: adminTabs[0].value })}
                >
                  {t('admin_view')}
                </CustomButton>
              )
            ) : (
              <></>
            )}
            <div style={{ flex: 1 }} />
            <CustomButton
              size="small"
              variant="contained"
              startIcon="ConfirmationNumber"
              onClick={() => goTo(ROUTES.entity, { id }, { tab: TABS_ENUM.ABOUT })}
            >
              {t('event.buy_ticket')}
            </CustomButton>
          </div>
          <Tabs
            value={tabIndex}
            TabIndicatorProps={{
              style: { backgroundColor: COLORS.white },
            }}
            className={styles.tabs}
            centered
          >
            {tabs.map((t, index) => (
              <Tab
                key={index}
                label={
                  <div className={styles.tabDiv}>
                    <CustomIcon icon={t.icon} />
                    <Typography variant="body2" className={styles.tabText}>
                      {t.label}
                    </Typography>
                  </div>
                }
                onClick={() => {
                  goTo(ROUTES.entity, { id }, { tab: t.value, mode });
                }}
              />
            ))}
          </Tabs>
        </div>
      </Paper>
      <IgContainer>
        <OpenTab {...props} />
      </IgContainer>
    </>
  );
};

export default Game;
