import React, { useMemo, useState, useEffect } from 'react';

import Tab from '../../../components/Custom/Tab';
import Tabs from '../../../components/Custom/Tabs';
import IgContainer from '../../../components/Custom/IgContainer';
import Paper from '../../../components/Custom/Paper';
import { formatPageTitle } from '../../../utils/stringFormats';
import { ENTITIES_ROLE_ENUM, ROUTES_ENUM, STATUS_ENUM, TABS_ENUM } from '../../../../common/enums';
import { useRouter } from 'next/router';
import api from '../../../actions/api';
import { formatRoute } from '../../../../common/utils/stringFormat';
import loadable from '@loadable/component';
import { useTranslation } from 'react-i18next';
import { goTo } from '../../../actions/goTo';

const About = loadable(() => import('../../../tabs/About'));
const EditPersonInfos = loadable(() => import('../../../tabs/EditPersonInfos'));

export default function Person(props) {
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
    let res = [{ component: About, value: TABS_ENUM.ABOUT, label: t('about'), icon: 'Info' }];
    if (isAdmin) {
      return [
        ...res,
        {
          component: EditPersonInfos,
          value: TABS_ENUM.EDIT_PERSON_INFOS,
          label: t('edit.edit_infos'),
          icon: 'Edit',
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
        <OpenTab basicInfos={basicInfos} {...props} />
      </div>
    </IgContainer>
  );
}
