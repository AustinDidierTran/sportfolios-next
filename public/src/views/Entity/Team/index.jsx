import React, { useState, useEffect, useMemo, useContext } from 'react';

import Tab from '../../../components/Custom/Tab';
import Tabs from '../../../components/Custom/Tabs';
import Paper from '../../../components/Custom/Paper';
import IgContainer from '../../../components/Custom/IgContainer';
import { goTo } from '../../../actions/goTo';
import { formatPageTitle } from '../../../utils/stringFormats';
import { ENTITIES_ROLE_ENUM, TABS_ENUM, ROUTES_ENUM, STATUS_ENUM } from '../../../../common/enums';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useTranslation } from 'react-i18next';
import api from '../../../actions/api';
import { formatRoute } from '../../../utils/stringFormats';
import { Store } from '../../../Store';

const About = dynamic(() => import('../../../tabs/About'));
const Settings = dynamic(() => import('../../../tabs/Settings'));

export default function Team(props) {
  const { t } = useTranslation();
  const { basicInfos: basicInfosProps } = props;
  const router = useRouter();
  const { tab } = router.query;
  const {
    state: { id },
  } = useContext(Store);
  const [basicInfos, setBasicInfos] = useState(basicInfosProps);

  useEffect(() => {
    document.title = formatPageTitle(basicInfos.name);
  }, [basicInfos.name]);

  useEffect(() => {
    if (id) {
      getRole();
    }
  }, [id]);

  const [isAdmin, setIsAdmin] = useState(false);

  const tabs = useMemo(() => {
    let res = [{ component: About, value: TABS_ENUM.ABOUT, label: t('about'), icon: 'Info' }];
    if (isAdmin) {
      return [
        ...res,
        {
          component: Settings,
          value: TABS_ENUM.SETTINGS,
          label: t('settings'),
          icon: 'Settings',
        },
      ];
    }
    return res;
  }, [isAdmin]);

  const index = useMemo(() => {
    const res = tabs.findIndex((s) => s.value === tab);
    if (res === -1) {
      return 0;
    }
    return res;
  }, [tab, tabs]);

  const getRole = async () => {
    const res = await api(formatRoute('/api/entity/role', null, { entityId: id }));
    if (res.status === STATUS_ENUM.SUCCESS_STRING) {
      let newInfos = basicInfos;
      newInfos.role = res.data;
      setBasicInfos(newInfos);
      setIsAdmin(res.data === ENTITIES_ROLE_ENUM.EDITOR || res.data === ENTITIES_ROLE_ENUM.ADMIN);
    }
  };

  const onClick = (s) => {
    goTo(ROUTES_ENUM.entity, { id }, { tab: s.value });
  };

  const OpenTab = useMemo(() => {
    const res = tabs[index];
    if (res) {
      return res.component;
    }
    return About;
  }, [index, tabs]);

  return (
    <IgContainer>
      <Paper>
        <Tabs value={index} indicatorColor="primary" textColor="primary">
          {tabs.map((t, index) => (
            <Tab key={index} onClick={() => onClick(t)} icon={t.icon} label={t.label} />
          ))}
        </Tabs>
      </Paper>
      <div>
        <OpenTab basicInfos={basicInfos} />
      </div>
    </IgContainer>
  );
}
