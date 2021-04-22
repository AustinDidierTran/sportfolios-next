import React, { useState, useEffect, useMemo } from 'react';

import IgContainer from '../../../components/Custom/IgContainer';
import { formatPageTitle } from '../../../utils/stringFormats';
import { ENTITIES_ROLE_ENUM, GLOBAL_ENUM, STATUS_ENUM, TABS_ENUM } from '../../../../common/enums';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { formatRoute } from '../../../../common/utils/stringFormat';
import api from '../../../actions/api';

const HeaderHome = dynamic(() => import('../../../components/Custom/HeaderHome'));
const Home = dynamic(() => import('../../../tabs/Home'));
const Events = dynamic(() => import('../../../tabs/Events'));
const Memberships = dynamic(() => import('../../../tabs/Memberships'));
const Settings = dynamic(() => import('../../../tabs/Settings'));

export default function Organization(props) {
  const { t } = useTranslation();
  const { basicInfos: basicInfosProps } = props;
  const router = useRouter();
  const { id, tab } = router.query;
  const [basicInfos, setBasicInfos] = useState(basicInfosProps);

  useEffect(() => {
    document.title = formatPageTitle(basicInfos.name);
  }, [basicInfos.name]);

  useEffect(() => {
    getRole();
  }, []);

  const [isAdmin, setIsAdmin] = useState(false);

  const tabs = useMemo(() => {
    let res = [
      { component: Home, value: TABS_ENUM.HOME, label: t('home'), icon: 'Home' },
      { component: Events, value: TABS_ENUM.EVENTS, label: t('event.events'), icon: 'Event' },
      { component: Memberships, value: TABS_ENUM.MEMBERSHIPS, label: t('member.memberships'), icon: 'Group' },
    ];
    if (isAdmin) {
      return [...res, { component: Settings, value: TABS_ENUM.SETTINGS, label: t('settings'), icon: 'Settings' }];
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

  const OpenTab = useMemo(() => {
    const res = tabs[index];
    if (res) {
      return res.component;
    }
    return Home;
  }, [index, tabs]);

  return (
    <>
      <HeaderHome
        basicInfos={basicInfos}
        isAdmin={isAdmin}
        index={index}
        navTabs={tabs}
        type={GLOBAL_ENUM.ORGANIZATION}
      />
      <IgContainer>
        <div>
          <OpenTab basicInfos={basicInfos} />
        </div>
      </IgContainer>
    </>
  );
}
