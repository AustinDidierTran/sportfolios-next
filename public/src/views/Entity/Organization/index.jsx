import React, { useState, useEffect, useMemo } from 'react';

import IgContainer from '../../../components/Custom/IgContainer';
import HeaderHome from '../../../components/Custom/HeaderHome';
import { formatPageTitle } from '../../../utils/stringFormats';
import { ENTITIES_ROLE_ENUM, GLOBAL_ENUM, STATUS_ENUM, TABS_ENUM } from '../../../../common/enums';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import loadable from '@loadable/component';
import { formatRoute } from '../../../../common/utils/stringFormat';
import api from '../../../actions/api';

const Home = loadable(() => import('./home'));
const Events = loadable(() => import('./events'));
const Memberships = loadable(() => import('./memberships'));
const About = loadable(() => import('./about'));
const Edit = loadable(() => import('./edit'));

export default function Organization(props) {
  const { t } = useTranslation();
  const { basicInfos: basicInfosProps } = props;
  const router = useRouter();
  const { id, tab } = router.query;
  const [basicInfos, setBasicInfos] = useState(basicInfosProps);

  useEffect(() => {
    document.title = formatPageTitle(basicInfos.name);
  }, [basicInfos]);

  const tabs = useMemo(() => {
    let res = [
      { component: Home, value: TABS_ENUM.HOME, label: t('home'), icon: 'Home' },
      { component: Events, value: TABS_ENUM.EVENTS, label: t('event.events'), icon: 'Event' },
      { component: Memberships, value: TABS_ENUM.MEMBERSHIPS, label: t('member.memberships'), icon: 'Group' },
      { component: About, value: TABS_ENUM.ABOUT, label: t('about'), icon: 'Info' },
    ];
    if (basicInfos.role <= ENTITIES_ROLE_ENUM.EDITOR) {
      res.push({ component: Edit, value: TABS_ENUM.EDIT, label: t('settings'), icon: 'Settings' });
    }
    return res;
  }, []);

  const getRole = async () => {
    const res = await api(formatRoute('/api/entity/role', null, { entityId: id }));
    if (res.status === STATUS_ENUM.SUCCESS_STRING) {
      let newInfos = basicInfos;
      newInfos.role = res.data;
      setBasicInfos(newInfos);
    }
  };

  useEffect(() => {
    getRole();
  }, [basicInfosProps]);

  const OpenTab = useMemo(() => {
    return tabs.find((t) => t.value === tab).component;
  }, [tab]);

  return (
    <>
      <HeaderHome basicInfos={basicInfos} navTabs={tabs} type={GLOBAL_ENUM.ORGANIZATION} />
      <IgContainer>{OpenTab ? <OpenTab basicInfos={basicInfos} /> : <Home basicInfos={basicInfos} />}</IgContainer>
    </>
  );
}
